export const MODEL_ID = 'multimodal-vision-ai/Wang-Qwen3.5-2B-DocTags-ONNX';
export const PROMPT = 'Convert this page to docling.';
export const RESPONSE_PREFIX = '<think>\n\n</think>\n\n<doctag>';
export const STOP_IDS = Object.freeze([248044, 248046, 248086]);
export const DEFAULTS = Object.freeze({minPixels: 65536, maxPixels: 2073600, maxNewTokens: 4096});

export function trainedPrompt(tokenizer) {
  const rendered = tokenizer.apply_chat_template([
    {role: 'user', content: [{type: 'image'}, {type: 'text', text: PROMPT}]},
  ], {tokenize: false, add_generation_prompt: true, enable_thinking: false});
  const marker = '<|im_start|>assistant\n';
  const index = rendered.lastIndexOf(marker);
  if (index < 0) throw new Error('模型模板缺少 assistant 标记。');
  return rendered.slice(0, index + marker.length) + RESPONSE_PREFIX;
}

export function validateSettings(settings = {}) {
  const value = {...DEFAULTS, ...settings};
  for (const key of ['minPixels', 'maxPixels', 'maxNewTokens']) {
    if (!Number.isSafeInteger(value[key]) || value[key] <= 0) throw new Error(`${key} 必须为正整数。`);
  }
  if (value.minPixels > value.maxPixels) throw new Error('最小像素不能超过最大像素。');
  if (value.maxPixels > DEFAULTS.maxPixels || value.maxNewTokens > 12288) throw new Error('设置超过当前验证范围。');
  return value;
}
