// Инициализация AOS анимаций
AOS.init({ duration: 800, once: true, offset: 100 });

// ---------- ТЕМА (светлая/темная) ----------
const themeBtn = document.getElementById('themeToggle');
themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    document.body.classList.toggle('light');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    document.body.classList.remove('dark');
    document.body.classList.add('light');
} else {
    document.body.classList.add('dark');
    document.body.classList.remove('light');
}

// ---------- ОТЗЫВЫ КЛИЕНТОВ ----------
const testimonialsData = [
    {
        name: "Мельников Александр",
        company: "Владелец канала",
        text: "Разработали бота для продажи курсов. Автоматизация 95% продаж, конверсия выросла на 47%. Лучшее решение для моего бизнеса!",
        rating: 5,
        icon: "fas fa-users"
    },
    {
        name: "Любина Алёна",
        company: "Компания ZIP ZAVOD",
        text: "Оперативно перенесли бота из старого мессенджера в MAX после блокировок. Все работает отлично, функционал, архитектура и данные сохранились.",
        rating: 5,
        icon: "fas fa-industry"
    },
    {
        name: "Соболева Елена",
        company: "Студия маникюра",
        text: "Бот для MAX с записью и оплатой. Сократили неявки на 70%, выручка выросла на 45%. Очень довольны результатом!",
        rating: 5,
        icon: "fas fa-spa"
    }
];

const testimonialsGrid = document.getElementById('testimonialsGrid');

function renderTestimonials() {
    if (!testimonialsGrid) return;
    testimonialsGrid.innerHTML = '';
    
    testimonialsData.forEach((testimonial, idx) => {
        const card = document.createElement('div');
        card.className = 'testimonial-card';
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-delay', idx * 100);
        
        // Звезды рейтинга
        const stars = '★'.repeat(testimonial.rating) + '☆'.repeat(5 - testimonial.rating);
        
        card.innerHTML = `
            <div class="testimonial-stars">${stars}</div>
            <div class="testimonial-text">“${testimonial.text}”</div>
            <div class="testimonial-author">
                <div class="author-info">
                    <h4>${testimonial.name}</h4>
                    <p>${testimonial.company}</p>
                </div>
                <div class="author-logo">
                    <i class="${testimonial.icon}"></i>
                </div>
            </div>
        `;
        
        testimonialsGrid.appendChild(card);
    });
}

renderTestimonials();

// ---------- МОДАЛКА + ОТПРАВКА ЗАЯВКИ (сохраняем в localStorage как базу клиентов) ----------
const modal = document.getElementById('orderModal');
const openBtns = [document.getElementById('openModalBtn'), document.getElementById('footerOpenModal'), document.getElementById('heroCtaBtn')];
const closeModalBtn = document.getElementById('closeModalBtn');

openBtns.forEach(btn => btn?.addEventListener('click', () => modal.style.display = 'flex'));
closeModalBtn.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

// база клиентов (храним в localStorage, имитация PostgreSQL)
function saveClientToDB(client) {
    let clients = JSON.parse(localStorage.getItem('devbot_clients') || '[]');
    clients.push({ ...client, timestamp: new Date().toISOString() });
    localStorage.setItem('devbot_clients', JSON.stringify(clients));
    console.log('[DB] Сохранен клиент:', client);
    // В реальном проекте здесь будет POST запрос на Go + PostgreSQL
}

// Обновленная обработка формы с красивыми статусами
const orderForm = document.getElementById('orderForm');
const statusDiv = document.getElementById('formStatus');

orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('clientName').value.trim();
    const contact = document.getElementById('clientContact').value.trim();
    const message = document.getElementById('clientMessage').value.trim();
    
    if (!name || !contact) {
        statusDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> Заполните имя и контакт!';
        statusDiv.className = 'form-status error';
        statusDiv.style.display = 'block';
        
        // Анимация встряски для незаполненных полей
        if (!name) {
            document.getElementById('clientName').style.animation = 'shake 0.3s ease';
            setTimeout(() => {
                document.getElementById('clientName').style.animation = '';
            }, 300);
        }
        if (!contact) {
            document.getElementById('clientContact').style.animation = 'shake 0.3s ease';
            setTimeout(() => {
                document.getElementById('clientContact').style.animation = '';
            }, 300);
        }
        return;
    }
    
    const newLead = { name, contact, message, date: new Date().toISOString() };
    saveClientToDB(newLead);
    
    // Показываем успешный статус с анимацией
    statusDiv.innerHTML = '<i class="fas fa-check-circle"></i> Заявка отправлена! Свяжусь с вами в ближайшее время.';
    statusDiv.className = 'form-status success';
    
    // Анимация для кнопки
    const submitBtn = document.querySelector('.modal-submit-btn');
    submitBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        submitBtn.style.transform = '';
    }, 200);
    
    orderForm.reset();
    
    // Закрываем модалку через 2 секунды
    setTimeout(() => { 
        modal.style.display = 'none'; 
        statusDiv.innerHTML = '';
        statusDiv.className = 'form-status';
    }, 2500);
});

// Добавляем анимацию встряски
const shakeAnimation = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}
`;

const styleSheet = document.createElement("style");
styleSheet.textContent = shakeAnimation;
document.head.appendChild(styleSheet);
// Плавный скролл кнопок навигации
document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        if(target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        // Закрываем все остальные вопросы
        faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
            }
        });
        
        // Переключаем текущий вопрос
        item.classList.toggle('active');
    });
});

// ---------- ДЕМО-ЧАТ: Минималистичный диалог ----------
const chatMessages = document.getElementById('chatMessages');
const restartBtn = document.getElementById('restartChatDemo');
let currentMessageIndex = 0;
let isChatActive = true;
let timeoutId = null;

// Сценарий диалога (кратко и по делу)
const chatScenario = [
    {
        type: 'client',
        text: 'Слышал, старый мессенджер могут заблокировать. Как защитить бизнес?',
        delay: 800
    },
    {
        type: 'support',
        text: 'Могу перенести ботов в MAX. Это официальный мессенджер для бизнеса в РФ.',
        delay: 1500
    },
    {
        type: 'client',
        text: 'А что с данными? Все сохранится?',
        delay: 1800
    },
    {
        type: 'support',
        text: 'Полностью. Клиенты, заказы, история — все перенесу. Работа продолжается без перерыва.',
        delay: 1000
    },
    {
        type: 'client',
        text: 'Звучит круто. Сколько времени займет?',
        delay: 2000
    },
    {
        type: 'support',
        text: '3 дня. За это время ваши клиенты даже не заметят перехода.',
        delay: 1800
    }
];

// Функция добавления сообщения в чат
function addMessage(type, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}`;
    
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    
    const textSpan = document.createElement('p');
    textSpan.className = 'message-text';
    textSpan.textContent = text;
    
    bubble.appendChild(textSpan);
    messageDiv.appendChild(bubble);
    
    chatMessages.appendChild(messageDiv);
    
    // Автоматическая прокрутка вниз
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Очистка чата
function clearChat() {
    chatMessages.innerHTML = '';
    currentMessageIndex = 0;
}

// Остановка текущего диалога
function stopChatDialogue() {
    if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
    }
}

// Запуск диалога
function startChatDialogue() {
    stopChatDialogue();
    clearChat();
    currentMessageIndex = 0;
    isChatActive = true;
    
    function sendNextMessage() {
        if (currentMessageIndex < chatScenario.length && isChatActive) {
            const message = chatScenario[currentMessageIndex];
            addMessage(message.type, message.text);
            currentMessageIndex++;
            
            // Устанавливаем задержку перед следующим сообщением
            if (currentMessageIndex < chatScenario.length) {
                const nextDelay = chatScenario[currentMessageIndex].delay;
                timeoutId = setTimeout(sendNextMessage, nextDelay);
            }
        }
    }
    
    // Начинаем диалог
    timeoutId = setTimeout(sendNextMessage, 800);
}

// Перезапуск диалога
function restartDialogue() {
    stopChatDialogue();
    startChatDialogue();
}

// Инициализация чата при загрузке страницы
setTimeout(() => {
    startChatDialogue();
}, 500);

// Обработчик кнопки перезапуска
restartBtn.addEventListener('click', () => {
    restartDialogue();
    // Визуальный фидбек
    restartBtn.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        restartBtn.style.transform = '';
    }, 500);
});

// Обработка кнопок в детальных тарифах
document.querySelectorAll('.pricing-cta').forEach(btn => {
    btn.addEventListener('click', () => {
        const plan = btn.getAttribute('data-plan');
        const modal = document.getElementById('orderModal');
        const messageField = document.getElementById('clientMessage');
        
        if (messageField) {
            messageField.value = `Интересует тариф "${plan}".`;
        }
        
        modal.style.display = 'flex';
    });
});

// Обработка кнопки промежуточного CTA
const intermediateCta = document.getElementById('intermediateCta');
if (intermediateCta) {
    intermediateCta.addEventListener('click', () => {
        const modal = document.getElementById('orderModal');
        modal.style.display = 'flex';
    });
}

const guaranteeCta = document.getElementById('guaranteeCta');
if (guaranteeCta) {
    guaranteeCta.addEventListener('click', () => {
        const modal = document.getElementById('orderModal');
        const messageField = document.getElementById('clientMessage');
        
        if (messageField) {
            messageField.value = 'Хочу получить такие же результаты! Нужна консультация.';
        }
        
        modal.style.display = 'flex';
    });
}
// ---------- ОБРАБОТКА ФОРМЫ КОНТАКТОВ ----------
const contactForm = document.getElementById('contactForm');
const contactStatusDiv = document.getElementById('contactFormStatus');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('contactName').value.trim();
        const contact = document.getElementById('contactContact').value.trim();
        const message = document.getElementById('contactMessage').value.trim();
        
        if (!name || !contact) {
            contactStatusDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> Заполните имя и контакт!';
            contactStatusDiv.className = 'form-status error';
            contactStatusDiv.style.display = 'block';
            
            if (!name) {
                document.getElementById('contactName').style.animation = 'shake 0.3s ease';
                setTimeout(() => {
                    document.getElementById('contactName').style.animation = '';
                }, 300);
            }
            if (!contact) {
                document.getElementById('contactContact').style.animation = 'shake 0.3s ease';
                setTimeout(() => {
                    document.getElementById('contactContact').style.animation = '';
                }, 300);
            }
            return;
        }
        
        const newLead = { 
            name, 
            contact, 
            message: message || 'Консультация', 
            date: new Date().toISOString(),
            source: 'contact_form'
        };
        saveClientToDB(newLead);
        
        contactStatusDiv.innerHTML = '<i class="fas fa-check-circle"></i> Заявка отправлена! Свяжусь с вами в ближайшее время.';
        contactStatusDiv.className = 'form-status success';
        
        const submitBtn = document.querySelector('.contact-submit-btn');
        submitBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            submitBtn.style.transform = '';
        }, 200);
        
        contactForm.reset();
        
        setTimeout(() => { 
            contactStatusDiv.innerHTML = '';
            contactStatusDiv.className = 'form-status';
        }, 3000);
    });
}

// ---------- КАПЧА ПРИ ЗАГРУЗКЕ САЙТА ----------
let isCaptchaPassed = false;
let isDraggingCaptcha = false;
let captchaStartX = 0;
let maxLeft = 0;

// Блокируем сайт при загрузке
document.body.classList.add('captcha-blocked');
document.body.style.overflow = 'hidden';

const captchaOverlay = document.getElementById('siteCaptcha');
const captchaThumb = document.getElementById('siteCaptchaThumb');
const captchaTrack = document.getElementById('siteCaptchaTrack');
const captchaSuccess = document.getElementById('siteCaptchaSuccess');
const captchaText = document.getElementById('siteCaptchaText');

function unlockSite() {
    if (isCaptchaPassed) return;
    isCaptchaPassed = true;
    
    // Анимация исчезновения капчи
    if (captchaOverlay) {
        captchaOverlay.classList.add('hidden');
    }
    
    // Разблокируем сайт
    document.body.classList.remove('captcha-blocked');
    document.body.classList.add('captcha-unlocked');
    document.body.style.overflow = '';
    
    // Убираем фильтр blur
    setTimeout(() => {
        document.body.style.filter = '';
    }, 500);
    
    console.log('✅ Капча пройдена, сайт разблокирован');
}

function updateThumbPosition(x) {
    if (!captchaThumb || !captchaTrack) return;
    
    const trackRect = captchaTrack.getBoundingClientRect();
    const maxLeftCalc = trackRect.width - 56; // 56px ширина ползунка
    
    let newLeft = Math.max(0, Math.min(maxLeftCalc, x));
    captchaThumb.style.left = newLeft + 'px';
    
    // Проверка, достиг ли ползунок конца
    if (newLeft >= maxLeftCalc - 10 && !isCaptchaPassed) {
        // Капча пройдена
        if (captchaSuccess) captchaSuccess.style.display = 'flex';
        if (captchaText) captchaText.style.display = 'none';
        if (captchaThumb) {
            captchaThumb.style.cursor = 'default';
            captchaThumb.style.background = '#10b981';
            captchaThumb.innerHTML = '<i class="fas fa-check"></i>';
        }
        isDraggingCaptcha = false;
        
        // Разблокируем сайт
        setTimeout(() => {
            unlockSite();
        }, 500);
    }
}

function initCaptcha() {
    if (!captchaThumb || !captchaTrack) {
        console.error('Капча элементы не найдены');
        return;
    }
    
    // Получаем максимальное смещение
    const trackRect = captchaTrack.getBoundingClientRect();
    maxLeft = trackRect.width - 56;
    
    // Обработчики для мыши
    captchaThumb.addEventListener('mousedown', (e) => {
        if (isCaptchaPassed) return;
        e.preventDefault();
        e.stopPropagation();
        isDraggingCaptcha = true;
        const thumbRect = captchaThumb.getBoundingClientRect();
        captchaStartX = e.clientX - thumbRect.left;
        captchaThumb.style.cursor = 'grabbing';
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDraggingCaptcha || isCaptchaPassed) return;
        e.preventDefault();
        
        const thumbRect = captchaThumb.getBoundingClientRect();
        const trackRect = captchaTrack.getBoundingClientRect();
        let newX = e.clientX - trackRect.left - (thumbRect.width / 2);
        
        updateThumbPosition(newX);
    });
    
    document.addEventListener('mouseup', () => {
        if (isCaptchaPassed) return;
        isDraggingCaptcha = false;
        if (captchaThumb) captchaThumb.style.cursor = 'grab';
        
        // Если не дошел до конца, возвращаем в начало
        const currentLeft = parseInt(captchaThumb.style.left) || 0;
        if (currentLeft < maxLeft - 20 && !isCaptchaPassed) {
            captchaThumb.style.left = '0px';
        }
    });
    
    // Обработчики для сенсорных экранов
    captchaThumb.addEventListener('touchstart', (e) => {
        if (isCaptchaPassed) return;
        e.preventDefault();
        e.stopPropagation();
        isDraggingCaptcha = true;
        const touch = e.touches[0];
        const thumbRect = captchaThumb.getBoundingClientRect();
        captchaStartX = touch.clientX - thumbRect.left;
    });
    
    document.addEventListener('touchmove', (e) => {
        if (!isDraggingCaptcha || isCaptchaPassed) return;
        e.preventDefault();
        
        const touch = e.touches[0];
        const trackRect = captchaTrack.getBoundingClientRect();
        const thumbRect = captchaThumb.getBoundingClientRect();
        let newX = touch.clientX - trackRect.left - (thumbRect.width / 2);
        
        updateThumbPosition(newX);
    });
    
    document.addEventListener('touchend', () => {
        if (isCaptchaPassed) return;
        isDraggingCaptcha = false;
        const currentLeft = parseInt(captchaThumb.style.left) || 0;
        
        if (currentLeft < maxLeft - 20 && !isCaptchaPassed) {
            captchaThumb.style.left = '0px';
        }
    });
    
    console.log('✅ Капча инициализирована');
}

// Запускаем капчу после полной загрузки страницы
window.addEventListener('load', () => {
    setTimeout(() => {
        initCaptcha();
    }, 100);
});

// Блокируем все кнопки до прохождения капчи
document.addEventListener('click', (e) => {
    if (!isCaptchaPassed) {
        // Проверяем, не является ли клик по ползунку капчи
        if (e.target.closest('.site-captcha-thumb')) {
            return; // Разрешаем клик по ползунку
        }
        
        e.preventDefault();
        e.stopPropagation();
        
        // Визуальный фидбек
        const captchaModal = document.querySelector('.site-captcha-modal');
        if (captchaModal) {
            captchaModal.style.animation = 'shake 0.3s ease';
            setTimeout(() => {
                captchaModal.style.animation = '';
            }, 300);
        }
        return false;
    }
}, true);

// ---------- COOKIE УВЕДОМЛЕНИЕ ----------
const cookieConsent = document.getElementById('cookieConsent');
const acceptBtn = document.getElementById('acceptCookies');
const declineBtn = document.getElementById('declineCookies');

// Проверяем, было ли уже принято согласие
function checkCookieConsent() {
    const consent = localStorage.getItem('cookieConsent');
    if (consent === 'accepted' || consent === 'declined') {
        cookieConsent.classList.add('hide');
    }
}

// Сохраняем согласие и скрываем уведомление
function setCookieConsent(choice) {
    localStorage.setItem('cookieConsent', choice);
    cookieConsent.classList.add('hide');
    
    // Если пользователь согласился, можно добавить аналитику
    if (choice === 'accepted') {
        console.log('✅ Пользователь принял cookies');
        // Здесь можно инициализировать Google Analytics, Яндекс.Метрику и т.д.
        // initAnalytics();
    } else {
        console.log('❌ Пользователь отклонил cookies');
        // Здесь можно отключить трекинг
    }
}

// Обработчики кнопок
if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
        setCookieConsent('accepted');
    });
}

if (declineBtn) {
    declineBtn.addEventListener('click', () => {
        setCookieConsent('declined');
    });
}

// Проверяем при загрузке страницы
checkCookieConsent();

// ---------- БУРГЕР-МЕНЮ ДЛЯ МОБИЛЬНЫХ ----------
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Закрываем меню при клике на ссылку
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.querySelector('i').classList.remove('fa-times');
            mobileMenuBtn.querySelector('i').classList.add('fa-bars');
        });
    });
}

console.log("Сайт готов, основной фокус");

