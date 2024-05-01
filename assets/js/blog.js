let blogItems = [];
let initialItems = [];
let displayedItems = 3;
const blogCardList = document.querySelector('.blog-card-list');
const loadMoreBtn = document.querySelector('.load-more-btn');
const loader = document.querySelector('.loader');
const blogCardTemplate = document.getElementById('blog-card-template');

async function loadBlogItems() {
    const jsonFilePath = "./assets/data/blog.json";
    const response = await fetch(jsonFilePath);
    blogItems = await response.json();
    initialItems = blogItems.slice(0, 6);

    initialItems.forEach(blogEntry => {
        createBlogCard(blogEntry);
    });
}

function createBlogCard(blogEntry) {
    const blogCardHTML = blogCardTemplate.content.cloneNode(true);

    blogCardHTML.querySelector('img').src = blogEntry.imagen;
    blogCardHTML.querySelector('img').alt = `Blog ${blogEntry.id}`;
    const blogCardTag = blogCardHTML.querySelector('.blog-card-tag');
    blogCardTag.textContent = blogEntry.tag;
    const tagStyleClass = blogEntry.tag === 'recetas' ? 'receta' : 'info';
    blogCardTag.classList.add(tagStyleClass);
    blogCardHTML.querySelector('h2').textContent = blogEntry.titulo;
    blogCardHTML.querySelector('p').textContent = blogEntry.descripcion;
    blogCardHTML.querySelector('a').href = `blog-detail.html?id=${blogEntry.id}`;


    blogCardList.appendChild(blogCardHTML);
}

loadMoreBtn.addEventListener('click', async () => {
    loader.style.display = 'block';
  
    await new Promise(resolve => setTimeout(resolve, 500));

    const additionalItems = blogItems.slice(displayedItems, displayedItems + 3);
    displayedItems += 3;
  
    additionalItems.forEach(blogItem => {
      createBlogCard(blogItem);
    });
  
    loader.style.display = 'none';

    loadMoreBtn.style.display = 'none';
});


window.addEventListener("load", () => {
    loadBlogItems();
});