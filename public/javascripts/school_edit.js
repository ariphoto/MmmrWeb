// 保育園編集画面 変更ボタンの処理
function schoolPasswordEdit() {
    const schoolForm = document.getElementById('school_form');
    // パスワードも変更する場合
    if(document.getElementById('schoolPassBox').value !== '') {
        const oldPass = window.prompt("現在のパスワードを入力してください。"); // ポップアップを表示して、入力
        // 現在のパスワードが入力され、OKが押された場合
        if(oldPass !== null && oldPass !== "") {
            // フォームに現在のパスワードを追加し、submitする
            const oldPassInput = document.getElementById('oldPassBox');
            oldPassInput.setAttribute('value', oldPass);
        } else {
            // 未入力またはキャンセルの場合
            return;
        }
    } else {
        if(!window.confirm(`更新します\nよろしいですか？`)) {
            // キャンセルの場合は何もしない
            return;
        }
    }

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
        const infoBar = document.getElementById('under')
        if(infoBar.childNodes[0]) {
            const removeTxt = infoBar.childNodes[0];
            infoBar.removeChild(removeTxt);
        }
        const message = document.createTextNode(data);
        infoBar.appendChild(message);
        if(data === '更新しました') {
            document.getElementById('id_h').value = document.getElementById('schoolIdBox').value // 新IDを保持しておく
            infoBar.classList.remove('alert', 'alert-danger')
            infoBar.classList.add('alert', 'alert-info')
        } else {
            infoBar.classList.remove('alert', 'alert-info')
            infoBar.classList.add('alert', 'alert-danger')
        }
    })
    //↓フォームの送信に失敗した場合の処理
    .fail(function() {
        alert('error');
    })
}