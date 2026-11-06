/* PP-DocLayoutV3 SDK LayoutDetection contract: source-pixel boxes, label and readingOrder. */
const SKIP_OCR=new Set(["image","header_image","footer_image"]);
const FORMULAS=new Set(["display_formula","inline_formula"]);
export function taskForLabel(label) {
  if(typeof label!=="string")throw new TypeError("版面标签类型不正确。");
  if(SKIP_OCR.has(label))return null;
  if(label==="table")return "table";
  if(label==="chart")return "chart";
  if(label==="formula" || FORMULAS.has(label))return "formula";
  return "ocr";
}
export function orderedRegions(detections,{width,height}) {
  if(!Array.isArray(detections))throw new TypeError("PP-DocLayoutV3 没有返回 detections。");
  if(!Number.isFinite(width)||!Number.isFinite(height)||width<=0||height<=0)
    throw new Error("必须提供原始图片宽高。");
  if(detections.length>600)throw new Error("页面区域超过 600 个，拒绝产生不完整的文档结果。");
  const out=detections.map((d,index)=>{
    const box=d?.box;
    if(!box||typeof d?.label!=="string"||!d.label.trim()
      ||!["xMin","yMin","xMax","yMax"].every(k=>Number.isFinite(box[k]))
      ||box.xMin<0||box.yMin<0||box.xMax>width||box.yMax>height
      ||box.xMax<=box.xMin||box.yMax<=box.yMin)
      throw new Error("第 "+(index+1)+" 个区域坐标越界或缺失；禁止伪造定位框。");
    if(!Number.isInteger(d.readingOrder)||d.readingOrder<0)
      throw new Error("缺少有效 readingOrder，不能猜测文档阅读顺序。");
    return {
      index, box:[box.xMin,box.yMin,box.xMax,box.yMax],
      label:d.label,readingOrder:d.readingOrder,
      score:Number.isFinite(d.score)?d.score:null,task:taskForLabel(d.label)
    };
  });
  out.sort((a,b)=>a.readingOrder-b.readingOrder||a.index-b.index);
  return out;
}
export function assemblePaddleResult(regions,recognitions,{width,height}={}) {
  if(!Array.isArray(regions)||!Array.isArray(recognitions)||regions.length!==recognitions.length)
    throw new Error("布局区域与 VLM 识别结果数量不匹配。");
  if(!Number.isFinite(width)||!Number.isFinite(height)||width<=0||height<=0)
    throw new Error("Paddle 原生结果必须记录原始页面宽高。");
  const blocks=regions.map((region,index)=>({
    block_bbox:[...region.box],block_label:region.label,
    block_content:recognitions[index]?.text ?? "",
    block_id:region.index,block_order:region.readingOrder
  }));
  if(blocks.some(block=>typeof block.block_content!=="string"))
    throw new Error("识别结果包含非字符串内容。");
  return {
    width,height,page_index:null,page_count:1,
    model_settings:{
      pipeline_model:"PaddleOCR-VL-1.6",
      use_doc_preprocessor:false,
      use_layout_detection:true,
      use_chart_recognition:true,
      format_block_content:false,
      layout_model:"PP-DocLayoutV3"
    },
    parsing_res_list:blocks
  };
}
