/**
 * File: script.js
 * Sửa lỗi: Chỉ bôi vàng hàng YẾU (điểm < 5.0)
 * Trung bình (5.0) trở lên KHÔNG bôi.
 */

let students = [];

const nameInput = document.getElementById('txtName');
const scoreInput = document.getElementById('txtScore');
const tableBody = document.getElementById('studentTable');
const statsDiv = document.getElementById('statistics');

// Hàm làm tròn chuẩn xử lý lỗi 8.45
function roundStandard(num, precision) {
    const factor = Math.pow(10, precision);
    return Math.round((num + Number.EPSILON) * factor) / factor;
}

const getRank = (score) => {
    const s = roundStandard(score, 1);
    if (s >= 8.5) return "Giỏi";
    if (s >= 7.0) return "Khá";
    if (s >= 5.0) return "Trung bình";
    return "Yếu";
};

function renderTable() {
    tableBody.innerHTML = '';
    let totalScore = 0;

    students.forEach((student, index) => {
        totalScore += student.score;

        const row = document.createElement('tr');
        
        /**
         * KIỂM TRA ĐIỀU KIỆN TÔ MÀU
         * Phải làm tròn điểm trước khi so sánh để đồng bộ với Xếp loại
         */
        const displayScore = roundStandard(student.score, 1);
        
        // CHỈ bôi vàng nếu điểm làm tròn < 5.0 (Xếp loại Yếu)
        if (displayScore < 5.0) {
            row.classList.add('bg-yellow');
        } else {
            row.classList.remove('bg-yellow'); // Đảm bảo hàng trên 5.0 sạch màu
        }

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${student.name}</td>
            <td>${displayScore.toFixed(1)}</td>
            <td>${getRank(student.score)}</td>
            <td><button class="btn-delete" data-index="${index}">Xóa</button></td>
        `;
        tableBody.appendChild(row);
    });

    const count = students.length;
    let avg = count > 0 ? roundStandard(totalScore / count, 2) : 0;

    statsDiv.innerHTML = `Tổng số sinh viên: ${count} | Điểm trung bình: ${avg.toFixed(2)}`;
}

function handleAddStudent() {
    const name = nameInput.value.trim();
    const rawScore = scoreInput.value;

    if (name === "" || rawScore === "") {
        alert("Họ tên không được trống và điểm phải hợp lệ!");
        return;
    }

    const score = parseFloat(rawScore);
    if (isNaN(score) || score < 0 || score > 10) {
        alert("Điểm phải từ 0 đến 10!");
        return;
    }

    students.push({ name, score });
    renderTable();

    nameInput.value = '';
    scoreInput.value = '';
    nameInput.focus();
}

// Events
document.getElementById('btnAdd').addEventListener('click', handleAddStudent);
scoreInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleAddStudent(); });

tableBody.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-delete')) {
        const index = parseInt(e.target.getAttribute('data-index'));
        students.splice(index, 1);
        renderTable();
    }
});