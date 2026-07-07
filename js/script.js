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

});