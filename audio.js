// audio.js

let audioContext;
let bgmInterval;

let bgmOn = true;
let seOn = true;

function initAudio(){

    if(audioContext) return;

    audioContext = new (window.AudioContext || window.webkitAudioContext)();

}

function playTone(freq,time=0.12,type="square",vol=0.08){

    if(!seOn) return;
    if(!audioContext) return;

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.type = type;
    osc.frequency.value = freq;

    gain.gain.value = vol;

    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.start();

    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audioContext.currentTime + time
    );

    osc.stop(audioContext.currentTime + time);

}

function seOK(){

    playTone(700,.08);
    setTimeout(()=>playTone(900,.12),90);

}

function seNG(){

    playTone(180,.25,"sawtooth");

}

function seCoin(){

    playTone(900,.05);

    setTimeout(()=>playTone(1200,.12),60);

}

function seTap(){

    playTone(500,.05);

}

function startBGM(){

    if(!bgmOn) return;
    if(bgmInterval) return;

    const notes=[
        262,
        330,
        392,
        523,
        392,
        330,
        294,
        349
    ];

    let i=0;

    bgmInterval=setInterval(()=>{

        playTone(
            notes[i%notes.length],
            .20,
            "triangle",
            .03
        );

        i++;

    },320);

}

function stopBGM(){

    clearInterval(bgmInterval);

    bgmInterval=null;

}