// Prototype rules consume actual observations only, never clip names/reference labels.
export const ACTION_LABELS={
 'Using Phone':'用手机','Smoking':'抽烟','Eating':'吃东西','Hula Hooping':'呼啦圈',
 'Waving Hand':'挥手','Falling Down':'摔倒','Sleeping Posture':'睡觉姿态',
 'Jogging':'慢跑','Yoga':'瑜伽','Push Up':'俯卧撑','Situp':'仰卧起坐','Dancing Ballet':'芭蕾舞'
};
export const CLASS_MAP={'smoking':'Smoking','tasting food':'Eating','hula hooping':'Hula Hooping',
 'jogging':'Jogging','yoga':'Yoga','push up':'Push Up','situp':'Situp','dancing ballet':'Dancing Ballet'};
for(const label of ['eating burger','eating cake','eating carrots','eating chips','eating doughnuts',
 'eating hotdog','eating ice cream','eating spaghetti','eating watermelon'])CLASS_MAP[label]='Eating';
export function softmax(logits){const peak=Math.max(...logits),e=Array.from(logits,x=>Math.exp(x-peak));const s=e.reduce((a,b)=>a+b,0);return e.map(x=>x/s)}
export function clipDecision(windows){
 const votes=new Map();
 for(const w of windows){if(w.action&&w.score>=.25)votes.set(w.action,(votes.get(w.action)||0)+1)}
 const winner=[...votes].sort((a,b)=>b[1]-a[1])[0];
 return winner&&winner[1]>=Math.min(2,windows.length)?winner[0]:null;
}
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const mid=(a,b)=>({x:(a.x+b.x)/2,y:(a.y+b.y)/2});
const pointBox=(p,b)=>Math.hypot(Math.max(b.x-p.x,0,p.x-b.x-b.width),Math.max(b.y-p.y,0,p.y-b.y-b.height));
export function spatialDecision(observations){
 const features=observations.map(o=>{
  const p=o.pose||[],s=p[11]&&p[12]?mid(p[11],p[12]):null;
  const sw=s?distance(p[11],p[12]):0;
  const hip=p[23]&&p[24]&&p[23].visibility>=.3&&p[24].visibility>=.3?mid(p[23],p[24]):null;
  const angle=s&&hip?Math.atan2(Math.abs(hip.x-s.x),Math.abs(hip.y-s.y))*180/Math.PI:null;
  const hands=[...(o.hands||[]).flat(),...[p[15],p[16]].filter(Boolean)];
  const phone=sw>5&&(o.phones||[]).some(b=>b.score>=.25&&hands.some(h=>pointBox(h,b)/sw<=.15));
  const wrists={};
  for(const [id,sh,side] of [[15,11,'left'],[16,12,'right']]){
   if(sw>5&&p[id]&&p[sh]&&(p[id].visibility??1)>=.3)wrists[side]={raised:p[id].y<p[sh].y,x:(p[id].x-p[sh].x)/sw};
  }
  const openHands=(o.hands||[]).filter(h=>h.length===21&&
    [[8,5],[12,9],[16,13],[20,17]].filter(([tip,mcp])=>distance(h[tip],h[0])>1.35*distance(h[mcp],h[0])).length>=3);
  return {...o,sw,angle,hip,wrists,phone,shoulder:s,openHands};
 });
 const hit=(action,method,selected)=>({action,method,times:selected.map(x=>x.t),evidence:selected.map(x=>({t:x.t,angle:x.angle,personBox:x.personBox,phone:x.phone}))});
 const phones=features.filter(x=>x.phone);
 if(phones.length>=2)return hit('Using Phone','hand_phone_proximity',phones);
 const boxes=features.filter(x=>x.personBox);
 for(let i=0;i<boxes.length;i++)for(const b of boxes.slice(i+1)){
  const a=boxes[i],dt=b.t-a.t;
  if(dt>0&&dt<=3&&a.personBox.width/a.personBox.height<.8&&b.personBox.width/b.personBox.height>1.2){
   const fallen=boxes.filter(x=>x.t>=b.t&&x.t<=b.t+1.5&&x.personBox.width/x.personBox.height>1.2);
   return hit('Falling Down','person_box_transition',fallen);
  }
 }
 const body=features.filter(x=>x.angle!==null),lying=body.filter(x=>x.angle>55);
 if(lying.length>=3&&lying.length/body.length>=.7&&Math.max(...body.map(x=>x.angle))-Math.min(...body.map(x=>x.angle))<15)return hit('Sleeping Posture','stable_lying_pose',lying);
 for(const side of ['left','right']){
  const raised=features.filter(x=>x.wrists[side]?.raised&&(x.angle===null||x.angle<50));
  const xs=raised.map(x=>x.wrists[side].x),steps=xs.slice(1).map((x,i)=>x-xs[i]).filter(x=>Math.abs(x)>=.08);
  const turns=steps.slice(1).filter((x,i)=>x*steps[i]<0).length;
  if(xs.length>=3&&Math.max(...xs)-Math.min(...xs)>.15&&turns>=1)return hit('Waving Hand','raised_wrist_oscillation',raised);
 }
 // Upper-body close-ups can have reliable hand points but inferred/offscreen wrists.
 const palms=features.filter(x=>x.sw>5&&x.openHands.some(h=>h[0].y-h[9].y>.15*x.sw));
 const xs=palms.map(x=>{const h=x.openHands.find(h=>h[0].y-h[9].y>.15*x.sw);return (h[9].x-x.shoulder.x)/x.sw});
 const steps=xs.slice(1).map((x,i)=>x-xs[i]).filter(x=>Math.abs(x)>=.08);
 if(xs.length>=4&&Math.max(...xs)-Math.min(...xs)>.3&&steps.slice(1).some((x,i)=>x*steps[i]<0))return hit('Waving Hand','open_palm_oscillation',palms);
 return {action:null,method:'unresolved',times:[],evidence:[]};
}
