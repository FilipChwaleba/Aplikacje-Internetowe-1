

const searchInput = document.getElementById('search-box');
const searchResults = document.getElementById('search-results');
const listEl = document.getElementById('list');

function normalize(s) {
  return (s || '').toLowerCase().trim();
}

function hideSearchResults() {
  searchResults.style.display = 'none';
  searchResults.innerHTML = '';
}

function showSearchResults(results) {
  if (!results || results.length === 0) {
    hideSearchResults();
    return;
  }

  searchResults.innerHTML = '';

  results.forEach(item => {
    const resultItem = document.createElement('div');
    resultItem.className = 'search-result-item';
    

    const content = document.createElement('div');
    content.className = 'result-content';
    
    const text = document.createElement('span');
    text.className = 'result-text';
    text.textContent = item.text;
    
    const date = document.createElement('span');
    date.className = 'result-date';
    date.textContent = item.date;
    
    content.appendChild(text);
    content.appendChild(date);
    resultItem.appendChild(content);
    

    resultItem.addEventListener('click', () => {
      const originalItem = document.querySelector(`li[data-id="${item.id}"]`);
      if (originalItem) {
        originalItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        originalItem.classList.add('highlight');
        setTimeout(() => originalItem.classList.remove('highlight'), 2000);
        hideSearchResults();
        searchInput.value = '';
      }
    });
    
    searchResults.appendChild(resultItem);
  });
  
  searchResults.style.display = 'block';
}

function searchTasks(query) {
  const q = normalize(query);
  

  if (q.length < 2) {
    hideSearchResults();
    return;
  }

  const items = Array.from(listEl.querySelectorAll('li')).map(li => ({
    id: li.dataset.id,
    text: li.querySelector('.task-text')?.textContent || '',
    date: li.querySelector('.task-date')?.textContent || '',
    element: li
  }));

  const matches = items.filter(item => {
    const text = normalize(item.text);
    const date = normalize(item.date);
    return text.includes(q) || date.includes(q);
  });

  showSearchResults(matches);
}


if (searchInput && searchResults) {

  let searchTimeout;
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      searchTasks(searchInput.value);
    }, 150);
  });


  document.addEventListener('click', (e) => {
    if (!searchResults.contains(e.target) && !searchInput.contains(e.target)) {
      hideSearchResults();
    }
  });


  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hideSearchResults();
      searchInput.blur();
    }
  });
}


function jumpToTask(taskId) {
  const todo = window.todo;
  if (!todo || !todo.listEl) return;

  const li = todo.listEl.querySelector(`li[data-id="${taskId}"]`);
  if (!li) return;


  li.style.display = '';

  li.scrollIntoView({ behavior: 'smooth', block: 'center' });
  li.classList.add('search-target-highlight');

  setTimeout(() => li.classList.remove('search-target-highlight'), 1200);
}


if (searchInput && suggBox) {
  let debounce;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => buildSuggestions(searchInput.value), 120);
  });


  suggBox.addEventListener('click', (e) => {
    const item = e.target.closest('.item');
    if (!item) return;
    const id = item.getAttribute('data-id');
    closeSuggestions();
    jumpToTask(id);
  });
  suggBox.addEventListener('keydown', (e) => {
    const item = e.target.closest('.item');
    if (item && (e.key === 'Enter' || e.key === ' ')) {
      const id = item.getAttribute('data-id');
      e.preventDefault();
      closeSuggestions();
      jumpToTask(id);
    }
  });
)
  searchInput.addEventListener('blur', () => setTimeout(closeSuggestions, 150));
  suggBox.addEventListener('blur', () => setTimeout(closeSuggestions, 150));
}

