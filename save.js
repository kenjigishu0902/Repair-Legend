// save.js

const SAVE_KEY = "repairLegendSave";

function saveData(){

    const data = {

        money: money,
        level: level,
        combo: combo,
        solved: solved

    };

    localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(data)
    );

}

function loadData(){

    const json = localStorage.getItem(SAVE_KEY);

    if(!json) return;

    try{

        const data = JSON.parse(json);

        money = data.money || 0;
        level = data.level || 1;
        combo = data.combo || 0;
        solved = data.solved || 0;

        updateHUD();

    }catch(e){

        console.log("セーブ読込失敗");

    }

}

function resetSave(){

    localStorage.removeItem(SAVE_KEY);

    money = 0;
    level = 1;
    combo = 0;
    solved = 0;

    updateHUD();

}

window.addEventListener("beforeunload",saveData);

window.addEventListener("load",loadData);