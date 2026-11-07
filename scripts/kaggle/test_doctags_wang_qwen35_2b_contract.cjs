"use strict";
const assert = require("node:assert/strict");
(async () => {
  const contract = await import("../../docs/assets/projects/doctags/browser-inference/adapters/wang-qwen35-2b/contract.mjs");
  assert.equal(contract.MODEL_ID, "multimodal-vision-ai/Wang-Qwen3.5-2B-DocTags-ONNX");
  assert.equal(contract.MODEL_REVISION, "09f034d04e5a26620124e4b80923ffc2ec5899c7");
  assert.equal(contract.RESPONSE_PREFIX, "<think>\n\n</think>\n\n<doctag>");
  assert.deepEqual(contract.STOP_IDS, [248044, 248046, 248086]);
  assert.deepEqual(contract.DEFAULTS, {minPixels:65536,maxPixels:2073600,maxNewTokens:4096});
  const fs = require("node:fs");
  const adapterSource = fs.readFileSync(
    require("node:path").join(__dirname, "../../docs/assets/projects/doctags/browser-inference/adapters/wang-qwen35-2b/adapter.mjs"),
    "utf8"
  );
  assert.match(adapterSource, /revision = MODEL_REVISION/);
  assert.doesNotMatch(adapterSource, /use_external_data_format\s*:\s*true/);
  assert.match(adapterSource, /per-file counts/);
  const tokenizer = {
    apply_chat_template(messages, options) {
      assert.equal(messages[0].role, "user");
      assert.equal(messages[0].content[0].type, "image");
      assert.equal(messages[0].content[1].text, contract.PROMPT);
      assert.equal(options.add_generation_prompt, true);
      return "<|im_start|>user\n<image>Convert this page to docling.<|im_end|>\n<|im_start|>assistant\n";
    }
  };
  assert.equal(contract.trainedPrompt(tokenizer), "<|im_start|>user\n<image>Convert this page to docling.<|im_end|>\n<|im_start|>assistant\n" + contract.RESPONSE_PREFIX);
  assert.deepEqual(contract.validateSettings({}), contract.DEFAULTS);
  assert.equal(contract.validateSettings({maxNewTokens:12288}).maxNewTokens,12288);
  assert.throws(() => contract.validateSettings({maxNewTokens:12289}));
  assert.throws(() => contract.validateSettings({minPixels:3000000,maxPixels:1000000}));
  assert.throws(() => contract.trainedPrompt({apply_chat_template:()=>"<|im_start|>user\n<|im_end|>"}));
  console.log("WC-2B contract tests: model ID, prompt prefix, stop IDs and generation bounds PASS");
})().catch(error => { console.error(error); process.exitCode = 1; });
