const map = {

    counter:{
        x:120,
        y:140,
        width:180,
        height:80
    },

    parts:{
        x:780,
        y:140,
        width:180,
        height:80
    },

    desk:{
        x:720,
        y:420,
        width:220,
        height:90
    }

};

function insideArea(playerX,playerY,area){

    return (
        playerX > area.x &&
        playerX < area.x + area.width &&
        playerY > area.y &&
        playerY < area.y + area.height
    );

}

function currentArea(){

    if(insideArea(px,py,map.counter))
        return "counter";

    if(insideArea(px,py,map.parts))
        return "parts";

    if(insideArea(px,py,map.desk))
        return "desk";

    return null;

}