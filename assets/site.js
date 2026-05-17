// G-Group — shared site behaviors
(function () {
    'use strict';

    // ---------- Header scroll state ----------
    const header = document.getElementById('header');
    if (header) {
        const onScroll = () => {
            if (window.scrollY > 32) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    // ---------- Mobile menu ----------
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuClose = document.getElementById('mobileMenuClose');

    const openMenu = () => {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
        mobileMenuBtn && mobileMenuBtn.setAttribute('aria-expanded', 'true');
    };
    const closeMenu = () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
        mobileMenuBtn && mobileMenuBtn.setAttribute('aria-expanded', 'false');
    };

    if (mobileMenu && mobileMenuBtn) {
        mobileMenuBtn.setAttribute('aria-controls', 'mobileMenu');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.addEventListener('click', openMenu);
        mobileMenuClose && mobileMenuClose.addEventListener('click', closeMenu);
        mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) closeMenu();
        });
    }

    // ---------- Reveal on scroll ----------
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && revealEls.length) {
        const io = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('in');
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
        revealEls.forEach(el => io.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('in'));
    }

    // ---------- Animated count-up for stats ----------
    const counters = document.querySelectorAll('[data-count]');
    if ('IntersectionObserver' in window && counters.length) {
        const animate = (el) => {
            const target = parseFloat(el.dataset.count);
            const suffix = el.dataset.suffix || '';
            const duration = 1600;
            const start = performance.now();
            const tick = (now) => {
                const t = Math.min(1, (now - start) / duration);
                const eased = 1 - Math.pow(1 - t, 3);
                const val = target >= 100 ? Math.round(target * eased) : (target * eased).toFixed(0);
                el.textContent = val + suffix;
                if (t < 1) requestAnimationFrame(tick);
                else el.textContent = target + suffix;
            };
            requestAnimationFrame(tick);
        };
        const cio = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) { animate(e.target); cio.unobserve(e.target); }
            });
        }, { threshold: 0.4 });
        counters.forEach(c => cio.observe(c));
    }

    // ---------- Footer year ----------
    document.querySelectorAll('[data-year]').forEach(el => {
        el.textContent = new Date().getFullYear();
    });
})();
