document.addEventListener('DOMContentLoaded', () => {
    // ==================== Preloader ====================
    const preloader = document.querySelector('.preloader');
    const percentageText = document.querySelector('.preloader-percentage');
    const progressBar = document.querySelector('.preloader-progress');
    const minDisplayTime = 3000; // 3 seconds minimum display
    const fadeOutDuration = 800; // 0.8 second fade out
    let pageLoaded = false;
    let minTimeElapsed = false;
    let progress = 0;
    const targetProgress = 100;
    const increment = 1.5; // Smoother increment for progress
    const intervalTime = 50; // Faster updates for smoother animation
    const startTime = performance.now();

    if (preloader && percentageText && progressBar) {
        // Simulate smooth progress
        const progressInterval = setInterval(() => {
            if (progress < targetProgress) {
                progress = Math.min(progress + increment, targetProgress);
                percentageText.textContent = `${Math.round(progress)}%`;
                progressBar.style.width = `${progress}%`;
            } else {
                clearInterval(progressInterval);
            }
        }, intervalTime);

        // Start minimum display timer
        setTimeout(() => {
            minTimeElapsed = true;
            if (pageLoaded) hidePreloader();
        }, minDisplayTime);

        // Hide when page is loaded
        window.addEventListener('load', () => {
            pageLoaded = true;
            clearInterval(progressInterval);
            progress = targetProgress;
            percentageText.textContent = `${targetProgress}%`;
            progressBar.style.width = '100%';

            if (minTimeElapsed) {
                hidePreloader();
            } else {
                setTimeout(hidePreloader, minDisplayTime - (performance.now() - startTime));
            }
        });

        // Fallback in case load event doesn't fire
        setTimeout(() => {
            if (!pageLoaded) {
                clearInterval(progressInterval);
                progress = targetProgress;
                percentageText.textContent = `${targetProgress}%`;
                progressBar.style.width = '100%';
                hidePreloader();
            }
        }, minDisplayTime + 3000); // 6 seconds total maximum
    }

    function hidePreloader() {
        if (typeof gsap !== 'undefined') {
            gsap.to(preloader, {
                opacity: 0,
                duration: fadeOutDuration / 1000,
                ease: 'power2.out',
                onComplete: () => {
                    preloader.style.visibility = 'hidden';
                    preloader.style.display = 'none';
                    document.dispatchEvent(new Event('preloaderHidden'));
                }
            });
        } else {
            // Fallback if GSAP is not available
            preloader.classList.add('loaded');
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
                setTimeout(() => {
                    preloader.style.display = 'none';
                    document.dispatchEvent(new Event('preloaderHidden'));
                }, fadeOutDuration);
            }, 300);
        }
    }

    // ==================== Particles.js ====================
    if (document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": 100,
                    "density": { "enable": true, "value_area": 800 }
                },
                "color": { "value": "#8b5cf6" },
                "shape": {
                    "type": "circle",
                    "stroke": { "width": 0, "color": "#000000" }
                },
                "opacity": {
                    "value": 0.7,
                    "random": true,
                    "anim": { "enable": true, "speed": 1, "opacity_min": 0.3, "sync": false }
                },
                "size": {
                    "value": 4,
                    "random": true,
                    "anim": { "enable": true, "speed": 2, "size_min": 1, "sync": false }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 120,
                    "color": "#8b5cf6",
                    "opacity": 0.6,
                    "width": 1.5
                },
                "move": {
                    "enable": true,
                    "speed": 2.5,
                    "direction": "none",
                    "random": true,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": { "enable": true, "rotateX": 600, "rotateY": 1200 }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab",
                        "parallax": { "enable": true, "force": 60, "smooth": 10 }
                    },
                    "onclick": { "enable": true, "mode": "push" },
                    "resize": true
                },
                "modes": {
                    "grab": { "distance": 140, "line_linked": { "opacity": 1 } },
                    "bubble": { "distance": 400, "size": 40, "duration": 2, "opacity": 8, "speed": 3 },
                    "repulse": { "distance": 200, "duration": 0.4 },
                    "push": { "particles_nb": 4 },
                    "remove": { "particles_nb": 2 }
                }
            },
            "retina_detect": true
        });
    }

    // ==================== Typed.js ====================
    const typed = new Typed('.typing-text', {
        strings: [
            'Full-stack Development',
            'AI Development',
            'Software Development',
            'Web Development'
        ],
        typeSpeed: 50,
        backSpeed: 30,
        loop: true,
        backDelay: 1500,
        showCursor: true,
        cursorChar: '|'
    });

    // ==================== Splide.js ====================
    if (document.querySelector('#testimonialSlider')) {
        new Splide('#testimonialSlider', {
            type: 'loop',
            perPage: 1,
            autoplay: true,
            interval: 5000,
            pauseOnHover: true,
            arrows: false,
            pagination: true,
            breakpoints: { 768: { perPage: 1 } }
        }).mount();
    }

    // ==================== Navbar ====================
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        const sections = document.querySelectorAll('section[id]');
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (pageYOffset >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });

            document.querySelectorAll('.navbar .nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').substring(1) === current) {
                    link.classList.add('active');
                }
            });
        });
    }

    // ==================== Back to Top ====================
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        });

        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==================== Smooth Scroll ====================
    function smoothScrollTo(targetId) {
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        const navbar = document.querySelector('.navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        history.pushState(null, null, targetId);
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                smoothScrollTo(this.getAttribute('href'));
            }
        });
    });

    // Hero buttons
    const viewWorkBtn = document.getElementById('viewWorkBtn');
    const connectBtn = document.getElementById('connectBtn');

    if (viewWorkBtn) viewWorkBtn.addEventListener('click', (e) => {
        e.preventDefault();
        smoothScrollTo(viewWorkBtn.getAttribute('href'));
    });

    if (connectBtn) connectBtn.addEventListener('click', (e) => {
        e.preventDefault();
        smoothScrollTo(connectBtn.getAttribute('href'));
    });

    // ==================== Projects Filter ====================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterButtons.length && projectCards.length) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function () {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                const filterValue = this.getAttribute('data-filter');

                projectCards.forEach(card => {
                    card.style.display = (filterValue === 'all' || card.getAttribute('data-category') === filterValue)
                        ? 'block'
                        : 'none';
                });
            });
        });
    }

    // ==================== Form Validation ====================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            let isValid = true;
            const inputs = this.querySelectorAll('input, textarea');

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    input.classList.add('is-invalid');
                    isValid = false;
                } else {
                    input.classList.remove('is-invalid');
                }
            });

            if (isValid) {
                this.reset();
                alert('Message sent successfully!');
            }
        });
    }

    // ==================== GSAP Animations ====================
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        gsap.utils.toArray('section').forEach(section => {
            gsap.from(section, {
                scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none none' },
                opacity: 0, y: 50, duration: 1
            });
        });

        gsap.utils.toArray('.project-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: { trigger: card, start: 'top 80%', toggleActions: 'play none none none' },
                opacity: 0, y: 50, duration: 0.5, delay: i * 0.1
            });
        });

        gsap.utils.toArray('.skill-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: { trigger: card, start: 'top 80%', toggleActions: 'play none none none' },
                opacity: 0, x: i % 2 === 0 ? -50 : 50, duration: 0.5, delay: i * 0.1
            });
        });

        gsap.utils.toArray('.timeline-item').forEach((item, i) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                y: 50,
                duration: 0.8,
                delay: i * 0.2,
                ease: 'power2.out'
            });
        });
    }

    // ==================== Footer Year ====================
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // ==================== Skill Tooltips ====================
    document.querySelectorAll('.skill-icon img').forEach(icon => {
        const tooltip = document.createElement('div');
        tooltip.className = 'skill-tooltip';
        tooltip.textContent = icon.alt.replace(' icon', '');
        icon.parentNode.appendChild(tooltip);

        icon.addEventListener('mouseenter', () => {
            tooltip.style.opacity = '1';
            tooltip.style.visibility = 'visible';
        });

        icon.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
            tooltip.style.visibility = 'hidden';
        });
    });

    // ==================== Mobile Menu ====================
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.addEventListener('click', () => {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                new bootstrap.Collapse(navbarCollapse).hide();
            }
        });
    });

    // ==================== Particles Mobile Adjustment ====================
    function adjustParticlesForMobile() {
        if (window.innerWidth < 768) {
            if (typeof particlesJS !== 'undefined' && pJSDom.length) {
                pJSDom[0].pJS.particles.number.value = 60;
                pJSDom[0].pJS.particles.line_linked.distance = 100;
                pJSDom[0].pJS.fn.vendors.refresh();
            }
        }
    }

    window.addEventListener('resize', adjustParticlesForMobile);
    window.addEventListener('load', adjustParticlesForMobile);

    console.log('Main JavaScript file loaded successfully');
});