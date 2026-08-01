/* =========================================================
   Repair Legend v1.0
   sound.js - iPhone / iPad Safari 音声強化版

   外部MP3不要
   ・BGM
   ・操作音
   ・来店ベル
   ・正解 / 不正解
   ・修理完了
   ・コイン
   ========================================================= */

"use strict";

(function () {
    let audioContext = null;
    let masterGain = null;
    let bgmGain = null;
    let effectGain = null;

    let muted = false;
    let unlocked = false;
    let bgmPlaying = false;
    let bgmTimer = null;
    let bgmStep = 0;

    const BGM_NOTES = [
        261.63, 329.63, 392.00, 523.25,
        392.00, 329.63, 293.66, 349.23,
        440.00, 523.25, 440.00, 349.23,
        293.66, 329.63, 392.00, 329.63
    ];

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

        audioContext = new AudioContextClass();

        masterGain = audioContext.createGain();
        bgmGain = audioContext.createGain();
        effectGain = audioContext.createGain();

        masterGain.gain.value = 1;
        bgmGain.gain.value = 0.22;
        effectGain.gain.value = 0.75;

        bgmGain.connect(masterGain);
        effectGain.connect(masterGain);
        masterGain.connect(audioContext.destination);

        muted = false;

        return true;
    }

    async function unlockAudio() {
        if (!initialize()) {
            return false;
        }

        try {
            if (audioContext.state !== "running") {
                await audioContext.resume();
            }

            const oscillator = audioContext.createOscillator();
            const gain = audioContext.createGain();
            const now = audioContext.currentTime;

            oscillator.type = "square";
            oscillator.frequency.value = 440;

            gain.gain.setValueAtTime(0.0001, now);

            oscillator.connect(gain);
            gain.connect(masterGain);

            oscillator.start(now);
            oscillator.stop(now + 0.02);

            unlocked = audioContext.state === "running";
            return unlocked;
        } catch (error) {
            console.warn("音声の初期化に失敗しました。", error);
            return false;
        }
    }

    function playTone(options = {}) {
        if (!initialize() || muted || audioContext.state !== "running") {
            return false;
        }

        const {
            frequency = 440,
            endFrequency = frequency,
            duration = 0.12,
            volume = 0.2,
            type = "square",
            delay = 0,
            destination = effectGain
        } = options;

        const now = audioContext.currentTime + Math.max(0, delay);
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(Math.max(20, frequency), now);
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
        oscillator.stop(now + duration + 0.04);

        return true;
    }

    function playNoise(duration = 0.15, volume = 0.08) {
        if (!initialize() || muted || audioContext.state !== "running") {
            return false;
        }

        const frameCount = Math.floor(audioContext.sampleRate * duration);
        const buffer = audioContext.createBuffer(
            1,
            frameCount,
            audioContext.sampleRate
        );
        const data = buffer.getChannelData(0);

        for (let index = 0; index < frameCount; index += 1) {
            data[index] = Math.random() * 2 - 1;
        }

        const source = audioContext.createBufferSource();
        const filter = audioContext.createBiquadFilter();
        const gain = audioContext.createGain();
        const now = audioContext.currentTime;

        source.buffer = buffer;

        filter.type = "highpass";
        filter.frequency.value = 1000;

        gain.gain.setValueAtTime(volume, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        source.connect(filter);
        filter.connect(gain);
        gain.connect(effectGain);

        source.start(now);
        source.stop(now + duration);

        return true;
    }

    function scheduleBgmStep() {
        if (
            !bgmPlaying ||
            muted ||
            !audioContext ||
            audioContext.state !== "running"
        ) {
            return;
        }

        const note = BGM_NOTES[bgmStep % BGM_NOTES.length];

        playTone({
            frequency: note,
            endFrequency: note,
            duration: 0.17,
            volume: 0.11,
            type: "square",
            destination: bgmGain
        });

        if (bgmStep % 2 === 0) {
            playTone({
                frequency: note / 2,
                endFrequency: note / 2,
                duration: 0.30,
                volume: 0.08,
                type: "triangle",
                destination: bgmGain
            });
        }

        bgmStep += 1;
        bgmTimer = window.setTimeout(scheduleBgmStep, 230);
    }

    async function playBgm(options = {}) {
        const { restart = false } = options;

        const ready = await unlockAudio();

        if (!ready || muted) {
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
            window.clearTimeout(bgmTimer);
            bgmTimer = null;
        }
    }

    function stopBgm() {
        pauseBgm();
        bgmStep = 0;
    }

    function playTap() {
        return playTone({
            frequency: 820,
            endFrequency: 520,
            duration: 0.07,
            volume: 0.20,
            type: "square"
        });
    }

    function playBell() {
        playTone({
            frequency: 659.25,
            duration: 0.25,
            volume: 0.24,
            type: "sine"
        });

        playTone({
            frequency: 987.77,
            duration: 0.38,
            volume: 0.22,
            type: "sine",
            delay: 0.12
        });
    }

    function playCorrect() {
        [523.25, 659.25, 783.99].forEach((frequency, index) => {
            playTone({
                frequency,
                duration: 0.14,
                volume: 0.22,
                type: "square",
                delay: index * 0.09
            });
        });
    }

    function playWrong() {
        playTone({
            frequency: 220,
            endFrequency: 80,
            duration: 0.42,
            volume: 0.26,
            type: "sawtooth"
        });

        playNoise(0.18, 0.08);
    }

    function playRepairComplete() {
        [392.00, 523.25, 659.25, 783.99, 1046.50].forEach(
            (frequency, index) => {
                playTone({
                    frequency,
                    duration: 0.20,
                    volume: 0.21,
                    type: index % 2 === 0 ? "square" : "triangle",
                    delay: index * 0.08
                });
            }
        );
    }

    function playCoin() {
        playTone({
            frequency: 880,
            duration: 0.09,
            volume: 0.22,
            type: "square"
        });

        playTone({
            frequency: 1318.51,
            duration: 0.18,
            volume: 0.24,
            type: "square",
            delay: 0.07
        });
    }

    function playComboCoin(combo = 1) {
        const safeCombo = Math.max(1, Number(combo) || 1);
        const multiplier = Math.min(
            1.65,
            1 + (safeCombo - 1) * 0.055
        );

        playTone({
            frequency: 880 * multiplier,
            duration: 0.09,
            volume: 0.21,
            type: "square"
        });

        playTone({
            frequency: 1318.51 * multiplier,
            duration: 0.18,
            volume: 0.23,
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

        return muted;
    }

    function toggleMute() {
        const shouldResume = bgmPlaying;
        const result = setMuted(!muted);

        if (!result && shouldResume) {
            playBgm();
        }

        return result;
    }

    function getStatus() {
        return {
            initialized: Boolean(audioContext),
            unlocked,
            muted,
            bgmPlaying,
            contextState: audioContext
                ? audioContext.state
                : "unavailable"
        };
    }

    /*
     * iPhone / iPadでは最初のpointerdown内でresumeするのが最も確実。
     */
    function handleFirstInteraction() {
        unlockAudio();
    }

    function registerButtonSounds() {
        document.addEventListener(
            "pointerdown",
            handleFirstInteraction,
            {
                capture: true,
                passive: true
            }
        );

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
        isMuted: () => muted,
        isBgmPlaying: () => bgmPlaying,
        getStatus
    });
})();