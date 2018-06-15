'use strict';

function loadCSV(targetFile) {
    var allData = [];

    var request = new XMLHttpRequest();
    request.open("get", targetFile, true);
    request.onloadstart = function () {
        console.log('Get started.')
        var csvData = request.responseText;

        var lines = csvData.split("\n");

        for (var i = 0; i < lines.length; i++) {
            var wordSet = lines[i].split(",");

            var wordData = {
                date: wordSet[0],
                swap: wordSet[1]
            };

            allData.push(wordData);
        }
        console.log(allData);
    }

}

loadCSV("sample.csv");



/**var ls = window.localStorage;
var AppName = "MemoAppVer.1";

function addMemo() {

    var v = $('newMemo').value;
    if (v == '' || v == null) {
        alert('メモが入力されていません。');
        return;
    }
    for (var i = 0; i < temp.length; i++) {
        if (v == temp[i]) {
            alert('それはもう発見済みです。');
            return;
        }
    }
    //変数tempへ文字列の代入 
    temp.unshift(v);
    save();
}

function save() {
    for (var i = 0; i < 10; i++) {
        if (ls[AppName + "dataId" + i]) {
            ls.removeItem(AppName + 'dataId' + i);
        }
    }

    var len = temp.length;

    for (var i = 0; i < len; i++) {
        ls[AppName + 'dataId' + i] = temp[i];
    }
    conversation();
    display();
}

function load() {
    for (var i = 0; i < 10; i++) {
        if (ls[AppName + 'dataId' + i]) {
            temp[i] = ls[AppName + 'dataId' + i];
        }
    }
    display();
}
*/
