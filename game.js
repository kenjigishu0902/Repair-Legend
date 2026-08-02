/* =========================================================
   Repair Legend v1.0
   game.js

   ゲーム進行
   ・タイトル画面
   ・お客様来店
   ・吹き出し会話
   ・受付
   ・10秒カウントダウン
   ・4択クイズ
   ・修理ゲージ
   ・コンボ
   ・レベル
   ・ランク
   ・売上
   ・修理完了
   ・お客様退店
   ・次のお客様
   ========================================================= */

"use strict";

(function () {

    /* =====================================================
       CONFIG
       ===================================================== */

    const GAME_CONFIG = Object.freeze({

        quizTimeLimit: 10,

        repairGaugeMax: 100,

        correctGaugeGain: 20,

        customerEnterDuration: 2700,

        customerLeaveDuration: 2300,

        speechDelay: 500,

        receptionDelay: 900,

        answerResultDuration: 1500,

        nextQuestionDelay: 500,

        repairCompleteDuration: 2300,

        resultDelay: 900,

        baseExperience: 100,

        comboExperienceBonus: 10,

        wrongExperience: 0,

        levelBaseRequirement: 500,

        levelRequirementIncrease: 150,

        maxLevel: 99,

        comboMoneyBonusRate: 0.05,

        maximumComboBonusRate: 1.0,

        timeoutPenalty: 0,

        incorrectPenalty: 0

    });


    /* =====================================================
       GAME PHASE
       ===================================================== */

    const GAME_PHASE = Object.freeze({

        TITLE: "title",

        CUSTOMER_ENTERING: "customerEntering",

        CUSTOMER_TALKING: "customerTalking",

        RECEPTION: "reception",

        QUIZ: "quiz",

        ANSWER_RESULT: "answerResult",

        REPAIR_COMPLETE: "repairComplete",

        RESULT: "result",

        CUSTOMER_LEAVING: "customerLeaving"

    });


    /* =====================================================
       RANK DATA
       ===================================================== */

    const RANK_DATA = Object.freeze([

        {
            name: "D",
            minimumLevel: 1
        },

        {
            name: "C",
            minimumLevel: 3
        },

        {
            name: "B",
            minimumLevel: 6
        },

        {
            name: "A",
            minimumLevel: 10
        },

        {
            name: "S",
            minimumLevel: 15
        },

        {
            name: "SS",
            minimumLevel: 22
        },

        {
            name: "SSS",
            minimumLevel: 30
        }

    ]);


    /* =====================================================
       CUSTOMER DATA
       ===================================================== */

    const CUSTOMER_SCENARIOS = Object.freeze([

        {
            id: "iphone-screen",
            opening:
                "すみません！iPhoneを落として画面が割れてしまいました……。",
            reception:
                "画面は映っていますが、タッチが時々勝手に動きます。修理できますか？",
            accepted:
                "お願いします！大事なデータが入っているんです。",
            repairing:
                "画面の状態を確認して修理します！",
            completed:
                "画面がきれいになった！操作も問題ありません！",
            category: "iPhone"
        },

        {
            id: "iphone-battery",
            opening:
                "最近、iPhoneの充電がすぐになくなってしまいます。",
            reception:
                "朝100％にしても、お昼には残り20％くらいになります。",
            accepted:
                "バッテリー交換をお願いします！",
            repairing:
                "バッテリーと電源系統を確認します！",
            completed:
                "これで安心して一日使えます！",
            category: "iPhone"
        },

        {
            id: "iphone-charge",
            opening:
                "ケーブルを挿してもiPhoneが充電できません。",
            reception:
                "角度を変えると、たまに充電できることがあります。",
            accepted:
                "充電口の修理をお願いします。",
            repairing:
                "充電口と内部の接続を確認します！",
            completed:
                "しっかり充電できるようになりました！",
            category: "iPhone"
        },

        {
            id: "android-screen",
            opening:
                "Androidスマホの画面が真っ暗になりました。",
            reception:
                "着信音は鳴りますが、画面だけ何も映りません。",
            accepted:
                "データを消さずに修理してください。",
            repairing:
                "画面と表示回路を診断します！",
            completed:
                "写真もデータもそのままです！ありがとうございます！",
            category: "Android"
        },

        {
            id: "android-battery",
            opening:
                "スマホの背面が少し浮いてきました。",
            reception:
                "最近、本体が熱くなることもあります。",
            accepted:
                "危なくないように修理をお願いします。",
            repairing:
                "バッテリー膨張の可能性を確認します！",
            completed:
                "背面もきれいに閉まりました！",
            category: "Android"
        },

        {
            id: "pixel-fingerprint",
            opening:
                "Pixelの画面を交換してから指紋認証が使えません。",
            reception:
                "指紋を登録し直そうとしても途中で失敗します。",
            accepted:
                "指紋認証も使えるようにしてください。",
            repairing:
                "画面とキャリブレーション状態を確認します！",
            completed:
                "指紋認証も正常に使えます！",
            category: "Android"
        },

        {
            id: "galaxy-screen",
            opening:
                "Galaxyを落として画面に緑の線が出ました。",
            reception:
                "海外で購入した端末ですが、修理できますか？",
            accepted:
                "型番を確認して修理をお願いします。",
            repairing:
                "販売地域と部品仕様を確認します！",
            completed:
                "きれいに表示されるようになりました！",
            category: "Android"
        },

        {
            id: "switch-display",
            opening:
                "Switchの本体画面だけ映らなくなりました。",
            reception:
                "テレビにつなぐと普通にゲームできます。",
            accepted:
                "本体画面の修理をお願いします。",
            repairing:
                "液晶とバックライトを診断します！",
            completed:
                "本体だけでも遊べるようになりました！",
            category: "Switch"
        },

        {
            id: "switch-card",
            opening:
                "Switchがゲームカードを読み込まなくなりました。",
            reception:
                "microSDカードは読み込めています。",
            accepted:
                "ゲームカードスロットを確認してください。",
            repairing:
                "カードスロットの状態を確認します！",
            completed:
                "ゲームカードを読み込めるようになりました！",
            category: "Switch"
        },

        {
            id: "switch-charge",
            opening:
                "Switchがまったく充電できません。",
            reception:
                "別の充電器を使っても反応がありません。",
            accepted:
                "原因を調べて修理してください。",
            repairing:
                "充電口と基板回路を診断します！",
            completed:
                "電源が入りました！セーブデータも残っています！",
            category: "Switch"
        },

        {
            id: "water-damage",
            opening:
                "スマホを水の中に落としてしまいました！",
            reception:
                "一度電源が入りましたが、今は反応しません。",
            accepted:
                "データが必要なので、できる限りお願いします。",
            repairing:
                "通電を止めて内部洗浄と基板診断を行います！",
            completed:
                "データを確認できました！本当に助かりました！",
            category: "修理知識"
        },

        {
            id: "speaker",
            opening:
                "スマホから音が聞こえなくなりました。",
            reception:
                "通話も動画も音が小さくて聞き取りにくいです。",
            accepted:
                "スピーカーを確認してください。",
            repairing:
                "設定、詰まり、部品故障を切り分けます！",
            completed:
                "音がはっきり聞こえるようになりました！",
            category: "修理知識"
        }

    ]);


    /* =====================================================
       SHOP INTERACTIONS
       ===================================================== */

    const SHOP_MESSAGES = Object.freeze({

        spotCounter: [
            "修理カウンターだ。受付前に端末の状態を確認しよう。",
            "ネジや部品は機種ごとに分けて管理している。",
            "修理前と修理後の動作確認を忘れないようにしよう。"
        ],

        spotPoster: [
            "店内ポスターには修理メニューが書かれている。",
            "画面交換、バッテリー交換、水没修理に対応している。",
            "お客様に分かりやすい案内を心掛けよう。"
        ],

        spotShelf: [
            "交換用パーツが並んでいる。",
            "同じ機種名でも型番違いには注意が必要だ。",
            "修理前に部品の初期不良を確認しよう。"
        ],

        spotDoor: [
            "お客様が入ってくる入口だ。",
            "来店ベルが鳴ったら、明るく挨拶しよう。",
            "次のお客様が来るまで店内を確認できる。"
        ]

    });


    /* =====================================================
       DOM REFERENCES
       ===================================================== */

    const dom = {

        game: null,

        startScreen: null,

        startButton: null,

        customer: null,

        customerSprite: null,

        feni: null,

        feniSprite: null,

        speech: null,

        speechText: null,

        receptionWindow: null,

        customerSymptom: null,

        acceptButton: null,

        quizWindow: null,

        category: null,

        timer: null,

        question: null,

        answerButtons: [],

        repairPanel: null,

        repairGauge: null,

        repairPercent: null,

        comboEffect: null,

        coinEffect: null,

        rankUpEffect: null,

        completeEffect: null,

        level: null,

        rank: null,

        combo: null,

        money: null,

        resultWindow: null,

        resultRank: null,

        resultCombo: null,

        resultMoney: null,

        nextCustomer: null,

        touchSpots: []

    };


    /* =====================================================
       GAME STATE
       ===================================================== */

    const gameState = {

        phase: GAME_PHASE.TITLE,

        started: false,

        processing: false,

        answerLocked: false,

        level: 1,

        experience: 0,

        rank: "D",

        combo: 0,

        highestCombo: 0,

        money: 0,

        totalCorrect: 0,

        totalWrong: 0,

        totalAnswered: 0,

        customersCompleted: 0,

        repairGauge: 0,

        customerEarnings: 0,

        customerCorrectAnswers: 0,

        customerWrongAnswers: 0,

        currentCustomer: null,

        currentQuestion: null,

        lastCustomerId: null,

        timerValue: GAME_CONFIG.quizTimeLimit,

        timerIntervalId: null,

        timerRunId: 0,

        sequenceId: 0,

        speechTimeoutId: null

    };


    /* =====================================================
       INITIALIZATION
       ===================================================== */

    function initializeGame() {

        cacheDomElements();

        if (!validateRequiredSystems()) {

            return;

        }

        registerEventListeners();

        resetVisualState();

        updateHud();

        RepairLegendQuiz.createQuestionDeck(true);

        setPhase(GAME_PHASE.TITLE);

        console.log(
            "Repair Legend Game: 初期化完了"
        );

    }


    function cacheDomElements() {

        dom.game =
            document.getElementById("game");

        dom.startScreen =
            document.getElementById("startScreen");

        dom.startButton =
            document.getElementById("startButton");

        dom.customer =
            document.getElementById("customer");

        dom.customerSprite =
            document.getElementById("customerSprite");

        dom.feni =
            document.getElementById("feni");

        dom.feniSprite =
            document.getElementById("feniSprite");

        dom.speech =
            document.getElementById("speech");

        dom.speechText =
            document.getElementById("speechText");

        dom.receptionWindow =
            document.getElementById("receptionWindow");

        dom.customerSymptom =
            document.getElementById("customerSymptom");

        dom.acceptButton =
            document.getElementById("acceptButton");

        dom.quizWindow =
            document.getElementById("quizWindow");

        dom.category =
            document.getElementById("category");

        dom.timer =
            document.getElementById("timer");

        dom.question =
            document.getElementById("question");

        dom.answerButtons =
            Array.from(
                document.querySelectorAll(".answerBtn")
            );

        dom.repairPanel =
            document.getElementById("repairPanel");

        dom.repairGauge =
            document.getElementById("repairGauge");

        dom.repairPercent =
            document.getElementById("repairPercent");

        dom.comboEffect =
            document.getElementById("comboEffect");

        dom.coinEffect =
            document.getElementById("coinEffect");

        dom.rankUpEffect =
            document.getElementById("rankUpEffect");

        dom.completeEffect =
            document.getElementById("completeEffect");

        dom.level =
            document.getElementById("level");

        dom.rank =
            document.getElementById("rank");

        dom.combo =
            document.getElementById("combo");

        dom.money =
            document.getElementById("money");

        dom.resultWindow =
            document.getElementById("resultWindow");

        dom.resultRank =
            document.getElementById("resultRank");

        dom.resultCombo =
            document.getElementById("resultCombo");

        dom.resultMoney =
            document.getElementById("resultMoney");

        dom.nextCustomer =
            document.getElementById("nextCustomer");

        dom.touchSpots =
            Array.from(
                document.querySelectorAll(".touchSpot")
            );

    }


    function validateRequiredSystems() {

        const requiredElements = [

            dom.game,

            dom.startScreen,

            dom.startButton,

            dom.customer,

            dom.feni,

            dom.speech,

            dom.speechText,

            dom.receptionWindow,

            dom.acceptButton,

            dom.quizWindow,

            dom.question,

            dom.repairPanel,

            dom.resultWindow,

            dom.nextCustomer

        ];

        const missingElement =
            requiredElements.some(
                function (element) {

                    return !element;

                }
            );

        if (missingElement) {

            console.error(
                "Repair Legend: 必要なHTML要素が不足しています。"
            );

            return false;

        }

        if (!window.RepairLegendQuiz) {

            console.error(
                "Repair Legend: quiz.jsが読み込まれていません。"
            );

            return false;

        }

        if (!window.RepairLegendSound) {

            console.error(
                "Repair Legend: sound.jsが読み込まれていません。"
            );

            return false;

        }

        if (dom.answerButtons.length !== 4) {

            console.error(
                "Repair Legend: 回答ボタンは4個必要です。"
            );

            return false;

        }

        return true;

    }


    function registerEventListeners() {

        dom.startButton.addEventListener(
            "click",
            handleStartButton
        );

        dom.acceptButton.addEventListener(
            "click",
            handleAcceptButton
        );

        dom.nextCustomer.addEventListener(
            "click",
            handleNextCustomerButton
        );

        dom.answerButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    handleAnswerButton
                );

            }
        );

        dom.touchSpots.forEach(
            function (spot) {

                spot.addEventListener(
                    "click",
                    handleShopInteraction
                );

            }
        );

        window.addEventListener(
            "pagehide",
            handlePageHide
        );

        document.addEventListener(
            "visibilitychange",
            handleVisibilityChange
        );

    }


    /* =====================================================
       GAME START
       ===================================================== */

    async function handleStartButton() {

        if (gameState.started) {

            return;

        }

        gameState.started = true;

        gameState.processing = true;

        gameState.sequenceId += 1;

        await RepairLegendSound.unlockAudio();

        RepairLegendSound.playBgm({
            restart: true,
            fadeIn: true
        });

        dom.startScreen.classList.add("hidden");

        await wait(500);

        resetGameProgress();

        gameState.processing = false;

        startNextCustomer();

    }


    function resetGameProgress() {

        stopQuizTimer();

        gameState.level = 1;

        gameState.experience = 0;

        gameState.rank = "D";

        gameState.combo = 0;

        gameState.highestCombo = 0;

        gameState.money = 0;

        gameState.totalCorrect = 0;

        gameState.totalWrong = 0;

        gameState.totalAnswered = 0;

        gameState.customersCompleted = 0;

        gameState.repairGauge = 0;

        gameState.customerEarnings = 0;

        gameState.customerCorrectAnswers = 0;

        gameState.customerWrongAnswers = 0;

        gameState.currentCustomer = null;

        gameState.currentQuestion = null;

        gameState.lastCustomerId = null;

        RepairLegendQuiz.resetQuestionDeck();

        RepairLegendQuiz.createQuestionDeck(true);

        resetVisualState();

        updateHud();

    }


    /* =====================================================
       CUSTOMER FLOW
       ===================================================== */

    async function startNextCustomer() {

        if (gameState.processing) {

            return;

        }

        gameState.processing = true;

        gameState.sequenceId += 1;

        const currentSequence =
            gameState.sequenceId;

        resetCustomerSession();

        hideResultWindow();

        hideReceptionWindow();

        hideQuizWindow();

        hideSpeech();

        resetCharacterClasses();

        gameState.currentCustomer =
            selectCustomerScenario();

        setPhase(
            GAME_PHASE.CUSTOMER_ENTERING
        );

        prepareCustomerForEntrance();

        await wait(200);

        if (!isCurrentSequence(currentSequence)) {

            return;

        }

        RepairLegendSound.playBell();

        dom.customer.classList.add("walking");

        await wait(
            GAME_CONFIG.customerEnterDuration
        );

        if (!isCurrentSequence(currentSequence)) {

            return;

        }

        dom.customer.classList.remove("walking");

        dom.customer.classList.add("waiting");

        setPhase(
            GAME_PHASE.CUSTOMER_TALKING
        );

        await wait(
            GAME_CONFIG.speechDelay
        );

        if (!isCurrentSequence(currentSequence)) {

            return;

        }

        showSpeech(
            gameState.currentCustomer.opening
        );

        await wait(
            GAME_CONFIG.receptionDelay
        );

        if (!isCurrentSequence(currentSequence)) {

            return;

        }

        showReceptionWindow();

        gameState.processing = false;

    }


    function resetCustomerSession() {

        gameState.repairGauge = 0;

        gameState.customerEarnings = 0;

        gameState.customerCorrectAnswers = 0;

        gameState.customerWrongAnswers = 0;

        gameState.currentQuestion = null;

        gameState.answerLocked = false;

        stopQuizTimer();

        updateRepairGauge();

        clearAnswerStyles();

    }


    function selectCustomerScenario() {

        const availableScenarios =
            CUSTOMER_SCENARIOS.filter(
                function (scenario) {

                    return (
                        scenario.id !==
                        gameState.lastCustomerId
                    );

                }
            );

        const candidates =
            availableScenarios.length > 0
                ? availableScenarios
                : CUSTOMER_SCENARIOS;

        const randomIndex =
            Math.floor(
                Math.random() *
                candidates.length
            );

        const selected =
            candidates[randomIndex];

        gameState.lastCustomerId =
            selected.id;

        return {
            ...selected
        };

    }


    function prepareCustomerForEntrance() {

        dom.customer.className = "";

        void dom.customer.offsetWidth;

        dom.customer.className = "";

    }


    function showReceptionWindow() {

        if (!gameState.currentCustomer) {

            return;

        }

        setPhase(GAME_PHASE.RECEPTION);

        dom.customerSymptom.textContent =
            gameState.currentCustomer.reception;

        dom.acceptButton.disabled = false;

        dom.receptionWindow.classList.add(
            "show"
        );

    }


    function hideReceptionWindow() {

        dom.receptionWindow.classList.remove(
            "show"
        );

        dom.acceptButton.disabled = false;

    }


    async function handleAcceptButton() {

        if (
            gameState.phase !==
            GAME_PHASE.RECEPTION
        ) {

            return;

        }

        if (gameState.processing) {

            return;

        }

        gameState.processing = true;

        dom.acceptButton.disabled = true;

        hideReceptionWindow();

        showSpeech(
            gameState.currentCustomer.accepted
        );

        await wait(1000);

        showSpeech(
            gameState.currentCustomer.repairing
        );

        dom.feni.classList.add("repairing");

        await wait(900);

        dom.feni.classList.remove("repairing");

        hideSpeech();

        showRepairPanel();

        gameState.processing = false;

        beginQuizQuestion();

    }


    /* =====================================================
       QUIZ FLOW
       ===================================================== */

    function beginQuizQuestion() {

        if (
            gameState.repairGauge >=
            GAME_CONFIG.repairGaugeMax
        ) {

            completeRepair();

            return;

        }

        stopQuizTimer();

        clearAnswerStyles();

        gameState.answerLocked = false;

        gameState.currentQuestion =
            getQuestionForCurrentCustomer();

        if (!gameState.currentQuestion) {

            console.error(
                "Repair Legend: 問題を取得できませんでした。"
            );

            return;

        }

        renderCurrentQuestion();

        showQuizWindow();

        setPhase(GAME_PHASE.QUIZ);

        enableAnswerButtons();

        startQuizTimer();

    }


    function getQuestionForCurrentCustomer() {

        let question = null;

        const customerCategory =
            gameState.currentCustomer
                ? gameState.currentCustomer.category
                : null;

        if (customerCategory) {

            question =
                RepairLegendQuiz.getNextQuestion({
                    category: customerCategory,
                    shuffleChoices: true
                });

        }

        if (!question) {

            question =
                RepairLegendQuiz.getNextQuestion({
                    shuffleChoices: true
                });

        }

        return question;

    }


    function renderCurrentQuestion() {

        const question =
            gameState.currentQuestion;

        if (!question) {

            return;

        }

        dom.category.textContent =
            question.category;

        dom.question.textContent =
            question.question;

        dom.answerButtons.forEach(
            function (button, index) {

                const choiceText =
                    question.choices[index] || "";

                button.textContent =
                    choiceText;

                button.dataset.answer =
                    String(index);

                button.setAttribute(
                    "aria-label",
                    `${String.fromCharCode(
                        65 + index
                    )}：${choiceText}`
                );

            }
        );

        setTimerDisplay(
            GAME_CONFIG.quizTimeLimit
        );

    }


    function showQuizWindow() {

        dom.quizWindow.classList.add("show");

    }


    function hideQuizWindow() {

        stopQuizTimer();

        dom.quizWindow.classList.remove(
            "show"
        );

    }


    function handleAnswerButton(event) {

        if (
            gameState.phase !==
            GAME_PHASE.QUIZ
        ) {

            return;

        }

        if (gameState.answerLocked) {

            return;

        }

        const button =
            event.currentTarget;

        const selectedIndex =
            Number(
                button.dataset.answer
            );

        if (
            !Number.isInteger(selectedIndex) ||
            selectedIndex < 0 ||
            selectedIndex > 3
        ) {

            return;

        }

        processAnswer(
            selectedIndex,
            false
        );

    }


    async function processAnswer(
        selectedIndex,
        timedOut
    ) {

        if (gameState.answerLocked) {

            return;

        }

        gameState.answerLocked = true;

        setPhase(
            GAME_PHASE.ANSWER_RESULT
        );

        stopQuizTimer();

        disableAnswerButtons();

        const answerResult =
            RepairLegendQuiz.checkAnswer(
                gameState.currentQuestion,
                selectedIndex
            );

        gameState.totalAnswered += 1;

        if (answerResult.isCorrect) {

            await processCorrectAnswer(
                selectedIndex,
                answerResult
            );

        } else {

            await processWrongAnswer(
                selectedIndex,
                answerResult,
                timedOut
            );

        }

        await wait(
            GAME_CONFIG.answerResultDuration
        );

        clearAnswerStyles();

        if (
            gameState.repairGauge >=
            GAME_CONFIG.repairGaugeMax
        ) {

            completeRepair();

            return;

        }

        await wait(
            GAME_CONFIG.nextQuestionDelay
        );

        beginQuizQuestion();

    }


    async function processCorrectAnswer(
        selectedIndex,
        answerResult
    ) {

        gameState.totalCorrect += 1;

        gameState.customerCorrectAnswers += 1;

        gameState.combo += 1;

        gameState.highestCombo =
            Math.max(
                gameState.highestCombo,
                gameState.combo
            );

        const selectedButton =
            dom.answerButtons[selectedIndex];

        if (selectedButton) {

            selectedButton.classList.add(
                "correct"
            );

        }

        dom.game.classList.add(
            "flash-correct"
        );

        RepairLegendSound.playCorrect();

        dom.feni.classList.add(
            "celebrating"
        );

        const moneyEarned =
            calculateQuestionReward(
                answerResult.reward,
                gameState.combo
            );

        gameState.money += moneyEarned;

        gameState.customerEarnings +=
            moneyEarned;

        const experienceEarned =
            GAME_CONFIG.baseExperience +
            (
                gameState.combo *
                GAME_CONFIG.comboExperienceBonus
            );

        addExperience(
            experienceEarned
        );

        const gaugeGain =
            Number(
                answerResult.gaugeGain
            ) ||
            GAME_CONFIG.correctGaugeGain;

        addRepairGauge(
            gaugeGain
        );

        showComboEffect();

        showCoinEffect(
            moneyEarned
        );

        RepairLegendSound.playComboCoin(
            gameState.combo
        );

        updateHud();

        await wait(550);

        dom.feni.classList.remove(
            "celebrating"
        );

        dom.game.classList.remove(
            "flash-correct"
        );

    }


    async function processWrongAnswer(
        selectedIndex,
        answerResult,
        timedOut
    ) {

        gameState.totalWrong += 1;

        gameState.customerWrongAnswers += 1;

        gameState.combo = 0;

        if (!timedOut) {

            const selectedButton =
                dom.answerButtons[selectedIndex];

            if (selectedButton) {

                selectedButton.classList.add(
                    "wrong"
                );

            }

        }

        const correctButton =
            dom.answerButtons[
                answerResult.correctIndex
            ];

        if (correctButton) {

            correctButton.classList.add(
                "reveal"
            );

        }

        dom.game.classList.add(
            "flash-wrong",
            "screen-shake"
        );

        dom.feni.classList.add(
            "damage"
        );

        RepairLegendSound.playWrong();

        updateHud();

        if (timedOut) {

            showTemporarySpeech(
                "時間切れ！落ち着いて次の問題に挑戦しよう。",
                1300
            );

        } else {

            showTemporarySpeech(
                `不正解！正解は「${answerResult.correctAnswer}」`,
                1300
            );

        }

        await wait(550);

        dom.feni.classList.remove(
            "damage"
        );

        dom.game.classList.remove(
            "flash-wrong",
            "screen-shake"
        );

    }


    /* =====================================================
       QUIZ TIMER
       ===================================================== */

    function startQuizTimer() {

        stopQuizTimer();

        gameState.timerRunId += 1;

        const currentTimerRun =
            gameState.timerRunId;

        gameState.timerValue =
            GAME_CONFIG.quizTimeLimit;

        setTimerDisplay(
            gameState.timerValue
        );

        gameState.timerIntervalId =
            window.setInterval(
                function () {

                    if (
                        currentTimerRun !==
                        gameState.timerRunId
                    ) {

                        return;

                    }

                    gameState.timerValue -= 1;

                    setTimerDisplay(
                        gameState.timerValue
                    );

                    if (
                        gameState.timerValue <= 0
                    ) {

                        stopQuizTimer();

                        processAnswer(
                            -1,
                            true
                        );

                    }

                },
                1000
            );

    }


    function stopQuizTimer() {

        gameState.timerRunId += 1;

        if (
            gameState.timerIntervalId !==
            null
        ) {

            clearInterval(
                gameState.timerIntervalId
            );

            gameState.timerIntervalId =
                null;

        }

    }


    function setTimerDisplay(value) {

        const safeValue =
            Math.max(
                0,
                Number(value) || 0
            );

        dom.timer.textContent =
            String(safeValue);

        if (safeValue <= 3) {

            dom.timer.classList.add(
                "warning"
            );

        } else {

            dom.timer.classList.remove(
                "warning"
            );

        }

    }


    /* =====================================================
       REPAIR GAUGE
       ===================================================== */

    function addRepairGauge(amount) {

        const safeAmount =
            Math.max(
                0,
                Number(amount) || 0
            );

        gameState.repairGauge =
            Math.min(
                GAME_CONFIG.repairGaugeMax,
                gameState.repairGauge +
                safeAmount
            );

        updateRepairGauge();

    }


    function updateRepairGauge() {

        const percentage =
            Math.max(
                0,
                Math.min(
                    GAME_CONFIG.repairGaugeMax,
                    gameState.repairGauge
                )
            );

        dom.repairGauge.style.width =
            `${percentage}%`;

        dom.repairPercent.textContent =
            `${percentage}%`;

        if (
            percentage >=
            GAME_CONFIG.repairGaugeMax
        ) {

            dom.repairGauge.classList.add(
                "complete"
            );

        } else {

            dom.repairGauge.classList.remove(
                "complete"
            );

        }

    }


    function showRepairPanel() {

        dom.repairPanel.classList.add(
            "show"
        );

        updateRepairGauge();

    }


    function hideRepairPanel() {

        dom.repairPanel.classList.remove(
            "show"
        );

    }


    /* =====================================================
       REPAIR COMPLETE
       ===================================================== */

    async function completeRepair() {

        if (
            gameState.phase ===
            GAME_PHASE.REPAIR_COMPLETE
        ) {

            return;

        }

        gameState.processing = true;

        setPhase(
            GAME_PHASE.REPAIR_COMPLETE
        );

        stopQuizTimer();

        disableAnswerButtons();

        hideQuizWindow();

        dom.repairGauge.classList.add(
            "complete"
        );

        dom.feni.classList.remove(
            "repairing",
            "damage"
        );

        dom.feni.classList.add(
            "celebrating"
        );

        dom.customer.classList.remove(
            "waiting",
            "sad"
        );

        dom.customer.classList.add(
            "happy"
        );

        showCompleteEffect();

        RepairLegendSound.playRepairComplete();

        await wait(700);

        RepairLegendSound.playCoin();

        showSpeech(
            gameState.currentCustomer.completed
        );

        await wait(
            GAME_CONFIG.repairCompleteDuration
        );

        dom.feni.classList.remove(
            "celebrating"
        );

        gameState.customersCompleted += 1;

        showResultWindow();

        gameState.processing = false;

    }


    function showCompleteEffect() {

        restartEffectClass(
            dom.completeEffect,
            "show"
        );

    }


    /* =====================================================
       RESULT
       ===================================================== */

    function showResultWindow() {

        setPhase(
            GAME_PHASE.RESULT
        );

        dom.resultRank.textContent =
            gameState.rank;

        dom.resultCombo.textContent =
            String(
                gameState.highestCombo
            );

        dom.resultMoney.textContent =
            formatMoney(
                gameState.customerEarnings
            );

        dom.resultWindow.classList.add(
            "show"
        );

        dom.nextCustomer.disabled =
            false;

    }


    function hideResultWindow() {

        dom.resultWindow.classList.remove(
            "show"
        );

        dom.nextCustomer.disabled =
            false;

    }


    async function handleNextCustomerButton() {

        if (
            gameState.phase !==
            GAME_PHASE.RESULT
        ) {

            return;

        }

        if (gameState.processing) {

            return;

        }

        gameState.processing = true;

        dom.nextCustomer.disabled =
            true;

        hideResultWindow();

        hideSpeech();

        hideRepairPanel();

        await customerLeave();

        gameState.processing = false;

        startNextCustomer();

    }


    async function customerLeave() {

        setPhase(
            GAME_PHASE.CUSTOMER_LEAVING
        );

        dom.customer.classList.remove(
            "happy",
            "waiting",
            "walking"
        );

        void dom.customer.offsetWidth;

        dom.customer.classList.add(
            "leaving"
        );

        await wait(
            GAME_CONFIG.customerLeaveDuration
        );

        dom.customer.classList.remove(
            "leaving"
        );

    }


    /* =====================================================
       EXPERIENCE / LEVEL / RANK
       ===================================================== */

    function addExperience(amount) {

        const safeAmount =
            Math.max(
                0,
                Number(amount) || 0
            );

        if (
            gameState.level >=
            GAME_CONFIG.maxLevel
        ) {

            gameState.level =
                GAME_CONFIG.maxLevel;

            gameState.experience = 0;

            return;

        }

        gameState.experience +=
            safeAmount;

        let levelUpOccurred = false;

        while (
            gameState.level <
                GAME_CONFIG.maxLevel &&
            gameState.experience >=
                getRequiredExperience(
                    gameState.level
                )
        ) {

            gameState.experience -=
                getRequiredExperience(
                    gameState.level
                );

            gameState.level += 1;

            levelUpOccurred = true;

        }

        if (levelUpOccurred) {

            handleLevelUp();

        }

        updateRank();

    }


    function getRequiredExperience(level) {

        const normalizedLevel =
            Math.max(
                1,
                Number(level) || 1
            );

        return (
            GAME_CONFIG.levelBaseRequirement +
            (
                normalizedLevel - 1
            ) *
            GAME_CONFIG.levelRequirementIncrease
        );

    }


    function handleLevelUp() {

        restartEffectClass(
            dom.rankUpEffect,
            "show"
        );

        dom.rankUpEffect.textContent =
            `LEVEL UP！ LV.${gameState.level}`;

        RepairLegendSound.playCoin();

    }


    function updateRank() {

        const oldRank =
            gameState.rank;

        let newRank = "D";

        RANK_DATA.forEach(
            function (rankData) {

                if (
                    gameState.level >=
                    rankData.minimumLevel
                ) {

                    newRank =
                        rankData.name;

                }

            }
        );

        gameState.rank = newRank;

        if (
            oldRank !== newRank
        ) {

            showRankUpEffect(
                newRank
            );

        }

    }


    function showRankUpEffect(rank) {

        dom.rankUpEffect.textContent =
            `RANK UP！ ${rank}`;

        restartEffectClass(
            dom.rankUpEffect,
            "show"
        );

        RepairLegendSound.playRepairComplete();

    }


    /* =====================================================
       REWARD
       ===================================================== */

    function calculateQuestionReward(
        baseReward,
        combo
    ) {

        const safeBaseReward =
            Math.max(
                0,
                Number(baseReward) || 0
            );

        const safeCombo =
            Math.max(
                1,
                Number(combo) || 1
            );

        const comboBonusRate =
            Math.min(
                GAME_CONFIG.maximumComboBonusRate,
                (
                    safeCombo - 1
                ) *
                GAME_CONFIG.comboMoneyBonusRate
            );

        const finalReward =
            safeBaseReward *
            (
                1 +
                comboBonusRate
            );

        return Math.round(
            finalReward / 10
        ) * 10;

    }


    /* =====================================================
       HUD
       ===================================================== */

    function updateHud() {

        dom.level.textContent =
            String(
                gameState.level
            );

        dom.rank.textContent =
            gameState.rank;

        dom.combo.textContent =
            String(
                gameState.combo
            );

        dom.money.textContent =
            formatMoney(
                gameState.money
            );

        updateRankColor();

    }


    function updateRankColor() {

        const rankColors = {

            D: "#ffffff",

            C: "#83d97a",

            B: "#65b7ff",

            A: "#d47cff",

            S: "#ffd65a",

            SS: "#ff8a4c",

            SSS: "#ff5277"

        };

        dom.rank.style.color =
            rankColors[
                gameState.rank
            ] || "#ffffff";

    }


    function formatMoney(value) {

        const safeValue =
            Math.max(
                0,
                Math.round(
                    Number(value) || 0
                )
            );

        return `¥${safeValue.toLocaleString(
            "ja-JP"
        )}`;

    }


    /* =====================================================
       EFFECTS
       ===================================================== */

    function showComboEffect() {

        if (
            gameState.combo < 2
        ) {

            return;

        }

        dom.comboEffect.textContent =
            `${gameState.combo} COMBO！`;

        restartEffectClass(
            dom.comboEffect,
            "show"
        );

    }


    function showCoinEffect(amount) {

        dom.coinEffect.textContent =
            `＋${formatMoney(amount)}`;

        restartEffectClass(
            dom.coinEffect,
            "show"
        );

    }


    function restartEffectClass(
        element,
        className
    ) {

        if (!element) {

            return;

        }

        element.classList.remove(
            className
        );

        void element.offsetWidth;

        element.classList.add(
            className
        );

        window.setTimeout(
            function () {

                element.classList.remove(
                    className
                );

            },
            1900
        );

    }


    /* =====================================================
       SPEECH
       ===================================================== */

    function showSpeech(text) {

        clearTimeout(
            gameState.speechTimeoutId
        );

        dom.speechText.textContent =
            String(text || "");

        dom.speech.classList.add(
            "show"
        );

    }


    function hideSpeech() {

        clearTimeout(
            gameState.speechTimeoutId
        );

        dom.speech.classList.remove(
            "show"
        );

    }


    function showTemporarySpeech(
        text,
        duration = 1200
    ) {

        showSpeech(text);

        gameState.speechTimeoutId =
            window.setTimeout(
                function () {

                    if (
                        gameState.phase ===
                        GAME_PHASE.ANSWER_RESULT
                    ) {

                        hideSpeech();

                    }

                },
                duration
            );

    }


    /* =====================================================
       SHOP INTERACTION
       ===================================================== */

    function handleShopInteraction(event) {

        if (
            gameState.phase ===
                GAME_PHASE.QUIZ ||
            gameState.phase ===
                GAME_PHASE.ANSWER_RESULT ||
            gameState.phase ===
                GAME_PHASE.RECEPTION ||
            gameState.phase ===
                GAME_PHASE.REPAIR_COMPLETE
        ) {

            return;

        }

        const spot =
            event.currentTarget;

        const messages =
            SHOP_MESSAGES[spot.id];

        if (
            !messages ||
            messages.length === 0
        ) {

            return;

        }

        const randomIndex =
            Math.floor(
                Math.random() *
                messages.length
            );

        showTemporarySpeech(
            messages[randomIndex],
            1800
        );

    }


    /* =====================================================
       ANSWER BUTTONS
       ===================================================== */

    function enableAnswerButtons() {

        dom.answerButtons.forEach(
            function (button) {

                button.disabled = false;

            }
        );

    }


    function disableAnswerButtons() {

        dom.answerButtons.forEach(
            function (button) {

                button.disabled = true;

            }
        );

    }


    function clearAnswerStyles() {

        dom.answerButtons.forEach(
            function (button) {

                button.classList.remove(
                    "correct",
                    "wrong",
                    "reveal"
                );

                button.disabled = false;

            }
        );

    }


    /* =====================================================
       VISUAL RESET
       ===================================================== */

    function resetVisualState() {

        dom.startScreen.classList.remove(
            "hidden"
        );

        hideReceptionWindow();

        hideQuizWindow();

        hideResultWindow();

        hideRepairPanel();

        hideSpeech();

        clearAnswerStyles();

        resetCharacterClasses();

        dom.repairGauge.style.width =
            "0%";

        dom.repairPercent.textContent =
            "0%";

        dom.timer.textContent =
            String(
                GAME_CONFIG.quizTimeLimit
            );

        dom.timer.classList.remove(
            "warning"
        );

    }


    function resetCharacterClasses() {

        dom.customer.className = "";

        dom.feni.classList.remove(
            "repairing",
            "celebrating",
            "damage"
        );

    }


    /* =====================================================
       PAGE EVENTS
       ===================================================== */

    function handlePageHide() {

        stopQuizTimer();

        if (
            window.RepairLegendSound
        ) {

            RepairLegendSound.pauseBgm(
                false
            );

        }

    }


    function handleVisibilityChange() {

        if (document.hidden) {

            if (
                gameState.phase ===
                GAME_PHASE.QUIZ
            ) {

                stopQuizTimer();

            }

            return;

        }

        if (
            gameState.phase ===
                GAME_PHASE.QUIZ &&
            !gameState.answerLocked
        ) {

            startQuizTimer();

        }

    }


    /* =====================================================
       STATE
       ===================================================== */

    function setPhase(phase) {

        gameState.phase = phase;

        document.body.dataset.gamePhase =
            phase;

    }


    function isCurrentSequence(
        sequenceId
    ) {

        return (
            gameState.sequenceId ===
            sequenceId
        );

    }


    /* =====================================================
       UTILITY
       ===================================================== */

    function wait(milliseconds) {

        const safeMilliseconds =
            Math.max(
                0,
                Number(milliseconds) || 0
            );

        return new Promise(
            function (resolve) {

                window.setTimeout(
                    resolve,
                    safeMilliseconds
                );

            }
        );

    }


    /* =====================================================
       DEBUG API
       ===================================================== */

    function getGameStatus() {

        return {

            phase:
                gameState.phase,

            level:
                gameState.level,

            experience:
                gameState.experience,

            requiredExperience:
                getRequiredExperience(
                    gameState.level
                ),

            rank:
                gameState.rank,

            combo:
                gameState.combo,

            highestCombo:
                gameState.highestCombo,

            money:
                gameState.money,

            totalCorrect:
                gameState.totalCorrect,

            totalWrong:
                gameState.totalWrong,

            totalAnswered:
                gameState.totalAnswered,

            customersCompleted:
                gameState.customersCompleted,

            repairGauge:
                gameState.repairGauge,

            currentCustomer:
                gameState.currentCustomer
                    ? {
                        ...gameState.currentCustomer
                    }
                    : null,

            currentQuestion:
                gameState.currentQuestion
                    ? {
                        ...gameState.currentQuestion,
                        choices: [
                            ...gameState.currentQuestion
                                .choices
                        ]
                    }
                    : null

        };

    }


    function forceCorrectAnswer() {

        if (
            gameState.phase !==
                GAME_PHASE.QUIZ ||
            !gameState.currentQuestion
        ) {

            return false;

        }

        processAnswer(
            gameState.currentQuestion
                .correctIndex,
            false
        );

        return true;

    }


    function forceRepairComplete() {

        if (!gameState.started) {

            return false;

        }

        gameState.repairGauge =
            GAME_CONFIG.repairGaugeMax;

        updateRepairGauge();

        completeRepair();

        return true;

    }


    const RepairLegendGame =
        Object.freeze({

            getStatus:
                getGameStatus,

            forceCorrectAnswer:
                forceCorrectAnswer,

            forceRepairComplete:
                forceRepairComplete,

            startNextCustomer:
                startNextCustomer

        });


    window.RepairLegendGame =
        RepairLegendGame;


    /* =====================================================
       AUTO START
       ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeGame,
            {
                once: true
            }
        );

    } else {

        initializeGame();

    }

})();
