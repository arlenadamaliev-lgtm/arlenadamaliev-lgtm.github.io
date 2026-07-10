/* ============================================================
   ПАЗЛ №11: ПЕРЕКЛЮЧАТЕЛЬ ЯЗЫКОВ + ДИНАМИЧЕСКИЙ ГОД
   ============================================================
   Два независимых модуля:
   1. LangSwitcher — переключение языков (EN, KG, RU)
   2. DynamicYear   — подстановка текущего года в футер
   ============================================================ */

// Ждём полной загрузки HTML, чтобы все элементы были доступны
document.addEventListener('DOMContentLoaded', function () {

    // ======================================================
    // МОДУЛЬ 1: ПЕРЕКЛЮЧАТЕЛЬ ЯЗЫКОВ
    // ======================================================
    
    // Находим все кнопки выбора языка (флаги в выпадающем меню)
    var langButtons = document.querySelectorAll('.lang-option');
    
    // Ключ для localStorage — чтобы запоминать выбор пользователя
    var STORAGE_KEY = 'portfolio-lang';

    /**
     * Функция переключения языка.
     * @param {string} lang — код языка: 'en', 'kg', 'ru'
     * 
     * Алгоритм:
     * 1. Обновляем атрибут lang у <html>
     * 2. Скрываем ВСЕ элементы с классом .lang
     * 3. Показываем только элементы с классом .lang-ВЫБРАННЫЙ_ЯЗЫК
     * 4. Обновляем видимый флаг в переключателе
     * 5. Сохраняем выбор в localStorage
     */
    function switchLanguage(lang) {
        // --- Шаг 1: обновляем атрибут lang у <html> ---
        document.documentElement.setAttribute('lang', lang);

        // --- Шаг 2: скрываем все языковые элементы ---
        var allLangElements = document.querySelectorAll('.lang');
        allLangElements.forEach(function (el) {
            el.classList.add('hidden');
        });

        // --- Шаг 3: показываем элементы выбранного языка ---
        var selectedElements = document.querySelectorAll('.lang-' + lang);
        selectedElements.forEach(function (el) {
            el.classList.remove('hidden');
        });

        // --- Шаг 4: обновляем флаг в переключателе ---
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
        // --- Шаг 4.5: подсвечиваем активную кнопку в меню ---
        // Убираем класс .active у всех кнопок
        langButtons.forEach(function (btn) {
            btn.classList.remove('active');
        });
        // Добавляем .active на выбранную кнопку
        var activeButton = document.querySelector('.lang-option[data-lang="' + lang + '"]');
        if (activeButton) {
            activeButton.classList.add('active');
        }

        // --- Шаг 5: сохраняем выбор в localStorage ---
        localStorage.setItem(STORAGE_KEY, lang);
        // --- Шаг 6: перепечатываем typewriter для нового языка ---
        // Небольшая задержка, чтобы DOM обновился (скрытие/показ .lang элементов)
        setTimeout(function () {
            retypeForNewLanguage();
        }, 50);

        // --- Шаг 7: обновляем placeholder и текст опций в форме ---
        setTimeout(function () {
            updateFormLanguage(lang);
        }, 60);
    }

    /**
     * Вешаем обработчики клика на кнопки флагов.
     * Каждая кнопка имеет data-lang="kg" или data-lang="ru".
     */
    langButtons.forEach(function (button) {
        button.addEventListener('click', function (event) {
            event.stopPropagation();  // чтобы меню не закрылось раньше времени
            var lang = button.getAttribute('data-lang');
            if (lang) {
                switchLanguage(lang);
                
                // Закрываем выпадающее меню после выбора языка
                var switcher = document.querySelector('.lang-switcher');
                if (switcher) {
                    switcher.classList.remove('open');
                }
            }
        });
    });

    /**
     * При загрузке страницы проверяем localStorage.
     * Если пользователь уже выбирал язык — применяем его.
     */
    var savedLang = localStorage.getItem(STORAGE_KEY);
    if (savedLang && (savedLang === 'en' || savedLang === 'kg' || savedLang === 'ru')) {
        switchLanguage(savedLang);
    }

    // --- Логика открытия/закрытия выпадающего меню (из Пазла 3) ---
    var switcher = document.querySelector('.lang-switcher');
    var current = document.querySelector('.lang-current');

    if (switcher && current) {
        current.addEventListener('click', function (event) {
            event.stopPropagation();
            switcher.classList.toggle('open');
        });
    }

    // Закрытие меню при клике вне переключателя
    document.addEventListener('click', function () {
        if (switcher) {
            switcher.classList.remove('open');
        }
    });


    // ======================================================
    // МОДУЛЬ 2: ДИНАМИЧЕСКИЙ ГОД В ФУТЕРЕ
    // ======================================================
    
    /**
     * Находит в футере текст "[ГОД]" и заменяет его на текущий год.
     * Например: "© [ГОД] Arlen Aliaskar uulu" → "© 2026 Arlen Aliaskar uulu"
     * 
     * Так тебе никогда не придётся обновлять год вручную.
     */
    var footerCopy = document.querySelector('.footer-copy');
    if (footerCopy) {
        var currentYear = new Date().getFullYear();
        footerCopy.textContent = footerCopy.textContent.replace('[ГОД]', currentYear);
    }
    
    // ======================================================
    // МОДУЛЬ 3: ПЕРЕКЛЮЧАТЕЛЬ ТЕМЫ (ТЁМНАЯ / СВЕТЛАЯ)
    // ======================================================
    
    var themeToggle = document.querySelector('[data-theme-toggle]');
    var themeIcon = document.querySelector('.theme-icon');
    var THEME_KEY = 'portfolio-theme';

    /**
     * Применяет тему к сайту.
     * @param {string} theme — 'dark' или 'light'
     * 
     * Если тема светлая — добавляет data-theme="light" к <html>.
     * Если тёмная — убирает этот атрибут (работают стандартные :root переменные).
     */
    function applyTheme(theme) {
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            if (themeIcon) themeIcon.textContent = '☀️';
        } else {
            document.documentElement.removeAttribute('data-theme');
            if (themeIcon) themeIcon.textContent = '🌙';
        }
        // Сохраняем выбор
        localStorage.setItem(THEME_KEY, theme);
    }

    /**
     * Переключает тему: тёмная → светлая → тёмная.
     */
    function toggleTheme() {
        var currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'light') {
            applyTheme('dark');
        } else {
            applyTheme('light');
        }
    }

    // Вешаем обработчик клика на кнопку
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // При загрузке страницы проверяем, не выбрана ли уже светлая тема
    var savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === 'light') {
        applyTheme('light');
    }
    
    // ======================================================
    // МОДУЛЬ 4: КНОПКА "НАВЕРХ"
    // ======================================================
    
    var scrollButton = document.querySelector('.scroll-to-top');
    
    if (scrollButton) {
        /**
         * Проверяет, насколько прокручена страница.
         * Если больше 50% — показывает кнопку.
         * Если меньше — скрывает.
         * 
         * Формула: scrollTop / (scrollHeight - clientHeight)
         * scrollTop        — сколько пикселей уже прокручено сверху
         * scrollHeight     — полная высота документа
         * clientHeight     — высота видимой области (окна браузера)
         * Результат — число от 0 (самый верх) до 1 (самый низ).
         */
        function checkScroll() {
            var scrollTop = window.scrollY || document.documentElement.scrollTop;
            var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            var scrollPercent = scrollTop / docHeight;
            
            if (scrollPercent > 0.5) {
                // Прокручено больше 50% — показываем кнопку
                scrollButton.classList.add('visible');
            } else {
                // Меньше 50% — скрываем
                scrollButton.classList.remove('visible');
            }
        }
        
        /**
         * Плавно прокручивает страницу в самый верх.
         * behavior: 'smooth' — встроенная плавная прокрутка браузера.
         */
        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
        
        // Отслеживаем скролл — на каждое движение колеса/свайпа проверяем позицию
        window.addEventListener('scroll', checkScroll);
        
        // При клике на кнопку — плавно наверх
        scrollButton.addEventListener('click', scrollToTop);
        
        // Проверяем позицию сразу при загрузке (вдруг страница уже прокручена)
        checkScroll();
    }
    
    // ======================================================
    // МОДУЛЬ 5: АНИМАЦИЯ НАБОРА ТЕКСТА (TYPEWRITER)
    // ======================================================
    
    var typewriterCursor = document.querySelector('.typewriter-cursor');
    var typingInterval = null;
    var typingSpeed = 50;  // миллисекунд на букву
    
    /**
     * Находит активный (видимый) элемент typewriter для текущего языка.
     * Активный — тот, у которого нет класса .hidden.
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
     * Запускает печать текста для указанного элемента.
     * @param {Element} element — элемент .typewriter-text
     */
    function startTypewriter(element) {
        if (!element) return;
        
        // Останавливаем предыдущую анимацию, если была
        if (typingInterval) {
            clearInterval(typingInterval);
            typingInterval = null;
        }
        
        var fullText = element.getAttribute('data-text') || '';
        var currentIndex = 0;
        
        // Очищаем элемент
        element.textContent = '';
        
        // Показываем курсор
        if (typewriterCursor) {
            typewriterCursor.style.display = 'inline';
        }
        
        // Запускаем печать по буквам
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
     * Показывает текст мгновенно, без анимации.
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
    
    /**
     * Перепечатывает текст для нового языка.
     * Вызывается при переключении языка.
     */
    function retypeForNewLanguage() {
        var activeElement = getActiveTypewriter();
        if (activeElement) {
            startTypewriter(activeElement);
        }
    }
    
    // --- ЗАПУСК ПРИ ЗАГРУЗКЕ ---
    var initialElement = getActiveTypewriter();
    if (initialElement) {
        startTypewriter(initialElement);
    }
    
    // ======================================================
    // МОДУЛЬ 6: АНИМАЦИИ ПОЯВЛЕНИЯ СЕКЦИЙ ПРИ СКРОЛЛЕ
    // ======================================================
    
    /**
     * Intersection Observer следит за элементами с классом .animate-hidden.
     * Когда элемент попадает в зону видимости (на 20%) — добавляет
     * класс .animate-visible и, если нужно, класс пульсации.
     * 
     * rootMargin: '0px 0px -50px 0px' — элемент считается видимым
     * когда он на 50px зашёл в экран (снизу). Это даёт небольшую задержку,
     * чтобы анимация не срабатывала слишком рано.
     */
    
    // Объект для хранения таймаутов задержек между карточками
    var animationTimeouts = {};
    
    var observerOptions = {
        root: null,  // наблюдаем относительно окна браузера
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.2  // элемент видим на 20%
    };
    
    var animationObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;  // ещё не видим — ничего не делаем
            
            var element = entry.target;
            
            // --- ОСОБАЯ ЛОГИКА ДЛЯ КАРТОЧЕК С ЗАДЕРЖКОЙ ---
            // У карточек есть data-animation-group и data-animation-order.
            // Они позволяют запускать анимации с задержкой внутри группы.
            
            var group = element.getAttribute('data-animation-group');
            var order = parseInt(element.getAttribute('data-animation-order'), 10);
            
            if (group && !isNaN(order)) {
                // Задержка: каждая следующая карточка ждёт order * 150 мс
                var delay = order * 150;
                
                // Ключ для таймаута: группа + порядок
                var timeoutKey = group + '-' + order;
                
                // Очищаем предыдущий таймаут на всякий случай
                if (animationTimeouts[timeoutKey]) {
                    clearTimeout(animationTimeouts[timeoutKey]);
                }
                
                // Запускаем анимацию с задержкой
                animationTimeouts[timeoutKey] = setTimeout(function () {
                    element.classList.add('animate-visible');
                    
                    // Если это GitHub CTA — добавляем пульсацию
                    if (element.classList.contains('github-cta')) {
                        element.classList.add('pulse');
                    }
                }, delay);
                
                // Не прекращаем наблюдение сразу — даём таймауту отработать.
                // Но чтобы не срабатывало повторно — прекращаем после задержки.
                setTimeout(function () {
                    animationObserver.unobserve(element);
                }, delay + 100);
                
            } else {
                // --- ОБЫЧНАЯ ЛОГИКА (без задержки) ---
                element.classList.add('animate-visible');
                
                // Кнопки контактов — добавляем пульсацию
                if (element.classList.contains('contact-btn')) {
                    element.classList.add('pulse-cta');
                }
                
                // Прекращаем наблюдение
                animationObserver.unobserve(element);
            }
        });
    }, observerOptions);
    
    /**
     * Находит все элементы с классом .animate-hidden
     * и добавляет им data-атрибуты для группировки и очерёдности.
     * Затем запускает наблюдение.
     */
    function setupAnimations() {
        // --- ПОЧЕМУ PYTHON: 3 карточки, выезд слева, по очереди ---
        var pythonCards = document.querySelectorAll('#why-python .info-card');
        pythonCards.forEach(function (card, index) {
            card.setAttribute('data-animation-group', 'python');
            card.setAttribute('data-animation-order', index);
            animationObserver.observe(card);
        });
        
        // --- ПОЧЕМУ Я: 4 карточки, левые и правые, попарно ---
        var aboutLeftCards = document.querySelectorAll('#about-me .slide-left-pair');
        var aboutRightCards = document.querySelectorAll('#about-me .slide-right-pair');
        
        // Левая пара (order 0 и 1)
        aboutLeftCards.forEach(function (card, index) {
            card.setAttribute('data-animation-group', 'about-left');
            card.setAttribute('data-animation-order', index);
            animationObserver.observe(card);
        });
        
        // Правая пара (order 0 и 1, своя группа)
        aboutRightCards.forEach(function (card, index) {
            card.setAttribute('data-animation-group', 'about-right');
            card.setAttribute('data-animation-order', index);
            animationObserver.observe(card);
        });
        
        // --- ПРОЦЕСС РАБОТЫ: 4 шага, scale-in, по очереди ---
        var timelineSteps = document.querySelectorAll('#workflow .timeline-step');
        timelineSteps.forEach(function (step, index) {
            step.setAttribute('data-animation-group', 'timeline');
            step.setAttribute('data-animation-order', index);
            animationObserver.observe(step);
        });
        
        // --- ПРОЕКТЫ: 3 карточки, центр → левая → правая ---
        // Порядок: центральная (1), левая (2), правая (3)
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
        
        // --- GITHUB CTA ---
        var githubCta = document.querySelector('#projects .github-cta');
        if (githubCta) {
            // Появляется после карточек проектов (order = 3 в той же группе)
            githubCta.setAttribute('data-animation-group', 'projects');
            githubCta.setAttribute('data-animation-order', 3);
            animationObserver.observe(githubCta);
        }
        
        // --- КНОПКИ КОНТАКТОВ ---
        var contactButtons = document.querySelectorAll('#contacts .contact-btn');
        contactButtons.forEach(function (btn) {
            // Кнопки появляются без задержки, каждая сама по себе
            animationObserver.observe(btn);
        });
    }
    
    // Запускаем настройку анимаций
    setupAnimations();

    
    /**
     * Обновляет placeholder и текст опций в форме при смене языка.
     * @param {string} lang — 'en', 'kg', 'ru'
     */
    function updateFormLanguage(lang) {
        // Обновляем placeholder у input и textarea
        var inputsWithPlaceholder = document.querySelectorAll('.contacts-form [data-placeholder-en]');
        inputsWithPlaceholder.forEach(function (input) {
            var placeholderKey = 'data-placeholder-' + lang;
            var placeholderValue = input.getAttribute(placeholderKey);
            if (placeholderValue) {
                input.placeholder = placeholderValue;
            }
        });
        
        // Обновляем текст у опций выпадающего списка
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
    // МОДУЛЬ 7: МОДАЛЬНОЕ ОКНО ПРОЕКТОВ
    // ======================================================
    
    var modalOverlay = document.getElementById('project-modal');
    var modalClose = document.querySelector('.modal-close');
    
    // Поля модального окна (куда вставляем данные)
    var modalImg = document.getElementById('modal-img');
    var modalTitle = document.getElementById('modal-title');
    var modalDescription = document.getElementById('modal-description');
    var modalTags = document.getElementById('modal-tags');
    var modalLink = document.getElementById('modal-link');
    var modalCounter = document.getElementById('modal-counter');
    
    /**
     * Открывает модальное окно и заполняет его данными из data-атрибутов.
     * @param {Object} data — объект с полями: title, description, tags, image, link
     */
    function openModal(data) {
        if (!modalOverlay) return;
        
        // Заполняем поля
        if (modalImg) {
            modalImg.src = data.image || '';
            modalImg.alt = data.title || '';
        }
        if (modalTitle) modalTitle.textContent = data.title || '';
        if (modalDescription) modalDescription.textContent = data.description || '';
        if (modalLink) modalLink.href = data.link || '#';
        
        // Заполняем теги
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
        
        // Пока скрываем счётчик (для итерации 2)
        if (modalCounter) modalCounter.classList.add('hidden');
        
        // Показываем окно
        modalOverlay.classList.add('active');
        modalOverlay.setAttribute('aria-hidden', 'false');
        
        // Блокируем скролл страницы
        document.body.classList.add('no-scroll');
    }
    
    /**
     * Закрывает модальное окно.
     */
    function closeModal() {
        if (!modalOverlay) return;
        
        modalOverlay.classList.remove('active');
        modalOverlay.setAttribute('aria-hidden', 'true');
        
        // Разблокируем скролл
        document.body.classList.remove('no-scroll');
        
        // Очищаем изображение (чтобы не грузило фоном)
        if (modalImg) modalImg.src = '';
    }
    
    // --- ОБРАБОТЧИКИ ---
    
    // Клик по крестику — закрыть
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    // Клик по затемнённому фону — закрыть
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function (event) {
            // Закрываем только если кликнули именно по фону, а не по окну
            if (event.target === modalOverlay) {
                closeModal();
            }
        });
    }
    
    // Закрытие по клавише Escape
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });
    
    // --- ПОДКЛЮЧЕНИЕ К КАРТОЧКАМ ПРОЕКТОВ ---
    // Вешаем обработчик клика на каждую карточку проекта.
    // Карточка должна содержать data-атрибуты с информацией.
    var projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(function (card) {
        card.addEventListener('click', function () {
            // Собираем данные из data-атрибутов карточки
            var title = card.getAttribute('data-title') || 
                        card.querySelector('.project-title')?.textContent || '';
            var description = card.getAttribute('data-description') || 
                              card.querySelector('.project-description')?.textContent || '';
            var image = card.getAttribute('data-image') || '';
            var link = card.getAttribute('data-link') || 
                       card.querySelector('.project-link')?.getAttribute('href') || '#';
            
            // Собираем теги
            var tagElements = card.querySelectorAll('.tag');
            var tags = [];
            tagElements.forEach(function (tag) {
                tags.push(tag.textContent.trim());
            });
            
            // Если нет data-тегов — используем те, что в карточке
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
        
        // Делаем карточку кликабельной (курсор-палец)
        card.style.cursor = 'pointer';
    });

    
    // ======================================================
    // МОДУЛЬ 8: ФОРМА ОБРАТНОЙ СВЯЗИ (AJAX-отправка)
    // ======================================================
    // Отправляем форму через fetch, чтобы страница
    // не перезагружалась и не редиректила на Formspree.
    
    var contactForm = document.getElementById('contact-form');
    var formSuccess = document.getElementById('form-success');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();  // отменяем стандартную отправку
            
            // Собираем данные формы
            var formData = new FormData(contactForm);
            
            // Показываем что идёт отправка (меняем текст кнопки)
            var submitBtn = contactForm.querySelector('.form-submit');
            var originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '⏳ Отправка...';
            submitBtn.disabled = true;
            
            // Отправляем через fetch
            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(function (response) {
                if (response.ok) {
                    // Успех — показываем сообщение, скрываем форму
                    contactForm.style.display = 'none';
                    if (formSuccess) {
                        formSuccess.classList.remove('hidden');
                    }
                } else {
                    // Ошибка — возвращаем кнопку
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    alert('Ошибка отправки. Пожалуйста, попробуйте ещё раз или напишите мне напрямую.');
                }
            })
            .catch(function () {
                // Сетевая ошибка
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                alert('Ошибка соединения. Проверьте интернет и попробуйте снова.');
            });
        });
    }
});