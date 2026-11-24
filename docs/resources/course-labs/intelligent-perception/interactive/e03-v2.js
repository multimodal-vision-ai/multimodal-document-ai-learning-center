"use strict";
(() => {
 const $=id=>document.getElementById(id),scene=$("scene"),base="../e03-media/";
 const labels={straight:"直道",curve:"普通弯道",complex:"复杂弯道"};
 const paths={straight:{image:"scene-straight-original.jpg",binary:"scene-straight-binary.png",compare:"straight-compare.mp4",processed:"straight-processed.mp4"},curve:{image:"scene-curve-original.jpg",binary:"scene-curve-binary.png",compare:"curve-compare.mp4",processed:"curve-processed.mp4"},complex:{image:"scene-complex-original.jpg",binary:"scene-complex-binary.png",compare:"complex-compare.mp4",processed:"complex-processed.mp4"}};
 const panels=["calibration","threshold","perspective","windows","video"];
 let img=null,imageData=null,maskData=null,busy=false;
 document.body.classList.toggle("embedded",new URLSearchParams(location.search).get("embed")==="1");
 const C=id=>$(id),X=id=>C(id).getContext("2d",{willReadFrequently:true});
 function status(id,s){if(C(id))C(id).textContent=s;}
 function loadImage(url){return new Promise((ok,no)=>{const im=new Image();im.onload=()=>ok(im);im.onerror=()=>no(Error("图片加载失败："+url));im.src=url+"?v=3";});}
 function draw(id,im){const c=C(id),x=c.getContext("2d");x.clearRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);}
 function hsl(r,g,b){r/=255;g/=255;b/=255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn;let h=0,s=0,l=(mx+mn)/2;if(d){s=d/(1-Math.abs(2*l-1));if(mx===r)h=((g-b)/d)%6;else if(mx===g)h=(b-r)/d+2;else h=(r-g)/d+4;h*=60;if(h<0)h+=360;}return [h,s,l*255];}
 function getPixels(){const c=document.createElement("canvas");c.width=640;c.height=360;c.getContext("2d").drawImage(img,0,0,640,360);return c.getContext("2d",{willReadFrequently:true}).getImageData(0,0,640,360);}
 function solve(A,b){const n=b.length,m=A.map((r,i)=>r.concat([b[i]]));for(let c=0;c<n;c++){let p=c;for(let r=c+1;r<n;r++)if(Math.abs(m[r][c])>Math.abs(m[p][c]))p=r;if(Math.abs(m[p][c])<1e-10)return null;[m[c],m[p]]=[m[p],m[c]];const z=m[c][c];for(let j=c;j<=n;j++)m[c][j]/=z;for(let r=0;r<n;r++)if(r!==c){const q=m[r][c];for(let j=c;j<=n;j++)m[r][j]-=q*m[c][j];}}return m.map(r=>r[n]);}
 function threshold(){
  if(!imageData)return;const d=imageData.data,w=640,h=360,n=w*h,L=+C("light").value,G=+C("grad").value,gray=new Float32Array(n),out=X("binary").createImageData(w,h),o=out.data;let count=0;
  for(let i=0;i<n;i++){const j=i*4;gray[i]=.299*d[j]+.587*d[j+1]+.114*d[j+2];}
  for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=y*w+x,j=i*4,v=hsl(d[j],d[j+1],d[j+2]),yellow=v[0]>=15&&v[0]<=75&&v[1]>.2&&v[2]>45,white=v[2]>=L&&v[1]<.48,gx=-gray[i-w-1]+gray[i-w+1]-2*gray[i-1]+2*gray[i+1]-gray[i+w-1]+gray[i+w+1],yes=yellow||white||Math.abs(gx)>=G*2.2;const z=yes?255:0;o[j]=o[j+1]=o[j+2]=z;o[j+3]=255;if(yes)count++;}
  X("binary").putImageData(out,0,0);maskData=out;
  C("thresholdStats").textContent="候选像素："+count.toLocaleString()+" / "+((w-2)*(h-2)).toLocaleString()+"（"+(100*count/((w-2)*(h-2))).toFixed(1)+"%）";
  windows();
 }
 function radial(){
  if(!imageData)return;const k=+C("k1").value/300,w=640,h=360,src=imageData.data,out=X("calibOut").createImageData(w,h),o=out.data,cx=319.5,cy=179.5,norm=Math.sqrt(cx*cx+cy*cy);
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const nx=(x-cx)/norm,ny=(y-cy)/norm,f=1+k*(nx*nx+ny*ny),sx=Math.round(cx+(x-cx)*f),sy=Math.round(cy+(y-cy)*f),di=(y*w+x)*4;if(sx>=0&&sx<w&&sy>=0&&sy<h){const si=(sy*w+sx)*4;o[di]=src[si];o[di+1]=src[si+1];o[di+2]=src[si+2];}o[di+3]=255;}
  X("calibOut").putImageData(out,0,0);C("kval").textContent=C("k1").value;status("calibStats","畸变模拟系数 k1="+k.toFixed(3)+"；仅作原理演示，不是相机真实标定参数");
 }
 function perspective(){
  if(!img)return;const top=+C("top").value/100,tw=+C("topwidth").value/100,bw=+C("bottom").value/100;
  const src=[[320-320*tw,360*top],[320+320*tw,360*top],[320+320*bw,350],[320-320*bw,350]],dst=[[0,0],[639,0],[639,359],[0,359]],A=[],b=[];
  for(let i=0;i<4;i++){const [u,v]=dst[i],[x,y]=src[i];A.push([u,v,1,0,0,0,-x*u,-x*v]);b.push(x);A.push([0,0,0,u,v,1,-y*u,-y*v]);b.push(y);}
  const H=solve(A,b);if(!H){status("perspectiveStats","透视矩阵不可逆，请调整参数");return;}
  const srcData=imageData.data,out=X("bird").createImageData(640,360),o=out.data;
  for(let y=0;y<360;y++)for(let x=0;x<640;x++){const den=H[6]*x+H[7]*y+1;if(Math.abs(den)<1e-8)continue;const sx=Math.round((H[0]*x+H[1]*y+H[2])/den),sy=Math.round((H[3]*x+H[4]*y+H[5])/den);if(sx<0||sx>=640||sy<0||sy>=360)continue;const si=(sy*640+sx)*4,di=(y*640+x)*4;o[di]=srcData[si];o[di+1]=srcData[si+1];o[di+2]=srcData[si+2];o[di+3]=255;}
  X("bird").putImageData(out,0,0);C("topval").textContent=C("top").value+"%";C("widthval").textContent=C("topwidth").value+"%";C("bottomval").textContent=C("bottom").value+"%";
  let n=0;for(let i=3;i<o.length;i+=4)if(o[i])n++;status("perspectiveStats","浏览器实时透视变换完成；有效映射区域 "+(100*n/(640*360)).toFixed(1)+"%");
 }
 function quad(){
  if(!img)return;const x=X("quad");x.clearRect(0,0,640,360);x.drawImage(img,0,0,640,360);
  const t=+C("top").value/100,w=+C("topwidth").value/100,b=+C("bottom").value/100,p=[[320-320*w,360*t],[320+320*w,360*t],[320+320*b,350],[320-320*b,350]];
  x.beginPath();p.forEach((q,i)=>i?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1]));x.closePath();x.fillStyle="rgba(23,103,172,.18)";x.fill();x.strokeStyle="#0784d5";x.lineWidth=3;x.stroke();p.forEach(q=>{x.beginPath();x.arc(q[0],q[1],6,0,7);x.fillStyle="#f59e0b";x.fill();});
 }
 function fit(points){if(points.length<12)return null;const A=[[0,0,0],[0,0,0],[0,0,0]],b=[0,0,0];for(const p of points){const v=[p.y*p.y,p.y,1];for(let i=0;i<3;i++){b[i]+=v[i]*p.x;for(let j=0;j<3;j++)A[i][j]+=v[i]*v[j];}}return solve(A,b);}
 function windows(){
  if(!maskData)return;const w=640,h=360,n=+C("nwin").value,m=+C("margin").value,d=maskData.data,hist=new Int32Array(w),leftPts=[],rightPts=[];
  for(let y=180;y<h;y++)for(let x=0;x<w;x++)if(d[(y*w+x)*4]>200)hist[x]++;
  let l=0,r=320;for(let x=1;x<320;x++)if(hist[x]>hist[l])l=x;for(let x=321;x<w;x++)if(hist[x]>hist[r])r=x;
  const band=Math.max(1,Math.floor(h/n)),wx=X("windowCanvas"),fx=X("fitCanvas");wx.putImageData(maskData,0,0);fx.putImageData(maskData,0,0);let nl=0,nr=0;
  for(let k=0;k<n;k++){const y1=h-k*band,y0=Math.max(0,y1-band),lx0=Math.max(0,l-m),lx1=Math.min(w,l+m),rx0=Math.max(0,r-m),rx1=Math.min(w,r+m);let sl=0,sr=0,cl=0,cr=0;
   for(let y=y0;y<y1;y++)for(let x=lx0;x<lx1;x++)if(d[(y*w+x)*4]>200){sl+=x;cl++;leftPts.push({x,y});}
   for(let y=y0;y<y1;y++)for(let x=rx0;x<rx1;x++)if(d[(y*w+x)*4]>200){sr+=x;cr++;rightPts.push({x,y});}
   nl+=cl;nr+=cr;wx.strokeStyle="#00b36b";wx.lineWidth=2;wx.strokeRect(lx0,y0,lx1-lx0,y1-y0);wx.strokeStyle="#1685d8";wx.strokeRect(rx0,y0,rx1-rx0,y1-y0);if(cl>8)l=Math.round(sl/cl);if(cr>8)r=Math.round(sr/cr);
  }
  const lf=fit(leftPts),rf=fit(rightPts);function curve(c,color){if(!c)return;fx.beginPath();for(let y=0;y<h;y+=2){const x=c[0]*y*y+c[1]*y+c[2];if(y===0)fx.moveTo(x,y);else fx.lineTo(x,y);}fx.strokeStyle=color;fx.lineWidth=4;fx.stroke();}
  curve(lf,"#ffb000");curve(rf,"#00d7ff");for(const p of leftPts){fx.fillStyle="#ffb000";fx.fillRect(p.x,p.y,2,2);}for(const p of rightPts){fx.fillStyle="#00d7ff";fx.fillRect(p.x,p.y,2,2);}
  C("nval").textContent=n;C("mval").textContent=m;status("windowStats","窗口选中像素：左 "+nl+"、右 "+nr+"；"+(lf&&rf?"已绘制左右二次拟合曲线":"候选像素不足，无法稳定拟合"));
 }
 async function loadScene(){
  try{const p=paths[scene.value];img=await loadImage(base+p.image);imageData=getPixels();["source","calibSrc","quad"].forEach(id=>draw(C(id),img));threshold();quad();perspective();radial();C("binaryRef").src=base+p.binary+"?v=3";status("loadStats",labels[scene.value]+"素材已加载");
   [C("compare"),C("processed"),C("liveVideo")].forEach(v=>{v.pause();});C("compare").src=base+"videos/"+p.compare;C("processed").src=base+"videos/"+p.processed;C("compare").load();C("processed").load();C("liveVideo").src=base+"videos/"+p.compare;C("liveVideo").load();status("videoScene",labels[scene.value]+"：原始与处理结果已加载");
  }catch(e){status("loadStats",e.message);console.error(e);}
 }
 document.querySelectorAll("[data-tab]").forEach(b=>b.addEventListener("click",()=>{const a=b.dataset.tab;document.querySelectorAll("[data-tab]").forEach(x=>x.classList.toggle("active",x===b));panels.forEach(p=>C(p).classList.toggle("hidden",p!==a));}));
 scene.addEventListener("change",loadScene);
 function range(id,fn,out,suffix){C(id).addEventListener("input",()=>{if(out)C(out).textContent=C(id).value+(suffix||"");fn();});}
 range("light",threshold,"lval");range("grad",threshold,"gval");["top","topwidth","bottom"].forEach(id=>range(id,()=>{quad();perspective();},id==="top"?"topval":id==="topwidth"?"widthval":"bottomval","%"));range("nwin",windows,"nval");range("margin",windows,"mval");range("k1",radial,"kval");
 range("speed",()=>{const r=+C("speed").value/100;C("compare").playbackRate=r;C("processed").playbackRate=r;C("speedval").textContent=r.toFixed(2)+"×";},"speedval","×");
 const a=C("compare"),b=C("processed"),seek=C("seek");function sync(src,dst){if(busy)return;busy=true;const t=src.currentTime;if(Number.isFinite(t)&&Math.abs(dst.currentTime-t)>.12)dst.currentTime=t;seek.value=Math.round(t*100);C("seekval").textContent=t.toFixed(1)+" s";busy=false;}
 a.addEventListener("timeupdate",()=>sync(a,b));b.addEventListener("timeupdate",()=>sync(b,a));seek.addEventListener("input",()=>{const t=+seek.value/100;[a,b].forEach(v=>{if(Number.isFinite(v.duration)&&v.duration>0)v.currentTime=Math.min(t,v.duration);});C("seekval").textContent=t.toFixed(1)+" s";});
 loadScene();
})();