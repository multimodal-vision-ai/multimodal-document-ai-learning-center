/* MVAI native OCR result contracts. No DocTags conversion and no HTML injection. */
(function (root) {
  "use strict";
  const MAX_BLOCKS = 600;
  const MAX_RAW_CHARS = 10 * 1024 * 1024;
  const OVIS_CATEGORIES = new Set([
    "abstract", "algorithm", "aside_text", "chart", "content", "display_formula",
    "doc_title", "figure_title", "footer", "footer_image", "footnote", "formula_number",
    "header", "header_image", "image", "inline_formula", "number", "paragraph_title",
    "reference_content", "seal", "table", "text", "vertical_text", "vision_footnote"
  ]);
  function asRaw(input) {
    if (typeof input === "string") return input;
    if (input && typeof input === "object") return JSON.stringify(input);
    throw new TypeError("原生结果必须是 JSON 字符串或 JSON 对象。");
  }
  function decode(input) {
    const raw = asRaw(input);
    if (raw.length > MAX_RAW_CHARS) throw new Error("原始输出超过 10 MiB 限额，拒绝渲染。");
    let value;
    try { value = typeof input === "string" ? JSON.parse(raw) : input; }
    catch (error) { throw new Error("模型没有输出完整的有效 JSON："+error.message); }
    return {raw, value};
  }
  function isBox(box, maxX, maxY, integral) {
    return Array.isArray(box) && box.length === 4
      && box.every(v => typeof v === "number" && Number.isFinite(v) && v >= 0
        && (!integral || Number.isInteger(v)))
      && box[2] > box[0] && box[3] > box[1]
      && box[2] <= maxX && box[3] <= maxY;
  }
  function dimensionOptions(options) {
    const width = options?.width, height = options?.height;
    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0)
      throw new Error("PaddleOCR 定位必须提供原图像素宽高。");
    return {width, height};
  }
  function parseOvis(input) {
    const {raw,value} = decode(input);
    if (!Array.isArray(value)) throw new Error("OvisOCR3 Structured 必须返回 JSON 数组。");
    const blocks = [], warnings = [];
    if (value.length > MAX_BLOCKS) warnings.push("元素超过 600 个，仅检查前 600 个。");
    for (const [index,item] of value.slice(0,MAX_BLOCKS).entries()) {
      if (!item || typeof item !== "object"
        || !isBox(item.bbox, 999, 999, true)
        || !OVIS_CATEGORIES.has(item.category)
        || typeof item.content !== "string") {
        warnings.push("第 "+(index+1)+" 个元素 bbox/category/content 无效，未绘制位置框。");
        continue;
      }
      blocks.push({
        index, bbox: [...item.bbox], type: item.category, content: item.content,
        coordinateSystem: "normalized-1000", source: "ovisocr3-native"
      });
    }
    return {format:"ovisocr3-structured-json", raw, blocks, warnings, total:value.length};
  }
  function paddleList(value) {
    if (Array.isArray(value?.parsing_res_list)) return value.parsing_res_list;
    if (Array.isArray(value?.res?.parsing_res_list)) return value.res.parsing_res_list;
    throw new Error("PaddleOCR-VL 缺少官方解析流水线 parsing_res_list，不能冒充具有版面定位的结果。");
  }
  function parsePaddle(input, options) {
    const {raw,value} = decode(input);
    const {width,height} = dimensionOptions(options);
    const items = paddleList(value), blocks=[],warnings=[];
    if(items.length > MAX_BLOCKS) warnings.push("元素超过 600 个，仅检查前 600 个。");
    for(const [index,item] of items.slice(0,MAX_BLOCKS).entries()) {
      if (!item || typeof item !== "object"
        || !isBox(item.block_bbox, width, height, false)
        || typeof item.block_label !== "string" || !item.block_label.trim()
        || typeof item.block_content !== "string") {
        warnings.push("第 "+(index+1)+" 个元素缺少有效的原图像素 bbox/类别/内容，未绘制位置框。");
        continue;
      }
      blocks.push({
        index, bbox:[...item.block_bbox], type:item.block_label, content:item.block_content,
        blockId:item.block_id ?? null, order:Number.isFinite(item.block_order)?item.block_order:index,
        coordinateSystem:"page-pixels", source:"pp-doclayoutv3+paddleocr-vl-1.6"
      });
    }
    blocks.sort((a,b)=>a.order-b.order || a.index-b.index);
    return {format:"paddleocr-vl16-pipeline-json",raw,blocks,warnings,total:items.length};
  }
  function toPixelBox(block, width, height) {
    if (!Number.isFinite(width) || !Number.isFinite(height) || width<=0 || height<=0)
      throw new Error("缺少有效原图宽高。");
    const factor = block.coordinateSystem === "normalized-1000" ? [width/1000,height/1000]
      : block.coordinateSystem === "page-pixels" ? [1,1] : null;
    if (!factor) throw new Error("未知坐标系统，不能推测比例。");
    const [x1,y1,x2,y2]=block.bbox;
    return [x1*factor[0],y1*factor[1],x2*factor[0],y2*factor[1]];
  }
  const api = Object.freeze({parseOvis, parsePaddle, toPixelBox});
  root.MVAINativeOCR = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof globalThis === "object" ? globalThis : this);
