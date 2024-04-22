function updateBasketQuantity(quantity, nuevoProducto) {
    let basketData = JSON.parse(localStorage.getItem("basket")) || [];

    if (quantity >= 0 && nuevoProducto) {
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

    if (quantity >= 0 && nuevoProducto) {
        localStorage.setItem("basket", JSON.stringify(basketData));
    }

    const totalProducts = basketData.reduce(
        (acc, product) => acc + product.cantidad,
        0
    );
    const qtyDisplayBadge = totalProducts > 9 ? '9+' : totalProducts.toString();
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
}

window.addEventListener("load", () => {
    updateBasketQuantity();
});