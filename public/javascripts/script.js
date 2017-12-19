// 新規追加ボタン(緑) リストに新規行を追加する処理
function insertRow() {
    let btn_insert = document.getElementById('btn_insert'); // 新規追加ボタン
    let list_table = document.getElementById('list_table'); // テーブル

    btn_insert.setAttribute('disabled','true'); // 新規追加ボタンを無効化する

    let col_num = list_table.rows[0].cells.length; // テーブルの項目数を取得
    let rows = list_table.insertRow(1); // 新規行を追加する
    rows.setAttribute('id','new_line');

    // テーブルにセル追加
    for(let i = 0;i < col_num;i++) {
        let td = rows.insertCell(-1); // セルを追加する
        switch (i){
            // 名前・備考 テキストボックス
            case 1:
            case 2:
                let box = document.createElement('input');
                box.classList.add('edit-input');
                td.appendChild(box);
                break;
            // 追加 ボタン
            case 3:
                var btn = document.createElement('button');
                btn.classList.add('btn','btn-info','btn-original');
                btn.setAttribute('onclick','location.href="javascript:insert_execute();"');
                var txt = document.createTextNode("追加");
                btn.appendChild(txt);
                td.appendChild(btn);
                break;
            // キャンセル ボタン
            case 4:
                var btn = document.createElement('button');
                btn.classList.add('btn','btn-default','btn-default');
                btn.setAttribute('onclick','location.href="javascript:insert_cancel();"');
                var txt = document.createTextNode("キャンセル");
                btn.appendChild(txt);
                td.appendChild(btn);

        }
    }
}

// 編集ボタン(オレンジ) 編集用テキストボックスを表示する
function edit_row(idNum, page){
    let row = document.getElementById('row' + idNum); // 編集ボタンを押した行オブジェクトを取得
    // 保育士一覧の場合、IDをポストして別ページに遷移する
    if(page == "stu"){
        let id = row.getElementsByTagName('input')[1].value; // 編集ボタンを押した行のstudentIdを取得
        execPost('edit', '/contents/student/edit', {'studentId': id});
    } else {
        let oldData = new Array(2); // 既存のデータを格納

        // 既存の内容を含むspanを隠し、入力テキストボックスを表示
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

        var td = row.getElementsByTagName('td')[3];
        var btn = td.getElementsByTagName('button')[0]; // 編集ボタンを取得
        btn.classList.add('hidden');
        var newButton = document.createElement('button'); // ボタンを定義
        newButton.classList.add('btn', 'btn-info', 'btn-original');
        newButton.setAttribute('onclick', 'location.href="javascript:edit_execute(' + idNum + ', \'' + page + '\')"');
        var txt = document.createTextNode("更新");
        newButton.appendChild(txt);
        td.appendChild(newButton);

        var td = row.getElementsByTagName('td')[4];
        var btn = td.getElementsByTagName('button')[0]; // 削除ボタンを取得
        btn.classList.add('hidden');
        var newButton = document.createElement('button'); // ボタンを定義
        newButton.classList.add('btn', 'btn-default', 'btn-original');
        newButton.setAttribute('onclick', 'location.href="javascript:edit_cancel(' + idNum + ');"');
        var txt = document.createTextNode("キャンセル");
        newButton.appendChild(txt);
        td.appendChild(newButton);
    }
}

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

    // 入力内容を取得
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
            // 保育士一覧
            execPost('ins', '/contents/party/list_post', {'name': data[0], 'remarks': data[1]});
        }
    }
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
    }

    if(window.confirm(`更新します\nよろしいですか？`)) {
        if(page == "tea"){
            execPost('upd', '/contents/teachers/list_post', {'teacherId': id, 'name' : data[0], 'remarks' : data[1]});
        } else {
            // 保育士一覧
            execPost('upd', '/contents/party/list_post', {'partyId': id, 'name': data[0], 'remarks': data[1]});
        }
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
        // 園児一覧・保育士一覧
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
        // 園児一覧・保育士一覧
        comment = "関連する登園 降園情報も削除されます。";
    }

    // 選択行を取得
    for(let i = 1;i < rows + 1;i++){
        let row = document.getElementById('row' + i);
        let check = row.getElementsByTagName('input')[0].checked;
        if(check) {
            id.push(row.getElementsByTagName('input')[1].value) // 選択行に含まれるID(UUID)を格納
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
    data.name = document.getElementById("name_box").value; // 絞り込み(名前)の値

    if(document.title == "園児一覧") {
        data.gender = $('#gender_box').val();
        data.partyName = $('#party_box').val();
        data.age = $('#age_box').val();
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
function execPost(order, link, data) { // order…実行する命令 link…送信先(node.js) data…送信するデータ
    // フォームの生成
    let form = document.createElement("form");
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

// ページ表示時、データをセットする(プルダウンの選択含む)
function init() {

    let gender = "";
    let party = "";
    let birthDay = "";
    let age = "";
    let pulldown_option;

    if (document.title == "園児編集" || (document.title == "園児一覧" && document.getElementById('age_h'))) {
        gender = document.getElementById("gender_h").value;
        party = document.getElementById("party_h").value;
        if (document.title == "園児編集") {
            birthDay = new Date(document.getElementById("birthDay_h").value);
        } else {
            // 園児リストの場合 かつ 絞り込みがあれば
            age = document.getElementById("age_h").value;
        }
    }

    if (document.title == "園児編集") {
        $('input[name=gender]').val([gender]);
        $("#party_box").val(party);
        $("#year").val(birthDay.getFullYear());
        $("#month").val(birthDay.getMonth() + 1);
        $("#day").val(birthDay.getDate());
    } else {
        // 園児一覧
        $("#gender_box").val(gender);
        $("#party_box").val(party);
        $("#age_box").val(age);
    }
}

// 園児編集画面 源氏の画像のチェックボックスの処理
function defPic(){
    let checkbox = document.getElementById("picCheck")
    let pictureSelect = document.getElementById("pictureSelect")
    if(checkbox.checked == false){
        pictureSelect.removeAttribute('disabled') // 新規追加ボタンを有効化する
    } else {
        pictureSelect.setAttribute('disabled',true); // 新規追加ボタンを無効化する
    }
}

// 画像が選択された場合
$(function() {
    $('#pictureSelect').on("change", function() {
        let studentPicture = document.getElementById("studentPicture");
        //studentPicture.setAttribute('src', )
    });
});

// 園児情報を取得・送信
function send(){
    let picture = 0;
    let formData = new FormData(document.getElementById('picture_form'));
    let checkbox = document.getElementById("picCheck")
    if(checkbox.checked == false){
        $.ajax({
            type: "post",
            async: false,
            url: "/contents/student/picture",
            // Ajaxがdataを整形しない指定
            processData: false,
            // contentTypeもfalseに指定
            contentType: false,
            // dataに FormDataを指定
            data: formData,
            success: function(res){
                pictureId = res;
                picture = 1;
            },
            error: function() {
                alert('error');
            }
        });
    } else {
        picture = 1;
    }

    if(picture){
        let data = []
        let checkbox = document.getElementById("picCheck");
        data.id = document.getElementById("id_h").value;
        if(checkbox.checked == false){
            data.picturePath = pictureId;
        } else {
            data.picturePath = document.getElementById("path_h").value
        }
        data.name = document.getElementById("name_box").value;
        data.phonetic = document.getElementById("phonetic_box").value;
        data.nickname = document.getElementById("nickname_box").value;
        var target = document.getElementById("year");
        var num = target.selectedIndex;
        let year = target.getElementsByTagName('option')[num].value;
        var target = document.getElementById("month");
        var num = target.selectedIndex;
        let month = target.getElementsByTagName('option')[num].value;
        var target = document.getElementById("day");
        var num = target.selectedIndex;
        let day = target.getElementsByTagName('option')[num].value;
        data.birthDay = new Date(year, month - 1, day).toISOString();
        let option = document.getElementById("genderTd").getElementsByTagName('input');
        for (let i = 0; i < option.length; i++) {
            if (option[i].checked == true) {
                data.gender = option[i].value;
                break;
            }
        }
        data.party = document.getElementById("party_box").value;
        execPost('upd', '/contents/student/list_post', data);
    }
}