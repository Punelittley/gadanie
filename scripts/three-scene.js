/**
 * Three.js 3D Сцена АРКАНУМ ТАРО
 * - Высокая производительность (чистые 60-120 FPS без просадок)
 * - Музейное качество гравюр благодаря TAROT_ART
 * - Безупречный кинематографичный флип карты спереди к зрителю
 * - Плавный динамический разлет карт в 3D при прокрутке страницы
 */

class Tarot3DScene {
    constructor(canvasContainerId) {
        this.container = document.getElementById(canvasContainerId);
        if (!this.container) return;

        this.scene = null;
        this.camera = null;
        this.renderer = null;

        this.deckGroup = null;
        this.mainCardMesh = null;
        this.sideCards = [];
        this.sacredAltarMesh = null;
        this.starDust = null;

        this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
        this.scrollY = 0;
        this.targetScrollY = 0;

        this.isFlipping = false;
        this.isRevealed = false;
        this.currentCard = null;

        this.init();
    }

    init() {
        const width = this.container.clientWidth || 360;
        const height = this.container.clientHeight || 480;

        // 1. Сцена
        this.scene = new THREE.Scene();

        // 2. Камера с адаптивным расстоянием
        this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
        this.updateCameraDimensions();

        // 3. Высокопроизводительный рендерер
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(width, height, false);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        this.container.appendChild(this.renderer.domElement);

        // 4. Мягкое и ясное освещение
        const ambientLight = new THREE.AmbientLight(0xfff5e6, 1.4);
        this.scene.add(ambientLight);

        const goldSunLight = new THREE.DirectionalLight(0xfde047, 2.8);
        goldSunLight.position.set(4, 5, 6);
        this.scene.add(goldSunLight);

        const rimVioletLight = new THREE.DirectionalLight(0xa855f7, 1.6);
        rimVioletLight.position.set(-4, -3, 3);
        this.scene.add(rimVioletLight);

        // 5. Текстуры (гравюры)
        this.cardBackTexture = this.generateBackTexture();
        this.cardFrontTexture = this.generateFrontTexture(null);

        // 6. Сборка 3D-колоды
        this.deckGroup = new THREE.Group();
        this.scene.add(this.deckGroup);

        this.createAltarBase();
        this.createTarotDeck();
        this.createStarParticles();

        // 7. События
        this.setupEvents();

        // 8. Анимационный цикл
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    // Роскошная рубашка с золотым тиснением
    generateBackTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 840;
        const ctx = canvas.getContext('2d');

        // Глубокий бархатный фон
        const grad = ctx.createRadialGradient(256, 420, 20, 256, 420, 460);
        grad.addColorStop(0, '#1c1038');
        grad.addColorStop(0.65, '#0c051e');
        grad.addColorStop(1, '#05020c');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 512, 840);

        // Барочная золотая рамка
        if (window.TAROT_ART) {
            window.TAROT_ART.drawOrnateFrame(ctx, 512, 840);
        }

        // Сакральная мандала в центре
        ctx.save();
        ctx.translate(256, 420);

        // Золотые лучи солнца
        ctx.strokeStyle = 'rgba(245, 208, 97, 0.6)';
        ctx.lineWidth = 2;
        for (let i = 0; i < 24; i++) {
            ctx.rotate((Math.PI * 2) / 24);
            ctx.beginPath();
            ctx.moveTo(0, -60);
            ctx.lineTo(0, -170);
            ctx.stroke();

            ctx.fillStyle = '#f5d061';
            ctx.beginPath();
            ctx.arc(0, -145, 3.5, 0, Math.PI * 2);
            ctx.fill();
        }

        // Концентрические окружности
        ctx.strokeStyle = '#f5d061';
        ctx.lineWidth = 2;
        [45, 85, 125, 165].forEach(r => {
            ctx.beginPath();
            ctx.arc(0, 0, r, 0, Math.PI * 2);
            ctx.stroke();
        });

        // Лик Луны и Солнца
        ctx.fillStyle = '#f5d061';
        ctx.beginPath();
        ctx.arc(0, 0, 36, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#0c051e';
        ctx.beginPath();
        ctx.arc(12, -4, 30, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // Надпись
        ctx.font = '700 17px "Cinzel", "Georgia", serif';
        ctx.fillStyle = 'rgba(250, 225, 156, 0.85)';
        ctx.textAlign = 'center';
        ctx.letterSpacing = '3px';
        ctx.fillText('✦   А Р К А Н У М   ✦', 256, 75);
        ctx.fillText('✦   О Б И Т Е Л Ь   Т А Р О   ✦', 256, 788);

        const tex = new THREE.CanvasTexture(canvas);
        tex.anisotropy = 4;
        return tex;
    }

    // Роскошная лицевая гравюра аркана
    generateFrontTexture(card) {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 840;
        const ctx = canvas.getContext('2d');

        // Темный благородный фон
        const grad = ctx.createRadialGradient(256, 420, 20, 256, 420, 460);
        grad.addColorStop(0, '#1c1236');
        grad.addColorStop(0.65, '#0d0620');
        grad.addColorStop(1, '#05020d');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 512, 840);

        // Рамка
        if (window.TAROT_ART) {
            window.TAROT_ART.drawOrnateFrame(ctx, 512, 840);
        }

        // Римская цифра сверху
        ctx.font = 'bold 36px "Cinzel", "Georgia", serif';
        ctx.fillStyle = '#fae19c';
        ctx.textAlign = 'center';
        ctx.fillText(card ? card.roman : '✦', 256, 92);

        // Окно иллюстрации
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(60, 130, 392, 465);

        // Мягкое золотистое или цветное свечение
        const auraColor = card ? card.themeColor : '#e5b95c';
        const aura = ctx.createRadialGradient(256, 360, 20, 256, 360, 210);
        aura.addColorStop(0, auraColor + '55');
        aura.addColorStop(0.6, auraColor + '15');
        aura.addColorStop(1, 'transparent');
        ctx.fillStyle = aura;
        ctx.fillRect(61, 131, 390, 463);

        // Высокодетализированная музейная гравюра аркана
        if (window.TAROT_ART) {
            window.TAROT_ART.drawCardArt(ctx, card ? card.artType : 'world', 256, 360);
        }

        // Название аркана (на чистом русском языке)
        ctx.font = 'bold 30px "Cinzel", "Georgia", serif';
        ctx.fillStyle = '#fff4d1';
        ctx.textAlign = 'center';
        const title = card ? card.name : 'ПРИКОСНИТЕСЬ К КОЛОДЕ';
        ctx.fillText(title, 256, 655);

        // Ключевые слова
        ctx.font = '600 15px "Montserrat", sans-serif';
        ctx.fillStyle = 'rgba(250, 225, 156, 0.85)';
        if (card && card.keywords) {
            ctx.fillText(card.keywords.slice(0, 3).join('  •  '), 256, 694);
        } else {
            ctx.fillText('Нажмите, чтобы открыть послание', 256, 694);
        }

        // Разделитель
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(150, 735);
        ctx.lineTo(362, 735);
        ctx.stroke();

        ctx.fillStyle = '#f5d061';
        ctx.beginPath();
        ctx.arc(256, 735, 4, 0, Math.PI * 2);
        ctx.fill();

        const tex = new THREE.CanvasTexture(canvas);
        tex.anisotropy = 4;
        return tex;
    }

    createAltarBase() {
        const ringGeo = new THREE.RingGeometry(1.8, 2.7, 48);
        const ringMat = new THREE.MeshBasicMaterial({
            color: 0xd4af37,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.22
        });
        this.sacredAltarMesh = new THREE.Mesh(ringGeo, ringMat);
        this.sacredAltarMesh.rotation.x = Math.PI / 2.3;
        this.sacredAltarMesh.position.y = -2.1;
        this.deckGroup.add(this.sacredAltarMesh);
    }

    createTarotDeck() {
        const edgeMaterial = new THREE.MeshStandardMaterial({
            color: 0xd4af37,
            metalness: 0.9,
            roughness: 0.25
        });

        const frontMat = new THREE.MeshStandardMaterial({
            map: this.cardFrontTexture,
            roughness: 0.35,
            metalness: 0.15
        });

        const backMat = new THREE.MeshStandardMaterial({
            map: this.cardBackTexture,
            roughness: 0.35,
            metalness: 0.15
        });

        const cardGeo = new THREE.BoxGeometry(2.55, 4.25, 0.04);

        // Нижние карты колоды для объема и красивого разлета при скролле
        for (let i = 0; i < 2; i++) {
            const mesh = new THREE.Mesh(cardGeo, [
                edgeMaterial, edgeMaterial, edgeMaterial, edgeMaterial, backMat, backMat
            ]);
            // Рубашкой к пользователю
            mesh.rotation.y = Math.PI;
            mesh.position.set((i + 1) * -0.07, (i + 1) * -0.06, (i + 1) * -0.1);
            mesh.userData = { baseX: (i + 1) * -0.07, baseY: (i + 1) * -0.06, baseZ: (i + 1) * -0.1, baseRotY: Math.PI, idx: i + 1 };
            this.deckGroup.add(mesh);
            this.sideCards.push(mesh);
        }

        // Главная карта сверху колоды
        this.mainCardMesh = new THREE.Mesh(cardGeo, [
            edgeMaterial, edgeMaterial, edgeMaterial, edgeMaterial, frontMat, backMat
        ]);
        // ИСХОДНОЕ СОСТОЯНИЕ: строго рубашкой к зрителю!
        this.mainCardMesh.rotation.y = Math.PI;
        this.mainCardMesh.position.set(0, 0, 0);
        this.deckGroup.add(this.mainCardMesh);
    }

    createStarParticles() {
        const count = 160;
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 14;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;
        }

        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        const mat = new THREE.PointsMaterial({
            color: 0xf5d061,
            size: 0.05,
            transparent: true,
            opacity: 0.6
        });

        this.starDust = new THREE.Points(geo, mat);
        this.scene.add(this.starDust);
    }

    setupEvents() {
        window.addEventListener('mousemove', (e) => {
            const rect = this.container.getBoundingClientRect();
            this.mouse.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.targetY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        }, { passive: true });

        window.addEventListener('scroll', () => {
            this.targetScrollY = window.scrollY;
        }, { passive: true });

        window.addEventListener('resize', () => {
            this.updateCameraDimensions();
        });

        this.container.addEventListener('click', () => {
            if (!this.isFlipping) {
                window.dispatchEvent(new CustomEvent('requestDailyTarotDraw'));
            }
        });
    }

    updateCameraDimensions() {
        if (!this.container || !this.camera) return;
        const w = this.container.clientWidth || 320;
        const h = this.container.clientHeight || 420;
        this.camera.aspect = w / h;

        // Адаптивное отдаление камеры в зависимости от ширины экрана
        if (w < 380) {
            this.camera.position.set(0, 0.05, 10.8);
        } else if (w < 480) {
            this.camera.position.set(0, 0.08, 9.4);
        } else if (w < 600) {
            this.camera.position.set(0, 0.1, 8.2);
        } else {
            this.camera.position.set(0, 0.15, 6.9);
        }

        this.camera.updateProjectionMatrix();
        if (this.renderer) {
            this.renderer.setSize(w, h, false);
        }
    }

    // ИДЕАЛЬНЫЙ ФЛИП КАРТЫ С КИНЕМАТОГРАФИЧНЫМ ПОЛЕТОМ ВПЕРЕД
    drawCard(cardData, callback) {
        if (this.isFlipping) return;
        this.isFlipping = true;
        this.currentCard = cardData;

        // Создаем детальную лицевую гравюру
        const newFrontTex = this.generateFrontTexture(cardData);
        this.mainCardMesh.material[4].map.dispose();
        this.mainCardMesh.material[4].map = newFrontTex;
        this.mainCardMesh.material[4].needsUpdate = true;

        const startTime = performance.now();
        const duration = 1200; // 1.2 секунды кинематографичной анимации

        const startRotY = this.mainCardMesh.rotation.y;
        // Если карта уже была открыта (повторный клик) — поворачиваем на 360°, если с рубашки — от Math.PI к 0
        const totalRot = (startRotY === 0) ? Math.PI * 2 : -startRotY;

        const frameStep = (now) => {
            const elapsed = now - startTime;
            const p = Math.min(elapsed / duration, 1);

            // Кубическая функция плавности
            const ease = p < 0.5
                ? 4 * p * p * p
                : 1 - Math.pow(-2 * p + 2, 3) / 2;

            // Вращение карты
            this.mainCardMesh.rotation.y = startRotY + totalRot * ease;

            // Взлет карты вперед к зрителю и мягкое опускание
            this.mainCardMesh.position.z = Math.sin(p * Math.PI) * 1.8;
            this.mainCardMesh.position.y = Math.sin(p * Math.PI) * 0.4;

            if (p < 1) {
                requestAnimationFrame(frameStep);
            } else {
                this.mainCardMesh.rotation.y = 0; // строго лицом к зрителю
                this.mainCardMesh.position.z = 0;
                this.mainCardMesh.position.y = 0;
                this.isFlipping = false;
                this.isRevealed = true;
                if (callback) callback();
            }
        };

        requestAnimationFrame(frameStep);
    }

    animate() {
        requestAnimationFrame(this.animate);

        // Плавный скролл и мышь
        this.scrollY += (this.targetScrollY - this.scrollY) * 0.08;
        this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.06;
        this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.06;

        // ДИНАМИЧЕСКИЙ РАЗЛЕТ КАРТ ПРИ СКРОЛЛЕ (3D Spread)
        const scrollFactor = Math.min(Math.max(this.scrollY / 500, 0), 2.2);
        const isMobile = (this.container && this.container.clientWidth < 500);
        const spreadX = isMobile ? 0.35 : 0.85;

        this.sideCards.forEach((mesh, idx) => {
            const dir = idx === 0 ? -1 : 1;
            mesh.position.x = mesh.userData.baseX + dir * (scrollFactor * spreadX);
            mesh.position.y = mesh.userData.baseY - (scrollFactor * 0.4);
            mesh.position.z = mesh.userData.baseZ - (scrollFactor * 0.45);
            mesh.rotation.z = dir * (scrollFactor * 0.22);
            mesh.rotation.y = Math.PI + dir * (scrollFactor * 0.15);
        });

        // Вращение золотого алтарного круга
        if (this.sacredAltarMesh) {
            this.sacredAltarMesh.rotation.z += 0.0025;
        }

        // Общий наклон колоды за курсором мыши (без резких рывков)
        if (this.deckGroup) {
            this.deckGroup.rotation.x = -this.mouse.y * 0.18 + (scrollFactor * 0.06);
            this.deckGroup.rotation.y = this.mouse.x * 0.25;
            this.deckGroup.position.y = Math.sin(performance.now() * 0.0014) * 0.08 - (scrollFactor * 0.25);
        }

        this.renderer.render(this.scene, this.camera);
    }
}

window.Tarot3DScene = Tarot3DScene;
