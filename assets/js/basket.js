const toastTrigger = document.getElementById('toastNotificationCartUpdate');
const toast = new bootstrap.Toast(toastTrigger);
const cartListPopupTemplate = `
        <div class="cart-item-popup-left">
            <img class="cart-item-popup-img" src="" alt="galletas">
            <div class="cart-item-popup-text">
                <h2>Platillo Verde</h2>
                <p>Con vegetales salteados...</p>
                <p class="cart-item-popup-text-precio">&#8353;4650</p>
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
            <p class="subtotal-display">20.000</p>
        </div>
        <div class="item iva">
            <h6>Total IVAI*</h6>
            <p class="iva-display">20.000</p>
        </div>
    </div>
    <div class="cart-items-popup-footer">
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

    getTotal(cartPopupElement);
    enableBtn(decartarBtn);
    enableBtn(continuarEnvioBtn);

    const goBack = document.querySelector('.regresar');
    goBack.addEventListener('click', function() {
        if (cartPopupElement) {
            cartPopupElement.remove();
        }
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
                if (isNaN(quantity)) {
                    quantity = 0;
                    input.value = "0";
                }
                if (quantity < 0 || quantity > 5) {
                    alert('Debe ingresar una cantidad menor a 5');
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

window.addEventListener("load", () => {
    updateBasketQuantity();
    updateInicioCartBtn();
});