// 1. Hàm tiện ích (Giữ nguyên từ bài cũ của Duyệt)
const showError = (id, msg) => {
    const input = document.getElementById(id);
    const errorSpan = document.getElementById(`${id}-error`);
    if (input && input.type !== 'radio' && input.type !== 'checkbox') input.classList.add('invalid');
    if (errorSpan) errorSpan.innerText = msg;
};

const clearError = (id) => {
    const input = document.getElementById(id);
    const errorSpan = document.getElementById(`${id}-error`);
    if (input) input.classList.remove('invalid');
    if (errorSpan) errorSpan.innerText = '';
};

// 2. Validate chi tiết
function validateFullname() {
    const val = document.getElementById('fullname').value.trim();
    if (val.length < 3) { showError('fullname', 'Họ tên phải ít nhất 3 ký tự'); return 0; }
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
    if (!regex.test(val)) { showError('password', 'Mật khẩu yếu hoặc chưa đúng định dạng'); return 0; }
    clearError('password'); return 1;
}

function validateConfirm() {
    const pass = document.getElementById('password').value;
    const confirm = document.getElementById('confirmPassword').value;
    if (confirm !== pass || confirm === "") { showError('confirmPassword', 'Mật khẩu không khớp'); return 0; }
    clearError('confirmPassword'); return 1;
}

// 3. LOGIC NÂNG CẤP (REALTIME)

// Yêu cầu 1: Thanh mức độ mạnh mật khẩu
document.getElementById('password').addEventListener('input', function() {
    const val = this.value;
    const bar = document.getElementById('strength-bar');
    const text = document.getElementById('strength-text');
    
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
    if (/\d/.test(val) && /[^A-Za-z0-9]/.test(val)) score++; // Số + ký tự đặc biệt

    if (val.length === 0) {
        bar.style.width = "0%"; text.innerText = "";
    } else if (score <= 1) {
        bar.className = "weak"; text.innerText = "Yếu (Đỏ)"; text.style.color = "#e74c3c";
    } else if (score === 2) {
        bar.className = "medium"; text.innerText = "Trung bình (Vàng)"; text.style.color = "#f1c40f";
    } else {
        bar.className = "strong"; text.innerText = "Mạnh (Xanh)"; text.style.color = "#2ecc71";
    }
});

// Yêu cầu 2: Hiển thị/Ẩn mật khẩu
document.getElementById('togglePassword').addEventListener('click', function() {
    const pwdInput = document.getElementById('password');
    if (pwdInput.type === "password") {
        pwdInput.type = "text";
        this.innerText = "🙈";
    } else {
        pwdInput.type = "password";
        this.innerText = "👁️";
    }
});

// Yêu cầu 3: Đếm ký tự Họ tên
document.getElementById('fullname').addEventListener('input', function() {
    const count = this.value.length;
    document.getElementById('charCount').innerText = `${count}/50`;
});

// 4. Submit form
document.getElementById('regForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const isValid = validateFullname() & validateEmail() & validatePhone() & validatePassword() & validateConfirm();

    if (isValid === 1) {
        this.classList.add('hidden');
        document.getElementById('successBox').classList.remove('hidden');
        document.getElementById('userSuccess').innerText = document.getElementById('fullname').value;
    }
});