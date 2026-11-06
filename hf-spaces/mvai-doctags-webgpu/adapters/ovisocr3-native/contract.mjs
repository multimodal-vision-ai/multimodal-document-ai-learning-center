/* OvisOCR3 upstream/native document parsing contract; NOT DJX fine-tuning weights. */
export const SOURCE_MODEL_ID = "ATH-MaaS/OvisOCR3";
export const PROMPT_URL = "https://huggingface.co/ATH-MaaS/OvisOCR3/resolve/main/prompts/document_structured.txt";
export const TARGET_OUTPUT_FORMAT = "ovisocr3-structured-json";
export const DEFAULTS = Object.freeze({minPixels:448*448,maxPixels:1440*1440,maxNewTokens:16384});

export async function fetchStructuredPrompt(fetcher=fetch) {
  const response=await fetcher(PROMPT_URL);
  if(!response.ok) throw new Error("无法读取 OvisOCR3 官方 Structured 提示词："+response.status);
  const prompt=await response.text();
  if(!prompt.includes('"bbox"')||!prompt.includes('"category"')||!prompt.includes('"content"'))
    throw new Error("官方 Structured 提示词格式异常，拒绝继续推理。");
  return prompt;
}

export function directPrompt(tokenizer, structuredPrompt) {
  if(typeof structuredPrompt!=="string"||!structuredPrompt.trim())
    throw new TypeError("Structured 提示词不能为空。");
  const rendered=tokenizer.apply_chat_template([
    {role:"user",content:[{type:"image"},{type:"text",text:structuredPrompt}]}
  ],{tokenize:false,add_generation_prompt:true,enable_thinking:false});
  const marker="<|im_start|>assistant\n";
  const end=rendered.lastIndexOf(marker);
  if(end<0)throw new Error("原生模板缺少 assistant 标记。");
  return rendered.slice(0,end+marker.length);
}

export function requireNativeOnnxBundle(modelId) {
  if(modelId===SOURCE_MODEL_ID)
    throw new Error("官方 BF16 Safetensors 不是 WebGPU ONNX 包；必须先完成转换和端到端验证。");
  if(typeof modelId!=="string"||!/^[-\w.]+\/[-\w.]+$/.test(modelId))
    throw new Error("未指定已验证的 OvisOCR3 ONNX 模型仓库 ID。");
  return modelId;
}

export function validateSettings(settings={}) {
  const value={...DEFAULTS,...settings};
  for(const field of ["minPixels","maxPixels","maxNewTokens"]){
    if(!Number.isSafeInteger(value[field])||value[field]<=0)
      throw new Error(field+" 必须为正整数。");
  }
  if(value.minPixels>value.maxPixels||value.maxPixels>2880*2880||value.maxNewTokens>16384)
    throw new Error("原生 OvisOCR3 推理参数超过安全范围。");
  return value;
}
