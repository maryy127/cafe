document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn-menu');
    const goods = document.querySelectorAll('.good');

    const categoryMap = {
        'Спец. предложения': 'special',
        'Кофе': 'cofe',
        'Чай': 'tea',
        'Выпечка': 'baked',
        'Все': 'all'
    };

    const specials = document.querySelectorAll('.special');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const categoryText = button.textContent;
            const categoryClass = categoryMap[categoryText];

            goods.forEach(good => {
                good.classList.remove('active');
                if (categoryClass === 'all' || good.classList.contains(categoryClass)) {
                    good.classList.add('active'); 
                }
            });
        });
    });
    
    goods.forEach(good => {
        const regularHeart = good.querySelector('.fa-regular.fa-heart');
        const solidHeart = good.querySelector('.fa-solid.fa-heart');

        if (!regularHeart || !solidHeart) {
            console.warn('Не найдены иконки сердечек в одном из элементов .good:', good);
            return; 
        }

        regularHeart.setAttribute('title', 'Добавить в Избранное');
        solidHeart.setAttribute('title', 'Удалить из Избранное');

        // Обработчик для пустого сердечка
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

        // Обработчик для полного сердечка
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

    specials.forEach(special => {
        // Находим элемент с ценой
        const priceElement = special.querySelector('.price');
        // Извлекаем старую цену из <s>
        const oldPriceText = priceElement.querySelector('s').textContent;
        // Извлекаем новую цену (последний текст в .price, после <s>)
        const newPriceText = priceElement.childNodes[priceElement.childNodes.length - 1].textContent.trim();

        // Удаляем символ ₽ и преобразуем в числа
        const oldPrice = parseFloat(oldPriceText.replace('₽', ''));
        const newPrice = parseFloat(newPriceText.replace('₽', ''));

        // Рассчитываем процент скидки
        const discount = ((oldPrice - newPrice) / oldPrice) * 100;
        const discountRounded = Math.round(discount); // Округляем до целого

        // Записываем результат в .disc p
        const discountElement = special.querySelector('.disc p');
        discountElement.textContent = `–${discountRounded}%`;
    });
});