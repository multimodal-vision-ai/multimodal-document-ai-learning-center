import assert from 'node:assert/strict';
import {directPrompt, validateSettings, DEFAULTS, PROMPT} from './contract.mjs';

const stub = {apply_chat_template(messages, options) {
  assert.equal(messages[0].content[1].text, PROMPT);
  assert.equal(options.enable_thinking, false);
  return '<|im_start|>user\n<|vision_start|><|image_pad|><|vision_end|>' + PROMPT + '<|im_end|>\n<|im_start|>assistant\n<think>\n\n</think>\n\n';
}};
assert.ok(directPrompt(stub).endsWith('<|im_start|>assistant\n'));
assert.ok(!directPrompt(stub).includes('<think>'));
assert.deepEqual(validateSettings(), DEFAULTS);
assert.equal(validateSettings({maxPixels: 2880 ** 2}).maxPixels, 2880 ** 2);
assert.throws(() => validateSettings({maxPixels: 1}));
assert.throws(() => validateSettings({maxNewTokens: 0}));
assert.throws(() => validateSettings({maxNewTokens: 16385}));
assert.throws(() => directPrompt({apply_chat_template: () => 'bad template'}));
console.log('8 contract checks passed');
