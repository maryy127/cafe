document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.mobile-menu-toggle'); 
    const mobileMenu = document.querySelector('.mobile-menu');       
    const hasSubmenuItems = document.querySelectorAll('.mobile-menu .has-submenu');
    const menuOnMobile = document.querySelector('svg.menu.on-mobile');
    const menuHeader = document.querySelector('svg.menu.on-header');
    const overlay = document.querySelector('.overlay');
    const header = document.querySelector('header');

    // Открытие/закрытие меню при клике на кнопку
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        menuHeader.classList.toggle('active');
        menuOnMobile.classList.remove('active');
        setTimeout(() => {
            mobileMenu.classList.toggle('active');
            overlay.classList.toggle('active');
            menuOnMobile.classList.add('active');
            document.querySelectorAll('.mobile-submenu').forEach(s => {
                if (s.classList.contains('active') === true){
                    s.classList.remove('active');
                }
            });
            if (mobileMenu.classList.contains('active') === true){
                header.style.display = 'none';
            }else{
                header.style.display = 'flex';
            }
        }, 300)
        
    });

    // Закрытие меню при клике вне его
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && e.target !== menuToggle) {
            setTimeout(() =>{
                mobileMenu.classList.remove('active');
                menuHeader.classList.remove('active');
                overlay.classList.remove('active');
                header.style.display = 'flex';
                header.style.animation = 'fadeIn 0.3s 1';
            }, 300);
        }
    });

    overlay.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
        menuHeader.classList.remove('active');
    });

    // Обработка клика на родительский пункт
    hasSubmenuItems.forEach(item => {
        const parentLink = item.querySelector('a');
        parentLink.addEventListener('click', (e) => {
            document.querySelectorAll('.mobile-submenu').forEach(s => {
                if (s.classList.contains('active') === true){
                    s.classList.remove('active');
                }
            });
            if (window.innerWidth <= 768) { 
                e.preventDefault(); 
                const mobileSubmenu = item.querySelector('.mobile-submenu');
                if (mobileSubmenu) {
                    mobileSubmenu.classList.toggle('active'); 
                }
            }
        });
    });

    // Закрытие меню при клике на любую ссылку (кроме родительских пунктов)
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            if (!link.parentElement.classList.contains('has-submenu')) {
                menuOnMobile.classList.toggle('active');
                setTimeout(() => {
                    mobileMenu.classList.remove('active');
                    menuHeader.classList.remove('active');
                    overlay.classList.remove('active');
                    header.style.display = 'flex';
                    header.style.animation = 'fadeIn 0.3s 1';
                }, 150); 
            }
        });
    });

    document.querySelectorAll('.mobile-submenu li').forEach(item => {
        item.addEventListener('click', () => {
            const submenu = item.closest('.mobile-submenu');
            if (submenu) {
                submenu.classList.remove('active');
            }
        });
    });

    menuOnMobile.addEventListener('click', () => {
        menuOnMobile.classList.toggle('active');
        setTimeout(() => {
            mobileMenu.classList.remove('active');
            menuHeader.classList.remove('active');
            overlay.classList.remove('active');
            header.style.display = 'flex';
            header.style.animation = 'fadeIn 0.3s 1';
        }, 300); 

    }); 
});