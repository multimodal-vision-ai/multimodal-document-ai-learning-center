// Licensed derived clips. The classifier never reads this reference metadata.
const assets=new URL('./our-solution-assets/videos/',import.meta.url);
const sample=(id,action,zh,en,sourceId,slug,author,start)=>({
 id,standard_action_id:action,label_zh:zh,label_en:en,asset_file:sourceId+'.mp4',
 video_url:new URL(sourceId+'.mp4',assets).href,
 source_url:`https://www.pexels.com/video/${slug}-${sourceId.split('_').at(-1)}/`,
 attribution:author+' / Pexels',license:'Pexels Free License',license_url:'https://www.pexels.com/license/',
 status:'approved_demo',synthetic:false,reference_evidence:'selected_sample_review',
 evaluation_tier:'development_only',clip_start_seconds:start,clip_duration_seconds:7.8,
 modification:'Selected excerpt, resized, re-encoded H.264, audio removed; original source retained'
});
export const SAMPLE_OVERRIDES=[
 {
  id:'our_wave_kth_person15',standard_action_id:'wave',label_zh:'挥手',label_en:'Waving Hand',
  asset_file:'wave_fullbody_kth_person15.mp4',video_url:new URL('wave_fullbody_kth_person15.mp4',assets).href,
  source_url:'https://www.csc.kth.se/cvap/actions/',attribution:'Schuldt, Laptev and Caputo / KTH',
  license:'KTH 动作库：仅限非商业使用（原片160×120灰度）',license_url:'https://www.csc.kth.se/cvap/actions/',
  status:'approved_demo',synthetic:false,reference_evidence:'source_description_and_visual_preview',
  evaluation_tier:'development_only',clip_start_seconds:0,clip_duration_seconds:7.8,
  modification:'First 7.8 seconds, H.264, no audio; original resolution retained'
 },
 sample('our_phone_4052869','phone_use','用手机','Using Phone','phone_texting_4052869','a-man-texting-using-his-smartphone','KATRIN BOLOVTSOVA',0),
 sample('our_eating_9484894','eating','吃东西','Eating Food','eating_fork_9484894','a-man-eating-food-at-a-table-with-a-fork','Timur Weber',0),
 sample('our_smoking_8090486','smoking','抽烟','Smoking','smoking_candidate_8090486','young-man-smoking-cigarette','Yaroslav Shuraev',14),
 sample('our_pushup_4804794','push_up','俯卧撑','Push Up','push_up_fullbody_4804794','man-doing-push-ups','Ketut Subiyanto',0)
];
