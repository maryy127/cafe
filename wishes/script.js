document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('wish-form');
    const messagesContainer = document.getElementById('messages');
    const notificationContainer = document.getElementById('notification-container');

    // Отладка: Проверяем, найдены ли элементы
    console.log('Form:', form);
    console.log('Messages Container:', messagesContainer);
    console.log('Notification Container:', notificationContainer);

    // Фиктивные отзывы
    const fakeWishes = [
        { name: 'Алексей', text: 'ВОООО 👍👍👍👍👍' },
        { name: 'Мария', text: 'Обожаю вашу выпечку, особенно круассаны.' },
        { name: 'Иван', text: 'Уютная атмосфера, идеально для работы.' },
        { name: 'Елена', text: 'Лучший латте в городе!' },
        { name: 'Дмитрий', text: 'Спасибо за дружелюбный персонал.' },
        { name: 'Екатерина', text: 'Каждый день радуюсь свежим кофе!' },
        { name: 'Василий', text: 'Каждый день свежая выпечка 🥐🥐' }
    ];

    // Функция для отображения случайных отзывов
    function displayRandomWishes() {
        const shuffled = fakeWishes.sort(() => 0.7 - Math.random());
        const selected = shuffled.slice(0, 7);
        selected.forEach(wish => {
            const messageElement = createMessageElement(wish.name, wish.text);
            messagesContainer.appendChild(messageElement);
        });
    }

    // Функция для создания элемента сообщения
    function createMessageElement(name, text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.innerHTML = `<span class="name">${name}:</span> ${text}`;
        return messageDiv;
    }
    
    // Уведомление
    function createNotification() {
        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.innerHTML = 'Сообщение отправлено, но серверов пока что нет, поэтому можете написать мне в <a href="https://twitter.com/sybau_radicals" style="color: brown;" target="_blank">Твиттер</a>.';

        const closeBtn = document.createElement('i');
        closeBtn.classList.add('fas', 'fa-times', 'close-btn');
        notification.appendChild(closeBtn);
        notification.style.display = 'block';

        closeBtn.addEventListener('click', () => {
            notification.remove();
        });

        return notification;
    }

    // Функция для добавления уведомления
    function addNotification(notificationContainer) {
        if (notificationContainer) {
            const maxNotifications = window.innerWidth >= 768 ? 5 : 3;
            const notification = createNotification();
            notificationContainer.appendChild(notification);
            if (notificationContainer.children.length >= maxNotifications) {
                while (notificationContainer.firstChild) {
                    notificationContainer.removeChild(notificationContainer.firstChild);
                }
                console.log('Все уведомления удалены, достигнут лимит:', maxNotifications);
            }
            notification.style.animation = "1.1s translateNot 1";
            notification.style.transform = "translateX(0)";
        } else {
            console.error('Контейнер уведомлений не найден!');
        }
    }


    // Отображаем случайные отзывы при загрузке
    displayRandomWishes();

    // Обработка отправки формы
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Форма отправлена');
        let name = document.getElementById('name-input').value.trim();
        const wish = document.getElementById('wish-input').value.trim();
        name = String(name).charAt(0).toUpperCase() + String(name).slice(1);
        if (name && wish) {
            console.log('Поля заполнены:', name, wish);
            const messageElement = createMessageElement(name, wish);
            messagesContainer.appendChild(messageElement);
            form.reset();
            console.log('Вызываем addNotification');
            addNotification(notificationContainer);
        } else {
            console.log('Поля не заполнены');
        }
    });
});
