document.addEventListener('DOMContentLoaded', () => {
    const goodsContainer = document.querySelector('.goods');
    const emptyMessage = document.querySelector('.empty-message');
    const allGoods = [
        {
            title: 'Рахат-лукум',
            image: '../../goods-imgs/rahat-lukum.jpg',
            price: '<s style="color: brown;">480₽</s> 339₽',
            classes: ['special', 'baked', 'new'],
            isNew: true,
            discount: '–29%'
        },
        {
            title: 'Морковный торт',
            image: '../../goods-imgs/carrot.jpg',
            price: '<s style="color: brown;">430₽</s> 299₽',
            classes: ['special', 'baked', 'new'],
            isNew: true,
            discount: '–30%'
        },
        {
            title: 'Кофе по-венски',
            image: '../../goods-imgs/venom.jpeg',
            price: '<s style="color: brown;">370₽</s> 259₽',
            classes: ['special', 'cofe', 'new'],
            isNew: true,
            discount: '–30%'
        },
        {
            title: 'Апельсиновый кофе со льдом',
            image: '../../goods-imgs/cofe-orange.jpg',
            price: '<s style="color: brown;">370₽</s> 289₽',
            classes: ['special', 'cofe'],
            isNew: false,
            discount: '–22%'
        },
        {
            title: 'Чай китайский традиционный',
            image: '../../goods-imgs/chinese-tea.jpeg',
            price: '<s style="color: brown;">290₽</s> 199₽',
            classes: ['special', 'tea'],
            isNew: false,
            discount: '–31%'
        },
        {
            title: 'Синнабон горяченький',
            image: '../../goods-imgs/koritsa.jpg',
            price: '<s style="color: brown;">299₽</s> 179₽',
            classes: ['special', 'baked'],
            isNew: false,
            discount: '–40%'
        },
        {
            title: 'Капучино',
            image: '../../goods-imgs/cuppucino.jpeg',
            price: '230₽',
            classes: ['cofe'],
            isNew: false
        },
        {
            title: 'Американо',
            image: '../../goods-imgs/americano.jpeg',
            price: '210₽',
            classes: ['cofe'],
            isNew: false
        },
        {
            title: 'Латте',
            image: '../../goods-imgs/latte.jpg',
            price: '250₽',
            classes: ['cofe'],
            isNew: false
        },
        {
            title: 'Эспрессо',
            image: '../../goods-imgs/esspresso.jpeg',
            price: '190₽',
            classes: ['cofe'],
            isNew: false
        },
        {
            title: 'Чай облепиховый',
            image: '../../goods-imgs/oblepiha.jpg',
            price: '271₽',
            classes: ['tea'],
            isNew: false
        },
        {
            title: 'Чай апельсиновый с имбирем',
            image: '../../goods-imgs/orange.jpeg',
            price: '215₽',
            classes: ['tea'],
            isNew: false
        },
        {
            title: 'Чай черный Травы Сибири',
            image: '../../goods-imgs/black-tea.jpg',
            price: '195₽',
            classes: ['tea'],
            isNew: false
        },
        {
            title: 'Круассан шоколадный',
            image: '../../goods-imgs/cruasan.jpg',
            price: '230₽',
            classes: ['baked'],
            isNew: false
        },
        {
            title: 'Чизкейк Нью-Йорк',
            image: '../../goods-imgs/cheesecake.jpg',
            price: '230₽',
            classes: ['baked'],
            isNew: false
        },
        {
            title: 'Вафельная палочка со сгущенкой',
            image: '../../goods-imgs/vaffel.jpg',
            price: '120₽',
            classes: ['baked'],
            isNew: false
        },
        {
            title: 'Пироженное картошка',
            image: '../../goods-imgs/potato_ijbol.jpeg',
            price: '70₽',
            classes: ['baked'],
            isNew: false
        }
    ];

    function renderFavorites() {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '{}');
        goodsContainer.innerHTML = '';
        const favoriteItems = allGoods.filter(good => favorites[good.title]);

        if (favoriteItems.length === 0) {
            emptyMessage.style.display = 'block';
            return;
        }

        emptyMessage.style.display = 'none';

        favoriteItems.forEach(good => {
            const goodElement = document.createElement('div');
            goodElement.className = 'good ' + good.classes.join(' ');
            goodElement.style.display = 'block';
            goodElement.innerHTML = `
                <img src="${good.image}" alt="${good.title}">
                <p class="title">${good.title}</p>
                <p class="price"><i class="fa-solid fa-dollar-sign"></i>${good.price}</p>
                ${good.isNew ? '<img src="../../goods-imgs/new.webp" alt="New" class="new">' : ''}
                ${good.discount ? `<div class="ribbon"><span>${good.discount}</span></div>` : ''}
                <i class="fa-solid fa-heart" title="Удалить из Избранного" style="display: block;"></i>
                <i class="fa-regular fa-heart" title="Добавить в Избранное" style="display: none;"></i>
            `;

            goodsContainer.appendChild(goodElement);

            const solidHeart = goodElement.querySelector('.fa-solid.fa-heart');
            const regularHeart = goodElement.querySelector('.fa-regular.fa-heart');
            
            solidHeart.addEventListener('click', () => {
                        solidHeart.style.display = 'none';
                        regularHeart.style.display = 'block';
                        regularHeart.style.opacity = '1';

                        const timeoutId = setTimeout(() => {
                            goodElement.remove();
                            const updatedFavorites = JSON.parse(localStorage.getItem('favorites') || '{}');
                            delete updatedFavorites[good.title];
                            localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
                            if (!document.querySelector('.good')) {
                                emptyMessage.style.display = 'block';
                            }
                            regularHeart.removeEventListener('click', cancelRemoval);
                        }, 1500);

                        // Отмена удаления
                        const cancelRemoval = () => {
                            clearTimeout(timeoutId);
                            regularHeart.style.display = 'none';
                            solidHeart.style.display = 'block';
                            solidHeart.style.opacity = '1';
                            regularHeart.removeEventListener('click', cancelRemoval);
                        };
                        regularHeart.addEventListener('click', cancelRemoval);
                    });
                });
            }

    renderFavorites();
});