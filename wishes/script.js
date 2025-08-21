document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('wish-form');
    const messagesContainer = document.getElementById('messages');
    const notificationContainer = document.getElementById('notification-container');
    let usersMessages = JSON.parse(localStorage.getItem('usersMessages') || '[]');
    let pendingDeletion = null;
    let deleteTimeoutId = null; 

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
        displayMessages.forEach((wish) => {
            const isUserMessage = usersMessages.some(u => u.id === wish.id);
            const messageElement = createMessageElement(wish.name, wish.text, isUserMessage, wish.id);
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
                    pendingDeletion = { id: wish.id, element: messageElement };
                    addNotification('Вернуть пожелание?', false, true);
                    deleteTimeoutId = setTimeout(() => {
                        if (pendingDeletion) {
                            removeUserMessagePermanently();
                            const restoreNotif = notificationContainer.querySelector('.restore-notification');
                            if (restoreNotif) restoreNotif.remove();
                        }
                    }, 6000);
                });
            }
        });
    }

    // Функция для создания элемента сообщения
    function createMessageElement(name, text, isUserMessage = false, id = null) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.dataset.id = id;
        if (isUserMessage) {
            messageDiv.classList.add('user-message');
            messageDiv.innerHTML = `<span class="name">${name}:</span> <p>${text}</p> <i class="fa-solid fa-trash delete-icon" style="display: none; cursor: pointer;"></i>`;
        } else {
            messageDiv.innerHTML = `<span class="name">${name}:</span> <p>${text}</p>`;
        }
        return messageDiv;
    }

    // Функция для создания уведомления
    function createNotification(message, showClearButton = false, showRestoreButton = false) {
        const notification = document.createElement('div');
        notification.classList.add('notification');
        if (showRestoreButton) {
            notification.classList.add('restore-notification'); 
        }
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
            if (deleteTimeoutId) clearTimeout(deleteTimeoutId); 
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
                if (deleteTimeoutId) clearTimeout(deleteTimeoutId);
            });
            notification.appendChild(clearBtn);
        } else if (showRestoreButton) {
            const restoreBtn = document.createElement('button');
            restoreBtn.textContent = 'Да';
            restoreBtn.style.margin = '15px auto';
            restoreBtn.addEventListener('click', () => {
                if (pendingDeletion) {
                    pendingDeletion.element.style.display = 'flex';
                    pendingDeletion = null;
                }
                notification.remove();
                if (deleteTimeoutId) clearTimeout(deleteTimeoutId); 
            });
            notification.appendChild(restoreBtn);
        }

        return notification;
    }

    // Функция для добавления уведомления
    function addNotification(message, showClearButton = false, showRestoreButton = false) {
        if (notificationContainer) {
            const maxNotifications = 3;
            if (notificationContainer.children.length >= maxNotifications) {
                notificationContainer.removeChild(notificationContainer.firstChild);
                console.log('Удалено одно старое уведомление для соблюдения лимита:', maxNotifications);
            }
            const notification = createNotification(message, showClearButton, showRestoreButton);
            notificationContainer.appendChild(notification);
            notification.style.animation = "1.1s translateNot 1";
            notification.style.transform = "translateX(0)";
        } else {
            console.error('Контейнер уведомлений не найден!');
        }
    }

    // Функция для окончательного удаления сообщения
    function removeUserMessagePermanently() {
        if (pendingDeletion) {
            usersMessages = usersMessages.filter(u => u.id !== pendingDeletion.id);
            localStorage.setItem('usersMessages', JSON.stringify(usersMessages));
            displayWishes();
            pendingDeletion = null;
            if (deleteTimeoutId) clearTimeout(deleteTimeoutId);
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
                    const restoreNotif = notificationContainer.querySelector('.restore-notification');
                    if (restoreNotif) restoreNotif.remove(); 
                }
                const newId = Date.now().toString();
                usersMessages.push({ name, text: wish, id: newId });
                localStorage.setItem('usersMessages', JSON.stringify(usersMessages));
                displayWishes();
                form.reset();
                addNotification(
                    'Сообщение отправлено в локальное хранилище браузера, тк серверов пока что нет, поэтому можете написать мне в <a href="https://t.me/garnaya271" style="color: brown;" target="_blank">Телеграм</a>.'
                );
            }
        } else {
            console.log('Поля не заполнены');
        }
    });

    // Обработка закрытия/перезагрузки страницы
    window.addEventListener('beforeunload', () => {
        if (pendingDeletion) {
            removeUserMessagePermanently();
        }
    });
});
