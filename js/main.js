/**
 * Maskin & Håndverk AS - Main JavaScript
 * "Moderne verktøy, gammeldags håndverk"
 */

(function() {
    'use strict';

    // ============================================
    // Mobile Navigation Toggle
    // ============================================
    const navToggle = document.querySelector('.nav-toggle');
    const mobileNav = document.querySelector('.mobile-nav');

    if (navToggle && mobileNav) {
        navToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileNav.classList.toggle('active');

            // Toggle aria-expanded
            const isExpanded = this.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);

            // Prevent body scroll when menu is open
            document.body.style.overflow = isExpanded ? 'hidden' : '';
        });

        // Close mobile nav when clicking a link
        const mobileNavLinks = mobileNav.querySelectorAll('a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close mobile nav when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !mobileNav.contains(e.target)) {
                navToggle.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ============================================
    // Scroll to Top Button
    // ============================================
    const scrollTopBtn = document.querySelector('.scroll-top');

    if (scrollTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('active');
            } else {
                scrollTopBtn.classList.remove('active');
            }
        });

        // Scroll to top on click
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ============================================
    // Header Scroll Effect
    // ============================================
    const header = document.querySelector('.header');

    if (header) {
        let lastScroll = 0;

        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;

            // Add shadow on scroll
            if (currentScroll > 10) {
                header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.08)';
            }

            lastScroll = currentScroll;
        });
    }

    // ============================================
    // Contact Form Handler
    // ============================================
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.querySelector('.form-success');
    const formError = document.querySelector('.form-error');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Get form data
            const formData = {
                name: this.querySelector('#name').value,
                email: this.querySelector('#email').value,
                phone: this.querySelector('#phone').value,
                address: this.querySelector('#address')?.value || '',
                projectType: this.querySelector('#projectType').value,
                description: this.querySelector('#description').value,
                wantSiteVisit: this.querySelector('#siteVisit')?.checked || false
            };

            // Basic validation
            if (!formData.name || !formData.email || !formData.phone || !formData.description) {
                showFormError('Vennligst fyll ut alle obligatoriske felt.');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                showFormError('Vennligst oppgi en gyldig e-postadresse.');
                return;
            }

            // Phone validation (Norwegian format)
            const phoneRegex = /^(\+47)?[\s]?[0-9]{8}$/;
            const cleanPhone = formData.phone.replace(/\s/g, '');
            if (!phoneRegex.test(cleanPhone)) {
                showFormError('Vennligst oppgi et gyldig telefonnummer (8 siffer).');
                return;
            }

            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Sender...';
            submitBtn.disabled = true;

            try {
                // Simulate form submission (replace with actual Resend API call)
                // In production, you would send to your backend endpoint
                await simulateFormSubmission(formData);

                // Show success message
                showFormSuccess();
                this.reset();

            } catch (error) {
                console.error('Form submission error:', error);
                showFormError('Noe gikk galt. Vennligst prøv igjen eller ring oss direkte.');
            } finally {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    function showFormSuccess() {
        if (formSuccess) {
            formSuccess.classList.add('active');
            if (formError) formError.classList.remove('active');

            // Scroll to success message
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Hide after 10 seconds
            setTimeout(() => {
                formSuccess.classList.remove('active');
            }, 10000);
        }
    }

    function showFormError(message) {
        if (formError) {
            formError.textContent = message;
            formError.classList.add('active');
            if (formSuccess) formSuccess.classList.remove('active');

            // Scroll to error message
            formError.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Hide after 5 seconds
            setTimeout(() => {
                formError.classList.remove('active');
            }, 5000);
        }
    }

    async function simulateFormSubmission(data) {
        // Simulate API delay
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Log form data (for testing)
                console.log('Form submitted:', data);

                // In production, this would be an actual API call:
                // const response = await fetch('/api/contact', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify(data)
                // });
                // if (!response.ok) throw new Error('Submission failed');

                resolve({ success: true });
            }, 1500);
        });
    }

    // ============================================
    // Lightbox for Project Gallery
    // ============================================
    const projectCards = document.querySelectorAll('.project-card');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImage = document.querySelector('.lightbox__image');
    const lightboxClose = document.querySelector('.lightbox__close');

    if (projectCards.length && lightbox) {
        projectCards.forEach(card => {
            card.addEventListener('click', function() {
                const imgSrc = this.querySelector('img').src;
                lightboxImage.src = imgSrc;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        // Close lightbox
        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }

        lightbox.addEventListener('click', function(e) {
            if (e.target === this) {
                closeLightbox();
            }
        });

        // Close with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // ============================================
    // Project Category Filter
    // ============================================
    const categoryBtns = document.querySelectorAll('.category-btn');
    const projectItems = document.querySelectorAll('.project-card');

    if (categoryBtns.length && projectItems.length) {
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Update active state
                categoryBtns.forEach(b => b.classList.remove('category-btn--active'));
                this.classList.add('category-btn--active');

                const category = this.dataset.category;

                // Filter projects
                projectItems.forEach(project => {
                    if (category === 'all' || project.dataset.category === category) {
                        project.style.display = '';
                    } else {
                        project.style.display = 'none';
                    }
                });
            });
        });
    }

    // ============================================
    // Smooth Scroll for Anchor Links
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip if it's just "#"
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();

                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // Lazy Loading Images
    // ============================================
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px'
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // ============================================
    // Animate on Scroll (Simple Implementation)
    // ============================================
    const animateElements = document.querySelectorAll('.animate-on-scroll');

    if (animateElements.length && 'IntersectionObserver' in window) {
        const animateObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, {
            threshold: 0.1
        });

        animateElements.forEach(el => animateObserver.observe(el));
    }

    // ============================================
    // Click to Call (Mobile)
    // ============================================
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');

    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Track phone clicks (can be used for analytics)
            if (typeof gtag === 'function') {
                gtag('event', 'click', {
                    event_category: 'Contact',
                    event_label: 'Phone Call'
                });
            }
        });
    });

    // ============================================
    // Form Input Formatting
    // ============================================
    const phoneInputs = document.querySelectorAll('input[type="tel"]');

    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            // Remove non-numeric characters except +
            let value = this.value.replace(/[^\d+]/g, '');

            // Format Norwegian phone number
            if (value.startsWith('+47')) {
                value = value.slice(0, 11); // +47 + 8 digits
            } else {
                value = value.slice(0, 8); // 8 digits
            }

            this.value = value;
        });
    });

    // ============================================
    // Set Active Navigation Link
    // ============================================
    function setActiveNavLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav__link, .mobile-nav__link');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');

            // Check if this is the current page
            if (currentPath.endsWith(href) ||
                (currentPath === '/' && href === 'index.html') ||
                (currentPath.endsWith('/') && href === 'index.html')) {
                link.classList.add('nav__link--active', 'mobile-nav__link--active');
            }
        });
    }

    setActiveNavLink();

    // ============================================
    // Service Worker Registration (Optional)
    // ============================================
    // Uncomment to enable offline support
    /*
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('ServiceWorker registered:', registration.scope);
                })
                .catch(function(error) {
                    console.log('ServiceWorker registration failed:', error);
                });
        });
    }
    */

    // ============================================
    // Console Welcome Message
    // ============================================
    console.log('%cMaskin & Håndverk AS', 'color: #1E3A5F; font-size: 24px; font-weight: bold;');
    console.log('%cModerne verktøy, gammeldags håndverk', 'color: #8B5A2B; font-size: 14px;');
    console.log('%c---', 'color: #E67E22;');
    console.log('Snekkerarbeid i Revetal, Tønsberg og Vestfold');
    console.log('Kontakt oss: post@maskinoghandverk.no');

})();
