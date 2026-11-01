// UI-only, transparent interpretation of the published Kinetics-600 labels.
// Does not change model outputs, infer extra class probabilities, or certify accuracy.
export const LABEL_ZH={
  'dining':'用餐场景','eating burger':'吃汉堡','eating hotdog':'吃热狗',
  'making pizza':'制作披萨','preparing salad':'制作沙拉',
  'eating cake':'吃蛋糕','eating chips':'吃薯片','eating doughnuts':'吃甜甜圈',
  'eating ice cream':'吃冰淇淋','eating spaghetti':'吃意面',
  'sleeping':'睡觉','waving hand':'挥手','jumping jacks':'开合跳',
  'texting':'发短信','looking at phone':'看手机','talking on cell phone':'打手机电话'
};
export function interpretAction(ranked, clip, labelNames){
  if(!clip?.label_en)return null;
  const label=clip.label_en;
  const index=labelNames.indexOf(label);
  const targetRank=index>=0?ranked.findIndex(x=>x.id===index)+1:null;
  const top=ranked.slice(0,5);
  const base={
    reference_label:label,reference_zh:clip.label_zh,
    evidence:clip.reference_evidence||clip.evidence||'unknown',
    evaluation_tier:clip.evaluation_tier||'development_only',
    target_supported:index>=0,target_rank:targetRank,
    top1_match:targetRank===1,top5_match:targetRank!==null&&targetRank<=5,
    scorable_benchmark:clip.verified_label===true&&clip.evaluation_tier==='reviewed_benchmark',
    semantic_matches:[],context_matches:[],excluded_matches:[],
    interpretation_kind:'literal',summary:'',detail:''
  };
  if(clip.standard_action_id==='eating'||label==='eating'){
    const direct=top.filter(x=>x.label.startsWith('eating '));
    const context=top.filter(x=>x.label==='dining');
    const excluded=top.filter(x=>['making pizza','preparing salad'].includes(x.label));
    base.interpretation_kind='hierarchical';
    base.semantic_matches=direct.map(x=>({label:x.label,rank:ranked.indexOf(x)+1,score:x.score}));
    base.context_matches=context.map(x=>({label:x.label,rank:ranked.indexOf(x)+1,score:x.score}));
    base.excluded_matches=excluded.map(x=>({label:x.label,rank:ranked.indexOf(x)+1}));
    base.summary=direct.length?'Top-5 出现进食子类别（广义动作相关）':context.length?'Top-5 出现用餐场景类别':'Top-5 未出现明确的进食子类别';
    base.detail='Kinetics-600 没有独立的 eating 总类，但有 eating burger / eating hotdog 等子类。dining 是相关用餐场景；making pizza、preparing salad 属于制作食物，不能算进食命中。模型预测的具体食物未获真值核验，不能据此宣称正式识别准确率。';
    return base;
  }
  if(clip.standard_action_id==='phone_call' && label==='talking on phone'){
    base.interpretation_kind='device_mismatch';
    base.summary='有线电话演示：模型没有直接对应的有线通话类别';
    base.detail='talking on cell phone 是手机通话，不是有线电话通话；即使模型预测了该类，也不能算严格命中。仅显示原始 Top-5 供观察。';
    base.context_matches=top.filter(x=>x.label==='talking on cell phone').map(x=>({label:x.label,rank:ranked.indexOf(x)+1,score:x.score}));
    return base;
  }
  if(clip.standard_action_id==='sleep_posture'){
    base.summary=base.top5_match?'睡眠相关原生标签进入 Top-5':'睡眠相关原生标签未进入 Top-5';
    base.detail='这条视频仅具有可见的卧床姿态；即使 sleeping 进入 Top-1，也不能证明人物生理上已经入睡。';
    return base;
  }
  if(index>=0){
    base.summary='原生类别「'+label+'」排名第 '+targetRank;
    base.detail='仅与样例参考标签进行原生类别排名对照，softmax 分数不是整体模型准确率。';
    return base;
  }
  base.interpretation_kind='unsupported';
  base.summary='参考动作不在此模型的 600 个原生类别中';
  base.detail='不能据此判定模型识别正确或错误。';
  return base;
}
export function labelDisplay(en){return LABEL_ZH[en]?(LABEL_ZH[en]+' / '+en):en}
export function relationTag(label,comp){
  if(!comp)return '';
  if(comp.semantic_matches.some(x=>x.label===label))return '进食子类别';
  if(comp.context_matches.some(x=>x.label===label))return comp.interpretation_kind==='device_mismatch'?'设备类型不同':'用餐相关场景';
  if(comp.excluded_matches.some(x=>x.label===label))return '食物制作 ≠ 进食';
  return '';
}
