// 新規追加ボタン(緑) リストに新規行を追加する処理
function insertRow() {
    const btn_insert = document.getElementById('btn_insert'); // 新規追加ボタン
    const list_table = document.getElementById('list_table'); // テーブル

    btn_insert.setAttribute('disabled','true'); // 新規追加ボタンを無効化する

    let col_num = list_table.rows[0].cells.length; // テーブルの項目数を取得
    let rows = list_table.insertRow(1); // 新規行を追加する
    rows.setAttribute('id','new_line');

    // テーブルにセル追加
    for(let i = 0;i < col_num;i++) {
        switch (i){
            // 名前 テキストボックス
            case 1:
            case 2:
                let td = rows.insertCell(-1); // セルを追加する
                let box = document.createElement('input');
                box.classList.add('edit-input');
                td.appendChild(box);
                break;
            // 追加 ボタン
            case 3:
                let td = rows.insertCell(-1); // セルを追加する
                let btn = document.createElement('button');
                btn.classList.add('btn','btn-info','btn-original');
                btn.setAttribute('onclick','location.href="javascript:insert_execute();"');
                let txt = document.createTextNode("追加");
                btn.appendChild(txt);
                td.appendChild(btn);
                break;
            // キャンセル ボタン
            case 4:
                let td = rows.insertCell(-1); // セルを追加する
                let btn = document.createElement('button');
                btn.classList.add('btn','btn-default','btn-default');
                btn.setAttribute('onclick','location.href="javascript:insert_cancel();"');
                let txt = document.createTextNode("キャンセル");
                btn.appendChild(txt);
                td.appendChild(btn);
                break;
            default:
                td = rows.insertCell(-1); // セルを追加する
        }
    }
}

// 編集ボタン(オレンジ) 編集用テキストボックスを表示する
function edit_row(idNum, page){
    let row = document.getElementById('row' + idNum); //編集ボタンを押した行オブジェクトを取得
    if(page == "stu"){
        let id = row.getElementsByTagName('input')[1].value; // 編集ボタンを押した行のstudentIdを取得
        execPost('edit', '/contents/student/edit', {'studentId': id});
    } else {
        let oldData = new Array(2); // 既存のデータを格納

        for (let i = 0; i < 2; i++) {
            let td = row.getElementsByTagName('td')[i + 1];
            let span = td.getElementsByTagName('span')[0]; // td内のspan
            let input = document.createElement('input'); // テキストボックスを定義
            input.classList.add('edit-input');
            oldData[i] = span.innerText; // 既存のデータを格納
            span.classList.add('hidden'); // 既存のspanを隠す
            input.setAttribute('value', oldData[i]);
            td.appendChild(input);
        }

        let td = row.getElementsByTagName('td')[3];
        let btn = td.getElementsByTagName('button')[0]; // 編集ボタンを取得
        btn.classList.add('hidden');
        let newButton = document.createElement('button'); // ボタンを定義
        newButton.classList.add('btn', 'btn-info', 'btn-original');
        newButton.setAttribute('onclick', 'location.href="javascript:edit_execute(' + idNum + ', \'' + page + '\')"');
        let txt = document.createTextNode("更新");
        newButton.appendChild(txt);
        td.appendChild(newButton);

        let td = row.getElementsByTagName('td')[4];
        let btn = td.getElementsByTagName('button')[0]; // 削除ボタンを取得
        btn.classList.add('hidden');
        let newButton = document.createElement('button'); // ボタンを定義
        newButton.classList.add('btn', 'btn-default', 'btn-original');
        newButton.setAttribute('onclick', 'location.href="javascript:edit_cancel(' + idNum + ');"');
        let txt = document.createTextNode("キャンセル");
        newButton.appendChild(txt);
        td.appendChild(newButton);
    }
}

// 編集行 キャンセルボタン(グレー)
function edit_cancel(idNum){
    let row = document.getElementById('row' + idNum); //編集ボタンを押した行オブジェクトを取得

    for(let i = 0; i < 2;i++){
        let td = row.getElementsByTagName('td')[i + 1];
        let span = td.getElementsByTagName('span')[0]; // td内のspan
        let input = td.getElementsByTagName('input')[0]; // テキストボックスを定義
        td.removeChild(input);
        span.classList.remove('hidden'); // 既存のspanを戻す
    }

    let td = row.getElementsByTagName('td')[3];
    let btn = td.getElementsByTagName('button')[1]; // 更新ボタンを取得
    td.removeChild(btn);
    let btn = td.getElementsByTagName('button')[0]; // 編集ボタンを取得
    btn.classList.remove('hidden');

    let td = row.getElementsByTagName('td')[4];
    let btn = td.getElementsByTagName('button')[1]; // キャンセルボタンを取得
    td.removeChild(btn);
    let btn = td.getElementsByTagName('button')[0]; // 削除ボタンを取得
    btn.classList.remove('hidden');
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
    if(document.title == "保育士一覧"){
        page = "tea";
    } else {
        page = "par";
    }

    for(let i = 0; i < 2;i++){
        let td = new_line.getElementsByTagName('td')[i + 1];
        let span = td.getElementsByTagName('span')[0]; // td内のspan
        let input = td.getElementsByTagName('input')[0]; // テキストボックスを定義
        data[i] = input.value;
    }

    if(window.confirm(`追加します\nよろしいですか？`)) {
        if (page == "tea") {
            execPost('ins', '/contents/teachers/list_post', {'name': data[0], 'remarks': data[1]});
        } else {
            execPost('ins', '/contents/party/list_post', {'name': data[0], 'remarks': data[1]});
        }
    }


    /*for (let i = 0; i < 2; i++) {
        let target = document.getElementsByClassName('edit-input')[i];
        values[i] = target.value;
    }

    btn_insert.removeAttribute('disabled'); // 新規追加ボタンを有効化する
    list_table.deleteRow(1); // 新規行を削除する
    let new_insert_row = tbody.insertRow(-1);
    let rows = list_table.rows.length - 1; // 仮データの件数
    new_insert_row.setAttribute('id', 'row' + rows);

    for (let i = 0; i < col_num; i++){
         let td = new_insert_row.insertCell(-1); // セルを追加する

        switch (i) {
            case 0:
                let input = document.createElement('input');
                input.setAttribute('type', 'checkbox');
                td.appendChild(input);
                break;
            case 1:
            case 2:
                let span = document.createElement('span');
                let txt = document.createTextNode(values[i - 1]);
                span.appendChild(txt);
                td.appendChild(span);
                break;
            case 3:
                let btn = document.createElement('button');
                btn.classList.add('btn', 'btn-warning', 'btn-original');
                btn.setAttribute('onclick', 'location.href="javascript:edit_row(' + rows + ');"');
                let txt = document.createTextNode("編集");
                btn.appendChild(txt);
                td.appendChild(btn);
                break;
            // 削除 ボタン
            default:
                let btn = document.createElement('button');
                btn.classList.add('btn', 'btn-danger', 'btn-default');
                btn.setAttribute('onclick', 'javascript:delete_row(' + rows + ');"');
                let txt = document.createTextNode("削除");
                btn.appendChild(txt);
                td.appendChild(btn);
        }
    }*/
}

// 編集行 更新ボタン(青)
function edit_execute(idNum, page){
    let row = document.getElementById('row' + idNum); //更新ボタンを押した行オブジェクトを取得
    let id = row.getElementsByTagName('input')[1].value;
    let data = [];

    for(let i = 0; i < 2;i++){
        let td = row.getElementsByTagName('td')[i + 1];
        let span = td.getElementsByTagName('span')[0]; // td内のspan
        let input = td.getElementsByTagName('input')[0]; // テキストボックスを定義
        data[i] = input.value
        // let txt = document.createTextNode(input.value);
        // td.removeChild(input);
        // span.classList.remove('hidden'); // 既存のspanを戻す
        // span.innerText = "";
        // span.appendChild(txt);
    }

    if(window.confirm(`更新します\nよろしいですか？`)) {
        if(page == "tea"){
            execPost('upd', '/contents/teachers/list_post', {'teacherId': id, 'name' : data[0], 'remarks' : data[1]});
        } else {
            execPost('upd', '/contents/party/list_post', {'partyId': id, 'name': data[0], 'remarks': data[1]});
        }
/*
        let td = row.getElementsByTagName('td')[3];
        let btn = td.getElementsByTagName('button')[1]; // 更新ボタンを取得
        td.removeChild(btn);
        let btn = td.getElementsByTagName('button')[0]; // 編集ボタンを取得
        btn.classList.remove('hidden');

        let td = row.getElementsByTagName('td')[4];
        let btn = td.getElementsByTagName('button')[1]; // キャンセルボタンを取得
        td.removeChild(btn);
        let btn = td.getElementsByTagName('button')[0]; // 削除ボタンを取得
        btn.classList.remove('hidden');
*/
    }
}

// 一行 削除ボタン(赤)
function delete_row(idNum, page){
    let list_table = document.getElementById('list_table'); // テーブル
    let tbody = list_table.getElementsByTagName('tbody')[1];
    let del_row = document.getElementById('row' + idNum);
    let name = del_row.getElementsByTagName('span')[0].innerText;
    let id = del_row.getElementsByTagName('input')[1].value;
    let comment; // 表示する警告文

    if(document.title == "クラス一覧"){
        comment = "このクラスに含まれる園児情報、\n登園 降園情報も削除されます。";
    } else {
        comment = "関連する登園 降園情報も削除されます。";
    }

    if(window.confirm(`${name} を削除します\nよろしいですか？\n\n${comment}`)) {
        if(page == "stu"){
            execPost('del', '/contents/student/list_post', {'studentId': id});
        } else if(page == "tea"){
            execPost('del', '/contents/teachers/list_post', {'teacherId': id});
        } else {
            execPost('del', '/contents/party/list_post', {'partyId': id});
        }
        //tbody.removeChild(del_row); // 新規行を削除する
    }

}

// 複数行 削除ボタン(赤)
function delete_multi(){
    let list_table = document.getElementById('list_table'); // テーブル
    let tbody = list_table.getElementsByTagName('tbody')[1];
    let rows = tbody.rows.length;
    let comment; // 表示する警告文
    let id = [];

    if(document.title == "クラス一覧"){
        comment = "このクラスに含まれる園児情報、\n登園 降園情報も削除されます。";
    } else {
        comment = "関連する登園 降園情報も削除されます。";
    }

    for(let i = 1;i < rows + 1;i++){
        let row = document.getElementById('row' + i);
        let check = row.getElementsByTagName('input')[0].checked;
        if(check) {
            id.push(row.getElementsByTagName('input')[1].value)
        }

    }
    if(window.confirm(`選択した ${id.length} 項目を削除します\nよろしいですか？\n\n${comment}`)) {
        if(document.title == "園児一覧"){
            execPost('del', '/contents/student/list_post', {'studentId': id});
        } else if(document.title == "保育士一覧"){
            execPost('del', '/contents/teachers/list_post', {'teacherId': id});
        } else {
            execPost('del', '/contents/party/list_post', {'partyId': id});
        }
    }

}

// 絞り込み実行ボタン(青)
function filter(){
    let data = {};
    data.name = document.getElementById("name_box").value;

    if(document.title == "園児一覧") {
        switch (document.getElementById("gender_box").value) {
            case "男":
                data.gender = "man";
                break;
            case "女":
                data.gender = "woman";
                break;
            case "その他":
                data.gender = "other";
                break;
            default:
                data.gender = "";
        }
        if (document.getElementById("party_box").value != "組") {
            data.partyName = document.getElementById("party_box").value;
        } else {
            data.partyName = "";
        }

        if (document.getElementById("age_box").value != "年齢") {
            data.age = document.getElementById("age_box").value;
        } else {
            data.age = "";
        }
    }

    if(document.title == "園児一覧"){
        execPost('fil', '/contents/student/list', data);
    } else if(document.title == "保育士一覧"){
        execPost('fil', '/contents/teachers/list', data);
    } else {
        execPost('fil', '/contents/party/list', data);
    }
}

// すべての処理をポストする処理
function execPost(order, link, data) {
    // フォームの生成
    let form = document.createElement("form");
    form.setAttribute("action", link);
    form.setAttribute("method", "post");
    form.style.display = "none";
    document.body.appendChild(form);
    // パラメタの設定
    if (data !== undefined) {
        // 実行する命令
        let input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', 'order');
        input.setAttribute('value', order);
        form.appendChild(input);

        for (let paramName in data) {
            let input = document.createElement('input');
            input.setAttribute('type', 'hidden');
            input.setAttribute('name', paramName);
            input.setAttribute('value', data[paramName]);
            form.appendChild(input);
        }
    }
    // submit
    form.submit();
}

// リストページ表示時処理
function init() {
    var gender = document.getElementById("gender_h").value;
    var party = document.getElementById("party_h").value;
    if (document.title == "園児編集") {
        var birthDay = new Date(document.getElementById("birthDay_h").value);
    } else {
        var age = document.getElementById("age_h").value;
    }
    var pulldown_option;
    if (party == "") {
        party = "組";
    }
    if (age == "") {
        age = "組";
    }
    if (document.title == "園児編集") {
        pulldown_option = document.getElementById("genderTd").getElementsByTagName('input');
        for (var i = 0; i < pulldown_option.length; i++) {
            if (pulldown_option[i].value == gender) {
                pulldown_option[i].checked = true;
                break;
            }
        }
        pulldown_option = document.getElementById("party_box").getElementsByTagName('option');
        for (var i = 0; i < pulldown_option.length; i++) {
            if (pulldown_option[i].value == party) {
                pulldown_option[i].selected = true;
                break;
            }
        }
        pulldown_option = document.getElementById("year").getElementsByTagName('option');
        for(var i = 0; i < pulldown_option.length;i++) {
            if (pulldown_option[i].value == birthDay.getFullYear()) {
                pulldown_option[i].selected = true;
                break;
            }
        }
        pulldown_option = document.getElementById("month").getElementsByTagName('option');
        for(var i = 0; i < pulldown_option.length;i++) {
            if (pulldown_option[i].value == birthDay.getMonth() + 1) {
                pulldown_option[i].selected = true;
                break;
            }
        }
        pulldown_option = document.getElementById("day").getElementsByTagName('option');
        for(var i = 0; i < pulldown_option.length;i++) {
            if (pulldown_option[i].value == birthDay.getDate()) {
                pulldown_option[i].selected = true;
                break;
            }
        }
    } else {
        pulldown_option = document.getElementById("gender_box").getElementsByTagName('option');
        for (var i = 0; i < pulldown_option.length; i++) {
            if (pulldown_option[i].value == gender) {
                pulldown_option[i].selected = true;
                break;
            }
        }
        pulldown_option = document.getElementById("party_box").getElementsByTagName('option');
        for (var i = 0; i < pulldown_option.length; i++) {
            if (pulldown_option[i].value == party) {
                pulldown_option[i].selected = true;
                break;
            }
        }
        pulldown_option = document.getElementById("age_box").getElementsByTagName('option');
        for (var i = 0; i < pulldown_option.length; i++) {
            if (pulldown_option[i].value == age) {
                pulldown_option[i].selected = true;
                break;
            }
        }
    }
}

// 園児編集画面 源氏の画像のチェックボックスの処理
function defPic(){
    var checkbox = document.getElementById("picCheck")
    var pictureSelect = document.getElementById("pictureSelect")
    if(checkbox.checked == false){
        pictureSelect.removeAttribute('disabled') // 新規追加ボタンを有効化する
    } else {
        pictureSelect.setAttribute('disabled',true); // 新規追加ボタンを無効化する
    }
}

$(function() {
    $('#pictureSelect').on("change", function() {
        var studentPicture = document.getElementById("studentPicture");
        studentPicture.setAttribute('src', )
    });
});

function send(){
    var data = []
    var checkbox = document.getElementById("picCheck");
    data.id = document.getElementById("id_h").value;
    if(checkbox.checked == false){
        data.picturePath = document.getElementById("pictureSelect").value
    } else {
        data.picturePath = document.getElementById("path_h").value
    }
    data.name = document.getElementById("name_box").value;
    data.phonetic = document.getElementById("phonetic_box").value;
    data.nickname = document.getElementById("nickname_box").value;
    var target = document.getElementById("year");
    var num = target.selectedIndex;
    var year = target.getElementsByTagName('option')[num].value;
    var target = document.getElementById("month");
    var num = target.selectedIndex;
    var month = target.getElementsByTagName('option')[num + 1].value;
    var target = document.getElementById("day");
    var num = target.selectedIndex;
    var day = target.getElementsByTagName('option')[num].value;
    var inputDate = new Date(year, month, day);
    data.birthDay = inputDate;
    var option = document.getElementById("genderTd").getElementsByTagName('input');
    for (var i = 0; i < option.length; i++) {
        if (option[i].checked == true) {
            data.gender = option[i].value;
            break;
        }
    }
    data.party = document.getElementById("party_box").value;
    execPost('upd', '/contents/student/list_post', data);
}