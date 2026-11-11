const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

$("#year").textContent = new Date().getFullYear();

// Mobile navigation
const menuBtn = $("#menuBtn");
const mobileMenu = $("#mobileMenu");
menuBtn?.addEventListener("click", () => mobileMenu.classList.toggle("open"));
$$(".mobile-menu a").forEach(a => a.addEventListener("click", () => mobileMenu.classList.remove("open")));

// Cursor glow
const glow = $(".cursor-glow");
window.addEventListener("pointermove", e => {
  glow.animate(
    { left: `${e.clientX}px`, top: `${e.clientY}px` },
    { duration: 500, fill: "forwards", easing: "ease-out" }
  );
});

// Reveal on scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, {threshold: .12});
$$(".reveal").forEach(el => observer.observe(el));

// 3D tilt cards
if (window.matchMedia("(pointer:fine)").matches) {
  $$(".tilt").forEach(card => {
    card.addEventListener("pointermove", e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      const max = card.classList.contains("terminal-card") ? 8 : 4;
      card.style.transform = `perspective(1000px) rotateX(${-y*max}deg) rotateY(${x*max}deg)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}

// Magnetic buttons
if (window.matchMedia("(pointer:fine)").matches) {
  $$(".magnetic").forEach(el => {
    el.addEventListener("pointermove", e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width/2) * .18;
      const y = (e.clientY - r.top - r.height/2) * .18;
      el.style.transform = `translate(${x}px,${y}px)`;
    });
    el.addEventListener("pointerleave", () => el.style.transform = "");
  });
}

// Particle field
const canvas = $("#particleCanvas");
const ctx = canvas.getContext("2d");
let W, H, particles = [];
function resizeCanvas() {
  W = canvas.width = innerWidth * devicePixelRatio;
  H = canvas.height = innerHeight * devicePixelRatio;
  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";
  ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
}
function makeParticles() {
  const count = Math.min(95, Math.floor(innerWidth / 14));
  particles = Array.from({length: count}, () => ({
    x: Math.random()*innerWidth, y: Math.random()*innerHeight,
    vx: (Math.random()-.5)*.18, vy: (Math.random()-.5)*.18,
    r: Math.random()*1.3+.2
  }));
}
function drawParticles() {
  ctx.clearRect(0,0,innerWidth,innerHeight);
  for (const p of particles) {
    p.x += p.vx; p.y += p.vy;
    if(p.x<0)p.x=innerWidth; if(p.x>innerWidth)p.x=0;
    if(p.y<0)p.y=innerHeight; if(p.y>innerHeight)p.y=0;
    ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle="rgba(180,155,255,.55)"; ctx.fill();
  }
  for(let i=0;i<particles.length;i++){
    for(let j=i+1;j<particles.length;j++){
      const a=particles[i],b=particles[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.hypot(dx,dy);
      if(d<115){
        ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
        ctx.strokeStyle=`rgba(120,100,190,${.10*(1-d/115)})`;ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}
resizeCanvas(); makeParticles(); drawParticles();
addEventListener("resize", () => {resizeCanvas();makeParticles()});

// Smooth active nav
const sections = $$("section[id]");
const navLinks = $$(".nav-links a");
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      navLinks.forEach(a => a.style.color = a.getAttribute("href") === "#"+entry.target.id ? "#fff" : "");
    }
  });
},{rootMargin:"-45% 0px -45% 0px"});
sections.forEach(s => navObserver.observe(s));
