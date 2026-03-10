// 1. Hàm tiện ích hiển thị/xóa lỗi
const showError = (id, msg) => {
    const input = document.getElementById(id);
    const errorSpan = document.getElementById(`${id}-error`);
    if (input && input.type !== 'radio') input.classList.add('invalid');
    if (errorSpan) errorSpan.innerText = msg;
};

const clearError = (id) => {
    const input = document.getElementById(id);
    const errorSpan = document.getElementById(`${id}-error`);
    if (input) input.classList.remove('invalid');
    if (errorSpan) errorSpan.innerText = '';
};

// 2. Các hàm Validate chi tiết
function validateFullname() {
    const val = document.getElementById('fullname').value.trim();
    const regex = /^[a-zA-ZÀ-ỹ\s]+$/;
    if (val.length < 3) { showError('fullname', 'Họ tên phải ít nhất 3 ký tự'); return 0; }
    if (!regex.test(val)) { showError('fullname', 'Họ tên chỉ chứa chữ cái và khoảng trắng'); return 0; }
    clearError('fullname'); return 1;
}

function validateEmail() {
    const val = document.getElementById('email').value.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(val)) { showError('email', 'Email không đúng định dạng'); return 0; }
    clearError('email'); return 1;
}

function validatePhone() {
    const val = document.getElementById('phone').value.trim();
    const regex = /^0\d{9}$/;
    if (!regex.test(val)) { showError('phone', 'SĐT phải có 10 số và bắt đầu bằng số 0'); return 0; }
    clearError('phone'); return 1;
}

function validatePassword() {
    const val = document.getElementById('password').value;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!regex.test(val)) { showError('password', 'Mật khẩu ≥ 8 ký tự, có Hoa, thường, số'); return 0; }
    clearError('password'); return 1;
}

function validateConfirm() {
    const pass = document.getElementById('password').value;
    const confirm = document.getElementById('confirmPassword').value;
    if (confirm !== pass || confirm === "") { showError('confirmPassword', 'Mật khẩu xác nhận không khớp'); return 0; }
    clearError('confirmPassword'); return 1;
}

function validateGender() {
    const checked = document.querySelector('input[name="gender"]:checked');
    if (!checked) { showError('gender', 'Vui lòng chọn giới tính'); return 0; }
    clearError('gender'); return 1;
}

function validateTerms() {
    const isChecked = document.getElementById('terms').checked;
    if (!isChecked) { showError('terms', 'Bạn phải đồng ý với điều khoản'); return 0; }
    clearError('terms'); return 1;
}

// 3. Gắn sự kiện (Realtime & Input)
const inputs = ['fullname', 'email', 'phone', 'password', 'confirmPassword'];
inputs.forEach(id => {
    const el = document.getElementById(id);
    // Blur: Rời khỏi ô thì kiểm tra
    el.addEventListener('blur', () => {
        if(id === 'fullname') validateFullname();
        if(id === 'email') validateEmail();
        if(id === 'phone') validatePhone();
        if(id === 'password') validatePassword();
        if(id === 'confirmPassword') validateConfirm();
    });
    // Input: Đang gõ thì xóa lỗi ngay
    el.addEventListener('input', () => clearError(id));
});

// 4. Xử lý Submit form
document.getElementById('regForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Dùng toán tử bitwise & để ép tất cả các hàm phải chạy (không dừng sớm)
    const isValid = 
        validateFullname() & 
        validateEmail() & 
        validatePhone() & 
        validatePassword() & 
        validateConfirm() & 
        validateGender() & 
        validateTerms();

    if (isValid === 1) {
        const name = document.getElementById('fullname').value;
        this.classList.add('hidden');
        const successBox = document.getElementById('successBox');
        successBox.classList.remove('hidden');
        document.getElementById('userSuccess').innerText = name;
    }
});