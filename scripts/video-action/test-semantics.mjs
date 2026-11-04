import assert from 'node:assert/strict';
import {interpretAction,labelDisplay,relationTag} from '../../docs/assets/projects/video-action/browser-inference/semantic.js';
const labels=['dining','eating burger','making pizza','preparing salad','eating hotdog','sleeping','waving hand','talking on cell phone'];
const ranked=[
  {id:0,label:'dining',score:.282},
  {id:1,label:'eating burger',score:.2568},
  {id:2,label:'making pizza',score:.1939},
  {id:3,label:'preparing salad',score:.0561},
  {id:4,label:'eating hotdog',score:.0289}
];
const eating=interpretAction(ranked,{standard_action_id:'eating',label_en:'eating',label_zh:'吃东西',verified_label:false},labels);
assert.equal(eating.interpretation_kind,'hierarchical');
assert.equal(eating.target_supported,false);
assert.equal(eating.semantic_matches.length,2);
assert.equal(eating.context_matches.length,1);
assert.equal(eating.excluded_matches.length,2);
assert.equal(eating.top1_match,false);
assert.equal(eating.scorable_benchmark,false);
assert.equal(relationTag('eating burger',eating),'进食子类别');
assert.equal(relationTag('dining',eating),'用餐相关场景');
assert.equal(relationTag('making pizza',eating),'食物制作 ≠ 进食');
assert.ok(eating.detail.includes('不能算进食命中'));
assert.equal(labelDisplay('eating burger'),'eating burger');
assert.equal(labelDisplay('cosplaying'),'cosplaying');
assert.equal(labelDisplay('sleeping'),'sleeping');
const call=interpretAction([{id:7,label:'talking on cell phone',score:.83}],{standard_action_id:'phone_call',label_en:'talking on phone',label_zh:'打电话（有线电话）'},labels);
assert.equal(call.interpretation_kind,'device_mismatch');
assert.equal(call.target_supported,false);
assert.equal(call.scorable_benchmark,false);
assert.ok(call.detail.includes('不是有线电话通话'));
const sleep=interpretAction([{id:5,label:'sleeping',score:.91}],{standard_action_id:'sleep_posture',label_en:'sleeping',label_zh:'睡眠姿态'},labels);
assert.equal(sleep.top1_match,true);
assert.ok(sleep.detail.includes('不能证明'));
assert.equal(interpretAction(ranked,null,labels),null);
console.log('PASS: six semantic interpretation checks (eating hierarchy, related context, preparation exclusion, landline, sleeping and unlabelled).');
