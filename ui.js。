// ui.js

const hint = document.getElementById("hint");
const moneyText = document.getElementById("money");
const levelText = document.getElementById("level");
const comboText = document.getElementById("combo");
const statusText = document.getElementById("status");

function setHint(text){
    if(hint) hint.textContent = text;
}

function setStatus(text){
    if(statusText) statusText.textContent = text;
}

function updateHUD(){

    if(moneyText)
        moneyText.textContent = money.toLocaleString();

    if(levelText)
        levelText.textContent = level;

    if(comboText)
        comboText.textContent = combo;

}

function flash(text,color){

    const effect=document.createElement("div");

    effect.className="effect";

    effect.textContent=text;

    effect.style.color=color;

    effect.style.position="absolute";
    effect.style.left="50%";
    effect.style.top="45%";
    effect.style.transform="translate(-50%,-50%)";
    effect.style.fontSize="42px";
    effect.style.fontWeight="900";
    effect.style.pointerEvents="none";
    effect.style.zIndex="9999";

    document.body.appendChild(effect);

    effect.animate([
        {
            opacity:1,
            transform:"translate(-50%,-50%) scale(1)"
        },
        {
            opacity:0,
            transform:"translate(-50%,-130%) scale(1.8)"
        }
    ],{
        duration:900,
        easing:"ease-out"
    });

    setTimeout(()=>{
        effect.remove();
    },900);

}

function showResult(success){

    if(success){

        flash("PERFECT!","#5cff7d");

        setStatus("修理成功");

    }else{

        flash("MISS","#ff5555");

        setStatus("修理失敗");

    }

}