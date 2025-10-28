// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Animate gradient blobs
const blobTimeline = gsap.timeline({
    repeat: -1,
    yoyo: true,
    defaults: { duration: 15, ease: "none" }
});

blobTimeline
    .to(".gradient-blob-1", {
        x: -100,
        y: 50,
        scale: 1.1,
        backgroundColor: "rgba(220, 220, 220, 0.08)",
    })
    .to(".gradient-blob-2", {
        x: 80,
        y: -80,
        scale: 1.15,
        backgroundColor: "rgba(150, 150, 150, 0.12)",
    }, 0)
    .to(".gradient-blob-3", {
        x: -60,
        y: -60,
        scale: 1.2,
        backgroundColor: "rgba(180, 180, 180, 0.08)",
    }, 0)
    .to(".gradient-blob-4", {
        x: 70,
        y: 70,
        scale: 1.1,
        backgroundColor: "rgba(160, 160, 160, 0.1)",
    }, 0);

// Enhanced smooth scrolling with GSAP
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        const targetId = link.getAttribute('data-section');
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            gsap.to(window, {
                duration: 1,
                scrollTo: {
                    y: targetSection,
                    offsetY: 0
                },
                ease: "power2.inOut"
            });
        }
    });
});

// Smooth scroll tracking with GSAP ScrollTrigger
const sections = document.querySelectorAll('section');
sections.forEach(section => {
    ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        onToggle: self => {
            if (self.isActive) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === section.id) {
                        link.classList.add('active');
                    }
                });
            }
        }
    });
});

// Scrollable tabs: scroll controls, drag-to-scroll, active state and filtering
(function () {
    const tabs = document.getElementById('workTabs');
    const tabButtons = tabs ? tabs.querySelectorAll('.tab') : [];
    const projects = document.querySelectorAll('.project-card');

    // Initialize GSAP Draggable for smooth tab scrolling
    if (tabs) {
        const dragInstance = Draggable.create(tabs, {
            type: "x",
            inertia: true,
            bounds: { minX: 0, maxX: tabs.scrollWidth - tabs.clientWidth },
            edgeResistance: 0.65,
            onDrag: updateFade,
            onThrowUpdate: updateFade
        })[0];

        function updateFade() {
            const fadeLeft = document.getElementById('tabs-fade-left');
            const fadeRight = document.getElementById('tabs-fade-right');
            if (!tabs || !fadeLeft || !fadeRight) return;
            gsap.to(fadeLeft, {
                opacity: tabs.scrollLeft > 8 ? 1 : 0,
                duration: 0.3
            });
            gsap.to(fadeRight, {
                opacity: tabs.scrollLeft < (tabs.scrollWidth - tabs.clientWidth - 8) ? 1 : 0,
                duration: 0.3
            });
        }

        tabs.addEventListener('scroll', updateFade, { passive: true });
        window.addEventListener('resize', updateFade);
        updateFade();

        const leftBtn = document.getElementById('tabs-scroll-left');
        const rightBtn = document.getElementById('tabs-scroll-right');
        if (leftBtn) leftBtn.addEventListener('click', () => {
            gsap.to(tabs, {
                scrollLeft: tabs.scrollLeft - 220,
                duration: 0.5,
                ease: "power2.out"
            });
        });
        if (rightBtn) rightBtn.addEventListener('click', () => {
            gsap.to(tabs, {
                scrollLeft: tabs.scrollLeft + 220,
                duration: 0.5,
                ease: "power2.out"
            });
        });
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                tabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.getAttribute('data-filter');
                // Animate projects filtering
                projects.forEach(card => {
                    const categoryEl = card.querySelector('.project-category');
                    const category = categoryEl ? categoryEl.textContent.trim() : '';
                    const shouldShow = filter === 'all' || category.toLowerCase() === filter.toLowerCase();
                    gsap.to(card, {
                        opacity: shouldShow ? 1 : 0,
                        scale: shouldShow ? 1 : 0.95,
                        duration: 0.4,
                        ease: "power2.inOut",
                        onComplete: () => {
                            card.style.display = shouldShow ? '' : 'none';
                            if (shouldShow) {
                                gsap.from(card, {
                                    opacity: 0,
                                    scale: 0.95,
                                    duration: 0.4,
                                    ease: "power2.out"
                                });
                            }
                        }
                    });
                });
                // Smooth scroll to active tab
                gsap.to(tabs, {
                    scrollLeft: btn.offsetLeft - (tabs.clientWidth / 2) + (btn.offsetWidth / 2),
                    duration: 0.5,
                    ease: "power2.out"
                });
            });
        });
    }
})();

// FAQ Accordion
const faqQuestions = document.querySelectorAll('.faq-question');
faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const answer = faqItem.querySelector('.faq-answer');
        const icon = question.querySelector('.faq-icon');
        // Close all other FAQs
        document.querySelectorAll('.faq-item').forEach(item => {
            if (item !== faqItem) {
                item.querySelector('.faq-answer').classList.remove('open');
                item.querySelector('.faq-icon').classList.remove('open');
            }
        });
        // Toggle current FAQ
        answer.classList.toggle('open');
        icon.classList.toggle('open');
    });
});

// Contact button handler
function handleContact() {
    alert("Let's talk! You can add your contact form or email link here.");
}

// Smooth reveal animations on scroll (optional enhancement)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);
document.querySelectorAll('.project-card, .faq-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});
