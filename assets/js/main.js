/* ============================================================
   PAYMENT GRAPH CANVAS
   ============================================================ */
(function initPaymentGraph() {
  const canvas = document.getElementById('paymentGraph');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const NODES = 28, MAX_DIST = 180;
  let nodes = [], W, H;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  function randomNode() {
    return { x: Math.random()*W, y: Math.random()*H, vx:(Math.random()-0.5)*0.4, vy:(Math.random()-0.5)*0.4, r:Math.random()*2+1.5, pulse:Math.random()*Math.PI*2 };
  }
  function init() { resize(); nodes = Array.from({length:NODES}, randomNode); }
  function draw() {
    ctx.clearRect(0,0,W,H);
    for (let i=0;i<nodes.length;i++) {
      for (let j=i+1;j<nodes.length;j++) {
        const dx=nodes[i].x-nodes[j].x, dy=nodes[i].y-nodes[j].y;
        const dist=Math.sqrt(dx*dx+dy*dy);
        if (dist<MAX_DIST) {
          ctx.beginPath();
          ctx.strokeStyle=`rgba(0,212,255,${(1-dist/MAX_DIST)*0.35})`;
          ctx.lineWidth=0.8;
          ctx.moveTo(nodes[i].x,nodes[i].y);
          ctx.lineTo(nodes[j].x,nodes[j].y);
          ctx.stroke();
        }
      }
    }
    nodes.forEach(n=>{
      n.pulse+=0.02;
      const glow=Math.sin(n.pulse)*0.3+0.7;
      ctx.beginPath();
      ctx.arc(n.x,n.y,n.r*glow,0,Math.PI*2);
      ctx.fillStyle=`rgba(0,212,255,${0.6*glow})`;
      ctx.fill();
      n.x+=n.vx; n.y+=n.vy;
      if(n.x<0||n.x>W) n.vx*=-1;
      if(n.y<0||n.y>H) n.vy*=-1;
    });
    requestAnimationFrame(draw);
  }
  init(); draw();
  window.addEventListener('resize', resize);
})();

/* ============================================================
   TYPED ROLE ANIMATION
   ============================================================ */
(function initTyped() {
  const el = document.getElementById('typedRole');
  if (!el) return;
  const roles = ['Senior Software Engineer','Fintech Platform Engineer','Cloud & AI Integrations Lead'];
  let ri=0, ci=0, deleting=false;
  function tick() {
    const word=roles[ri];
    if (!deleting) {
      el.textContent=word.slice(0,++ci);
      if (ci===word.length){deleting=true;setTimeout(tick,2200);return;}
      setTimeout(tick,75);
    } else {
      el.textContent=word.slice(0,--ci);
      if (ci===0){deleting=false;ri=(ri+1)%roles.length;}
      setTimeout(tick,40);
    }
  }
  setTimeout(tick,800);
})();

/* ============================================================
   MAGNETIC CURSOR
   ============================================================ */
(function initCursor() {
  const cursor=document.getElementById('cursor');
  const follower=document.getElementById('cursorFollower');
  if (!cursor) return;
  let mx=0,my=0,fx=0,fy=0;
  document.addEventListener('mousemove',e=>{
    mx=e.clientX; my=e.clientY;
    cursor.style.left=mx+'px'; cursor.style.top=my+'px';
  });
  (function animateFollower(){
    fx+=(mx-fx)*0.12; fy+=(my-fy)*0.12;
    follower.style.left=fx+'px'; follower.style.top=fy+'px';
    requestAnimationFrame(animateFollower);
  })();
  document.querySelectorAll('a,button,.magnetic').forEach(el=>{
    el.addEventListener('mouseenter',()=>{cursor.classList.add('hovering');follower.classList.add('hovering');});
    el.addEventListener('mouseleave',()=>{cursor.classList.remove('hovering');follower.classList.remove('hovering');});
  });
})();

/* ============================================================
   IMPACT COUNT-UP
   ============================================================ */
(function initCountUp() {
  const cards = document.querySelectorAll('.impact-card');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      obs.unobserve(entry.target);
      const card = entry.target;
      const el   = card.querySelector('.count-val');
      const type = card.dataset.countType;
      if (type === 'text') {
        const text = card.dataset.countText;
        let i = 0; el.textContent = '';
        const t = setInterval(() => { el.textContent = text.slice(0,++i); if(i>=text.length) clearInterval(t); }, 60);
        return;
      }
      const end = parseInt(card.dataset.countEnd, 10);
      const duration = 1200, start = performance.now();
      function step(now) {
        const progress = Math.min((now-start)/duration, 1);
        const ease = 1-Math.pow(1-progress,3);
        el.textContent = Math.round(ease*end);
        if (progress<1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.4 });
  cards.forEach(c => obs.observe(c));
})();
