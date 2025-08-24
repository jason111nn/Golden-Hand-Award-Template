// 主要JavaScript功能文件
document.addEventListener('DOMContentLoaded', function() {
    // 初始化AOS動畫
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });

    // 初始化主題
    initTheme();
    
    // 初始化導航欄
    initNavigation();
    
    // 初始化聊天功能
    initChat();
    
    // 初始化刮刮樂遊戲
    initScratchCard();
    
    // 初始化購物車
    initCart();
    
    // 初始化退休規劃計算器
    initPlanningCalculator();
    
    // 綁定事件監聽器
    bindEventListeners();
});

// 主題切換功能
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');
    
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
        themeToggle.title = '切換淺色主題';
    } else {
        icon.className = 'fas fa-moon';
        themeToggle.title = '切換深色主題';
    }
}

// 導航欄功能
function initNavigation() {
    const navbar = document.getElementById('mainNav');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // 平滑滾動
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// 回到頂部功能
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// AI聊天功能
function initChat() {
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
}

function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // 添加用戶消息
    addChatMessage(message, 'user');
    chatInput.value = '';
    
    // 模擬AI回覆
    setTimeout(() => {
        const aiResponse = generateAIResponse(message);
        addChatMessage(aiResponse, 'bot');
    }, 1000);
}

function addChatMessage(content, type) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = content;
    
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);
    
    // 滾動到底部
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateAIResponse(userMessage) {
    const responses = {
        '課程': '我們提供多種樂齡課程，包括手工藝、烹飪、健康管理等。您可以在課程區域查看詳細資訊。',
        '報名': '課程報名很簡單，點擊課程卡片上的「我要報名」按鈕即可。如需協助，請聯繫我們的客服。',
        '退休': '退休規劃是我們的重點服務，我們提供財務規劃、健康管理、興趣培養等全方位支援。',
        '活動': '我們定期舉辦各種體驗活動，如戶外健行、手工藝製作、健康講座等。',
        '健康': '健康管理包括定期檢查、運動建議、營養指導等。我們有專業的健康顧問為您服務。',
        '費用': '大部分課程都是免費的，部分活動會收取少量費用。詳細費用請查看各活動頁面。'
    };
    
    // 簡單的關鍵字匹配
    for (const [keyword, response] of Object.entries(responses)) {
        if (userMessage.includes(keyword)) {
            return response;
        }
    }
    
    // 預設回覆
    return '感謝您的提問！如果您需要更詳細的資訊，請聯繫我們的客服人員，我們很樂意為您提供協助。';
}

// 刮刮樂遊戲功能
function initScratchCard() {
    const canvas = document.getElementById('scratchCard');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let hasWon = false;
    
    // 繪製刮刮樂背景
    function drawBackground() {
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#333';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('刮開查看獎品', canvas.width / 2, canvas.height / 2);
    }
    
    // 繪製刮刮樂塗層
    function drawScratchLayer() {
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#333';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('刮開這裡', canvas.width / 2, canvas.height / 2);
    }
    
    // 初始化畫布
    drawBackground();
    drawScratchLayer();
    
    // 滑鼠事件
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    
    function startDrawing(e) {
        isDrawing = true;
        draw(e);
    }
    
    function draw(e) {
        if (!isDrawing) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fill();
        
        // 檢查是否刮開足夠面積
        checkScratchProgress();
    }
    
    function stopDrawing() {
        isDrawing = false;
    }
    
    function checkScratchProgress() {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let scratchedPixels = 0;
        
        for (let i = 3; i < data.length; i += 4) {
            if (data[i] === 0) {
                scratchedPixels++;
            }
        }
        
        const totalPixels = canvas.width * canvas.height;
        const scratchedPercentage = (scratchedPixels / totalPixels) * 100;
        
        if (scratchedPercentage > 30 && !hasWon) {
            hasWon = true;
            showGameResult();
        }
    }
    
    function showGameResult() {
        const gameResult = document.getElementById('gameResult');
        if (gameResult) {
            gameResult.classList.remove('d-none');
        }
    }
}

// 購物車功能
let cart = [];

function initCart() {
    // 從localStorage載入購物車
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
}

function addToCart(item) {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
    }
    
    // 儲存到localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    
    // 顯示成功訊息
    showAlert('已加入購物車！', 'success');
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

function updateCartQuantity(itemId, newQuantity) {
    const item = cart.find(cartItem => cartItem.id === itemId);
    if (item) {
        item.quantity = Math.max(1, newQuantity);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    }
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-center text-muted">購物車是空的</p>';
        if (cartTotal) cartTotal.textContent = '0';
        return;
    }
    
    let total = 0;
    let cartHTML = '';
    
    cart.forEach(item => {
        total += item.price * item.quantity;
        cartHTML += `
            <div class="cart-item d-flex align-items-center mb-3 p-3 border rounded">
                <img src="${item.image}" alt="${item.name}" class="me-3" style="width: 50px; height: 50px; object-fit: cover;">
                <div class="flex-grow-1">
                    <h6 class="mb-1">${item.name}</h6>
                    <div class="d-flex align-items-center">
                        <button class="btn btn-sm btn-outline-secondary me-2" onclick="updateCartQuantity('${item.id}', ${item.quantity - 1})">-</button>
                        <span class="me-2">${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-secondary me-2" onclick="updateCartQuantity('${item.id}', ${item.quantity + 1})">+</button>
                        <span class="text-primary fw-bold">NT$${item.price}</span>
                    </div>
                </div>
                <button class="btn btn-sm btn-danger ms-2" onclick="removeFromCart('${item.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });
    
    cartItems.innerHTML = cartHTML;
    if (cartTotal) cartTotal.textContent = total.toLocaleString();
}

function checkout() {
    if (cart.length === 0) {
        showAlert('購物車是空的！', 'danger');
        return;
    }
    
    // 這裡可以添加結帳邏輯
    showAlert('結帳功能開發中...', 'info');
}

// 退休規劃計算器
function initPlanningCalculator() {
    const planningForm = document.getElementById('planningForm');
    if (planningForm) {
        planningForm.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateRetirementPlan();
        });
    }
}

function calculateRetirementPlan() {
    const currentAge = parseInt(document.getElementById('currentAge').value);
    const retirementAge = parseInt(document.getElementById('retirementAge').value);
    const lifeExpectancy = parseInt(document.getElementById('lifeExpectancy').value);
    const monthlyExpense = parseInt(document.getElementById('monthlyExpense').value);
    const currentSavings = parseInt(document.getElementById('currentSavings').value);
    const monthlySavings = parseInt(document.getElementById('monthlySavings').value);
    
    // 計算
    const retirementYears = retirementAge - currentAge;
    const livingYears = lifeExpectancy - retirementAge;
    const totalNeeded = monthlyExpense * 12 * livingYears;
    const totalSaved = currentSavings + (monthlySavings * 12 * retirementYears);
    const fundingGap = Math.max(0, totalNeeded - totalSaved);
    
    // 顯示結果
    document.getElementById('retirementYears').textContent = retirementYears;
    document.getElementById('totalNeeded').textContent = totalNeeded.toLocaleString();
    document.getElementById('fundingGap').textContent = fundingGap.toLocaleString();
    
    document.getElementById('planningResult').classList.remove('d-none');
}

// 課程報名功能
function enrollCourse(courseName) {
    // 檢查是否已登入
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        showAlert('請先登入會員！', 'warning');
        // 顯示登入模態框
        const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
        loginModal.show();
        return;
    }
    
    // 這裡可以添加報名邏輯
    showAlert(`已成功報名「${courseName}」課程！`, 'success');
}

// 活動報名功能
function enrollActivity(activityName) {
    // 檢查是否已登入
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        showAlert('請先登入會員！', 'warning');
        // 顯示登入模態框
        const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
        loginModal.show();
        return;
    }
    
    // 這裡可以添加報名邏輯
    showAlert(`已成功報名「${activityName}」活動！`, 'success');
}

// 領取獎品功能
function claimPrize() {
    // 檢查是否已登入
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        showAlert('請先登入會員！', 'warning');
        // 顯示登入模態框
        const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
        loginModal.show();
        return;
    }
    
    showAlert('獎品已發送到您的會員中心！', 'success');
}

// 顯示提示訊息
function showAlert(message, type = 'info') {
    // 創建提示元素
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // 自動移除
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// 綁定事件監聽器
function bindEventListeners() {
    // 登入表單
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
    
    // 聯絡表單
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactSubmit();
        });
    }
    
    // 購物車按鈕
    const cartButtons = document.querySelectorAll('[onclick*="enrollCourse"], [onclick*="enrollActivity"]');
    cartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const courseName = this.getAttribute('data-course') || this.textContent.trim();
            if (this.onclick.toString().includes('enrollCourse')) {
                enrollCourse(courseName);
            } else if (this.onclick.toString().includes('enrollActivity')) {
                enrollActivity(courseName);
            }
        });
    });
}

// 處理登入
function handleLogin() {
    const email = document.querySelector('#loginForm input[type="email"]').value;
    const password = document.querySelector('#loginForm input[type="password"]').value;
    
    // 簡單的登入驗證（實際應用中應該有後端驗證）
    if (email && password) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        
        showAlert('登入成功！', 'success');
        
        // 關閉登入模態框
        const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        loginModal.hide();
        
        // 更新登入按鈕
        updateLoginButton();
    } else {
        showAlert('請填寫完整的登入資訊！', 'danger');
    }
}

// 處理聯絡表單提交
function handleContactSubmit() {
    const nickname = document.querySelector('#contactForm input[type="text"]').value;
    const message = document.querySelector('#contactForm textarea').value;
    
    if (nickname && message) {
        showAlert('留言已送出！', 'success');
        
        // 清空表單
        document.getElementById('contactForm').reset();
        
        // 這裡可以添加留言處理邏輯
    } else {
        showAlert('請填寫完整的留言資訊！', 'danger');
    }
}

// 更新登入按鈕
function updateLoginButton() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const loginButton = document.querySelector('[data-bs-target="#loginModal"]');
    
    if (loginButton && isLoggedIn) {
        const userEmail = localStorage.getItem('userEmail');
        loginButton.innerHTML = `<i class="fas fa-user me-1"></i>${userEmail}`;
        loginButton.onclick = function() {
            // 顯示用戶資訊或登出選項
            showAlert('您已登入！', 'info');
        };
    }
}

// 頁面載入完成後檢查登入狀態
window.addEventListener('load', function() {
    updateLoginButton();
});

// 工具函數
function formatCurrency(amount) {
    return new Intl.NumberFormat('zh-TW', {
        style: 'currency',
        currency: 'TWD'
    }).format(amount);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(date);
}

// 導出函數供HTML使用
window.enrollCourse = enrollCourse;
window.enrollActivity = enrollActivity;
window.claimPrize = claimPrize;
window.scrollToTop = scrollToTop;
window.sendMessage = sendMessage; 