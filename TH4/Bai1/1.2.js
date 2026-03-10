let students = [];
let sortDir = 0; // 0: mặc định, 1: tăng, -1: giảm

const tableBody = document.getElementById('studentTable');
const nameInput = document.getElementById('txtName');
const scoreInput = document.getElementById('txtScore');

// 1. Hàm làm tròn chuẩn (tránh lỗi 8.45 -> 8.4)
const roundStd = (n, p) => Math.round((n + Number.EPSILON) * Math.pow(10, p)) / Math.pow(10, p);

const getRank = (score) => {
    const s = roundStd(score, 1);
    if (s >= 8.5) return "Giỏi";
    if (s >= 7.0) return "Khá";
    if (s >= 5.0) return "Trung bình";
    return "Yếu";
};

// 2. Hàm gom tất cả các bộ lọc và render
function applyFilters() {
    const keyword = document.getElementById('searchName').value.toLowerCase();
    const selectedRank = document.getElementById('filterRank').value;

    // Lọc theo tên và xếp loại
    let result = students.filter(s => {
        const matchesName = s.name.toLowerCase().includes(keyword);
        const matchesRank = (selectedRank === "all") || (getRank(s.score) === selectedRank);
        return matchesName && matchesRank;
    });

    // Sắp xếp
    if (sortDir !== 0) {
        result.sort((a, b) => sortDir === 1 ? a.score - b.score : b.score - a.score);
    }

    renderTable(result);
}

function renderTable(data) {
    tableBody.innerHTML = '';
    let total = 0;

    if (data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="color:gray">Không tìm thấy sinh viên</td></tr>';
    } else {
        data.forEach((s, i) => {
            total += s.score;
            const scoreDisplay = roundStd(s.score, 1);
            const row = document.createElement('tr');
            
            // Chỉ bôi vàng khi xếp loại Yếu
            if (scoreDisplay < 5.0) row.classList.add('bg-yellow');

            row.innerHTML = `
                <td>${i + 1}</td>
                <td>${s.name}</td>
                <td>${scoreDisplay.toFixed(1)}</td>
                <td>${getRank(s.score)}</td>
                <td><button class="btn-del" onclick="deleteStudent('${s.id}')">Xóa</button></td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Thống kê
    const avg = data.length > 0 ? roundStd(total / data.length, 2) : 0;
    document.getElementById('totalCount').innerText = data.length;
    document.getElementById('avgScore').innerText = avg.toFixed(2);
}

// 3. Xử lý sự kiện
document.getElementById('btnAdd').onclick = () => {
    const name = nameInput.value.trim();
    const score = parseFloat(scoreInput.value);

    if (!name || isNaN(score) || score < 0 || score > 10) {
        alert("Thông tin không hợp lệ!");
        return;
    }

    // Thêm ID để xóa chuẩn khi đang lọc
    students.push({ id: Date.now().toString(), name, score });
    applyFilters();

    nameInput.value = '';
    scoreInput.value = '';
    nameInput.focus();
};

// Tìm kiếm & Lọc realtime
document.getElementById('searchName').oninput = applyFilters;
document.getElementById('filterRank').onchange = applyFilters;

// Sắp xếp
document.getElementById('colScore').onclick = () => {
    const icon = document.getElementById('sortIcon');
    if (sortDir === 0 || sortDir === -1) {
        sortDir = 1; icon.innerText = '▲';
    } else {
        sortDir = -1; icon.innerText = '▼';
    }
    applyFilters();
};

// Xóa (Theo ID)
function deleteStudent(id) {
    students = students.filter(s => s.id !== id);
    applyFilters();
}

// Cho phép nhấn Enter để thêm
scoreInput.onkeypress = (e) => { if (e.key === 'Enter') document.getElementById('btnAdd').onclick(); };