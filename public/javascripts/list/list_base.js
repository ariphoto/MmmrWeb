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
                td.classList.add('text-center');
                let btnInsert = document.createElement('button');
                btnInsert.classList.add('btn','btn-info','btn-original');
                btnInsert.setAttribute('onclick','location.href="javascript:insert_execute();"');
                let txtInsert = document.createTextNode("追加");
                btnInsert.appendChild(txtInsert);
                td.appendChild(btnInsert);
                break;
            // キャンセル ボタン
            case 4:
                td.classList.add('text-center');
                let btnCancel = document.createElement('button');
                btnCancel.classList.add('btn','btn-default','btn-default','long120');
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
    // 園児一覧の場合、IDをポストして別ページに遷移する
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
        newButton2.classList.add('btn', 'btn-default', 'btn-original','long120');
        newButton2.setAttribute('onclick', 'location.href="javascript:edit_cancel(' + idNum + ');"');
        let newTxt2 = document.createTextNode("キャンセル");
        newButton2.appendChild(newTxt2);
        tdBtn2.appendChild(newButton2);
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
        if(document.getElementById('graduation').checked){
            filterData.graduation = true;
        } else {
            filterData.graduation = false;
        }
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