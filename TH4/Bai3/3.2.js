const formSteps = document.querySelectorAll(".form-step");
const progress = document.getElementById("progress");
const circles = document.querySelectorAll(".step");
const nextBtns = document.querySelectorAll(".btn-next");
const prevBtns = document.querySelectorAll(".btn-prev");
const multiStepForm = document.getElementById("multiStepForm");

let currentStep = 1;

// Gắn sự kiện cho nút Tiếp theo
nextBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        if (validateStep(currentStep)) {
            currentStep++;
            updateUI();
        }
    });
});

// Gắn sự kiện cho nút Quay lại
prevBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        currentStep--;
        updateUI();
    });
});

// Hàm cập nhật Giao diện
function updateUI() {
    // 1. Cập nhật hiển thị Form nội dung
    formSteps.forEach((step, index) => {
        step.classList.toggle("active", index === currentStep - 1);
    });

    // 2. Cập nhật các vòng tròn số bước
    circles.forEach((circle, index) => {
        if (index < currentStep) {
            circle.classList.add("active");
        } else {
            circle.classList.remove("active");
        }
    });

    // 3. Cập nhật thanh tiến trình (Progress Bar)
    const actives = document.querySelectorAll(".step.active");
    progress.style.width = ((actives.length - 1) / (circles.length - 1)) * 100 + "%";

    // 4. Nếu là bước cuối, hiển thị tóm tắt
    if (currentStep === 3) {
        showSummary();
    }
}

// Hàm Validate cho từng bước
function validateStep(step) {
    let isValid = true;

    if (step === 1) {
        const name = document.getElementById("fullname").value.trim();
        const dob = document.getElementById("dob").value;
        const gender = document.getElementById("gender").value;

        if (name.length < 3) {
            document.getElementById("name-error").innerText = "Họ tên phải ít nhất 3 ký tự";
            isValid = false;
        } else document.getElementById("name-error").innerText = "";

        if (!dob) {
            document.getElementById("dob-error").innerText = "Vui lòng chọn ngày sinh";
            isValid = false;
        } else document.getElementById("dob-error").innerText = "";

        if (!gender) {
            document.getElementById("gender-error").innerText = "Vui lòng chọn giới tính";
            isValid = false;
        } else document.getElementById("gender-error").innerText = "";
    }

    if (step === 2) {
        const email = document.getElementById("email").value;
        const pass = document.getElementById("password").value;
        const confirm = document.getElementById("confirm").value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            document.getElementById("email-error").innerText = "Email không đúng định dạng";
            isValid = false;
        } else document.getElementById("email-error").innerText = "";

        if (pass.length < 6) {
            document.getElementById("pass-error").innerText = "Mật khẩu tối thiểu 6 ký tự";
            isValid = false;
        } else document.getElementById("pass-error").innerText = "";

        if (confirm !== pass || !confirm) {
            document.getElementById("confirm-error").innerText = "Xác nhận mật khẩu không khớp";
            isValid = false;
        } else document.getElementById("confirm-error").innerText = "";
    }

    return isValid;
}

// Hàm đổ dữ liệu vào trang Xác nhận
function showSummary() {
    const summary = document.getElementById("summary");
    const data = {
        "Họ và tên": document.getElementById("fullname").value,
        "Ngày sinh": document.getElementById("dob").value,
        "Giới tính": document.getElementById("gender").value,
        "Email": document.getElementById("email").value
    };

    summary.innerHTML = Object.entries(data).map(([label, value]) => `
        <div class="summary-item">
            <span class="summary-label">${label}</span>
            <span class="summary-value">${value}</span>
        </div>
    `).join("");
}

// Xử lý gửi form cuối cùng
multiStepForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("🎉 Chúc mừng Duyệt! Dữ liệu đã được gửi thành công.");
});