document.addEventListener('DOMContentLoaded', () => {
    const sigmoMoment = document.querySelector('#motivate .stan')
    const form = document.querySelector('.career-form');
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalMessage = document.querySelector('.modal-message');
    const modalClose = document.querySelector('.modal-close');

    if (!form || !modalOverlay || !modalMessage || !modalClose) {
        console.warn('Не найдены элементы формы или модального окна');
        return;
    }

    sigmoMoment.addEventListener('click', () => {
        alert('перемога кто-та сюда нажал');
    });

    function showModal(message, isSuccess) {
        modalMessage.textContent = message;
        modalMessage.style.color = isSuccess ? '#4caf50' : '#ff5722'; 
        modalOverlay.classList.add('active');
    }

    // Закрытие модального окна
    modalClose.addEventListener('click', () => {
        modalOverlay.classList.remove('active');
    });

    // Закрытие при клике на оверлей
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
        }
    });

    // Обработка отправки формы
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.querySelector('input[name="name"]').value;
        const phone = document.querySelector('input[name="phone"]').value;
        const email = document.querySelector('input[name="email"]').value;

        if (name && phone && email) {
            showModal('Ваша заявка успешно отправлена! Мы скоро с вами свяжемся.', true);
            form.reset(); 
        } else {
            showModal('Пожалуйста, заполните все обязательные поля.', false);
        }
    });

});