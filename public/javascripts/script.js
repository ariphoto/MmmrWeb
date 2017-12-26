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
                let btnInsert = document.createElement('button');
                btnInsert.classList.add('btn','btn-info','btn-original');
                btnInsert.setAttribute('onclick','location.href="javascript:insert_execute();"');
                let txtInsert = document.createTextNode("追加");
                btnInsert.appendChild(txtInsert);
                td.appendChild(btnInsert);
                break;
            // キャンセル ボタン
            case 4:
                let btnCancel = document.createElement('button');
                btnCancel.classList.add('btn','btn-default','btn-default');
                btnCancel.setAttribute('onclick','location.href="javascript:insert_cancel();"');
                let txtCancel = document.createTextNode("キャンセル");
                btnCancel.appendChild(txtCancel);
                td.appendChild(btnCancel);

        }
    }
}

// 編集ボタン(オレンジ) 編集用テキストボックスを表示する
function edit_row(idNum, page){
    let row = document.getElementById('row' + idNum); // 編集ボタンを押した行オブジェクトを取得
    // 保育士一覧の場合、IDをポストして別ページに遷移する
    if(page === "stu"){
        let studentEditId = row.getElementsByTagName('input')[1].value; // 編集ボタンを押した行のstudentIdを取得
        execPost('edit', '/contents/student/edit', {'studentId': studentEditId});
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

        let tdBtn1 = row.getElementsByTagName('td')[3];
        let btn1 = tdBtn1.getElementsByTagName('button')[0]; // 編集ボタンを取得
        btn1.classList.add('hidden');
        let newButton1 = document.createElement('button'); // ボタンを定義
        newButton1.classList.add('btn', 'btn-info', 'btn-original');
        newButton1.setAttribute('onclick', 'location.href="javascript:edit_execute(' + idNum + ', \'' + page + '\')"');
        let newTxt1 = document.createTextNode("更新");
        newButton1.appendChild(newTxt1);
        tdBtn1.appendChild(newButton1);

        let tdBtn2 = row.getElementsByTagName('td')[4];
        let btn2 = tdBtn2.getElementsByTagName('button')[0]; // 削除ボタンを取得
        btn2.classList.add('hidden');
        let newButton2 = document.createElement('button'); // ボタンを定義
        newButton2.classList.add('btn', 'btn-default', 'btn-original');
        newButton2.setAttribute('onclick', 'location.href="javascript:edit_cancel(' + idNum + ');"');
        let newTxt2 = document.createTextNode("キャンセル");
        newButton2.appendChild(newTxt2);
        tdBtn2.appendChild(newButton2);
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

// 一行 削除ボタン(赤)
function delete_row(idNum, page){
    let list_table = document.getElementById('list_table'); // テーブル
    let tbody = list_table.getElementsByTagName('tbody')[1];
    let del_row = document.getElementById('row' + idNum);
    let name = del_row.getElementsByTagName('span')[0].innerText;
    let deleteId = del_row.getElementsByTagName('input')[1].value;
    let comment; // 表示する警告文

    if(document.title === "クラス一覧"){
        comment = "このクラスに含まれる園児情報、\n登園 降園情報も削除されます。";
    } else {
        // 園児一覧・保育士一覧
        comment = "関連する登園 降園情報も削除されます。";
    }

    if(window.confirm(`${name} を削除します\nよろしいですか？\n\n${comment}`)) {
        if(page === "stu"){
            execPost('del', '/contents/student/list_post', {'studentId': deleteId});
        } else if(page === "tea"){
            execPost('del', '/contents/teachers/list_post', {'teacherId': deleteId});
        } else {
            execPost('del', '/contents/party/list_post', {'partyId': deleteId});
        }
    }
}

// 複数行 削除ボタン(赤)
function delete_multi(){
    let list_table = document.getElementById('list_table'); // テーブル
    let tbody = list_table.getElementsByTagName('tbody')[1];
    let rows = tbody.rows.length;
    let comment; // 表示する警告文
    let deleteIds = [];

    if(document.title === "クラス一覧"){
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
            deleteIds.push(row.getElementsByTagName('input')[1].value) // 選択行に含まれるID(UUID)を格納
        }
    }

    if(window.confirm(`選択した ${deleteIds.length} 項目を削除します\nよろしいですか？\n\n${comment}`)) {
        if(document.title === "園児一覧"){
            execPost('del', '/contents/student/list_post', {'studentId': deleteIds});
        } else if(document.title === "保育士一覧"){
            execPost('del', '/contents/teachers/list_post', {'teacherId': deleteIds});
        } else {
            execPost('del', '/contents/party/list_post', {'partyId': deleteIds});
        }
    }
}

// 絞り込み実行ボタン(青)
function filter(){
    let filterData = {};
    filterData.name = document.getElementById("name_box").value; // 絞り込み(名前)の値

    if(document.title === "園児一覧") {
        filterData.gender = $('#gender_box').val();
        filterData.partyName = $('#party_box').val();
        filterData.age = $('#age_box').val();
    }

    if(document.title === "園児一覧"){
        execPost('fil', '/contents/student/list', filterData);
    } else if(document.title === "保育士一覧"){
        execPost('fil', '/contents/teachers/list', filterData);
    } else {
        execPost('fil', '/contents/party/list', filterData);
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
        let inputAttr = document.createElement('input');
        inputAttr.setAttribute('type', 'hidden');
        inputAttr.setAttribute('name', 'order');
        inputAttr.setAttribute('value', order);
        form.appendChild(inputAttr);

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

    if (document.title === "園児編集" || (document.title === "園児一覧" && document.getElementById('age_h'))) {
        gender = document.getElementById("gender_h").value;
        party = document.getElementById("party_h").value;
        if (document.title === "園児編集") {
            birthDay = new Date(document.getElementById("birthDay_h").value);
            document.getElementById('pictureSelect').setAttribute('disabled', true);
        } else {
            // 園児リストの場合 かつ 絞り込みがあれば
            age = document.getElementById("age_h").value;
        }
    }

    if (document.title === "園児編集") {
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
    if(checkbox.checked === false){
        pictureSelect.removeAttribute('disabled') // 新規追加ボタンを有効化する
    } else {
        pictureSelect.setAttribute('disabled',true); // 新規追加ボタンを無効化する
    }
}

// 画像が選択された場合
$(function() {
    $('#pictureSelect').on("change", function(e) {
        let file = e.target.files[0],
            reader = new FileReader(),
            $preview = $("#preview");
        t = this;

        // 画像ファイル以外の場合は何もしない
        if(file.type.indexOf("image") < 0){
            return false;
        }

        // ファイル読み込みが完了した際のイベント登録
        reader.onload = (function(file) {
            return function(e) {
                //既存のプレビューを削除
                $preview.empty();
                // .prevewの領域の中にロードした画像を表示するimageタグを追加
                $preview.append($('<img>').attr({
                    id: 'studentPicture',
                    class: 'uploaded thumb',
                    src: e.target.result
                }));
            };
        })(file);

        reader.readAsDataURL(file);
    });
});

// 園児情報を取得・送信
function send(){
    let msg = "更新";
    if(document.title === "園児追加"){
        msg = "追加";
    }
    if(window.confirm(`${msg}します\nよろしいですか？`)) {
        let formData = new FormData(document.getElementById('picture_form'));
        let checkbox = document.getElementById("picCheck")
        // 画像を既存のものから変更する場合、新規追加の場合
        if( document.title === "園児追加" || checkbox.checked === false){
            $.ajax({
                type: "post",
                async: false,
                url: "/contents/student/picture",
                // Ajaxがdataを整形しない指定
                processData: false,
                // contentTypeもfalseに指定
                contentType: false,
                // dataに FormDataを指定
                data: formData
            });
        }

        let data = []
        data.id = document.getElementById("id_h").value;
        data.name = document.getElementById("name_box").value;
        data.phonetic = document.getElementById("phonetic_box").value;
        data.nickname = document.getElementById("nickname_box").value;
        data.remarks = document.getElementById("remarks_box").value;
        let targetYear = document.getElementById("year");
        let numYear = targetYear.selectedIndex;
        let year = targetYear.getElementsByTagName('option')[numYear].value;
        let targetMonth = document.getElementById("month");
        let numMonth = targetMonth.selectedIndex;
        let month = targetMonth.getElementsByTagName('option')[numMonth].value;
        let targetDay = document.getElementById("day");
        let numDay = targetDay.selectedIndex;
        let day = targetDay.getElementsByTagName('option')[numDay].value;
        data.birthDay = new Date(year, month - 1, day).toISOString();
        let option = document.getElementById("genderTd").getElementsByTagName('input');
        for (let i = 0; i < option.length; i++) {
            if (option[i].checked === true) {
                data.gender = option[i].value;
                break;
            }
        }
        data.party = document.getElementById("party_box").value;
        if(document.title === "園児追加") {
            execPost('ins', '/contents/student/list_post', data);
        } else {
            execPost('upd', '/contents/student/list_post', data);
        }
    }
}