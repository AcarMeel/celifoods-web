const jsonFilePath = "./assets/data/productos-populares.json";

const tooltipTriggerList = document.querySelectorAll(
  '[data-bs-toggle="tooltip"]'
);
const tooltipList = [...tooltipTriggerList].map(
  (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
);

AOS.init();

$(document).ready(function () {
  $(".slider").slick({
    autoplay: true,
    autoplaySpeed: 2000,
    dots: true,
    arrows: false,
  });
});
