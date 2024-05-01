async function loadBlogDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('id');
    let blogItems = [];

    try {
        const jsonFilePath = "./assets/data/blog.json";
        const response = await fetch(jsonFilePath);
        blogItems = await response.json();

        const blogItem = blogItems.find(blog => blog.id === +blogId);

        if (blogItem) {
            createBlogDetail(blogItem);
        } else {
            window.location.href = "not-found.html";
        }
    } catch (error) {
        console.error("Error fetching blog data:", error);
    }
}

function createBlogDetail(blogEntry) {
    const blogDetailTemplate = document.getElementById('blog-detail-template');
    const blogDetailContainer = document.getElementById('blog-detail');
    const blogTplHTML = blogDetailTemplate.content.cloneNode(true);

    blogTplHTML.querySelector('.blog-detail-img').src = blogEntry.imagen;
    blogTplHTML.querySelector('.blog-detail-img').alt = `Blog ${blogEntry.id}`;
    const blogCardTag = blogTplHTML.querySelector('.blog-detail-tag');
    blogCardTag.textContent = blogEntry.tag;
    const tagStyleClass = blogEntry.tag === 'recetas' ? 'receta' : 'info';
    blogCardTag.classList.add(tagStyleClass);
    blogTplHTML.querySelector('.blog-detail-title').textContent = blogEntry.titulo;


    blogDetailContainer.appendChild(blogTplHTML);
}

window.addEventListener("load", () => {
    loadBlogDetails();
});