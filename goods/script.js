document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn-menu');
    const goods = document.querySelectorAll('.good');
    const categoryMap = {
        'Акции': 'special',
        'Кофе': 'cofe',
        'Чай': 'tea',
        'Выпечка': 'baked',
        'Все': 'all',
        'Новинки': 'new'
    };

    let currentCategory = 'all'; // Текущая категория по умолчанию
    let productsPerPage;
    let totalPages;
    let currentPage = 1;

    const pagination = document.querySelector('.pagination');
    const prevButton = pagination.querySelector('.prev-page');
    const nextButton = pagination.querySelector('.next-page');
    const pageNumber = pagination.querySelector('.page-number');

    // Функция для получения количества товаров на странице
    function getProductsPerPage() {
        const width = window.innerWidth;
        if (width > 1239) return 6;
        if (width < 553) return 3;
        return 4;
    }

    // Функция для фильтрации товаров по категории
    function filterGoods() {
        let filteredGoods = [];
        goods.forEach(good => {
            if (currentCategory === 'all' || good.classList.contains(currentCategory)) {
                filteredGoods.push(good);
            }
        });
        return filteredGoods;
    }

    // Функция для отображения товаров текущей страницы
    function showPage(page) {
        const filteredGoods = filterGoods();
        const start = (page - 1) * productsPerPage;
        const end = start + productsPerPage;

        filteredGoods.forEach((good, index) => {
            if (index >= start && index < end) {
                good.classList.add('active');
            } else {
                good.classList.remove('active');
            }
        });

        // Скрываем товары, не входящие в текущую категорию
        goods.forEach(good => {
            if (!filteredGoods.includes(good)) {
                good.classList.remove('active');
            }
        });

        pageNumber.textContent = page;
    }

    // Функция для обновления кнопок пагинации
    function updateButtons() {
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages;
    }

    // Функция для обновления пагинации
    function updatePagination() {
        productsPerPage = getProductsPerPage();
        const filteredGoods = filterGoods();
        totalPages = Math.ceil(filteredGoods.length / productsPerPage) || 1;
        if (currentPage > totalPages) currentPage = totalPages;
        showPage(currentPage);
        updateButtons();
    }

    // Инициализация при загрузке
    updatePagination();

    // Обработка изменения размера окна
    window.addEventListener('resize', updatePagination);

    // Обработка кликов по кнопкам категорий
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const categoryText = button.textContent;
            currentCategory = categoryMap[categoryText];

            currentPage = 1; 
            updatePagination();
        });
    });

    // Обработка кликов по кнопкам пагинации
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            showPage(currentPage);
            updateButtons();
        }
    });

    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            showPage(currentPage);
            updateButtons();
        }
    });

    // Обработка сердечек
    goods.forEach(good => {
        const regularHeart = good.querySelector('.fa-regular.fa-heart');
        const solidHeart = good.querySelector('.fa-solid.fa-heart');

        if (!regularHeart || !solidHeart) {
            console.warn('Не найдены иконки сердечек в одном из элементов .good:', good);
            return;
        }

        regularHeart.setAttribute('title', 'Добавить в Избранное');
        solidHeart.setAttribute('title', 'Удалить из Избранного');

        regularHeart.addEventListener('click', () => {
            regularHeart.style.opacity = '0';
            setTimeout(() => {
                regularHeart.style.display = 'none';
                solidHeart.style.display = 'block';
                solidHeart.style.opacity = '1';
                solidHeart.style.animation = 'bounce 0.5s ease';
                solidHeart.setAttribute('title', 'Удалить из Избранного');
            }, 100);
        });

        solidHeart.addEventListener('click', () => {
            solidHeart.style.opacity = '0';
            setTimeout(() => {
                solidHeart.style.display = 'none';
                regularHeart.style.display = 'block';
                regularHeart.style.opacity = '1';
                regularHeart.style.animation = 'bounce 0.5s ease';
                regularHeart.setAttribute('title', 'Добавить в Избранное');
            }, 100);
        });
    });

    // Расчет скидки для спецпредложений
    const specials = document.querySelectorAll('.special');
    specials.forEach(special => {
        const priceElement = special.querySelector('.price');
        const oldPriceText = priceElement.querySelector('s').textContent;
        const newPriceText = priceElement.childNodes[priceElement.childNodes.length - 1].textContent.trim();

        const oldPrice = parseFloat(oldPriceText.replace('₽', ''));
        const newPrice = parseFloat(newPriceText.replace('₽', ''));

        const discount = ((oldPrice - newPrice) / oldPrice) * 100;
        const discountRounded = Math.round(discount);

        const discountElement = special.querySelector('.disc p');
        discountElement.textContent = `–${discountRounded}%`;
    });
});