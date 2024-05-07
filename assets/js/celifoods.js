const jsonFilePathPopulares = "./assets/data/productos-populares.json";

const tooltipTriggerList = document.querySelectorAll(
  '[data-bs-toggle="tooltip"]'
);
const tooltipList = [...tooltipTriggerList].map(
  (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
);

const footerEnviar = document.getElementById('footer-enviar');
if (footerEnviar) {
    footerEnviar.addEventListener('click', () => {
        const footerEmail = document.getElementById('footer-email');
        const footerMsg = document.getElementById('footer-msg');

        const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(footerEmail.value.trim());
        if (!validEmail || footerMsg.value.trim() === '') {
            Swal.fire({
                title: 'Datos inválidos',
                text: !validEmail ? 'Correo es inválido' : 'El mensaje está vacío.',
                icon: 'error',
                confirmButtonText: 'Cerrar'
            });
        } else {
            Swal.fire({
                title: 'Solicitud enviada',
                icon: 'success',
                confirmButtonText: 'Cerrar'
            }).then(() => {
                footerEmail.value = '';
                footerMsg.value = '';
            });
        }
    });
}


const iniciemosEnviar = document.getElementById('iniciemosEnviar');
if (iniciemosEnviar) {
    iniciemosEnviar.addEventListener('click', () => {
        const iniciemosEmail = document.getElementById('iniciemosEmail');

        const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(iniciemosEmail.value.trim());
        if (!validEmail) {
            Swal.fire({
                title: 'Datos inválidos',
                text: 'Correo es inválido',
                icon: 'error',
                confirmButtonText: 'Cerrar'
            });
        } else {
            Swal.fire({
                title: 'Solicitud enviada',
                icon: 'success',
                confirmButtonText: 'Cerrar'
            }).then(() => {
                iniciemosEmail.value = '';
            });
        }
    });
}

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