// リストに新規行を追加する処理
function insertRow() {

    var btn_insert = document.getElementById('btn_insert'); // 新規追加ボタン
    var list_table = document.getElementById('list_table'); // テーブル

    btn_insert.classList.add('disabled'); // 新規追加ボタンを無効化する

    var rows = list_table.insertRow(-1);
}
