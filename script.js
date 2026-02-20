/* ============================
   Birthday Website - Main Script
   ============================ */

// ==================== LIGHTBOX FUNCTIONALITY ====================
(function () {
    const galleryItems = () => document.querySelectorAll('.gallery-item');
    let currentIndex = 0;

    window.openLightbox = function (el) {
        const items = galleryItems();
        currentIndex = Array.from(items).indexOf(el);
        const img = el.querySelector('img');
        const caption = el.querySelector('.gallery-overlay p');
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightboxImg');
        const lightboxCaption = document.getElementById('lightboxCaption');

        if (!img || !lightbox) return;

        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || '';
        lightboxCaption.textContent = caption ? caption.textContent : '';
        lightbox.style.visibility = 'visible';
        lightbox.style.opacity = '1';
        document.body.style.overflow = 'hidden';
    };

    window.closeLightbox = function (e) {
        // Only close if clicking the backdrop itself or the close button
        if (e && e.target && e.target.closest('.lightbox-content')) return;
        const lightbox = document.getElementById('lightbox');
        lightbox.style.opacity = '0';
        setTimeout(() => {
            lightbox.style.visibility = 'hidden';
            document.body.style.overflow = '';
        }, 400);
    };

    window.navigateLightbox = function (direction, e) {
        if (e) { e.stopPropagation(); e.preventDefault(); }
        const items = galleryItems();
        currentIndex = (currentIndex + direction + items.length) % items.length;
        const item = items[currentIndex];
        const img = item.querySelector('img');
        const caption = item.querySelector('.gallery-overlay p');
        const lightboxImg = document.getElementById('lightboxImg');
        const lightboxCaption = document.getElementById('lightboxCaption');

        // Fade transition
        lightboxImg.style.opacity = '0';
        setTimeout(() => {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt || '';
            lightboxCaption.textContent = caption ? caption.textContent : '';
            lightboxImg.style.opacity = '1';
        }, 200);
    };

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const lightbox = document.getElementById('lightbox');
        if (lightbox.style.visibility !== 'visible') return;
        if (e.key === 'Escape') closeLightbox(e);
        if (e.key === 'ArrowLeft') navigateLightbox(-1, e);
        if (e.key === 'ArrowRight') navigateLightbox(1, e);
    });
})();

document.addEventListener('DOMContentLoaded', () => {

    // ==================== PRELOADER ====================
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 2500);

    // ==================== INTRO OVERLAY ====================
    const introOverlay = document.getElementById('introOverlay');
    const openBtn = document.getElementById('openBtn');
    const navbar = document.getElementById('navbar');
    const musicToggle = document.getElementById('musicToggle');

    openBtn.addEventListener('click', () => {
        introOverlay.classList.add('hidden');
        navbar.classList.add('visible');
        musicToggle.classList.add('visible');
        document.body.style.overflow = 'auto';
        initParticles();
        startFloatingHearts();

        // Start background music
        const bgMusic = document.getElementById('bgMusic');
        if (bgMusic) {
            bgMusic.volume = 0.4;
            bgMusic.play().catch(() => { });
            musicToggle.classList.remove('muted');
        }
    });

    // Prevent scroll when intro is showing
    document.body.style.overflow = 'hidden';

    // ==================== NAVBAR SCROLL EFFECT ====================
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;

        // Update active nav link
        updateActiveNav();
    });

    function updateActiveNav() {
        const sections = ['hero', 'memories', 'gallery', 'letter'];
        const navLinks = document.querySelectorAll('.nav-link');

        let current = '';
        sections.forEach(id => {
            const section = document.getElementById(id);
            if (section) {
                const rect = section.getBoundingClientRect();
                if (rect.top <= 200) {
                    current = id;
                }
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // ==================== SCROLL ANIMATIONS ====================
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe timeline items
    document.querySelectorAll('.timeline-item').forEach(item => {
        observer.observe(item);
    });

    // Observe quote containers
    document.querySelectorAll('.quote-container').forEach(item => {
        observer.observe(item);
    });

    // Observe fade-in elements
    document.querySelectorAll('.fade-in').forEach(item => {
        observer.observe(item);
    });

    // ==================== REASONS CAROUSEL ====================
    const reasons = document.querySelectorAll('.reason');
    const dotsContainer = document.getElementById('carouselDots');
    let currentReason = 0;

    // Create dots
    reasons.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToReason(i));
        dotsContainer.appendChild(dot);
    });

    function goToReason(index) {
        reasons[currentReason].classList.remove('active');
        document.querySelectorAll('.carousel-dot')[currentReason].classList.remove('active');

        currentReason = index;

        reasons[currentReason].classList.add('active');
        document.querySelectorAll('.carousel-dot')[currentReason].classList.add('active');
    }

    // Auto-rotate
    setInterval(() => {
        goToReason((currentReason + 1) % reasons.length);
    }, 4000);

    // ==================== BIRTHDAY WISH / CONFETTI ====================
    const wishBtn = document.getElementById('wishBtn');
    const confettiContainer = document.getElementById('confettiContainer');
    const wishMessage = document.getElementById('wishMessage');

    wishBtn.addEventListener('click', () => {
        wishBtn.classList.add('clicked');
        launchConfetti();
        setTimeout(() => {
            wishMessage.classList.add('show');
        }, 800);

        // Crossfade: fade out bg music, start birthday song
        const bgMusic = document.getElementById('bgMusic');
        const birthdayMusic = document.getElementById('birthdayMusic');

        if (bgMusic && !bgMusic.paused) {
            // Smooth fade out over 2 seconds
            const fadeOut = setInterval(() => {
                if (bgMusic.volume > 0.05) {
                    bgMusic.volume = Math.max(0, bgMusic.volume - 0.02);
                } else {
                    bgMusic.pause();
                    bgMusic.volume = 0.4;
                    clearInterval(fadeOut);
                }
            }, 100);
        }

        // Start birthday song after a short delay for the crossfade
        setTimeout(() => {
            if (birthdayMusic && birthdayMusic.paused) {
                birthdayMusic.volume = 0;
                birthdayMusic.play().catch(() => { });
                // Fade in birthday song
                const fadeIn = setInterval(() => {
                    if (birthdayMusic.volume < 0.5) {
                        birthdayMusic.volume = Math.min(0.5, birthdayMusic.volume + 0.02);
                    } else {
                        clearInterval(fadeIn);
                    }
                }, 100);
                musicToggle.classList.remove('muted');
            }
        }, 1000);
    });

    function launchConfetti() {
        const colors = [
            '#e8456b', '#ff6b9d', '#f5af19', '#f12711',
            '#c44569', '#9b3a8c', '#6a3093', '#ffd0e0',
            '#d4a574', '#f8b4c8', '#ff4757', '#ffa502',
            '#2ed573', '#1e90ff', '#ff6348', '#eccc68'
        ];

        const shapes = ['circle', 'square', 'triangle'];

        for (let i = 0; i < 150; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                const color = colors[Math.floor(Math.random() * colors.length)];
                const shape = shapes[Math.floor(Math.random() * shapes.length)];
                const size = Math.random() * 12 + 6;
                const left = Math.random() * 100;
                const delay = Math.random() * 0.5;
                const duration = Math.random() * 2 + 2;

                confetti.style.left = `${left}%`;
                confetti.style.width = `${size}px`;
                confetti.style.height = `${size}px`;
                confetti.style.backgroundColor = color;
                confetti.style.animationDelay = `${delay}s`;
                confetti.style.animationDuration = `${duration}s`;

                if (shape === 'circle') {
                    confetti.style.borderRadius = '50%';
                } else if (shape === 'triangle') {
                    confetti.style.width = '0';
                    confetti.style.height = '0';
                    confetti.style.backgroundColor = 'transparent';
                    confetti.style.borderLeft = `${size / 2}px solid transparent`;
                    confetti.style.borderRight = `${size / 2}px solid transparent`;
                    confetti.style.borderBottom = `${size}px solid ${color}`;
                }

                confettiContainer.appendChild(confetti);

                setTimeout(() => {
                    confetti.remove();
                }, (duration + delay) * 1000);
            }, i * 20);
        }
    }

    // ==================== FLOATING HEARTS ====================
    function startFloatingHearts() {
        const container = document.getElementById('floatingHearts');
        const hearts = ['❤️', '💕', '💖', '💗', '💝', '♥', '💘', '✨', '🌸'];

        function createHeart() {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

            const left = Math.random() * 100;
            const size = Math.random() * 1.5 + 0.6;
            const duration = Math.random() * 10 + 12;
            const delay = Math.random() * 2;

            heart.style.left = `${left}%`;
            heart.style.fontSize = `${size}rem`;
            heart.style.animationDuration = `${duration}s`;
            heart.style.animationDelay = `${delay}s`;

            container.appendChild(heart);

            setTimeout(() => {
                heart.remove();
            }, (duration + delay) * 1000);
        }

        // Create hearts periodically
        setInterval(createHeart, 2000);

        // Initial batch
        for (let i = 0; i < 5; i++) {
            setTimeout(createHeart, i * 500);
        }
    }

    // ==================== PARTICLE SYSTEM ====================
    function initParticles() {
        const canvas = document.getElementById('particleCanvas');
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationFrameId;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        resize();
        window.addEventListener('resize', resize);

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
                this.opacity = Math.random() * 0.4 + 0.1;
                this.hue = Math.random() * 40 + 330; // Pink to red range
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${this.hue}, 70%, 70%, ${this.opacity})`;
                ctx.fill();
            }
        }

        // Create particles
        const particleCount = Math.min(80, Math.floor(window.innerWidth / 15));
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            // Draw connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(232, 69, 107, ${0.05 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        }

        animate();
    }

    // ==================== MUSIC TOGGLE ====================
    musicToggle.addEventListener('click', () => {
        const bgMusic = document.getElementById('bgMusic');
        const birthdayMusic = document.getElementById('birthdayMusic');

        // Determine which track is active
        const activeTrack = (birthdayMusic && !birthdayMusic.paused) ? birthdayMusic
            : (bgMusic && !bgMusic.paused) ? bgMusic
                : bgMusic; // default to bg music

        if (activeTrack) {
            if (activeTrack.paused) {
                activeTrack.volume = 0.4;
                activeTrack.play().catch(() => { });
                musicToggle.classList.remove('muted');
            } else {
                activeTrack.pause();
                musicToggle.classList.add('muted');
            }
        }
    });

    // ==================== SMOOTH SCROLL FOR NAV LINKS ====================
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ==================== PARALLAX EFFECT ON HERO SHAPES ====================
    window.addEventListener('mousemove', (e) => {
        const shapes = document.querySelectorAll('.shape');
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;

        shapes.forEach((shape, i) => {
            const factor = (i + 1) * 0.5;
            shape.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
        });
    });

    // ==================== TYPEWRITER EFFECT FOR HERO SUBTITLE ====================
    // Add a subtle glow pulse to the hero
    const hero = document.querySelector('.hero');
    if (hero) {
        setInterval(() => {
            const shapes = document.querySelectorAll('.shape');
            shapes.forEach(shape => {
                shape.style.opacity = `${0.1 + Math.random() * 0.1}`;
            });
        }, 3000);
    }
});
