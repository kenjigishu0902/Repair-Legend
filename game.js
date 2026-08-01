// game.js Part1

const $ = id => document.getElementById(id);

let money = 0;
let level = 1;
let combo = 0;
let solved = 0;

let currentQuestion = null;

const player = $("player");
const customer = $("customer");

const speech = $("speech");
const speechText = $("speechText");

const acceptBtn = $("acceptBtn");

const questionWindow = $("questionWindow");
const deviceName = $("deviceName");
const symptom = $("symptom");
const choices = $("choices");
const result = $("result");

const startScreen = $("startScreen");
const startButton = $("startButton");

function updateHUD(){

    $("money").textContent = money.toLocaleString();

    $("level").textContent = level;

    $("combo").textContent = combo;

}

function randomQuestion(){

    return questions[Math.floor(Math.random()*questions.length)];

}

function customerEnter(){

    customer.style.left="-120px";

    speech.classList.add("hidden");

    questionWindow.classList.add("hidden");

    result.innerHTML="";

    choices.innerHTML="";

    currentQuestion=randomQuestion();

    setTimeout(()=>{

        customer.style.left="38%";

    },100);

    setTimeout(()=>{

        speech.classList.remove("hidden");

        speech.style.left="45%";

        speech.style.top="140px";

        speechText.innerHTML=
        currentQuestion.device+
        "<br><br>"+
        currentQuestion.symptom;

    },1400);

}

function openQuestion(){


    speech.classList.add("hidden");

    questionWindow.classList.remove("hidden");

    deviceName.textContent=currentQuestion.device;

    symptom.textContent=currentQuestion.symptom;

    choices.innerHTML="";

    currentQuestion.choices.forEach(item=>{

        const btn=document.createElement("button");

        btn.className="choice";

        btn.textContent=item;

        btn.onclick=()=>answer(item);

        choices.appendChild(btn);

    });

}
function answer(select){

    const buttons=document.querySelectorAll(".choice");

    buttons.forEach(btn=>btn.disabled=true);

    if(select===currentQuestion.answer){

        combo++;
        solved++;

        money+=currentQuestion.price;

        level=1+Math.floor(solved/5);

        updateHUD();

        result.style.color="#5cff7d";

        result.innerHTML=
        "✅ 正解！<br>+"+
        currentQuestion.price.toLocaleString()+
        "円";

    }else{

        combo=0;

        updateHUD();

        result.style.color="#ff6a6a";

        result.innerHTML=
        "❌ 不正解<br>正解："+currentQuestion.answer;

    }

    setTimeout(()=>{

        customerLeave();

    },1800);

}

function customerLeave(){

    speech.classList.add("hidden");

    questionWindow.classList.add("hidden");

    customer.style.left="120%";

    setTimeout(()=>{

        customerEnter();

    },1500);

}

acceptBtn.onclick=()=>{

    openQuestion();

};

startButton.onclick=()=>{

    startScreen.style.display="none";

    updateHUD();

    customerEnter();

};

window.onload=()=>{

    updateHUD();

};
/* ========= Player Move ========= */

let px = window.innerWidth * 0.45;
let py = window.innerHeight * 0.68;

player.style.left = px + "px";
player.style.top = py + "px";

const keys = {};

document.addEventListener("keydown",(e)=>{
    keys[e.key]=true;
});

document.addEventListener("keyup",(e)=>{
    keys[e.key]=false;
});

let touchMove=false;
let targetX=px;
let targetY=py;

document.addEventListener("pointerdown",(e)=>{
    touchMove=true;
    targetX=e.clientX-player.offsetWidth/2;
    targetY=e.clientY-player.offsetHeight/2;
});

document.addEventListener("pointermove",(e)=>{
    if(!touchMove)return;
    targetX=e.clientX-player.offsetWidth/2;
    targetY=e.clientY-player.offsetHeight/2;
});

document.addEventListener("pointerup",()=>{
    touchMove=false;
});

function movePlayer(){

    const speed=4;

    if(keys["ArrowLeft"]||keys["a"]) px-=speed;
    if(keys["ArrowRight"]||keys["d"]) px+=speed;
    if(keys["ArrowUp"]||keys["w"]) py-=speed;
    if(keys["ArrowDown"]||keys["s"]) py+=speed;

    if(touchMove){
        px+=(targetX-px)*0.15;
        py+=(targetY-py)*0.15;
    }

    px=Math.max(0,Math.min(window.innerWidth-player.offsetWidth,px));
    py=Math.max(70,Math.min(window.innerHeight-player.offsetHeight,py));

    player.style.left=px+"px";
    player.style.top=py+"px";

    requestAnimationFrame(movePlayer);
}

movePlayer();

/* ========= Audio ========= */

let bgm;
let audioReady=false;

function initAudio(){

    if(audioReady)return;

    audioReady=true;

    bgm=new Audio("assets/bgm.mp3");

    bgm.loop=true;
    bgm.volume=0.3;

}

startButton.addEventListener("click",()=>{

    initAudio();

    bgm.play().catch(()=>{});

});

function playSE(name){

    const se=new Audio("assets/"+name);

    se.volume=0.5;

    se.play().catch(()=>{});

}

/* ========= Save ========= */

function saveGame(){

    localStorage.setItem("repairLegend",JSON.stringify({

        money,

        level,

        combo,

        solved

    }));

}

function loadGame(){

    const data=localStorage.getItem("repairLegend");

    if(!data)return;

    const save=JSON.parse(data);

    money=save.money||0;

    level=save.level||1;

    combo=save.combo||0;

    solved=save.solved||0;

    updateHUD();

}

window.addEventListener("beforeunload",saveGame);

loadGame();

/* ========= Effects ========= */

function flash(text,color){

    const div=document.createElement("div");

    div.innerHTML=text;

    div.style.position="absolute";
    div.style.left="50%";
    div.style.top="45%";
    div.style.transform="translate(-50%,-50%)";
    div.style.fontSize="42px";
    div.style.fontWeight="bold";
    div.style.color=color;
    div.style.zIndex="999";

    document.body.appendChild(div);

    div.animate([

        {opacity:1,transform:"translate(-50%,-50%) scale(1)"},

        {opacity:0,transform:"translate(-50%,-120%) scale(1.6)"}

    ],{

        duration:900

    });

    setTimeout(()=>div.remove(),900);

}