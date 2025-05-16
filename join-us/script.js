document.addEventListener('DOMContentLoaded', () => {
    const sigmoMoment = document.querySelector('#motivate .stan')
    const form = document.querySelector('.career-form');
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalMessage = document.querySelector('.modal-message');
    const modalClose = document.querySelector('.modal-close');
    const modalContent = document.querySelector('.modal-content');
    const selectWrapper = document.querySelector('.select-wrapper');
    const select = selectWrapper.querySelector('select');
    const btnsDownload = document.querySelectorAll('.card .btn');

    // Скачивание файлов-требований
    btnsDownload.forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.card');
            if (!card) return;

            const secondClass = card.classList[1];
            if (!secondClass) return;

            const fileName = `${secondClass}.txt`;

            // Создаем ссылку для скачивания
            const link = document.createElement('a');
            link.href = fileName; 
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    });

    if (!form || !modalOverlay || !modalMessage || !modalClose) {
        console.warn('Не найдены элементы формы или модального окна');
        return;
    }

    sigmoMoment.addEventListener('click', () => {
        alert('перемога кто-та сюда нажал');
    });

    select.addEventListener('click', () => {
        selectWrapper.classList.toggle('open');
    });

    select.addEventListener('blur', () => {
        selectWrapper.classList.remove('open');
    });
    select.addEventListener('change', () => {
        selectWrapper.classList.remove('open');
    });


    function showModal(message, isSuccess) {
        modalMessage.textContent = message;
        modalContent.style.backgroundColor = isSuccess ? '#a6dca8' : '#e38f76';
        modalMessage.style.color = isSuccess ? '#4caf50' : '#ed2323'; 
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
        let age = document.querySelector('input[name="age"]').value;
        age = Number(age);
        const hasNumber = /\d/.test(name);
        if (hasNumber === true){
            showModal('мистер числительное бай', false)
        }else if (age < 13){
            showModal('Иди поиграй в машонки', false)
        } else if (age > 94){
            showModal('Отдохди от жизни', false)
        }else if (name && phone && email) {
            showModal('Ваша заявка успешно отправлена! Мы скоро с вами свяжемся.', true);
            form.reset(); 
        } else {
            showModal('Пожалуйста, заполните все обязательные поля.', false);
        }
    });

});