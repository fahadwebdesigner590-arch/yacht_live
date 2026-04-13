// Premium Animation Engine - yacht_live
// Dependency: GSAP, ScrollTrigger, Lenis

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        orientation: 'vertical',
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync ScrollTrigger with Lenis
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // 2. Premium Split Text Effect
    const splitTextReveal = () => {
        const targets = document.querySelectorAll('[data-animate="split"]');
        targets.forEach(el => {
            // Preservation of HTML structure (e.g. spans)
            const html = el.innerHTML;
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            
            const textNodes = [];
            const walk = document.createTreeWalker(tempDiv, NodeFilter.SHOW_TEXT, null, false);
            let n;
            while(n = walk.nextNode()) textNodes.push(n);

            textNodes.forEach(node => {
                const words = node.nodeValue.split(' ');
                const parent = node.parentNode;
                const fragment = document.createDocumentFragment();
                
                words.forEach((word, i) => {
                    if (!word.trim() && i !== 0) return;
                    const wrapper = document.createElement('span');
                    wrapper.className = 'word-wrapper';
                    const inner = document.createElement('span');
                    inner.className = 'word';
                    inner.innerText = word + (i === words.length - 1 ? '' : '\u00A0');
                    wrapper.appendChild(inner);
                    fragment.appendChild(wrapper);
                });
                parent.replaceChild(fragment, node);
            });
            el.innerHTML = tempDiv.innerHTML;

            // Animate
            const words = el.querySelectorAll('.word');
            gsap.fromTo(words, 
                { y: '110%', opacity: 0 },
                { 
                    y: '0%', 
                    opacity: 1,
                    duration: 1, 
                    ease: 'expo.out', 
                    stagger: 0.03,
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });
    };

    // 3. Batch Reveal for Items
    const initReveals = () => {
        const revealItems = document.querySelectorAll('[data-animate="reveal"]');
        revealItems.forEach(el => {
            gsap.fromTo(el, 
                { opacity: 0, y: 30, filter: 'blur(10px)' },
                { 
                    opacity: 1, 
                    y: 0, 
                    filter: 'blur(0px)',
                    duration: 1.2,
                    ease: 'power4.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 90%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });
    };

    // 4. Parallax Effect
    const initParallax = () => {
        const parallaxItems = document.querySelectorAll('[data-parallax]');
        parallaxItems.forEach(el => {
            const speed = el.dataset.parallax || 0.2;
            gsap.to(el, {
                y: -100 * speed,
                ease: 'none',
                scrollTrigger: {
                    trigger: el,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });
    };

    // 5. Magnetic Buttons
    const initMagnetic = () => {
        const magneticItems = document.querySelectorAll('[data-magnetic]');
        magneticItems.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                gsap.to(el, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            });
            el.addEventListener('mouseleave', () => {
                gsap.to(el, {
                    x: 0,
                    y: 0,
                    duration: 0.6,
                    ease: 'elastic.out(1, 0.3)'
                });
            });
        });
    };

    // 6. Custom Cursor Glow (Managed centrally)
    const initCursor = () => {
        const cursor = document.getElementById('cursor-glow');
        if (!cursor) return;
        
        // Hide if touch device
        if (window.matchMedia('(pointer: coarse)').matches) {
            cursor.style.display = 'none';
            return;
        }

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        gsap.ticker.add(() => {
            const dt = 1.0 - Math.pow(1.0 - 0.1, gsap.ticker.deltaRatio());
            cursorX += (mouseX - cursorX) * dt;
            cursorY += (mouseY - cursorY) * dt;
            gsap.set(cursor, { 
                x: cursorX, 
                y: cursorY, 
                xPercent: -50, 
                yPercent: -50 
            });
        });
    };

    // Run initializations
    splitTextReveal();
    initReveals();
    initParallax();
    initMagnetic();
    initCursor();
});
