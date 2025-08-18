document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn-menu');
    const goods = document.querySelectorAll('.good');
    const categoryMap = {
        'Акции': 'special',
        'Кофе': 'cofe',
        'Чай': 'tea',
        'Десерты и выпечка': 'baked',
        'Все': 'all',
        'Новинки': 'new'
    };

    const titleSpecial = document.querySelector('#special .title')

    let currentCategory = 'all'; 
    let productsPerPage;
    let totalPages;
    let currentPage = 1;

    let tuda = -1;

    const pagination = document.querySelector('.pagination');
    const prevButton = pagination.querySelector('.prev-page');
    const nextButton = pagination.querySelector('.next-page');
    const pageNumber = pagination.querySelector('.page-number');

    const timerElements = document.querySelectorAll('.timer-time');
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 3);

    const bells = document.querySelectorAll('.bell-toggle');


    // Функция для получения количества товаров на странице
    function getProductsPerPage() {
        const width = window.innerWidth;
        if (width > 1099) return 4;
        return 3;
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

    updatePagination();

    window.addEventListener('resize', updatePagination);

    // Спец предложения hue-rotate
    setInterval(() => {
        const randomHue = Math.floor(Math.random() * 361);
        const randomTrans = Math.floor(Math.random() * 15);
        const randomTrans2 = Math.floor(Math.random() * 6);
        const tuda2 = Math.random() < 0.5 ? -1 : 1;
        titleSpecial.style.filter = `hue-rotate(${randomHue}deg)`; 
        titleSpecial.style.transform = `translate(${randomTrans * tuda}px, ${randomTrans2 * tuda2}px)`;
        tuda = tuda * -1
    }, 900);

    bells.forEach(bell => {
        bell.setAttribute('title', 'Кликни, чтобы остановить анимацию');
        bell.addEventListener('click', () => {
            if (bell.classList.contains('fa-shake')) {
                setTimeout(() => {
                    bell.classList.remove('fa-shake'); 
                }, 300);
                
                bell.setAttribute('title', 'Кликни, чтобы начать анимацию');
            } else {
                setTimeout(() => {
                    bell.classList.add('fa-shake');
                }, 300);
                 
                bell.setAttribute('title', 'Кликни, чтобы остановить анимацию');
            }
        });
    });

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
                solidHeart.classList.add('fa-bounce')
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

        const discountElement = special.querySelector('.ribbon span');
        discountElement.textContent = `–${discountRounded}%`;
    });

    // Таймер спецпредложений
    function getRandomEndTime() {
        return 24 + Math.floor(Math.random() * (168 - 24 + 1)); 
    }

    // Устанавливаем уникальную конечную дату для каждого таймера
    timerElements.forEach(timer => {
        const now = new Date();
        const hoursToAdd = getRandomEndTime();
        const endDate = new Date(now.getTime() + hoursToAdd * 60 * 60 * 1000);

        // Запускаем таймер для каждого элемента
        setInterval(() => {
            const now = new Date();
            const diff = endDate - now;

            // Проверяем, истекло ли время
            if (diff <= 0) {
                timer.textContent = 'Акция завершена';
                return; // Останавливаем обновление после истечения времени
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            const timeString = `${days} д ${hours} ч ${minutes} мин ${seconds} c`;
            timer.textContent = timeString;
        }, 1000);
    });
});