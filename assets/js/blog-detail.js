let blogItems=[],blogItem=null;const blogCardList=document.querySelector(".blog-card-list"),blogCardTemplate=document.getElementById("blog-card-template");async function loadBlogDetails(){const a=new URLSearchParams(window.location.search),b=a.get("id");try{const a=await fetch("./assets/data/blog.json");if(blogItems=await a.json(),blogItem=blogItems.find(a=>a.id===+b),blogItem){createBlogDetail(blogItem);const a=blogItems.filter(a=>a.id!==+b);a.sort(()=>.5-Math.random());const c=a.slice(0,3);c.forEach(a=>{createBlogCard(a)})}else window.location.href="not-found.html"}catch(a){console.error("Error fetching blog data:",a)}}function createBlogDetail(a){const b=document.getElementById("blog-detail-template"),c=document.getElementById("blog-detail"),d=b.content.cloneNode(!0);d.querySelector(".blog-detail-img").src=a.imagen,d.querySelector(".blog-detail-img").alt=`Blog ${a.id}`;const e=d.querySelector(".blog-detail-tag");e.textContent=a.tag;const f="recetas"===a.tag?"receta":"info";e.classList.add(f),d.querySelector(".blog-detail-title").textContent=a.titulo;const{day:g,month:h}=formatDate(a.fecha);d.querySelector("p.blog-date-day").textContent=g,d.querySelector("p.blog-date-month").textContent=h,c.appendChild(d)}function createBlogCard(a){const b=blogCardTemplate.content.cloneNode(!0);b.querySelector("img").src=a.imagen,b.querySelector("img").alt=`Blog ${a.id}`;const c=b.querySelector(".blog-card-tag");c.textContent=a.tag;const d="recetas"===a.tag?"receta":"info";c.classList.add(d),b.querySelector("h2").textContent=a.titulo,b.querySelector(".blog-card-text p").textContent=a.descripcion,b.querySelector("a").href=`blog-detail.html?id=${a.id}`;const{day:e,month:f}=formatDate(a.fecha);b.querySelector("p.blog-date-day").textContent=e,b.querySelector("p.blog-date-month").textContent=f,blogCardList.appendChild(b)}const prevButton=document.getElementById("blog-prev");prevButton.addEventListener("click",async()=>{if(blogItem){const a=blogItem.id-1;1<=a&&(window.location.href=`blog-detail.html?id=${a}`,await loadBlogDetails())}});const nextButton=document.getElementById("blog-next");nextButton.addEventListener("click",async()=>{if(blogItem){const a=blogItem.id+1;a<=blogItems.length&&(window.location.href=`blog-detail.html?id=${a}`,await loadBlogDetails())}}),window.addEventListener("load",()=>{loadBlogDetails()});