/* Browser-local PaddleOCR-VL-1.6 document pipeline. 
   Dependencies must be pinned Apache-2.0 browser engines, supplied by the integration layer.
   Disabled from model selection until real WebGPU validation is completed. */
import {orderedRegions,assemblePaddleResult} from "./pipeline-contract.mjs";

export const SOURCE_MODEL = "PaddlePaddle/PaddleOCR-VL-1.6";
export const BROWSER_PACK = "glebkudr/PaddleOCR-VL-1.6-WebGPU";
export const LAYOUT_MODEL = "PP-DocLayoutV3";

export async function createAdapter({createLayout,createVlm,onProgress=()=>{}}={}) {
  if(typeof createLayout!=="function"||typeof createVlm!=="function")
    throw new Error("缺少经版本锁定的 Paddle WebGPU 推理引擎或布局 SDK，禁止使用 CPU/服务器代替。");
  if(!navigator?.gpu)throw new Error("本设备不支持 WebGPU。");
  const gpu=await navigator.gpu.requestAdapter();
  if(!gpu?.features?.has("shader-f16"))
    throw new Error("PaddleOCR-VL-1.6 WebGPU 引擎需要 shader-f16。");
  let layout=null,vlm=null,disposed=false,busy=false,stopRequested=false,activeController=null;
  try {
    layout=await createLayout({backend:"webgpu",precision:"fp16",allowFallback:false,
      onProgress:event=>onProgress({stage:"layout-load",...event})});
    if(layout.runtime?.backend!=="webgpu")
      throw new Error("布局检测并非真实 WebGPU，禁止静默 CPU 回退。");
    vlm=await createVlm();
    if(!vlm||typeof vlm.recognizeCanvas!=="function"||typeof vlm.dispose!=="function")
      throw new Error("PaddleOCR-VL WebGPU 引擎接口不完整。");
  }catch(error){
    try{await layout?.dispose?.();}catch{}
    try{await vlm?.dispose?.();}catch{}
    throw error;
  }
  return {
    stop(){stopRequested=true;activeController?.abort("用户终止");},
    async dispose(){
      if(busy)throw new Error("PaddleOCR 正在推理，请在停止完成后释放模型。");
      if(disposed)return;
      disposed=true;await vlm.dispose();await layout.dispose();
    },
    async recognize(blob,{onRegion=()=>{},onProgress:progress=()=>{}}={}){
      if(disposed)throw new Error("已释放的 PaddleOCR 推理实例不能重复使用。");
      if(busy)throw new Error("PaddleOCR 已有推理任务正在运行。");
      if(!(blob instanceof Blob))throw new TypeError("需要浏览器原始图像 File/Blob。");
      busy=true;stopRequested=false;activeController=new AbortController();
      const started=performance.now();
      let bitmap=null;
      try{
        bitmap=await createImageBitmap(blob);
        const width=bitmap.width,height=bitmap.height;
        const detection=await layout.detect(blob,{signal:activeController.signal});
        if(layout.runtime?.backend!=="webgpu")throw new Error("布局检测已切换到非 WebGPU 后端。");
        if(detection.image?.original?.width!==width||detection.image?.original?.height!==height)
          throw new Error("版面检测坐标系与原图分辨率不符，拒绝错误框选。");
        const regions=orderedRegions(detection.detections,{width,height});
        const recognitions=[];
        for(const [index,region] of regions.entries()){
          if(stopRequested)break;
          if(region.task===null){
            recognitions.push({text:""});onRegion({index,region,skipped:true});continue;
          }
          const [x1,y1,x2,y2]=region.box;
          const canvas=document.createElement("canvas");
          canvas.width=Math.ceil(x2-x1);canvas.height=Math.ceil(y2-y1);
          const ctx=canvas.getContext("2d");
          if(!ctx)throw new Error("浏览器无法创建裁剪 Canvas。");
          ctx.drawImage(bitmap,x1,y1,x2-x1,y2-y1,0,0,canvas.width,canvas.height);
          const reply=await vlm.recognizeCanvas(canvas,{
            task:region.task,maxGeneratedTokens:region.task==="table"?2048:1024,
            onProgress:event=>progress({stage:"recognition",index,total:regions.length,...event})
          });
          if(typeof reply?.text!=="string")throw new Error("VLM 没有返回原生识别文本。");
          recognitions.push({text:reply.text});
          onRegion({index,region,text:reply.text});
        }
        if(stopRequested){
          return {text:"",ended:false,stopped:true,
            totalSeconds:(performance.now()-started)/1000,
            completedRegions:recognitions.length,totalRegions:regions.length};
        }
        const native=assemblePaddleResult(regions,recognitions);
        return {text:JSON.stringify(native,null,2),native,ended:true,
          totalSeconds:(performance.now()-started)/1000,
          completedRegions:regions.length,totalRegions:regions.length};
      }finally{
        bitmap?.close();activeController=null;busy=false;
      }
    }
  };
}
