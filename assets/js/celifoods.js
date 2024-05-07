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

function formatDate(dateString) {
    const dateParts = dateString.split('/');
  
    const day = dateParts[0];
    const month = dateParts[1];
  
    const monthNames = { 
      '01': 'JAN',
      '02': 'FEB',
      '03': 'MAR',
      '04': 'APR',
      '05': 'MAY',
      '06': 'JUN',
      '07': 'JUL',
      '08': 'AUG',
      '09': 'SEP',
      '10': 'OCT',
      '11': 'NOV',
      '12': 'DEC'
    };
    return {
        day, 
        month: monthNames[month]
    };
}