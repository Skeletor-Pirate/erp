/* -------------------------
   MATRIX RAIN BACKGROUND
-------------------------- */

const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const fontSize = 18;
let columns = Math.floor(window.innerWidth / fontSize);
let drops = Array(columns).fill(1);

function drawMatrix(){
    ctx.fillStyle = "rgba(0,0,0,0.06)";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = "rgba(0,255,102,0.45)";
    ctx.font = fontSize + "px monospace";

    for(let i=0; i<drops.length; i++){
        let char = String.fromCharCode(0x30A0 + Math.random()*96);
        ctx.fillText(char, i*fontSize, drops[i]*fontSize);

        if(drops[i]*fontSize > canvas.height && Math.random() > 0.975){
            drops[i] = 0;
        }
        drops[i]++;
    }
}
setInterval(drawMatrix, 60);


/* -------------------------
   LOGIN HANDLER
-------------------------- */

const loginBtn = document.getElementById("login");
const email = document.getElementById("em");
const pass = document.getElementById("pas");
const container = document.getElementById("login-container");
const toast = document.getElementById("toast");

loginBtn.addEventListener("click", submit);

function submit(event){
    event.preventDefault();

    let em = email.value.trim();
    let pw = pass.value.trim();

    if(em === "" || pw === ""){
        toastMsg("⚠️ Fill all fields!", false);
        shake();
        return;
    }

    toastMsg("✔ Login Successful", true);
    setTimeout(()=> window.location.href="dashboard.html", 700);
}


/* -------------------------
   SHAKE EFFECT
-------------------------- */

function shake(){
    container.classList.add("error-glitch");
    setTimeout(()=> container.classList.remove("error-glitch"), 600);
}


/* -------------------------
   RIPPLE EFFECT
-------------------------- */

loginBtn.addEventListener("click", (e)=>{
    let wave = document.createElement("span");
    wave.classList.add("effect-wave");
    wave.style.left = e.clientX - loginBtn.offsetLeft + "px";
    wave.style.top = e.clientY - loginBtn.offsetTop + "px";
    loginBtn.appendChild(wave);

    setTimeout(()=> wave.remove(), 900);
});


/* -------------------------
   TOAST
-------------------------- */

function toastMsg(msg, success){
    toast.innerHTML = msg;
    toast.style.display = "block";
    toast.style.borderColor = success 
        ? "rgba(0,255,120,0.4)"
        : "rgba(255,60,60,0.4)";

    setTimeout(()=> toast.style.display="none", 1500);
}
