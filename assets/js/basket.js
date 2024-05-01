const toastTrigger = document.getElementById('toastNotificationCartUpdate');
const toast = new bootstrap.Toast(toastTrigger);

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

if (toastTrigger) {
    toastTrigger.addEventListener('click', () => {
        toast.hide()
    });
}


window.addEventListener("load", () => {
    updateBasketQuantity();
    updateInicioCartBtn();
});