// 編集行 キャンセルボタン(グレー)
function edit_cancel(idNum){
    let row = document.getElementById('row' + idNum); //編集ボタンを押した行オブジェクトを取得

    // 入力テキストボックスを削除し、既存のspanを戻す
    for(let i = 0; i < 2;i++){
        let td = row.getElementsByTagName('td')[i + 1];
        let span = td.getElementsByTagName('span')[0]; // td内のspan
        let input = td.getElementsByTagName('input')[0]; // テキストボックスを定義
        td.removeChild(input);
        span.classList.remove('hidden'); // 既存のspanを戻す
    }

    let tdEditCancel1 = row.getElementsByTagName('td')[3];
    let btnCancel_update = tdEditCancel1.getElementsByTagName('button')[1]; // 更新ボタンを取得
    tdEditCancel1.removeChild(btnCancel_update);
    let btnCancel_edit = tdEditCancel1.getElementsByTagName('button')[0]; // 編集ボタンを取得
    btnCancel_edit.classList.remove('hidden');

    let tdEditCancel2 = row.getElementsByTagName('td')[4];
    let btnCancel_cancel = tdEditCancel2.getElementsByTagName('button')[1]; // キャンセルボタンを取得
    tdEditCancel2.removeChild(btnCancel_cancel);
    let btnCancel_delete = tdEditCancel2.getElementsByTagName('button')[0]; // 削除ボタンを取得
    btnCancel_delete.classList.remove('hidden');
}

// 追加行 キャンセルボタン(グレー)
function insert_cancel(){
    let btn_insert = document.getElementById('btn_insert'); // 新規追加ボタン
    let list_table = document.getElementById('list_table'); // テーブル

    btn_insert.removeAttribute('disabled'); // 新規追加ボタンを有効化する

    list_table.deleteRow(1); // 新規行を削除する
}

// 追加行 追加ボタン(青)
function insert_execute() {
    let list_table = document.getElementById('list_table'); // テーブル
    let tbody = list_table.getElementsByTagName('tbody')[0];
    let new_line = document.getElementById('new_line');
    let col_num = list_table.rows[0].cells.length; // テーブルの項目数を取得
    let data = [];
    let page;
    if(document.title === "保育士一覧"){
        page = "tea";
    } else {
        page = "par";
    }

    // 入力内容を取得
    for(let i = 0; i < 2;i++){
        let td = new_line.getElementsByTagName('td')[i + 1];
        let span = td.getElementsByTagName('span')[0]; // td内のspan
        let input = td.getElementsByTagName('input')[0]; // テキストボックスを定義
        data[i] = input.value;
    }

    if(window.confirm(`追加します\nよろしいですか？`)) {
        if (page  ==="tea") {
            execPost('ins', '/contents/teachers/list_post', {'name': data[0], 'remarks': data[1]});
        } else {
            // 保育士一覧
            execPost('ins', '/contents/party/list_post', {'name': data[0], 'remarks': data[1]});
        }
    }
}

// 編集行 更新ボタン(青)
function edit_execute(idNum, page){
    let row = document.getElementById('row' + idNum); //更新ボタンを押した行オブジェクトを取得
    let editId = row.getElementsByTagName('input')[1].value;
    let data = [];

    for(let i = 0; i < 2;i++){
        let td = row.getElementsByTagName('td')[i + 1];
        let span = td.getElementsByTagName('span')[0]; // td内のspan
        let input = td.getElementsByTagName('input')[0]; // テキストボックスを定義
        data[i] = input.value
    }

    if(window.confirm(`更新します\nよろしいですか？`)) {
        if(page === "tea"){
            execPost('upd', '/contents/teachers/list_post', {'teacherId': editId, 'name' : data[0], 'remarks' : data[1]});
        } else {
            // 保育士一覧
            execPost('upd', '/contents/party/list_post', {'partyId': editId, 'name': data[0], 'remarks': data[1]});
        }
    }
}