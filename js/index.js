'use strict';

/*
//全体の流れ
function ProcessMapping() {

    //データ取得のための条件文

        //ls上にデータがあった場合（2回目以降の場合)
    if (ls[AppName]) {
        load();
        dataUpdate(); //日付、各ポジションのレートの更新
        totalMoneyUpdate(); //TM:total-money 総収支の反映（レートとスワップ）
        save(); //取得、更新したデータをローカルストレージに保存
        
        //現在の総収支の表示
        TMDisplay();

        //スワップ計算と表示（計算～表示/innnerHTML/まで）
        daySwapDisplay();
        weekSwapDisplay();
        monthSwapDisplay();

        //危険ラインのレートと残高の表示
        dangerLineDisplay();


    }else{  //初回アクセスの場合
        
        display_form(); //データ入力フォームを出力し、そのデータを取得する関数
        dataUpdate();
        saveFirst();　//saveFirst()内の最後で、display()を呼び出す。
    }
}
*/

var ls = window.localStorage;
var accessDate = new Date();
var AppName = 'ZarFX';

//データ格納用の変数
var dmmlot;
var clicklot;
var date;
var dmmSwapMoney;
var clickSwapMoney;
var dmmPosRate;
var clickPosRate;
var dmmTotalMoney;
var clickTotalMoney;
var dmmBalance;
var clickBalance;
var accessDate;
var dmmAccessRate;
var clickAccessRate;


//格納データ：DMMロット保持数、クリックロット保持数、日付
//DMMスワップ金額、クリックスワップ金額、スワップ合計金額(今までの）
var data = {
    dmmLotKey: 0,
    clickLotKey: 0,
    dmmPosRateKey: 0,
    clickPosRateKey: 0,
    dmmTotalMoneyKey: 0,
    clickTotalMoneyKey: 0,
    dmmBalanceKey: 0,
    clickBalanceKey: 0,
    accessDateKey: 0,
    dmmAccessRateKey: 0,
    clickAccessRateKey: 0
};

var dataLatest = {
    dmmLotKey: 0,
    clickLotKey: 0,
    dmmPosRateKey: 0,
    clickPosRateKey: 0,
    dmmTotalMoneyKey: 0,
    clickTotalMoneyKey: 0,
    dmmBalanceKey: 0,
    clickBalanceKey: 0,
    accessDateKey: 0,
    dmmAccessRateKey: 0,
    clickAccessRateKey: 0
};


//onloadで開始；localStorageのデータの有無でそれぞれのHTMLを代入する。
function display() {
    var code;
    $('content').innerHTML = '';
    $('form-area').innerHTML = '';

    //データ取得のための条件文
        //ls上にデータがあった場合（2回目以降の場合)
    if (ls[AppName]) {
        console.log('LocalStorage has some data.');
        load();
        //ここに計算処理

        //ここにHTMLの出力
        code = '<p>今日の収支は、 <span id=todaySwapId></span>円です。</p> <p>これまでの総収支は、 <span id=sumSwapId></span>円です。</p>';
        $('content').innerHTML = code;

    }
        //初回アクセスの場合、入力フォームを表示する。
    else {
        console.log('LocalStorage does not have any data.');

        code = '<form> <p>半角数字でご入力ください。</p> <p>DMMロット(通貨枚数）保持数： <input type="text" id="dmmlotId"> iClick365ロット(通貨枚数)保持数： <input type="text" id="clicklotId"> </p> <p>取引時のレ－トを入力してください。</p> <p>DMMレート： <input type="text" id="dmmRate"> iClick365レート： <input type="text" id="clickRate"> </p> <p>各社の口座残高（預託証拠金残高）</p> <p>DMMFX口座残高： <input type="text" id="dmmBalance"> iClick365口座残高： <input type="text" id="clickBalance"> </p> <p>損益合計金額（為替収支＋スワップ収支）を入力してください。</p> <p>DMM損益収支： <input type="text" id="dmmSum"> iClick365損益収支： <input type="text" id="clickSum"> </p> <button class="btn btn-lg btn-primary" onClick="addFormData()">送信</button></form>';
        $('form-area').innerHTML = code;
    }
}

//データの取得～保存まで
function addFormData(){
    console.log('addFormData has worked.');
    dmmlot = parseInt($("dmmlotId").value);
    clicklot = parseInt($("clicklotId").value);
    dmmPosRate = parseInt($("dmmRate").value);
    clickPosRate = parseInt($("clickRate").value);
    dmmBalance = parseInt($("dmmBalance").value);
    clickBalance = parseInt($("clickBalance").value);
    dmmTotalMoney = parseInt($("dmmSum").value);
    clickTotalMoney = parseInt($("clickSum").value);
    
    dataUpdate();
    saveBasicData();
}

//個人情報の修正、入力欄に登録したデータを出力した状態で表示する。
function editFormData(){
    console.log('editFormData is working.');
    $('content').innerHTML = '';
    var editCode;
    editCode = '<h3>編集フォーム</h3><form> <p>半角数字でご入力ください。</p> <p>DMMロット(通貨枚数）保持数： <input type="text" id="dmmlotId"> iClick365ロット(通貨枚数)保持数： <input type="text" id="clicklotId"> </p> <p>取引時のレ－トを入力してください。</p> <p>DMMレート： <input type="text" id="dmmRate"> iClick365レート： <input type="text" id="clickRate"> </p> <p>各社の口座残高（預託証拠金残高）</p> <p>DMMFX口座残高： <input type="text" id="dmmBalance"> iClick365口座残高： <input type="text" id="clickBalance"> </p> <p>損益合計金額（為替収支＋スワップ収支）を入力してください。</p> <p>DMM損益収支： <input type="text" id="dmmSum"> iClick365損益収支： <input type="text" id="clickSum"></p><button class="btn btn-lg btn-primary m-5 text-center" onClick="addFormData()">送信</button></form>';
    $('form-area').innerHTML = editCode;
    

    $("dmmlotId").value = dataLatest["dmmLotKey"];
    $("clicklotId").value = dataLatest["clickLotKey"];
    $("dmmRate").value = dataLatest["dmmPosRateKey"];
    $("clickRate").value = dataLatest["clickPosRateKey"];
    $("dmmBalance").value = dataLatest["dmmBalanceKey"];
    $("clickBalance").value = dataLatest["clickBalanceKey"];
    $("dmmSum").value = dataLatest["dmmTotalMoneyKey"];
    $("clickSum").value = dataLatest["clickTotalMoneyKey"];
}

//基礎情報の保存
//基礎情報：1.購入ロット数 2.購入レート 3.各社口座残高 4.各社損益合計金額
function saveBasicData() {
    data = {
        dmmLotKey: dmmlot,
        clickLotKey: clicklot,
        dmmPosRateKey: dmmPosRate,
        clickPosRateKey: clickPosRate,
        dmmTotalMoneyKey: dmmTotalMoney,
        clickTotalMoneyKey: clickTotalMoney,
        dmmBalanceKey: dmmBalance,
        clickBalanceKey: clickBalance,
        accessDateKey: accessDate,
        dmmAccessRateKey: dmmAccessRate,
        clickAccessRateKey: clickAccessRate
    };
    console.log('▼data▼');
    ls.setItem(AppName,JSON.stringify(data));
    
    display();
}

//2回目以降の保存
//@param:連想配列
function save(dataLatest){
    ls.setItem(AppName, JSON.stringify(dataLatest));
}


//アクセス時の日付・為替レートを更新
function dataUpdate(){
    console.log('dataUpdate function is worked.');
    date = accessDate;
    //現在のレートをcsvから読み込み、各社スプレッドをもとに算出
    dmmAccessRate = 8;
    clickAccessRate = 7;
}

//LocalStorageから変数dataLatestにデータを格納
function load(){
    dataLatest = JSON.parse(ls.getItem(AppName));
    console.log('▼dataLatest▼');
    console.log(dataLatest);
};

//データの削除
function clearData(){
    console.log('the clear function is working.')
    var ans = window.confirm('本当に削除しますか？');
    if(ans){
        console.log('get deleted.');
        ls.removeItem(AppName);
    }
    display();
}

function $(id) {
    return document.getElementById(id);
}






