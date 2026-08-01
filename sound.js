/* =========================================================
   Repair Legend v1.0
   sound.js

   役割
   ・BGM管理
   ・効果音管理
   ・iPhone / iPadの音声再生制限への対応
   ・ミュート管理
   ・音量管理
   ・連続再生対応
   ・game.js向け共通API
   ========================================================= */

"use strict";

(function () {

    /* =====================================================
       CONSTANTS
       ===================================================== */

    const STORAGE_KEYS = Object.freeze({
        MUTED: "repairLegendMuted",
        BGM_VOLUME: "repairLegendBgmVolume",
        SE_VOLUME: "repairLegendSeVolume"
    });

    const DEFAULT_VOLUMES = Object.freeze({
        BGM: 0.28,
        SE: 0.72
    });

    const SOUND_IDS = Object.freeze({
        BGM: "bgm",
        TAP: "tapSound",
        BELL: "bellSound",
        CORRECT: "correctSound",
        WRONG: "wrongSound",
        REPAIR: "repairSound",
        COIN: "coinSound"
    });


    /* =====================================================
       INTERNAL STATE
       ===================================================== */

    let initialized = false;
    let audioUnlocked = false;
    let muted = false;

    let bgmVolume = DEFAULT_VOLUMES.BGM;
    let seVolume = DEFAULT_VOLUMES.SE;

    let bgmAudio = null;

    const soundElements = {
        tap: null,
        bell: null,
        correct: null,
        wrong: null,
        repair: null,
        coin: null
    };

    const activeClones = new Set();


    /* =====================================================
       STORAGE
       ===================================================== */

    /**
     * localStorageから設定を読み込む
     */
    function loadSettings() {

        try {

            const storedMuted = localStorage.getItem(
                STORAGE_KEYS.MUTED
            );

            const storedBgmVolume = localStorage.getItem(
                STORAGE_KEYS.BGM_VOLUME
            );

            const storedSeVolume = localStorage.getItem(
                STORAGE_KEYS.SE_VOLUME
            );

            if (storedMuted !== null) {

                muted = storedMuted === "true";

            }

            if (storedBgmVolume !== null) {

                bgmVolume = clampVolume(
                    Number(storedBgmVolume)
                );

            }

            if (storedSeVolume !== null) {

                seVolume = clampVolume(
                    Number(storedSeVolume)
                );

            }

        } catch (error) {

            console.warn(
                "サウンド設定の読み込みに失敗しました。",
                error
            );

        }

    }


    /**
     * localStorageへ設定を保存する
     */
    function saveSettings() {

        try {

            localStorage.setItem(
                STORAGE_KEYS.MUTED,
                String(muted)
            );

            localStorage.setItem(
                STORAGE_KEYS.BGM_VOLUME,
                String(bgmVolume)
            );

            localStorage.setItem(
                STORAGE_KEYS.SE_VOLUME,
                String(seVolume)
            );

        } catch (error) {

            console.warn(
                "サウンド設定の保存に失敗しました。",
                error
            );

        }

    }


    /* =====================================================
       UTILITY
       ===================================================== */

    /**
     * 音量を0〜1へ制限する
     *
     * @param {number} value
     * @returns {number}
     */
    function clampVolume(value) {

        if (!Number.isFinite(value)) {

            return 0;

        }

        return Math.min(
            1,
            Math.max(0, value)
        );

    }


    /**
     * DOMから音声要素を取得する
     *
     * @param {string} id
     * @returns {HTMLAudioElement|null}
     */
    function getAudioElement(id) {

        const element = document.getElementById(id);

        if (!(element instanceof HTMLAudioElement)) {

            console.warn(
                `audio要素 #${id} が見つかりません。`
            );

            return null;

        }

        return element;

    }


    /**
     * Promiseエラーを安全に処理する
     *
     * @param {Promise|undefined} playPromise
     */
    function handlePlayPromise(playPromise) {

        if (
            playPromise &&
            typeof playPromise.catch === "function"
        ) {

            playPromise.catch(
                function (error) {

                    if (
                        error &&
                        error.name !== "AbortError" &&
                        error.name !== "NotAllowedError"
                    ) {

                        console.warn(
                            "音声再生に失敗しました。",
                            error
                        );

                    }

                }
            );

        }

    }


    /**
     * 音声要素の再生位置を安全に戻す
     *
     * @param {HTMLAudioElement} audio
     */
    function resetAudioTime(audio) {

        if (!audio) {

            return;

        }

        try {

            audio.currentTime = 0;

        } catch (error) {

            /*
             * 音声ファイルがまだ読み込まれていない場合は
             * currentTime変更に失敗することがあります。
             */

        }

    }


    /* =====================================================
       INITIALIZATION
       ===================================================== */

    /**
     * サウンドシステムを初期化する
     *
     * @returns {boolean}
     */
    function initialize() {

        if (initialized) {

            return true;

        }

        loadSettings();

        bgmAudio = getAudioElement(
            SOUND_IDS.BGM
        );

        soundElements.tap = getAudioElement(
            SOUND_IDS.TAP
        );

        soundElements.bell = getAudioElement(
            SOUND_IDS.BELL
        );

        soundElements.correct = getAudioElement(
            SOUND_IDS.CORRECT
        );

        soundElements.wrong = getAudioElement(
            SOUND_IDS.WRONG
        );

        soundElements.repair = getAudioElement(
            SOUND_IDS.REPAIR
        );

        soundElements.coin = getAudioElement(
            SOUND_IDS.COIN
        );

        configureAudioElements();

        registerUnlockEvents();

        initialized = true;

        console.log(
            "Repair Legend Sound: 初期化完了"
        );

        return true;

    }


    /**
     * 音声要素へ初期設定を適用する
     */
    function configureAudioElements() {

        if (bgmAudio) {

            bgmAudio.loop = true;
            bgmAudio.preload = "auto";
            bgmAudio.volume = muted ? 0 : bgmVolume;

            bgmAudio.setAttribute(
                "playsinline",
                ""
            );

            bgmAudio.setAttribute(
                "webkit-playsinline",
                ""
            );

        }

        Object.values(soundElements).forEach(
            function (audio) {

                if (!audio) {

                    return;

                }

                audio.preload = "auto";
                audio.volume = muted ? 0 : seVolume;

                audio.setAttribute(
                    "playsinline",
                    ""
                );

                audio.setAttribute(
                    "webkit-playsinline",
                    ""
                );

            }
        );

    }


    /* =====================================================
       AUDIO UNLOCK
       iPhone / iPad対応
       ===================================================== */

    /**
     * ユーザー操作時に音声を解放するイベントを登録する
     */
    function registerUnlockEvents() {

        const unlockOptions = {
            once: true,
            passive: true
        };

        document.addEventListener(
            "touchstart",
            unlockAudio,
            unlockOptions
        );

        document.addEventListener(
            "pointerdown",
            unlockAudio,
            unlockOptions
        );

        document.addEventListener(
            "keydown",
            unlockAudio,
            {
                once: true
            }
        );

    }


    /**
     * iOSの音声再生制限を解除する
     *
     * @returns {Promise<boolean>}
     */
    async function unlockAudio() {

        if (audioUnlocked) {

            return true;

        }

        if (!initialized) {

            initialize();

        }

        const audioList = [
            bgmAudio,
            ...Object.values(soundElements)
        ].filter(Boolean);

        for (const audio of audioList) {

            try {

                const originalVolume = audio.volume;
                const originalMuted = audio.muted;
                const originalLoop = audio.loop;

                audio.muted = true;
                audio.volume = 0;
                audio.loop = false;

                const playPromise = audio.play();

                if (
                    playPromise &&
                    typeof playPromise.then === "function"
                ) {

                    await playPromise;

                }

                audio.pause();

                resetAudioTime(audio);

                audio.muted = originalMuted;
                audio.volume = originalVolume;
                audio.loop = originalLoop;

            } catch (error) {

                /*
                 * ブラウザやファイル状態によっては
                 * 一部の音声だけ解放できない場合があります。
                 */

            }

        }

        audioUnlocked = true;

        applyVolumes();

        return true;

    }


    /* =====================================================
       BGM
       ===================================================== */

    /**
     * BGMを再生する
     *
     * @param {Object} options
     * @param {boolean} options.restart
     * @param {boolean} options.fadeIn
     * @param {number} options.fadeDuration
     * @returns {Promise<boolean>}
     */
    async function playBgm(options = {}) {

        const {
            restart = false,
            fadeIn = true,
            fadeDuration = 700
        } = options;

        if (!initialized) {

            initialize();

        }

        if (!bgmAudio) {

            return false;

        }

        if (muted) {

            return false;

        }

        if (!audioUnlocked) {

            await unlockAudio();

        }

        if (restart) {

            resetAudioTime(bgmAudio);

        }

        bgmAudio.loop = true;

        if (fadeIn) {

            bgmAudio.volume = 0;

        } else {

            bgmAudio.volume = bgmVolume;

        }

        try {

            await bgmAudio.play();

            if (fadeIn) {

                fadeAudioVolume(
                    bgmAudio,
                    bgmVolume,
                    fadeDuration
                );

            }

            return true;

        } catch (error) {

            if (
                error &&
                error.name !== "NotAllowedError"
            ) {

                console.warn(
                    "BGMの再生に失敗しました。",
                    error
                );

            }

            return false;

        }

    }


    /**
     * BGMを一時停止する
     *
     * @param {boolean} fadeOut
     * @param {number} fadeDuration
     */
    function pauseBgm(
        fadeOut = true,
        fadeDuration = 450
    ) {

        if (!bgmAudio) {

            return;

        }

        if (!fadeOut) {

            bgmAudio.pause();

            return;

        }

        fadeAudioVolume(
            bgmAudio,
            0,
            fadeDuration,
            function () {

                bgmAudio.pause();
                bgmAudio.volume =
                    muted ? 0 : bgmVolume;

            }
        );

    }


    /**
     * BGMを停止し、先頭へ戻す
     *
     * @param {boolean} fadeOut
     */
    function stopBgm(fadeOut = true) {

        if (!bgmAudio) {

            return;

        }

        if (!fadeOut) {

            bgmAudio.pause();
            resetAudioTime(bgmAudio);

            return;

        }

        fadeAudioVolume(
            bgmAudio,
            0,
            450,
            function () {

                bgmAudio.pause();
                resetAudioTime(bgmAudio);

                bgmAudio.volume =
                    muted ? 0 : bgmVolume;

            }
        );

    }


    /**
     * BGMが再生中か確認する
     *
     * @returns {boolean}
     */
    function isBgmPlaying() {

        return Boolean(
            bgmAudio &&
            !bgmAudio.paused &&
            !bgmAudio.ended
        );

    }


    /**
     * 音量を徐々に変更する
     *
     * @param {HTMLAudioElement} audio
     * @param {number} targetVolume
     * @param {number} duration
     * @param {Function|null} onComplete
     */
    function fadeAudioVolume(
        audio,
        targetVolume,
        duration = 500,
        onComplete = null
    ) {

        if (!audio) {

            return;

        }

        const safeTargetVolume = clampVolume(
            targetVolume
        );

        const startVolume = audio.volume;

        const startTime = performance.now();

        function update(currentTime) {

            const elapsed = currentTime - startTime;

            const progress = Math.min(
                1,
                elapsed / Math.max(1, duration)
            );

            const newVolume =
                startVolume +
                (
                    safeTargetVolume - startVolume
                ) * progress;

            audio.volume = clampVolume(newVolume);

            if (progress < 1) {

                requestAnimationFrame(update);

            } else if (
                typeof onComplete === "function"
            ) {

                onComplete();

            }

        }

        requestAnimationFrame(update);

    }


    /* =====================================================
       SOUND EFFECTS
       ===================================================== */

    /**
     * 効果音を再生する
     *
     * @param {string} soundName
     * @param {Object} options
     * @param {boolean} options.restart
     * @param {boolean} options.allowOverlap
     * @param {number} options.volumeMultiplier
     * @param {number} options.playbackRate
     * @returns {boolean}
     */
    function playSound(
        soundName,
        options = {}
    ) {

        const {
            restart = true,
            allowOverlap = true,
            volumeMultiplier = 1,
            playbackRate = 1
        } = options;

        if (!initialized) {

            initialize();

        }

        if (muted) {

            return false;

        }

        const baseAudio = soundElements[soundName];

        if (!baseAudio) {

            console.warn(
                `効果音 "${soundName}" が登録されていません。`
            );

            return false;

        }

        const finalVolume = clampVolume(
            seVolume * volumeMultiplier
        );

        if (allowOverlap) {

            const clonedAudio =
                baseAudio.cloneNode(true);

            clonedAudio.volume = finalVolume;
            clonedAudio.playbackRate =
                Math.max(0.5, Math.min(2, playbackRate));

            clonedAudio.setAttribute(
                "playsinline",
                ""
            );

            clonedAudio.setAttribute(
                "webkit-playsinline",
                ""
            );

            activeClones.add(clonedAudio);

            const cleanup = function () {

                clonedAudio.pause();

                activeClones.delete(clonedAudio);

                clonedAudio.removeEventListener(
                    "ended",
                    cleanup
                );

                clonedAudio.removeEventListener(
                    "error",
                    cleanup
                );

            };

            clonedAudio.addEventListener(
                "ended",
                cleanup
            );

            clonedAudio.addEventListener(
                "error",
                cleanup
            );

            handlePlayPromise(
                clonedAudio.play()
            );

            return true;

        }

        baseAudio.volume = finalVolume;
        baseAudio.playbackRate =
            Math.max(0.5, Math.min(2, playbackRate));

        if (restart) {

            resetAudioTime(baseAudio);

        }

        handlePlayPromise(
            baseAudio.play()
        );

        return true;

    }


    /**
     * タップ音
     */
    function playTap() {

        return playSound(
            "tap",
            {
                allowOverlap: true,
                volumeMultiplier: 0.68,
                playbackRate: 1
            }
        );

    }


    /**
     * 来店ベル
     */
    function playBell() {

        return playSound(
            "bell",
            {
                allowOverlap: false,
                volumeMultiplier: 0.92
            }
        );

    }


    /**
     * 正解音
     */
    function playCorrect() {

        return playSound(
            "correct",
            {
                allowOverlap: true,
                volumeMultiplier: 1
            }
        );

    }


    /**
     * 不正解音
     */
    function playWrong() {

        return playSound(
            "wrong",
            {
                allowOverlap: false,
                volumeMultiplier: 0.95
            }
        );

    }


    /**
     * 修理完了音
     */
    function playRepairComplete() {

        return playSound(
            "repair",
            {
                allowOverlap: false,
                volumeMultiplier: 1
            }
        );

    }


    /**
     * コイン獲得音
     */
    function playCoin() {

        return playSound(
            "coin",
            {
                allowOverlap: true,
                volumeMultiplier: 0.88
            }
        );

    }


    /**
     * コンボ数に合わせてコイン音の高さを変更する
     *
     * @param {number} combo
     */
    function playComboCoin(combo = 1) {

        const safeCombo = Math.max(
            1,
            Number(combo) || 1
        );

        const rateIncrease = Math.min(
            0.5,
            (safeCombo - 1) * 0.045
        );

        return playSound(
            "coin",
            {
                allowOverlap: true,
                volumeMultiplier: 0.9,
                playbackRate: 1 + rateIncrease
            }
        );

    }


    /**
     * 全効果音を停止する
     */
    function stopAllSoundEffects() {

        Object.values(soundElements).forEach(
            function (audio) {

                if (!audio) {

                    return;

                }

                audio.pause();
                resetAudioTime(audio);

            }
        );

        activeClones.forEach(
            function (audio) {

                audio.pause();

            }
        );

        activeClones.clear();

    }


    /* =====================================================
       VOLUME
       ===================================================== */

    /**
     * BGM音量を変更する
     *
     * @param {number} volume
     * @returns {number}
     */
    function setBgmVolume(volume) {

        bgmVolume = clampVolume(volume);

        if (bgmAudio) {

            bgmAudio.volume =
                muted ? 0 : bgmVolume;

        }

        saveSettings();

        return bgmVolume;

    }


    /**
     * 効果音音量を変更する
     *
     * @param {number} volume
     * @returns {number}
     */
    function setSeVolume(volume) {

        seVolume = clampVolume(volume);

        Object.values(soundElements).forEach(
            function (audio) {

                if (!audio) {

                    return;

                }

                audio.volume =
                    muted ? 0 : seVolume;

            }
        );

        saveSettings();

        return seVolume;

    }


    /**
     * 現在の音量を適用する
     */
    function applyVolumes() {

        if (bgmAudio) {

            bgmAudio.volume =
                muted ? 0 : bgmVolume;

        }

        Object.values(soundElements).forEach(
            function (audio) {

                if (!audio) {

                    return;

                }

                audio.volume =
                    muted ? 0 : seVolume;

            }
        );

    }


    /**
     * BGM音量を取得する
     *
     * @returns {number}
     */
    function getBgmVolume() {

        return bgmVolume;

    }


    /**
     * 効果音音量を取得する
     *
     * @returns {number}
     */
    function getSeVolume() {

        return seVolume;

    }


    /* =====================================================
       MUTE
       ===================================================== */

    /**
     * ミュート状態を変更する
     *
     * @param {boolean} value
     * @returns {boolean}
     */
    function setMuted(value) {

        muted = Boolean(value);

        applyVolumes();

        activeClones.forEach(
            function (audio) {

                audio.volume =
                    muted ? 0 : seVolume;

            }
        );

        saveSettings();

        return muted;

    }


    /**
     * ミュート切り替え
     *
     * @returns {boolean}
     */
    function toggleMute() {

        return setMuted(!muted);

    }


    /**
     * ミュート中か確認する
     *
     * @returns {boolean}
     */
    function isMuted() {

        return muted;

    }


    /* =====================================================
       PAGE VISIBILITY
       ===================================================== */

    /**
     * ページが非表示になった時にBGMを停止する
     */
    function handleVisibilityChange() {

        if (!bgmAudio) {

            return;

        }

        if (document.hidden) {

            if (!bgmAudio.paused) {

                bgmAudio.dataset.resumeAfterVisible =
                    "true";

                bgmAudio.pause();

            }

            return;

        }

        if (
            bgmAudio.dataset.resumeAfterVisible ===
            "true"
        ) {

            delete bgmAudio.dataset.resumeAfterVisible;

            if (!muted) {

                handlePlayPromise(
                    bgmAudio.play()
                );

            }

        }

    }


    document.addEventListener(
        "visibilitychange",
        handleVisibilityChange
    );


    /* =====================================================
       BUTTON SOUND
       ===================================================== */

    /**
     * ページ内のボタンへタップ音を自動設定する
     */
    function registerGlobalButtonSounds() {

        document.addEventListener(
            "click",
            function (event) {

                const target = event.target;

                if (!(target instanceof Element)) {

                    return;

                }

                const button = target.closest(
                    "button"
                );

                if (!button) {

                    return;

                }

                if (button.disabled) {

                    return;

                }

                if (
                    button.dataset.noTapSound ===
                    "true"
                ) {

                    return;

                }

                playTap();

            }
        );

    }


    /* =====================================================
       STATUS
       ===================================================== */

    /**
     * サウンド状態を取得する
     *
     * @returns {Object}
     */
    function getStatus() {

        return {
            initialized: initialized,
            audioUnlocked: audioUnlocked,
            muted: muted,
            bgmVolume: bgmVolume,
            seVolume: seVolume,
            bgmPlaying: isBgmPlaying(),
            activeSoundCount: activeClones.size
        };

    }


    /* =====================================================
       AUTO INITIALIZE
       ===================================================== */

    function handleDomReady() {

        initialize();
        registerGlobalButtonSounds();

    }


    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            handleDomReady,
            {
                once: true
            }
        );

    } else {

        handleDomReady();

    }


    /* =====================================================
       PUBLIC API
       ===================================================== */

    const RepairLegendSound = Object.freeze({

        initialize: initialize,

        unlockAudio: unlockAudio,

        playBgm: playBgm,

        pauseBgm: pauseBgm,

        stopBgm: stopBgm,

        isBgmPlaying: isBgmPlaying,

        playSound: playSound,

        playTap: playTap,

        playBell: playBell,

        playCorrect: playCorrect,

        playWrong: playWrong,

        playRepairComplete: playRepairComplete,

        playCoin: playCoin,

        playComboCoin: playComboCoin,

        stopAllSoundEffects: stopAllSoundEffects,

        setBgmVolume: setBgmVolume,

        setSeVolume: setSeVolume,

        getBgmVolume: getBgmVolume,

        getSeVolume: getSeVolume,

        setMuted: setMuted,

        toggleMute: toggleMute,

        isMuted: isMuted,

        getStatus: getStatus

    });


    /* =====================================================
       GLOBAL EXPORT
       game.jsから使用する
       ===================================================== */

    window.RepairLegendSound =
        RepairLegendSound;

})();