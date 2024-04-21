document.addEventListener("DOMContentLoaded", function() {
    const navbarTogglerButton = document.querySelector(".navbar-toggler");
    const heroSocialMobile = this.documentElement.querySelector('.hero-social-media');
    
    navbarTogglerButton.addEventListener("click", function() {
        const visualHero = document.getElementById('visualHero');
        const hasClass = visualHero.classList.contains('hide');
        heroSocialMobile.classList.remove('show');
        heroSocialMobile.classList.add('hide');
        if (!hasClass) {
            visualHero.classList.add('hide');
        } else {
            visualHero.classList.remove('hide');
        }
        const timerId = setTimeout(() => {
            heroSocialMobile.classList.remove('hide');
            heroSocialMobile.classList.add('show');
        }, 1500);
        // if (timerId) {
        //     clearTimeout(timerId);
        // }
    });

    document.getElementById('btn-ordenar').addEventListener('click', function() {
        window.location.href = 'productos.html';
    }); 

    
    const timerId2 = setTimeout(() => {
        heroSocialMobile.classList.add('show');
    }, 1500);
    // if (timerId2) {
    //     clearTimeout(timerId2);
    // }
});

