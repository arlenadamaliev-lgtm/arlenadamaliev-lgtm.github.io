/**
 * Language Switcher, Dynamic Year, Theme Toggle, Scroll-to-Top,
 * Typewriter Animation, Scroll Animations, Project Modal, Contact Form
 */

document.addEventListener('DOMContentLoaded', function () {

    // ======================================================
    // 1. LANGUAGE SWITCHER
    // ======================================================

    var langButtons = document.querySelectorAll('.lang-option');
    var STORAGE_KEY = 'portfolio-lang';

    /**
     * Switches the page language.
     * @param {string} lang — language code: 'en', 'kg', 'ru'
     */
    function switchLanguage(lang) {
        document.documentElement.setAttribute('lang', lang);

        // Hide all language elements
        var allLangElements = document.querySelectorAll('.lang');
        allLangElements.forEach(function (el) {
            el.classList.add('hidden');
        });

        // Show elements for the selected language
        var selectedElements = document.querySelectorAll('.lang-' + lang);
        selectedElements.forEach(function (el) {
            el.classList.remove('hidden');
        });

        // Update the visible flag in the switcher
        var currentFlag = document.querySelector('.lang-current');
        if (currentFlag) {
            var flags = {
                'en': '🇬🇧',
                'kg': '🇰🇬',
                'ru': '🇷🇺'
            };
            currentFlag.textContent = flags[lang] || '🇬🇧';
            currentFlag.setAttribute('data-lang', lang);
        }

        // Highlight the active button in the dropdown
        langButtons.forEach(function (btn) {
            btn.classList.remove('active');
        });
        var activeButton = document.querySelector('.lang-option[data-lang="' + lang + '"]');
        if (activeButton) {
            activeButton.classList.add('active');
        }

        // Persist the choice
        localStorage.setItem(STORAGE_KEY, lang);

        // Re-trigger typewriter for the new language (after DOM update)
        setTimeout(function () {
            retypeForNewLanguage();
        }, 50);

        // Update form placeholders and option texts
        setTimeout(function () {
            updateFormLanguage(lang);
        }, 60);
    }

    // Click handlers for language buttons
    langButtons.forEach(function (button) {
        button.addEventListener('click', function (event) {
            event.stopPropagation();
            var lang = button.getAttribute('data-lang');
            if (lang) {
                switchLanguage(lang);
                // Close the dropdown after selection
                var switcher = document.querySelector('.lang-switcher');
                if (switcher) {
                    switcher.classList.remove('open');
                }
            }
        });
    });

    // Restore saved language on page load
    var savedLang = localStorage.getItem(STORAGE_KEY);
    if (savedLang && (savedLang === 'en' || savedLang === 'kg' || savedLang === 'ru')) {
        switchLanguage(savedLang);
    }

    // Dropdown toggle logic
    var switcher = document.querySelector('.lang-switcher');
    var current = document.querySelector('.lang-current');

    if (switcher && current) {
        current.addEventListener('click', function (event) {
            event.stopPropagation();
            switcher.classList.toggle('open');
        });
    }

    // Close dropdown on outside click
    document.addEventListener('click', function () {
        if (switcher) {
            switcher.classList.remove('open');
        }
    });


    // ======================================================
    // 2. DYNAMIC YEAR IN FOOTER
    // ======================================================

    /**
     * Replaces the [ГОД] placeholder in the footer with the current year.
     * E.g., "© [ГОД] Arlen Aliaskar uulu" → "© 2026 Arlen Aliaskar uulu"
     */
    var footerCopy = document.querySelector('.footer-copy');
    if (footerCopy) {
        var currentYear = new Date().getFullYear();
        footerCopy.textContent = footerCopy.textContent.replace('[ГОД]', currentYear);
    }


    // ======================================================
    // 3. THEME TOGGLE (DARK / LIGHT)
    // ======================================================

    var themeToggle = document.querySelector('[data-theme-toggle]');
    var themeIcon = document.querySelector('.theme-icon');
    var THEME_KEY = 'portfolio-theme';

    /**
     * Applies the given theme to the site.
     * @param {string} theme — 'dark' or 'light'
     */
    function applyTheme(theme) {
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            if (themeIcon) themeIcon.textContent = '☀️';
        } else {
            document.documentElement.removeAttribute('data-theme');
            if (themeIcon) themeIcon.textContent = '🌙';
        }
        localStorage.setItem(THEME_KEY, theme);
    }

    /** Toggles between dark and light themes. */
    function toggleTheme() {
        var currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'light') {
            applyTheme('dark');
        } else {
            applyTheme('light');
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Restore saved theme on load
    var savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === 'light') {
        applyTheme('light');
    }


    // ======================================================
    // 4. SCROLL-TO-TOP BUTTON
    // ======================================================

    var scrollButton = document.querySelector('.scroll-to-top');

    if (scrollButton) {
        /**
         * Shows the button when the page is scrolled past 50%.
         */
        function checkScroll() {
            var scrollTop = window.scrollY || document.documentElement.scrollTop;
            var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            var scrollPercent = scrollTop / docHeight;

            if (scrollPercent > 0.5) {
                scrollButton.classList.add('visible');
            } else {
                scrollButton.classList.remove('visible');
            }
        }

        /** Smooth-scrolls the page to the top. */
        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        window.addEventListener('scroll', checkScroll);
        scrollButton.addEventListener('click', scrollToTop);

        // Initial check in case the page is already scrolled
        checkScroll();
    }


    // ======================================================
    // 5. TYPEWRITER TEXT ANIMATION
    // ======================================================

    var typewriterCursor = document.querySelector('.typewriter-cursor');
    var typingInterval = null;
    var typingSpeed = 30; // ms per character

    /**
     * Returns the currently visible typewriter element (matching the active language).
     * @returns {Element|null}
     */
    function getActiveTypewriter() {
        var allTypewriters = document.querySelectorAll('.typewriter-text');
        for (var i = 0; i < allTypewriters.length; i++) {
            if (!allTypewriters[i].classList.contains('hidden')) {
                return allTypewriters[i];
            }
        }
        return null;
    }

    /**
     * Starts the typewriter effect on the given element.
     * @param {Element} element
     */
    function startTypewriter(element) {
        if (!element) return;

        // Stop any ongoing animation
        if (typingInterval) {
            clearInterval(typingInterval);
            typingInterval = null;
        }

        var fullText = element.getAttribute('data-text') || '';
        var currentIndex = 0;

        element.textContent = '';

        if (typewriterCursor) {
            typewriterCursor.style.display = 'inline';
        }

        typingInterval = setInterval(function () {
            if (currentIndex < fullText.length) {
                element.textContent += fullText.charAt(currentIndex);
                currentIndex++;
            } else {
                clearInterval(typingInterval);
                typingInterval = null;
            }
        }, typingSpeed);
    }

    /**
     * Instantly shows the full text (skips the animation).
     * Currently reserved for future use.
     * @param {Element} element
     */
    function showTextInstantly(element) {
        if (!element) return;

        if (typingInterval) {
            clearInterval(typingInterval);
            typingInterval = null;
        }

        element.textContent = element.getAttribute('data-text') || '';

        if (typewriterCursor) {
            typewriterCursor.style.display = 'inline';
        }
    }

    /** Re-triggers the typewriter animation after a language switch. */
    function retypeForNewLanguage() {
        var activeElement = getActiveTypewriter();
        if (activeElement) {
            startTypewriter(activeElement);
        }
    }

    // Initial typewriter start
    var initialElement = getActiveTypewriter();
    if (initialElement) {
        startTypewriter(initialElement);
    }


    // ======================================================
    // 6. SCROLL-TRIGGERED APPEARANCE ANIMATIONS
    // ======================================================

    /** Stores timeout IDs for staggered card animations. */
    var animationTimeouts = {};

    var observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.2
    };

    var animationObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;

            var element = entry.target;

            // Staggered animation logic for grouped cards
            var group = element.getAttribute('data-animation-group');
            var order = parseInt(element.getAttribute('data-animation-order'), 10);

            if (group && !isNaN(order)) {
                var delay = order * 150;
                var timeoutKey = group + '-' + order;

                if (animationTimeouts[timeoutKey]) {
                    clearTimeout(animationTimeouts[timeoutKey]);
                }

                animationTimeouts[timeoutKey] = setTimeout(function () {
                    element.classList.add('animate-visible');

                    if (element.classList.contains('github-cta')) {
                        element.classList.add('pulse');
                    }
                }, delay);

                // Stop observing after the delay
                setTimeout(function () {
                    animationObserver.unobserve(element);
                }, delay + 100);

            } else {
                // Instant animation (no delay)
                element.classList.add('animate-visible');

                if (element.classList.contains('contact-btn')) {
                    element.classList.add('pulse-cta');
                }

                animationObserver.unobserve(element);
            }
        });
    }, observerOptions);

    /** Assigns data-animation-group and data-animation-order, then starts observing. */
    function setupAnimations() {
        // "Why Python" cards: slide-left, one by one
        var pythonCards = document.querySelectorAll('#why-python .info-card');
        pythonCards.forEach(function (card, index) {
            card.setAttribute('data-animation-group', 'python');
            card.setAttribute('data-animation-order', index);
            animationObserver.observe(card);
        });

        // "Why Me" cards: left/right pairs
        var aboutLeftCards = document.querySelectorAll('#about-me .slide-left-pair');
        var aboutRightCards = document.querySelectorAll('#about-me .slide-right-pair');

        aboutLeftCards.forEach(function (card, index) {
            card.setAttribute('data-animation-group', 'about-left');
            card.setAttribute('data-animation-order', index);
            animationObserver.observe(card);
        });

        aboutRightCards.forEach(function (card, index) {
            card.setAttribute('data-animation-group', 'about-right');
            card.setAttribute('data-animation-order', index);
            animationObserver.observe(card);
        });

        // "Workflow" timeline steps: scale-in, one by one
        var timelineSteps = document.querySelectorAll('#workflow .timeline-step');
        timelineSteps.forEach(function (step, index) {
            step.setAttribute('data-animation-group', 'timeline');
            step.setAttribute('data-animation-order', index);
            animationObserver.observe(step);
        });

        // "Projects" cards: center → left → right
        var centerCard = document.querySelector('#projects .slide-up-project');
        var leftCard = document.querySelector('#projects .slide-left-project');
        var rightCard = document.querySelector('#projects .slide-right-project');

        if (centerCard) {
            centerCard.setAttribute('data-animation-group', 'projects');
            centerCard.setAttribute('data-animation-order', 0);
            animationObserver.observe(centerCard);
        }
        if (leftCard) {
            leftCard.setAttribute('data-animation-group', 'projects');
            leftCard.setAttribute('data-animation-order', 1);
            animationObserver.observe(leftCard);
        }
        if (rightCard) {
            rightCard.setAttribute('data-animation-group', 'projects');
            rightCard.setAttribute('data-animation-order', 2);
            animationObserver.observe(rightCard);
        }

        // GitHub CTA (appears after project cards, same group)
        var githubCta = document.querySelector('#projects .github-cta');
        if (githubCta) {
            githubCta.setAttribute('data-animation-group', 'projects');
            githubCta.setAttribute('data-animation-order', 3);
            animationObserver.observe(githubCta);
        }

        // Contact buttons (no delay, each independently)
        var contactButtons = document.querySelectorAll('#contacts .contact-btn');
        contactButtons.forEach(function (btn) {
            animationObserver.observe(btn);
        });
    }

    setupAnimations();


    // ======================================================
    // 7. FORM LANGUAGE UPDATE
    // ======================================================

    /**
     * Updates placeholder attributes and select option texts when the language changes.
     * @param {string} lang — 'en', 'kg', 'ru'
     */
    function updateFormLanguage(lang) {
        // Update input/textarea placeholders
        var inputsWithPlaceholder = document.querySelectorAll('.contacts-form [data-placeholder-en]');
        inputsWithPlaceholder.forEach(function (input) {
            var placeholderKey = 'data-placeholder-' + lang;
            var placeholderValue = input.getAttribute(placeholderKey);
            if (placeholderValue) {
                input.placeholder = placeholderValue;
            }
        });

        // Update select options
        var options = document.querySelectorAll('#form-type option[data-en]');
        options.forEach(function (option) {
            var textKey = 'data-' + lang;
            var textValue = option.getAttribute(textKey);
            if (textValue) {
                option.textContent = textValue;
            }
        });
    }


    // ======================================================
    // 8. PROJECT DETAIL MODAL
    // ======================================================

    var modalOverlay = document.getElementById('project-modal');
    var modalClose = document.querySelector('.modal-close');

    var modalImg = document.getElementById('modal-img');
    var modalTitle = document.getElementById('modal-title');
    var modalDescription = document.getElementById('modal-description');
    var modalTags = document.getElementById('modal-tags');
    var modalLink = document.getElementById('modal-link');
    var modalCounter = document.getElementById('modal-counter');

    /**
     * Opens the modal and populates it with project data.
     * @param {Object} data — { title, description, tags, image, link }
     */
    function openModal(data) {
        if (!modalOverlay) return;

        if (modalImg) {
            modalImg.src = data.image || '';
            modalImg.alt = data.title || '';
        }
        if (modalTitle) modalTitle.textContent = data.title || '';
        if (modalDescription) modalDescription.textContent = data.description || '';
        if (modalLink) modalLink.href = data.link || '#';

        if (modalTags) {
            modalTags.innerHTML = '';
            if (data.tags && data.tags.length > 0) {
                data.tags.forEach(function (tag) {
                    var span = document.createElement('span');
                    span.className = 'tag';
                    span.textContent = tag;
                    modalTags.appendChild(span);
                });
            }
        }

        // Image counter hidden — reserved for future multi-image support
        if (modalCounter) modalCounter.classList.add('hidden');

        modalOverlay.classList.add('active');
        modalOverlay.setAttribute('aria-hidden', 'false');
        document.body.classList.add('no-scroll');
    }

    /** Closes the modal. */
    function closeModal() {
        if (!modalOverlay) return;

        modalOverlay.classList.remove('active');
        modalOverlay.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('no-scroll');

        // Clear image src to stop background loading
        if (modalImg) modalImg.src = '';
    }

    // Event listeners
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', function (event) {
            // Close only if the backdrop itself was clicked
            if (event.target === modalOverlay) {
                closeModal();
            }
        });
    }

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

    // Attach click handlers to project cards
    var projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(function (card) {
        card.addEventListener('click', function () {
            // Gather data from data-attributes, falling back to child elements
            var title = card.getAttribute('data-title') ||
                        card.querySelector('.project-title')?.textContent || '';
            var description = card.getAttribute('data-description') ||
            card.querySelector('.project-description')?.textContent || '';
            var image = card.getAttribute('data-image') || '';
            var link = card.getAttribute('data-link') ||
            card.querySelector('.project-link')?.getAttribute('href') || '#';

            // Gather tags
            var tagElements = card.querySelectorAll('.tag');
            var tags = [];
            tagElements.forEach(function (tag) {
                tags.push(tag.textContent.trim());
            });

            var dataTags = card.getAttribute('data-tags');
            if (dataTags) {
                tags = dataTags.split(',').map(function (t) { return t.trim(); });
            }

            openModal({
                title: title,
                description: description,
                image: image,
                tags: tags,
                link: link
            });
        });

        // Visual indication that the card is clickable
        card.style.cursor = 'pointer';
    });


    // ======================================================
    // 9. CONTACT FORM (AJAX SUBMISSION VIA FETCH)
    // ======================================================

    var contactForm = document.getElementById('contact-form');
    var formSuccess = document.getElementById('form-success');

    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();

            var formData = new FormData(contactForm);

            var submitBtn = contactForm.querySelector('.form-submit');
            var originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '⏳ Отправка...';
            submitBtn.disabled = true;

            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(function (response) {
                if (response.ok) {
                    // Success: hide form, show confirmation message
                    contactForm.style.display = 'none';
                    if (formSuccess) {
                        formSuccess.classList.remove('hidden');
                    }
                } else {
                    // Server responded with an error
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    alert('Ошибка отправки. Пожалуйста, попробуйте ещё раз или напишите мне напрямую.');
                }
            })
            .catch(function () {
                // Network error
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                alert('Ошибка соединения. Проверьте интернет и попробуйте снова.');
            });
        });
    }
    
    // Share button functionality

    var shareWrapper = document.querySelector('.share-btn-wrapper');
    var shareToggle = document.querySelector('.share-toggle');
    var shareOptions = document.querySelectorAll('.share-option');
    var shareUrl = encodeURIComponent(window.location.href);
    var shareTitle = encodeURIComponent(document.title);

    if (shareToggle && shareWrapper) {
        shareToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            shareWrapper.classList.toggle('open');
        });
        document.addEventListener('click', function () {
            shareWrapper.classList.remove('open');
        });
    }

    shareOptions.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            var action = btn.getAttribute('data-share');
            if (action === 'telegram') {
                window.open('https://t.me/share/url?url=' + shareUrl + '&text=' + shareTitle, '_blank');
            } else if (action === 'whatsapp') {
                window.open('https://wa.me/?text=' + shareTitle + '%20' + shareUrl, '_blank');
            } else if (action === 'copy') {
                navigator.clipboard.writeText(window.location.href).then(function () {
                    var copyText = btn.querySelector('.share-copy-text');
                    if (copyText) {
                        var original = copyText.textContent;
                        copyText.textContent = 'Copied!';
                        setTimeout(function () { copyText.textContent = original; }, 1500);
                    }
                });
            }
            shareWrapper.classList.remove('open');
        });
    });
});