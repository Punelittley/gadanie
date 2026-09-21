/**
 * Arcanum Tarot - Cryptographic Access Guard v1.0
 * Provides encrypted token verification, paywall protection, tariff routing,
 * and automatic URL sanitization for post-payment redirects.
 */
(function (global) {
    'use strict';

    const MASTER_SALT = 'ArcanumTarotCipher2026_x7f9!';
    const MASTER_KEYS = ['arcanum_pass_2026', 'arcanum_7f9b2', 'paid_access', 'ARCANUM2026'];

    const TARIFF_PAGES = {
        day: 'reading-day.html',
        love: 'reading-love.html',
        career: 'reading-career.html',
        year: 'reading-year.html'
    };

    /**
     * Pure synchronous SHA-256 implementation
     */
    function sha256(ascii) {
        function rightRotate(value, amount) {
            return (value >>> amount) | (value << (32 - amount));
        }
        const mathPow = Math.pow;
        const maxWord = mathPow(2, 32);
        const lengthProperty = 'length';
        let i, j;
        let result = '';
        const words = [];
        const asciiBitLength = ascii[lengthProperty] * 8;
        let hash = [];
        const k = [];
        let primeCounter = 0;
        const isComposite = {};
        for (let candidate = 2; primeCounter < 64; candidate++) {
            if (!isComposite[candidate]) {
                for (i = 0; i < 313; i += candidate) isComposite[i] = candidate;
                hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
                k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
            }
        }
        ascii += '\x80';
        while (ascii[lengthProperty] % 64 - 56) ascii += '\x00';
        for (i = 0; i < ascii[lengthProperty]; i++) {
            j = ascii.charCodeAt(i);
            if (j >> 8) return '';
            words[i >> 2] |= j << ((3 - i) % 4) * 8;
        }
        words[words[lengthProperty]] = ((asciiBitLength / maxWord) | 0);
        words[words[lengthProperty]] = (asciiBitLength);
        for (j = 0; j < words[lengthProperty];) {
            const w = words.slice(j, j += 16);
            const oldHash = hash.slice(0);
            for (i = 0; i < 64; i++) {
                const i2 = i + j;
                const w15 = w[i - 15], w2 = w[i - 2];
                const a = hash[0], e = hash[4];
                const temp1 = hash[7]
                    + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25))
                    + ((e & hash[5]) ^ ((~e) & hash[6]))
                    + k[i]
                    + (w[i] = (i < 16) ? w[i] : (
                        w[i - 16]
                        + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3))
                        + w[i - 7]
                        + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
                    ) | 0
                    );
                const temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
                    + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
                hash = [(temp1 + temp2) | 0].concat(hash);
                hash[4] = (hash[4] + temp1) | 0;
            }
            for (i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
        }
        for (i = 0; i < 8; i++) {
            for (j = 3; j + 1; j--) {
                const b = (hash[i] >> (j * 8)) & 255;
                result += ((b < 16) ? '0' : '') + b.toString(16);
            }
        }
        return result;
    }

    /**
     * Decode base64url or standard base64 to hex string
     */
    function base64ToHex(str) {
        let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
        while (b64.length % 4) b64 += '=';
        const bin = atob(b64);
        let hex = '';
        for (let i = 0; i < bin.length; i++) {
            hex += ('0' + bin.charCodeAt(i).toString(16)).slice(-2);
        }
        return hex;
    }

    /**
     * Verify encrypted token (hex or base64url format)
     * Returns parsed payload object { t, ord, v } or null
     */
    function verifyToken(tokenStr) {
        if (!tokenStr || typeof tokenStr !== 'string') return null;
        let hex = tokenStr.trim();
        if (/^[A-Za-z0-9_-]{20,}$/.test(hex) && !/^[0-9a-fA-F]+$/.test(hex)) {
            try {
                hex = base64ToHex(hex);
            } catch (e) {
                return null;
            }
        }
        if (!/^[0-9a-fA-F]+$/.test(hex) || hex.length < 20) return null;

        try {
            let raw = '';
            for (let i = 0; i < hex.length; i += 2) {
                const code = parseInt(hex.substr(i, 2), 16) ^ MASTER_SALT.charCodeAt((i / 2) % MASTER_SALT.length);
                raw += String.fromCharCode(code);
            }
            const idx = raw.lastIndexOf('|');
            if (idx === -1) return null;
            const payload = raw.substring(0, idx);
            const sig = raw.substring(idx + 1);
            const expectedSig = sha256(MASTER_SALT + payload).substring(0, 16);
            if (sig !== expectedSig) return null;
            return JSON.parse(payload);
        } catch (e) {
            return null;
        }
    }

    /**
     * Sanitizes browser address bar without reload
     */
    function sanitizeAddressBar() {
        if (window.history && window.history.replaceState) {
            const cleanUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
        }
    }

    /**
     * Protect dedicated tariff page
     * @param {string} expectedTariff 'day' | 'love' | 'career' | 'year'
     */
    function protectPage(expectedTariff) {
        const urlParams = new URLSearchParams(window.location.search);
        const passedCandidate = (urlParams.get('auth') || urlParams.get('token') || urlParams.get('access') || urlParams.get('key') || '').trim();
        const storageKey = 'arcanum_access_' + expectedTariff;
        const storedAccess = localStorage.getItem(storageKey) || localStorage.getItem('arcanum_paid_access');

        const contentWrap = document.getElementById('reading-content-wrap');
        const paywallEl = document.getElementById('reading-paywall-modal');
        const toggleCodeBtn = document.getElementById('toggle-code-btn');
        const codeWrap = document.getElementById('paywall-code-wrap');
        const codeInput = document.getElementById('manual-access-input');
        const applyCodeBtn = document.getElementById('apply-code-btn');
        const codeError = document.getElementById('paywall-code-error');

        function unlock() {
            if (contentWrap) contentWrap.classList.remove('blurred-content');
            if (paywallEl) paywallEl.style.display = 'none';
        }

        function lock() {
            if (contentWrap) contentWrap.classList.add('blurred-content');
            if (paywallEl) paywallEl.style.display = 'flex';
        }

        let isGranted = false;

        // Check if passed parameter is a valid encrypted token matching this tariff
        const verifiedPayload = verifyToken(passedCandidate);
        if (verifiedPayload && verifiedPayload.t === expectedTariff) {
            isGranted = true;
        } else if (MASTER_KEYS.includes(passedCandidate)) {
            isGranted = true;
        } else if (storedAccess === 'granted') {
            isGranted = true;
        }

        if (isGranted) {
            localStorage.setItem(storageKey, 'granted');
            unlock();
            // Automatically wipe the token/key from the browser address bar for secrecy
            if (passedCandidate) {
                sanitizeAddressBar();
            }
        } else {
            lock();
        }

        // Manual code prompt logic
        if (toggleCodeBtn && codeWrap) {
            toggleCodeBtn.addEventListener('click', () => {
                const isHidden = codeWrap.style.display === 'none';
                codeWrap.style.display = isHidden ? 'block' : 'none';
                if (isHidden && codeInput) codeInput.focus();
            });
        }

        if (applyCodeBtn && codeInput) {
            const handleApply = () => {
                const code = codeInput.value.trim();
                const manualPayload = verifyToken(code);
                if ((manualPayload && manualPayload.t === expectedTariff) || MASTER_KEYS.includes(code)) {
                    localStorage.setItem(storageKey, 'granted');
                    if (codeError) codeError.style.display = 'none';
                    unlock();
                    sanitizeAddressBar();
                } else {
                    if (codeError) codeError.style.display = 'block';
                    codeInput.classList.add('input-field-error');
                }
            };

            applyCodeBtn.addEventListener('click', handleApply);
            codeInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    handleApply();
                }
            });
        }
    }

    /**
     * Universal Router for reading.html
     * Decrypts token and forwards immediately to the appropriate tariff protocol
     */
    function handleRouter() {
        const urlParams = new URLSearchParams(window.location.search);
        const passedCandidate = (urlParams.get('auth') || urlParams.get('token') || urlParams.get('access') || urlParams.get('key') || '').trim();
        const tariffParam = (urlParams.get('tariff') || '').toLowerCase();

        // 1. Check encrypted token
        const payload = verifyToken(passedCandidate);
        if (payload && payload.t && TARIFF_PAGES[payload.t]) {
            const targetPage = TARIFF_PAGES[payload.t];
            window.location.replace(targetPage + '?auth=' + encodeURIComponent(passedCandidate));
            return true;
        }

        // 2. Check query string tariff
        let redirectTarget = null;
        if (tariffParam.includes('день') || tariffParam.includes('day')) {
            redirectTarget = TARIFF_PAGES.day;
        } else if (tariffParam.includes('отношен') || tariffParam.includes('love') || tariffParam.includes('союз')) {
            redirectTarget = TARIFF_PAGES.love;
        } else if (tariffParam.includes('карьер') || tariffParam.includes('career') || tariffParam.includes('финанс')) {
            redirectTarget = TARIFF_PAGES.career;
        } else if (tariffParam.includes('год') || tariffParam.includes('year')) {
            redirectTarget = TARIFF_PAGES.year;
        }

        if (redirectTarget) {
            const paramArg = passedCandidate ? '?auth=' + encodeURIComponent(passedCandidate) : '';
            window.location.replace(redirectTarget + paramArg);
            return true;
        }

        return false;
    }

    global.ArcanumGuard = {
        verifyToken,
        protectPage,
        handleRouter,
        sanitizeAddressBar
    };

})(typeof window !== 'undefined' ? window : this);
