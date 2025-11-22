const emailEl = document.getElementById("em");
const passEl  = document.getElementById("pas");
const btnEl   = document.getElementById("login");
const formEl  = document.getElementById("login-form");
const toast   = document.getElementById("toast");
const effects = document.getElementById("effects");
const loginCard = document.getElementById("login-container");
const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");

function fitCanvas() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
fitCanvas();
addEventListener('resize', fitCanvas);

const cols = Math.floor(window.innerWidth / 14);
const drops = new Array(cols).fill(1);
const letters = '01<>\\/[]{}()*&^%$#@!abcdefghijklmnopqrstuvwxyz0123456789';

function drawMatrix() {
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fillRect(0,0,canvas.width,canvas.height);

  ctx.font = '14px monospace';
  for (let i = 0; i < drops.length; i++) {
    const text = letters[Math.floor(Math.random() * letters.length)];
    const x = i * 14;
    const y = drops[i] * 14;
    ctx.fillStyle = 'rgba(0,255,102,0.07)';
    ctx.fillText(text, x, y);

    if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  }
}
setInterval(drawMatrix, 80);

const particles = [];
function spawnParticle() {
  particles.push({
    x: Math.random() * canvas.width,
    y: canvas.height + 10,
    vx: (Math.random()-0.5)*0.4,
    vy: - (1 + Math.random()*1.6),
    life: 80 + Math.random()*80,
    r: 1 + Math.random()*2
  });
}
function drawParticles() {
  for (let i=particles.length-1;i>=0;i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life--;
    ctx.beginPath();
    ctx.fillStyle = `rgba(0,255,102,${Math.max(0, p.life/160) * 0.18})`;
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fill();
    if (p.life <= 0) particles.splice(i,1);
  }
}
setInterval(()=>{ if(Math.random()>0.6) spawnParticle(); }, 160);
setInterval(drawParticles, 120);

function showToast(message, emoji='⚠️', ms=1500) {
  toast.querySelector('.emoji') ? null : toast.insertAdjacentHTML('afterbegin','<span class="emoji"></span>');
  toast.style.display = 'block';
  toast.querySelector('.emoji').textContent = emoji;
  toast.querySelector('.msg').textContent = message;
  toast.style.opacity = '1';
  clearTimeout(toast._t);
  toast._t = setTimeout(()=>{ toast.style.opacity='0'; setTimeout(()=> toast.style.display='none', 400); }, ms);
}

function playShockwave(x, y, color='rgba(0,255,102,0.18)') {
  const wave = document.createElement('div');
  wave.className = 'effect-wave';
  wave.style.left = x + 'px';
  wave.style.top  = y + 'px';
  wave.style.background = `radial-gradient(circle, ${color}, rgba(0,255,102,0.03) 40%, transparent 60%)`;
  effects.appendChild(wave);
  setTimeout(()=> wave.remove(), 1000);
}

function playHolo() {
  const holo = document.createElement('div');
  holo.className = 'holo';
  loginCard.appendChild(holo);
  setTimeout(()=> holo.remove(), 1000);
}

function playButtonRipple(btn) {
  btn.classList.remove('ripple');
  void btn.offsetWidth;
  btn.classList.add('ripple');
}

function errorGlitch() {
  loginCard.classList.remove('error-glitch');
  void loginCard.offsetWidth;
  loginCard.classList.add('error-glitch');
}

function submitHandler(event){
  event.preventDefault();
  playShockwave(event.clientX, event.clientY);
  playButtonRipple(btnEl);

  const em = emailEl.value.trim();
  const pas = passEl.value;

  if (em === "" || pas === "") {
    alert("Please fill all the fields");
    showToast("Please fill all the fields", "⚠️");
    errorGlitch();
    return;
  }

  alert("Login Successful");
  showToast("Welcome back, Agent.", "✅");
  playHolo();

  passEl.value = "";

  for(let i=0;i<6;i++){
    particles.push({
      x: canvas.width/2 + (Math.random()-0.5)*120,
      y: canvas.height/2 + (Math.random()-0.5)*60,
      vx: (Math.random()-0.5)*3,
      vy: - (1 + Math.random()*2),
      life: 60 + Math.random()*80,
      r: 1 + Math.random()*3
    });
  }
}

btnEl.addEventListener('click', submitHandler);
formEl.addEventListener('submit', submitHandler);

function inputPulse(e){
  const rect = e.target.getBoundingClientRect();
  particles.push({
    x: rect.left + Math.random()*rect.width,
    y: rect.top + rect.height - 6,
    vx: (Math.random()-0.5)*0.6,
    vy: - (0.6 + Math.random()*1.2),
    life: 40 + Math.random()*40,
    r: 0.8 + Math.random()*1.4
  });
}
emailEl.addEventListener('input', inputPulse);
passEl.addEventListener('input', inputPulse);

[emailEl, passEl].forEach(el=>{
  el.addEventListener('keydown', (ev)=>{
    if(ev.key === 'Enter') {
      const rect = ev.target.getBoundingClientRect();
      playShockwave(rect.left + rect.width/2, rect.top + rect.height/2, 'rgba(0,255,102,0.12)');
    }
  });
});

(function loop(){
  requestAnimationFrame(loop);
})();

setTimeout(()=> {
  playShockwave(window.innerWidth/2, window.innerHeight/2, 'rgba(0,255,102,0.06)');
}, 350);
