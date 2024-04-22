const jsonFilePath = "./assets/data/productos-populares.json";

["popular-purchase-1", "popular-purchase-2", "popular-purchase-3"].map(
    (btnId) => verProductoClick(btnId)
);

function verProductoClick(id) {
    document.getElementById(id).addEventListener("click", async function () {
        const productId = this.dataset.productId;
        const nombreProducto = this.dataset.nombre;
        const precioProducto = `₡${this.dataset.precio}`;
        const precioProductoSinFormato = `${this.dataset.precio}`;

        const response = await fetch(jsonFilePath);
        const productos = await response.json();

        const detalles = productos.find((p) => p.productId === productId);
        let basketData = JSON.parse(localStorage.getItem("basket")) || [];

        const findProductInBasket = basketData.find(p => p.productId === productId);
        const productQtyValue = findProductInBasket ? findProductInBasket.cantidad.toString() : "0";

        Swal.fire({
            html: `<div class="product-detail-view">
            <div class="container">
                <div class="row">
                    <div class="col-lg-3">
                        <img class="product-detail-view-image" src="${detalles?.imagen}" alt="producto">
                    </div>
                    <div class="col product-detail-view-text">
                        <h2 class="product-detail-view-title">${nombreProducto}</h2>
                        <p class="product-detail-view-stars">
                            <span><i class="fa-solid fa-star"></i></span><span><i class="fa-solid fa-star"></i></span><span><i class="fa-solid fa-star"></i></span><span><i class="fa-solid fa-star"></i></span><span><i class="fa-solid fa-star"></i></span>
                        </p>
                        <h4 class="product-detail-view-price">${precioProducto}</h4>
                        <p class="product-detail-view-legend"><small><i class="fa-solid fa-heart-circle-check"></i> Hay existencias</small></p>
                        <div class="product-detail-view-input">
                            <div class="row add-action">
                                <div class="col-lg-3">
                                    <div class="">
                                        <label for="addQuantityViewDetail" class="form-label">Cantidad</label>
                                        <input type="number" value="${productQtyValue}" min="0" max="5" class="form-control qty" id="addQuantityViewDetail">
                                    </div>
                                </div>
                                <div class="col mt-4">
                                    <button id="popup-view-detail-remove-cart" type="button" class="btn btn-danger cart popup-view-detail-remove-cart" data-nombre="${nombreProducto}" data-precio="${precioProductoSinFormato}"><i class="fa-solid fa-trash-can"></i></button>
                                </div>
                            </div>
                            <div class="row mt-3">
                                <div class="alert alert-danger quantity-alert d-none" role="alert">
                                    Favor ingresar al menos un producto. Solo 5 productos por cliente.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row product-detail-view-info">
                    <h3>Detalles</h3>
                    <p>
                        <strong>Ingredientes:</strong> ${detalles?.ingredientes}.
                    </p>
                    <p>
                        <strong>Alérgenos:</strong> ${detalles?.alergenos}
                    </p>
                    <p>
                        <strong>Presentación:</strong> ${detalles?.presentacion}
                    </p>
                    <p><strong>Vida útil:</strong> ${detalles?.vidaUtil}</p>
                    <p><strong>Conservación:</strong> ${detalles?.conservacion}</p>
                </div>
            </div>
        </div>`,
            confirmButtonText: "Cerrar",
            width: "960px",
        });

        const quantityInput = document.getElementById("addQuantityViewDetail");
        const quantityAlert = document.querySelector(".quantity-alert");
        const removeCartButton = document.getElementById(
            "popup-view-detail-remove-cart"
        );

        quantityInput?.addEventListener("change", function () {
            let quantity = parseInt(this.value);
            if (isNaN(quantity)) {
                quantity = 0;
                quantityInput.value = "0";
            }
            if (quantity < 0 || quantity > 5) {
                quantityAlert.classList.remove("d-none");
            } else {
                quantityAlert.classList.add("d-none");
                setTimeout(() => {
                    updateBasketQuantity(quantity, {
                        nombreProducto,
                        ...detalles,
                        cantidad: quantity,
                        precio: precioProductoSinFormato,
                        totalProducto: parseFloat(precioProductoSinFormato) * quantity,
                    });
                }, 10);
            }
        });

        removeCartButton?.addEventListener("click", function () {
            quantityInput.value = "0";
            setTimeout(() => {
                updateBasketQuantity(0, {
                    nombreProducto,
                    ...detalles,
                    cantidad: 0,
                    precio: precioProductoSinFormato,
                    totalProducto: 0,
                });
            }, 10);
        });
    });
}

