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
});