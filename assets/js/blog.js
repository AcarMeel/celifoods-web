let blogItems = [];
const blogCardList = document.querySelector('.blog-card-list');

const blogCardTemplate = document.getElementById('blog-card-template');

async function loadBlogItems() {
    const jsonFilePath = "./assets/data/blog.json";
    const response = await fetch(jsonFilePath);
    blogItems = await response.json();

    blogItems.forEach(blogEntry => {
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




window.addEventListener("load", () => {
    loadBlogItems();
});