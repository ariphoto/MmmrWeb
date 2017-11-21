// リストに新規行を追加する処理
function insertRow() {

    var btn_insert = document.getElementById('btn_insert'); // 新規追加ボタン
    var list_table = document.getElementById('list_table'); // テーブル

    btn_insert.classList.add('disabled'); // 新規追加ボタンを無効化する

    var row_num = list_table.rows[0].cells.length; // テーブルの項目数を取得
    var rows = list_table.insertRow(1); // 新規行を追加する

    // テーブルにセル追加
    for(var i = 0;i < row_num - 1;i++) {

        var td;

        switch (i){
            // 名前 テキストボックス
            case 1:
                td = rows.insertCell(-1); // セルを追加する
                var box = document.createElement('input');
                td.appendChild(box);
                break;
            // 追加 ボタン
            case row_num - 2:
                td = rows.insertCell(-1); // セルを追加する
                td.setAttribute('colspan','2'); // セル結合
                var btn = document.createElement('button');
                btn.classList.add('btn','btn-info','btn-original');
                var txt = document.createTextNode("追加");
                btn.appendChild(txt);
                td.appendChild(btn);
                break;
            default:
                td = rows.insertCell(-1); // セルを追加する
        }
    }
}