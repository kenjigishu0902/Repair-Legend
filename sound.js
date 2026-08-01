/* =========================================================
   Repair Legend v1.0
   sound.js - Web Audio API 完成版

   外部MP3不要
   ・BGM
   ・タップ音
   ・来店ベル
   ・正解音
   ・不正解音
   ・修理完了音
   ・コイン音
   ・iPhone / iPad Safari対応
   ========================================================= */

"use strict";

(function () {
    const STORAGE_KEY = "repairLegendSoundMuted";

    let audioContext = null;
    let masterGain = null;
    let bgmGain = null;
    let effectGain = null;

    let unlocked = false;
    let muted = false;
    let bgmPlaying = false;
    let bgmTimer = null;
    let bgmStep = 0;

    const BGM_NOTES = [
        261.63, 329.63, 392.00, 523.25,
        392.00, 329.63, 293.66, 349.23,
        440.00, 523.25, 440.00, 349.23,
        293.66, 329.63, 392.00, 329.63
    ];

    function loadMutedState() {
        try {
            muted = localStorage.getItem(STORAGE_KEY) === "true";
        } catch (error) {
            muted = false;
        }
    }

    function saveMutedState() {
        try {
            localStorage.setItem(STORAGE_KEY, String(muted));
        } catch (error) {
            // 保存できなくてもゲームは続行する
        }
    }

    function getAudioContextClass() {
        return window.AudioContext || window.webkitAudioContext || null;
    }

    function initialize() {
        if (audioContext) {
            return true;
        }

        const AudioContextClass = getAudioContextClass();

        if (!AudioContextClass) {
            console.warn("Web Audio APIに対応していません。");
            return false;
        }

        loadMutedState();

        audioContext = new AudioContextClass();

        masterGain = audioContext.createGain();
        bgmGain = audioContext.createGain();
        effectGain = audioContext.createGain();

        masterGain.gain.value = muted ? 0 : 1;
        bgmGain.gain.value = 0.17;
        effectGain.gain.value = 0.55;

        bgmGain.connect(masterGain);
        effectGain.connect(masterGain);
        masterGain.connect(audioContext.destination);

        return true;
    }

    async function unlockAudio() {
        if (!initialize()) {
            return false;
        }

        try {
            if (audioContext.state === "suspended") {
                await audioContext.resume();
            }

            const oscillator = audioContext.createOscillator();
            const gain = audioContext.createGain();

            gain.gain.value = 0.0001;
            oscillator.connect(gain);
            gain.connect(masterGain);

            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.02);

            unlocked = true;
            return true;
        } catch (error) {
            console.warn("音声の解放に失敗しました。", error);
            return false;
        }
    }

    function playTone(options = {}) {
        if (!initialize() || muted) {
            return;
        }

        const {
            frequency = 440,
            endFrequency = frequency,
            duration = 0.12,
            volume = 0.25,
            type = "square",
            delay = 0,
            destination = effectGain
        } = options;

        const now = audioContext.currentTime + delay;
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(
            Math.max(20, frequency),
            now
        );

        oscillator.frequency.exponentialRampToValueAtTime(
            Math.max(20, endFrequency),
            now + duration
        );

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(
            Math.max(0.0001, volume),
            now + 0.01
        );
        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            now + duration
        );

        oscillator.connect(gain);
        gain.connect(destination);

        oscillator.start(now);
        oscillator.stop(now + duration + 0.03);
    }

    function playNoise(options = {}) {
        if (!initialize() || muted) {
            return;
        }

        const {
            duration = 0.12,
            volume = 0.12,
            delay = 0
        } = options;

        const sampleRate = audioContext.sampleRate;
        const frameCount = Math.floor(sampleRate * duration);
        const buffer = audioContext.createBuffer(1, frameCount, sampleRate);
        const data = buffer.getChannelData(0);

        for (let index = 0; index < frameCount; index += 1) {
            data[index] = Math.random() * 2 - 1;
        }

        const source = audioContext.createBufferSource();
        const gain = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();
        const now = audioContext.currentTime + delay;

        filter.type = "highpass";
        filter.frequency.value = 1200;

        gain.gain.setValueAtTime(volume, now);
        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            now + duration
        );

        source.buffer = buffer;
        source.connect(filter);
        filter.connect(gain);
        gain.connect(effectGain);

        source.start(now);
        source.stop(now + duration);
    }

    function scheduleBgmStep() {
        if (!bgmPlaying || muted || !audioContext) {
            return;
        }

        const note = BGM_NOTES[bgmStep % BGM_NOTES.length];
        const bass = note / 2;

        playTone({
            frequency: note,
            endFrequency: note,
            duration: 0.16,
            volume: 0.10,
            type: "square",
            destination: bgmGain
        });

        if (bgmStep % 2 === 0) {
            playTone({
                frequency: bass,
                endFrequency: bass,
                duration: 0.28,
                volume: 0.08,
                type: "triangle",
                destination: bgmGain
            });
        }

        bgmStep += 1;
        bgmTimer = window.setTimeout(scheduleBgmStep, 220);
    }

    async function playBgm(options = {}) {
        const { restart = false } = options;

        await unlockAudio();

        if (!audioContext || muted) {
            return false;
        }

        if (restart) {
            bgmStep = 0;
        }

        if (bgmPlaying) {
            return true;
        }

        bgmPlaying = true;
        scheduleBgmStep();

        return true;
    }

    function pauseBgm() {
        bgmPlaying = false;

        if (bgmTimer !== null) {
            clearTimeout(bgmTimer);
            bgmTimer = null;
        }
    }

    function stopBgm() {
        pauseBgm();
        bgmStep = 0;
    }

    function playTap() {
        playTone({
            frequency: 760,
            endFrequency: 540,
            duration: 0.06,
            volume: 0.14,
            type: "square"
        });
    }

    function playBell() {
        playTone({
            frequency: 659.25,
            duration: 0.24,
            volume: 0.20,
            type: "sine"
        });

        playTone({
            frequency: 987.77,
            duration: 0.38,
            volume: 0.17,
            type: "sine",
            delay: 0.11
        });
    }

    function playCorrect() {
        [523.25, 659.25, 783.99].forEach((frequency, index) => {
            playTone({
                frequency,
                duration: 0.13,
                volume: 0.18,
                type: "square",
                delay: index * 0.09
            });
        });
    }

    function playWrong() {
        playTone({
            frequency: 220,
            endFrequency: 92,
            duration: 0.38,
            volume: 0.22,
            type: "sawtooth"
        });

        playNoise({
            duration: 0.18,
            volume: 0.07
        });
    }

    function playRepairComplete() {
        const notes = [392.00, 523.25, 659.25, 783.99, 1046.50];

        notes.forEach((frequency, index) => {
            playTone({
                frequency,
                duration: 0.18,
                volume: 0.17,
                type: index % 2 === 0 ? "square" : "triangle",
                delay: index * 0.08
            });
        });
    }

    function playCoin() {
        playTone({
            frequency: 880,
            duration: 0.08,
            volume: 0.16,
            type: "square"
        });

        playTone({
            frequency: 1318.51,
            duration: 0.17,
            volume: 0.19,
            type: "square",
            delay: 0.07
        });
    }

    function playComboCoin(combo = 1) {
        const safeCombo = Math.max(1, Number(combo) || 1);
        const multiplier = Math.min(1.65, 1 + (safeCombo - 1) * 0.055);

        playTone({
            frequency: 880 * multiplier,
            duration: 0.08,
            volume: 0.15,
            type: "square"
        });

        playTone({
            frequency: 1318.51 * multiplier,
            duration: 0.16,
            volume: 0.18,
            type: "square",
            delay: 0.06
        });
    }

    function setMuted(value) {
        muted = Boolean(value);

        if (masterGain) {
            masterGain.gain.value = muted ? 0 : 1;
        }

        if (muted) {
            pauseBgm();
        }

        saveMutedState();
        return muted;
    }

    function toggleMute() {
        const wasPlaying = bgmPlaying;
        const result = setMuted(!muted);

        if (!result && wasPlaying) {
            playBgm();
        }

        return result;
    }

    function isMuted() {
        return muted;
    }

    function isBgmPlaying() {
        return bgmPlaying;
    }

    function getStatus() {
        return {
            initialized: Boolean(audioContext),
            unlocked,
            muted,
            bgmPlaying,
            contextState: audioContext ? audioContext.state : "unavailable"
        };
    }

    function registerButtonSounds() {
        document.addEventListener("click", (event) => {
            const button = event.target.closest("button");

            if (!button || button.disabled) {
                return;
            }

            if (button.dataset.noTapSound === "true") {
                return;
            }

            playTap();
        });
    }

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            pauseBgm();
        }
    });

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            registerButtonSounds,
            { once: true }
        );
    } else {
        registerButtonSounds();
    }

    window.RepairLegendSound = Object.freeze({
        initialize,
        unlockAudio,
        playBgm,
        pauseBgm,
        stopBgm,
        playTap,
        playBell,
        playCorrect,
        playWrong,
        playRepairComplete,
        playCoin,
        playComboCoin,
        setMuted,
        toggleMute,
        isMuted,
        isBgmPlaying,
        getStatus
    });
})();