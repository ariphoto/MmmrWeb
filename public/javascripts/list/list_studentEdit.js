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