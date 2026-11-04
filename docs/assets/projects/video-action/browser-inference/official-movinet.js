// Official TensorFlow Model Garden MoViNet A1/A2 float32 streaming adapter.
// Unlike litert-community's A0 model, these checkpoints expose a named, mixed
// Float32/Int32 state dictionary, with 68 (A1) or 74 (A2) I/O tensors.
// Never infer state order from indices: match exact model metadata names.
export const OFFICIAL_MODELS=Object.freeze({
  a1:{label:'MoViNet-A1 Streaming',size:172,
    bytes:44470672,sha256:'14986eb3380635b9b86c1a32cb87d1fde7dfd134153c68cef69eb3bce34f8810',
    expectedInputs:68,expectedOutputs:68,k600Top1:76.45},
  a2:{label:'MoViNet-A2 Streaming',size:224,
    bytes:52326436,sha256:'f0bc1fd78b4546a3d6b1fd2ad4b89e9658ad86a2c1a7020efedb3a10205bc707',
    expectedInputs:74,expectedOutputs:74,k600Top1:78.40}
});
export const MODEL_REPO='multimodal-vision-ai/mvai-video-action-compare-models';
export function asShape(d){
 const raw=d?.shape??d?.dims??d?.dimensions??d?.shapeSignature;
 return raw?Array.from(raw,Number):null;
}
export function validateStreamingContract(inputMetadata,outputMetadata,variant){
 const expected=OFFICIAL_MODELS[variant];
 if(!expected)throw Error('Unknown official model: '+variant);
 if(inputMetadata.length!==expected.expectedInputs||outputMetadata.length!==expected.expectedOutputs)
   throw Error('Official '+variant+' I/O count changed: '+inputMetadata.length+'/'+outputMetadata.length);
 const inputs=inputMetadata.map((d,i)=>({i,name:d.name,type:d.dataType??d.dtype??d.type,shape:asShape(d)}));
 const outputs=outputMetadata.map((d,i)=>({i,name:d.name,type:d.dataType??d.dtype??d.type,shape:asShape(d)}));
 const inName=new Set(inputs.map(d=>d.name)),outNames=new Set(outputs.map(d=>d.name));
 if(inputs.some(d=>!d.name||!['float32','int32'].includes(d.type)||!d.shape||d.shape.some(n=>!Number.isInteger(n)||n<1)))
   throw Error('Unsupported official model input metadata or shape');
 if(inName.size!==inputs.length||outNames.size!==outputs.length)throw Error('Duplicate tensor names');
 const image=inputs.find(x=>x.name==='image'),logits=outputs.find(x=>x.name==='logits');
 if(!image||image.type!=='float32'||JSON.stringify(image.shape)!==JSON.stringify([1,1,expected.size,expected.size,3]))
   throw Error('Expected NTHWC image '+expected.size+'x'+expected.size);
 if(!logits||logits.type!=='float32'||JSON.stringify(logits.shape)!=='[1,600]')
   throw Error('Expected 600-class logits');
 for(const input of inputs){
   if(input.name==='image')continue;
   const output=outputs.find(d=>d.name===input.name);
   if(!output||output.type!==input.type||JSON.stringify(output.shape)!==JSON.stringify(input.shape))
     throw Error('Missing/mismatched streaming state output '+input.name);
 }
 if(outputs.length!==inputs.length||outputs.some(d=>d.name!=='logits'&&!inName.has(d.name)))
   throw Error('Unsupported output tensor contract');
 return {variant,image,logits,inputs,outputs};
}
export function makeRGBFrameFromRGBA(rgba,size){
 if(rgba.length!==size*size*4)throw Error('Unexpected RGBA data length');
 const pixels=new Float32Array(size*size*3);
 for(let i=0;i<size*size;i++){
   pixels[i*3]=rgba[i*4]/255;
   pixels[i*3+1]=rgba[i*4+1]/255;
   pixels[i*3+2]=rgba[i*4+2]/255;
 }
 return pixels;
}
export async function runStreamingBatch({api,model,contract,frames,onFrame,isCancelled}){
 const current=new Map();
 for(const input of contract.inputs){
   if(input.name==='image')continue;
   const size=input.shape.reduce((x,y)=>x*y,1);
   if(size>4000000)throw Error('Unexpected large state tensor');
   current.set(input.name,input.type==='int32'?new Int32Array(size):new Float32Array(size));
 }
 let finalLogits=null;const frameLogits=[];
 for(let step=0;step<frames.length;step++){
   if(isCancelled?.())throw Error('用户取消');
   const inputTensors=[];
   let outTensors=null;
   try{
     for(const input of contract.inputs){
       const data=input.name==='image'?frames[step]:current.get(input.name);
       if(!data)throw Error('Missing state input '+input.name);
       inputTensors.push(new api.Tensor(data,input.shape));
     }
     const outputs=await model.run(inputTensors);
     outTensors=Array.from(outputs);
     if(outTensors.length!==contract.outputs.length)throw Error('Unexpected output count');
     const values=await Promise.all(outTensors.map(x=>x.data()));
     for(const [i,desc] of contract.outputs.entries()){
       const data=values[i];
       if(desc.name==='logits'){
         if(data.length!==600)throw Error('Unexpected logits size');
         finalLogits=Float32Array.from(data);
         if(!finalLogits.every(Number.isFinite))throw Error('Invalid logits at step '+step);
       }else{
         const StateArray=desc.type==='int32'?Int32Array:Float32Array;
         current.set(desc.name,StateArray.from(data));
       }
     }
     const logitsCopy=Float32Array.from(finalLogits);
     frameLogits.push(logitsCopy);
     onFrame?.({step:step+1,steps:frames.length,logits:logitsCopy});
   }finally{
     for(const x of inputTensors)x.delete?.();
     if(outTensors)for(const x of outTensors)x.delete?.();
   }
 }
 if(!finalLogits)throw Error('No logits generated');
 return {logits:finalLogits,frameLogits};
}
