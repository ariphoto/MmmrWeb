function passCheck() {
    let form = document.forms.schoolAdd;
    if (form.password.value === form.passwordRe.value) {

    }else {
        alert('パスワードが違います');
        return false
    }
}