/**
 * Легковесные визуальные эффекты и расчет фазы Луны
 * Оптимизировано под 60–120 FPS без лагов и без эмодзи
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Прогресс-бар скролла (аппаратно ускоренный)
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const pct = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
        progressBar.style.width = `${pct}%`;
    }, { passive: true });

    // 2. Плавное появление блоков при скролле (без тяжелого blur, только transform и opacity)
    const revealTargets = document.querySelectorAll(
        '.reveal-on-scroll, .service-card, .step-card, .review-card, .blog-card, .about-avatar-box, .about-content, .faq-item'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, (i % 3) * 70);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });

    revealTargets.forEach(el => {
        el.classList.add('reveal-prep');
        observer.observe(el);
    });

    // 3. Астрономический расчет фазы Луны (на русском языке, БЕЗ ЭМОДЗИ)
    function updateRussianMoonPhase() {
        const date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        if (month < 3) {
            year--;
            month += 12;
        }

        const a = Math.floor(year / 100);
        const b = Math.floor(a / 4);
        const c = 2 - a + b;
        const e = Math.floor(365.25 * (year + 4716));
        const f = Math.floor(30.6001 * (month + 1));
        const jd = c + day + e + f - 1524.5;
        const cycles = (jd - 2451549.5) / 29.53058867;
        const phase = cycles - Math.floor(cycles);

        let phaseName = 'Новолуние';
        let advice = 'Период закладки намерений и внутреннего спокойствия';

        if (phase > 0.03 && phase < 0.22) {
            phaseName = 'Растущий серп';
            advice = 'Благоприятное время для планирования и накопления сил';
        } else if (phase >= 0.22 && phase <= 0.28) {
            phaseName = 'Первая четверть';
            advice = 'Период активных первых шагов и преодоления сомнений';
        } else if (phase > 0.28 && phase < 0.47) {
            phaseName = 'Растущая Луна';
            advice = 'Оптимальное время для раскладов на карьеру, развитие и отношения';
        } else if (phase >= 0.47 && phase <= 0.53) {
            phaseName = 'Полнолуние';
            advice = 'Пик интуиции и ясновидения: максимальная глубина анализа ситуации';
        } else if (phase > 0.53 && phase < 0.72) {
            phaseName = 'Убывающая Луна';
            advice = 'Время подведения итогов, очищения от лишнего и благодарности';
        } else if (phase >= 0.72 && phase <= 0.78) {
            phaseName = 'Последняя четверть';
            advice = 'Благоприятно отпускать токсичные привязанности и завершать дела';
        } else if (phase > 0.78 && phase <= 0.97) {
            phaseName = 'Стареющий серп';
            advice = 'Время переоценки ценностей и подготовки к новому витку';
        }

        const moonEl = document.getElementById('current-moon-phase');
        if (moonEl) {
            moonEl.innerHTML = `<span class="moon-icon"><i class="fas fa-moon"></i></span> <strong>Лунный цикл: ${phaseName}</strong> <span class="moon-advice">— ${advice}</span>`;
        }
    }

    updateRussianMoonPhase();
});
