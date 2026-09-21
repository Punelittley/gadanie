/**
 * Основная логика взаимодействия для АРКАНУМ ТАРО
 * Без эмодзи, с высокой производительностью и надежностью
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Инициализация 3D сцены Three.js
    let tarot3D = null;
    if (typeof Tarot3DScene !== 'undefined') {
        try {
            tarot3D = new Tarot3DScene('threejs-canvas-container');
        } catch (e) {
            console.warn('WebGL initialization:', e);
        }
    }

    // 2. Интерактив "Карта дня"
    const drawCardBtn = document.getElementById('draw-card-btn');
    const heroDrawBtn = document.getElementById('hero-draw-btn');
    const canvasCtaBtn = document.getElementById('canvas-cta-btn');

    const dailyCardTitle = document.getElementById('daily-card-title');
    const dailyCardSubtitle = document.getElementById('daily-card-subtitle');
    const dailyCardRoman = document.getElementById('daily-card-roman');
    const dailyCardIconFa = document.getElementById('daily-card-icon-fa');
    const dailyKeywords = document.getElementById('daily-keywords');
    const dailyMeaning = document.getElementById('daily-meaning');
    const dailyAdvice = document.getElementById('daily-advice');
    const dailyWarning = document.getElementById('daily-warning');
    const dailyAffirmation = document.getElementById('daily-affirmation');

    // Карта иконок FontAwesome для арканов (строго без эмодзи!)
    const FA_ICONS = {
        star: 'fa-star',
        sun: 'fa-sun',
        moon: 'fa-moon',
        justice: 'fa-scale-balanced',
        chariot: 'fa-shield-halved',
        lovers: 'fa-heart',
        emperor: 'fa-crown',
        empress: 'fa-spa',
        magician: 'fa-wand-magic-sparkles',
        fool: 'fa-feather-pointed',
        hierophant: 'fa-book-open',
        hermit: 'fa-lightbulb',
        wheel: 'fa-dharmachakra',
        hanged: 'fa-hourglass-half',
        transformation: 'fa-recycle',
        temperance: 'fa-infinity',
        shadow: 'fa-masks-theater',
        tower: 'fa-bolt',
        judgement: 'fa-bullhorn',
        world: 'fa-globe'
    };

    function executeDailyDraw() {
        if (!TAROT_CARDS || TAROT_CARDS.length === 0) return;

        // Выбираем случайный аркан
        const randomIndex = Math.floor(Math.random() * TAROT_CARDS.length);
        const card = TAROT_CARDS[randomIndex];

        // Блокируем кнопки во время анимации
        if (drawCardBtn) {
            drawCardBtn.disabled = true;
            drawCardBtn.innerHTML = '<span>✦ Перемешивание колоды... ✦</span>';
        }
        if (heroDrawBtn) heroDrawBtn.disabled = true;

        if (tarot3D) {
            tarot3D.drawCard(card, () => {
                updateDailyCardUI(card);
                showToast(`Аркан дня: ${card.name} (${card.roman})`);
                if (drawCardBtn) {
                    drawCardBtn.disabled = false;
                    drawCardBtn.innerHTML = '<span>✦ Вытянуть другой Аркан ✦</span>';
                }
                if (heroDrawBtn) heroDrawBtn.disabled = false;
            });
        } else {
            updateDailyCardUI(card);
            showToast(`Аркан дня: ${card.name} (${card.roman})`);
            if (drawCardBtn) {
                drawCardBtn.disabled = false;
                drawCardBtn.innerHTML = '<span>✦ Вытянуть другой Аркан ✦</span>';
            }
            if (heroDrawBtn) heroDrawBtn.disabled = false;
        }
    }

    function updateDailyCardUI(card) {
        if (dailyCardTitle) dailyCardTitle.textContent = card.name;
        if (dailyCardSubtitle) dailyCardSubtitle.textContent = card.subtitle;
        if (dailyCardRoman) dailyCardRoman.textContent = card.roman;

        if (dailyCardIconFa) {
            const iconClass = FA_ICONS[card.artType] || 'fa-star';
            dailyCardIconFa.className = `fas ${iconClass}`;
        }

        if (dailyKeywords) {
            dailyKeywords.innerHTML = card.keywords
                .map(k => `<span class="keyword-tag">${k}</span>`)
                .join('');
        }

        if (dailyMeaning) dailyMeaning.textContent = card.meaning;
        if (dailyAdvice) dailyAdvice.textContent = card.advice;
        if (dailyWarning) dailyWarning.textContent = card.warning;
        if (dailyAffirmation) dailyAffirmation.textContent = `«${card.affirmation}»`;
    }

    if (drawCardBtn) {
        drawCardBtn.addEventListener('click', executeDailyDraw);
    }
    if (heroDrawBtn) {
        heroDrawBtn.addEventListener('click', (e) => {
            const ritualSection = document.getElementById('interactive-divination-ritual');
            if (ritualSection) {
                e.preventDefault();
                ritualSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    if (canvasCtaBtn) {
        canvasCtaBtn.addEventListener('click', () => {
            const ritualSection = document.getElementById('interactive-divination-ritual');
            if (ritualSection) {
                ritualSection.scrollIntoView({ behavior: 'smooth' });
            } else {
                executeDailyDraw();
            }
        });
    }

    // Слушатель клика по 3D-холсту
    window.addEventListener('requestDailyTarotDraw', () => {
        executeDailyDraw();
    });

    // Устанавливаем стартовый аркан (Звезда)
    if (typeof TAROT_CARDS !== 'undefined' && TAROT_CARDS.length > 17) {
        updateDailyCardUI(TAROT_CARDS[17]);
    }

    // 3. Управление правовыми модальными окнами (Оферта и Политика)
    const modalOffer = document.getElementById('modal-offer');
    const modalPrivacy = document.getElementById('modal-privacy');
    const allModals = document.querySelectorAll('.modal-overlay');

    function openModal(modal) {
        if (!modal) return;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    allModals.forEach(modal => {
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => closeModal(modal));
        }
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal);
        });
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            allModals.forEach(m => closeModal(m));
        }
    });

    document.querySelectorAll('.open-offer-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(modalOffer);
        });
    });

    document.querySelectorAll('.open-privacy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(modalPrivacy);
        });
    });

    // 5. FAQ Аккордеон
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (questionBtn && answer) {
            questionBtn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    if (otherAnswer) otherAnswer.style.maxHeight = null;
                });

                if (!isActive) {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        }
    });

    // 6. Мобильное меню
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
        });

        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
            });
        });
    }

    // 7. Тост-уведомления (без эмодзи, с FontAwesome иконкой)
    window.showToast = function (message) {
        let toast = document.getElementById('toast-notice');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast-notice';
            toast.className = 'toast-notice';
            document.body.appendChild(toast);
        }

        toast.innerHTML = `<i class="fas fa-certificate" style="color: var(--gold-300);"></i> <span>${message}</span>`;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3200);
    };

    // 8. Баннер согласия на обработку файлов cookie (152-ФЗ РФ)
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept-btn');
    if (cookieBanner && cookieAcceptBtn) {
        if (!localStorage.getItem('arcanum_cookie_accepted')) {
            setTimeout(() => {
                cookieBanner.style.display = 'block';
            }, 800);
        }
        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('arcanum_cookie_accepted', 'true');
            cookieBanner.style.opacity = '0';
            cookieBanner.style.transform = 'translateY(20px)';
            cookieBanner.style.transition = 'all 0.3s ease';
            setTimeout(() => {
                cookieBanner.style.display = 'none';
            }, 300);
        });
    }
});

