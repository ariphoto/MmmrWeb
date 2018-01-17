// 保育園編集画面 変更ボタンの処理
function schoolPasswordEdit() {
    const schoolName = document.getElementById('schoolNameBox').value;
    const address = document.getElementById('schoolAddressBox').value;
    // 保育園名の入力チェック
    if(checkSpace(schoolName)){
        alert("保育園名が正しくありません");
        return false;
    }
    // メールアドレスの入力チェック
    if(checkSpace(address) || !checkAddress(address)){
        alert("メールアドレスが正しくありません");
        return false;
    }
    // パスワードも変更する場合
    if (document.getElementById('schoolPassBox').value !== '') {
        $('#modal-pass').modal(); // 旧パスワード入力モーダルを表示する
        $('#oldPassBox').val('');
    } else {
        if (!window.confirm(`更新します\nよろしいですか？`)) {
            // キャンセルの場合は何もしない
            return;
        }
        schoolEditSubmit();
    }
}

// 旧パスワード入力後の処理
function oldPassSubmit(){
    const oldPass = document.getElementById('oldPassBox').value;
    // 現在のパスワードが入力され、OKが押された場合
    if (oldPass !== null && oldPass !== "") {
        // フォームに現在のパスワードを追加し、submitする
        const oldPassInput = document.getElementById('oldPassBox');
        oldPassInput.setAttribute('value', oldPass);
        schoolEditSubmit();

    }
    $('#modal-pass').modal('hide'); // モーダルを閉じる
}

// 保育園情報をポストする
function schoolEditSubmit(){
    // フォームデータをjsonに変換
    const formData = new FormData(document.getElementById('school_form'));
    let jsonObject = {};
    for (const [key, value] of formData.entries()) {
        jsonObject[key] = value;
    }
    $.ajax({
        type: "post",
        url: "/contents/school/edit",
        data: jsonObject
    })
    .done(function(data) {
        const infoBar = document.getElementById('under');
        if(infoBar.childNodes[0]) {
            const removeTxt = infoBar.childNodes[0];
            infoBar.removeChild(removeTxt);
        }
        const message = document.createTextNode(data);
        infoBar.appendChild(message);
        if(data === '更新しました') {
            infoBar.classList.remove('alert', 'alert-danger');
            infoBar.classList.add('alert', 'alert-info');
        } else {
            infoBar.classList.remove('alert', 'alert-info');
            infoBar.classList.add('alert', 'alert-danger');
        }
    })
    //↓フォームの送信に失敗した場合の処理
    .fail(function() {
        alert('error');
    });
}

// 未入力・連続空白のチェック
function checkSpace(string){
    const reg = /^(\s|　)/;
    if(string === '' || string.match(reg)){
        return true;
    }
    return false;
}

// 未入力・連続空白のチェック
function checkAddress(string){
    const reg = /^[A-Za-z0-9]+[\w-]+@[\w\.-]+\.\w{2,}$/;
    if(string.match(reg)){
        return true;
    }
    return false;
}