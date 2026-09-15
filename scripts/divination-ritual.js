/**
 * АРКАНУМ ТАРО — Интерактивный ритуал персонального гадания с проверкой прошлого,
 * анамнезом ситуации и ИИ-диалогом с мастером Александрой.
 * 
 * Шаг 1: Выбор сферы и персональных данных (имя, дата рождения)
 * Шаг 2: Проверка прошлого (калибровка резонанса за последние 1–2 месяца)
 * Шаг 3: Уточняющие вопросы мастера (анамнез: длительность, главный страх, контекст)
 * Шаг 4: Интерактивный веер из 22 карт — пользователь САМ вытягивает 3 карты
 * Шаг 5: Раскрытие триады карт + Интерактивный ИИ-собеседник мастера Таро в реальном времени
 */

(function() {
    'use strict';

    // 1. База Арканов Судьбы (22 Старших Аркана)
    const DESTINY_ARCANA_DATA = {
        1: {
            title: "I • Маг — Архитектор Реальности",
            desc: "Сильная воля, дар убеждения и способность материализовать задуманное. Ваша уязвимость — распыление сил на несколько целей одновременно и спад интереса, когда проходит первоначальный азарт."
        },
        2: {
            title: "II • Верховная Жрица — Хранительница Интуиции",
            desc: "Глубокая природная эмпатия, умение считывать скрытые мотивы и фальшь за секунды. Главный вызов — не закрываться в себе и не подавлять чувства из-за страха быть ранимой."
        },
        3: {
            title: "III • Императрица — Творец Изобилия",
            desc: "Энергия созидания, плодородия и создания комфорта. Вы умеете взращивать любые начинания. Ловушка — стремление всё контролировать и гиперопека, от которой устают окружающие."
        },
        4: {
            title: "IV • Император — Опора и Структура",
            desc: "Врожденный лидер и стратег. Вы цените надежность, порядок и данное слово. Задача развития — учиться гибкости и не превращать разумную дисциплину в жесткую стену отчуждения."
        },
        5: {
            title: "V • Иерофант — Мудрость и Ценности",
            desc: "Носитель глубинных традиций и авторитета. К вам тянутся за поддержкой и советом. Остерегайтесь догматизма, категоричности и желания переделать других под свои правила."
        },
        6: {
            title: "VI • Влюбленные — Сердечный Выбор",
            desc: "Аркан магнетизма, вкуса и искренних связей. Ваша жизнь — это постоянный диалог с сердцем. Главный урок — смелость делать однозначный выбор и не застревать в мучительных сомнениях."
        },
        7: {
            title: "VII • Колесница — Триумф Воли",
            desc: "Динамика, амбиции и прорыв сквозь преграды. Вы способны преодолеть любой кризис за счет упорства. Опасность — эмоциональное выгорание от постоянного режима борьбы."
        },
        8: {
            title: "VIII • Сила — Внутреннее Благородство",
            desc: "Мощнейший энергетический потенциал. Вы умеете мягкостью и терпением добиваться того, перед чем бессилен любой напор. Учитесь вовремя восполнять внутренний ресурс."
        },
        9: {
            title: "IX • Отшельник — Глубинный Смысл",
            desc: "Самодостаточность, аналитический склад ума и поиск сути. Вы не гонитесь за внешней мишурой. Остерегайтесь излишней самоизоляции и привычки закрываться от близких людей."
        },
        10: {
            title: "X • Колесо Фортуны — Поток и Синхрония",
            desc: "Чутье на удачный момент и гибкость. Вы тонко чувствуете циклы жизни. Главное правило — не бороться с неизбежными переменами, а вовремя ловить попутный ветер."
        },
        11: {
            title: "XI • Справедливость — Баланс и Истина",
            desc: "Честность, трезвый взгляд на мир и обостренное чувство порядка. Вы умеете взвешивать факты без иллюзий. Точка роста — проявление милосердия к человеческим слабостям."
        },
        12: {
            title: "XII • Повешенный — Нестандартное Видение",
            desc: "Умение видеть скрытые смыслы там, где другие заходят в тупик. Главный жизненный урок — не приносить себя в жертву ради неблагодарных людей и вовремя говорить твердое «нет»."
        },
        13: {
            title: "XIII • Трансформация — Перерождение",
            desc: "Колоссальный потенциал обновления. Вы способны сжигать мосты к отжившему и возрождаться сильнее прежнего. Учитесь отпускать прошлое без боли и самоедства."
        },
        14: {
            title: "XIV • Умеренность — Внутренняя Гармония",
            desc: "Терпение, душевное равновесие и дар целительства. Вы прирожденный миротворец. Избегайте болота пассивности и не бойтесь заявлять о своих амбициях громко."
        },
        15: {
            title: "XV • Теневая Сила — Магнетизм и Власть",
            desc: "Невероятная харизма, финансовое чутье и виденье темных сторон людей. Вам подвластны большие материальные энергии. Главный вызов — не стать рабом зависимостей и манипуляций."
        },
        16: {
            title: "XVI • Башня — Освобождение от Иллюзий",
            desc: "Катализатор перемен. Вы не терпите лживых конструкций. После любого шторма вы заново строите жизнь на истинном, нерушимом фундаменте."
        },
        17: {
            title: "XVII • Звезда — Надежда и Вдохновение",
            desc: "Светлая энергия веры, талант и путеводная интуиция. Вы вдохновляете других. Главное — подкреплять возвышенные мечты конкретными практическими делами."
        },
        18: {
            title: "XVIII • Луна — Тайны Подсознания",
            desc: "Богатое воображение, вещие сны и высокая чувствительность. Вы тонко чувствуете скрытые течения. Остерегайтесь мнительности, страхов и привычки накручивать себя."
        },
        19: {
            title: "XIX • Солнце — Счастье и Реализация",
            desc: "Теплый и щедрый архетип. Вы притягиваете успех и радость. Берегите себя от эгоцентризма и обиды, когда окружающие не отвечают вам тем же уровнем отдачи."
        },
        20: {
            title: "XX • Страшный Суд — Пробуждение",
            desc: "Связь с родовыми программами, духовное прозрение и верность призванию. Время услышать свой внутренний голос и смело перевернуть страницу жизни."
        },
        21: {
            title: "XXI • Мир — Целостность",
            desc: "Масштабное мышление, мудрость и завершение долгих циклов. Вам тесно в узких рамках. Вы способны выходить на качественно новый жизненный уровень."
        },
        22: {
            title: "XXII (0) • Шут — Свобода и Новый Шаг",
            desc: "Чистота восприятия, независимость от стереотипов и готовность начать с нуля. Ваша задача — развивать осознанность и не допускать легкомыслия в важных обязательствах."
        }
    };

    // Текущее состояние ритуала
    const state = {
        step: 1,
        sphere: 'love',
        userName: '',
        birthDate: '',
        destinyArcanaNum: 1,
        // Сверка фокуса (без эффекта Барнума):
        userFocus: 'Чувствую, что вкладываюсь больше, чем получаю взамен',
        // Анамнез ситуации:
        duration: '1–3 месяца',
        mainFear: 'Сделать неверный шаг',
        userNotes: '',
        // Карты:
        shuffledCards: [],
        chosenCards: [],
        // Диалог с ИИ:
        chatMessages: []
    };

    // Нумерологический расчет Аркана Судьбы
    function calculateDestinyArcana(dateStr) {
        if (!dateStr) return 1;
        const [year, month, day] = dateStr.split('-').map(Number);
        if (!day || !month || !year) return 1;

        const digits = (String(day) + String(month) + String(year)).split('').map(Number);
        let totalSum = digits.reduce((acc, curr) => acc + curr, 0);

        while (totalSum > 22) {
            totalSum -= 22;
        }
        return totalSum === 0 ? 22 : totalSum;
    }

    // Инициализация
    function init() {
        const ritualContainer = document.getElementById('interactive-divination-ritual');
        if (!ritualContainer) return;

        setupStep1();
        setupStep2();
        setupStep3();
    }

    // ШАГ 1: ВЫБОР СФЕРЫ И ДАННЫХ
    function setupStep1() {
        const sphereBtns = document.querySelectorAll('.sphere-select-btn');
        sphereBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                sphereBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.sphere = btn.dataset.sphere || 'love';
            });
        });

        const startBtn = document.getElementById('start-ritual-btn');
        if (startBtn) {
            startBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const nameInput = document.getElementById('ritual-user-name');
                const dateInput = document.getElementById('ritual-birth-date');
                const errorEl = document.getElementById('ritual-step1-error');

                const nameVal = nameInput ? nameInput.value.trim() : '';
                const dateVal = dateInput ? dateInput.value.trim() : '';

                // Сброс предыдущих ошибок
                if (errorEl) {
                    errorEl.style.display = 'none';
                    errorEl.textContent = '';
                }
                if (nameInput) nameInput.classList.remove('input-field-error');
                if (dateInput) dateInput.classList.remove('input-field-error');

                // Проверка имени
                if (!nameVal || nameVal.length < 2) {
                    if (errorEl) {
                        errorEl.style.display = 'block';
                        errorEl.textContent = 'Пожалуйста, укажите ваше имя — мастеру необходимо настроиться на ваш личный канал.';
                    }
                    if (nameInput) {
                        nameInput.classList.add('input-field-error');
                        nameInput.focus();
                    }
                    return;
                }

                // Проверка даты рождения
                if (!dateVal) {
                    if (errorEl) {
                        errorEl.style.display = 'block';
                        errorEl.textContent = 'Пожалуйста, выберите дату вашего рождения — она строго необходима для расчета Аркана Судьбы.';
                    }
                    if (dateInput) {
                        dateInput.classList.add('input-field-error');
                        dateInput.focus();
                    }
                    return;
                }

                // Проверка реалистичности года
                const year = parseInt(dateVal.split('-')[0], 10);
                const currentYear = new Date().getFullYear();
                if (isNaN(year) || year < 1920 || year > currentYear - 12) {
                    if (errorEl) {
                        errorEl.style.display = 'block';
                        errorEl.textContent = 'Пожалуйста, укажите корректную дату рождения (от 1920 года).';
                    }
                    if (dateInput) {
                        dateInput.classList.add('input-field-error');
                        dateInput.focus();
                    }
                    return;
                }

                state.userName = nameVal;
                state.birthDate = dateVal;
                state.destinyArcanaNum = calculateDestinyArcana(state.birthDate);
                goToStep2(); // Переход к Проверке Прошлого (калибровке)
            });
        }
    }

    // ШАГ 2: СВЕРКА ФОКУСА СИТУАЦИИ (ЧЕСТНАЯ КАЛИБРОВКА БЕЗ БАРНУМА)
    function goToStep2() {
        state.step = 2;
        hideAllSteps();
        const step2El = document.getElementById('ritual-step-2');
        if (!step2El) return;
        step2El.classList.add('active');

        const pastUserBadge = document.getElementById('resonance-user-badge');
        if (pastUserBadge) {
            const sphereTitle = SPHERE_CONFIG[state.sphere] ? SPHERE_CONFIG[state.sphere].title : 'Общая ситуация';
            pastUserBadge.innerHTML = `<i class="fas fa-compass"></i> Сверка фокуса: ${escapeHtml(state.userName)} • Сфера: ${sphereTitle}`;
        }

        const statusText = document.getElementById('resonance-status-text');
        if (statusText) {
            statusText.textContent = 'Настройка фокуса...';
            setTimeout(() => {
                statusText.textContent = 'Поле откалибровано';
            }, 500);
        }

        step2El.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function setupStep2() {
        const optionBtns = document.querySelectorAll('.focus-option-btn');
        const customWrap = document.getElementById('focus-custom-wrap');
        const customInput = document.getElementById('focus-custom-input');
        const confirmPastBtn = document.getElementById('confirm-past-resonance-btn');

        optionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                optionBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const focusVal = btn.dataset.focus;
                if (focusVal === 'custom') {
                    if (customWrap) customWrap.style.display = 'block';
                    if (customInput) {
                        customInput.focus();
                        state.userFocus = customInput.value.trim() || 'Индивидуальный контекст ситуации';
                    }
                } else {
                    if (customWrap) customWrap.style.display = 'none';
                    state.userFocus = focusVal;
                }
            });
        });

        if (customInput) {
            customInput.addEventListener('input', (e) => {
                state.userFocus = e.target.value.trim() || 'Индивидуальный контекст ситуации';
            });
        }

        if (confirmPastBtn) {
            confirmPastBtn.addEventListener('click', () => {
                const activeBtn = document.querySelector('.focus-option-btn.active');
                if (activeBtn && activeBtn.dataset.focus === 'custom' && customInput) {
                    state.userFocus = customInput.value.trim() || 'Индивидуальный контекст ситуации';
                }
                goToStep3(); // Переход к Уточняющим вопросам (анамнезу)
            });
        }
    }

    // ШАГ 3: УТОЧНЯЮЩИЕ ВОПРОСЫ МАСТЕРА (АНАМНЕЗ)
    function goToStep3() {
        state.step = 3;
        hideAllSteps();
        const step3El = document.getElementById('ritual-step-3');
        if (!step3El) return;
        step3El.classList.add('active');

        const titleEl = document.getElementById('anamnesis-title');
        if (titleEl) {
            titleEl.textContent = `Уточнение запроса для ${state.userName}`;
        }

        step3El.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function setupStep3() {
        // Выбор длительности
        const durBtns = document.querySelectorAll('.dur-pill-btn');
        durBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                durBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.duration = btn.dataset.dur || '1–3 месяца';
            });
        });

        // Выбор страха
        const fearBtns = document.querySelectorAll('.fear-pill-btn');
        fearBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                fearBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.mainFear = btn.dataset.fear || 'Сделать неверный шаг';
            });
        });

        // Переход к тасованию карт
        const proceedShuffleBtn = document.getElementById('to-fan-deck-btn');
        if (proceedShuffleBtn) {
            proceedShuffleBtn.addEventListener('click', () => {
                const notesInput = document.getElementById('anamnesis-notes');
                if (notesInput) {
                    state.userNotes = notesInput.value.trim();
                }
                goToStep4(); // Переход к Интерактивному вееру карт
            });
        }
    }

    // ШАГ 4: ИНТЕРАКТИВНЫЙ ВЕЕР ИЗ 22 КАРТ
    function goToStep4() {
        state.step = 4;
        state.chosenCards = [];
        hideAllSteps();

        const step4El = document.getElementById('ritual-step-4');
        if (!step4El) return;
        step4El.classList.add('active');

        // Перемешиваем колоду из 22 Старших Арканов
        if (typeof TAROT_CARDS !== 'undefined') {
            state.shuffledCards = [...TAROT_CARDS].sort(() => Math.random() - 0.5);
        } else {
            state.shuffledCards = [];
        }

        renderCardFan();
        updateSelectedSlotsUI();

        step4El.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function renderCardFan() {
        const fanContainer = document.getElementById('tarot-fan-deck');
        if (!fanContainer) return;
        fanContainer.innerHTML = '';

        const total = 22;

        state.shuffledCards.forEach((card, idx) => {
            const cardEl = document.createElement('div');
            cardEl.className = 'fan-card';
            cardEl.dataset.index = idx;

            const angle = -42 + (84 / (total - 1)) * idx;
            const rad = (angle * Math.PI) / 180;
            const xOffset = Math.sin(rad) * 280;
            const yOffset = (1 - Math.cos(rad)) * 60;

            cardEl.style.setProperty('--fan-angle', `${angle}deg`);
            cardEl.style.setProperty('--fan-x', `${xOffset}px`);
            cardEl.style.setProperty('--fan-y', `${yOffset}px`);
            cardEl.style.zIndex = idx + 1;

            cardEl.innerHTML = `
                <div class="fan-card-inner">
                    <div class="fan-card-back">
                        <div class="fan-back-pattern">
                            <i class="fas fa-sun"></i>
                        </div>
                        <div class="fan-back-corner top-left">✦</div>
                        <div class="fan-back-corner bottom-right">✦</div>
                    </div>
                </div>
            `;

            cardEl.addEventListener('click', () => {
                handleFanCardClick(idx, cardEl);
            });

            fanContainer.appendChild(cardEl);
        });
    }

    function handleFanCardClick(cardIndex, cardEl) {
        if (state.chosenCards.length >= 3) return;
        if (cardEl.classList.contains('picked')) return;

        const cardData = state.shuffledCards[cardIndex];
        if (!cardData) return;

        cardEl.classList.add('picked');
        state.chosenCards.push(cardData);

        updateSelectedSlotsUI();

        if (state.chosenCards.length === 3) {
            const openSpreadBtn = document.getElementById('open-spread-btn');
            if (openSpreadBtn) {
                openSpreadBtn.removeAttribute('disabled');
                openSpreadBtn.classList.remove('btn-disabled');
                openSpreadBtn.classList.add('btn-gold', 'pulse-gold-btn');
                openSpreadBtn.innerHTML = '<i class="fas fa-eye"></i> ✦ Открыть тайну вашего расклада ✦';
                openSpreadBtn.onclick = () => {
                    goToStep5(); // Раскрытие триады и запуск ИИ-диалога
                };
            }
        }
    }

    function updateSelectedSlotsUI() {
        const sphereConfig = SPHERE_CONFIG[state.sphere] || SPHERE_CONFIG.love;
        const countBadge = document.getElementById('fan-picked-count');
        if (countBadge) {
            countBadge.textContent = `Выбрано ${state.chosenCards.length} из 3 карт`;
        }

        for (let i = 1; i <= 3; i++) {
            const slotEl = document.getElementById(`picked-slot-${i}`);
            const titleEl = document.getElementById(`picked-slot-label-${i}`);
            
            if (titleEl) {
                titleEl.textContent = i === 1 ? sphereConfig.pos1 : (i === 2 ? sphereConfig.pos2 : sphereConfig.pos3);
            }

            if (!slotEl) continue;

            const card = state.chosenCards[i - 1];
            if (card) {
                slotEl.classList.add('has-card');
                slotEl.innerHTML = `
                    <div class="picked-card-preview">
                        <div class="preview-roman">${card.roman}</div>
                        <div class="preview-name">${card.name}</div>
                        <div class="preview-status"><i class="fas fa-check"></i> Выбрана</div>
                    </div>
                `;
            } else {
                slotEl.classList.remove('has-card');
                slotEl.innerHTML = `
                    <div class="picked-slot-empty">
                        <div class="slot-plus-icon">+</div>
                        <span>Выберите карту из веера</span>
                    </div>
                `;
            }
        }
    }

    // ШАГ 5: РАСКРЫТИЕ ТРИАДЫ И ИНТЕРАКТИВНЫЙ ИИ-СОБЕСЕДНИК
    function goToStep5() {
        state.step = 5;
        hideAllSteps();

        const step5El = document.getElementById('ritual-step-5');
        if (!step5El) return;
        step5El.classList.add('active');

        // Сохраняем все данные в sessionStorage
        try {
            sessionStorage.setItem('arcanum_chosen_cards', JSON.stringify(state.chosenCards));
            sessionStorage.setItem('arcanum_user_profile', JSON.stringify({
                name: state.userName,
                birthDate: state.birthDate,
                sphere: state.sphere,
                sphereTitle: SPHERE_CONFIG[state.sphere].title,
                destinyArcanaNum: state.destinyArcanaNum,
                duration: state.duration,
                mainFear: state.mainFear,
                userNotes: state.userNotes
            }));
        } catch (e) {
            console.warn('SessionStorage error:', e);
        }

        renderStep5Cards();
        initAIConsultationChat();

        step5El.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function renderStep5Cards() {
        const sphereConfig = SPHERE_CONFIG[state.sphere] || SPHERE_CONFIG.love;
        const posLabels = [sphereConfig.pos1, sphereConfig.pos2, sphereConfig.pos3];

        state.chosenCards.forEach((card, idx) => {
            const cardSlot = document.getElementById(`step5-card-${idx + 1}`);
            if (!cardSlot) return;

            cardSlot.innerHTML = `
                <div class="step4-card-box">
                    <div class="step4-pos-badge">Позиция ${idx + 1}: ${posLabels[idx]}</div>
                    <div class="step4-card-visual">
                        <div class="step4-roman">${card.roman}</div>
                        <div class="step4-art-symbol">
                            <i class="${getIconForCard(card.artType)}"></i>
                        </div>
                        <div class="step4-name">${card.name}</div>
                        <div class="step4-subtitle">${card.subtitle}</div>
                    </div>
                    <div class="step4-card-desc">
                        <div class="step4-meaning">${card.meaning}</div>
                        <div class="step4-advice-box">
                            <strong><i class="fas fa-compass"></i> Совет:</strong> ${card.advice}
                        </div>
                    </div>
                </div>
            `;
        });
    }

    // ИНТЕРАКТИВНЫЙ ИИ-СОБЕСЕДНИК (МАСТЕР АЛЕКСАНДРА)
    function initAIConsultationChat() {
        const chatMessagesContainer = document.getElementById('ai-chat-messages');
        const chatForm = document.getElementById('ai-chat-form');
        const chatInput = document.getElementById('ai-chat-input');
        if (!chatMessagesContainer) return;

        chatMessagesContainer.innerHTML = '';
        state.chatMessages = [];

        // Формируем первое глубокое персональное сообщение от мастера Александры
        const c1 = state.chosenCards[0];
        const c2 = state.chosenCards[1];
        const c3 = state.chosenCards[2];

        const initialGreeting = `Здравствуйте, ${state.userName}! Я внимательно изучила вашу ситуацию в сфере «${SPHERE_CONFIG[state.sphere].title}». В качестве ключевого фокуса вы отметили: «${state.userFocus}». Ситуация продолжается ${state.duration.toLowerCase()}, и главный волнующий фактор — «${state.mainFear.toLowerCase()}». Выпавшая триада (${c1.name} — ${c2.name} — ${c3.name}) прямо раскрывает эту динамику. Вы можете задать мне любой уточняющий вопрос по вашему раскладу прямо здесь — напишите его в поле ниже, и я дам подробный разбор.`;

        showMasterMessage(initialGreeting);

        // Обработка отправки вопроса пользователя
        if (chatForm && !chatForm.dataset.listenerAttached) {
            chatForm.dataset.listenerAttached = 'true';
            chatForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const text = chatInput.value.trim();
                if (!text) return;

                // Сообщение пользователя
                addUserMessage(text);
                chatInput.value = '';
                chatInput.focus();

                // Показываем индикатор набора текста Александрой
                showTypingIndicator();

                // Ответ ИИ через 1.4 секунды
                setTimeout(() => {
                    removeTypingIndicator();
                    const aiReply = generateAIResponse(text);
                    showMasterMessage(aiReply);
                }, 1400);
            });
        }
    }

    function addUserMessage(text) {
        const container = document.getElementById('ai-chat-messages');
        if (!container) return;

        const msgEl = document.createElement('div');
        msgEl.className = 'chat-bubble user-msg';
        msgEl.innerHTML = `
            <div class="msg-content">${escapeHtml(text)}</div>
            <span class="msg-time">${getCurrentTimeStr()}</span>
        `;
        container.appendChild(msgEl);
        container.scrollTop = container.scrollHeight;
    }

    function showMasterMessage(text) {
        const container = document.getElementById('ai-chat-messages');
        if (!container) return;

        const msgEl = document.createElement('div');
        msgEl.className = 'chat-bubble master-msg';
        msgEl.innerHTML = `
            <div class="msg-author-header">
                <span class="author-avatar">А</span>
                <span class="author-name">Александра • Мастер</span>
            </div>
            <div class="msg-content">${text}</div>
            <span class="msg-time">${getCurrentTimeStr()}</span>
        `;
        container.appendChild(msgEl);
        container.scrollTop = container.scrollHeight;

        // Сохраняем в сессию
        state.chatMessages.push({ role: 'master', text: text });
        try {
            sessionStorage.setItem('arcanum_chat_history', JSON.stringify(state.chatMessages));
        } catch (e) {}
    }

    function showTypingIndicator() {
        const container = document.getElementById('ai-chat-messages');
        if (!container) return;

        const typingEl = document.createElement('div');
        typingEl.id = 'ai-typing-indicator';
        typingEl.className = 'chat-typing-bubble';
        typingEl.innerHTML = `
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span style="font-size: 0.8rem; color: var(--gold-300); margin-left: 6px;">Александра анализирует карты...</span>
        `;
        container.appendChild(typingEl);
        container.scrollTop = container.scrollHeight;
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('ai-typing-indicator');
        if (indicator) indicator.remove();
    }

    // Интеллектуальный генератор ответов мастера на основе символизма карт и вопроса
    function generateAIResponse(userQuestion) {
        const q = userQuestion.toLowerCase();
        const c1 = state.chosenCards[0] || { name: "Аркан истока", advice: "сохраняйте спокойствие" };
        const c2 = state.chosenCards[1] || { name: "Аркан напряжения", advice: "будьте честны с собой" };
        const c3 = state.chosenCards[2] || { name: "Аркан совета", advice: "доверьтесь развитию событий" };

        let reply = "";

        if (q.includes("писать") || q.includes("звонить") || q.includes("первый шаг") || q.includes("проявиться")) {
            reply = `По вопросу первого шага: второй Аркан (${c2.name}) показывает, что пауза сейчас работает на вас. Если вы начнете форсировать события из чувства тревоги, ситуация вернется в прежнюю точку напряжения. Карта ${c3.name} советует выждать момент внутренней устойчивости. Проявлять инициативу стоит только тогда, когда вами движет не страх потери, а спокойное достоинство.`;
        } else if (q.includes("чувств") || q.includes("любит") || q.includes("думает") || q.includes("партнер")) {
            reply = `Символы указывают, что в мыслях партнера сейчас идет внутренний пересмотр отношений. Аркан ${c1.name} подчеркивает, что привязанность есть, однако карта ${c2.name} указывает на накопленную усталость или страх быть уязвимым. Человек не закрыт наглухо, но ждет от вас не претензий, а эмоциональной безопасности и предсказуемости.`;
        } else if (q.includes("деньги") || q.includes("работ") || q.includes("уволь") || q.includes("бизнес") || q.includes("проект")) {
            reply = `В профессиональном плане карта ${c1.name} говорит о прочном фундаменте, но Аркан ${c2.name} предупреждает о распылении ресурсов. Не спешите совершать резких движений до завершения текущего цикла. Аркан ${c3.name} советует четко зафиксировать договоренности на бумаге и не полагаться на устные обещания коллег или руководства.`;
        } else if (q.includes("когда") || q.includes("срок") || q.includes("время") || q.includes("скоро")) {
            reply = `Таро отражает не жесткий календарь, а вызревание условий. Триада карт показывает, что кульминация ситуации наступит в ближайшие 4–8 недель. Переломный момент произойдет тогда, когда вы сами перестанете цепляться за старый сценарий и последуете совету карты ${c3.name}.`;
        } else {
            reply = `Относительно вашего вопроса «${escapeHtml(userQuestion)}»: Аркан ${c2.name} указывает, что корень сомнений лежит в желании тотально всё проконтролировать. Но расклад дает ясный ориентир: ${c3.advice} Обратите внимание на карту ${c1.name} — именно опора на ваш внутренний опыт позволит преодолеть страх «${state.mainFear.toLowerCase()}» и прийти к гармоничному исходу.`;
        }

        return reply;
    }

    function getIconForCard(artType) {
        switch (artType) {
            case 'world': return 'fas fa-earth-americas';
            case 'sun': return 'fas fa-sun';
            case 'star': return 'fas fa-star';
            case 'chariot': return 'fas fa-shield-halved';
            case 'justice': return 'fas fa-scale-balanced';
            case 'lovers': return 'fas fa-heart';
            case 'priestess': return 'fas fa-moon';
            case 'magician': return 'fas fa-wand-magic-sparkles';
            case 'emperor': return 'fas fa-crown';
            case 'empress': return 'fas fa-gem';
            case 'death': return 'fas fa-infinity';
            case 'hermit': return 'fas fa-lantern';
            case 'wheel': return 'fas fa-dharmachakra';
            case 'hanged': return 'fas fa-water';
            case 'temperance': return 'fas fa-hourglass-half';
            case 'devil': return 'fas fa-fire';
            case 'tower': return 'fas fa-bolt';
            case 'moon': return 'fas fa-moon';
            case 'judgment': return 'fas fa-bell';
            case 'fool': return 'fas fa-feather';
            default: return 'fas fa-eye';
        }
    }

    function hideAllSteps() {
        document.querySelectorAll('.ritual-step-container').forEach(el => {
            el.classList.remove('active');
        });
    }

    function getCurrentTimeStr() {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        return `${h}:${m}`;
    }

    function escapeHtml(str) {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
