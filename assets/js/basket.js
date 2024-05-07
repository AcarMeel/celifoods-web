const toastTrigger=document.getElementById("toastNotificationCartUpdate"),toast=new bootstrap.Toast(toastTrigger),jsonProvincias="./assets/data/envio.json";let provincias=[];const receiptPopupTpl=`
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
`,receiptItemTpl=`
    <p class="receipt-item-name"></p>
    <span>- - - - - - - - - - - - -</span>
    <p class="receipt-item-price"></p>
`,receiptTotalItemTpl=`
    <p class="receipt-total-title"></p>
    <p class="receipt-total-price"></p>
`,shippingItemsTpl=`
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
    </div>`,shippingPopupTpl=`
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
`,cartListPopupTemplate=`
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
    `,cartPopupTemplate=`
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
    </div>`;function updateBasketQuantity(a,b){let c=JSON.parse(localStorage.getItem("basket"))||[];const d=0<=a&&b;if(d){const d=c.findIndex(a=>a.productId===b.productId);0<a?-1===d?c.push(b):c[d]=b:c=c.filter(a=>a.productId!==b.productId)}const e=c.reduce((a,b)=>a+b.totalProducto,0);d&&localStorage.setItem("basket",JSON.stringify(c));const f=c.reduce((a,b)=>a+b.cantidad,0),g=9<f?"+9":f.toString();if(991>=window.innerWidth){const a=document.getElementById("basket-menu-icon-qty-mobile");a.textContent=g}else{const a=document.getElementById("basket-menu-icon-qty-desktop");a.textContent=g}localStorage.setItem("totalPriceProducts",e),localStorage.setItem("totalQtyProducts",f),updateInicioCartBtn(),d&&toast.show();const h=document.querySelector(".cart-items-popup");if(h){const a=document.querySelectorAll(".cart-item-popup");a&&0<a.length&&a.forEach(a=>a.remove()),updateCartPopup(h)}}function updateInicioCartBtn(){const a=JSON.parse(localStorage.getItem("basket"))||[],b=document.querySelectorAll(".accion-carrito");b.forEach(b=>{const c=b.dataset.productId,d=b.querySelector("span"),e=a.find(a=>a.productId===c);b.disabled=e&&5<=e.cantidad,d.textContent=e?e.cantidad.toString():"0"})}["popular-add-cart-1","popular-add-cart-2","popular-add-cart-3"].map(a=>addItemFromCardCartBtn(a));function addItemFromCardCartBtn(a){const b=document.getElementById(a);b&&b.addEventListener("click",async function(){const a=JSON.parse(localStorage.getItem("basket"))||[],b=this.dataset.productId,c=this.dataset.nombre,d=this.dataset.precio,e=await fetch(jsonFilePathPopulares),f=await e.json(),g=f.find(a=>a.productId===b),h=a.find(a=>a.productId===b),i=h?h.cantidad+1:1;updateBasketQuantity(i,{nombreProducto:c,...g,cantidad:i,precio:d,totalProducto:parseFloat(d)*i})})}toastTrigger&&toast&&toastTrigger.addEventListener("click",()=>{toast.hide()});function getTotal(a){setInterval(()=>{const b=JSON.parse(localStorage.getItem("totalPriceProducts"))||0;a.querySelector(".subtotal-display").textContent="\u20A1"+b.toFixed(2),a.querySelector(".iva-display").textContent=0<b?"\u20A1"+(.13*b).toFixed(2):"\u20A1"+b.toFixed(2)},10)}function displayNoCartItems(a,b){setTimeout(()=>{const c=JSON.parse(localStorage.getItem("basket"))||[],d=document.getElementById("carrito-vacio");if(!d&&(!c||c&&0===c.length)){const b=document.createElement("p");b.classList.add("text-center","my-3"),b.textContent="Carrito vac\xEDo",b.id="carrito-vacio",a.appendChild(b)}getTotal(b)},10)}function enableBtn(a){setTimeout(()=>{const b=JSON.parse(localStorage.getItem("basket"))||[];a.disabled=!b||b&&0===b.length},10)}const showCartItems=document.querySelectorAll(".mostrar-carrito");showCartItems.forEach(a=>{a&&a.addEventListener("click",()=>{const a=document.querySelector(".cart-items-popup");if(a)a.remove();else{const a=document.createElement("div");a.classList.add("cart-items-popup"),a.innerHTML=cartPopupTemplate,document.body.appendChild(a),updateCartPopup(a)}})});function updateCartPopup(a){const b=document.getElementById("descartar-items"),c=document.getElementById("continuar-envio"),d=document.querySelector(".cartPopupQtyAlert");getTotal(a),enableBtn(b),enableBtn(c);const e=document.querySelector(".regresar");e.addEventListener("click",function(){a&&a.remove()}),c.addEventListener("click",()=>{a&&a.remove(),showShippingPopup()}),b.addEventListener("click",()=>{Swal.fire({title:"\xBFDesea eliminar todos los productos?",text:"Esta acci\xF3n no se puede deshacer.",icon:"warning",showCancelButton:!0,confirmButtonColor:"#6D275E",cancelButtonColor:"#d33",confirmButtonText:"Si, continuar",cancelButtonText:"Cancelar"}).then(b=>{b.isConfirmed&&a&&(a.remove(),localStorage.removeItem("basket"),window.location.reload())})});const f=document.querySelector(".cart-items-popup-list"),g=JSON.parse(localStorage.getItem("basket"))||[];0<g.length?g.forEach(e=>{const g=document.getElementById("carrito-vacio");g&&g.remove();const h=document.createElement("div");h.classList.add("cart-item-popup"),h.innerHTML=cartListPopupTemplate,h.id=`cart-item-popup-${e.productId}`,h.querySelector(".cart-item-popup-img").src=e.imagen,h.querySelector("h2").textContent=e.nombreProducto,h.querySelector("p").textContent=`${e.ingredientes.slice(0,25)}(...)`,h.querySelector(".cart-item-popup-text-precio").textContent=`₡${e.precio}`;const i=h.querySelector("button"),j=h.querySelector("input");j.value=e.cantidad.toString(),[i,j].map(a=>{a.dataset.nombre=e.nombreProducto,a.dataset.precio=e.precio,a.dataset.productId=e.productId}),f.appendChild(h),j?.addEventListener("change",function(){let g=parseInt(this.value);d.classList.add("d-none"),isNaN(g)&&(g=0,j.value="0"),0>g||5<g?d.classList.remove("d-none"):(setTimeout(()=>{updateBasketQuantity(g,{nombreProducto:e.nombreProducto,...e,cantidad:g,precio:e.precio,totalProducto:parseFloat(e.precio)*g,productId:e.productId.toString()})},10),0===g&&(h.remove(),displayNoCartItems(f,a),enableBtn(b),enableBtn(c)))}),i?.addEventListener("click",function(){j.value="0",setTimeout(()=>{updateBasketQuantity(0,{nombreProducto:e.nombreProducto,...e,cantidad:0,precio:e.precio,totalProducto:0,productId:e.productId.toString()})},10),h.remove(),displayNoCartItems(f,a),enableBtn(b),enableBtn(c)})}):(displayNoCartItems(f,a),enableBtn(b),enableBtn(c))}async function loadProvincias(){const a=await fetch(jsonProvincias);provincias=await a.json();const b=document.getElementById("provinciaSelect");provincias.forEach(a=>{const c=document.createElement("option");c.value=a.provincia,c.textContent=a.provincia,b.appendChild(c)})}function showReceiptPopup(){let a=document.querySelector(".receipt-popup");const b=JSON.parse(localStorage.getItem("shipping"))||null,c=JSON.parse(localStorage.getItem("basket"))||[],d=localStorage.getItem("totalPriceProducts")||0;let e="";if(!a&&b&&0<c.length){a=document.createElement("div"),a.classList.add("receipt-popup"),a.innerHTML=receiptPopupTpl,document.body.appendChild(a);const f=a.querySelector(".receipt"),g=`Número de Factura ${generateInvoiceNumber()}`,h=`Nombre: ${b.shippingNombre}`;document.querySelector(".receipt-h4").textContent=g,document.querySelector(".receipt-h5").textContent=h,e+=`
            ${"Hola! He realizado un pedido desde el sitio web!"}
            ${g}
            ${h}
        `;const i=document.querySelector(".receipt-items"),j=document.querySelector(".receipt-totals");c.forEach(a=>{const b=document.createElement("div");b.classList.add("receipt-item"),b.innerHTML=receiptItemTpl,i.appendChild(b);const c=`${a.cantidad} ${a.nombreProducto}`,d=`${formatToColon(a.totalProducto)}`;b.querySelector(".receipt-item-name").textContent=c,b.querySelector(".receipt-item-price").textContent=d,e+=`
                ${c}
                ${d}
            `});const k=[{title:"Subtotal IVAI",price:+d+.13*+d},{title:"Env\xEDo",price:+b.costoEnvio},{title:"Total",price:+b.costoEnvio+(+d+.13*+d)}];k.forEach(a=>{const b=document.createElement("div");b.classList.add("receipt-total-item"),b.innerHTML=receiptTotalItemTpl,j.appendChild(b),b.querySelector(".receipt-total-title").textContent=`${a.title}`,b.querySelector(".receipt-total-price").textContent=`${formatToColon(a.price)}`,e+=`
                ${a.title}
                ${formatToColon(a.price)}
            `}),e+=`
                Método de pago: ${b.metodoPago}
                Provincia: ${b.provincia}
                Correo: ${b.shippingCorreo}
                Teléfono: ${b.shippingTel}
        `;const l=createWhatsAppLink("+50689428070",e);f.href=l,f.target="_blank",f.addEventListener("click",()=>{setTimeout(()=>{a.remove(),toggleShippingBodyClass(),localStorage.removeItem("basket"),localStorage.removeItem("shipping"),localStorage.removeItem("totalQtyProducts"),localStorage.removeItem("totalPriceProducts"),window.location.reload()},10)})}}function createWhatsAppLink(a,b){const c=encodeURIComponent(b);return`https://wa.me/${a}?text=${c}`}function formatToColon(a){const b=new Intl.NumberFormat("es-CR",{style:"currency",currency:"CRC",minimumFractionDigits:2,maximumFractionDigits:2}),c=b.format(a);return c}function generateInvoiceNumber(){const a=new Date,b=a.getFullYear(),c=a.getMonth()+1,d=a.getDate(),e=a.getHours(),f=a.getMinutes(),g=a.getSeconds(),h=Math.floor(1e8*Math.random()),i=`${b}${c.toString().padStart(2,"0")}${d.toString().padStart(2,"0")}${e.toString().padStart(2,"0")}${f.toString().padStart(2,"0")}${g.toString().padStart(2,"0")}${h}`;return i}function showShippingPopup(){let a=document.querySelector(".shipping-popup");a||(a=document.createElement("div"),a.classList.add("shipping-popup"),a.innerHTML=shippingPopupTpl,document.body.appendChild(a),loadProvincias(),closeShippingPopup(a),shippingPopupCreateItems(),shippingConfirm(),provinciaSelection(),toggleShippingBodyClass())}function provinciaSelection(){const a=document.getElementById("provinciaSelect");a.addEventListener("change",function(){const a=document.querySelector(".shippingFormInfo");a.innerHTML="",a.classList.add("d-none");const b=this.value,c=provincias.find(a=>a.provincia===b);c&&(a.classList.remove("d-none"),a.innerHTML=`El envío a <strong>${b}</strong> tiene un costo de <strong>₡${c.costoEnvio}</strong>.
            La entrega se realiza los días ${c.diasEntrega}.`)})}function shippingConfirm(){const a=document.getElementById("shippingFacturarBtn");a.addEventListener("click",()=>{const a=document.getElementById("shippingNombre"),b=document.getElementById("shippingTel"),c=document.getElementById("shippingCorreo"),d=document.getElementById("provinciaSelect"),e=document.getElementById("metodoPagoSelect"),f=d.options[0].value,g=e.options[0].value,h=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.value.trim()),i=/^\d{8}$/.test(b.value.trim());if(""===a.value.trim())return void showShippingErrors("Nombre es requerido");if(!i||""===b.value.trim())return void showShippingErrors("Tel\xE9fono es inv\xE1lido");if(!h||""===c.value.trim())return void showShippingErrors("Correo es inv\xE1lido");if(!d||""===d.value.trim()||d.value===f)return void showShippingErrors("Provincia es requerido");if(!e||""===e.value.trim()||e.value===g)return void showShippingErrors("M\xE9todo de pago es requerido");const j=provincias.find(a=>a.provincia===d.value);localStorage.setItem("shipping",JSON.stringify({shippingNombre:a.value,shippingTel:b.value,shippingCorreo:c.value,provincia:d.value,metodoPago:e.value,costoEnvio:j.costoEnvio,diasEntrega:j.diasEntrega})),document.querySelector(".shipping-popup").remove(),showReceiptPopup()})}function showShippingErrors(a){const b=document.querySelector(".shippingFormErrors");b.classList.remove("d-none"),b.textContent=a,setTimeout(function(){b.textContent="",b.classList.add("d-none")},3e3)}function shippingPopupCreateItems(){const a=JSON.parse(localStorage.getItem("basket"))||[],b=document.querySelector(".shipping-items");a.forEach(a=>{const c=document.createElement("div");c.classList.add("shipping-item"),c.innerHTML=shippingItemsTpl,b.appendChild(c),c.querySelector(".shipping-item-popup-img").src=a.imagen,c.querySelector(".shipping-item-popup-img").alt=a.nombreProducto,c.querySelector("h2").textContent=a.nombreProducto,c.querySelector(".shipping-item-popup-text-precio").textContent=`₡${a.precio}`,c.querySelector(".shipping-item-popup-desc").textContent=`${a.ingredientes.slice(0,25)}(...)`;const d=c.querySelector("input"),e=c.querySelector("button");d.value=a.cantidad.toString(),shippingPopupRemoveItem(e,d,a,c),shippingPopupQty(d,a,c)})}function shippingPopupQty(a,b,c){const d=document.querySelector(".shippingPopupQtyAlert");a?.addEventListener("change",function(){let e=parseInt(this.value);d.classList.add("d-none"),isNaN(e)&&(e=0,a.value="0"),0>e||5<e?d.classList.remove("d-none"):(setTimeout(()=>{updateBasketQuantity(e,{nombreProducto:b.nombreProducto,...b,cantidad:e,precio:b.precio,totalProducto:parseFloat(b.precio)*e,productId:b.productId.toString()})},10),0===e&&c.remove(),removeShippingPopup())})}function removeShippingPopup(){setTimeout(()=>{const a=JSON.parse(localStorage.getItem("basket"))||[];if(!a||a&&0===a.length){const a=document.querySelector(".shipping-popup");a.remove(),toggleShippingBodyClass()}localStorage.removeItem("shipping")},10)}function toggleShippingBodyClass(){const a=document.querySelector("body");a.classList.contains("shipping-popup-open")?a.classList.remove("shipping-popup-open"):a.classList.add("shipping-popup-open")}function shippingPopupRemoveItem(a,b,c,d){a.addEventListener("click",()=>{const a=document.querySelector(".shippingPopupQtyAlert");a.classList.add("d-none"),b.value="0",setTimeout(()=>{updateBasketQuantity(0,{nombreProducto:c.nombreProducto,...c,cantidad:0,precio:c.precio,totalProducto:0,productId:c.productId.toString()})},10),d.remove(),removeShippingPopup()})}function closeShippingPopup(a){if(a){const b=document.getElementById("regresar-shipping-btn");b.addEventListener("click",()=>{setTimeout(()=>{a.remove(),localStorage.removeItem("shipping"),toggleShippingBodyClass()},10)})}}window.addEventListener("load",()=>{updateBasketQuantity(),updateInicioCartBtn()});