// interaction.js

let gameState = "WAIT_CUSTOMER";
// WAIT_CUSTOMER
// RECEPTION
// GET_PARTS
// REPAIR
// FINISH

function interact(){

    const area = currentArea();

    switch(gameState){

        case "RECEPTION":

            if(area==="counter"){

                openQuestion();

            }

        break;

        case "GET_PARTS":

            if(area==="parts"){

                flash("パーツを入手！","#66ddff");

                seCoin();

                gameState="REPAIR";

                setHint("修理台へ向かおう");

            }

        break;

        case "REPAIR":

            if(area==="desk"){

                startRepair();

            }

        break;

        case "FINISH":

            if(area==="counter"){

                customerLeave();

                gameState="WAIT_CUSTOMER";

            }

        break;

    }

}

function setHint(text){

    const hint=document.getElementById("hint");

    if(hint){

        hint.textContent=text;

    }

}

function startRepair(){

    flash("修理開始！","#ffd84a");

    seOK();

    let progress=0;

    const timer=setInterval(()=>{

        progress+=5;

        if(progress>=100){

            clearInterval(timer);

            finishRepair();

        }

    },100);

}

function finishRepair(){

    money+=currentQuestion.price;

    combo++;

    solved++;

    level=1+Math.floor(solved/5);

    updateHUD();

    saveData();

    flash("修理完了！","#55ff88");

    gameState="FINISH";

    setHint("受付へ戻ってお客様へ返却");

}

document.addEventListener("keydown",(e)=>{

    if(e.code==="Space"){

        interact();

    }

});

document.addEventListener("pointerdown",()=>{

    interact();

});