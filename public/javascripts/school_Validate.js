function passCheck() {
    let form = document.forms.schoolAdd;
    if (form.password.value === form.passwordRe.value) {
        alert('パスワード一致');
    }else {
        alert('パスワードが違う');
        return false
    }
}