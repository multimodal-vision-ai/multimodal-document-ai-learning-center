export const MODEL_ID = 'multimodal-vision-ai/R3-OvisOCR3-DocTags-0.8B-ONNX';
export const PROMPT = 'Convert this page to docling.';
export const DEFAULTS = Object.freeze({minPixels: 448 * 448, maxPixels: 1440 * 1440, maxNewTokens: 16384});

export function directPrompt(tokenizer) {
  const rendered = tokenizer.apply_chat_template([
    {role: 'user', content: [{type: 'image'}, {type: 'text', text: PROMPT}]},
  ], {tokenize: false, add_generation_prompt: true, enable_thinking: false});
  const marker = '<|im_start|>assistant\n';
  const end = rendered.lastIndexOf(marker);
  if (end < 0) throw new Error('模型模板缺少 assistant（回答）标记。');
  return rendered.slice(0, end + marker.length);
}

export function validateSettings(settings = {}) {
  const value = {...DEFAULTS, ...settings};
  for (const key of ['minPixels', 'maxPixels', 'maxNewTokens']) {
    if (!Number.isSafeInteger(value[key]) || value[key] <= 0) throw new Error(`${key} 必须为正整数。`);
  }
  if (value.minPixels > value.maxPixels) throw new Error('最小像素不能超过最大像素。');
  if (value.maxPixels > 2880 * 2880 || value.maxNewTokens > 16384) throw new Error('设置超过已定义的推理范围。');
  return value;
}
