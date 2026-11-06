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
  function blockNode(block,index,doc,sourceImage) {
    let node;
    if(block.type==="table"){
      const wrap=doc.createElement("div");wrap.className="render-tbl";
      const table=safeTable(block.content,doc);
      if(table)wrap.appendChild(table);
      else wrap.textContent=block.content;
      node=wrap;
    }else if(IMAGE_CATEGORIES.has(block.type)){
      node=doc.createElement("div");node.className="unknown-region";
      node.textContent="图像/图表区域（请参考左侧定位框；保留模型原文）\n"+block.content;
    }else if(["display_formula","inline_formula"].includes(block.type)){
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
  const api=Object.freeze({renderBlocks,renderBoxes,safeTable});
  root.MVAINativeOCRRenderer=api;
  if(typeof module!=="undefined" && module.exports) module.exports=api;
})(typeof globalThis==="object"?globalThis:this);
