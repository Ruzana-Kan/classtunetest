const BASE='https://classtune.com/wp-content/themes/twentytwentyone/assets/theme-assets/img/';
const SHOTS=[
  ['slider/lms-1.png','Learning Management'],
  ['slider/payroll-1.png','Payroll'],
  ['slider/admission-1.png','Class Admission'],
  ['assesment-attendance.png','Assessment and Attendance'],
  ['Fees@2x.png','ClassPay Fees'],
  ['Payroll-middle.png','Salary Sheets'],
  ['application-public.png','Admission Portal']
];
const FALL={'lms-1.png':'slider/lms-1.png','payroll-1.png':'slider/payroll-1.png','admission-1.png':'slider/admission-1.png'};

// images with graceful fallback
function setImg(img,path,label){
  img.src=BASE+path;
  img.onerror=()=>{const d=document.createElement('div');d.className='fallback';d.textContent=label||'ClassTune';img.replaceWith(d)};
}
document.querySelectorAll('img[data-src]').forEach(i=>setImg(i,FALL[i.dataset.src]||i.dataset.src,i.alt));

// build gallery
function gi(s){return `<div class="gi"><img alt="${s[1]}"><div class="cap">${s[1]}</div></div>`}
const loopHTML=(arr)=>arr.concat(arr).map(gi).join('');
t1.innerHTML=loopHTML(SHOTS);
t2.innerHTML=loopHTML(SHOTS.slice().reverse());
snap.innerHTML=SHOTS.map(s=>`<div class="sc"><img alt="${s[1]}"><div><h5>${s[1]}</h5><p>ClassTune platform screen</p></div></div>`).join('');
document.querySelectorAll('#gallery img').forEach(img=>{
  const label=img.alt;const s=SHOTS.find(x=>x[1]===label);setImg(img,s[0],label);
});

// word-by-word text animation
function split(el,mode){
  el.classList.add('sx',mode);let i=0;
  (function walk(node,g){
    [...node.childNodes].forEach(n=>{
      if(n.nodeType===3){
        const frag=document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(p=>{
          if(!p)return;
          if(/^\s+$/.test(p)){frag.appendChild(document.createTextNode(' '));return}
          const w=document.createElement('span');w.className='w'+(g?' gw':'');
          w.style.setProperty('--i',Math.min(i++,40));
          const t=document.createElement('i');t.textContent=p;w.appendChild(t);frag.appendChild(w);
        });
        n.replaceWith(frag);
      }else if(n.nodeType===1&&!n.classList.contains('typed')){
        walk(n,g||(n.tagName==='SPAN'&&mode==='rise'));
      }
    });
  })(el,false);
}
document.querySelectorAll('h2.title,#hero h1,.step h4').forEach(e=>split(e,'rise'));
document.querySelectorAll('.lead,.sub,.row p,.step p,.cta p').forEach(e=>split(e,'fade'));

// nav link text roll
document.querySelectorAll('.menu>li>a').forEach(a=>{const t=a.textContent.trim();a.innerHTML=`<span class="roll"><b>${t}</b><b>${t}</b></span>`});

// loader
window.addEventListener('load',()=>setTimeout(()=>loader.classList.add('hide'),500));

// nav
const nav=document.getElementById('nav'),topBtn=document.getElementById('top');
addEventListener('scroll',()=>{
  const y=scrollY,h=document.documentElement.scrollHeight-innerHeight;
  nav.classList.toggle('scrolled',y>40);
  topBtn.classList.toggle('show',y>600);
  progress.style.width=(y/h*100)+'%';
});
topBtn.onclick=()=>scrollTo({top:0});
burger.onclick=()=>menu.classList.toggle('open');
menu.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>menu.classList.remove('open')));

// typing
const words=['Education','Schools','Teachers','Students','Parents'];
let wi=0,ci=0,del=false;
(function type(){
  const w=words[wi];
  typed.textContent=w.slice(0,ci);
  if(!del&&ci<w.length){ci++;setTimeout(type,110)}
  else if(!del){del=true;setTimeout(type,1400)}
  else if(ci>0){ci--;setTimeout(type,55)}
  else{del=false;wi=(wi+1)%words.length;setTimeout(type,300)}
})();

// reveal + counters
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);
    e.target.querySelectorAll('[data-count]').forEach(count);}
}),{threshold:.15});
document.querySelectorAll('.rv').forEach((el,i)=>{el.style.transitionDelay=(i%4)*90+'ms';io.observe(el)});
function count(el){
  const to=+el.dataset.count,pre=el.dataset.prefix||'';let n=0;const st=to>100?to-40:0;
  const step=()=>{n+=Math.ceil((to-st)/40);const v=Math.min(st+n,to);el.textContent=pre+v;if(v<to)requestAnimationFrame(step)};step();
}

// hero 3D slider
const slides=[...document.querySelectorAll('.slide3d')],dotEls=[...dots.children];let cur=0;
function rotate(k){
  cur=k;
  slides.forEach((s,i)=>{s.className='slide3d s'+((i-cur+3)%3)});
  dotEls.forEach((d,i)=>d.classList.toggle('on',i===cur));
}
let auto=setInterval(()=>rotate((cur+1)%3),3500);
dotEls.forEach((d,i)=>d.onclick=()=>{rotate(i);clearInterval(auto);auto=setInterval(()=>rotate((cur+1)%3),3500)});
slides.forEach((s,i)=>s.onclick=()=>rotate(i));
stage.addEventListener('mousemove',e=>{
  const r=stage.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
  tilt.style.transform=`rotateY(${x*14}deg) rotateX(${-y*12}deg)`;
});
stage.addEventListener('mouseleave',()=>tilt.style.transform='');

// product card glow follows cursor
document.querySelectorAll('.pcard').forEach(c=>c.addEventListener('mousemove',e=>{
  const r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px');
}));

// particles
(function(){
  const c=particles,x=c.getContext('2d');let W,H,P=[];
  function size(){W=c.width=c.offsetWidth;H=c.height=c.offsetHeight;P=Array.from({length:Math.min(70,W/18)},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.5,vy:(Math.random()-.5)*.5}))}
  size();addEventListener('resize',size);
  const m={x:-999,y:-999};
  c.parentElement.addEventListener('mousemove',e=>{const r=c.getBoundingClientRect();m.x=e.clientX-r.left;m.y=e.clientY-r.top});
  (function draw(){
    x.clearRect(0,0,W,H);
    P.forEach((p,i)=>{
      p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;
      x.fillStyle='rgba(120,160,255,.7)';x.beginPath();x.arc(p.x,p.y,2,0,7);x.fill();
      for(let j=i+1;j<P.length;j++){const q=P[j],d=Math.hypot(p.x-q.x,p.y-q.y);
        if(d<120){x.strokeStyle=`rgba(11,183,131,${.25*(1-d/120)})`;x.beginPath();x.moveTo(p.x,p.y);x.lineTo(q.x,q.y);x.stroke()}}
      const dm=Math.hypot(p.x-m.x,p.y-m.y);
      if(dm<150){x.strokeStyle=`rgba(165,107,255,${.5*(1-dm/150)})`;x.beginPath();x.moveTo(p.x,p.y);x.lineTo(m.x,m.y);x.stroke()}
    });
    requestAnimationFrame(draw);
  })();
})();

// snap slider: arrows + drag
const sn=document.getElementById('snap');
const stepW=()=>sn.querySelector('.sc').offsetWidth+24;
next.onclick=()=>{sn.scrollLeft+stepW()>=sn.scrollWidth-sn.clientWidth-10?sn.scrollTo({left:0,behavior:'smooth'}):sn.scrollBy({left:stepW(),behavior:'smooth'})};
prev.onclick=()=>sn.scrollBy({left:-stepW(),behavior:'smooth'});
let down=false,sx=0,sl=0;
sn.addEventListener('mousedown',e=>{down=true;sn.classList.add('drag');sx=e.pageX;sl=sn.scrollLeft});
addEventListener('mouseup',()=>{if(down){down=false;sn.classList.remove('drag')}});
sn.addEventListener('mousemove',e=>{if(!down)return;e.preventDefault();sn.scrollLeft=sl-(e.pageX-sx)});

// form
form.addEventListener('submit',e=>{
  e.preventDefault();
  msg.textContent='Thank you! We will reach out to '+email.value+' shortly.';
  form.reset();
});