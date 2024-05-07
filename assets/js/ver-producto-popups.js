["popular-purchase-1","popular-purchase-2","popular-purchase-3"].map(a=>{const b=document.getElementById(a);b&&b.addEventListener("click",function(){verProductoClick(this.dataset,null)})});async function verProductoClick(a,b){const c=a.productId,d=a.nombre,e=`₡${a.precio}`,f=`${a.precio}`;if(!b){const a=await fetch(jsonFilePathPopulares),d=await a.json();b=d.find(a=>a.productId===c)}let g=JSON.parse(localStorage.getItem("basket"))||[];const h=g.find(a=>a.productId===c),i=h?h.cantidad.toString():"0";Swal.fire({html:`<div class="product-detail-view">
            <div class="container">
                <div class="row">
                    <div class="col-lg-3">
                        <img class="product-detail-view-image" src="${b?.imagen}" alt="producto">
                    </div>
                    <div class="col product-detail-view-text">
                        <h2 class="product-detail-view-title">${d}</h2>
                        <p class="product-detail-view-stars">
                            <span><i class="fa-solid fa-star"></i></span><span><i class="fa-solid fa-star"></i></span><span><i class="fa-solid fa-star"></i></span><span><i class="fa-solid fa-star"></i></span><span><i class="fa-solid fa-star"></i></span>
                        </p>
                        <h4 class="product-detail-view-price">${e}</h4>
                        <p class="product-detail-view-legend"><small><i class="fa-solid fa-heart-circle-check"></i> Hay existencias</small></p>
                        <div class="product-detail-view-input">
                            <div class="row add-action">
                                <div class="col-lg-3">
                                    <div class="">
                                        <label for="addQuantityViewDetail" class="form-label">Cantidad</label>
                                        <input type="number" value="${i}" min="0" max="5" class="form-control qty" id="addQuantityViewDetail">
                                    </div>
                                </div>
                                <div class="col mt-4">
                                    <button id="popup-view-detail-remove-cart" type="button" class="btn btn-danger cart popup-view-detail-remove-cart" data-nombre="${d}" data-precio="${f}"><i class="fa-solid fa-trash-can"></i></button>
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
                        <strong>Ingredientes:</strong> ${b?.ingredientes}.
                    </p>
                    <p>
                        <strong>Alérgenos:</strong> ${b?.alergenos}
                    </p>
                    <p>
                        <strong>Presentación:</strong> ${b?.presentacion}
                    </p>
                    <p><strong>Vida útil:</strong> ${b?.vidaUtil}</p>
                    <p><strong>Conservación:</strong> ${b?.conservacion}</p>
                </div>
            </div>
        </div>`,confirmButtonText:"Cerrar",width:"960px"});const j=document.getElementById("addQuantityViewDetail"),k=document.querySelector(".quantity-alert"),l=document.getElementById("popup-view-detail-remove-cart");j?.addEventListener("change",function(){let a=parseInt(this.value);isNaN(a)&&(a=0,j.value="0"),0>a||5<a?k.classList.remove("d-none"):(k.classList.add("d-none"),setTimeout(()=>{updateBasketQuantity(a,{nombreProducto:d,...b,cantidad:a,precio:f,totalProducto:parseFloat(f)*a,productId:c})},10))}),l?.addEventListener("click",function(){j.value="0",setTimeout(()=>{updateBasketQuantity(0,{nombreProducto:d,...b,cantidad:0,precio:f,totalProducto:0,productId:c})},10)})}