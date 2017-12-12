// 新規追加ボタン(緑) リストに新規行を追加する処理
function insertRow() {
    var btn_insert = document.getElementById('btn_insert'); // 新規追加ボタン
    var list_table = document.getElementById('list_table'); // テーブル

    btn_insert.setAttribute('disabled','true'); // 新規追加ボタンを無効化する

    var col_num = list_table.rows[0].cells.length; // テーブルの項目数を取得
    var rows = list_table.insertRow(1); // 新規行を追加する
    rows.setAttribute('id','new_line');

    // テーブルにセル追加
    for(var i = 0;i < col_num;i++) {
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
                btn.setAttribute('onclick','location.href="javascript:insert_execute();"');
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

// 編集ボタン(オレンジ) 編集用テキストボックスを表示する
function edit_row(idNum, page){
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
    newButton.setAttribute('onclick','location.href="javascript:edit_execute(' + idNum + ', \'' + page + '\')"');
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

// 編集行 キャンセルボタン(グレー)
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

// 追加行 キャンセルボタン(グレー)
function insert_cancel(){
    var btn_insert = document.getElementById('btn_insert'); // 新規追加ボタン
    var list_table = document.getElementById('list_table'); // テーブル

    btn_insert.removeAttribute('disabled'); // 新規追加ボタンを有効化する

    list_table.deleteRow(1); // 新規行を削除する
}

// 追加行 追加ボタン(青)
function insert_execute() {
    var list_table = document.getElementById('list_table'); // テーブル
    var tbody = list_table.getElementsByTagName('tbody')[0];
    var new_line = document.getElementById('new_line');
    var col_num = list_table.rows[0].cells.length; // テーブルの項目数を取得
    var data = [];
    var page;
    if(document.title == "保育士一覧"){
        page = "tea";
    } else {
        page = "par";
    }

    for(var i = 0; i < 2;i++){
        var td = new_line.getElementsByTagName('td')[i + 1];
        var span = td.getElementsByTagName('span')[0]; // td内のspan
        var input = td.getElementsByTagName('input')[0]; // テキストボックスを定義
        data[i] = input.value;
    }

    if(window.confirm(`追加します\nよろしいですか？`)) {
        if (page == "tea") {
            execPost('ins', '/contents/teachers/list_post', {'name': data[0], 'remarks': data[1]});
        } else {
            execPost('ins', '/contents/party/list_post', {'name': data[0], 'remarks': data[1]});
        }
    }


    /*for (var i = 0; i < 2; i++) {
        var target = document.getElementsByClassName('edit-input')[i];
        values[i] = target.value;
    }

    btn_insert.removeAttribute('disabled'); // 新規追加ボタンを有効化する
    list_table.deleteRow(1); // 新規行を削除する
    var new_insert_row = tbody.insertRow(-1);
    var rows = list_table.rows.length - 1; // 仮データの件数
    new_insert_row.setAttribute('id', 'row' + rows);

    for (var i = 0; i < col_num; i++){
         var td = new_insert_row.insertCell(-1); // セルを追加する

        switch (i) {
            case 0:
                var input = document.createElement('input');
                input.setAttribute('type', 'checkbox');
                td.appendChild(input);
                break;
            case 1:
            case 2:
                var span = document.createElement('span');
                var txt = document.createTextNode(values[i - 1]);
                span.appendChild(txt);
                td.appendChild(span);
                break;
            case 3:
                var btn = document.createElement('button');
                btn.classList.add('btn', 'btn-warning', 'btn-original');
                btn.setAttribute('onclick', 'location.href="javascript:edit_row(' + rows + ');"');
                var txt = document.createTextNode("編集");
                btn.appendChild(txt);
                td.appendChild(btn);
                break;
            // 削除 ボタン
            default:
                var btn = document.createElement('button');
                btn.classList.add('btn', 'btn-danger', 'btn-default');
                btn.setAttribute('onclick', 'javascript:delete_row(' + rows + ');"');
                var txt = document.createTextNode("削除");
                btn.appendChild(txt);
                td.appendChild(btn);
        }
    }*/
}

// 編集行 更新ボタン(青)
function edit_execute(idNum, page){
    var row = document.getElementById('row' + idNum); //更新ボタンを押した行オブジェクトを取得
    var id = row.getElementsByTagName('input')[1].value;
    var data = [];

    for(var i = 0; i < 2;i++){
        var td = row.getElementsByTagName('td')[i + 1];
        var span = td.getElementsByTagName('span')[0]; // td内のspan
        var input = td.getElementsByTagName('input')[0]; // テキストボックスを定義
        data[i] = input.value
        // var txt = document.createTextNode(input.value);
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
*/
    }
}

// 一行 削除ボタン(赤)
function delete_row(idNum, page){
    var list_table = document.getElementById('list_table'); // テーブル
    var tbody = list_table.getElementsByTagName('tbody')[1];
    var del_row = document.getElementById('row' + idNum);
    var name = del_row.getElementsByTagName('span')[0].innerText;
    var id = del_row.getElementsByTagName('input')[1].value;
    var comment; // 表示する警告文

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
    var list_table = document.getElementById('list_table'); // テーブル
    var tbody = list_table.getElementsByTagName('tbody')[1];
    var rows = tbody.rows.length;
    var comment; // 表示する警告文
    var id = [];

    if(document.title == "クラス一覧"){
        comment = "このクラスに含まれる園児情報、\n登園 降園情報も削除されます。";
    } else {
        comment = "関連する登園 降園情報も削除されます。";
    }

    for(var i = 1;i < rows + 1;i++){
        var row = document.getElementById('row' + i);
        var check = row.getElementsByTagName('input')[0].checked;
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
    var data = {};
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
    var form = document.createElement("form");
    form.setAttribute("action", link);
    form.setAttribute("method", "post");
    form.style.display = "none";
    document.body.appendChild(form);
    // パラメタの設定
    if (data !== undefined) {
        // 実行する命令
        var input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', 'order');
        input.setAttribute('value', order);
        form.appendChild(input);

        for (var paramName in data) {
            var input = document.createElement('input');
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
function init(){
    if(document.title == "園児一覧"){
        var gender = document.getElementById("gender_h").value;
        var party = document.getElementById("party_h").value;
        var age = document.getElementById("age_h").value;
        var pulldown_option;
        switch(gender){
            case "man":
                gender = "男";
                break;
            case "woman":
                gender = "女";
                break;
            case "other":
                gender = "その他";
                break;
            default:
                gender = "性別";
        }
        if(party == ""){
            party = "組";
        }
        if(age == ""){
            age = "組";
        }
        pulldown_option = document.getElementById("gender_box").getElementsByTagName('option');
        for(var i = 0; i < pulldown_option.length;i++) {
            if (pulldown_option[i].value == gender) {
                pulldown_option[i].selected = true;
                break;
            }
        }
        pulldown_option = document.getElementById("party_box").getElementsByTagName('option');
        for(var i = 0; i < pulldown_option.length;i++) {
            if (pulldown_option[i].value == party) {
                pulldown_option[i].selected = true;
                break;
            }
        }
        pulldown_option = document.getElementById("age_box").getElementsByTagName('option');
        for(var i = 0; i < pulldown_option.length;i++) {
            if (pulldown_option[i].value == age) {
                pulldown_option[i].selected = true;
                break;
            }
        }
    }
}