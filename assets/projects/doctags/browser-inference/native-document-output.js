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
  // Ovis/Qwen may prepend a <think>...</think> wrapper before its official
  // Structured JSON. Preserve the exact raw output, but ignore that wrapper
  // only while parsing the native JSON array.
  function decodeOvis(input) {
    const raw = asRaw(input);
    if (raw.length > MAX_RAW_CHARS) throw new Error("原始输出超过 10 MiB 限额，拒绝渲染。");
    let payload = raw;
    if (typeof input === "string") {
      payload = raw.trimStart();
      const thinkPrefix = payload.match(/^<think\b[^>]*>[\s\S]*?<\/think\s*>/i);
      if (thinkPrefix) payload = payload.slice(thinkPrefix[0].length).trimStart();
    }
    let value;
    try { value = typeof input === "string" ? JSON.parse(payload) : input; }
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
    const {raw,value} = decodeOvis(input);
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
  const OTSL_TOKENS = new Set(["fcel","ecel","lcel","ucel","xcel","nl"]);
  function parseOTSL(input) {
    if (typeof input !== "string") throw new TypeError("OTSL 输入必须是字符串。");
    if (input.length > MAX_RAW_CHARS) throw new Error("OTSL 内容超过 10 MiB 限额，拒绝渲染。");
    const tokenPattern = /<(fcel|ecel|lcel|ucel|xcel|nl)>/g;
    const matches = [...input.matchAll(tokenPattern)];
    if (matches.length === 0) return null;
    if (matches.length > 20000) throw new Error("OTSL 标记数量超过 20,000，拒绝渲染。");
    const rows = [[]], slots = [[]], cells = [];
    let row = 0, col = 0, rowHasToken = false;
    let previousKind = null, previousCell = null, previousEnd = 0;
    const assignText = text => {
      if (previousKind === "fcel" && previousCell) previousCell.text += text;
      else if (text.trim()) throw new Error("OTSL 单元格标记之间出现无法归属的文本。");
    };
    const putSlot = (r, c, cell) => {
      if (c >= 1000 || r >= 1000) throw new Error("OTSL 表格行列超过 1,000，拒绝渲染。");
      slots[r] ||= [];
      if (slots[r][c]) throw new Error("OTSL 合并单元格发生重叠，无法可靠恢复表格。");
      slots[r][c] = cell;
    };
    for (const match of matches) {
      assignText(input.slice(previousEnd, match.index));
      const kind = match[1];
      if (!OTSL_TOKENS.has(kind)) throw new Error("发现不支持的 OTSL 标记。");
      if (kind === "nl") {
        if (!rowHasToken) throw new Error("OTSL 出现空行结束标记。");
        row++;
        if (row >= 1000) throw new Error("OTSL 表格行数超过 1,000，拒绝渲染。");
        rows[row] = [];
        slots[row] = [];
        col = 0;
        rowHasToken = false;
        previousKind = "nl";
        previousCell = null;
      } else if (kind === "fcel" || kind === "ecel") {
        const cell = {
          row, col, text: "", rowspan: 1, colspan: 1, empty: kind === "ecel"
        };
        putSlot(row, col, cell);
        rows[row].push(cell);
        cells.push(cell);
        previousKind = kind;
        previousCell = cell;
        col++;
        rowHasToken = true;
      } else if (kind === "lcel") {
        const left = slots[row]?.[col - 1];
        if (!left || left.row !== row || left.col + left.colspan !== col)
          throw new Error("OTSL <lcel> 找不到可向右扩展的左侧单元格。");
        left.colspan++;
        putSlot(row, col, left);
        previousKind = kind;
        previousCell = left;
        col++;
        rowHasToken = true;
      } else if (kind === "ucel") {
        const above = slots[row - 1]?.[col];
        if (!above || above.row + above.rowspan !== row)
          throw new Error("OTSL <ucel> 找不到可向下扩展的上方单元格。");
        above.rowspan++;
        putSlot(row, col, above);
        previousKind = kind;
        previousCell = above;
        col++;
        rowHasToken = true;
      } else if (kind === "xcel") {
        const left = slots[row]?.[col - 1];
        const above = slots[row - 1]?.[col];
        if (!left || !above || left !== above
          || left.col > col || left.col + left.colspan <= col
          || left.row > row || left.row + left.rowspan <= row)
          throw new Error("OTSL <xcel> 无法对应同一个左侧及上方合并单元格。");
        // Both spans were established by the adjacent <lcel>/<ucel> markers.
        // <xcel> identifies their shared intersection; it does not add a new row/column.
        putSlot(row, col, left);
        previousKind = kind;
        previousCell = left;
        col++;
        rowHasToken = true;
      }
      previousEnd = match.index + match[0].length;
    }
    assignText(input.slice(previousEnd));
    if (!rowHasToken && rows.length > 1) rows.pop();
    if (rows.length === 0 || cells.length === 0)
      throw new Error("OTSL 没有可渲染的表格单元格。");
    return {
      rows,
      cellCount: cells.length,
      maxColumns: Math.max(0, ...slots.map(line => line.length)),
      format: "paddleocr-vl-otsl"
    };
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
  const api = Object.freeze({parseOvis, parsePaddle, parseOTSL, toPixelBox});
  root.MVAINativeOCR = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof globalThis === "object" ? globalThis : this);
