/**
 * Высокодетализированная художественная графика карт Таро в классическом стиле
 * Создает эффект старинной гравюры с золотым тиснением и винтажным пергаментом
 */

const TAROT_ART = {
    // Отрисовка винтажного пергаментного фона карты
    drawParchmentBackground(ctx, width, height) {
        // Базовый бархатно-обсидиановый градиент с теплым золотистым отливом
        const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 40, width / 2, height / 2, height * 0.65);
        bgGrad.addColorStop(0, '#1d1238');
        bgGrad.addColorStop(0.45, '#120a26');
        bgGrad.addColorStop(0.85, '#0a0518');
        bgGrad.addColorStop(1, '#04020a');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Тончайшая патина / легкая зернистость
        ctx.fillStyle = 'rgba(245, 208, 97, 0.02)';
        for (let i = 0; i < 240; i++) {
            const rx = Math.random() * width;
            const ry = Math.random() * height;
            ctx.fillRect(rx, ry, 1.5, 1.5);
        }
    },

    // Отрисовка барочной золотой рамки с угловыми виньетками
    drawOrnateFrame(ctx, width, height) {
        // Внешний золотой рельефный кант
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 4;
        ctx.strokeRect(16, 16, width - 32, height - 32);

        // Внутренняя филигранная линия
        ctx.strokeStyle = 'rgba(250, 225, 156, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(26, 26, width - 52, height - 52);

        // Внутренняя точечная линия
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(32, 32, width - 64, height - 64);
        ctx.setLineDash([]);

        // Угловые геральдические элементы
        const corners = [
            [26, 26, 1, 1],
            [width - 26, 26, -1, 1],
            [26, height - 26, 1, -1],
            [width - 26, height - 26, -1, -1]
        ];

        corners.forEach(([x, y, dx, dy]) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.strokeStyle = '#f5d061';
            ctx.lineWidth = 1.5;

            ctx.beginPath();
            ctx.moveTo(0, dy * 28);
            ctx.quadraticCurveTo(dx * 8, dy * 8, dx * 28, 0);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(dx * 9, dy * 9, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#f5d061';
            ctx.fill();

            ctx.restore();
        });
    },

    // Детализированная классическая иллюстрация Аркана
    drawCardArt(ctx, artType, cx, cy) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.strokeStyle = '#f5d061';
        ctx.fillStyle = '#f5d061';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        switch (artType) {
            case 'world': // XXI МИР
                // Овальный лавровый венок победы
                ctx.beginPath();
                ctx.ellipse(0, 0, 85, 125, 0, 0, Math.PI * 2);
                ctx.strokeStyle = '#fae19c';
                ctx.lineWidth = 3;
                ctx.stroke();

                // Листья лавра
                for (let a = 0; a < Math.PI * 2; a += Math.PI / 10) {
                    const lx = Math.cos(a) * 85;
                    const ly = Math.sin(a) * 125;
                    ctx.beginPath();
                    ctx.ellipse(lx, ly, 7, 4, a + 0.5, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(245, 208, 97, 0.4)';
                    ctx.fill();
                    ctx.stroke();
                }

                // Силуэт танцовщицы в центре
                ctx.beginPath();
                ctx.arc(0, -58, 12, 0, Math.PI * 2);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(0, -46);
                ctx.lineTo(0, -10);
                ctx.lineTo(-14, 45);
                ctx.moveTo(0, 5);
                ctx.lineTo(14, 15);
                ctx.lineTo(14, 45);
                ctx.stroke();

                // Два жезла могущества в руках
                ctx.beginPath();
                ctx.moveTo(-36, -38);
                ctx.lineTo(-36, 16);
                ctx.moveTo(36, -38);
                ctx.lineTo(36, 16);
                ctx.stroke();

                // Шлейф шелкового шарфа вокруг тела
                ctx.beginPath();
                ctx.moveTo(-30, -25);
                ctx.bezierCurveTo(-50, 10, 50, 10, 30, -25);
                ctx.bezierCurveTo(45, 30, -45, 40, 0, 60);
                ctx.strokeStyle = '#fff0c7';
                ctx.stroke();

                // 4 Стража по углам (Ангел, Орел, Лев, Бык)
                [[-110, -140], [110, -140], [-110, 140], [110, 140]].forEach(([gx, gy]) => {
                    ctx.beginPath();
                    ctx.arc(gx, gy, 16, 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(gx - 22, gy);
                    ctx.lineTo(gx + 22, gy);
                    ctx.moveTo(gx, gy - 22);
                    ctx.lineTo(gx, gy + 22);
                    ctx.stroke();
                });
                break;

            case 'sun': // XIX СОЛНЦЕ
                // Центральный лучистый диск
                ctx.beginPath();
                ctx.arc(0, 0, 55, 0, Math.PI * 2);
                ctx.lineWidth = 2.5;
                ctx.stroke();

                // Лик Солнца (гравюра)
                ctx.beginPath();
                ctx.arc(-16, -10, 4, 0, Math.PI * 2);
                ctx.arc(16, -10, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.moveTo(0, -6);
                ctx.lineTo(-4, 8);
                ctx.lineTo(4, 8);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(0, 16, 14, 0.2, Math.PI - 0.2);
                ctx.stroke();

                // 16 пламенеющих и прямых лучей
                for (let i = 0; i < 16; i++) {
                    const angle = (Math.PI * 2 / 16) * i;
                    ctx.save();
                    ctx.rotate(angle);
                    if (i % 2 === 0) {
                        ctx.beginPath();
                        ctx.moveTo(0, -60);
                        ctx.lineTo(0, -120);
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.arc(0, -123, 3, 0, Math.PI * 2);
                        ctx.fill();
                    } else {
                        ctx.beginPath();
                        ctx.moveTo(0, -60);
                        ctx.bezierCurveTo(14, -80, -14, -95, 0, -112);
                        ctx.stroke();
                    }
                    ctx.restore();
                }

                // Подсолнухи внизу
                [-75, 75].forEach(sx => {
                    ctx.beginPath();
                    ctx.arc(sx, 125, 20, 0, Math.PI * 2);
                    ctx.stroke();
                    for (let p = 0; p < Math.PI * 2; p += Math.PI / 4) {
                        ctx.beginPath();
                        ctx.ellipse(sx + Math.cos(p) * 22, 125 + Math.sin(p) * 22, 7, 4, p, 0, Math.PI * 2);
                        ctx.stroke();
                    }
                });
                break;

            case 'star': // XVII ЗВЕЗДА
                // Главная 8-конечная звезда
                for (let s = 0; s < 8; s++) {
                    ctx.save();
                    ctx.rotate((Math.PI * 2 / 8) * s);
                    ctx.beginPath();
                    ctx.moveTo(0, -88);
                    ctx.lineTo(14, -30);
                    ctx.lineTo(0, 0);
                    ctx.lineTo(-14, -30);
                    ctx.closePath();
                    ctx.stroke();
                    ctx.restore();
                }

                ctx.beginPath();
                ctx.arc(0, 0, 12, 0, Math.PI * 2);
                ctx.fill();

                // 7 меньших звезд созвездия
                const stars = [
                    [-85, -95], [85, -95],
                    [-115, -20], [115, -20],
                    [-75, 60], [75, 60],
                    [0, 120]
                ];
                stars.forEach(([sx, sy]) => {
                    ctx.save();
                    ctx.translate(sx, sy);
                    for (let k = 0; k < 4; k++) {
                        ctx.rotate(Math.PI / 2);
                        ctx.beginPath();
                        ctx.moveTo(0, -15);
                        ctx.lineTo(4, -4);
                        ctx.lineTo(0, 0);
                        ctx.lineTo(-4, -4);
                        ctx.closePath();
                        ctx.stroke();
                    }
                    ctx.restore();
                });

                // Волны воды на земле
                ctx.beginPath();
                ctx.moveTo(-60, 100);
                ctx.bezierCurveTo(-30, 120, 30, 120, 60, 100);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(-80, 115);
                ctx.bezierCurveTo(-40, 140, 40, 140, 80, 115);
                ctx.stroke();
                break;

            case 'chariot': // VII КОЛЕСНИЦА
                // Звездный полог
                ctx.strokeRect(-80, -120, 160, 45);
                for (let i = -60; i <= 60; i += 30) {
                    ctx.beginPath();
                    ctx.arc(i, -97, 4, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Корпус колесницы
                ctx.strokeRect(-55, -40, 110, 80);
                // Крылатый диск победы
                ctx.beginPath();
                ctx.arc(0, 0, 18, 0, Math.PI * 2);
                ctx.stroke();
                ctx.moveTo(-45, 0);
                ctx.lineTo(-18, 0);
                ctx.moveTo(18, 0);
                ctx.lineTo(45, 0);
                ctx.stroke();

                // Колеса со спицами
                [-75, 75].forEach(wx => {
                    ctx.beginPath();
                    ctx.arc(wx, 40, 32, 0, Math.PI * 2);
                    ctx.stroke();
                    for (let s = 0; s < Math.PI * 2; s += Math.PI / 4) {
                        ctx.beginPath();
                        ctx.moveTo(wx, 40);
                        ctx.lineTo(wx + Math.cos(s) * 32, 40 + Math.sin(s) * 32);
                        ctx.stroke();
                    }
                });

                // Скрещенные клинки победы
                ctx.beginPath();
                ctx.moveTo(-35, 70);
                ctx.lineTo(35, 130);
                ctx.moveTo(35, 70);
                ctx.lineTo(-35, 130);
                ctx.stroke();
                break;

            case 'justice': // XI СПРАВЕДЛИВОСТЬ
                // Вертикальный меч истины
                ctx.beginPath();
                ctx.moveTo(0, -120);
                ctx.lineTo(0, 95);
                ctx.lineWidth = 3;
                ctx.stroke();
                ctx.lineWidth = 2;

                ctx.beginPath();
                ctx.moveTo(-28, -80);
                ctx.lineTo(28, -80);
                ctx.stroke();

                // Коромысло весов
                ctx.beginPath();
                ctx.moveTo(-75, -50);
                ctx.lineTo(75, -50);
                ctx.stroke();

                // Чаши весов
                [-75, 75].forEach(vx => {
                    ctx.beginPath();
                    ctx.moveTo(vx, -50);
                    ctx.lineTo(vx - 22, -10);
                    ctx.moveTo(vx, -50);
                    ctx.lineTo(vx + 22, -10);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.arc(vx, -10, 22, 0, Math.PI);
                    ctx.closePath();
                    ctx.stroke();
                });

                // Ореол равновесия
                ctx.beginPath();
                ctx.arc(0, 0, 65, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(245, 208, 97, 0.4)';
                ctx.stroke();
                break;

            case 'lovers': // VI ВЛЮБЛЕННЫЕ
                // Ангел в облаках сверху
                ctx.beginPath();
                ctx.arc(0, -90, 18, 0, Math.PI * 2);
                ctx.stroke();
                // Крылья ангела
                ctx.beginPath();
                ctx.moveTo(0, -90);
                ctx.quadraticCurveTo(-65, -130, -100, -85);
                ctx.quadraticCurveTo(-50, -65, 0, -75);
                ctx.moveTo(0, -90);
                ctx.quadraticCurveTo(65, -130, 100, -85);
                ctx.quadraticCurveTo(50, -65, 0, -75);
                ctx.stroke();

                // Древо Жизни и Древо Познания
                [-70, 70].forEach(tx => {
                    ctx.beginPath();
                    ctx.moveTo(tx, 130);
                    ctx.lineTo(tx, 0);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(tx, -20, 28, 0, Math.PI * 2);
                    ctx.stroke();
                });

                // Два соединенных сердца в центре
                ctx.beginPath();
                ctx.arc(-14, 50, 16, Math.PI, 0);
                ctx.arc(14, 50, 16, Math.PI, 0);
                ctx.lineTo(0, 85);
                ctx.closePath();
                ctx.stroke();
                break;

            case 'priestess': // II ВЕРХОВНАЯ ЖРИЦА
                // Две колонны (Иахин и Воаз)
                [-85, 85].forEach((px, idx) => {
                    ctx.strokeRect(px - 14, -110, 28, 220);
                    ctx.font = 'bold 22px "Cinzel", Georgia, serif';
                    ctx.fillStyle = '#f5d061';
                    ctx.textAlign = 'center';
                    ctx.fillText(idx === 0 ? 'B' : 'J', px, 10);
                });

                // Покров тайны между колоннами
                ctx.strokeRect(-65, -90, 130, 180);

                // Рогатая лунная корона Исиды
                ctx.beginPath();
                ctx.arc(0, -50, 16, 0, Math.PI * 2);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(0, -50, 26, -Math.PI / 3, Math.PI / 3);
                ctx.stroke();

                // Серп Луны у ног
                ctx.beginPath();
                ctx.arc(0, 95, 34, 0, Math.PI);
                ctx.stroke();
                break;

            default: // Универсальное Всевидящее Око и Сакральная Роза
                ctx.beginPath();
                ctx.arc(0, 0, 110, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(245, 208, 97, 0.4)';
                ctx.stroke();

                for (let z = 0; z < 12; z++) {
                    ctx.rotate(Math.PI / 6);
                    ctx.beginPath();
                    ctx.moveTo(0, -95);
                    ctx.lineTo(0, -110);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(0, -85, 3, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.beginPath();
                ctx.moveTo(0, -75);
                ctx.lineTo(75, 0);
                ctx.lineTo(0, 75);
                ctx.lineTo(-75, 0);
                ctx.closePath();
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(-50, 0);
                ctx.quadraticCurveTo(0, -40, 50, 0);
                ctx.quadraticCurveTo(0, 40, -50, 0);
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(0, 0, 16, 0, Math.PI * 2);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(0, 0, 7, 0, Math.PI * 2);
                ctx.fill();
                break;
        }

        ctx.restore();
    }
};

window.TAROT_ART = TAROT_ART;
