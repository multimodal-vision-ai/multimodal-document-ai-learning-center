/* Native OCR rendering, strictly separate from DocTags parser. 
   Rich model HTML is treated as untrusted and only allow-listed table nodes are re-created. */
(function(root) {
  "use strict";
  const SAFE_TABLE=new Set(["TABLE","THEAD","TBODY","TFOOT","TR","TD","TH","CAPTION","BR"]);
  const TITLE_TAGS={doc_title:"h1",paragraph_title:"h3",figure_title:"h3",abstract:"h3"};
  const IMAGE_CATEGORIES=new Set(["image","header_image","footer_image","chart"]);
  function safeTable(html, doc) {
    const parsed=new DOMParser().parseFromString(html,"text/html");
    const original=parsed.querySelector("table");
    if(!original) return null;
    let nodes=0;
    function clone(node) {
      if(node.nodeType===3) return doc.createTextNode(node.textContent||"");
      if(node.nodeType!==1 || !SAFE_TABLE.has(node.tagName) || ++nodes>3000) return null;
      const element=doc.createElement(node.tagName.toLowerCase());
      if(["TD","TH"].includes(node.tagName)){
        for(const key of ["colspan","rowspan"]) {
          const val=Number(node.getAttribute(key));
          if(Number.isInteger(val)&&val>1&&val<=30)element.setAttribute(key,String(val));
        }
      }
      for(const child of node.childNodes){const safe=clone(child);if(safe)element.appendChild(safe);}
      return element;
    }
    return clone(original);
  }
  function imageCrop(block,sourceImage,doc) {
    const core=root.MVAINativeOCR;
    if(!core || !sourceImage || !Number.isFinite(sourceImage.width) || !Number.isFinite(sourceImage.height))return null;
    const [left,top,right,bottom]=core.toPixelBox(block,sourceImage.width,sourceImage.height);
    const x1=Math.max(0,Math.min(sourceImage.width,Math.floor(left)));
    const y1=Math.max(0,Math.min(sourceImage.height,Math.floor(top)));
    const x2=Math.max(0,Math.min(sourceImage.width,Math.ceil(right)));
    const y2=Math.max(0,Math.min(sourceImage.height,Math.ceil(bottom)));
    if(x2<=x1||y2<=y1)return null;
    const canvas=doc.createElement("canvas");
    canvas.width=x2-x1;canvas.height=y2-y1;
    const ctx=canvas.getContext("2d");
    if(!ctx)return null;
    ctx.drawImage(sourceImage,x1,y1,x2-x1,y2-y1,0,0,canvas.width,canvas.height);
    canvas.className="render-crop";
    canvas.style.maxWidth="100%";
    canvas.style.height="auto";
    return canvas;
  }
  function otslTable(parsed,doc) {
    const table=doc.createElement("table");
    table.className="otsl-table";
    table.setAttribute("aria-label","PaddleOCR-VL 原生 OTSL 表格");
    const body=doc.createElement("tbody");
    for(const rowCells of parsed.rows) {
      const tr=doc.createElement("tr");
      for(const cell of rowCells) {
        const td=doc.createElement("td");
        if(cell.colspan>1)td.colSpan=cell.colspan;
        if(cell.rowspan>1)td.rowSpan=cell.rowspan;
        td.textContent=cell.text.trim();
        td.style.whiteSpace="pre-wrap";
        td.style.verticalAlign="top";
        tr.appendChild(td);
      }
      body.appendChild(tr);
    }
    table.appendChild(body);
    return table;
  }
  function otslSource(content,parsed,doc) {
    const details=doc.createElement("details");
    details.className="otsl-source";
    details.style.marginTop="8px";
    const summary=doc.createElement("summary");
    summary.textContent="查看原始 OTSL（"+parsed.rows.length+" 行 · "+parsed.cellCount+" 个单元格）";
    const pre=doc.createElement("pre");
    pre.textContent=content;
    pre.style.whiteSpace="pre-wrap";
    pre.style.overflowWrap="anywhere";
    pre.style.fontSize="11px";
    details.append(summary,pre);
    return details;
  }
  function blockNode(block,index,doc,sourceImage) {
    let node;
    if(block.type==="table"){
      const wrap=doc.createElement("div");wrap.className="render-tbl";
      const table=safeTable(block.content,doc);
      if(table) {
        wrap.appendChild(table);
      } else {
        try {
          const parsed=root.MVAINativeOCR?.parseOTSL(block.content);
          if(parsed) {
            wrap.appendChild(otslTable(parsed,doc));
            wrap.appendChild(otslSource(block.content,parsed,doc));
          } else {
            const raw=doc.createElement("pre");
            raw.textContent=block.content;
            wrap.appendChild(raw);
          }
        } catch(error) {
          const warning=doc.createElement("p");
          warning.className="otsl-warning";
          warning.textContent="OTSL 结构暂时无法可靠还原，以下保留模型原始输出："+(error?.message||String(error));
          const raw=doc.createElement("pre");
          raw.textContent=block.content;
          raw.style.whiteSpace="pre-wrap";
          raw.style.overflowWrap="anywhere";
          wrap.append(warning,raw);
        }
      }
      node=wrap;
    }else if(IMAGE_CATEGORIES.has(block.type)){
      node=doc.createElement("div");node.className="unknown-region";
      const crop=imageCrop(block,sourceImage,doc);
      if(crop)node.appendChild(crop);
      const caption=doc.createElement("div");
      caption.textContent=block.type+"（原图区域裁剪）";
      node.appendChild(caption);
      const raw=String(block.content||"").trim();
      if(/^<table\b/i.test(raw)){
        const table=safeTable(raw,doc);
        if(table)node.appendChild(table);
      }else if(raw && !/^<img\b/i.test(raw)){
        const text=doc.createElement("pre");
        text.textContent=raw;
        text.style.whiteSpace="pre-wrap";
        node.appendChild(text);
      }
    }else if(["formula","display_formula","inline_formula"].includes(block.type)){
      node=doc.createElement("p");node.textContent=block.content;
      node.style.whiteSpace="pre-wrap";
    }else{
      node=doc.createElement(TITLE_TAGS[block.type]||"p");
      node.textContent=block.content;
    }
    node.classList.add("render-block");
    node.tabIndex=0;
    node.dataset.blockIndex=String(index);
    node.title="悬停定位至原始文档位置";
    return node;
  }
  function renderBlocks(parsed,container,sourceImage=null){
    const doc=container.ownerDocument;
    container.replaceChildren();
    parsed.blocks.forEach((block,index)=>container.appendChild(blockNode(block,index,doc,sourceImage)));
    if(parsed.blocks.length===0) {
      const p=doc.createElement("p");p.className="render-placeholder";
      p.textContent="本次输出没有有效的原生定位元素，请检查原始 JSON。";
      container.appendChild(p);
    }
    return {blocks:parsed.blocks.length,tables:parsed.blocks.filter(block=>block.type==="table").length};
  }
  function renderBoxes(ctx,parsed,width,height,{highlight=null,showLabels=true}={}){
    const core=root.MVAINativeOCR;
    if(!core)throw new Error("需要先加载 native-document-output.js");
    const boxColor="#4f77ae";
    const labelFont=Math.max(9, Math.min(15, width/100));
    let count=0;
    for(const [index,block] of parsed.blocks.entries()) {
      const [x1,y1,x2,y2]=core.toPixelBox(block,width,height);
      const active=index===highlight;
      ctx.strokeStyle=active?"#e06422":boxColor;
      ctx.lineWidth=active?Math.max(3,width/220):Math.max(2,width/480);
      ctx.strokeRect(x1,y1,x2-x1,y2-y1);
      count++;
      if(!showLabels)continue;
      const label=block.type.slice(0,40);
      ctx.font="600 "+labelFont+"px Arial,sans-serif";
      const pad=3,lh=labelFont+5,lw=ctx.measureText(label).width+pad*2;
      const labelX=Math.max(0,Math.min(width-lw,x1)),labelY=y1>=lh?y1-lh:y1;
      ctx.fillStyle=active?"#e06422":boxColor;
      ctx.fillRect(labelX,labelY,lw,lh);
      ctx.fillStyle="#fff";
      ctx.textBaseline="middle";
      ctx.fillText(label,labelX+pad,labelY+lh/2);
    }
    return count;
  }
  const api=Object.freeze({renderBlocks,renderBoxes,safeTable,otslTable,otslSource});
  root.MVAINativeOCRRenderer=api;
  if(typeof module!=="undefined" && module.exports) module.exports=api;
})(typeof globalThis==="object"?globalThis:this);
