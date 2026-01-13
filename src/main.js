/**
 * ASTRO-KUBE.BLOG - Официальный скрипт платформы (2026)
 * Весь функционал в одном файле:
 * 1. Навигация и Мобильное меню
 * 2. Анимации при скролле (Intersection Observer)
 * 3. Интерактивные табы (Преимущества)
 * 4. Прогресс-линия "Стрим" (Инновации)
 * 5. Контактная форма (Валидация + Капча)
 * 6. Cookie Popup
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. ИНИЦИАЛИЗАЦИЯ ИКОНОК ---
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // --- 2. ХЕДЕР И МОБИЛЬНОЕ МЕНЮ ---
    const header = document.getElementById('header');
    const burger = document.getElementById('burger-menu');
    const navMenu = document.getElementById('nav-menu');
    const body = document.body;
    const navLinks = document.querySelectorAll('.nav__link');

    // Эффект при скролле (прозрачность хедера)
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    });

    // Бургер-меню
    if (burger) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            navMenu.classList.toggle('active');
            body.classList.toggle('no-scroll');
        });
    }

    // Плавный скролл и закрытие меню при клике на ссылку
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Закрываем мобильное меню если оно открыто
                burger.classList.remove('active');
                navMenu.classList.remove('active');
                body.classList.remove('no-scroll');

                // Плавная прокрутка
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 3. АНИМАЦИИ ПОЯВЛЕНИЯ (Intersection Observer) ---
    const observerOptions = { threshold: 0.15 };
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal--active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // --- 4. ИНТЕРАКТИВНЫЕ ВКЛАДКИ ---
    const tabButtons = document.querySelectorAll('.tabs__btn');
    const tabPanels = document.querySelectorAll('.tabs__panel');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;
            
            tabButtons.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));
            
            btn.classList.add('active');
            const targetPanel = document.getElementById(target);
            if (targetPanel) {
                targetPanel.classList.add('active');
                if (typeof lucide !== 'undefined') lucide.createIcons(); // Перерисовываем иконки
            }
        });
    });

    // --- 5. ПРОГРЕСС-ЛИНИЯ В СЕКЦИИ "ИННОВАЦИОННЫЙ СТРИМ" ---
    const streamSection = document.querySelector('.stream');
    const progressLine = document.getElementById('stream-progress');
    
    if (streamSection && progressLine) {
        window.addEventListener('scroll', () => {
            const sectionRect = streamSection.getBoundingClientRect();
            const sectionHeight = streamSection.offsetHeight;
            
            // Расчет процента заполнения линии в зависимости от положения на экране
            let scrollPercent = ((window.innerHeight - sectionRect.top) / (sectionHeight + window.innerHeight)) * 100;
            scrollPercent = Math.min(Math.max(scrollPercent, 0), 100);
            
            progressLine.style.height = `${scrollPercent}%`;
        });
    }

    // --- 6. КОНТАКТНАЯ ФОРМА (Валидация + Капча) ---
    const contactForm = document.getElementById('main-form');
    const successMessage = document.getElementById('form-success');
    const phoneInput = document.getElementById('phone-input');
    const captchaQ = document.getElementById('captcha-question');
    const captchaA = document.getElementById('captcha-answer');
    let captchaResult;

    // Генерация математической капчи
    function generateCaptcha() {
        if (!captchaQ) return;
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        captchaResult = a + b;
        captchaQ.innerText = `${a} + ${b}`;
    }

    // Валидация телефона: только цифры и знак плюс
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9+]/g, '');
        });
    }

    if (contactForm) {
        generateCaptcha();
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Проверка капчи
            if (parseInt(captchaA.value) !== captchaResult) {
                alert('Неправильный ответ капчи! Пожалуйста, решите пример снова.');
                generateCaptcha();
                captchaA.value = '';
                return;
            }

            const btn = document.getElementById('submit-btn');
            btn.classList.add('btn--loading');
            btn.innerHTML = '<span>Отправка...</span>';

            // Имитация AJAX-запроса
            setTimeout(() => {
                contactForm.style.display = 'none';
                successMessage.style.display = 'flex';
                btn.classList.remove('btn--loading');
            }, 1500);
        });
    }

    // Глобальная функция сброса формы (для кнопки "Отправить еще раз")
    window.resetForm = () => {
        contactForm.reset();
        contactForm.style.display = 'block';
        successMessage.style.display = 'none';
        generateCaptcha();
    };

    // --- 7. COOKIE POPUP ---
    const cookiePopup = document.getElementById('cookie-popup');
    const cookieAccept = document.getElementById('cookie-accept');

    if (cookiePopup && cookieAccept) {
        // Показываем плашку только если согласие еще не дано
        if (!localStorage.getItem('astro_cookie_accepted')) {
            setTimeout(() => {
                cookiePopup.classList.add('cookie-popup--active');
            }, 2000);
        }

        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('astro_cookie_accepted', 'true');
            cookiePopup.classList.remove('cookie-popup--active');
        });
    }
});