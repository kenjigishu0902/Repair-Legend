/* =========================================================
   Repair Legend v1.0
   quiz.js

   役割
   ・4択クイズ50問の管理
   ・問題のシャッフル
   ・カテゴリ別抽選
   ・出題済み問題の重複防止
   ・選択肢のシャッフル
   ・正誤判定
   ・問題データの検証
   ========================================================= */

"use strict";

(function () {

    /* =====================================================
       CATEGORY
       ===================================================== */

    const QUIZ_CATEGORIES = Object.freeze({
        IPHONE: "iPhone",
        ANDROID: "Android",
        SWITCH: "Switch",
        REPAIR: "修理知識"
    });


    /* =====================================================
       DIFFICULTY
       ===================================================== */

    const QUIZ_DIFFICULTIES = Object.freeze({
        EASY: 1,
        NORMAL: 2,
        HARD: 3
    });


    /* =====================================================
       QUIZ DATA
       全50問
       ===================================================== */

    const QUIZ_DATA = [

        /* =================================================
           iPhone
           1〜15
           ================================================= */

        {
            id: 1,
            category: QUIZ_CATEGORIES.IPHONE,
            difficulty: QUIZ_DIFFICULTIES.EASY,
            symptom: "お客様がiPhone 17の画面性能について質問しています。",
            question: "iPhone 17シリーズのリフレッシュレートについて正しいものは？",
            choices: [
                "全機種が最大120Hzに対応している",
                "Pro Maxだけが120Hzに対応している",
                "全機種が60Hz固定である",
                "無印モデルだけが120Hzに対応している"
            ],
            correctIndex: 0,
            explanation: "このゲーム内の設定では、iPhone 17シリーズは全機種が最大120Hz対応として扱います。",
            repairName: "画面性能の案内",
            reward: 1200,
            gaugeGain: 20
        },

        {
            id: 2,
            category: QUIZ_CATEGORIES.IPHONE,
            difficulty: QUIZ_DIFFICULTIES.EASY,
            symptom: "iPhone 13シリーズの画面について質問されています。",
            question: "iPhone 13シリーズで最大120Hzに対応している機種は？",
            choices: [
                "iPhone 13 miniのみ",
                "iPhone 13とiPhone 13 mini",
                "iPhone 13 ProとiPhone 13 Pro Max",
                "iPhone 13シリーズ全機種"
            ],
            correctIndex: 2,
            explanation: "iPhone 13シリーズでは、ProMotion対応のProとPro Maxが最大120Hzです。",
            repairName: "画面性能の確認",
            reward: 1100,
            gaugeGain: 20
        },

        {
            id: 3,
            category: QUIZ_CATEGORIES.IPHONE,
            difficulty: QUIZ_DIFFICULTIES.EASY,
            symptom: "iPhone 12の画面交換相談です。",
            question: "iPhone 12シリーズの純正仕様で最大120Hzに対応している機種は？",
            choices: [
                "iPhone 12 Pro Max",
                "iPhone 12 Pro",
                "iPhone 12 mini",
                "対応機種はない"
            ],
            correctIndex: 3,
            explanation: "iPhone 12シリーズには最大120Hz対応モデルはありません。",
            repairName: "画面仕様の確認",
            reward: 1000,
            gaugeGain: 20
        },

        {
            id: 4,
            category: QUIZ_CATEGORIES.IPHONE,
            difficulty: QUIZ_DIFFICULTIES.NORMAL,
            symptom: "画面交換後、スクロールが以前より滑らかではないと相談されました。",
            question: "高リフレッシュレート対応iPhoneに低品質なコピーパネルを付けた場合、起こり得ることは？",
            choices: [
                "必ずFace IDが強化される",
                "表示の滑らかさが低下することがある",
                "ストレージ容量が増える",
                "バッテリー最大容量が100％になる"
            ],
            correctIndex: 1,
            explanation: "交換パネルの仕様によっては、本来のリフレッシュレートを再現できない場合があります。",
            repairName: "交換パネルの再確認",
            reward: 1500,
            gaugeGain: 20
        },

        {
            id: 5,
            category: QUIZ_CATEGORIES.IPHONE,
            difficulty: QUIZ_DIFFICULTIES.NORMAL,
            symptom: "画面交換後、True Toneが表示されなくなりました。",
            question: "True Toneを維持するために重要な作業は？",
            choices: [
                "元画面の表示データを適切に引き継ぐ",
                "SIMカードを交換する",
                "スピーカーを交換する",
                "充電口を清掃する"
            ],
            correctIndex: 0,
            explanation: "機種や修理方法によりますが、True Tone維持には元画面データの引き継ぎが重要です。",
            repairName: "True Tone設定",
            reward: 1600,
            gaugeGain: 20
        },

        {
            id: 6,
            category: QUIZ_CATEGORIES.IPHONE,
            difficulty: QUIZ_DIFFICULTIES.NORMAL,
            symptom: "画面交換後にFace IDが使えなくなった端末です。",
            question: "Face ID修理で特に注意すべきことは？",
            choices: [
                "Face ID部品は本体と関連付けられている",
                "Face IDはSIMカードに保存されている",
                "Face IDは画面の色で決まる",
                "Face IDは充電器を替えれば直る"
            ],
            correctIndex: 0,
            explanation: "Face ID関連部品には本体と関連付けられた重要部品があり、損傷や交換に注意が必要です。",
            repairName: "Face ID診断",
            reward: 1700,
            gaugeGain: 20
        },

        {
            id: 7,
            category: QUIZ_CATEGORIES.IPHONE,
            difficulty: QUIZ_DIFFICULTIES.EASY,
            symptom: "バッテリーの減りが早いiPhoneです。",
            question: "バッテリー劣化時に起こりやすい症状は？",
            choices: [
                "電池の減りが早くなる",
                "画面サイズが大きくなる",
                "カメラの画素数が増える",
                "ストレージが自動で増える"
            ],
            correctIndex: 0,
            explanation: "劣化したバッテリーでは、持続時間低下や突然の電源落ちなどが起こる場合があります。",
            repairName: "バッテリー交換",
            reward: 1000,
            gaugeGain: 20
        },

        {
            id: 8,
            category: QUIZ_CATEGORIES.IPHONE,
            difficulty: QUIZ_DIFFICULTIES.NORMAL,
            symptom: "充電ケーブルを挿しても反応しないiPhoneです。",
            question: "充電不良の最初の確認として適切なものは？",
            choices: [
                "充電口の異物や汚れを確認する",
                "すぐに基板を廃棄する",
                "画面を強く押す",
                "カメラを交換する"
            ],
            correctIndex: 0,
            explanation: "充電口にホコリや異物が詰まり、ケーブルが奥まで入っていない場合があります。",
            repairName: "ドック清掃",
            reward: 1100,
            gaugeGain: 20
        },

        {
            id: 9,
            category: QUIZ_CATEGORIES.IPHONE,
            difficulty: QUIZ_DIFFICULTIES.NORMAL,
            symptom: "iPhoneの電源は入りますが、タッチ操作が勝手に動きます。",
            question: "触っていないのに画面が勝手に操作される症状は？",
            choices: [
                "ゴーストタッチ",
                "バッテリー膨張",
                "圏外病",
                "スピーカー割れ"
            ],
            correctIndex: 0,
            explanation: "画面破損やパネル不良などにより、ゴーストタッチが発生することがあります。",
            repairName: "画面交換",
            reward: 1200,
            gaugeGain: 20
        },

        {
            id: 10,
            category: QUIZ_CATEGORIES.IPHONE,
            difficulty: QUIZ_DIFFICULTIES.HARD,
            symptom: "画面交換後、指紋認証は使えますがホームボタンの押下反応がありません。",
            question: "この症状で優先して確認する箇所は？",
            choices: [
                "ホームボタン周辺のケーブルと接点",
                "リアカメラのレンズ",
                "SIMトレーの色",
                "イヤースピーカーの網"
            ],
            correctIndex: 0,
            explanation: "指紋認証が生きていて押下のみ反応しない場合、ケーブル、接点、パネル側経路などを確認します。",
            repairName: "ホームボタン点検",
            reward: 1900,
            gaugeGain: 20
        },

        {
            id: 11,
            category: QUIZ_CATEGORIES.IPHONE,
            difficulty: QUIZ_DIFFICULTIES.NORMAL,
            symptom: "画面が浮いているiPhoneが持ち込まれました。",
            question: "画面浮きの原因として優先して疑うべきものは？",
            choices: [
                "バッテリー膨張",
                "スピーカー音量",
                "壁紙設定",
                "SIMカードの向き"
            ],
            correctIndex: 0,
            explanation: "内部バッテリーが膨張し、画面を押し上げている可能性があります。",
            repairName: "膨張バッテリー交換",
            reward: 1500,
            gaugeGain: 20
        },

        {
            id: 12,
            category: QUIZ_CATEGORIES.IPHONE,
            difficulty: QUIZ_DIFFICULTIES.EASY,
            symptom: "着信音は鳴りますが、画面が真っ暗です。",
            question: "最初に疑う修理箇所として適切なものは？",
            choices: [
                "画面または画面接続部",
                "SIMカードの契約",
                "背面カメラの倍率",
                "本体カラー"
            ],
            correctIndex: 0,
            explanation: "音や振動があり動作している場合、画面表示系の故障を優先して確認します。",
            repairName: "画面診断",
            reward: 1100,
            gaugeGain: 20
        },

        {
            id: 13,
            category: QUIZ_CATEGORIES.IPHONE,
            difficulty: QUIZ_DIFFICULTIES.NORMAL,
            symptom: "水に濡れた直後のiPhoneです。",
            question: "水没直後の対応として避けるべき行動は？",
            choices: [
                "すぐに充電して動作確認する",
                "電源を切る",
                "早めに点検へ持ち込む",
                "外側の水分を拭き取る"
            ],
            correctIndex: 0,
            explanation: "濡れた状態で通電すると、ショートや腐食を悪化させる可能性があります。",
            repairName: "水没処置",
            reward: 1600,
            gaugeGain: 20
        },

        {
            id: 14,
            category: QUIZ_CATEGORIES.IPHONE,
            difficulty: QUIZ_DIFFICULTIES.HARD,
            symptom: "バッテリーを交換しても電流が流れず、PCにも認識されません。",
            question: "この場合に考えられる可能性として適切なものは？",
            choices: [
                "基板や電源系統の故障",
                "壁紙の設定不良",
                "ケースの色が不適切",
                "着信音量が低い"
            ],
            correctIndex: 0,
            explanation: "正常なバッテリーでも反応せずPC認識もない場合、基板や電源回路の診断が必要です。",
            repairName: "基板診断",
            reward: 2100,
            gaugeGain: 20
        },

        {
            id: 15,
            category: QUIZ_CATEGORIES.IPHONE,
            difficulty: QUIZ_DIFFICULTIES.NORMAL,
            symptom: "画面交換後に近接センサーが正常に動きません。",
            question: "通話中に画面が消えない場合、確認すべきものは？",
            choices: [
                "近接センサー周辺の位置と取り付け",
                "リアカメラのズーム倍率",
                "SIMカードの電話番号",
                "バッテリーの色"
            ],
            correctIndex: 0,
            explanation: "センサー位置のズレ、部品損傷、汚れ、パネルとの相性などを確認します。",
            repairName: "近接センサー調整",
            reward: 1600,
            gaugeGain: 20
        },


        /* =================================================
           Android
           16〜27
           ================================================= */

        {
            id: 16,
            category: QUIZ_CATEGORIES.ANDROID,
            difficulty: QUIZ_DIFFICULTIES.NORMAL,
            symptom: "Pixelの画面交換後、表示調整が必要な端末です。",
            question: "Pixelの画面交換後に必要になる場合がある作業は？",
            choices: [
                "画面キャリブレーション",
                "SIMカードの切断",
                "カメラレンズの塗装",
                "本体カラーの変更"
            ],
            correctIndex: 0,
            explanation: "Pixelは機種や交換部品によって、画面や指紋認証の調整作業が必要になる場合があります。",
            repairName: "Pixelキャリブレーション",
            reward: 1600,
            gaugeGain: 20
        },

        {
            id: 17,
            category: QUIZ_CATEGORIES.ANDROID,
            difficulty: QUIZ_DIFFICULTIES.HARD,
            symptom: "Pixel 6シリーズの画面交換相談です。",
            question: "Pixel 6シリーズの画面交換後に特に確認すべきものは？",
            choices: [
                "画面と指紋認証のキャリブレーション",
                "イヤホンの色",
                "SIMカードのメーカー",
                "壁紙の明るさだけ"
            ],
            correctIndex: 0,
            explanation: "Pixel 6シリーズでは、画面交換後の指紋認証や表示調整が重要です。",
            repairName: "指紋認証調整",
            reward: 1900,
            gaugeGain: 20
        },

        {
            id: 18,
            category: QUIZ_CATEGORIES.ANDROID,
            difficulty: QUIZ_DIFFICULTIES.HARD,
            symptom: "Galaxy Sシリーズ海外版の画面交換相談です。",
            question: "Galaxyの海外版と日本版で注意する点は？",
            choices: [
                "部品形状やフレーム構成が異なる場合がある",
                "必ず同じ部品が無加工で使える",
                "海外版には画面がない",
                "日本版はバッテリーを搭載していない"
            ],
            correctIndex: 0,
            explanation: "同じ機種名でも型番や販売地域により、フレーム、アンテナ、部品形状などが異なる場合があります。",
            repairName: "Galaxy型番確認",
            reward: 2000,
            gaugeGain: 20
        },

        {
            id: 19,
            category: QUIZ_CATEGORIES.ANDROID,
            difficulty: QUIZ_DIFFICULTIES.NORMAL,
            symptom: "Galaxyの画面交換後に指紋認証が使えません。",
            question: "画面内指紋認証が使えない場合に確認すべきものは？",
            choices: [
                "交換画面の対応状況とキャリブレーション",
                "着信音の種類",
                "充電器の色",
                "ホーム画面のアイコン数"
            ],
            correctIndex: 0,
            explanation: "交換パネルが画面内指紋認証に対応しているか、調整が必要かを確認します。",
            repairName: "指紋認証診断",
            reward: 1700,
            gaugeGain: 20
        },

        {
            id: 20,
            category: QUIZ_CATEGORIES.ANDROID,
            difficulty: QUIZ_DIFFICULTIES.EASY,
            symptom: "Android端末の画面に残像が残っています。",
            question: "有機EL画面で同じ表示が残り続ける現象は？",
            choices: [
                "焼き付き",
                "充電ループ",
                "圏外",
                "再起動"
            ],
            correctIndex: 0,
            explanation: "有機ELでは同じ表示を長時間出し続けることで、焼き付きが発生する場合があります。",
            repairName: "有機EL画面交換",
            reward: 1100,
            gaugeGain: 20
        },

        {
            id: 21,
            category: QUIZ_CATEGORIES.ANDROID,
            difficulty: QUIZ_DIFFICULTIES.EASY,
            symptom: "USB Type-Cケーブルが奥まで刺さりません。",
            question: "最初に確認すべきものは？",
            choices: [
                "充電口内部のホコリや異物",
                "カメラアプリの設定",
                "画面の壁紙",
                "指紋の登録数"
            ],
            correctIndex: 0,
            explanation: "充電口の奥にホコリが固まり、ケーブルが正常に刺さらないことがあります。",
            repairName: "USB-C清掃",
            reward: 1000,
            gaugeGain: 20
        },

        {
            id: 22,
            category: QUIZ_CATEGORIES.ANDROID,
            difficulty: QUIZ_DIFFICULTIES.NORMAL,
            symptom: "背面が浮いているAndroid端末です。",
            question: "背面パネルが浮く主な原因として考えられるものは？",
            choices: [
                "バッテリー膨張または粘着低下",
                "Bluetoothの接続",
                "画面の明るさ",
                "通知音の設定"
            ],
            correctIndex: 0,
            explanation: "バッテリー膨張や背面粘着の劣化により、背面が浮くことがあります。",
            repairName: "背面浮き診断",
            reward: 1400,
            gaugeGain: 20
        },

        {
            id: 23,
            category: QUIZ_CATEGORIES.ANDROID,
            difficulty: QUIZ_DIFFICULTIES.NORMAL,
            symptom: "Android端末を落とした後、画面は映りますがタッチできません。",
            question: "優先して疑うべきものは？",
            choices: [
                "画面のタッチセンサーまたは接続部",
                "スピーカーの音量",
                "SIMカード残量",
                "Bluetooth名"
            ],
            correctIndex: 0,
            explanation: "表示とタッチは別系統で故障することがあり、画面やコネクターを確認します。",
            repairName: "タッチ不良修理",
            reward: 1400,
            gaugeGain: 20
        },

        {
            id: 24,
            category: QUIZ_CATEGORIES.ANDROID,
            difficulty: QUIZ_DIFFICULTIES.NORMAL,
            symptom: "Android端末が水没しました。",
            question: "水没端末を乾かす方法として不適切なものは？",
            choices: [
                "高温のドライヤーを長時間当てる",
                "電源を切る",
                "外側の水分を拭く",
                "早めに内部点検を行う"
            ],
            correctIndex: 0,
            explanation: "高温により部品や接着剤、バッテリーを傷める可能性があります。",
            repairName: "水没洗浄",
            reward: 1500,
            gaugeGain: 20
        },

        {
            id: 25,
            category: QUIZ_CATEGORIES.ANDROID,
            difficulty: QUIZ_DIFFICULTIES.HARD,
            symptom: "画面交換後、端末が正常に閉まりません。",
            question: "組み立て前に確認すべきものは？",
            choices: [
                "ケーブルや部品がフレームに挟まっていないか",
                "着信音が最大か",
                "壁紙が純正か",
                "連絡先が登録されているか"
            ],
            correctIndex: 0,
            explanation: "無理に閉じるとケーブル断線やパネル破損につながるため、干渉箇所を確認します。",
            repairName: "組み立て再確認",
            reward: 1900,
            gaugeGain: 20
        },

        {
            id: 26,
            category: QUIZ_CATEGORIES.ANDROID,
            difficulty: QUIZ_DIFFICULTIES.NORMAL,
            symptom: "AQUOSの音が聞こえないという相談です。",
            question: "スピーカー故障と判断する前に確認すべきものは？",
            choices: [
                "音量設定、Bluetooth接続、スピーカー穴の詰まり",
                "本体カラー",
                "ホーム画面のページ数",
                "SIMトレーの向きだけ"
            ],
            correctIndex: 0,
            explanation: "設定やBluetooth出力、汚れによる音詰まりなど、部品故障以外の原因も確認します。",
            repairName: "スピーカー診断",
            reward: 1400,
            gaugeGain: 20
        },

        {
            id: 27,
            category: QUIZ_CATEGORIES.ANDROID,
            difficulty: QUIZ_DIFFICULTIES.HARD,
            symptom: "海外モデルのAndroid端末が持ち込まれました。",
            question: "修理受付時に特に確認すべき情報は？",
            choices: [
                "正確な型番と販売地域",
                "端末の壁紙",
                "着信音の曲名",
                "ホーム画面の色"
            ],
            correctIndex: 0,
            explanation: "同じ名称でも型番により部品が違うため、設定画面や背面表記などから正確な型番を確認します。",
            repairName: "機種型番確認",
            reward: 1800,
            gaugeGain: 20
        },


        /* =================================================
           Switch
           28〜37
           ================================================= */

        {
            id: 28,
            category: QUIZ_CATEGORIES.SWITCH,
            difficulty: QUIZ_DIFFICULTIES.EASY,
            symptom: "Switch本体の画面は真っ暗ですが、テレビには正常に映ります。",
            question: "優先して疑う箇所は？",
            choices: [
                "本体画面、バックライト、画面接続部",
                "ゲームカードだけ",
                "Joy-Conの色",
                "テレビのリモコン"
            ],
            correctIndex: 0,
            explanation: "TV出力と操作が正常なら、本体側の液晶表示系を優先して診断します。",
            repairName: "Switch画面診断",
            reward: 1300,
            gaugeGain: 20
        },

        {
            id: 29,
            category: QUIZ_CATEGORIES.SWITCH,
            difficulty: QUIZ_DIFFICULTIES.NORMAL,
            symptom: "Switchが充電できません。",
            question: "充電不良で確認すべき組み合わせは？",
            choices: [
                "充電口、バッテリー、充電制御回路",
                "ゲームソフトのジャンル",
                "Joy-Conの色",
                "ユーザーアイコン"
            ],
            correctIndex: 0,
            explanation: "USB-C端子だけでなく、バッテリーや充電制御ICなども原因になります。",
            repairName: "Switch充電診断",
            reward: 1600,
            gaugeGain: 20
        },

        {
            id: 30,
            category: QUIZ_CATEGORIES.SWITCH,
            difficulty: QUIZ_DIFFICULTIES.NORMAL,
            symptom: "ゲームカードだけ読み込みません。",
            question: "microSDカードは読める場合、優先して疑う部品は？",
            choices: [
                "ゲームカードスロット",
                "microSDカードスロット",
                "左Joy-Con",
                "本体スタンド"
            ],
            correctIndex: 0,
            explanation: "ゲームカードとmicroSDは別の読み込み系統なので、ゲームカード側を優先して確認します。",
            repairName: "カードスロット交換",
            reward: 1500,
            gaugeGain: 20
        },

        {
            id: 31,
            category: QUIZ_CATEGORIES.SWITCH,
            difficulty: QUIZ_DIFFICULTIES.NORMAL,
            symptom: "microSDカードだけ認識しません。",
            question: "最初に確認するものは？",
            choices: [
                "別の正常なmicroSDカードとスロット接続",
                "ゲームカードのラベル",
                "Joy-Conストラップ",
                "テレビの音量"
            ],
            correctIndex: 0,
            explanation: "カード自体の不良と、本体スロット側の不良を切り分けます。",
            repairName: "SDスロット診断",
            reward: 1400,
            gaugeGain: 20
        },

        {
            id: 32,
            category: QUIZ_CATEGORIES.SWITCH,
            difficulty: QUIZ_DIFFICULTIES.EASY,
            symptom: "操作していないのにキャラクターが勝手に動きます。",
            question: "この症状として代表的なものは？",
            choices: [
                "Joy-Conスティックのドリフト",
                "液晶の焼き付き",
                "ゲームカードの汚れ",
                "スピーカー故障"
            ],
            correctIndex: 0,
            explanation: "アナログスティックの摩耗や汚れなどにより、入力が勝手に入ることがあります。",
            repairName: "スティック交換",
            reward: 1100,
            gaugeGain: 20
        },

        {
            id: 33,
            category: QUIZ_CATEGORIES.SWITCH,
            difficulty: QUIZ_DIFFICULTIES.EASY,
            symptom: "Switchの冷却ファンから異音がします。",
            question: "放置した場合に起こり得るものは？",
            choices: [
                "本体の高温化や強制終了",
                "ストレージ容量の増加",
                "画面サイズの変化",
                "Joy-Conの充電速度向上"
            ],
            correctIndex: 0,
            explanation: "冷却不良により本体温度が上昇し、動作不安定や強制終了につながる場合があります。",
            repairName: "冷却ファン交換",
            reward: 1300,
            gaugeGain: 20
        },

        {
            id: 34,
            category: QUIZ_CATEGORIES.SWITCH,
            difficulty: QUIZ_DIFFICULTIES.NORMAL,
            symptom: "Switchが高温になりやすく、ファンは回っています。",
            question: "内部で確認すべきものは？",
            choices: [
                "ホコリ詰まりと熱伝導材の状態",
                "ユーザー名",
                "ゲームのプレイ時間だけ",
                "Joy-Conのカラー"
            ],
            correctIndex: 0,
            explanation: "排気経路のホコリや熱伝導材の劣化により、冷却効率が低下する場合があります。",
            repairName: "内部清掃",
            reward: 1500,
            gaugeGain: 20
        },　

        {
            id: 35,
            category: QUIZ_CATEGORIES.SWITCH,
            difficulty: QUIZ_DIFFICULTIES.HARD,
            symptom: "SwitchのUSB-C端子が大きく曲がっています。",
            question: "修理時に注意すべきものは？",
            choices: [
                "端子だけでなく基板パターンや周辺回路も確認する",
                "必ず画面交換だけで直る",
                "Joy-Conを充電すれば直る",
                "ゲームデータを消せば直る"
            ],
            correctIndex: 0,
            explanation: "強い破損では端子周辺の基板パターン剥離や充電回路故障を伴う場合があります。",
            repairName: "USB-C基板修理",
            reward: 2200,
            gaugeGain: 20
        },

        {
            id: 36,
            category: QUIZ_CATEGORIES.SWITCH,
            difficulty: QUIZ_DIFFICULTIES.NORMAL,
            symptom: "Switch有機ELモデルの画面が割れています。",
            question: "有機EL画面の特徴として正しいものは？",
            choices: [
                "各画素が発光し、黒の表現に優れる",
                "必ずバックライトだけで表示する",
                "液晶より必ず割れにくい",
                "タッチ機能を持たない"
            ],
            correctIndex: 0,
            explanation: "有機ELは各画素が自ら発光し、深い黒や高いコントラストを表現できます。",
            repairName: "有機EL画面交換",
            reward: 1600,
            gaugeGain: 20
        },

        {
            id: 37,
            category: QUIZ_CATEGORIES.SWITCH,
            difficulty: QUIZ_DIFFICULTIES.NORMAL,
            symptom: "Switchを落としてからゲームカードを認識しません。",
            question: "分解前に行う確認として適切なものは？",
            choices: [
                "別の正常なゲームカードでも認識しないか確認する",
                "本体を強く振る",
                "端子へ大量の液体を入れる",
                "画面を強く押す"
            ],
            correctIndex: 0,
            explanation: "ゲームカード側の不良か、本体側の不良かを先に切り分けます。",
            repairName: "カード読み込み診断",
            reward: 1400,
            gaugeGain: 20
        },


        /* =================================================
           修理知識
           38〜50
           ================================================= */

        {
            id: 38,
            category: QUIZ_CATEGORIES.REPAIR,
            difficulty: QUIZ_DIFFICULTIES.EASY,
            symptom: "これから端末を分解します。",
            question: "分解作業前に最初に行うべきことは？",
            choices: [
                "端末の状態確認とお客様への説明",
                "すぐにネジを外す",
                "データを勝手に確認する",
                "部品を先に捨てる"
            ],
            correctIndex: 0,
            explanation: "修理前の外観、動作、故障症状、免責事項を確認して記録します。",
            repairName: "受付確認",
            reward: 1000,
            gaugeGain: 20
        },

        {
            id: 39,
            category: QUIZ_CATEGORIES.REPAIR,
            difficulty: QUIZ_DIFFICULTIES.EASY,
            symptom: "端末内部のコネクターを外す作業です。",
            question: "内部作業前に優先して外すものは？",
            choices: [
                "バッテリー接続",
                "本体のロゴ",
                "SIMカードの印字",
                "カメラアプリ"
            ],
            correctIndex: 0,
            explanation: "通電したまま作業するとショートの危険があるため、バッテリー接続を先に外します。",
            repairName: "安全な分解",
            reward: 1100,
            gaugeGain: 20
        },

        {
            id: 40,
            category: QUIZ_CATEGORIES.REPAIR,
            difficulty: QUIZ_DIFFICULTIES.NORMAL,
            symptom: "基板やコネクターを扱う作業です。",
            question: "静電気対策として適切なものは？",
            choices: [
                "ESD対策された環境やリストストラップを使用する",
                "乾いた布で強くこする",
                "カーペット上で作業する",
                "静電気を発生させてから触る"
            ],
            correctIndex: 0,
            explanation: "静電気放電は精密部品を損傷する可能性があるため、ESD対策が重要です。",
            repairName: "ESD対策",
            reward: 1400,
            gaugeGain: 20
        },

        {
            id: 41,
            category: QUIZ_CATEGORIES.REPAIR,
            difficulty: QUIZ_DIFFICULTIES.NORMAL,
            symptom: "長さの違うネジが多数ある端末です。",
            question: "ネジ管理で重要なことは？",
            choices: [
                "外した位置と長さを記録する",
                "すべて同じ場所にまとめる",
                "余ったネジは捨てる",
                "長いネジをどこにでも使う"
            ],
            correctIndex: 0,
            explanation: "誤った長さのネジを入れると、基板や画面を損傷する可能性があります。",
            repairName: "ネジ管理",
            reward: 1300,
            gaugeGain: 20
        },

        {
            id: 42,
            category: QUIZ_CATEGORIES.REPAIR,
            difficulty: QUIZ_DIFFICULTIES.EASY,
            symptom: "修理後の端末をお客様へ返却します。",
            question: "返却前に行うべきことは？",
            choices: [
                "修理箇所と基本動作の確認",
                "動作確認をせずに返す",
                "データを削除する",
                "ネジを数本外したまま返す"
            ],
            correctIndex: 0,
            explanation: "画面、タッチ、充電、音声、カメラ、通信など、修理内容に応じた確認を行います。",
            repairName: "修理後チェック",
            reward: 1000,
            gaugeGain: 20
        },

        {
            id: 43,
            category: QUIZ_CATEGORIES.REPAIR,
            difficulty: QUIZ_DIFFICULTIES.NORMAL,
            symptom: "画面交換後の端末を閉じる作業です。",
            question: "新しい粘着テープを使う主な目的は？",
            choices: [
                "画面や背面を固定し、隙間を減らす",
                "通信速度を上げる",
                "ストレージを増やす",
                "カメラ画質を上げる"
            ],
            correctIndex: 0,
            explanation: "粘着は部品の固定や隙間の軽減に役立ちますが、修理後の完全防水を保証するものではありません。",
            repairName: "圧着作業",
            reward: 1300,
            gaugeGain: 20
        },

        {
            id: 44,
            category: QUIZ_CATEGORIES.REPAIR,
            difficulty: QUIZ_DIFFICULTIES.NORMAL,
            symptom: "お客様が修理後も完全防水か質問しています。",
            question: "修理後の防水性能について適切な案内は？",
            choices: [
                "完全な防水性能は保証できないと説明する",
                "必ず新品時以上の防水になる",
                "水中で動作確認して渡す",
                "粘着を貼れば永久に防水になる"
            ],
            correctIndex: 0,
            explanation: "分解修理後は、新品時と同等の防水性能を保証できないことを案内します。",
            repairName: "防水リスク説明",
            reward: 1500,
            gaugeGain: 20
        },

        {
            id: 45,
            category: QUIZ_CATEGORIES.REPAIR,
            difficulty: QUIZ_DIFFICULTIES.EASY,
            symptom: "修理前のお客様対応です。",
            question: "データについて適切な案内は？",
            choices: [
                "修理前にバックアップを推奨する",
                "修理店が必ず全データを保証する",
                "バックアップは絶対に不要",
                "お客様の許可なく初期化する"
            ],
            correctIndex: 0,
            explanation: "修理では予期しないデータ消失の可能性があるため、事前バックアップを推奨します。",
            repairName: "バックアップ案内",
            reward: 1000,
            gaugeGain: 20
        },

        {
            id: 46,
            category: QUIZ_CATEGORIES.REPAIR,
            difficulty: QUIZ_DIFFICULTIES.NORMAL,
            symptom: "部品交換で直るか確定できない端末です。",
            question: "受付時の説明として適切なものは？",
            choices: [
                "診断結果によって追加修理が必要な可能性を伝える",
                "必ず直ると断言する",
                "料金説明をしない",
                "故障内容を確認せず預かる"
            ],
            correctIndex: 0,
            explanation: "原因が複数考えられる場合は、修理方法、追加費用、預かり期間の可能性を説明します。",
            repairName: "修理見積もり",
            reward: 1400,
            gaugeGain: 20
        },

        {
            id: 47,
            category: QUIZ_CATEGORIES.REPAIR,
            difficulty: QUIZ_DIFFICULTIES.HARD,
            symptom: "新しい画面を仮付けして確認する場面です。",
            question: "画面を完全に閉じる前に行うべきことは？",
            choices: [
                "表示、タッチ、センサーなどを仮組みで確認する",
                "確認せず強く圧着する",
                "バッテリーを傷つける",
                "コネクターを斜めに押し込む"
            ],
            correctIndex: 0,
            explanation: "完全に組み立てる前に部品の初期不良や接続不良を確認すると、再分解のリスクを減らせます。",
            repairName: "仮組みテスト",
            reward: 1700,
            gaugeGain: 20
        },

        {
            id: 48,
            category: QUIZ_CATEGORIES.REPAIR,
            difficulty: QUIZ_DIFFICULTIES.NORMAL,
            symptom: "コネクターがうまくはまりません。",
            question: "コネクター接続時の正しい対応は？",
            choices: [
                "位置を合わせ、無理な力をかけず接続する",
                "工具で強く叩く",
                "斜めのまま押し込む",
                "接点を削る"
            ],
            correctIndex: 0,
            explanation: "位置が合っていない状態で押すと、コネクターや基板を損傷する可能性があります。",
            repairName: "コネクター接続",
            reward: 1300,
            gaugeGain: 20
        },

        {
            id: 49,
            category: QUIZ_CATEGORIES.REPAIR,
            difficulty: QUIZ_DIFFICULTIES.HARD,
            symptom: "水没端末の内部に腐食があります。",
            question: "腐食がある場合に必要となる可能性が高い作業は？",
            choices: [
                "内部洗浄と基板診断",
                "壁紙変更",
                "ケース交換だけ",
                "音量設定変更"
            ],
            correctIndex: 0,
            explanation: "水没ではコネクターや基板に腐食が発生するため、洗浄や基板修理が必要になる場合があります。",
            repairName: "水没基板診断",
            reward: 2000,
            gaugeGain: 20
        },

        {
            id: 50,
            category: QUIZ_CATEGORIES.REPAIR,
            difficulty: QUIZ_DIFFICULTIES.NORMAL,
            symptom: "修理完了後、お客様へ説明する場面です。",
            question: "返却時の接客として適切なものは？",
            choices: [
                "修理内容、確認結果、注意点を説明する",
                "無言で端末を渡す",
                "修理箇所を説明しない",
                "確認せずに保証を断言する"
            ],
            correctIndex: 0,
            explanation: "修理内容と動作確認結果、保証範囲、修理後の注意事項を分かりやすく説明します。",
            repairName: "修理完了案内",
            reward: 1200,
            gaugeGain: 20
        }

    ];


    /* =====================================================
       INTERNAL STATE
       ===================================================== */

    let questionDeck = [];
    let usedQuestionIds = [];
    let lastQuestionId = null;


    /* =====================================================
       UTILITY
       ===================================================== */

    /**
     * 配列をコピーしてシャッフルする
     *
     * @param {Array} array
     * @returns {Array}
     */
    function shuffleArray(array) {

        const shuffled = [...array];

        for (let i = shuffled.length - 1; i > 0; i--) {

            const randomIndex = Math.floor(Math.random() * (i + 1));

            const temporary = shuffled[i];

            shuffled[i] = shuffled[randomIndex];
            shuffled[randomIndex] = temporary;

        }

        return shuffled;

    }


    /**
     * 問題データを安全にコピーする
     *
     * @param {Object} question
     * @returns {Object}
     */
    function cloneQuestion(question) {

        return {
            ...question,
            choices: [...question.choices]
        };

    }


    /**
     * 選択肢をシャッフルする
     * correctIndexも新しい位置へ変更する
     *
     * @param {Object} question
     * @returns {Object}
     */
    function shuffleQuestionChoices(question) {

        const clonedQuestion = cloneQuestion(question);

        const choiceObjects = clonedQuestion.choices.map(
            function (choice, index) {

                return {
                    text: choice,
                    isCorrect: index === clonedQuestion.correctIndex
                };

            }
        );

        const shuffledChoices = shuffleArray(choiceObjects);

        const newCorrectIndex = shuffledChoices.findIndex(
            function (choiceObject) {

                return choiceObject.isCorrect;

            }
        );

        clonedQuestion.choices = shuffledChoices.map(
            function (choiceObject) {

                return choiceObject.text;

            }
        );

        clonedQuestion.correctIndex = newCorrectIndex;

        return clonedQuestion;

    }


    /* =====================================================
       DECK
       ===================================================== */

    /**
     * 全問題から新しいデッキを作る
     *
     * @param {boolean} shuffleChoices
     * @returns {Array}
     */
    function createQuestionDeck(shuffleChoices = true) {

        let deck = shuffleArray(QUIZ_DATA);

        if (lastQuestionId !== null && deck.length > 1) {

            if (deck[0].id === lastQuestionId) {

                const temporary = deck[0];

                deck[0] = deck[1];
                deck[1] = temporary;

            }

        }

        if (shuffleChoices) {

            deck = deck.map(shuffleQuestionChoices);

        } else {

            deck = deck.map(cloneQuestion);

        }

        questionDeck = deck;

        usedQuestionIds = [];

        return questionDeck.map(cloneQuestion);

    }


    /**
     * デッキをリセットする
     */
    function resetQuestionDeck() {

        questionDeck = [];
        usedQuestionIds = [];
        lastQuestionId = null;

    }


    /**
     * デッキの残り問題数
     *
     * @returns {number}
     */
    function getRemainingQuestionCount() {

        return questionDeck.length;

    }


    /* =====================================================
       QUESTION GETTERS
       ===================================================== */

    /**
     * 次の問題を1問取得する
     * デッキが空なら自動で再生成する
     *
     * @param {Object} options
     * @param {string|null} options.category
     * @param {number|null} options.difficulty
     * @param {boolean} options.shuffleChoices
     * @returns {Object|null}
     */
    function getNextQuestion(options = {}) {

        const {
            category = null,
            difficulty = null,
            shuffleChoices = true
        } = options;

        if (questionDeck.length === 0) {

            createQuestionDeck(shuffleChoices);

        }

        let questionIndex = findQuestionIndex(
            questionDeck,
            category,
            difficulty
        );

        if (questionIndex === -1) {

            createQuestionDeck(shuffleChoices);

            questionIndex = findQuestionIndex(
                questionDeck,
                category,
                difficulty
            );

        }

        if (questionIndex === -1) {

            console.warn(
                "指定条件に一致する問題が見つかりません。",
                {
                    category: category,
                    difficulty: difficulty
                }
            );

            return null;

        }

        const selectedQuestion = questionDeck.splice(
            questionIndex,
            1
        )[0];

        usedQuestionIds.push(selectedQuestion.id);

        lastQuestionId = selectedQuestion.id;

        return cloneQuestion(selectedQuestion);

    }


    /**
     * 条件に一致する問題のインデックスを探す
     *
     * @param {Array} deck
     * @param {string|null} category
     * @param {number|null} difficulty
     * @returns {number}
     */
    function findQuestionIndex(
        deck,
        category = null,
        difficulty = null
    ) {

        return deck.findIndex(
            function (question) {

                const categoryMatches =
                    category === null ||
                    question.category === category;

                const difficultyMatches =
                    difficulty === null ||
                    question.difficulty === difficulty;

                return categoryMatches && difficultyMatches;

            }
        );

    }


    /**
     * IDから問題を取得する
     *
     * @param {number} questionId
     * @param {boolean} shuffleChoices
     * @returns {Object|null}
     */
    function getQuestionById(
        questionId,
        shuffleChoices = false
    ) {

        const question = QUIZ_DATA.find(
            function (quizQuestion) {

                return quizQuestion.id === Number(questionId);

            }
        );

        if (!question) {

            return null;

        }

        if (shuffleChoices) {

            return shuffleQuestionChoices(question);

        }

        return cloneQuestion(question);

    }


    /**
     * 指定カテゴリの問題一覧を取得する
     *
     * @param {string} category
     * @param {boolean} shuffleChoices
     * @returns {Array}
     */
    function getQuestionsByCategory(
        category,
        shuffleChoices = false
    ) {

        const questions = QUIZ_DATA.filter(
            function (question) {

                return question.category === category;

            }
        );

        if (shuffleChoices) {

            return questions.map(shuffleQuestionChoices);

        }

        return questions.map(cloneQuestion);

    }


    /**
     * 指定難易度の問題一覧を取得する
     *
     * @param {number} difficulty
     * @returns {Array}
     */
    function getQuestionsByDifficulty(difficulty) {

        return QUIZ_DATA
            .filter(
                function (question) {

                    return question.difficulty === difficulty;

                }
            )
            .map(cloneQuestion);

    }


    /**
     * ランダムで1問取得する
     *
     * @param {Object} options
     * @returns {Object|null}
     */
    function getRandomQuestion(options = {}) {

        return getNextQuestion(options);

    }


    /* =====================================================
       ANSWER
       ===================================================== */

    /**
     * 回答が正解か判定する
     *
     * @param {Object} question
     * @param {number} selectedIndex
     * @returns {boolean}
     */
    function isCorrectAnswer(question, selectedIndex) {

        if (!question) {

            return false;

        }

        return Number(selectedIndex) === question.correctIndex;

    }


    /**
     * 回答結果の詳細を返す
     *
     * @param {Object} question
     * @param {number} selectedIndex
     * @returns {Object}
     */
    function checkAnswer(question, selectedIndex) {

        if (!question) {

            return {
                isCorrect: false,
                selectedIndex: Number(selectedIndex),
                correctIndex: -1,
                correctAnswer: "",
                explanation: "",
                reward: 0,
                gaugeGain: 0
            };

        }

        const normalizedSelectedIndex = Number(selectedIndex);

        const correct = isCorrectAnswer(
            question,
            normalizedSelectedIndex
        );

        return {
            isCorrect: correct,
            selectedIndex: normalizedSelectedIndex,
            correctIndex: question.correctIndex,
            correctAnswer:
                question.choices[question.correctIndex] || "",
            explanation: question.explanation,
            reward: correct ? question.reward : 0,
            gaugeGain: correct ? question.gaugeGain : 0
        };

    }


    /* =====================================================
       INFORMATION
       ===================================================== */

    /**
     * 全カテゴリを取得する
     *
     * @returns {Array}
     */
    function getCategories() {

        return Object.values(QUIZ_CATEGORIES);

    }


    /**
     * カテゴリごとの問題数を取得する
     *
     * @returns {Object}
     */
    function getCategoryCounts() {

        return QUIZ_DATA.reduce(
            function (counts, question) {

                if (!counts[question.category]) {

                    counts[question.category] = 0;

                }

                counts[question.category] += 1;

                return counts;

            },
            {}
        );

    }


    /**
     * 全問題数を取得する
     *
     * @returns {number}
     */
    function getTotalQuestionCount() {

        return QUIZ_DATA.length;

    }


    /**
     * 出題済みIDを取得する
     *
     * @returns {Array}
     */
    function getUsedQuestionIds() {

        return [...usedQuestionIds];

    }


    /**
     * 全問題をコピーして取得する
     *
     * @returns {Array}
     */
    function getAllQuestions() {

        return QUIZ_DATA.map(cloneQuestion);

    }


    /* =====================================================
       VALIDATION
       ===================================================== */

    /**
     * 問題データを検証する
     *
     * @returns {Object}
     */
    function validateQuizData() {

        const errors = [];

        const usedIds = new Set();

        QUIZ_DATA.forEach(
            function (question, index) {

                const position = index + 1;

                if (!Number.isInteger(question.id)) {

                    errors.push(
                        `問題${position}: idが整数ではありません。`
                    );

                }

                if (usedIds.has(question.id)) {

                    errors.push(
                        `問題${position}: id ${question.id} が重複しています。`
                    );

                }

                usedIds.add(question.id);

                if (!Object.values(QUIZ_CATEGORIES).includes(
                    question.category
                )) {

                    errors.push(
                        `問題${question.id}: categoryが不正です。`
                    );

                }

                if (
                    !Array.isArray(question.choices) ||
                    question.choices.length !== 4
                ) {

                    errors.push(
                        `問題${question.id}: choicesは4件必要です。`
                    );

                }

                if (
                    !Number.isInteger(question.correctIndex) ||
                    question.correctIndex < 0 ||
                    question.correctIndex > 3
                ) {

                    errors.push(
                        `問題${question.id}: correctIndexが不正です。`
                    );

                }

                if (
                    typeof question.question !== "string" ||
                    question.question.trim() === ""
                ) {

                    errors.push(
                        `問題${question.id}: questionが空です。`
                    );

                }

                if (
                    typeof question.explanation !== "string" ||
                    question.explanation.trim() === ""
                ) {

                    errors.push(
                        `問題${question.id}: explanationが空です。`
                    );

                }

                if (
                    typeof question.reward !== "number" ||
                    question.reward < 0
                ) {

                    errors.push(
                        `問題${question.id}: rewardが不正です。`
                    );

                }

                if (
                    typeof question.gaugeGain !== "number" ||
                    question.gaugeGain < 0
                ) {

                    errors.push(
                        `問題${question.id}: gaugeGainが不正です。`
                    );

                }

            }
        );

        if (QUIZ_DATA.length !== 50) {

            errors.push(
                `問題数が50問ではありません。現在${QUIZ_DATA.length}問です。`
            );

        }

        return {
            isValid: errors.length === 0,
            questionCount: QUIZ_DATA.length,
            categoryCounts: getCategoryCounts(),
            errors: errors
        };

    }


    /* =====================================================
       INITIALIZE
       ===================================================== */

    const validationResult = validateQuizData();

    if (!validationResult.isValid) {

        console.error(
            "Repair Legendの問題データにエラーがあります。",
            validationResult.errors
        );

    } else {

        console.log(
            `Repair Legend Quiz: ${validationResult.questionCount}問を読み込みました。`,
            validationResult.categoryCounts
        );

    }


    /* =====================================================
       PUBLIC API
       ===================================================== */

    const RepairLegendQuiz = Object.freeze({

        categories: QUIZ_CATEGORIES,

        difficulties: QUIZ_DIFFICULTIES,

        createQuestionDeck: createQuestionDeck,

        resetQuestionDeck: resetQuestionDeck,

        getNextQuestion: getNextQuestion,

        getRandomQuestion: getRandomQuestion,

        getQuestionById: getQuestionById,

        getQuestionsByCategory: getQuestionsByCategory,

        getQuestionsByDifficulty: getQuestionsByDifficulty,

        getAllQuestions: getAllQuestions,

        getCategories: getCategories,

        getCategoryCounts: getCategoryCounts,

        getTotalQuestionCount: getTotalQuestionCount,

        getRemainingQuestionCount: getRemainingQuestionCount,

        getUsedQuestionIds: getUsedQuestionIds,

        isCorrectAnswer: isCorrectAnswer,

        checkAnswer: checkAnswer,

        shuffleArray: shuffleArray,

        shuffleQuestionChoices: shuffleQuestionChoices,

        validateQuizData: validateQuizData

    });


    /* =====================================================
       GLOBAL EXPORT
       game.jsから使用する
       ===================================================== */

    window.RepairLegendQuiz = RepairLegendQuiz;

    /*
     * 互換用
     * window.quizDataでも問題一覧を参照できる
     */
    window.quizData = QUIZ_DATA.map(cloneQuestion);

})();