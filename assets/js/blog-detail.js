let blogItems = [];
let blogItem = null;
const blogCardList = document.querySelector('.blog-card-list');
const blogCardTemplate = document.getElementById('blog-card-template');
const nextButton = document.getElementById('blog-next');
const prevButton = document.getElementById('blog-prev');

async function loadBlogDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('id');

    try {
        const jsonFilePathBlog = "./assets/data/blog.json";
        const response = await fetch(jsonFilePathBlog);
        blogItems = await response.json();

        if (blogId === '1') {
            prevButton.disabled = true;
        } else if (+blogId === blogItems.length) {
            nextButton.disabled = true;
        }

        blogItem = blogItems.find(blog => blog.id === +blogId);

        if (blogItem) {
            createBlogDetail(blogItem);
            const filteredBlogItems = blogItems.filter(blogEntry => blogEntry.id !== +blogId);
            filteredBlogItems.sort(() => 0.5 - Math.random());
            const randomBlogItems = filteredBlogItems.slice(0, 3);
            randomBlogItems.forEach(blogEntry => {
                createBlogCard(blogEntry);
            });
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
    const { day, month } = formatDate(blogEntry.fecha);
    blogTplHTML.querySelector('p.blog-date-day').textContent = day;
    blogTplHTML.querySelector('p.blog-date-month').textContent = month;
    // if (blogEntry.tag === 'recetas') {
    //     blogTplHTML.querySelector('.blog-detail-content-receta').classList.remove('d-none');
    //     blogTplHTML.querySelector('.blog-detail-content-info').classList.add('d-none');
    // } else {
    //     blogTplHTML.querySelector('.blog-detail-content-info').classList.remove('d-none');
    //     blogTplHTML.querySelector('.blog-detail-content-receta').classList.add('d-none');
    // }

    blogDetailContainer.appendChild(blogTplHTML);
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
    blogCardHTML.querySelector('.blog-card-text p').textContent = blogEntry.descripcion;
    blogCardHTML.querySelector('a').href = `blog-detail.html?id=${blogEntry.id}`;
    const { day, month } = formatDate(blogEntry.fecha);
    blogCardHTML.querySelector('p.blog-date-day').textContent = day;
    blogCardHTML.querySelector('p.blog-date-month').textContent = month;

    blogCardList.appendChild(blogCardHTML);
}


prevButton.addEventListener('click', async () => {
    if (blogItem) {
        const previousId = blogItem.id - 1;
        if (previousId >= 1) {
            window.location.href = `blog-detail.html?id=${previousId}`;
            await loadBlogDetails();
        } else {
            prevButton.disabled = true;
        }
    }
});



nextButton.addEventListener('click', async () => {
    if (blogItem) {
        const nextId = blogItem.id + 1;
        if (nextId <= blogItems.length) {
            window.location.href = `blog-detail.html?id=${nextId}`;
            await loadBlogDetails();
        } else {
            nextButton.disabled = true;
        }
    }
});

window.addEventListener("load", () => {
    loadBlogDetails();
});