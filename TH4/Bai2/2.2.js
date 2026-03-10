// Định nghĩa giá sản phẩm
const prices = {
    "laptop": 25000000,
    "phone": 15000000,
    "tablet": 8000000
};

const form = document.getElementById('orderForm');
const overlay = document.getElementById('confirmOverlay');

// --- HÀM TIỆN ÍCH ---
const showError = (id, msg) => { document.getElementById(`${id}-error`).innerText = msg; };
const clearError = (id) => { document.getElementById(`${id}-error`).innerText = ''; };

// --- LOGIC TÍNH TIỀN ---
function updateTotal() {
    const pKey = document.getElementById('product').value;
    const qty = parseInt(document.getElementById('quantity').value) || 0;
    const total = (prices[pKey] || 0) * qty;
    document.getElementById('totalMoney').innerText = total.toLocaleString('vi-VN') + "đ";
    return total;
}

// --- LOGIC ĐẾM KÝ TỰ ---
document.getElementById('note').oninput = function() {
    const len = this.value.length;
    const counter = document.getElementById('charCount');
    counter.innerText = `${len}/200`;
    if (len > 200) {
        counter.classList.add('over-limit');
        showError('note', 'Ghi chú vượt quá 200 ký tự');
    } else {
        counter.classList.remove('over-limit');
        clearError('note');
    }
};

// --- CÁC HÀM VALIDATE ---
function validateProduct() {
    const val = document.getElementById('product').value;
    if (!val) { showError('product', 'Vui lòng chọn sản phẩm'); return 0; }
    clearError('product'); return 1;
}

function validateQuantity() {
    const val = parseInt(document.getElementById('quantity').value);
    if (isNaN(val) || val < 1 || val > 99) { showError('quantity', 'Số lượng từ 1-99'); return 0; }
    clearError('quantity'); return 1;
}

function validateDate() {
    const inputDate = new Date(document.getElementById('deliveryDate').value);
    const today = new Date();
    today.setHours(0,0,0,0); // Reset giờ để chỉ so sánh ngày
    
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 30);

    if (isNaN(inputDate.getTime())) { showError('deliveryDate', 'Chọn ngày giao hàng'); return 0; }
    if (inputDate < today) { showError('deliveryDate', 'Không chọn ngày quá khứ'); return 0; }
    if (inputDate > maxDate) { showError('deliveryDate', 'Không giao quá 30 ngày tới'); return 0; }
    
    clearError('deliveryDate'); return 1;
}

function validateAddress() {
    const val = document.getElementById('address').value.trim();
    if (val.length < 10) { showError('address', 'Địa chỉ ít nhất 10 ký tự'); return 0; }
    clearError('address'); return 1;
}

function validatePayment() {
    const checked = document.querySelector('input[name="payment"]:checked');
    if (!checked) { showError('payment', 'Chọn phương thức thanh toán'); return 0; }
    clearError('payment'); return 1;
}

// --- XỬ LÝ SỰ KIỆN ---
document.getElementById('product').onchange = updateTotal;
document.getElementById('quantity').oninput = updateTotal;

// Gắn sự kiện blur cho các trường
['product', 'quantity', 'deliveryDate', 'address'].forEach(id => {
    document.getElementById(id).onblur = () => {
        if(id === 'product') validateProduct();
        if(id === 'quantity') validateQuantity();
        if(id === 'deliveryDate') validateDate();
        if(id === 'address') validateAddress();
    };
});

// SUBMIT FORM
form.onsubmit = function(e) {
    e.preventDefault();
    const isValid = validateProduct() & validateQuantity() & validateDate() & 
                    validateAddress() & validatePayment();

    if (isValid === 1) {
        // Hiện tóm tắt đơn hàng
        const pName = document.getElementById('product').options[document.getElementById('product').selectedIndex].text;
        const qty = document.getElementById('quantity').value;
        const total = document.getElementById('totalMoney').innerText;
        const date = document.getElementById('deliveryDate').value;

        document.getElementById('summaryContent').innerHTML = `
            <p><strong>SP:</strong> ${pName}</p>
            <p><strong>SL:</strong> ${qty}</p>
            <p><strong>Ngày giao:</strong> ${date}</p>
            <hr>
            <p style="color:green"><strong>Tổng: ${total}</strong></p>
        `;
        overlay.classList.remove('hidden');
    }
};

// Nút Hủy và Xác nhận cuối cùng
document.getElementById('btnCancel').onclick = () => overlay.classList.add('hidden');
document.getElementById('btnFinalConfirm').onclick = () => {
    overlay.classList.add('hidden');
    form.classList.add('hidden');
    document.getElementById('successMsg').classList.remove('hidden');
};