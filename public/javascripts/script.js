// リストに新規行を追加する処理
function insertRow() {

    var btn_insert = document.getElementById('btn_insert'); // 新規追加ボタン
    var list_table = document.getElementById('list_table'); // テーブル

    btn_insert.setAttribute('disabled','true'); // 新規追加ボタンを無効化する

    var row_num = list_table.rows[0].cells.length; // テーブルの項目数を取得
    var rows = list_table.insertRow(1); // 新規行を追加する

    // テーブルにセル追加
    for(var i = 0;i < row_num;i++) {
        switch (i){
            // 名前 テキストボックス
            case 1:
            case 2:
                var td = rows.insertCell(-1); // セルを追加する
                var box = document.createElement('input');
                box.classList.add('edit-input');
                td.appendChild(box);
                break;
            // 追加 ボタン
            case 3:
                var td = rows.insertCell(-1); // セルを追加する
                var btn = document.createElement('button');
                btn.classList.add('btn','btn-info','btn-original');
                var txt = document.createTextNode("追加");
                btn.appendChild(txt);
                td.appendChild(btn);
                break;
            // キャンセル ボタン
            case 4:
                var td = rows.insertCell(-1); // セルを追加する
                var btn = document.createElement('button');
                btn.classList.add('btn','btn-default','btn-default');
                btn.setAttribute('onclick','location.href="javascript:insert_cancel();"');
                var txt = document.createTextNode("キャンセル");
                btn.appendChild(txt);
                td.appendChild(btn);
                break;
            default:
                td = rows.insertCell(-1); // セルを追加する
        }
    }
}

// 編集用テキストボックスを表示する
function edit_row(idNum){
    var row = document.getElementById('row' + idNum); //編集ボタンを押した行オブジェクトを取得
    var oldData = new Array(2); // 既存のデータを格納

    for(var i = 0; i < 2;i++){
        var td = row.getElementsByTagName('td')[i + 1];
        var span = td.getElementsByTagName('span')[0]; // td内のspan
        var input = document.createElement('input'); // テキストボックスを定義
        input.classList.add('edit-input');
        oldData[i] = span.innerText; // 既存のデータを格納
        span.classList.add('hidden'); // 既存のspanを隠す
        input.setAttribute('value',oldData[i]);
        td.appendChild(input);
    }

    var td = row.getElementsByTagName('td')[3];
    var btn = td.getElementsByTagName('button')[0]; // 編集ボタンを取得
    btn.classList.add('hidden');
    var newButton = document.createElement('button'); // ボタンを定義
    newButton.classList.add('btn','btn-info','btn-original');
    var txt =  document.createTextNode("更新");
    newButton.appendChild(txt);
    td.appendChild(newButton);

    var td = row.getElementsByTagName('td')[4];
    var btn = td.getElementsByTagName('button')[0]; // 削除ボタンを取得
    btn.classList.add('hidden');
    var newButton = document.createElement('button'); // ボタンを定義
    newButton.classList.add('btn','btn-default','btn-original');
    newButton.setAttribute('onclick','location.href="javascript:edit_cancel(' + idNum + ');"');
    var txt =  document.createTextNode("キャンセル");
    newButton.appendChild(txt);
    td.appendChild(newButton);
}

// 行編集 キャンセルボタンの処理
function edit_cancel(idNum){
    var row = document.getElementById('row' + idNum); //編集ボタンを押した行オブジェクトを取得

    for(var i = 0; i < 2;i++){
        var td = row.getElementsByTagName('td')[i + 1];
        var span = td.getElementsByTagName('span')[0]; // td内のspan
        var input = td.getElementsByTagName('input')[0]; // テキストボックスを定義
        td.removeChild(input);
        span.classList.remove('hidden'); // 既存のspanを戻す
    }

    var td = row.getElementsByTagName('td')[3];
    var btn = td.getElementsByTagName('button')[1]; // 更新ボタンを取得
    td.removeChild(btn);
    var btn = td.getElementsByTagName('button')[0]; // 編集ボタンを取得
    btn.classList.remove('hidden');

    var td = row.getElementsByTagName('td')[4];
    var btn = td.getElementsByTagName('button')[1]; // キャンセルボタンを取得
    td.removeChild(btn);
    var btn = td.getElementsByTagName('button')[0]; // 削除ボタンを取得
    btn.classList.remove('hidden');
}

// 行追加 キャンセルボタンの処理
function insert_cancel(){
    var btn_insert = document.getElementById('btn_insert'); // 新規追加ボタン
    var list_table = document.getElementById('list_table'); // テーブル

    btn_insert.removeAttribute('disabled'); // 新規追加ボタンを有効化する

    list_table.deleteRow(1); // 新規行を削除する
}