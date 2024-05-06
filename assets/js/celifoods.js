const jsonFilePathPopulares = "./assets/data/productos-populares.json";

const tooltipTriggerList = document.querySelectorAll(
  '[data-bs-toggle="tooltip"]'
);
const tooltipList = [...tooltipTriggerList].map(
  (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
);


$(document).ready(function () {
  $(".slider").slick({
    autoplay: true,
    autoplaySpeed: 2000,
    dots: true,
    arrows: false,
  });
});


window.addEventListener('scroll', function() {
    var scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollPosition > 600) { 
        document.querySelector('.btn-scroll-top').classList.add('visible');
    } else {
        document.querySelector('.btn-scroll-top').classList.remove('visible');
    }
});
