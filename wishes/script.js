document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('wish-form');
    const messagesContainer = document.getElementById('messages');
    const notificationContainer = document.getElementById('notification-container');
    let usersMessages = JSON.parse(localStorage.getItem('usersMessages') || '[]');
    let pendingDeletion = null; 

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

    // Функция для отображения пожеланий
    function displayWishes() {
        messagesContainer.innerHTML = '';
        const minFakeWishes = 6;
        const maxTotalMessages = 106;
        const shuffledFake = fakeWishes.sort(() => 0.7 - Math.random()).slice(0, minFakeWishes);
        const maxUserMessages = 100;
        const userDisplay = usersMessages.slice(-maxUserMessages).reverse(); 
        const displayMessages = [...userDisplay, ...shuffledFake].slice(0, maxTotalMessages);
        displayMessages.forEach((wish, index) => {
            const isUserMessage = usersMessages.some(u => u.name === wish.name && u.text === wish.text);
            const messageElement = createMessageElement(wish.name, wish.text, isUserMessage);
            messagesContainer.appendChild(messageElement);
            if (isUserMessage) {
                const deleteIcon = messageElement.querySelector('.delete-icon');
                messageElement.addEventListener('mouseover', () => {
                    deleteIcon.style.display = 'block';
                });
                messageElement.addEventListener('mouseout', () => {
                    deleteIcon.style.display = 'none';
                });
                deleteIcon.addEventListener('click', () => {
                    messageElement.style.display = 'none';
                    pendingDeletion = { name: wish.name, text: wish.text, element: messageElement };
                    addNotification('Вернуть пожелание?', false, true); 
                });
            }
        });
    }

    // Функция для создания элемента сообщения
    function createMessageElement(name, text, isUserMessage = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        if (isUserMessage) {
            messageDiv.classList.add('user-message');
            messageDiv.innerHTML = `<span class="name">${name}:</span> <p>${text}</p> <i class="fa-solid fa-trash delete-icon" style="display: none; cursor: pointer;"></i>`;
        } else {
            messageDiv.innerHTML = `<span class="name">${name}:</span> <p>${text}<p>`;
        }
        return messageDiv;
    }

    // Функция для создания уведомления
    function createNotification(message, showClearButton = false, showRestoreButton = false) {
        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.innerHTML = message;

        const closeBtn = document.createElement('i');
        closeBtn.classList.add('fas', 'fa-times', 'close-btn');
        notification.appendChild(closeBtn);
        notification.style.display = 'block';

        closeBtn.addEventListener('click', () => {
            if (showRestoreButton && pendingDeletion) {
                removeUserMessagePermanently();
            }
            notification.remove();
        });

        if (showClearButton) {
            const clearBtn = document.createElement('button');
            clearBtn.textContent = 'Очистить';
            clearBtn.style.margin = '15px auto';
            clearBtn.addEventListener('click', () => {
                usersMessages = [];
                localStorage.setItem('usersMessages', JSON.stringify(usersMessages));
                displayWishes();
                notification.remove();
            });
            notification.appendChild(clearBtn);
        } else if (showRestoreButton) {
            const restoreBtn = document.createElement('button');
            restoreBtn.textContent = 'Да';
            restoreBtn.style.margin= '15px auto';
            restoreBtn.addEventListener('click', () => {
                if (pendingDeletion) {
                    pendingDeletion.element.style.display = 'flex';
                    pendingDeletion = null;
                }
                notification.remove();
            });
            notification.appendChild(restoreBtn);
        }

        return notification;
    }

    // Функция для добавления уведомления
    function addNotification(message, showClearButton = false, showRestoreButton = false) {
        if (notificationContainer) {
            const maxNotifications = window.innerWidth >= 768 ? 5 : 3;
            const notification = createNotification(message, showClearButton, showRestoreButton);
            notificationContainer.appendChild(notification);
            if (notificationContainer.children.length > maxNotifications) {
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

    // Функция для окончательного удаления сообщения
    function removeUserMessagePermanently() {
        if (pendingDeletion) {
            usersMessages = usersMessages.filter(u => !(u.name === pendingDeletion.name && u.text === pendingDeletion.text));
            localStorage.setItem('usersMessages', JSON.stringify(usersMessages));
            displayWishes();
            pendingDeletion = null;
        }
    }

    displayWishes();

    // Обработка отправки формы
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Форма отправлена');
        let name = document.getElementById('name-input').value.trim();
        const wish = document.getElementById('wish-input').value.trim();
        name = name.charAt(0).toUpperCase() + name.slice(1);

        if (name && wish) {
            console.log('Поля заполнены:', name, wish);
            if (usersMessages.length >= 100) {
                addNotification(
                    'Достигнут лимит в 100 сообщений. Очистить все ваши сообщения?',
                    true
                );
            } else {
                if (pendingDeletion) {
                    removeUserMessagePermanently();
                    const activeNotif = notificationContainer.querySelector('.notification');
                    if (activeNotif) activeNotif.remove();
                }
                usersMessages.push({ name, text: wish });
                localStorage.setItem('usersMessages', JSON.stringify(usersMessages));
                displayWishes();
                form.reset();
                addNotification(
                    'Сообщение отправлено, но серверов пока что нет, поэтому можете написать мне в <a href="https://twitter.com/sybau_radicals" style="color: brown;" target="_blank">Твиттер</a>.'
                );
            }
        } else {
            console.log('Поля не заполнены');
        }
    });
});
