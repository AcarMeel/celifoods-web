const jsonFilePath = './assets/data/productos-populares.json';


['popular-purchase-1', 'popular-purchase-2', 'popular-purchase-3'].map(btnId => verProductoClick(btnId));

function verProductoClick(id) {
    document.getElementById(id).addEventListener('click', async function() {
        const productId = this.dataset.productId;
        const nombreProducto = this.dataset.nombre;
        const precioProducto = `₡${this.dataset.precio}`;
        const precioProductoSinFormato = `${this.dataset.precio}`;
        
        const response = await fetch(jsonFilePath);
        const productos = await response.json();

        const detalles = productos.find(p => p.productId === productId);
    
        Swal.fire({
            html: `<div class="product-detail-view">
            <div class="container">
                <div class="row">
                    <div class="col-3">
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
                                <div class="col-3">
                                    <div class="">
                                        <label for="addQuantityViewDetail" class="form-label">Cantidad</label>
                                        <input type="number" value="1" class="form-control qty" id="addQuantityViewDetail">
                                    </div>
                                </div>
                                <div class="col mt-4">
                                    <button id="popup-view-detail-add-cart" type="button" class="btn btn-warning cart popup-view-detail-add-cart" data-nombre="${nombreProducto}" data-precio="${precioProductoSinFormato}"><i class="fa-solid fa-basket-shopping"></i> Agregar</button>
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
            confirmButtonText: 'Cerrar',
            width: '960px'
        });
    });
}