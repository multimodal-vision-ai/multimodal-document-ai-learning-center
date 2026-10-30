/* MVAI DocTags render parser V1.6. Text-only, tolerant reader; no HTML injection. */
(function (root) {
  "use strict";
  const ALLOWED = "title|section_header_level_[1-6]|text|otsl|table|list_item|caption|picture|figure|formula|code|footnote|page_header|page_footer|checkbox_selected|checkbox_unselected|unordered_list|ordered_list";
  const BLOCK_RE = new RegExp("<(" + ALLOWED + ")>(?:<loc_(\\d+)><loc_(\\d+)><loc_(\\d+)><loc_(\\d+)>)?([\\s\\S]*?)<\\/\\1>", "gi");
  const STRUCTURAL_RE = /<\/?(?:[a-z_][a-z_0-9-]*)(?:\s[^>]*)?>/gi;
  const LOC_RE = /<loc_\d+>/g;
  const HTML_ENTITY_RE = /&(?:amp|lt|gt|quot|apos|nbsp);/g;
  const DECODE = {"&amp;":"&", "&lt;":"<", "&gt;":">", "&quot;":'"', "&apos;":"'", "&nbsp;":" "};
  function clean(value) {
    return String(value || "").replace(LOC_RE, "").replace(STRUCTURAL_RE, "")
      .replace(HTML_ENTITY_RE, item => DECODE[item] || item).trim();
  }
  function parseOtsl(text) {
    const tags = /<(fcel|ecel|ched|rhed|srow|lcel|ucel|xcel|nl)>/gi;
    const rows = [];
    let row=[], current=null, cursor=0, token, hasCells=false, hasMerges=false;
    function finishCell() {
      if (!current) return;
      current.text = clean(current.text);
      row.push(current);
      current = null;
    }
    function finishRow() {
      finishCell();
      if (row.length) rows.push(row);
      row=[];
    }
    while ((token=tags.exec(text))!==null) {
      if (current) current.text += text.slice(cursor,token.index);
      const kind=token[1].toLowerCase();
      if (kind==="nl") finishRow();
      else {
        finishCell();
        current={type:kind,text:""};
        hasCells=true;
        if (["lcel","ucel","xcel"].includes(kind)) hasMerges=true;
      }
      cursor=tags.lastIndex;
    }
    if (current) current.text += text.slice(cursor);
    finishRow();
    return {rows:rows.slice(0,150),hasCells,hasMerges,truncated:rows.length>150};
  }
  function parse(raw) {
    const source=String(raw || ""), blocks=[];
    let match;
    BLOCK_RE.lastIndex=0;
    while ((match=BLOCK_RE.exec(source))!==null && blocks.length<400) {
      const type=match[1].toLowerCase();
      const loc=match[2]!==undefined ? match.slice(2,6).map(Number) : null;
      const valid=loc && loc.every(v=>v>=0&&v<=500) && loc[2]>loc[0] && loc[3]>loc[1];
      const body=match[6];
      if (type==="otsl"||type==="table"){
        const table=parseOtsl(body);
        blocks.push({type,loc:valid?loc:null,text:clean(body),table,hasContent:table.hasCells});
      } else {
        const text=clean(body);
        if (text || ["picture","figure","checkbox_selected","checkbox_unselected"].includes(type))
          blocks.push({type,loc:valid?loc:null,text,hasContent:!!text});
      }
    }
    return {blocks,truncated:blocks.length>=400,hasStructuredBlocks:blocks.length>0};
  }
  function rects(raw) {
    const entries=[], regex=/<([a-z][a-z_0-9-]*)><loc_(\d+)><loc_(\d+)><loc_(\d+)><loc_(\d+)>/gi;
    let match;
    while ((match=regex.exec(String(raw || "")))!==null && entries.length<600) {
      const loc=match.slice(2,6).map(Number);
      if (loc.every(x=>x>=0&&x<=500) && loc[2]>loc[0] && loc[3]>loc[1])
        entries.push({type:match[1].toLowerCase(),loc});
    }
    return entries;
  }
  const api={parse,parseOtsl,rects,clean};
  root.MVAIDocTags=api;
  if (typeof module!=="undefined"&&module.exports) module.exports=api;
})(typeof globalThis==="object"?globalThis:this);
