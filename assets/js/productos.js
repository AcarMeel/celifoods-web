const productTemplate = document.getElementById('product-card-tpl');
let productos = [];

async function loadProducts() {
    const jsonFilePathProducts = "./assets/data/productos.json";
    const response = await fetch(jsonFilePathProducts);
    productos = await response.json();

    productos.forEach(producto => {
        renderProducts(producto);
    });
    updateInicioCartBtn();
}

function renderProducts(item) {
    const categoria = item.categoria;
    const sectionElement = document.querySelector(`section#${categoria} .products`);
    const sectionElementTitle = document.querySelector(`section#${categoria} h2`);
    sectionElementTitle.innerHTML = `${item.titulo1} <span>${item.titulo2}</span>`;
    const productos = item.productos;
    productos.forEach(product => {
        const productClone = productTemplate.content.cloneNode(true);

        const purchaseButton = productClone.querySelector('.btn-comprar');
        const addToCartButton = productClone.querySelector('.cart');

        productClone.querySelector('.img-dish').src = product.imagen;
        productClone.querySelector('.products-title').textContent = product.nombre;
        productClone.querySelector('.products-text').textContent = product.descripcion;
        productClone.querySelector('.products-price').textContent = `₡${product.precio}`;

        purchaseButton.id = 'product-purchase-' + product.productId;
        purchaseButton.dataset.productId = product.productId;
        purchaseButton.dataset.nombre = product.nombre;
        purchaseButton.dataset.precio = product.precio;

        addToCartButton.id = 'product-add-cart-' + product.productId;
        addToCartButton.dataset.productId = product.productId;
        addToCartButton.dataset.nombre = product.nombre;
        addToCartButton.dataset.precio = product.precio;

        sectionElement.appendChild(productClone);

        
        purchaseButton.addEventListener('click', () => {
            const clickedButton = event.target;
            const id = clickedButton.dataset.productId;
            openPurchasePopup(product);
        });

        
        addToCartButton.addEventListener('click', () => {
            const clickedButton = event.target;
            const id = clickedButton.dataset.productId;
            addProductToCart(1, product);
        });
    });
}

function addProductToCart(quantity, product) { 
    updateBasketQuantity(quantity, {
        nombreProducto: product.nombre,
        ...product,
        cantidad: quantity,
        precio: product.precio,
        totalProducto: parseFloat(product.precio) * quantity,
        productId: product.productId.toString()
    });
}

function openPurchasePopup(product) {
}


window.addEventListener("load", () => {
    loadProducts();
});