document.addEventListener('DOMContentLoaded', () => {
    const photosContainer = document.querySelector('.photos');
    const prevBtn = document.querySelector('.navig.left i');
    const nextBtn = document.querySelector('.navig.right i');
    const totalPhotos = document.querySelectorAll('.photo').length;
    let currentIndex = 0;

    function updateGallery() {
        const offset = -currentIndex * 100;
        photosContainer.style.transform = `translateX(${offset}%)`;
    }

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + totalPhotos) % totalPhotos;
        updateGallery();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % totalPhotos;
        updateGallery();
    });
});
