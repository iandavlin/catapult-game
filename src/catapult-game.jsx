import { useState, useEffect, useRef, useCallback } from "react";

const FW=1400,FH=800;
const BR=11,BS=28,MP=100;
const MT=100,MK=1200;
const FLOOR_Y=FH-14,CEIL_Y=14;
const CL=35,CW=14;
const TANK_W=44,TANK_H=28;
let gid=0;const nGid=()=>++gid;

const DEF={gv:0.15,bnc:0.78,fr:0.999,ff:0.95,sc:0.055,sb:0.7,pm:0.34,
  settleSpd:0.08,settleStuck:200,maxBallVel:50,maxBounces:30,
  numBlocks:22,numGrey:6,numPowerups:4,greyHits:3,
  ceilBlocks:2,floorBlocks:3,centerBlocks:6,barrierH:5,ceilBarrierH:5,
  fallGrav:0.12,fallMaxSpd:8,fallDamp:0.3,puVel:4,
  roundColored:3,winScore:500,tankKillPts:100,maxAmmo:3,puSpread:5,tankSpd:4};

const LOGO="data:image/png;base64,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";

const SHAPES=[
  {c:[[0,0],[1,0],[2,0],[3,0]],col:"#00d4e6"},
  {c:[[0,0],[1,0],[0,1],[1,1]],col:"#ffd000"},
  {c:[[0,0],[1,0],[2,0],[1,1]],col:"#bb44dd"},
  {c:[[0,0],[1,0],[2,0],[2,1]],col:"#ff8800"},
  {c:[[0,0],[1,0],[2,0],[0,1]],col:"#3388ff"},
  {c:[[1,0],[2,0],[0,1],[1,1]],col:"#44cc44"},
  {c:[[0,0],[1,0],[1,1],[2,1]],col:"#ff4455"},
];
const rS=()=>SHAPES[Math.floor(Math.random()*SHAPES.length)];
function rotC(c){const m=Math.max(...c.map(v=>v[1]));return c.map(([x,y])=>[m-y,x]);}
function getC(s,r){let c=[...s.c];for(let i=0;i<r;i++)c=rotC(c);return c;}
const P1C=["#1a3d6e","#2255aa","#3377cc","#4499ee","#55bbff"];
const P2C=["#6e1a1a","#aa3322","#cc5544","#ee6655","#ff8877"];
const GREY_COLS=["#2e3848","#4a5a6a","#7a8a9a"];
function teamCol(side){const i=Math.floor(Math.random()*P1C.length);return side===0?P1C[i]:P2C[i];}
function greyCol(hitsLeft,maxHits){const i=Math.min(2,Math.floor((maxHits-hitsLeft)*3/maxHits));return GREY_COLS[i];}
function mirrorRects(rects){return rects.map(r=>({...r,x:FW-r.x-r.w}));}

function overlaps(r,bl){for(const b of bl){if(r.x<b.x+b.w&&r.x+r.w>b.x&&r.y<b.y+b.h&&r.y+r.h>b.y)return true;}return false;}
function brc(bx,by,vx,vy,sp,r,bnc,sb){const cx=Math.max(r.x,Math.min(bx,r.x+r.w)),cy=Math.max(r.y,Math.min(by,r.y+r.h)),dx=bx-cx,dy=by-cy,d=Math.sqrt(dx*dx+dy*dy);
  if(d<BR){const nx=d>0?dx/d:0,ny=d>0?dy/d:-1,dot=vx*nx+vy*ny,tx=-ny,ty=nx;return{hit:true,vx:(vx-2*dot*nx)*bnc+tx*sp*sb,vy:(vy-2*dot*ny)*bnc+ty*sp*sb,px:cx+nx*(BR+1),py:cy+ny*(BR+1),ns:sp*.65};}return{hit:false};}
function ballBall(balls){for(let i=0;i<balls.length;i++){if(balls[i].settled)continue;for(let j=i+1;j<balls.length;j++){if(balls[j].settled)continue;const a=balls[i],b=balls[j],dx=b.x-a.x,dy=b.y-a.y,d=Math.sqrt(dx*dx+dy*dy);
  if(d<BR*2&&d>0){const nx=dx/d,ny=dy/d,dvn=(a.vx-b.vx)*nx+(a.vy-b.vy)*ny;if(dvn>0){a.vx-=dvn*nx*.8;a.vy-=dvn*ny*.8;b.vx+=dvn*nx*.8;b.vy+=dvn*ny*.8;const ov=BR*2-d;a.x-=nx*ov/2;a.y-=ny*ov/2;b.x+=nx*ov/2;b.y+=ny*ov/2;}}}}
}

const PC=["#2288ee","#ee3344"],PL=["#88ccff","#ff8899"];
let debris=[];let floatTexts=[];let hoverParts=[];

function tickBlockFall(blocks,cfg){
  const fg=cfg.fallGrav,fmax=cfg.fallMaxSpd,fdamp=cfg.fallDamp;
  const groups={};for(const b of blocks){const gk=b.groupId;if(!groups[gk])groups[gk]=[];groups[gk].push(b);}
  for(const gk in groups){
    const grp=groups[gk];if(grp[0].isGrey||grp[0].isBarrier)continue;
    let supported=false;
    for(const b of grp){
      if(b.y+BS>=FLOOR_Y-1){supported=true;break;}
      for(const b2 of blocks){if(b2.groupId===b.groupId)continue;
        if(b.x<b2.x+b2.w-2&&b.x+b.w>b2.x+2&&Math.abs(b2.y-(b.y+BS))<4){supported=true;break;}}
      if(supported)break;}
    if(!supported){
      const vy=Math.min((grp[0].vy||0)+fg,fmax);let maxDrop=vy;
      for(const b of grp){const tf=FLOOR_Y-BS-b.y;if(tf<maxDrop)maxDrop=Math.max(0,tf);
        for(const b2 of blocks){if(b2.groupId===b.groupId)continue;
          if(b.x<b2.x+b2.w-2&&b.x+b.w>b2.x+2&&b2.y>b.y&&b2.y<b.y+BS+vy+2){const gap=b2.y-b.y-BS;if(gap>=0&&gap<maxDrop)maxDrop=gap;}}}
      for(const b of grp){b.y+=maxDrop;b.vy=maxDrop<0.5?(vy>1?-vy*fdamp:0):vy;if(b.y+BS>FLOOR_Y)b.y=FLOOR_Y-BS;}
    } else {for(const b of grp){if(b.vy&&b.vy>0)b.vy=0;}}}
  return blocks;
}

function gravDrop(shape,px,rot,bl,floorY,ceilY){
  const cells=getC(shape,rot);const rects=cells.map(([cx,cy])=>({x:px+cx*BS,y:ceilY+cy*BS,w:BS,h:BS}));
  let maxDrop=floorY;
  for(const r of rects){let flr=floorY-BS;for(const b of bl){if(r.x<b.x+b.w&&r.x+r.w>b.x&&b.y>r.y){const l=b.y-BS;if(l<flr)flr=l;}}if(flr-r.y<maxDrop)maxDrop=flr-r.y;}
  if(maxDrop<0)return null;const dropped=rects.map(r=>({...r,y:r.y+maxDrop}));
  for(const r of dropped){if(r.x<0||r.x+r.w>FW||r.y<ceilY||r.y+r.h>floorY)return null;if(overlaps(r,bl))return null;}
  return dropped;
}

function placeColoredLeft(bl,sL,sR,floorY,ceilY){
  const s=rS(),rot=Math.floor(Math.random()*4),g=nGid();
  for(let t=0;t<80;t++){const px=Math.round((sL+Math.random()*(sR-sL-BS*5))/BS)*BS;
    const d=gravDrop(s,px,rot,bl,floorY,ceilY);
    if(d){let ok=true;for(const r of d){if(r.x<sL||r.x+r.w>sR){ok=false;break;}}
      if(ok){const col=teamCol(0);for(const r of d)bl.push({...r,color:col,player:-1,id:Math.random(),groupId:g,isGrey:false,vy:0});
        return{rects:d,shape:s,rot};}}}
  return null;
}
function placeGreyLeft(bl,sL,sR,floorY,ceilY,maxHits){
  const s=rS(),rot=Math.floor(Math.random()*4),g=nGid();const cells=getC(s,rot);
  for(let t=0;t<80;t++){const px=Math.round((sL+Math.random()*(sR-sL-BS*5))/BS)*BS;
    const py=Math.round((ceilY+Math.random()*(floorY-ceilY-BS*3))/BS)*BS;
    const rects=cells.map(([cx,cy])=>({x:px+cx*BS,y:py+cy*BS,w:BS,h:BS}));let ok=true;
    for(const r of rects){if(r.x<sL||r.x+r.w>sR||r.y<ceilY||r.y+r.h>floorY){ok=false;break;}if(overlaps(r,bl)){ok=false;break;}}
    if(ok){const col=greyCol(maxHits,maxHits);
      for(const r of rects)bl.push({...r,color:col,player:-1,id:Math.random(),groupId:g,isGrey:true,vy:0,hits:maxHits});
      return{rects};}}
  return null;
}

function genField(cfg){
  const bl=[];const nb=cfg.numBlocks,ng=cfg.numGrey,np=cfg.numPowerups;
  const floorY=FLOOR_Y-cfg.floorBlocks*BS,ceilY=cfg.ceilBlocks*BS;
  const centerX=FW/2,margin=cfg.centerBlocks*BS,sL=margin,sR=FW-margin;
  const bx0=Math.round(centerX/BS)*BS-BS/2;const barGid=nGid();
  for(let row=0;row<cfg.barrierH;row++){const by=FLOOR_Y-BS*(row+1);if(by<ceilY)continue;
    bl.push({x:bx0,y:by,w:BS,h:BS,color:"#1a2a3a",player:-1,id:Math.random(),groupId:barGid,isGrey:true,isBarrier:true,vy:0,hits:999});}
  const cbarGid=nGid();
  for(let row=0;row<cfg.ceilBarrierH;row++){const by=CEIL_Y+BS*row;if(by+BS>floorY)continue;
    bl.push({x:bx0,y:by,w:BS,h:BS,color:"#1a2a3a",player:-1,id:Math.random(),groupId:cbarGid,isGrey:true,isBarrier:true,vy:0,hits:999});}
  const halfG=Math.ceil(ng/2);
  for(let i=0;i<halfG;i++){const res=placeGreyLeft(bl,sL,centerX-BS,floorY,ceilY,cfg.greyHits);
    if(res){const mr=mirrorRects(res.rects);const gR=nGid();let ok=true;
      for(const r of mr){if(overlaps(r,bl)){ok=false;break;}}
      if(ok)for(const r of mr)bl.push({...r,color:greyCol(cfg.greyHits,cfg.greyHits),player:-1,id:Math.random(),groupId:gR,isGrey:true,vy:0,hits:cfg.greyHits});}}
  const halfB=Math.ceil(nb/2);
  for(let i=0;i<halfB;i++){const res=placeColoredLeft(bl,sL,centerX-BS,floorY,ceilY);
    if(res){const mr=mirrorRects(res.rects);const gR=nGid();const col=teamCol(1);let ok=true;
      for(const r of mr){if(r.x<centerX+BS||r.x+r.w>sR){ok=false;break;}if(overlaps(r,bl)){ok=false;break;}}
      if(ok)for(const r of mr)bl.push({...r,color:col,player:-1,id:Math.random(),groupId:gR,isGrey:false,vy:0});}}
  const halfPU=Math.ceil(np/2);let puP=0;
  for(let i=0;i<60&&puP<halfPU;i++){const px=Math.round((sL+Math.random()*(centerX-BS-sL-BS))/BS)*BS;
    const py=Math.round((ceilY+Math.random()*(floorY-ceilY-BS))/BS)*BS;const r={x:px,y:py,w:BS,h:BS};
    if(r.x>=sL&&r.x+r.w<=centerX-BS&&r.y>=ceilY&&r.y+r.h<=floorY&&!overlaps(r,bl)){
      bl.push({...r,color:"#ff00ff",player:-1,id:Math.random(),groupId:nGid(),isGrey:true,hasPowerup:true,vy:0,hits:1});
      const mx=FW-r.x-r.w;const mr2={x:mx,y:r.y,w:BS,h:BS};
      if(!overlaps(mr2,bl))bl.push({...mr2,color:"#ff00ff",player:-1,id:Math.random(),groupId:nGid(),isGrey:true,hasPowerup:true,vy:0,hits:1});
      puP++;}}
  return bl;
}

function addRoundBlocks(bl,cfg,round,diff){
  const floorY=FLOOR_Y-cfg.floorBlocks*BS,ceilY=cfg.ceilBlocks*BS;
  const centerX=FW/2,margin=cfg.centerBlocks*BS,sL=margin,sR=FW-margin;
  const drops=[];
  let curGL=0;for(const b of bl){if(!b.isBarrier&&!b.hasPowerup&&b.isGrey&&b.x+b.w/2<centerX)curGL++;}
  const needG=Math.max(0,Math.ceil(cfg.numGrey/2)-Math.floor(curGL/3));
  for(let i=0;i<needG;i++){const res=placeGreyLeft(bl,sL,centerX-BS,floorY,ceilY,cfg.greyHits);
    if(res){const mr=mirrorRects(res.rects);const gR=nGid();let ok=true;
      for(const r of mr){if(overlaps(r,bl)){ok=false;break;}}
      if(ok)for(const r of mr)bl.push({...r,color:greyCol(cfg.greyHits,cfg.greyHits),player:-1,id:Math.random(),groupId:gR,isGrey:true,vy:0,hits:cfg.greyHits});}}
  const shadow=[...bl];const base=cfg.roundColored;
  const extraL=diff>0?diff:0,extraR=diff<0?-diff:0;
  let cSide=round%2;
  for(let i=0;i<base;i++){
    const s=rS(),rot=Math.floor(Math.random()*4);
    for(let t=0;t<80;t++){const px=Math.round((sL+Math.random()*(centerX-BS-sL-BS*5))/BS)*BS;
      const d=gravDrop(s,px,rot,shadow,floorY,ceilY);
      if(d){let ok=true;for(const r of d){if(r.x<sL||r.x+r.w>centerX-BS){ok=false;break;}}
        const topY=Math.min(...d.map(r=>r.y));if(topY<ceilY+BS)ok=false;
        if(ok){const gL=nGid(),gR=nGid(),cL=teamCol(0),cR=teamCol(1);
          drops.push({shape:s,targetX:px,targetRot:rot,groupId:gL,rects:d,col:cL});
          for(const r of d)shadow.push({...r,color:cL,player:-1,id:Math.random(),groupId:gL,isGrey:false,vy:0});
          const mx=FW-px-BS*Math.max(...getC(s,rot).map(c2=>c2[0]))-BS;
          const d2=gravDrop(s,mx,rot,shadow,floorY,ceilY);
          if(d2){let ok2=true;for(const r of d2){if(r.x<centerX+BS||r.x+r.w>sR){ok2=false;break;}}
            if(ok2){drops.push({shape:s,targetX:mx,targetRot:rot,groupId:gR,rects:d2,col:cR});
              for(const r of d2)shadow.push({...r,color:cR,player:-1,id:Math.random(),groupId:gR,isGrey:false,vy:0});}}
          break;}}}}
  for(let i=0;i<extraL;i++){const s=rS(),rot=Math.floor(Math.random()*4),g=nGid(),col=teamCol(0);
    for(let t=0;t<40;t++){const px=Math.round((sL+Math.random()*(centerX-BS-sL-BS*5))/BS)*BS;
      const d=gravDrop(s,px,rot,shadow,floorY,ceilY);
      if(d){let ok=true;for(const r of d){if(r.x<sL||r.x+r.w>centerX-BS){ok=false;break;}}
        if(ok){drops.push({shape:s,targetX:px,targetRot:rot,groupId:g,rects:d,col});
          for(const r of d)shadow.push({...r,color:col,player:-1,id:Math.random(),groupId:g,isGrey:false,vy:0});break;}}}}
  for(let i=0;i<extraR;i++){const s=rS(),rot=Math.floor(Math.random()*4),g=nGid(),col=teamCol(1);
    for(let t=0;t<40;t++){const px=Math.round((centerX+BS+Math.random()*(sR-centerX-BS-BS*5))/BS)*BS;
      const d=gravDrop(s,px,rot,shadow,floorY,ceilY);
      if(d){let ok=true;for(const r of d){if(r.x<centerX+BS||r.x+r.w>sR){ok=false;break;}}
        if(ok){drops.push({shape:s,targetX:px,targetRot:rot,groupId:g,rects:d,col});
          for(const r of d)shadow.push({...r,color:col,player:-1,id:Math.random(),groupId:g,isGrey:false,vy:0});break;}}}}
  return{blocks:bl,drops};
}

// Tank-block collision: returns true if tank rect at (tx,ty) overlaps any block
function tankBlockCol(tx,ty,blocks){
  const hw=TANK_W/2,hh=TANK_H/2;
  for(const b of blocks){
    if(tx-hw<b.x+b.w&&tx+hw>b.x&&ty-hh<b.y+b.h&&ty+hh>b.y)return true;
  }
  return false;
}

// Default tank starting positions
const T1_START={x:FW*0.12,y:FLOOR_Y-50};
const T2_START={x:FW*0.88,y:FLOOR_Y-50};

// Fire ball — angle is absolute radians
function fb(pi,a,pm,tipX,tipY,maxVel){
  const rad=a.angle;const spd=Math.min(a.power*pm,maxVel);
  const dx=Math.cos(rad),dy=Math.sin(rad);
  return{x:tipX+dx*CL,y:tipY+dy*CL,vx:dx*spd,vy:dy*spd,spin:a.spin,trail:[],player:pi,scored:false,settled:false,rot:0,stuckTicks:0,bounces:0,streak:0};
}

function init(cfg){debris=[];floatTexts=[];hoverParts=[];gid=0;const c=cfg||DEF;const bl=genField(c);
  const{blocks:bl2,drops}=addRoundBlocks(bl,c,0,0);
  const fp=Math.random()<0.5?"p1":"p2";const ao=[fp,fp==="p1"?"p2":"p1"];
  const base={scores:[0,0],blocks:bl2,
    aims:[{angle:-Math.PI/4,power:60,spin:0},{angle:Math.PI+Math.PI/4,power:60,spin:0}],
    tankPos:[{...T1_START},{...T2_START}],cannonDisabled:[false,false],balls:[],round:1,
    winner:-1,fireTicks:0,volley:1,pendingPts:[0,0],ammo:[1,1],shotQ:[],aimOrder:ao,
    blocksBroken:[0,0],dropAnim:null,dropQ:[]};
  if(drops.length>0)return{...base,phase:"dropping",msg:"Setting the board...",dropQ:drops};
  return{...base,phase:ao[0]+"aim",msg:ao[0].toUpperCase()+" aims first"};}

export default function CG(){
  const cv=useRef(null),sR=useRef(null),rf=useRef(null),logoImg=useRef(null);
  const[ph,setPh]=useState({...DEF});const phR=useRef(ph);phR.current=ph;
  const[gs,setGs]=useState(()=>init(DEF));sR.current=gs;
  const set=useCallback((u)=>setGs(p=>{const n=typeof u==="function"?u(p):{...p,...u};sR.current=n;return n;}),[]);
  const[showDbg,setShowDbg]=useState(false);
  const keysDown=useRef(new Set());
  const DASH_H=60;
  const[dims,setDims]=useState({w:window.innerWidth,h:window.innerHeight});
  useEffect(()=>{const onR=()=>setDims({w:window.innerWidth,h:window.innerHeight});window.addEventListener("resize",onR);return()=>window.removeEventListener("resize",onR);},[]);
  const VW=dims.w,VH=dims.h-DASH_H,ZM=Math.min(VW/FW,VH/FH);
  const vwRef=useRef(VW),vhRef=useRef(VH),zmRef=useRef(ZM);vwRef.current=VW;vhRef.current=VH;zmRef.current=ZM;
  useEffect(()=>{const img=new Image();img.src=LOGO;img.onload=()=>{logoImg.current=img;};},[]);

  const draw=useCallback(()=>{
    const c=cv.current;if(!c)return;const x=c.getContext("2d"),g=sR.current;const P=phR.current;
    const _VW=vwRef.current,_VH=vhRef.current,_ZM=zmRef.current;
    x.save();x.fillStyle="#050508";x.fillRect(0,0,_VW,_VH);x.scale(_ZM,_ZM);
    x.fillStyle="#08080e";x.fillRect(0,0,FW,FH);
    for(let y=0;y<FH;y+=4){x.fillStyle=y%8===0?"rgba(255,255,255,0.004)":"rgba(0,0,0,0.01)";x.fillRect(0,y,FW,2);}
    const ceilY=P.ceilBlocks*BS,floorY=FLOOR_Y-P.floorBlocks*BS,margin=P.centerBlocks*BS;
    x.fillStyle="rgba(255,255,255,0.015)";x.fillRect(0,0,FW,ceilY);x.fillRect(0,floorY,FW,FH-floorY);
    x.fillStyle="rgba(255,255,255,0.01)";x.fillRect(0,ceilY,margin,floorY-ceilY);x.fillRect(FW-margin,ceilY,margin,floorY-ceilY);
    x.fillStyle="#1a1a1a";x.fillRect(0,FH-12,FW,12);x.fillStyle="#333";x.fillRect(0,FH-14,FW,2);
    x.fillStyle="#1a1a1a";x.fillRect(0,0,FW,CEIL_Y);

    // Hover particles
    for(let i=hoverParts.length-1;i>=0;i--){
      const hp=hoverParts[i];hp.y+=hp.vy;hp.x+=hp.vx;hp.life-=0.025;
      if(hp.life<=0){hoverParts.splice(i,1);continue;}
      x.globalAlpha=hp.life*0.5;x.fillStyle=hp.color;
      x.beginPath();x.arc(hp.x,hp.y,hp.sz,0,Math.PI*2);x.fill();x.globalAlpha=1;
    }

    // Hovering tanks
    const now=Date.now();
    for(let pi=0;pi<2;pi++){
      const tp=g.tankPos[pi];
      const col=PC[pi],li=PL[pi];
      const label=["P1","P2"][pi];
      const aim=g.aims[pi];
      const active=(g.phase==="p1aim"&&pi===0)||(g.phase==="p2aim"&&pi===1);
      const disabled=g.cannonDisabled[pi];
      const bob=Math.sin(now/300+pi*Math.PI)*3;
      const drawY=tp.y+bob;

      x.globalAlpha=disabled?0.25:1;

      // Hover glow (pulsing ellipse beneath tank)
      const pulse=0.5+Math.sin(now/200+pi*2)*0.3;
      x.save();
      x.shadowColor=col;x.shadowBlur=25*pulse;
      x.fillStyle=col+(active?"55":"28");
      x.beginPath();x.ellipse(tp.x,tp.y+TANK_H/2+12,24,9,0,0,Math.PI*2);x.fill();
      x.shadowBlur=0;x.restore();

      // Thrust lines beneath tank
      for(let ti=0;ti<4;ti++){
        const tx2=tp.x-12+ti*8;
        const tl=5+Math.sin(now/80+ti*1.7+pi*4)*4;
        x.strokeStyle=col+"55";x.lineWidth=1.5;
        x.beginPath();x.moveTo(tx2,tp.y+TANK_H/2+bob+3);x.lineTo(tx2,tp.y+TANK_H/2+bob+3+tl);x.stroke();
      }

      // Tank body (rounded rect)
      x.save();x.translate(tp.x,drawY);
      const bw=TANK_W,bh=TANK_H,cr=5;
      x.fillStyle="#2a2a2a";
      x.beginPath();
      x.moveTo(-bw/2+cr,-bh/2);x.lineTo(bw/2-cr,-bh/2);x.arcTo(bw/2,-bh/2,bw/2,-bh/2+cr,cr);
      x.lineTo(bw/2,bh/2-cr);x.arcTo(bw/2,bh/2,bw/2-cr,bh/2,cr);
      x.lineTo(-bw/2+cr,bh/2);x.arcTo(-bw/2,bh/2,-bw/2,bh/2-cr,cr);
      x.lineTo(-bw/2,-bh/2+cr);x.arcTo(-bw/2,-bh/2,-bw/2+cr,-bh/2,cr);
      x.closePath();x.fill();
      // Inner panel
      x.fillStyle="#383838";x.fillRect(-bw/2+4,-bh/2+4,bw-8,bh-8);
      // Side accents
      x.fillStyle=col+"44";x.fillRect(-bw/2+1,-bh/2+2,3,bh-4);x.fillRect(bw/2-4,-bh/2+2,3,bh-4);

      // Turret pivot
      x.fillStyle="#555";x.beginPath();x.arc(0,0,11,0,Math.PI*2);x.fill();
      x.fillStyle=col+"66";x.beginPath();x.arc(0,0,8,0,Math.PI*2);x.fill();

      // Barrel (rotates to absolute aim angle)
      x.save();x.rotate(aim.angle);
      if(active){x.shadowColor=li;x.shadowBlur=10;}
      x.fillStyle=col;x.fillRect(4,-CW/2,CL-4,CW);
      x.fillStyle="#888";x.fillRect(CL-4,-CW/2-2,6,CW+4);
      x.shadowBlur=0;x.restore();

      // Power meter (below tank body)
      const mW=50,mH=6;
      x.fillStyle="#0a0a0a";x.fillRect(-mW/2,bh/2+5,mW,mH);
      const pc=aim.power/MP;
      let cR2,cG2;if(pc<.5){cR2=Math.round(pc*2*255);cG2=255;}else{cR2=255;cG2=Math.round((1-(pc-.5)*2)*255);}
      x.fillStyle=`rgb(${cR2},${cG2},0)`;x.fillRect(-mW/2+1,bh/2+6,(mW-2)*pc,mH-2);

      // Label above tank
      x.fillStyle="#fff";x.font="bold 12px monospace";x.textAlign="center";x.fillText(label,0,-bh/2-10);
      if(disabled){x.fillStyle="#ff0000";x.font="bold 10px monospace";x.fillText("DISABLED",0,-bh/2-22);}

      // Ammo badge
      const am=g.ammo?g.ammo[pi]:1;
      if(am>1){x.fillStyle="#ff00ff";x.font="bold 10px monospace";x.fillText("\u00d7"+am,0,bh/2+20);}

      x.globalAlpha=1;x.restore();
    }

    // Blocks
    for(const b of g.blocks){
      if(b.isBarrier){x.fillStyle="#0d1520";x.fillRect(b.x,b.y,b.w,b.h);x.strokeStyle="#2a4060";x.lineWidth=2;x.strokeRect(b.x+1,b.y+1,b.w-2,b.h-2);
        x.strokeStyle="#1a3050";x.lineWidth=1;x.beginPath();x.moveTo(b.x,b.y);x.lineTo(b.x+b.w,b.y+b.h);x.stroke();x.beginPath();x.moveTo(b.x+b.w,b.y);x.lineTo(b.x,b.y+b.h);x.stroke();
      } else if(b.isGrey&&!b.hasPowerup){
        x.fillStyle=b.color||GREY_COLS[0];x.fillRect(b.x,b.y,b.w,b.h);x.strokeStyle="#6a7a8a";x.lineWidth=1;x.strokeRect(b.x+.5,b.y+.5,b.w-1,b.h-1);
        if(b.hits>0){x.fillStyle="#fff8";x.font="bold 8px monospace";x.textAlign="center";x.fillText(b.hits,b.x+b.w/2,b.y+b.h/2+3);}
      } else {x.fillStyle=b.color;x.fillRect(b.x+1,b.y+1,b.w-2,b.h-2);
        x.fillStyle="rgba(255,255,255,0.12)";x.fillRect(b.x+1,b.y+1,b.w-2,2);x.fillStyle="rgba(0,0,0,0.18)";x.fillRect(b.x+1,b.y+b.h-3,b.w-2,2);
        x.strokeStyle="rgba(255,255,255,0.06)";x.lineWidth=1;x.strokeRect(b.x+1,b.y+1,b.w-2,b.h-2);
        if(b.hasPowerup){x.shadowColor="#ff00ff";x.shadowBlur=5;x.strokeStyle="#ff00ff";x.lineWidth=2;x.strokeRect(b.x+3,b.y+3,b.w-6,b.h-6);
          x.fillStyle="#fff";x.font="bold 10px monospace";x.textAlign="center";x.fillText("SP",b.x+b.w/2,b.y+b.h/2+4);x.shadowBlur=0;}}}
    // Drop anim
    if(g.dropAnim){const ad=g.dropAnim,cells=getC(ad.shape,ad.rot),col=ad.col||"#888";
      for(const[cx2,cy2]of cells){x.fillStyle=col+"cc";x.fillRect(ad.x+cx2*BS+1,ad.y+cy2*BS+1,BS-2,BS-2);}}
    // Debris
    for(let i=debris.length-1;i>=0;i--){const d=debris[i];d.x+=d.vx;d.y+=d.vy;d.vy+=.15;d.life-=.025;
      if(d.life<=0){debris.splice(i,1);continue;}x.globalAlpha=d.life;x.fillStyle=d.color;x.fillRect(d.x-d.sz/2,d.y-d.sz/2,d.sz,d.sz);x.globalAlpha=1;}
    // Float texts
    for(let i=floatTexts.length-1;i>=0;i--){const ft=floatTexts[i];ft.y-=1.2;ft.life-=0.02;
      if(ft.life<=0){floatTexts.splice(i,1);continue;}
      x.globalAlpha=Math.min(1,ft.life*2);x.fillStyle=ft.color;x.font="bold "+ft.sz+"px monospace";x.textAlign="center";
      x.fillText(ft.text,ft.x,ft.y);x.globalAlpha=1;}
    // Balls
    for(const b of g.balls){
      if(b.trail&&b.trail.length>1)for(let i=1;i<b.trail.length;i++){const t=i/b.trail.length;
        x.fillStyle=b.player===0?`rgba(34,136,238,${t*.12})`:`rgba(238,51,68,${t*.12})`;x.beginPath();x.arc(b.trail[i].x,b.trail[i].y,BR*t*.5,0,Math.PI*2);x.fill();}
      x.save();x.translate(b.x,b.y);x.rotate(b.rot||0);
      if(logoImg.current){x.beginPath();x.arc(0,0,BR,0,Math.PI*2);x.clip();x.drawImage(logoImg.current,-BR,-BR,BR*2,BR*2);}
      else{const bg=x.createRadialGradient(-2,-2,0,0,0,BR);bg.addColorStop(0,"#fff");bg.addColorStop(.3,PL[b.player]);bg.addColorStop(1,PC[b.player]);x.fillStyle=bg;x.beginPath();x.arc(0,0,BR,0,Math.PI*2);x.fill();}
      x.restore();x.shadowColor=PL[b.player];x.shadowBlur=8;x.strokeStyle=PL[b.player]+"66";x.lineWidth=1.5;
      x.beginPath();x.arc(b.x,b.y,BR+1,0,Math.PI*2);x.stroke();x.shadowBlur=0;
      if(!b.settled){const spd=Math.sqrt(b.vx*b.vx+b.vy*b.vy);x.fillStyle=PC[b.player]+"88";x.font="8px monospace";x.textAlign="center";
        x.fillText(spd.toFixed(1)+" b"+(b.bounces||0)+" x"+Math.pow(2,b.streak||0),b.x,b.y-BR-4);}}
    x.restore();
    // HUD
    const gW=_VW/_ZM;
    x.fillStyle="#333";x.font="9px monospace";x.textAlign="center";x.fillText("R"+g.round+(g.volley>1?" V"+g.volley:""),gW/2,14);
    const ap=g.phase==="p1aim"?0:g.phase==="p2aim"?1:-1;
    if(ap>=0){x.fillStyle=PC[ap];x.font="bold 11px monospace";x.fillText("\u25bc "+["P1","P2"][ap]+" \u25bc",gW/2,28);}
  },[]);

  useEffect(()=>{
    const step=()=>{rf.current=requestAnimationFrame(step);const g=sR.current;const P=phR.current;

      // Continuous hover movement via held keys
      if(g.phase==="p1aim"||g.phase==="p2aim"){
        const pi=g.phase==="p1aim"?0:1;
        const keys=keysDown.current;const S=P.tankSpd||4;
        const minX=pi===0?TANK_W/2:FW/2+TANK_W/2;
        const maxX=pi===0?FW/2-TANK_W/2:FW-TANK_W/2;
        const minY=CEIL_Y+TANK_H/2;
        const maxY=FLOOR_Y-TANK_H/2;
        let dx=0,dy=0;
        if(keys.has("ArrowLeft"))dx-=S;
        if(keys.has("ArrowRight"))dx+=S;
        if(keys.has("ArrowUp"))dy-=S;
        if(keys.has("ArrowDown"))dy+=S;
        if(dx!==0||dy!==0){
          set(s=>{
            const tp=[{...s.tankPos[0]},{...s.tankPos[1]}];
            let nx=Math.max(minX,Math.min(maxX,tp[pi].x+dx));
            let ny=Math.max(minY,Math.min(maxY,tp[pi].y+dy));
            // Check block collision for each axis independently (allows sliding)
            if(!tankBlockCol(nx,tp[pi].y,s.blocks)){tp[pi].x=nx;}
            if(!tankBlockCol(tp[pi].x,ny,s.blocks)){tp[pi].y=ny;}
            return{...s,tankPos:tp};
          });
        }
      }

      // Spawn hover particles for both active tanks
      for(let pi=0;pi<2;pi++){
        const tp=g.tankPos[pi];
        if(!g.cannonDisabled[pi]&&Math.random()<0.35){
          hoverParts.push({x:tp.x+(Math.random()-0.5)*TANK_W*0.7,y:tp.y+TANK_H/2+4,
            vx:(Math.random()-0.5)*0.3,vy:0.4+Math.random()*0.6,sz:1+Math.random()*1.5,
            color:PC[pi],life:0.4+Math.random()*0.4});
        }
      }

      // Drop anim
      if(g.phase==="dropping"){
        if(!g.dropAnim&&g.dropQ.length>0){const next=g.dropQ[0];
          set(p=>({...p,dropAnim:{...next,x:next.targetX,y:-BS*2,rot:next.targetRot,tick:0},dropQ:p.dropQ.slice(1)}));draw();return;}
        if(g.dropAnim){const ad=g.dropAnim,tick=ad.tick+1,dur=30;
          if(tick>=dur){set(p=>{const nb=[...p.blocks];
            for(const r of ad.rects)nb.push({...r,color:ad.col,player:-1,id:Math.random(),groupId:ad.groupId,isGrey:false,vy:0});
            if(p.dropQ.length>0)return{...p,blocks:nb,dropAnim:null};
            const ao2=p.aimOrder||["p1","p2"];return{...p,blocks:nb,dropAnim:null,phase:ao2[0]+"aim",msg:ao2[0].toUpperCase()+" aims first"};});
          } else {const t=tick/dur,targetY=Math.min(...ad.rects.map(r=>r.y));
            set(p=>({...p,dropAnim:{...ad,y:-BS*2+(targetY+BS*2)*t,tick}}));}
          draw();return;}
        set(p=>{const ao2=p.aimOrder||["p1","p2"];return{...p,phase:ao2[0]+"aim",msg:ao2[0].toUpperCase()+" aims first"};});draw();return;}

      if(g.phase!=="fire"||g.balls.length===0){draw();return;}
      tickBlockFall(g.blocks,P);

      // Tank collision during fire phase (block crush + ball kill)
      const cd=[g.cannonDisabled[0],g.cannonDisabled[1]];const ns=[...g.scores];
      const ntp=[{...g.tankPos[0]},{...g.tankPos[1]}];
      for(let pi=0;pi<2;pi++){if(cd[pi])continue;
        const tp=ntp[pi];
        const tr={x:tp.x-TANK_W/2,y:tp.y-TANK_H/2,w:TANK_W,h:TANK_H};
        // Block crush
        for(const b of g.blocks){if(!b.isBarrier&&b.x<tr.x+tr.w&&b.x+b.w>tr.x&&b.y<tr.y+tr.h&&b.y+b.h>tr.y){
          cd[pi]=true;ntp[pi]=pi===0?{...T1_START}:{...T2_START};ns[1-pi]+=P.tankKillPts;
          for(let d=0;d<15;d++)debris.push({x:tp.x,y:tp.y,vx:(Math.random()-.5)*8,vy:(Math.random()-.5)*8,sz:4+Math.random()*5,color:PC[pi],life:.6+Math.random()*.4});
          floatTexts.push({x:tp.x,y:tp.y-30,text:"CRUSHED!",color:PC[1-pi],sz:14,life:1.5});break;}}
        // Ball kill
        if(!cd[pi])for(const ball of g.balls){if(ball.settled)continue;
          const bdx=ball.x-Math.max(tr.x,Math.min(ball.x,tr.x+tr.w)),bdy=ball.y-Math.max(tr.y,Math.min(ball.y,tr.y+tr.h));
          if(bdx*bdx+bdy*bdy<BR*BR){cd[pi]=true;ntp[pi]=pi===0?{...T1_START}:{...T2_START};ns[1-pi]+=P.tankKillPts;
            for(let d=0;d<20;d++)debris.push({x:tp.x,y:tp.y,vx:(Math.random()-.5)*10,vy:(Math.random()-.5)*10,sz:4+Math.random()*6,color:PC[pi],life:.7+Math.random()*.4});
            floatTexts.push({x:tp.x,y:tp.y-30,text:"+"+P.tankKillPts+" KILL!",color:"#ff4444",sz:16,life:2});break;}}}

      let allS=true,addB=[];const bpAdd=[0,0];let rmIdx=new Set();const puAmmo=[0,0];const bbk=[0,0];
      const nb=g.balls.map(b=>{if(b.settled)return b;
        let{x:bx,y:by,vx,vy,spin,trail,player,scored,rot:br,stuckTicks:st,bounces:bn,streak:sk}=b;
        bn=bn||0;sk=sk||0;
        if(bn>=P.maxBounces){for(let d=0;d<8;d++)debris.push({x:bx,y:by,vx:(Math.random()-.5)*6,vy:(Math.random()-.5)*6,sz:3+Math.random()*4,color:PC[player],life:.4+Math.random()*.3});
          return{...b,x:bx,y:by,vx:0,vy:0,spin:0,settled:true,bounces:bn,streak:sk};}
        vx+=spin*P.sc;vy+=P.gv;vx*=P.fr;bx+=vx;by+=vy;spin*=.997;br=(br||0)+spin*.15+vx*.01;
        const vel=Math.sqrt(vx*vx+vy*vy);if(vel>P.maxBallVel){const s2=P.maxBallVel/vel;vx*=s2;vy*=s2;}
        if(bx<BR){bx=BR;vx=Math.abs(vx)*P.bnc;spin*=-.4;bn++;}
        if(bx>FW-BR){bx=FW-BR;vx=-Math.abs(vx)*P.bnc;spin*=-.4;bn++;}
        if(by<BR){by=BR;vy=Math.abs(vy)*P.bnc;bn++;}
        if(by>FH-14-BR){by=FH-14-BR;vy=-Math.abs(vy)*P.bnc;vx*=P.ff;spin*=.3;bn++;if(Math.abs(vy)<.3)vy=0;if(Math.abs(vx)<.08)vx=0;}
        const ownLeft=player===0;const centerX2=FW/2;
        for(let bi=0;bi<g.blocks.length;bi++){
          if(rmIdx.has(bi))continue;const hb=g.blocks[bi];
          const col=brc(bx,by,vx,vy,spin,hb,P.bnc,P.sb);if(!col.hit)continue;
          const blockLeft=hb.x+hb.w/2<centerX2;
          const isOwn=(ownLeft&&blockLeft)||(!ownLeft&&!blockLeft);
          vx=col.vx;vy=col.vy;bx=col.px;by=col.py;spin=col.ns;st=0;bn++;
          if(hb.isBarrier)break;
          if(hb.isGrey&&!hb.hasPowerup){
            const newHits=(hb.hits||1)-1;
            if(newHits<=0){rmIdx.add(bi);} else {hb.hits=newHits;hb.color=greyCol(newHits,P.greyHits);}
          } else {rmIdx.add(bi);}
          const pts=isOwn?0:Math.pow(2,sk);if(!isOwn){sk++;bbk[player]++;}
          bpAdd[player]+=pts;
          for(let d=0;d<5;d++)debris.push({x:hb.x+hb.w/2,y:hb.y+hb.h/2,vx:(Math.random()-.5)*5,vy:(Math.random()-.5)*5-2,sz:3+Math.random()*4,color:hb.color,life:.5+Math.random()*.3});
          if(!isOwn){const ptStr=pts>=8?"+"+pts+"!!":pts>=4?"+"+pts+"!":"+"+pts;
          floatTexts.push({x:hb.x+hb.w/2,y:hb.y-5,text:ptStr,color:pts>=8?"#ffdd00":pts>=4?"#ff8800":"#ffffff",sz:pts>=8?16:pts>=4?13:10,life:1+Math.min(sk*0.2,1)});}
          if(hb.hasPowerup){puAmmo[player]++;
            for(let d=0;d<12;d++)debris.push({x:hb.x+hb.w/2,y:hb.y+hb.h/2,vx:(Math.random()-.5)*8,vy:-Math.random()*8-2,sz:4+Math.random()*5,color:"#ff00ff",life:.6+Math.random()*.4});
            const ang=Math.atan2(vy,vx)+(Math.random()-.5)*2*(P.puSpread*Math.PI/180);const spd=Math.sqrt(vx*vx+vy*vy);
            addB.push({x:bx,y:by,vx:Math.cos(ang)*spd,vy:Math.sin(ang)*spd,spin:spin*.5,trail:[],player,scored:false,settled:false,rot:0,stuckTicks:0,bounces:0,streak:0});}
          break;}
        const nt=[...(trail||[]),{x:bx,y:by}];if(nt.length>MT)nt.shift();
        const spd=Math.sqrt(vx*vx+vy*vy);const isMoving=spd>P.settleSpd;st=isMoving?0:(st||0)+1;
        const isS=(spd<P.settleSpd&&by>=FH-14-BR-1)||st>P.settleStuck;
        if(!isS)allS=false;
        return{...b,x:bx,y:by,vx,vy,spin,trail:nt,scored:false,settled:isS,rot:br,stuckTicks:st,bounces:bn,streak:sk};});
      const combined=[...nb,...addB];ballBall(combined);
      let newBl=g.blocks;
      if(rmIdx.size>0){for(const i of rmIdx){const b=g.blocks[i];if(b)for(let d=0;d<3;d++)debris.push({x:b.x+b.w/2,y:b.y+b.h/2,vx:(Math.random()-.5)*4,vy:(Math.random()-.5)*4-1,sz:2+Math.random()*3,color:b.color,life:.3+Math.random()*.2});}
        newBl=g.blocks.filter((_,i)=>!rmIdx.has(i));}
      const ticks=g.fireTicks+1;if(ticks>MK)allS=true;
      const pp=[g.pendingPts[0]+bpAdd[0],g.pendingPts[1]+bpAdd[1]];
      const newAmmo=[Math.min(g.ammo[0]+puAmmo[0],P.maxAmmo),Math.min(g.ammo[1]+puAmmo[1],P.maxAmmo)];
      const newBB=[g.blocksBroken[0]+bbk[0],g.blocksBroken[1]+bbk[1]];
      set(p=>({...p,balls:combined,blocks:newBl,fireTicks:ticks,cannonDisabled:cd,tankPos:ntp,scores:ns,pendingPts:pp,ammo:newAmmo,blocksBroken:newBB}));

      if(allS&&combined.every(b=>b.settled)){
        if(g.shotQ&&g.shotQ.length>0){const next=g.shotQ[0];const P2=phR.current;
          const tp=sR.current.tankPos[next.pi];const ball=fb(next.pi,next.aim,P2.pm,tp.x,tp.y,P2.maxBallVel);
          setTimeout(()=>{set(p=>({...p,balls:[ball],fireTicks:0,shotQ:p.shotQ.slice(1),msg:"Extra shot..."}));},300);draw();return;}
        const finalPP=[...pp];const finalBB=[...newBB];
        setTimeout(()=>{set(p=>{
          const fs=[...p.scores];fs[0]+=finalPP[0];fs[1]+=finalPP[1];
          if(fs[0]>=P.winScore||fs[1]>=P.winScore){const w=fs[0]>fs[1]?0:fs[1]>fs[0]?1:-1;
            return{...p,balls:[],scores:fs,fireTicks:0,pendingPts:[0,0],blocksBroken:[0,0],phase:"gameover",winner:w,msg:w===0?"P1 WINS!":w===1?"P2 WINS!":"DRAW!"};}
          const nr=p.round+1;const nv=1;
          const diff=finalBB[0]-finalBB[1];
          const ao=p.aimOrder||["p1","p2"];
          const blC=[...p.blocks];const{blocks:nb2,drops}=addRoundBlocks(blC,P,nr,diff);
          const newAO=[ao[1],ao[0]];
          if(drops.length>0)return{...p,balls:[],scores:fs,fireTicks:0,pendingPts:[0,0],blocksBroken:[0,0],round:nr,volley:nv,
            cannonDisabled:[false,false],blocks:nb2,aims:[{angle:-Math.PI/4,power:60,spin:0},{angle:Math.PI+Math.PI/4,power:60,spin:0}],
            msg:"P1+"+finalPP[0]+" P2+"+finalPP[1],aimOrder:newAO,phase:"dropping",dropQ:drops,dropAnim:null};
          return{...p,balls:[],scores:fs,fireTicks:0,pendingPts:[0,0],blocksBroken:[0,0],round:nr,volley:nv,
            cannonDisabled:[false,false],blocks:nb2,aims:[{angle:-Math.PI/4,power:60,spin:0},{angle:Math.PI+Math.PI/4,power:60,spin:0}],
            msg:"P1+"+finalPP[0]+" P2+"+finalPP[1],aimOrder:newAO,phase:newAO[0]+"aim"};
        });},500);}
      draw();};
    rf.current=requestAnimationFrame(step);return()=>cancelAnimationFrame(rf.current);
  },[draw,set]);

  useEffect(()=>{
    const c=cv.current;if(!c)return;
    const wp=(e)=>{const r=c.getBoundingClientRect();return{x:(e.clientX-r.left)/zmRef.current,y:(e.clientY-r.top)/zmRef.current};};
    const onMM=(e)=>{const g=sR.current;
      for(let pi=0;pi<2;pi++){
        if(g.phase===(pi===0?"p1aim":"p2aim")&&!g.cannonDisabled[pi]){
          const p=wp(e);const tp=g.tankPos[pi];
          const dx=p.x-tp.x,dy=p.y-tp.y;
          const angle=Math.atan2(dy,dx);
          set(s=>{const a=[...s.aims];a[pi]={...a[pi],angle};return{...s,aims:a};});}}};
    const onClick=(e)=>{const g=sR.current;const P=phR.current;
      const ao=g.aimOrder||["p1","p2"];const first=ao[0],second=ao[1];
      if(g.phase===first+"aim"&&e.button===0){
        const fpi=first==="p1"?0:1;
        if(g.cannonDisabled[fpi])set(s=>({...s,phase:second+"aim",msg:second.toUpperCase()+" aim"}));
        else set(s=>({...s,phase:second+"aim",msg:second.toUpperCase()+": aim \u00b7 CLICK fire"}));}
      if(g.phase===second+"aim"&&e.button===0){
        const balls=[];const shotQ=[];
        {const tp=g.tankPos[0];if(!g.cannonDisabled[0])balls.push(fb(0,g.aims[0],P.pm,tp.x,tp.y,P.maxBallVel));}
        {const tp=g.tankPos[1];if(!g.cannonDisabled[1])balls.push(fb(1,g.aims[1],P.pm,tp.x,tp.y,P.maxBallVel));}
        if(!g.cannonDisabled[0])for(let i=1;i<g.ammo[0];i++)shotQ.push({pi:0,aim:{...g.aims[0]}});
        if(!g.cannonDisabled[1])for(let i=1;i<g.ammo[1];i++)shotQ.push({pi:1,aim:{...g.aims[1]}});
        if(balls.length===0){set(s=>({...s,msg:"BOTH DISABLED!"}));setTimeout(()=>set(s=>({...s,cannonDisabled:[false,false],tankPos:[{...T1_START},{...T2_START}],phase:first+"aim",msg:"Cannons restored!"})),1000);}
        else set(s=>({...s,phase:"fire",balls,fireTicks:0,pendingPts:[0,0],blocksBroken:[0,0],shotQ,ammo:[1,1],msg:"FIRE!"+(shotQ.length>0?" (+"+shotQ.length+" extra)":"")}));}};
    const onWh=(e)=>{const g=sR.current;e.preventDefault();
      if(g.phase==="p1aim")set(s=>{const a=[...s.aims];a[0]={...a[0],power:Math.max(10,Math.min(MP,a[0].power+(e.deltaY<0?2.5:-2.5)))};return{...s,aims:a};});
      if(g.phase==="p2aim")set(s=>{const a=[...s.aims];a[1]={...a[1],power:Math.max(10,Math.min(MP,a[1].power+(e.deltaY<0?2.5:-2.5)))};return{...s,aims:a};});};
    const onKD=(e)=>{const g=sR.current;
      if(g.phase==="p1aim"||g.phase==="p2aim"){const pi=g.phase==="p1aim"?0:1;
        if(e.code==="ArrowLeft"||e.code==="ArrowRight"||e.code==="ArrowUp"||e.code==="ArrowDown"){e.preventDefault();keysDown.current.add(e.code);}
        if(e.code==="Comma")set(s=>{const a=[...s.aims];a[pi]={...a[pi],spin:Math.max(-1,a[pi].spin-.05)};return{...s,aims:a};});
        if(e.code==="Period")set(s=>{const a=[...s.aims];a[pi]={...a[pi],spin:Math.min(1,a[pi].spin+.05)};return{...s,aims:a};});}
      if(e.code==="Space"&&g.phase==="gameover"){e.preventDefault();debris=[];floatTexts=[];hoverParts=[];set(init(phR.current));}};
    const onKU=(e)=>{keysDown.current.delete(e.code);};
    c.addEventListener("mousemove",onMM);c.addEventListener("click",onClick);
    c.addEventListener("wheel",onWh,{passive:false});document.addEventListener("keydown",onKD);document.addEventListener("keyup",onKU);
    c.addEventListener("contextmenu",e=>e.preventDefault());
    return()=>{c.removeEventListener("mousemove",onMM);c.removeEventListener("click",onClick);c.removeEventListener("wheel",onWh);document.removeEventListener("keydown",onKD);document.removeEventListener("keyup",onKU);};
  },[set]);

  const sl=(label,key,min,max,stp)=>(
    <div style={{display:"flex",alignItems:"center",gap:4,fontSize:10,fontFamily:"monospace",color:"#aaa"}}>
      <span style={{width:75,textAlign:"right",color:"#ff9800"}}>{label}</span>
      <input type="range" min={min} max={max} step={stp} value={ph[key]}
        onChange={e=>setPh(p=>({...p,[key]:parseFloat(e.target.value)}))} style={{width:80,accentColor:"#ff9800"}}/>
      <input type="number" min={0} max={99999} step={stp} value={ph[key]}
        onChange={e=>{const v=parseFloat(e.target.value);if(!isNaN(v))setPh(p=>({...p,[key]:v}));}}
        style={{width:48,background:"#111",color:"#fff",border:"1px solid #444",borderRadius:2,padding:"1px 3px",fontSize:10,fontFamily:"monospace",textAlign:"right"}}/>
    </div>);

  const{phase,scores,winner}=gs;const F="'Courier New', monospace";
  return(
    <div className="flex flex-col items-center justify-center bg-black select-none" style={{fontFamily:F,width:"100vw",height:"100vh",overflow:"hidden",margin:0,padding:0}}>
      <canvas ref={cv} width={VW} height={VH} className="block" style={{cursor:gs.phase.includes("aim")?"crosshair":"default"}}/>
      {phase==="gameover"&&(<div className="fixed inset-0 flex items-center justify-center" style={{background:"rgba(0,0,0,0.85)"}}>
        <div className="text-center" style={{fontFamily:F}}>
          <div className="text-3xl font-bold mb-2" style={{color:winner>=0?PC[winner]:"#888"}}>{winner===0?"P1 WINS!":winner===1?"P2 WINS!":"DRAW!"}</div>
          <div className="text-xl mb-2 text-white">{scores[0]} \u2014 {scores[1]}</div>
          <div className="text-xs text-gray-500 tracking-widest animate-pulse">SPACE TO REMATCH</div>
        </div></div>)}
      <div style={{position:"fixed",top:8,right:8,zIndex:50}}>
        <button onClick={()=>setShowDbg(v=>!v)} style={{background:"#222",color:"#ff9800",border:"1px solid #ff9800",padding:"4px 10px",fontSize:11,fontFamily:"monospace",cursor:"pointer",borderRadius:4}}>{showDbg?"HIDE":"DEBUG"}</button>
      </div>
      {showDbg&&(
        <div style={{position:"fixed",top:36,right:8,zIndex:50,background:"rgba(0,0,0,0.92)",border:"1px solid #333",borderRadius:6,padding:"8px 10px",display:"flex",flexDirection:"column",gap:3,maxHeight:"92vh",overflowY:"auto",width:280}}>
          <div style={{fontSize:10,color:"#666",fontFamily:"monospace"}}>BALL</div>
          {sl("Gravity","gv",0.02,0.5,0.01)}{sl("Bounce","bnc",0.3,0.98,0.01)}{sl("Air Drag","fr",0.990,1.000,0.001)}
          {sl("Floor Fric","ff",0.80,1.00,0.01)}{sl("Spin Crv","sc",0.01,0.15,0.005)}{sl("Spin Bnc","sb",0.2,1.5,0.05)}
          {sl("Power","pm",0.15,0.60,0.01)}{sl("Max Vel","maxBallVel",10,80,1)}{sl("PU Vel","puVel",1,15,0.5)}
          {sl("Settl Spd","settleSpd",0.02,0.30,0.01)}{sl("Settl Wt","settleStuck",50,400,10)}
          {sl("Max Bnce","maxBounces",5,200,5)}{sl("Max Ammo","maxAmmo",1,10,1)}{sl("PU Spread","puSpread",1,45,1)}
          <div style={{fontSize:10,color:"#666",fontFamily:"monospace",marginTop:4}}>BLOCK FALL</div>
          {sl("Fall Grav","fallGrav",0.01,0.5,0.01)}{sl("Fall Max","fallMaxSpd",1,15,0.5)}{sl("Fall Damp","fallDamp",0.1,0.8,0.05)}
          <div style={{fontSize:10,color:"#666",fontFamily:"monospace",marginTop:4}}>GAME</div>
          {sl("Win Score","winScore",50,5000,50)}{sl("Tank Kill","tankKillPts",10,500,10)}{sl("Grey Hits","greyHits",1,10,1)}
          {sl("Tank Spd","tankSpd",1,10,0.5)}
          <div style={{fontSize:10,color:"#666",fontFamily:"monospace",marginTop:4}}>FIELD (NEW GAME)</div>
          {sl("Blocks","numBlocks",5,40,1)}{sl("Grey","numGrey",2,30,1)}{sl("Powerups","numPowerups",0,8,1)}
          {sl("Ceil","ceilBlocks",0,8,1)}{sl("Floor","floorBlocks",0,8,1)}{sl("Inward","centerBlocks",1,20,1)}
          {sl("Barrier","barrierH",0,12,1)}{sl("Ceil Bar","ceilBarrierH",0,12,1)}
          <div style={{fontSize:10,color:"#666",fontFamily:"monospace",marginTop:4}}>ROUND DROPS</div>
          {sl("Rnd Color","roundColored",0,8,1)}
          <div style={{display:"flex",gap:6,marginTop:4}}>
            <button onClick={()=>{debris=[];floatTexts=[];hoverParts=[];set(init(phR.current));}} style={{flex:1,background:"#333",color:"#4caf50",border:"1px solid #4caf50",padding:"3px 6px",fontSize:10,fontFamily:"monospace",cursor:"pointer",borderRadius:3}}>NEW GAME</button>
            <button onClick={()=>setPh({...DEF})} style={{flex:1,background:"#333",color:"#ff9800",border:"1px solid #555",padding:"3px 6px",fontSize:10,fontFamily:"monospace",cursor:"pointer",borderRadius:3}}>RESET</button>
          </div>
        </div>)}
      {/* Dashboard */}
      <div style={{width:"100%",height:DASH_H,background:"#0a0a0f",borderTop:"1px solid #222",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px",fontFamily:F,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{color:PC[0],fontSize:11,fontWeight:"bold"}}>P1</span>
          <span style={{color:PC[0],fontSize:28,fontWeight:"bold"}}>{scores[0]}</span>
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
          {(phase==="p1aim"||phase==="p2aim")&&(()=>{const pi=phase==="p1aim"?0:1;const a=gs.aims[pi];return(
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <span style={{color:"#555",fontSize:9}}>SPIN</span>
              <div style={{width:100,height:8,background:"#111",position:"relative",borderRadius:2}}>
                <div style={{position:"absolute",left:"50%",top:0,width:1,height:8,background:"#333"}}/>
                {a.spin>0&&<div style={{position:"absolute",left:"50%",top:0,width:50*a.spin,height:8,background:"#ff8800",borderRadius:2}}/>}
                {a.spin<0&&<div style={{position:"absolute",left:50+50*a.spin,top:0,width:50*(-a.spin),height:8,background:"#00ddff",borderRadius:2}}/>}
              </div>
            </div>);})()}
          <div style={{color:gs.msg&&gs.msg.includes("KILL")?"#ff4444":gs.msg&&gs.msg.includes("FIRE")?"#ff9800":"#555",fontSize:10}}>{gs.msg||""}</div>
          <div style={{color:"#333",fontSize:8}}>{(phase==="p1aim"||phase==="p2aim")?"\u2190\u2192\u2191\u2193 hover \u00b7 MOUSE aim \u00b7 SCROLL power \u00b7 < > spin \u00b7 CLICK lock":"first to "+ph.winScore}</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{color:PC[1],fontSize:28,fontWeight:"bold"}}>{scores[1]}</span>
          <span style={{color:PC[1],fontSize:11,fontWeight:"bold"}}>P2</span>
        </div>
      </div>
    </div>);
}
