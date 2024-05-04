const toastTrigger = document.getElementById('toastNotificationCartUpdate');
const toast = new bootstrap.Toast(toastTrigger);
const jsonProvincias = './assets/data/envio.json';
let provincias = [];
const receiptPopupTpl = `
    <div class="receipt-confirmation-icon">
        <i class="fa-regular fa-circle-check text-success"></i>
    </div>
    <h3 class="receipt-h3">Factura realizada con éxito</h3>
    <div class="receipt-top-text">
        <h4 class="receipt-h4">Número de Factura 202405041549</h4>
        <h5 class="receipt-h5">Nombre: Lalal Lalala</h5>
    </div>
    <div class="receipt-items"></div>
    <div class="receipt-totals"></div>
    <div class="receipt-btn-container">
        <a class="btn btn-primary receipt">Dirigir a whatsapp</a>
    </div>
`;

const receiptItemTpl = `
    <p class="receipt-item-name"></p>
    <span>- - - - - - - - - - - - -</span>
    <p class="receipt-item-price"></p>
`;
const receiptTotalItemTpl = `
    <p class="receipt-total-title"></p>
    <p class="receipt-total-price"></p>
`;
const shippingItemsTpl = `
    <div class="shipping-item-popup-left">
        <img class="shipping-item-popup-img" src="" alt="">
        <div class="shipping-item-popup-text">
            <h2></h2>
            <p class="shipping-item-popup-desc"></p>
            <p class="shipping-item-popup-text-precio"></p>
        </div>
    </div>
    <div class="shipping-item-popup-actions">
        <input type="number" min="0" max="5" value="0">
        <button><i class="fa-solid fa-trash-can"></i></button>
    </div>`;
const shippingPopupTpl = `
        <button id="regresar-shipping-btn" data-bs-toggle="tooltip" data-bs-title="Regresar" class="btn btn-outline-secondary regresar">
            <i class="fa-solid fa-arrow-left"></i>
        </button>
        <div class="my-4 alert alert-danger shippingPopupQtyAlert d-none" role="alert">
            Favor ingresar al menos un producto. Solo 5 productos por cliente.
        </div>
        <div class="my-4 alert alert-danger shippingFormErrors d-none" role="alert"></div>
        <div class="my-4 alert alert-info shippingFormInfo d-none" role="alert"></div>
        <div class="shipping-flex">
            <div class="shipping-form">
                <form>
                    <div class="mb-3">
                        <label for="shippingNombre" class="form-label"><span class="required">*</span>Nombre Completo</label>
                        <input type="text" maxlength="25" class="form-control" id="shippingNombre" placeholder="Ej. María Castro">
                    </div>
                    <div class="mb-3">
                        <label for="shippingTel" class="form-label"><span class="required">*</span>Número de Teléfono</label>
                        <input type="tel" maxlength="8" class="form-control" id="shippingTel" placeholder="Ej. 88906543">
                    </div>
                    <div class="mb-3">
                        <label for="shippingCorreo" class="form-label"><span class="required">*</span>Correo electrónico</label>
                        <input type="email" maxlength="25" class="form-control" id="shippingCorreo" placeholder="Ej. alguien@algo.com">
                    </div>
                    <div class="mb-3">
                        <label for="shippingProvincia" class="form-label"><span class="required">*</span>Provincia</label>
                        <select id="provinciaSelect" class="form-select" aria-label="Elegir provincia">
                            <option selected>Elegir provincia</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="shippingPago" class="form-label"><span class="required">*</span>Método de pago</label>
                        <select id="metodoPagoSelect" class="form-select" aria-label="Método de pago">
                            <option selected>Elegir Método de pago</option>
                            <option value="Transferencia bancaria">Transferencia bancaria</option>
                            <option value="SINPE Móvil">SINPE Móvil</option>
                        </select>
                    </div>
                </form>
            </div>
            <div class="shipping-items">
                
            </div>
        </div>
        <div class="shipping-cta my-4 mx-4">
            <button id="shippingFacturarBtn" class="btn btn-primary">facturar</button>
        </div>
`;
const cartListPopupTemplate = `
        <div class="cart-item-popup-left">
            <img class="cart-item-popup-img" src="" alt="">
            <div class="cart-item-popup-text">
                <h2></h2>
                <p></p>
                <p class="cart-item-popup-text-precio"></p>
            </div>
        </div>
        <div class="cart-item-popup-actions">
            <input type="number" min="0" max="5" value="0">
            <button><i class="fa-solid fa-trash-can"></i></button>
        </div>
    `;
const cartPopupTemplate = `
    <h3>Tu carrito</h3>
    <button data-bs-toggle="tooltip" data-bs-title="Regresar" class="btn btn-outline-secondary regresar">
        <i class="fa-solid fa-arrow-left"></i>
    </button>
    <div class="cart-items-popup-list">
        
    </div>
    <div class="cart-items-popup-total">
        <div class="item subtotal">
            <h6>Subtotal</h6>
            <p class="subtotal-display"></p>
        </div>
        <div class="item iva">
            <h6>Total IVAI*</h6>
            <p class="iva-display"></p>
        </div>
    </div>
    <div class="cart-items-popup-footer">
        <div class="alert alert-danger cartPopupQtyAlert d-none" role="alert">
            Favor ingresar al menos un producto. Solo 5 productos por cliente.
        </div>
        <p>*Este precio no incluye el envío.</p>
        <div class="cart-items-popup-footer-cta">
            <button id="descartar-items" class="btn btn-outline-primary">descartar</button>
            <button id="continuar-envio" class="btn btn-primary">continuar</button>
        </div>
    </div>`;

function updateBasketQuantity(quantity, nuevoProducto) {
    let basketData = JSON.parse(localStorage.getItem("basket")) || [];
    const hasItems =  quantity >= 0 && nuevoProducto;

    if (hasItems) {
        const existingProductIndex = basketData.findIndex(
            (product) => product.productId === nuevoProducto.productId
        );
    
        if (quantity > 0) {
            if (existingProductIndex !== -1) {
                basketData[existingProductIndex] = nuevoProducto;
            } else {
                basketData.push(nuevoProducto);
            }
        } else {
            basketData = basketData.filter(
                (product) => product.productId !== nuevoProducto.productId
            );
        }
    }

    const totalPrice = basketData.reduce(
        (acc, product) => acc + product.totalProducto,
        0
    );

    if (hasItems) {
        localStorage.setItem("basket", JSON.stringify(basketData));
    }

    const totalProducts = basketData.reduce(
        (acc, product) => acc + product.cantidad,
        0
    );
    const qtyDisplayBadge = totalProducts > 9 ? '+9' : totalProducts.toString();
    if (window.innerWidth <= 991) {
        const basketElement = document.getElementById(
            "basket-menu-icon-qty-mobile"
        );
        basketElement.textContent = qtyDisplayBadge;
    } else {
        const basketElement = document.getElementById(
            "basket-menu-icon-qty-desktop"
        );
        basketElement.textContent = qtyDisplayBadge;
    }

    localStorage.setItem("totalPriceProducts", totalPrice);
    localStorage.setItem("totalQtyProducts", totalProducts);

    updateInicioCartBtn();

    if (hasItems) {
        toast.show();
    }

    const cartPopupElement = document.querySelector('.cart-items-popup');
    if (cartPopupElement) {
        const cartItems = document.querySelectorAll('.cart-item-popup');
        if ( cartItems && cartItems.length > 0) {
            cartItems.forEach(item => item.remove());
        }
        updateCartPopup(cartPopupElement);
    }
    
}

function updateInicioCartBtn() {
    const basketData = JSON.parse(localStorage.getItem("basket")) || [];

    const elements = document.querySelectorAll('.accion-carrito');
    elements.forEach(element => {
        const productId = element.dataset.productId;
        const badge = element.querySelector('span');
        const productFound = basketData.find(p => p.productId === productId);
        element.disabled = productFound && productFound.cantidad >= 5;
        badge.textContent = productFound ? productFound.cantidad.toString() : "0";
    });
}

['popular-add-cart-1', 'popular-add-cart-2', 'popular-add-cart-3']
    .map(btnId => addItemFromCardCartBtn(btnId));

function addItemFromCardCartBtn(id) {
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener("click", async function () {
            const basketData = JSON.parse(localStorage.getItem("basket")) || [];
            const productId = this.dataset.productId;
            const nombreProducto = this.dataset.nombre;
            const precioProducto = this.dataset.precio;
            const response = await fetch(jsonFilePathPopulares);
            const productos = await response.json();
    
            const detalles = productos.find((p) => p.productId === productId);
            const productFound = basketData.find(p => p.productId === productId);
    
            const quantity = !productFound ? 1 : productFound.cantidad + 1;
    
            updateBasketQuantity(quantity, {
                nombreProducto,
                ...detalles,
                cantidad: quantity,
                precio: precioProducto,
                totalProducto: parseFloat(precioProducto) * quantity,
            });
        });
    }
}

if (toastTrigger && toast) {
    toastTrigger.addEventListener('click', () => {
        toast.hide()
    });
}

function getTotal(cartPopupElement) {
    setInterval(() => {
        const totalPriceProducts = JSON.parse(localStorage.getItem("totalPriceProducts")) || 0;
        cartPopupElement.querySelector('.subtotal-display').textContent = '₡' + totalPriceProducts.toFixed(2);
        cartPopupElement.querySelector('.iva-display').textContent = totalPriceProducts > 0 ? '₡' + (totalPriceProducts * 0.13).toFixed(2) : '₡' + totalPriceProducts.toFixed(2);
    }, 10);
}

function displayNoCartItems(list, cartPopupElement) {
    setTimeout(() => {
        const basketData = JSON.parse(localStorage.getItem("basket")) || [];
        const pEl = document.getElementById('carrito-vacio');
        if (!pEl && (!basketData || basketData && basketData.length === 0)) {
            const p = document.createElement('p');
            p.classList.add('text-center', 'my-3')
            p.textContent = 'Carrito vacío';
            p.id = 'carrito-vacio';
            list.appendChild(p);
        }
        getTotal(cartPopupElement);
    }, 10);
}

function enableBtn(buttonEl) {
    setTimeout(() => {
        const basketData = JSON.parse(localStorage.getItem("basket")) || [];
        buttonEl.disabled = !basketData || basketData && basketData.length === 0;
    }, 10);
}

const showCartItems = document.querySelectorAll('.mostrar-carrito');
showCartItems.forEach(item => {
    if (item) {
        item.addEventListener('click', () => {
            const cartPopupElement = document.querySelector('.cart-items-popup');
            if (cartPopupElement) {
                cartPopupElement.remove();
            } else {
                const cartPopupElement = document.createElement('div');
                cartPopupElement.classList.add('cart-items-popup');
                cartPopupElement.innerHTML = cartPopupTemplate;
                document.body.appendChild(cartPopupElement);
                updateCartPopup(cartPopupElement);
            }
        });
    }
});


function updateCartPopup(cartPopupElement) {
    const decartarBtn = document.getElementById('descartar-items');
    const continuarEnvioBtn = document.getElementById('continuar-envio');
    const quantityAlert = document.querySelector(".cartPopupQtyAlert");

    getTotal(cartPopupElement);
    enableBtn(decartarBtn);
    enableBtn(continuarEnvioBtn);

    const goBack = document.querySelector('.regresar');
    goBack.addEventListener('click', function() {
        if (cartPopupElement) {
            cartPopupElement.remove();
        }
    });

    continuarEnvioBtn.addEventListener('click', () => {
        if (cartPopupElement) {
            cartPopupElement.remove();
        }
        showShippingPopup();
    });

    decartarBtn.addEventListener('click', () => {
        Swal.fire({
            title: '¿Desea eliminar todos los productos?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#6D275E',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, continuar',
            cancelButtonText: 'Cancelar'
            }).then((result) => {
            if (result.isConfirmed) {
                if (cartPopupElement) {
                    cartPopupElement.remove();
                    localStorage.removeItem('basket');
                    window.location.reload();
                }
            }
        });
    })

    const list = document.querySelector('.cart-items-popup-list');
    const basketData = JSON.parse(localStorage.getItem("basket")) || [];

    if (basketData.length > 0) {
        basketData.forEach(cartItem => {
            const carritoVacio = document.getElementById('carrito-vacio');
            if (carritoVacio) {
                carritoVacio.remove();
            }
            const cartItemPopupElement = document.createElement('div');
            cartItemPopupElement.classList.add('cart-item-popup');
            cartItemPopupElement.innerHTML = cartListPopupTemplate;
            cartItemPopupElement.id = `cart-item-popup-${cartItem.productId}`;

            cartItemPopupElement.querySelector('.cart-item-popup-img').src = cartItem.imagen;
            cartItemPopupElement.querySelector('h2').textContent = cartItem.nombreProducto;
            cartItemPopupElement.querySelector('p').textContent = `${cartItem.ingredientes.slice(0, 25)}(...)`;
            cartItemPopupElement.querySelector('.cart-item-popup-text-precio').textContent = `₡${cartItem.precio}`;

            const btn = cartItemPopupElement.querySelector('button');
            const input = cartItemPopupElement.querySelector('input');

            input.value = cartItem.cantidad.toString();

            [btn, input].map(el => {
                el.dataset.nombre = cartItem.nombreProducto;
                el.dataset.precio = cartItem.precio;
                el.dataset.productId = cartItem.productId;
            });

            list.appendChild(cartItemPopupElement);

            input?.addEventListener("change", function () {
                let quantity = parseInt(this.value);
                quantityAlert.classList.add("d-none");
                if (isNaN(quantity)) {
                    quantity = 0;
                    input.value = "0";
                }
                if (quantity < 0 || quantity > 5) {
                    quantityAlert.classList.remove("d-none");
                } else {
                    setTimeout(() => {
                        updateBasketQuantity(quantity, {
                            nombreProducto: cartItem.nombreProducto,
                            ...cartItem,
                            cantidad: quantity,
                            precio: cartItem.precio,
                            totalProducto: parseFloat(cartItem.precio) * quantity,
                            productId: cartItem.productId.toString()
                        });
                    }, 10);
                    if (quantity === 0) {
                        cartItemPopupElement.remove();
                        displayNoCartItems(list, cartPopupElement);
                        enableBtn(decartarBtn);
                        enableBtn(continuarEnvioBtn);
                    }
                }
            });

            btn?.addEventListener("click", function () {
                input.value = "0";
                setTimeout(() => {
                    updateBasketQuantity(0, {
                        nombreProducto: cartItem.nombreProducto,
                        ...cartItem,
                        cantidad: 0,
                        precio: cartItem.precio,
                        totalProducto: 0,
                        productId: cartItem.productId.toString()
                    });
                }, 10);
                cartItemPopupElement.remove();
                displayNoCartItems(list, cartPopupElement);
                enableBtn(decartarBtn);
                enableBtn(continuarEnvioBtn);
            });
        });
    } else {
        displayNoCartItems(list, cartPopupElement);
        enableBtn(decartarBtn);
        enableBtn(continuarEnvioBtn);
    }
} 

async function loadProvincias() {
    const response = await fetch(jsonProvincias);
    provincias = await response.json();
    const selector = document.getElementById('provinciaSelect');
    provincias.forEach((item) => {
        const option = document.createElement('option');
        option.value = item.provincia;
        option.textContent = item.provincia;
        selector.appendChild(option);
    });
}

function showReceiptPopup() {
    let receiptPopupEl = document.querySelector('.receipt-popup');
    const shippingData = JSON.parse(localStorage.getItem("shipping")) || null;
    const basketData = JSON.parse(localStorage.getItem("basket")) || [];
    const totalPriceProducts = localStorage.getItem("totalPriceProducts") || 0;
    let invoiceDetails = '';
    if (!receiptPopupEl && shippingData && basketData.length > 0) {
        receiptPopupEl = document.createElement('div');
        receiptPopupEl.classList.add('receipt-popup');
        receiptPopupEl.innerHTML = receiptPopupTpl;
        document.body.appendChild(receiptPopupEl);

        const btn = receiptPopupEl.querySelector('.receipt');

        const factura = `Número de Factura ${generateInvoiceNumber()}`;
        const facturaNombre = `Nombre: ${shippingData.shippingNombre}`;
        document.querySelector('.receipt-h4').textContent = factura;
        document.querySelector('.receipt-h5').textContent = facturaNombre;

        invoiceDetails += `
            ${'Hola! He realizado un pedido desde el sitio web!'}
            ${factura}
            ${facturaNombre}
        `;
        
        const receiptItems = document.querySelector('.receipt-items');
        const receiptTotals = document.querySelector('.receipt-totals');

        basketData.forEach(item => {
            const receiptItem = document.createElement('div');
            receiptItem.classList.add('receipt-item');
            receiptItem.innerHTML = receiptItemTpl;
            receiptItems.appendChild(receiptItem);

            const prodItem = `${item.cantidad} ${item.nombreProducto}`;
            const prodPrice = `${formatToColon(item.totalProducto)}`;
            receiptItem.querySelector('.receipt-item-name').textContent = prodItem;
            receiptItem.querySelector('.receipt-item-price').textContent = prodPrice;

            invoiceDetails += `
                ${prodItem}
                ${prodPrice}
            `;
        });

        const paymentTotals = [
            { title: 'Subtotal IVAI', price: +totalPriceProducts + (+totalPriceProducts * 0.13) },
            { title: 'Envío', price: +shippingData.costoEnvio },
            { title: 'Total', price: (+shippingData.costoEnvio) + (+totalPriceProducts + (+totalPriceProducts * 0.13)) }
        ];

        paymentTotals.forEach(item => {
            const receiptTotalItem = document.createElement('div');
            receiptTotalItem.classList.add('receipt-total-item');
            receiptTotalItem.innerHTML = receiptTotalItemTpl;
            receiptTotals.appendChild(receiptTotalItem);
            
            receiptTotalItem.querySelector('.receipt-total-title').textContent = `${item.title}`; 
            receiptTotalItem.querySelector('.receipt-total-price').textContent = `${formatToColon(item.price)}`;

            invoiceDetails += `
                ${item.title}
                ${formatToColon(item.price)}
            `;
        });

        invoiceDetails += `
                Método de pago: ${shippingData.metodoPago}
                Provincia: ${shippingData.provincia}
                Correo: ${shippingData.shippingCorreo}
                Teléfono: ${shippingData.shippingTel}
        `;

        const link = createWhatsAppLink('+50689428070', invoiceDetails);

        btn.href = link;
        btn.target = '_blank';

        btn.addEventListener('click', () => {
            setTimeout(() => {
                receiptPopupEl.remove();
                toggleShippingBodyClass();
                localStorage.removeItem('basket');
                localStorage.removeItem('shipping');
                localStorage.removeItem('totalQtyProducts');
                localStorage.removeItem('totalPriceProducts');
                window.location.reload();
            }, 10);
        })
    }
}

function createWhatsAppLink(phoneNumber, message) {
    const encodedMessage = encodeURIComponent(message); 
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    return url;
}

function formatToColon(number) {
    const options = {
      style: 'currency',
      currency: 'CRC', 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2,
    };
  
    const formatter = new Intl.NumberFormat('es-CR', options);
    const formattedNumber = formatter.format(number);
  
    return formattedNumber;
  }

function generateInvoiceNumber() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const randomSuffix = Math.floor(Math.random() * 100000000); 
  
    const invoiceNumber = `${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}${hours.toString().padStart(2, '0')}${minutes.toString().padStart(2, '0')}${seconds.toString().padStart(2, '0')}${randomSuffix}`;
  
    return invoiceNumber;
}
  

function showShippingPopup() {
    let shippingPopupEl = document.querySelector('.shipping-popup');
    if (!shippingPopupEl) {
        shippingPopupEl = document.createElement('div');
        shippingPopupEl.classList.add('shipping-popup');
        shippingPopupEl.innerHTML = shippingPopupTpl;
        document.body.appendChild(shippingPopupEl);
        loadProvincias();
        closeShippingPopup(shippingPopupEl);
        shippingPopupCreateItems();
        shippingConfirm();
        provinciaSelection();
        toggleShippingBodyClass();
    }
}

function provinciaSelection() {
    const provinciaSelect = document.getElementById('provinciaSelect');
    provinciaSelect.addEventListener('change', function() {
        const alert = document.querySelector('.shippingFormInfo');
        alert.innerHTML = '';
        alert.classList.add('d-none');
        
        const selectedOptionValue = this.value;
        const envio = provincias.find(p => p.provincia === selectedOptionValue);
        if (envio) {
            alert.classList.remove('d-none');
            alert.innerHTML = `El envío a <strong>${selectedOptionValue}</strong> tiene un costo de <strong>₡${envio.costoEnvio}</strong>.
            La entrega se realiza los días ${envio.diasEntrega}.`;
        }
    });
}

function shippingConfirm() {
    const btn = document.getElementById('shippingFacturarBtn');
    
    btn.addEventListener('click', () => {
        const shippingNombre = document.getElementById('shippingNombre');
        const shippingTel = document.getElementById('shippingTel');
        const shippingCorreo = document.getElementById('shippingCorreo');
        const provinciaSelect = document.getElementById('provinciaSelect');
        const metodoPagoSelect = document.getElementById('metodoPagoSelect');

        const provinciaDefault = provinciaSelect.options[0].value;
        const metodoPagoDefault = metodoPagoSelect.options[0].value;

        const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingCorreo.value.trim());
        const telValido = /^\d{8}$/.test(shippingTel.value.trim());

        if (shippingNombre.value.trim() === "") {
            showShippingErrors("Nombre es requerido");
            return;
        }
    
        if (!telValido ||  shippingTel.value.trim() === "") {
            showShippingErrors("Teléfono es inválido");
            return;
        }

        if (!correoValido ||  shippingCorreo.value.trim() === "") {
            showShippingErrors("Correo es inválido");
            return;
        }

        if (!provinciaSelect ||  provinciaSelect.value.trim() === "" || provinciaSelect.value === provinciaDefault) {
            showShippingErrors("Provincia es requerido");
            return;
        }

        if (!metodoPagoSelect ||  metodoPagoSelect.value.trim() === "" || metodoPagoSelect.value === metodoPagoDefault) {
            showShippingErrors("Método de pago es requerido");
            return;
        }

        const envio = provincias.find(p => p.provincia === provinciaSelect.value);

        localStorage.setItem("shipping", JSON.stringify({
            shippingNombre: shippingNombre.value,
            shippingTel: shippingTel.value,
            shippingCorreo: shippingCorreo.value,
            provincia: provinciaSelect.value,
            metodoPago: metodoPagoSelect.value,
            costoEnvio: envio.costoEnvio,
            diasEntrega: envio.diasEntrega
        }));
        document.querySelector('.shipping-popup').remove();
        showReceiptPopup();
    });
}

function showShippingErrors(errMsg) {
    const errors = document.querySelector('.shippingFormErrors');
    errors.classList.remove('d-none');
    errors.textContent = errMsg;
    setTimeout(function() {
        errors.textContent = "";
        errors.classList.add('d-none');
    }, 3000);
}

function shippingPopupCreateItems() {
    const basketData = JSON.parse(localStorage.getItem("basket")) || [];
    const container = document.querySelector('.shipping-items');
    basketData.forEach(data => {
        const shippingItem = document.createElement('div');
        shippingItem.classList.add('shipping-item');
        shippingItem.innerHTML = shippingItemsTpl;
        container.appendChild(shippingItem);

        shippingItem.querySelector('.shipping-item-popup-img').src = data.imagen;
        shippingItem.querySelector('.shipping-item-popup-img').alt = data.nombreProducto;
        shippingItem.querySelector('h2').textContent = data.nombreProducto;
        shippingItem.querySelector('.shipping-item-popup-text-precio').textContent = `₡${data.precio}`;
        shippingItem.querySelector('.shipping-item-popup-desc').textContent = `${data.ingredientes.slice(0, 25)}(...)`;

        const input = shippingItem.querySelector('input');
        const btnRemove = shippingItem.querySelector('button');

        input.value = data.cantidad.toString();

        shippingPopupRemoveItem(btnRemove, input, data, shippingItem);
        shippingPopupQty(input, data, shippingItem);
    });
}

function shippingPopupQty(input, data, shippingItem) {
    const quantityAlert = document.querySelector('.shippingPopupQtyAlert');
    input?.addEventListener("change", function () {
        let quantity = parseInt(this.value);
        quantityAlert.classList.add("d-none");
        if (isNaN(quantity)) {
            quantity = 0;
            input.value = "0";
        }
        if (quantity < 0 || quantity > 5) {
            quantityAlert.classList.remove("d-none");
        } else {
            setTimeout(() => {
                updateBasketQuantity(quantity, {
                    nombreProducto: data.nombreProducto,
                    ...data,
                    cantidad: quantity,
                    precio: data.precio,
                    totalProducto: parseFloat(data.precio) * quantity,
                    productId: data.productId.toString()
                });
            }, 10);
            if (quantity === 0) {
                shippingItem.remove();
            }
            removeShippingPopup();
        }
    });
}

function removeShippingPopup() {
    setTimeout(() => {
        const basketData = JSON.parse(localStorage.getItem("basket")) || [];
        if (!basketData || basketData && basketData.length === 0) {
            const popup = document.querySelector('.shipping-popup');
            popup.remove();
            toggleShippingBodyClass();
        }
        localStorage.removeItem("shipping");
    }, 10);
}

function toggleShippingBodyClass() {
    const body = document.querySelector('body');
    if (body.classList.contains('shipping-popup-open')) {
        body.classList.remove('shipping-popup-open');
    } else {
        body.classList.add('shipping-popup-open');
    }
}

function shippingPopupRemoveItem(btnRef, input, item, parentEl) {
    btnRef.addEventListener('click', () => {
        const quantityAlert = document.querySelector('.shippingPopupQtyAlert');
        quantityAlert.classList.add('d-none');
        input.value = "0";
        setTimeout(() => {
            updateBasketQuantity(0, {
                nombreProducto: item.nombreProducto,
                ...item,
                cantidad: 0,
                precio: item.precio,
                totalProducto: 0,
                productId: item.productId.toString()
            });
        }, 10);
        parentEl.remove();

        removeShippingPopup();
    })
}

function closeShippingPopup(parentEl) {
    if (parentEl) {
        const btnRegresar = document.getElementById('regresar-shipping-btn');
        btnRegresar.addEventListener('click', () => {
            setTimeout(() => {
                parentEl.remove();
                localStorage.removeItem("shipping");
                toggleShippingBodyClass();
            }, 10);
        });
    }
}

window.addEventListener("load", () => {
    updateBasketQuantity();
    updateInicioCartBtn();
});