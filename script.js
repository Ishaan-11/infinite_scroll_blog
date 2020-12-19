const filter = document.getElementById('filter'),
  postsContainer = document.getElementById('posts-container'),
  loader = document.querySelector('.loader'),
  resultHeading = document.getElementById('result-heading');


let page = 1;
let limit = 5;

// Fetch posts from API
async function getPostsApi() {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}`);
  const data = await response.json();

  return data;
}

// Show posts in DOM
async function showPosts() {
  const posts = await getPostsApi();

  posts.forEach(post => {
    const postEl = document.createElement('div');
    postEl.classList.add('post');
    postEl.innerHTML = `
      <div class="number">${post.id}</div>
      <div class="post-info">
        <h2 class="post-title">${post.title}</h2>
        <p class="post-body">${post.body}</p>
      </div>
    `;

    postsContainer.appendChild(postEl);
  });
}

// Show loader & fetch more posts
function loadMorePost() {
  loader.classList.add('show');

  setTimeout(() => {
    loader.classList.remove('show');

    setTimeout(() => {
      page++;
      showPosts();
    }, 300);
  }, 1000);
}

// Filter posts by input
function filterPosts (e) {
  let term = e.target.value.toUpperCase();

  const posts = document.querySelectorAll('.post');

  const postCount = posts.length;
  let hiddenPostCount = 0;

  posts.forEach(post => {
    const title = post.querySelector('.post-title').innerText.toUpperCase();
    const body = post.querySelector('.post-body').innerText.toUpperCase();

    if (title.indexOf(term) > -1 || body.indexOf(term) > -1) {
      post.style.display = 'flex';
    } else {
      post.style.display = 'none';
      hiddenPostCount++;
    }
  });

  if (hiddenPostCount === postCount) {
    resultHeading.innerHTML = `<p>There are no search results. Try again!<p>`;
  } else {
    resultHeading.innerHTML = '';
  }
}

// Show initial posts
showPosts();

window.addEventListener('scroll', () => {
  const {scrollTop, scrollHeight, clientHeight} = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 5) {
    loadMorePost();
  }
})

filter.addEventListener('input', filterPosts);