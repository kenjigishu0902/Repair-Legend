/* =========================================================
   Repair Legend v1.0
   quiz.js - 構文エラー修正版
   全50問 / 4択 / 重複防止 / 選択肢シャッフル対応
   ========================================================= */

"use strict";

(function () {
    const QUIZ_CATEGORIES = Object.freeze({
        IPHONE: "iPhone",
        ANDROID: "Android",
        SWITCH: "Switch",
        REPAIR: "修理知識"
    });

    const QUIZ_DIFFICULTIES = Object.freeze({
        EASY: 1,
        NORMAL: 2,
        HARD: 3
    });

    const QUIZ_DATA = [
    {
        "id": 1,
        "category": "iPhone",
        "difficulty": 1,
        "symptom": "",
        "question": "iPhone 17シリーズのリフレッシュレートについて正しいものは？",
        "choices": [
            "全機種が最大120Hzに対応している",
            "Pro Maxだけが120Hzに対応している",
            "全機種が60Hz固定である",
            "無印モデルだけが120Hzに対応している"
        ],
        "correctIndex": 0,
        "explanation": "iPhone 17シリーズは全機種が最大120Hz対応として扱います。",
        "repairName": "画面性能の案内",
        "reward": 1200,
        "gaugeGain": 20
    },
    {
        "id": 2,
        "category": "iPhone",
        "difficulty": 1,
        "symptom": "",
        "question": "iPhone 13シリーズで最大120Hzに対応している機種は？",
        "choices": [
            "iPhone 13 miniのみ",
            "iPhone 13とiPhone 13 mini",
            "iPhone 13 ProとiPhone 13 Pro Max",
            "iPhone 13シリーズ全機種"
        ],
        "correctIndex": 2,
        "explanation": "ProMotion対応のProとPro Maxが最大120Hzです。",
        "repairName": "画面性能の確認",
        "reward": 1100,
        "gaugeGain": 20
    },
    {
        "id": 3,
        "category": "iPhone",
        "difficulty": 1,
        "symptom": "",
        "question": "iPhone 12シリーズの純正仕様で最大120Hzに対応している機種は？",
        "choices": [
            "iPhone 12 Pro Max",
            "iPhone 12 Pro",
            "iPhone 12 mini",
            "対応機種はない"
        ],
        "correctIndex": 3,
        "explanation": "iPhone 12シリーズには最大120Hz対応モデルはありません。",
        "repairName": "画面仕様の確認",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 4,
        "category": "iPhone",
        "difficulty": 2,
        "symptom": "",
        "question": "高リフレッシュレート対応iPhoneに低品質なコピーパネルを付けた場合、起こり得ることは？",
        "choices": [
            "必ずFace IDが強化される",
            "表示の滑らかさが低下することがある",
            "ストレージ容量が増える",
            "バッテリー最大容量が100％になる"
        ],
        "correctIndex": 1,
        "explanation": "交換パネルの仕様によっては本来の滑らかさを再現できない場合があります。",
        "repairName": "交換パネルの再確認",
        "reward": 1500,
        "gaugeGain": 20
    },
    {
        "id": 5,
        "category": "iPhone",
        "difficulty": 2,
        "symptom": "",
        "question": "True Toneを維持するために重要な作業は？",
        "choices": [
            "元画面の表示データを適切に引き継ぐ",
            "SIMカードを交換する",
            "スピーカーを交換する",
            "充電口を清掃する"
        ],
        "correctIndex": 0,
        "explanation": "機種や修理方法により、元画面データの引き継ぎが重要です。",
        "repairName": "True Tone設定",
        "reward": 1600,
        "gaugeGain": 20
    },
    {
        "id": 6,
        "category": "iPhone",
        "difficulty": 2,
        "symptom": "",
        "question": "Face ID修理で特に注意すべきことは？",
        "choices": [
            "Face ID部品は本体と関連付けられている",
            "Face IDはSIMカードに保存されている",
            "Face IDは画面の色で決まる",
            "Face IDは充電器を替えれば直る"
        ],
        "correctIndex": 0,
        "explanation": "Face ID関連部品には本体と関連付けられた重要部品があります。",
        "repairName": "Face ID診断",
        "reward": 1700,
        "gaugeGain": 20
    },
    {
        "id": 7,
        "category": "iPhone",
        "difficulty": 1,
        "symptom": "",
        "question": "バッテリー劣化時に起こりやすい症状は？",
        "choices": [
            "電池の減りが早くなる",
            "画面サイズが大きくなる",
            "カメラの画素数が増える",
            "ストレージが自動で増える"
        ],
        "correctIndex": 0,
        "explanation": "劣化すると持続時間低下や突然の電源落ちが起こる場合があります。",
        "repairName": "バッテリー交換",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 8,
        "category": "iPhone",
        "difficulty": 2,
        "symptom": "",
        "question": "充電不良の最初の確認として適切なものは？",
        "choices": [
            "充電口の異物や汚れを確認する",
            "すぐに基板を廃棄する",
            "画面を強く押す",
            "カメラを交換する"
        ],
        "correctIndex": 0,
        "explanation": "充電口のホコリや異物をまず確認します。",
        "repairName": "ドック清掃",
        "reward": 1100,
        "gaugeGain": 20
    },
    {
        "id": 9,
        "category": "iPhone",
        "difficulty": 2,
        "symptom": "",
        "question": "触っていないのに画面が勝手に操作される症状は？",
        "choices": [
            "ゴーストタッチ",
            "バッテリー膨張",
            "圏外病",
            "スピーカー割れ"
        ],
        "correctIndex": 0,
        "explanation": "画面破損やパネル不良でゴーストタッチが発生することがあります。",
        "repairName": "画面交換",
        "reward": 1200,
        "gaugeGain": 20
    },
    {
        "id": 10,
        "category": "iPhone",
        "difficulty": 3,
        "symptom": "",
        "question": "指紋認証は使えるがホームボタンの押下反応がない場合、優先して確認する箇所は？",
        "choices": [
            "ホームボタン周辺のケーブルと接点",
            "リアカメラのレンズ",
            "SIMトレーの色",
            "イヤースピーカーの網"
        ],
        "correctIndex": 0,
        "explanation": "ケーブル、接点、パネル側経路などを確認します。",
        "repairName": "ホームボタン点検",
        "reward": 1900,
        "gaugeGain": 20
    },
    {
        "id": 11,
        "category": "iPhone",
        "difficulty": 2,
        "symptom": "",
        "question": "画面浮きの原因として優先して疑うべきものは？",
        "choices": [
            "バッテリー膨張",
            "スピーカー音量",
            "壁紙設定",
            "SIMカードの向き"
        ],
        "correctIndex": 0,
        "explanation": "内部バッテリーが膨張して画面を押し上げる場合があります。",
        "repairName": "膨張バッテリー交換",
        "reward": 1500,
        "gaugeGain": 20
    },
    {
        "id": 12,
        "category": "iPhone",
        "difficulty": 1,
        "symptom": "",
        "question": "着信音は鳴るが画面が真っ暗な場合、最初に疑う箇所は？",
        "choices": [
            "画面または画面接続部",
            "SIMカードの契約",
            "背面カメラの倍率",
            "本体カラー"
        ],
        "correctIndex": 0,
        "explanation": "動作しているなら画面表示系を優先して確認します。",
        "repairName": "画面診断",
        "reward": 1100,
        "gaugeGain": 20
    },
    {
        "id": 13,
        "category": "iPhone",
        "difficulty": 2,
        "symptom": "",
        "question": "水没直後の対応として避けるべき行動は？",
        "choices": [
            "すぐに充電して動作確認する",
            "電源を切る",
            "早めに点検へ持ち込む",
            "外側の水分を拭き取る"
        ],
        "correctIndex": 0,
        "explanation": "濡れた状態で通電するとショートを悪化させる可能性があります。",
        "repairName": "水没処置",
        "reward": 1600,
        "gaugeGain": 20
    },
    {
        "id": 14,
        "category": "iPhone",
        "difficulty": 3,
        "symptom": "",
        "question": "バッテリー交換後も電流が流れずPCにも認識されない場合、考えられるものは？",
        "choices": [
            "基板や電源系統の故障",
            "壁紙の設定不良",
            "ケースの色が不適切",
            "着信音量が低い"
        ],
        "correctIndex": 0,
        "explanation": "基板や電源回路の診断が必要です。",
        "repairName": "基板診断",
        "reward": 2100,
        "gaugeGain": 20
    },
    {
        "id": 15,
        "category": "iPhone",
        "difficulty": 2,
        "symptom": "",
        "question": "通話中に画面が消えない場合、確認すべきものは？",
        "choices": [
            "近接センサー周辺の位置と取り付け",
            "リアカメラのズーム倍率",
            "SIMカードの電話番号",
            "バッテリーの色"
        ],
        "correctIndex": 0,
        "explanation": "位置ズレ、損傷、汚れなどを確認します。",
        "repairName": "近接センサー調整",
        "reward": 1600,
        "gaugeGain": 20
    },
    {
        "id": 16,
        "category": "Android",
        "difficulty": 2,
        "symptom": "",
        "question": "Pixelの画面交換後に必要になる場合がある作業は？",
        "choices": [
            "画面キャリブレーション",
            "SIMカードの切断",
            "カメラレンズの塗装",
            "本体カラーの変更"
        ],
        "correctIndex": 0,
        "explanation": "機種や部品により画面や指紋認証の調整が必要です。",
        "repairName": "Pixelキャリブレーション",
        "reward": 1600,
        "gaugeGain": 20
    },
    {
        "id": 17,
        "category": "Android",
        "difficulty": 3,
        "symptom": "",
        "question": "Pixel 6シリーズの画面交換後に特に確認すべきものは？",
        "choices": [
            "画面と指紋認証のキャリブレーション",
            "イヤホンの色",
            "SIMカードのメーカー",
            "壁紙の明るさだけ"
        ],
        "correctIndex": 0,
        "explanation": "画面交換後の指紋認証や表示調整が重要です。",
        "repairName": "指紋認証調整",
        "reward": 1900,
        "gaugeGain": 20
    },
    {
        "id": 18,
        "category": "Android",
        "difficulty": 3,
        "symptom": "",
        "question": "Galaxyの海外版と日本版で注意する点は？",
        "choices": [
            "部品形状やフレーム構成が異なる場合がある",
            "必ず同じ部品が無加工で使える",
            "海外版には画面がない",
            "日本版はバッテリーを搭載していない"
        ],
        "correctIndex": 0,
        "explanation": "型番や販売地域により部品形状などが異なる場合があります。",
        "repairName": "Galaxy型番確認",
        "reward": 2000,
        "gaugeGain": 20
    },
    {
        "id": 19,
        "category": "Android",
        "difficulty": 2,
        "symptom": "",
        "question": "画面内指紋認証が使えない場合に確認すべきものは？",
        "choices": [
            "交換画面の対応状況とキャリブレーション",
            "着信音の種類",
            "充電器の色",
            "ホーム画面のアイコン数"
        ],
        "correctIndex": 0,
        "explanation": "交換パネルの対応状況や調整が必要か確認します。",
        "repairName": "指紋認証診断",
        "reward": 1700,
        "gaugeGain": 20
    },
    {
        "id": 20,
        "category": "Android",
        "difficulty": 1,
        "symptom": "",
        "question": "有機EL画面で同じ表示が残り続ける現象は？",
        "choices": [
            "焼き付き",
            "充電ループ",
            "圏外",
            "再起動"
        ],
        "correctIndex": 0,
        "explanation": "同じ表示を長時間出すと焼き付きが発生する場合があります。",
        "repairName": "有機EL画面交換",
        "reward": 1100,
        "gaugeGain": 20
    },
    {
        "id": 21,
        "category": "Android",
        "difficulty": 1,
        "symptom": "",
        "question": "USB Type-Cケーブルが奥まで刺さらない場合、最初に確認するものは？",
        "choices": [
            "充電口内部のホコリや異物",
            "カメラアプリの設定",
            "画面の壁紙",
            "指紋の登録数"
        ],
        "correctIndex": 0,
        "explanation": "充電口の奥にホコリが固まっていることがあります。",
        "repairName": "USB-C清掃",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 22,
        "category": "Android",
        "difficulty": 2,
        "symptom": "",
        "question": "背面パネルが浮く主な原因として考えられるものは？",
        "choices": [
            "バッテリー膨張または粘着低下",
            "Bluetoothの接続",
            "画面の明るさ",
            "通知音の設定"
        ],
        "correctIndex": 0,
        "explanation": "バッテリー膨張や粘着劣化が原因になることがあります。",
        "repairName": "背面浮き診断",
        "reward": 1400,
        "gaugeGain": 20
    },
    {
        "id": 23,
        "category": "Android",
        "difficulty": 2,
        "symptom": "",
        "question": "落下後、画面は映るがタッチできない場合、優先して疑うものは？",
        "choices": [
            "画面のタッチセンサーまたは接続部",
            "スピーカーの音量",
            "SIMカード残量",
            "Bluetooth名"
        ],
        "correctIndex": 0,
        "explanation": "表示とタッチは別系統で故障する場合があります。",
        "repairName": "タッチ不良修理",
        "reward": 1400,
        "gaugeGain": 20
    },
    {
        "id": 24,
        "category": "Android",
        "difficulty": 2,
        "symptom": "",
        "question": "水没端末を乾かす方法として不適切なものは？",
        "choices": [
            "高温のドライヤーを長時間当てる",
            "電源を切る",
            "外側の水分を拭く",
            "早めに内部点検を行う"
        ],
        "correctIndex": 0,
        "explanation": "高温で部品や接着剤、バッテリーを傷める可能性があります。",
        "repairName": "水没洗浄",
        "reward": 1500,
        "gaugeGain": 20
    },
    {
        "id": 25,
        "category": "Android",
        "difficulty": 3,
        "symptom": "",
        "question": "画面交換後、端末が正常に閉まらない場合に確認すべきものは？",
        "choices": [
            "ケーブルや部品がフレームに挟まっていないか",
            "着信音が最大か",
            "壁紙が純正か",
            "連絡先が登録されているか"
        ],
        "correctIndex": 0,
        "explanation": "無理に閉じず干渉箇所を確認します。",
        "repairName": "組み立て再確認",
        "reward": 1900,
        "gaugeGain": 20
    },
    {
        "id": 26,
        "category": "Android",
        "difficulty": 2,
        "symptom": "",
        "question": "スピーカー故障と判断する前に確認すべきものは？",
        "choices": [
            "音量設定、Bluetooth接続、スピーカー穴の詰まり",
            "本体カラー",
            "ホーム画面のページ数",
            "SIMトレーの向きだけ"
        ],
        "correctIndex": 0,
        "explanation": "設定やBluetooth出力、汚れも確認します。",
        "repairName": "スピーカー診断",
        "reward": 1400,
        "gaugeGain": 20
    },
    {
        "id": 27,
        "category": "Android",
        "difficulty": 3,
        "symptom": "",
        "question": "海外モデルのAndroid端末で修理受付時に特に確認すべき情報は？",
        "choices": [
            "正確な型番と販売地域",
            "端末の壁紙",
            "着信音の曲名",
            "ホーム画面の色"
        ],
        "correctIndex": 0,
        "explanation": "同じ名称でも型番により部品が異なります。",
        "repairName": "機種型番確認",
        "reward": 1800,
        "gaugeGain": 20
    },
    {
        "id": 28,
        "category": "Switch",
        "difficulty": 1,
        "symptom": "",
        "question": "Switch本体画面は真っ暗だがテレビには映る場合、優先して疑う箇所は？",
        "choices": [
            "本体画面、バックライト、画面接続部",
            "ゲームカードだけ",
            "Joy-Conの色",
            "テレビのリモコン"
        ],
        "correctIndex": 0,
        "explanation": "TV出力が正常なら本体側の表示系を確認します。",
        "repairName": "Switch画面診断",
        "reward": 1300,
        "gaugeGain": 20
    },
    {
        "id": 29,
        "category": "Switch",
        "difficulty": 2,
        "symptom": "",
        "question": "Switchの充電不良で確認すべき組み合わせは？",
        "choices": [
            "充電口、バッテリー、充電制御回路",
            "ゲームソフトのジャンル",
            "Joy-Conの色",
            "ユーザーアイコン"
        ],
        "correctIndex": 0,
        "explanation": "USB-C端子だけでなくバッテリーや充電回路も確認します。",
        "repairName": "Switch充電診断",
        "reward": 1600,
        "gaugeGain": 20
    },
    {
        "id": 30,
        "category": "Switch",
        "difficulty": 2,
        "symptom": "",
        "question": "microSDカードは読めるがゲームカードだけ読めない場合、優先して疑う部品は？",
        "choices": [
            "ゲームカードスロット",
            "microSDカードスロット",
            "左Joy-Con",
            "本体スタンド"
        ],
        "correctIndex": 0,
        "explanation": "ゲームカードとmicroSDは別の読み込み系統です。",
        "repairName": "カードスロット交換",
        "reward": 1500,
        "gaugeGain": 20
    },
    {
        "id": 31,
        "category": "Switch",
        "difficulty": 2,
        "symptom": "",
        "question": "microSDカードだけ認識しない場合、最初に確認するものは？",
        "choices": [
            "別の正常なmicroSDカードとスロット接続",
            "ゲームカードのラベル",
            "Joy-Conストラップ",
            "テレビの音量"
        ],
        "correctIndex": 0,
        "explanation": "カード側と本体側を切り分けます。",
        "repairName": "SDスロット診断",
        "reward": 1400,
        "gaugeGain": 20
    },
    {
        "id": 32,
        "category": "Switch",
        "difficulty": 1,
        "symptom": "",
        "question": "操作していないのにキャラクターが勝手に動く症状は？",
        "choices": [
            "Joy-Conスティックのドリフト",
            "液晶の焼き付き",
            "ゲームカードの汚れ",
            "スピーカー故障"
        ],
        "correctIndex": 0,
        "explanation": "スティックの摩耗や汚れで入力が勝手に入ることがあります。",
        "repairName": "スティック交換",
        "reward": 1100,
        "gaugeGain": 20
    },
    {
        "id": 33,
        "category": "Switch",
        "difficulty": 1,
        "symptom": "",
        "question": "冷却ファン異音を放置した場合に起こり得るものは？",
        "choices": [
            "本体の高温化や強制終了",
            "ストレージ容量の増加",
            "画面サイズの変化",
            "Joy-Conの充電速度向上"
        ],
        "correctIndex": 0,
        "explanation": "冷却不良で高温化や強制終了につながる場合があります。",
        "repairName": "冷却ファン交換",
        "reward": 1300,
        "gaugeGain": 20
    },
    {
        "id": 34,
        "category": "Switch",
        "difficulty": 2,
        "symptom": "",
        "question": "Switchが高温になりやすくファンは回っている場合、内部で確認すべきものは？",
        "choices": [
            "ホコリ詰まりと熱伝導材の状態",
            "ユーザー名",
            "ゲームのプレイ時間だけ",
            "Joy-Conのカラー"
        ],
        "correctIndex": 0,
        "explanation": "排気経路のホコリや熱伝導材の劣化を確認します。",
        "repairName": "内部清掃",
        "reward": 1500,
        "gaugeGain": 20
    },
    {
        "id": 35,
        "category": "Switch",
        "difficulty": 3,
        "symptom": "",
        "question": "SwitchのUSB-C端子が大きく曲がっている場合、修理時に注意すべきものは？",
        "choices": [
            "端子だけでなく基板パターンや周辺回路も確認する",
            "必ず画面交換だけで直る",
            "Joy-Conを充電すれば直る",
            "ゲームデータを消せば直る"
        ],
        "correctIndex": 0,
        "explanation": "基板パターン剥離や充電回路故障を伴う場合があります。",
        "repairName": "USB-C基板修理",
        "reward": 2200,
        "gaugeGain": 20
    },
    {
        "id": 36,
        "category": "Switch",
        "difficulty": 2,
        "symptom": "",
        "question": "有機EL画面の特徴として正しいものは？",
        "choices": [
            "各画素が発光し、黒の表現に優れる",
            "必ずバックライトだけで表示する",
            "液晶より必ず割れにくい",
            "タッチ機能を持たない"
        ],
        "correctIndex": 0,
        "explanation": "有機ELは各画素が発光し深い黒を表現できます。",
        "repairName": "有機EL画面交換",
        "reward": 1600,
        "gaugeGain": 20
    },
    {
        "id": 37,
        "category": "Switch",
        "difficulty": 2,
        "symptom": "",
        "question": "落下後ゲームカードを認識しない場合、分解前に行う確認は？",
        "choices": [
            "別の正常なゲームカードでも認識しないか確認する",
            "本体を強く振る",
            "端子へ大量の液体を入れる",
            "画面を強く押す"
        ],
        "correctIndex": 0,
        "explanation": "ゲームカード側と本体側を切り分けます。",
        "repairName": "カード読み込み診断",
        "reward": 1400,
        "gaugeGain": 20
    },
    {
        "id": 38,
        "category": "修理知識",
        "difficulty": 1,
        "symptom": "",
        "question": "分解作業前に最初に行うべきことは？",
        "choices": [
            "端末の状態確認とお客様への説明",
            "すぐにネジを外す",
            "データを勝手に確認する",
            "部品を先に捨てる"
        ],
        "correctIndex": 0,
        "explanation": "修理前の外観、動作、故障症状、免責事項を確認します。",
        "repairName": "受付確認",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 39,
        "category": "修理知識",
        "difficulty": 1,
        "symptom": "",
        "question": "内部作業前に優先して外すものは？",
        "choices": [
            "バッテリー接続",
            "本体のロゴ",
            "SIMカードの印字",
            "カメラアプリ"
        ],
        "correctIndex": 0,
        "explanation": "通電したまま作業するとショートの危険があります。",
        "repairName": "安全な分解",
        "reward": 1100,
        "gaugeGain": 20
    },
    {
        "id": 40,
        "category": "修理知識",
        "difficulty": 2,
        "symptom": "",
        "question": "静電気対策として適切なものは？",
        "choices": [
            "ESD対策された環境やリストストラップを使用する",
            "乾いた布で強くこする",
            "カーペット上で作業する",
            "静電気を発生させてから触る"
        ],
        "correctIndex": 0,
        "explanation": "静電気放電は精密部品を損傷する可能性があります。",
        "repairName": "ESD対策",
        "reward": 1400,
        "gaugeGain": 20
    },
    {
        "id": 41,
        "category": "修理知識",
        "difficulty": 2,
        "symptom": "",
        "question": "ネジ管理で重要なことは？",
        "choices": [
            "外した位置と長さを記録する",
            "すべて同じ場所にまとめる",
            "余ったネジは捨てる",
            "長いネジをどこにでも使う"
        ],
        "correctIndex": 0,
        "explanation": "誤ったネジで基板や画面を損傷する可能性があります。",
        "repairName": "ネジ管理",
        "reward": 1300,
        "gaugeGain": 20
    },
    {
        "id": 42,
        "category": "修理知識",
        "difficulty": 1,
        "symptom": "",
        "question": "返却前に行うべきことは？",
        "choices": [
            "修理箇所と基本動作の確認",
            "動作確認をせずに返す",
            "データを削除する",
            "ネジを数本外したまま返す"
        ],
        "correctIndex": 0,
        "explanation": "修理内容に応じた動作確認を行います。",
        "repairName": "修理後チェック",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 43,
        "category": "修理知識",
        "difficulty": 2,
        "symptom": "",
        "question": "新しい粘着テープを使う主な目的は？",
        "choices": [
            "画面や背面を固定し、隙間を減らす",
            "通信速度を上げる",
            "ストレージを増やす",
            "カメラ画質を上げる"
        ],
        "correctIndex": 0,
        "explanation": "部品固定や隙間軽減に役立ちます。",
        "repairName": "圧着作業",
        "reward": 1300,
        "gaugeGain": 20
    },
    {
        "id": 44,
        "category": "修理知識",
        "difficulty": 2,
        "symptom": "",
        "question": "修理後の防水性能について適切な案内は？",
        "choices": [
            "完全な防水性能は保証できないと説明する",
            "必ず新品時以上の防水になる",
            "水中で動作確認して渡す",
            "粘着を貼れば永久に防水になる"
        ],
        "correctIndex": 0,
        "explanation": "新品時と同等の防水性能は保証できません。",
        "repairName": "防水リスク説明",
        "reward": 1500,
        "gaugeGain": 20
    },
    {
        "id": 45,
        "category": "修理知識",
        "difficulty": 1,
        "symptom": "",
        "question": "データについて適切な案内は？",
        "choices": [
            "修理前にバックアップを推奨する",
            "修理店が必ず全データを保証する",
            "バックアップは絶対に不要",
            "お客様の許可なく初期化する"
        ],
        "correctIndex": 0,
        "explanation": "予期しないデータ消失に備えてバックアップを推奨します。",
        "repairName": "バックアップ案内",
        "reward": 1000,
        "gaugeGain": 20
    },
    {
        "id": 46,
        "category": "修理知識",
        "difficulty": 2,
        "symptom": "",
        "question": "部品交換で直るか確定できない端末の受付説明として適切なものは？",
        "choices": [
            "診断結果によって追加修理が必要な可能性を伝える",
            "必ず直ると断言する",
            "料金説明をしない",
            "故障内容を確認せず預かる"
        ],
        "correctIndex": 0,
        "explanation": "追加費用や預かり期間の可能性を説明します。",
        "repairName": "修理見積もり",
        "reward": 1400,
        "gaugeGain": 20
    },
    {
        "id": 47,
        "category": "修理知識",
        "difficulty": 3,
        "symptom": "",
        "question": "画面を完全に閉じる前に行うべきことは？",
        "choices": [
            "表示、タッチ、センサーなどを仮組みで確認する",
            "確認せず強く圧着する",
            "バッテリーを傷つける",
            "コネクターを斜めに押し込む"
        ],
        "correctIndex": 0,
        "explanation": "仮組みで初期不良や接続不良を確認します。",
        "repairName": "仮組みテスト",
        "reward": 1700,
        "gaugeGain": 20
    },
    {
        "id": 48,
        "category": "修理知識",
        "difficulty": 2,
        "symptom": "",
        "question": "コネクター接続時の正しい対応は？",
        "choices": [
            "位置を合わせ、無理な力をかけず接続する",
            "工具で強く叩く",
            "斜めのまま押し込む",
            "接点を削る"
        ],
        "correctIndex": 0,
        "explanation": "位置を合わせて無理な力をかけず接続します。",
        "repairName": "コネクター接続",
        "reward": 1300,
        "gaugeGain": 20
    },
    {
        "id": 49,
        "category": "修理知識",
        "difficulty": 3,
        "symptom": "",
        "question": "水没端末の内部に腐食がある場合、必要となる可能性が高い作業は？",
        "choices": [
            "内部洗浄と基板診断",
            "壁紙変更",
            "ケース交換だけ",
            "音量設定変更"
        ],
        "correctIndex": 0,
        "explanation": "洗浄や基板修理が必要になる場合があります。",
        "repairName": "水没基板診断",
        "reward": 2000,
        "gaugeGain": 20
    },
    {
        "id": 50,
        "category": "修理知識",
        "difficulty": 2,
        "symptom": "",
        "question": "返却時の接客として適切なものは？",
        "choices": [
            "修理内容、確認結果、注意点を説明する",
            "無言で端末を渡す",
            "修理箇所を説明しない",
            "確認せずに保証を断言する"
        ],
        "correctIndex": 0,
        "explanation": "修理内容、確認結果、保証範囲、注意事項を説明します。",
        "repairName": "修理完了案内",
        "reward": 1200,
        "gaugeGain": 20
    }
];

    let questionDeck = [];
    let usedQuestionIds = [];
    let lastQuestionId = null;

    function shuffleArray(array) {
        const shuffled = [...array];

        for (let i = shuffled.length - 1; i > 0; i -= 1) {
            const randomIndex = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[randomIndex]] =
                [shuffled[randomIndex], shuffled[i]];
        }

        return shuffled;
    }

    function cloneQuestion(question) {
        return {
            ...question,
            choices: [...question.choices]
        };
    }

    function shuffleQuestionChoices(question) {
        const cloned = cloneQuestion(question);
        const entries = cloned.choices.map((text, index) => ({
            text,
            correct: index === cloned.correctIndex
        }));

        const shuffled = shuffleArray(entries);

        cloned.choices = shuffled.map((entry) => entry.text);
        cloned.correctIndex = shuffled.findIndex((entry) => entry.correct);

        return cloned;
    }

    function createQuestionDeck(shuffleChoices = true) {
        let deck = shuffleArray(QUIZ_DATA);

        if (
            lastQuestionId !== null &&
            deck.length > 1 &&
            deck[0].id === lastQuestionId
        ) {
            [deck[0], deck[1]] = [deck[1], deck[0]];
        }

        questionDeck = deck.map((question) =>
            shuffleChoices
                ? shuffleQuestionChoices(question)
                : cloneQuestion(question)
        );

        usedQuestionIds = [];
        return questionDeck.map(cloneQuestion);
    }

    function resetQuestionDeck() {
        questionDeck = [];
        usedQuestionIds = [];
        lastQuestionId = null;
    }

    function findQuestionIndex(deck, category = null, difficulty = null) {
        return deck.findIndex((question) => {
            const categoryMatches =
                category === null || question.category === category;

            const difficultyMatches =
                difficulty === null || question.difficulty === difficulty;

            return categoryMatches && difficultyMatches;
        });
    }

    function getNextQuestion(options = {}) {
        const {
            category = null,
            difficulty = null,
            shuffleChoices = true
        } = options;

        if (questionDeck.length === 0) {
            createQuestionDeck(shuffleChoices);
        }

        let index = findQuestionIndex(
            questionDeck,
            category,
            difficulty
        );

        if (index === -1) {
            createQuestionDeck(shuffleChoices);
            index = findQuestionIndex(
                questionDeck,
                category,
                difficulty
            );
        }

        if (index === -1) {
            return null;
        }

        const selected = questionDeck.splice(index, 1)[0];
        usedQuestionIds.push(selected.id);
        lastQuestionId = selected.id;

        return cloneQuestion(selected);
    }

    function getQuestionById(questionId, shuffleChoices = false) {
        const question = QUIZ_DATA.find(
            (item) => item.id === Number(questionId)
        );

        if (!question) {
            return null;
        }

        return shuffleChoices
            ? shuffleQuestionChoices(question)
            : cloneQuestion(question);
    }

    function getQuestionsByCategory(category, shuffleChoices = false) {
        return QUIZ_DATA
            .filter((question) => question.category === category)
            .map((question) =>
                shuffleChoices
                    ? shuffleQuestionChoices(question)
                    : cloneQuestion(question)
            );
    }

    function getQuestionsByDifficulty(difficulty) {
        return QUIZ_DATA
            .filter((question) => question.difficulty === difficulty)
            .map(cloneQuestion);
    }

    function isCorrectAnswer(question, selectedIndex) {
        return Boolean(
            question &&
            Number(selectedIndex) === question.correctIndex
        );
    }

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

        const selected = Number(selectedIndex);
        const correct = isCorrectAnswer(question, selected);

        return {
            isCorrect: correct,
            selectedIndex: selected,
            correctIndex: question.correctIndex,
            correctAnswer: question.choices[question.correctIndex] || "",
            explanation: question.explanation,
            reward: correct ? question.reward : 0,
            gaugeGain: correct ? question.gaugeGain : 0
        };
    }

    function getCategoryCounts() {
        return QUIZ_DATA.reduce((counts, question) => {
            counts[question.category] =
                (counts[question.category] || 0) + 1;
            return counts;
        }, {});
    }

    function validateQuizData() {
        const errors = [];
        const ids = new Set();

        QUIZ_DATA.forEach((question, index) => {
            if (!Number.isInteger(question.id)) {
                errors.push(`問題${index + 1}: idが不正です。`);
            }

            if (ids.has(question.id)) {
                errors.push(`問題${question.id}: idが重複しています。`);
            }
            ids.add(question.id);

            if (!Object.values(QUIZ_CATEGORIES).includes(question.category)) {
                errors.push(`問題${question.id}: categoryが不正です。`);
            }

            if (!Array.isArray(question.choices) || question.choices.length !== 4) {
                errors.push(`問題${question.id}: 選択肢は4件必要です。`);
            }

            if (
                !Number.isInteger(question.correctIndex) ||
                question.correctIndex < 0 ||
                question.correctIndex > 3
            ) {
                errors.push(`問題${question.id}: correctIndexが不正です。`);
            }
        });

        if (QUIZ_DATA.length !== 50) {
            errors.push(`問題数が50問ではありません。現在${QUIZ_DATA.length}問です。`);
        }

        return {
            isValid: errors.length === 0,
            questionCount: QUIZ_DATA.length,
            categoryCounts: getCategoryCounts(),
            errors
        };
    }

    const validation = validateQuizData();

    if (!validation.isValid) {
        console.error(
            "Repair Legendの問題データにエラーがあります。",
            validation.errors
        );
    } else {
        console.log(
            `Repair Legend Quiz: ${validation.questionCount}問を読み込みました。`,
            validation.categoryCounts
        );
    }

    window.RepairLegendQuiz = Object.freeze({
        categories: QUIZ_CATEGORIES,
        difficulties: QUIZ_DIFFICULTIES,
        createQuestionDeck,
        resetQuestionDeck,
        getNextQuestion,
        getRandomQuestion: getNextQuestion,
        getQuestionById,
        getQuestionsByCategory,
        getQuestionsByDifficulty,
        getAllQuestions: () => QUIZ_DATA.map(cloneQuestion),
        getCategories: () => Object.values(QUIZ_CATEGORIES),
        getCategoryCounts,
        getTotalQuestionCount: () => QUIZ_DATA.length,
        getRemainingQuestionCount: () => questionDeck.length,
        getUsedQuestionIds: () => [...usedQuestionIds],
        isCorrectAnswer,
        checkAnswer,
        shuffleArray,
        shuffleQuestionChoices,
        validateQuizData
    });