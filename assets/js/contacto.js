document.getElementById("contacto-form-enviar").addEventListener("click", function(event) {
    event.preventDefault();

    const nombre = document.getElementById("contacto-nombre");
    const correo = document.getElementById("contacto-correo");
    const tel = document.getElementById("contacto-tel");
    const msj = document.getElementById("contacto-msj");


    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.value.trim());
    const telValido = /^\d{8}$/.test(tel.value.trim());


    if (nombre.value.trim() === "" || correo.value.trim() === "" || tel.value.trim() === "" || msj.value.trim() === "" || !correoValido || !telValido) {
        showAlert("Por favor, completa todos los campos correctamente.");
    } else {
        nombre.value = "";
        correo.value = "";
        tel.value = "";
        msj.value = "";
        showAlert("Formulario enviado correctamente.", "success");
        
    }
});


function showAlert(message, type = "danger") {
    const existingAlert = document.querySelector("#contacto .alert");
    if (!existingAlert) {
        const alert = document.createElement("div");
        alert.classList.add("alert", "alert-" + type, "my-3");
        alert.textContent = message;
        document.querySelector("#contacto .contacto-form-container .contacto-form .contact-form-fields").appendChild(alert);
        setTimeout(function() {
            alert.remove();
        }, 3000);
    }
}