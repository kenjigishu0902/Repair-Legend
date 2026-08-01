// repair.js

let repairing = false;
let repairProgress = 0;

function startRepair(){

    if(repairing) return;

    repairing = true;
    repairProgress = 0;

    const bar = document.getElementById("progress");
    const wrap = document.getElementById("progressWrap");

    wrap.style.display = "block";
    bar.style.width = "0%";

    seTap();

    const timer = setInterval(()=>{

        repairProgress += 2;

        bar.style.width = repairProgress + "%";

        // 火花エフェクト
        if(repairProgress % 10 === 0){
            flash("🔧","#ffd700");
        }

        if(repairProgress >= 100){

            clearInterval(timer);

            repairing = false;

            finishRepair();

        }

    },40);

}

function finishRepair(){

    seOK();

    flash("修理成功！","#66ff88");

    money += currentQuestion.price;

    combo++;

    solved++;

    level = 1 + Math.floor(solved/5);

    updateHUD();

    saveData();

    customerHappy();

}