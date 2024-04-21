document.addEventListener("DOMContentLoaded", function() {
    const navbarTogglerButton = document.querySelector(".navbar-toggler");
    navbarTogglerButton.addEventListener("click", function() {
        const visualHero = document.getElementById('visualHero');
        const hasClass = visualHero.classList.contains('hide');
        if (!hasClass) {
            visualHero.classList.add('hide');
        } else {
            visualHero.classList.remove('hide');
        }
    });

    document.getElementById('btn-ordenar').addEventListener('click', function() {
        window.location.href = 'productos.html';
    }); 
});

