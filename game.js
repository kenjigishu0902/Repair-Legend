from pathlib import Path

game_js = r'''/* =========================================================
   Repair Legend v1.0
   game.js - iPhone / iPad Safari対応修正版
   ========================================================= */

"use strict";

(function () {
    const CONFIG = Object.freeze({
        quizTime: 10,
        gaugeMax: 100,
        enterMs: 2700,
        leaveMs: 2300,
        answerMs: 1450,
        nextMs: 450,
        completeMs: 2200,
        baseExp: 100,
        levelBase: 500,
        levelStep: 150,
        comboBonusRate: 0.05
    });

    const PHASE = Object.freeze({
        TITLE: "title",
        ENTERING: "entering",
        TALKING: "talking",
        RECEPTION: "reception",
        QUIZ: "quiz",
        ANSWER: "answer",
        COMPLETE: "complete",
        RESULT: "result",
        LEAVING: "leaving"
    });

    const RANKS = [
        { name: "D", level: 1 },
        { name: "C", level: 3 },
        { name: "B", level: 6 },
        { name: "A", level: 10 },
        { name: "S", level: 15 },
        { name: "SS", level: 22 },
        { name: "SSS", level: 30 }
    ];

    const CUSTOMERS = [
        {
            id: "iphone-screen",
            category: "iPhone",
            opening: "すみません！iPhoneを落として画面が割れてしまいました……。",
            reception: "画面は映っていますが、タッチが時々勝手に動きます。修理できますか？",
            accepted: "お願いします！大事なデータが入っているんです。",
            repairing: "画面の状態を確認して修理します！",
            completed: "画面がきれいになった！操作も問題ありません！"
        },
        {
            id: "iphone-battery",
            category: "iPhone",
            opening: "最近、iPhoneの充電がすぐになくなってしまいます。",
            reception: "朝100％にしても、お昼には残り20％くらいになります。",
            accepted: "バッテリー交換をお願いします！",
            repairing: "バッテリーと電源系統を確認します！",
            completed: "これで安心して一日使えます！"
        },
        {
            id: "iphone-charge",
            category: "iPhone",
            opening: "ケーブルを挿してもiPhoneが充電できません。",
            reception: "角度を変えると、たまに充電できることがあります。",
            accepted: "充電口の修理をお願いします。",
            repairing: "充電口と内部の接続を確認します！",
            completed: "しっかり充電できるようになりました！"
        },
        {
            id: "android-screen",
            category: "Android",
            opening: "Androidスマホの画面が真っ暗になりました。",
            reception: "着信音は鳴りますが、画面だけ何も映りません。",
            accepted: "データを消さずに修理してください。",
            repairing: "画面と表示回路を診断します！",
            completed: "写真もデータもそのままです！ありがとうございます！"
        },
        {
            id: "android-battery",
            category: "Android",
            opening: "スマホの背面が少し浮いてきました。",
            reception: "最近、本体が熱くなることもあります。",
            accepted: "危なくないように修理をお願いします。",
            repairing: "バッテリー膨張の可能性を確認します！",
            completed: "背面もきれいに閉まりました！"
        },
        {
            id: "pixel-fingerprint",
            category: "Android",
            opening: "Pixelの画面を交換してから指紋認証が使えません。",
            reception: "指紋を登録し直そうとしても途中で失敗します。",
            accepted: "指紋認証も使えるようにしてください。",
            repairing: "画面とキャリブレーション状態を確認します！",
            completed: "指紋認証も正常に使えます！"
        },
        {
            id: "galaxy-screen",
            category: "Android",
            opening: "Galaxyを落として画面に緑の線が出ました。",
            reception: "海外で購入した端末ですが、修理できますか？",
            accepted: "型番を確認して修理をお願いします。",
            repairing: "販売地域と部品仕様を確認します！",
            completed: "きれいに表示されるようになりました！"
        },
        {
            id: "switch-display",
            category: "Switch",
            opening: "Switchの本体画面だけ映らなくなりました。",
            reception: "テレビにつなぐと普通にゲームできます。",
            accepted: "本体画面の修理をお願いします。",
            repairing: "液晶とバックライトを診断します！",
            completed: "本体だけでも遊べるようになりました！"
        },
        {
            id: "switch-card",
            category: "Switch",
            opening: "Switchがゲームカードを読み込まなくなりました。",
            reception: "microSDカードは読み込めています。",
            accepted: "ゲームカードスロットを確認してください。",
            repairing: "カードスロットの状態を確認します！",
            completed: "ゲームカードを読み込めるようになりました！"
        },
        {
            id: "switch-charge",
            category: "Switch",
            opening: "Switchがまったく充電できません。",
            reception: "別の充電器を使っても反応がありません。",
            accepted: "原因を調べて修理してください。",
            repairing: "充電口と基板回路を診断します！",
            completed: "電源が入りました！セーブデータも残っています！"
        },
        {
            id: "water-damage",
            category: "修理知識",
            opening: "スマホを水の中に落としてしまいました！",
            reception: "一度電源が入りましたが、今は反応しません。",
            accepted: "データが必要なので、できる限りお願いします。",
            repairing: "通電を止めて内部洗浄と基板診断を行います！",
            completed: "データを確認できました！本当に助かりました！"
        },
        {
            id: "speaker",
            category: "修理知識",
            opening: "スマホから音が聞こえなくなりました。",
            reception: "通話も動画も音が小さくて聞き取りにくいです。",
            accepted: "スピーカーを確認してください。",
            repairing: "設定、詰まり、部品故障を切り分けます！",
            completed: "音がはっきり聞こえるようになりました！"
        }
    ];

    const dom = {};
    const state = {
        phase: PHASE.TITLE,
        started: false,
        busy: false,
        answerLocked: false,
        level: 1,
        exp: 0,
        rank: "D",
        combo: 0,
        bestCombo: 0,
        money: 0,
        gauge: 0,
        customerMoney: 0,
        currentCustomer: null,
        currentQuestion: null,
        lastCustomerId: null,
        timer: CONFIG.quizTime,
        timerId: null,
        timerToken: 0,
        sequence: 0,
        speechId: null
    };

    function $(id) {
        return document.getElementById(id);
    }

    function cacheDom() {
        dom.game = $("game");
        dom.startScreen = $("startScreen");
        dom.startButton = $("startButton");
        dom.customer = $("customer");
        dom.feni = $("feni");
        dom.speech = $("speech");
        dom.speechText = $("speechText");
        dom.receptionWindow = $("receptionWindow");
        dom.customerSymptom = $("customerSymptom");
        dom.acceptButton = $("acceptButton");
        dom.quizWindow = $("quizWindow");
        dom.category = $("category");
        dom.timer = $("timer");
        dom.question = $("question");
        dom.answers = Array.from(document.querySelectorAll(".answerBtn"));
        dom.repairPanel = $("repairPanel");
        dom.repairGauge = $("repairGauge");
        dom.repairPercent = $("repairPercent");
        dom.comboEffect = $("comboEffect");
        dom.coinEffect = $("coinEffect");
        dom.rankUpEffect = $("rankUpEffect");
        dom.completeEffect = $("completeEffect");
        dom.level = $("level");
        dom.rank = $("rank");
        dom.combo = $("combo");
        dom.money = $("money");
        dom.resultWindow = $("resultWindow");
        dom.resultRank = $("resultRank");
        dom.resultCombo = $("resultCombo");
        dom.resultMoney = $("resultMoney");
        dom.nextCustomer = $("nextCustomer");
        dom.touchSpots = Array.from(document.querySelectorAll(".touchSpot"));
    }

    function validate() {
        const required = [
            dom.game, dom.startScreen, dom.startButton, dom.customer, dom.feni,
            dom.speech, dom.speechText, dom.receptionWindow, dom.acceptButton,
            dom.quizWindow, dom.timer, dom.question, dom.repairPanel,
            dom.repairGauge, dom.repairPercent, dom.resultWindow, dom.nextCustomer
        ];

        if (required.some((item) => !item)) {
            console.error("Repair Legend: 必要なHTML要素が不足しています。");
            return false;
        }

        if (!window.RepairLegendQuiz) {
            console.error("Repair Legend: quiz.jsが読み込まれていません。");
            return false;
        }

        if (dom.answers.length !== 4) {
            console.error("Repair Legend: 回答ボタンは4個必要です。");
            return false;
        }

        return true;
    }

    function bindEvents() {
        dom.startButton.addEventListener("click", startGame, { passive: true });
        dom.acceptButton.addEventListener("click", acceptCustomer, { passive: true });
        dom.nextCustomer.addEventListener("click", nextCustomer, { passive: true });

        dom.answers.forEach((button) => {
            button.addEventListener("click", answerQuestion, { passive: true });
        });

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                stopTimer();
            } else if (state.phase === PHASE.QUIZ && !state.answerLocked) {
                startTimer();
            }
        });
    }

    function initialize() {
        cacheDom();

        if (!validate()) {
            return;
        }

        bindEvents();
        resetVisualState();
        updateHud();

        try {
            RepairLegendQuiz.createQuestionDeck(true);
        } catch (error) {
            console.error("問題データの初期化に失敗しました。", error);
        }

        setPhase(PHASE.TITLE);
        console.log("Repair Legend Game: 初期化完了");
    }

    /*
     * iPad Safari修正版
     * 音声の処理完了を待たないため、音声ファイルがなくても開始できます。
     */
    function startGame() {
        if (state.started) {
            return;
        }

        state.started = true;
        state.busy = true;
        state.sequence += 1;

        resetProgress();
        dom.startScreen.classList.add("hidden");

        try {
            if (window.RepairLegendSound) {
                Promise.resolve(RepairLegendSound.unlockAudio()).catch(() => {});
                Promise.resolve(RepairLegendSound.playBgm({
                    restart: true,
                    fadeIn: true
                })).catch(() => {});
            }
        } catch (error) {
            console.warn("無音モードでゲームを開始します。", error);
        }

        state.busy = false;

        window.setTimeout(() => {
            startNextCustomer();
        }, 250);
    }

    function resetProgress() {
        stopTimer();

        Object.assign(state, {
            phase: PHASE.TITLE,
            level: 1,
            exp: 0,
            rank: "D",
            combo: 0,
            bestCombo: 0,
            money: 0,
            gauge: 0,
            customerMoney: 0,
            currentCustomer: null,
            currentQuestion: null,
            lastCustomerId: null,
            answerLocked: false
        });

        try {
            RepairLegendQuiz.resetQuestionDeck();
            RepairLegendQuiz.createQuestionDeck(true);
        } catch (error) {
            console.warn("問題デッキの再作成に失敗しました。", error);
        }

        resetVisualState();
        updateHud();
    }

    /*
     * タイトル画面を再表示しない修正版
     */
    function resetVisualState() {
        hideReception();
        hideQuiz();
        hideResult();
        hideRepair();
        hideSpeech();
        clearAnswers();

        dom.customer.className = "";
        dom.feni.classList.remove("repairing", "celebrating", "damage");

        state.gauge = 0;
        updateGauge();

        setTimer(CONFIG.quizTime);
    }

    async function startNextCustomer() {
        if (state.busy) {
            return;
        }

        state.busy = true;
        state.sequence += 1;
        const token = state.sequence;

        state.gauge = 0;
        state.customerMoney = 0;
        state.answerLocked = false;
        state.currentQuestion = null;

        stopTimer();
        hideResult();
        hideReception();
        hideQuiz();
        hideRepair();
        hideSpeech();
        clearAnswers();

        dom.customer.className = "";
        dom.feni.classList.remove("repairing", "celebrating", "damage");

        updateGauge();

        state.currentCustomer = selectCustomer();
        setPhase(PHASE.ENTERING);

        await wait(150);
        if (token !== state.sequence) return;

        safeSound("playBell");
        dom.customer.classList.add("walking");

        await wait(CONFIG.enterMs);
        if (token !== state.sequence) return;

        dom.customer.classList.remove("walking");
        dom.customer.classList.add("waiting");

        setPhase(PHASE.TALKING);
        await wait(450);
        if (token !== state.sequence) return;

        showSpeech(state.currentCustomer.opening);
        await wait(850);
        if (token !== state.sequence) return;

        dom.customerSymptom.textContent = state.currentCustomer.reception;
        dom.acceptButton.disabled = false;
        dom.receptionWindow.classList.add("show");
        setPhase(PHASE.RECEPTION);
        state.busy = false;
    }

    function selectCustomer() {
        const list = CUSTOMERS.filter((item) => item.id !== state.lastCustomerId);
        const choices = list.length ? list : CUSTOMERS;
        const customer = choices[Math.floor(Math.random() * choices.length)];
        state.lastCustomerId = customer.id;
        return { ...customer };
    }

    async function acceptCustomer() {
        if (state.phase !== PHASE.RECEPTION || state.busy) {
            return;
        }

        state.busy = true;
        dom.acceptButton.disabled = true;
        hideReception();

        showSpeech(state.currentCustomer.accepted);
        await wait(850);

        showSpeech(state.currentCustomer.repairing);
        dom.feni.classList.add("repairing");
        await wait(750);

        dom.feni.classList.remove("repairing");
        hideSpeech();
        showRepair();

        state.busy = false;
        beginQuestion();
    }

    function beginQuestion() {
        if (state.gauge >= CONFIG.gaugeMax) {
            completeRepair();
            return;
        }

        stopTimer();
        clearAnswers();
        state.answerLocked = false;

        state.currentQuestion = getQuestion();

        if (!state.currentQuestion) {
            showSpeech("問題を読み込めませんでした。quiz.jsを確認してください。");
            console.error("Repair Legend: 問題を取得できませんでした。");
            return;
        }

        dom.category.textContent = state.currentQuestion.category;
        dom.question.textContent = state.currentQuestion.question;

        dom.answers.forEach((button, index) => {
            button.textContent = state.currentQuestion.choices[index] || "";
            button.dataset.answer = String(index);
            button.disabled = false;
        });

        dom.quizWindow.classList.add("show");
        setPhase(PHASE.QUIZ);
        startTimer();
    }

    function getQuestion() {
        let question = null;

        try {
            question = RepairLegendQuiz.getNextQuestion({
                category: state.currentCustomer ? state.currentCustomer.category : null,
                shuffleChoices: true
            });

            if (!question) {
                question = RepairLegendQuiz.getNextQuestion({
                    shuffleChoices: true
                });
            }
        } catch (error) {
            console.error("問題取得エラー", error);
        }

        return question;
    }

    function answerQuestion(event) {
        if (state.phase !== PHASE.QUIZ || state.answerLocked) {
            return;
        }

        const index = Number(event.currentTarget.dataset.answer);

        if (!Number.isInteger(index) || index < 0 || index > 3) {
            return;
        }

        processAnswer(index, false);
    }

    async function processAnswer(selectedIndex, timedOut) {
        if (state.answerLocked) {
            return;
        }

        state.answerLocked = true;
        setPhase(PHASE.ANSWER);
        stopTimer();

        dom.answers.forEach((button) => {
            button.disabled = true;
        });

        let result;

        try {
            result = RepairLegendQuiz.checkAnswer(
                state.currentQuestion,
                selectedIndex
            );
        } catch (error) {
            console.error("正誤判定エラー", error);
            return;
        }

        if (result.isCorrect) {
            const button = dom.answers[selectedIndex];
            if (button) button.classList.add("correct");

            state.combo += 1;
            state.bestCombo = Math.max(state.bestCombo, state.combo);

            const reward = calculateReward(result.reward, state.combo);
            state.money += reward;
            state.customerMoney += reward;

            addExperience(CONFIG.baseExp + state.combo * 10);
            addGauge(Number(result.gaugeGain) || 20);

            safeSound("playCorrect");
            safeSound("playComboCoin", state.combo);

            dom.feni.classList.add("celebrating");
            showCoin(reward);
            showCombo();
            updateHud();

            await wait(500);
            dom.feni.classList.remove("celebrating");
        } else {
            state.combo = 0;

            if (!timedOut && dom.answers[selectedIndex]) {
                dom.answers[selectedIndex].classList.add("wrong");
            }

            if (dom.answers[result.correctIndex]) {
                dom.answers[result.correctIndex].classList.add("reveal");
            }

            safeSound("playWrong");
            dom.feni.classList.add("damage");
            showTemporarySpeech(
                timedOut
                    ? "時間切れ！次の問題に挑戦しよう。"
                    : `不正解！正解は「${result.correctAnswer}」`,
                1200
            );

            updateHud();
            await wait(500);
            dom.feni.classList.remove("damage");
        }

        await wait(CONFIG.answerMs);
        clearAnswers();

        if (state.gauge >= CONFIG.gaugeMax) {
            completeRepair();
            return;
        }

        await wait(CONFIG.nextMs);
        beginQuestion();
    }

    function startTimer() {
        stopTimer();

        state.timerToken += 1;
        const token = state.timerToken;
        state.timer = CONFIG.quizTime;
        setTimer(state.timer);

        state.timerId = window.setInterval(() => {
            if (token !== state.timerToken) return;

            state.timer -= 1;
            setTimer(state.timer);

            if (state.timer <= 0) {
                stopTimer();
                processAnswer(-1, true);
            }
        }, 1000);
    }

    function stopTimer() {
        state.timerToken += 1;

        if (state.timerId !== null) {
            clearInterval(state.timerId);
            state.timerId = null;
        }
    }

    function setTimer(value) {
        const safeValue = Math.max(0, Number(value) || 0);
        dom.timer.textContent = String(safeValue);
        dom.timer.classList.toggle("warning", safeValue <= 3);
    }

    function addGauge(amount) {
        state.gauge = Math.min(
            CONFIG.gaugeMax,
            state.gauge + Math.max(0, Number(amount) || 0)
        );
        updateGauge();
    }

    function updateGauge() {
        const value = Math.max(0, Math.min(CONFIG.gaugeMax, state.gauge));
        dom.repairGauge.style.width = `${value}%`;
        dom.repairPercent.textContent = `${value}%`;
        dom.repairGauge.classList.toggle("complete", value >= CONFIG.gaugeMax);
    }

    async function completeRepair() {
        if (state.phase === PHASE.COMPLETE) {
            return;
        }

        state.busy = true;
        setPhase(PHASE.COMPLETE);
        stopTimer();
        hideQuiz();

        dom.feni.classList.add("celebrating");
        dom.customer.classList.remove("waiting");
        dom.customer.classList.add("happy");

        restartEffect(dom.completeEffect);
        safeSound("playRepairComplete");

        await wait(650);
        safeSound("playCoin");
        showSpeech(state.currentCustomer.completed);

        await wait(CONFIG.completeMs);
        dom.feni.classList.remove("celebrating");

        dom.resultRank.textContent = state.rank;
        dom.resultCombo.textContent = String(state.bestCombo);
        dom.resultMoney.textContent = formatMoney(state.customerMoney);
        dom.resultWindow.classList.add("show");

        setPhase(PHASE.RESULT);
        state.busy = false;
    }

    async function nextCustomer() {
        if (state.phase !== PHASE.RESULT || state.busy) {
            return;
        }

        state.busy = true;
        hideResult();
        hideSpeech();
        hideRepair();

        setPhase(PHASE.LEAVING);
        dom.customer.classList.remove("happy", "waiting");
        void dom.customer.offsetWidth;
        dom.customer.classList.add("leaving");

        await wait(CONFIG.leaveMs);
        dom.customer.classList.remove("leaving");

        state.busy = false;
        startNextCustomer();
    }

    function addExperience(amount) {
        state.exp += Math.max(0, Number(amount) || 0);

        while (state.exp >= requiredExp() && state.level < 99) {
            state.exp -= requiredExp();
            state.level += 1;

            if (dom.rankUpEffect) {
                dom.rankUpEffect.textContent = `LEVEL UP！ LV.${state.level}`;
                restartEffect(dom.rankUpEffect);
            }

            safeSound("playCoin");
        }

        updateRank();
    }

    function requiredExp() {
        return CONFIG.levelBase + (state.level - 1) * CONFIG.levelStep;
    }

    function updateRank() {
        const oldRank = state.rank;

        RANKS.forEach((rank) => {
            if (state.level >= rank.level) {
                state.rank = rank.name;
            }
        });

        if (oldRank !== state.rank && dom.rankUpEffect) {
            dom.rankUpEffect.textContent = `RANK UP！ ${state.rank}`;
            restartEffect(dom.rankUpEffect);
        }
    }

    function calculateReward(base, combo) {
        const amount = Math.max(0, Number(base) || 0);
        const bonus = Math.min(1, Math.max(0, combo - 1) * CONFIG.comboBonusRate);
        return Math.round((amount * (1 + bonus)) / 10) * 10;
    }

    function updateHud() {
        dom.level.textContent = String(state.level);
        dom.rank.textContent = state.rank;
        dom.combo.textContent = String(state.combo);
        dom.money.textContent = formatMoney(state.money);
    }

    function formatMoney(value) {
        return `¥${Math.max(0, Math.round(Number(value) || 0)).toLocaleString("ja-JP")}`;
    }

    function showSpeech(text) {
        clearTimeout(state.speechId);
        dom.speechText.textContent = String(text || "");
        dom.speech.classList.add("show");
    }

    function hideSpeech() {
        clearTimeout(state.speechId);
        dom.speech.classList.remove("show");
    }

    function showTemporarySpeech(text, duration) {
        showSpeech(text);
        state.speechId = window.setTimeout(hideSpeech, duration);
    }

    function showRepair() {
        dom.repairPanel.classList.add("show");
        updateGauge();
    }

    function hideRepair() {
        dom.repairPanel.classList.remove("show");
    }

    function hideReception() {
        dom.receptionWindow.classList.remove("show");
        dom.acceptButton.disabled = false;
    }

    function hideQuiz() {
        stopTimer();
        dom.quizWindow.classList.remove("show");
    }

    function hideResult() {
        dom.resultWindow.classList.remove("show");
        dom.nextCustomer.disabled = false;
    }

    function clearAnswers() {
        dom.answers.forEach((button) => {
            button.classList.remove("correct", "wrong", "reveal");
            button.disabled = false;
        });
    }

    function showCombo() {
        if (state.combo < 2 || !dom.comboEffect) return;
        dom.comboEffect.textContent = `${state.combo} COMBO！`;
        restartEffect(dom.comboEffect);
    }

    function showCoin(amount) {
        if (!dom.coinEffect) return;
        dom.coinEffect.textContent = `＋${formatMoney(amount)}`;
        restartEffect(dom.coinEffect);
    }

    function restartEffect(element) {
        if (!element) return;
        element.classList.remove("show");
        void element.offsetWidth;
        element.classList.add("show");
        window.setTimeout(() => element.classList.remove("show"), 1900);
    }

    function safeSound(method, ...args) {
        try {
            if (
                window.RepairLegendSound &&
                typeof RepairLegendSound[method] === "function"
            ) {
                RepairLegendSound[method](...args);
            }
        } catch (error) {
            console.warn(`サウンド処理をスキップしました: ${method}`, error);
        }
    }

    function setPhase(phase) {
        state.phase = phase;
        document.body.dataset.gamePhase = phase;
    }

    function wait(ms) {
        return new Promise((resolve) => {
            window.setTimeout(resolve, Math.max(0, Number(ms) || 0));
        });
    }

    window.RepairLegendGame = Object.freeze({
        getStatus() {
            return {
                phase: state.phase,
                level: state.level,
                experience: state.exp,
                rank: state.rank,
                combo: state.combo,
                money: state.money,
                repairGauge: state.gauge,
                currentCustomer: state.currentCustomer
                    ? { ...state.currentCustomer }
                    : null,
                currentQuestion: state.currentQuestion
                    ? {
                        ...state.currentQuestion,
                        choices: [...state.currentQuestion.choices]
                    }
                    : null
            };
        },

        forceCorrectAnswer() {
            if (state.phase !== PHASE.QUIZ || !state.currentQuestion) {
                return false;
            }

            processAnswer(state.currentQuestion.correctIndex, false);
            return true;
        },

        forceRepairComplete() {
            if (!state.started) return false;
            state.gauge = CONFIG.gaugeMax;
            updateGauge();
            completeRepair();
            return true;
        }
    });

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize, { once: true });
    } else {
        initialize();
    }
})();
