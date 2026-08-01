// customer.js

const customerLines = [
    "昨日落としてから調子が悪くて…",
    "大切なデータが入っています。",
    "できれば今日中に直したいです。",
    "急に使えなくなって困っています。",
    "修理できるか見てもらえますか？"
]; 

let customerQueue = [];
let customerBusy = false;

function createCustomer() {
    const question =
        questions[Math.floor(Math.random() * questions.length)];

    return {
        question,
        line:
            customerLines[
                Math.floor(Math.random() * customerLines.length)
            ],
        satisfaction: 100
    };
}

function fillCustomerQueue() {
    while (customerQueue.length < 3) {
        customerQueue.push(createCustomer());
    }
}

function customerEnter() {
    if (customerBusy) return;

    customerBusy = true;
    fillCustomerQueue();

    const nextCustomer = customerQueue.shift();
    currentQuestion = nextCustomer.question;

    customer.style.transition = "none";
    customer.style.left = "-120px";

    speech.classList.add("hidden");
    questionWindow.classList.add("hidden");

    setTimeout(() => {
        customer.style.transition = "left 1.2s ease";
        customer.style.left = "36%";
        seTap();
    }, 100);

    setTimeout(() => {
        speechText.innerHTML = `
            <strong>${currentQuestion.device}</strong><br>
            ${nextCustomer.line}<br><br>
            症状：${currentQuestion.symptom}
        `;

        speech.style.left = "42%";
        speech.style.top = "130px";
        speech.classList.remove("hidden");

        gameState = "RECEPTION";
        setHint("受付へ行って対応しよう");
        customerBusy = false;
    }, 1400);
}

function customerHappy() {
    customer.style.filter =
        "drop-shadow(0 0 12px rgba(80,255,120,.9))";

    speechText.innerHTML = `
        <strong>ありがとうございます！</strong><br>
        無事に直って助かりました！
    `;

    speech.classList.remove("hidden");
    seOK();
}

function customerAngry() {
    customer.style.filter =
        "drop-shadow(0 0 12px rgba(255,70,70,.9))";

    speechText.innerHTML = `
        <strong>残念です…</strong><br>
        もう一度確認してください。
    `;

    speech.classList.remove("hidden");
    seNG();
}

function customerLeave() {
    customerHappy();

    setTimeout(() => {
        speech.classList.add("hidden");
        questionWindow.classList.add("hidden");

        customer.style.left = "120%";
    }, 1200);

    setTimeout(() => {
        customer.style.filter = "none";
        customer.style.transition = "none";
        customer.style.left = "-120px";

        gameState = "WAIT_CUSTOMER";
        setHint("次のお客様を待っています");

        setTimeout(customerEnter, 1200);
    }, 2600);
}

fillCustomerQueue();