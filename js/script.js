/* ============================================================
   МИКРО-СКРИПТ: ПЕРЕКЛЮЧАТЕЛЬ ЯЗЫКОВ ПО КЛИКУ (для телефона)
   ============================================================
   На десктопе меню открывается при наведении (CSS :hover).
   На телефоне по клику.
   ============================================================ */

// Ждём, пока весь HTML загрузится
document.addEventListener('DOMContentLoaded', function () {

    // Ищем элементы переключателя
    var switcher = document.querySelector('.lang-switcher');   // контейнер всего переключателя
    var current  = document.querySelector('.lang-current');    // видимый флаг 🇬🇧

    // Если элементы найдены — вешаем обработчик клика
    if (switcher && current) {
        current.addEventListener('click', function (event) {
            // Отменяем всплытие, чтобы клик не ушёл выше
            event.stopPropagation();
            // Переключаем класс .open — через него будем показывать меню
            switcher.classList.toggle('open');
        });
    }

    // Закрываем меню, если кликнули куда-то ещё на странице
    document.addEventListener('click', function () {
        if (switcher) {
            switcher.classList.remove('open');
        }
    });
});