document.addEventListener('DOMContentLoaded', () => {
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    const bounceBtn = document.querySelector('.btn')
    
    bounceBtn.addEventListener('click', () => {
        bounceBtn.classList.remove('fa-bounce')
    });

    if (!scrollToTopBtn) {
        console.warn('Элемент .scroll-to-top не найден');
        return;
    }

    let targetId;
    if (document.body.classList.contains('goods-page')) {
        targetId = 'our-goods';
    } else if (document.body.classList.contains('main-page')) {
        targetId = 'hero';
    } else if (document.body.classList.contains('work-page')){
        targetId = 'our-work';
    } else if (document.body.classList.contains('wish-page')){
        targetId = 'wish';
    }

    const targetElement = document.getElementById(targetId);
    if (!targetElement) {
        console.warn(`Элемент с id ${targetId} не найден`);
        return;
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 250) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: targetElement.offsetTop,
            behavior: 'smooth'
        });
    });
});