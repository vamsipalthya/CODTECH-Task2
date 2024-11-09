// Initialize Lucide icons
lucide.createIcons();

// DOM Elements
const blogEditor = document.getElementById('blogEditor');
const blogList = document.getElementById('blogList');
const writeBtn = document.getElementById('writeBtn');
const startWritingBtn = document.getElementById('startWritingBtn');
const startReadingBtn = document.getElementById('startReadingBtn');
const publishBtn = document.getElementById('publishBtn');
const cancelBtn = document.getElementById('cancelBtn');
const titleInput = document.getElementById('titleInput');
const contentInput = document.getElementById('contentInput');
const searchInput = document.getElementById('searchInput');

// Blog data
let blogs = JSON.parse(localStorage.getItem('blogs')) || [];
let editingId = null;

// Event Listeners
writeBtn.addEventListener('click', showEditor);
startWritingBtn.addEventListener('click', showEditor);
startReadingBtn.addEventListener('click', showBlogs);
publishBtn.addEventListener('click', handlePublish);
cancelBtn.addEventListener('click', hideEditor);
searchInput.addEventListener('input', handleSearch);

// Functions
function showEditor() {
  blogEditor.classList.remove('hidden');
  editingId = null;
  titleInput.value = '';
  contentInput.value = '';
}

function hideEditor() {
  blogEditor.classList.add('hidden');
  editingId = null;
}

function handlePublish() {
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!title || !content) {
    alert('Please fill in all fields');
    return;
  }

  if (editingId) {
    // Update existing blog
    const index = blogs.findIndex(blog => blog.id === editingId);
    if (index !== -1) {
      blogs[index] = {
        ...blogs[index],
        title,
        content,
        edited: true,
        editDate: new Date().toISOString()
      };
    }
  } else {
    // Create new blog
    const newBlog = {
      id: Date.now(),
      title,
      content,
      author: 'Mr_Vamsi',
      date: new Date().toISOString(),
      edited: false
    };
    blogs.unshift(newBlog);
  }

  localStorage.setItem('blogs', JSON.stringify(blogs));
  hideEditor();
  renderBlogs();
}

function handleSearch(e) {
  const searchTerm = e.target.value.toLowerCase();
  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm) ||
    blog.content.toLowerCase().includes(searchTerm)
  );
  renderBlogs(filteredBlogs);
}

function editBlog(id) {
  const blog = blogs.find(b => b.id === id);
  if (!blog) return;

  editingId = id;
  titleInput.value = blog.title;
  contentInput.value = blog.content;
  blogEditor.classList.remove('hidden');
}

function deleteBlog(id) {
  if (!confirm('Are you sure you want to delete this blog?')) return;
  
  blogs = blogs.filter(blog => blog.id !== id);
  localStorage.setItem('blogs', JSON.stringify(blogs));
  renderBlogs();
}

function showBlogs() {
  renderBlogs();
  blogList.scrollIntoView({ behavior: 'smooth' });
}

function renderBlogs(blogsToRender = blogs) {
  blogList.innerHTML = blogsToRender.map(blog => `
    <article class="blog-card">
      <h2>${blog.title}</h2>
      <p>${blog.content}</p>
      <div class="blog-meta">
        <span>By ${blog.author}</span>
        <span>${new Date(blog.date).toLocaleDateString()}</span>
        ${blog.edited ? `<span>(Edited: ${new Date(blog.editDate).toLocaleDateString()})</span>` : ''}
      </div>
      <div class="blog-actions">
        <button onclick="editBlog(${blog.id})" class="btn-secondary">Edit</button>
        <button onclick="deleteBlog(${blog.id})" class="btn-danger">Delete</button>
      </div>
    </article>
  `).join('');
}

// Initialize
renderBlogs();

// Make functions available globally
window.editBlog = editBlog;
window.deleteBlog = deleteBlog;
