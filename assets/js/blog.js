let blogItems = [];
let initialItems = [];
const blogCardList = document.querySelector('.blog-card-list');
const loadMoreBtn = document.querySelector('.load-more-btn');
const loader = document.querySelector('.loader');
const blogCardTemplate = document.getElementById('blog-card-template');

async function loadBlogItems() {
    const jsonFilePathBlog = "./assets/data/blog.json";
    const response = await fetch(jsonFilePathBlog);
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
    blogCardHTML.querySelector('p.blog-card-description').textContent = blogEntry.descripcion;
    blogCardHTML.querySelector('a').href = `blog-detail.html?id=${blogEntry.id}`;
    const { day, month } = formatDate(blogEntry.fecha);
    blogCardHTML.querySelector('p.blog-date-day').textContent = day;
    blogCardHTML.querySelector('p.blog-date-month').textContent = month;

    blogCardList.appendChild(blogCardHTML);
}

loadMoreBtn.addEventListener('click', async () => {
    loader.style.display = 'block';
  
    await new Promise(resolve => setTimeout(resolve, 500));

    const additionalItems = blogItems.slice(6, blogItems.length);
  
    additionalItems.forEach(blogItem => {
      createBlogCard(blogItem);
    });
  
    loader.style.display = 'none';

    loadMoreBtn.style.display = 'none';
});

function formatDate(dateString) {
    const dateParts = dateString.split('/');
  
    const day = dateParts[0];
    const month = dateParts[1];
  
    const monthNames = { 
      '01': 'JAN',
      '02': 'FEB',
      '03': 'MAR',
      '04': 'APR',
      '05': 'MAY',
      '06': 'JUN',
      '07': 'JUL',
      '08': 'AUG',
      '09': 'SEP',
      '10': 'OCT',
      '11': 'NOV',
      '12': 'DEC'
    };
    return {
        day, 
        month: monthNames[month]
    };
}
  


window.addEventListener("load", () => {
    loadBlogItems();
});