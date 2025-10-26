
let tasks = [];


const input = document.getElementById('input-box');
const dateInput = document.getElementById('input-date'); 
const addBtn = document.getElementById('add-btn');
const listEl = document.getElementById('list');


function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const saved = localStorage.getItem('tasks');
  if (saved) {
    try {
      tasks = JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing tasks from localStorage', e);
      tasks = [];
    }
  }
}


loadTasks();

if (tasks.length > 0) {

  tasks.forEach(t => listEl.appendChild(renderTaskItem(t)));
} else {
  
  const items = Array.from(listEl.querySelectorAll('li'));
  items.forEach(li => {
    const textParts = [];
    for (const node of li.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) textParts.push(node.textContent);
    }
    const taskText = textParts.join(' ').replace(/\s+/g, ' ').trim();
    if (taskText) {
      const t = makeTask(taskText, "");
      tasks.push(t);
      li.replaceWith(renderTaskItem(t));
    } else {
      li.remove();
    }
  });
  saveTasks(); 
}

function addTask() {
  const value = input.value.trim();
  if (!value) return;
  const dueVal = dateInput ? dateInput.value.trim() : "";
  const task = makeTask(value, dueVal);
  tasks.push(task);
  const li = renderTaskItem(task);
  listEl.appendChild(li);
  saveTasks();
  input.value = '';
  if (dateInput) dateInput.value = '';
  input.focus();
}

function removeTask(taskId) {
  tasks = tasks.filter(t => t.id !== taskId);
  const li = listEl.querySelector(`li[data-id="${taskId}"]`);
  if (li) li.remove();
  saveTasks(); 
}


function makeTask(text, due = "") {
  return {
    id: String(Date.now()) + Math.random().toString(16).slice(2),
    text: text.trim(),
    due: (due || "").trim()
  };
}


function formatDue(due) {
  return due ? `— ${due}` : "";
}


function renderTaskItem(task) {
  const li = document.createElement('li');
  li.dataset.id = task.id;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task-checkbox';

  const textSpan = document.createElement('span');
  textSpan.className = 'task-text';
  textSpan.textContent = task.text;

  const dateSpan = document.createElement('span');
  dateSpan.className = 'task-date';
  const today = new Date().toISOString().split('T')[0];
  const dueLabel = formatDue(task.due || today);
  dateSpan.textContent = dueLabel;

  const delBtn = document.createElement('button');
  delBtn.className = 'delete-btn';
  delBtn.textContent = 'Delete';

  li.appendChild(checkbox);
  li.appendChild(document.createTextNode(' '));
  li.appendChild(textSpan);
  li.appendChild(document.createTextNode(' '));
  li.appendChild(dateSpan);
  li.appendChild(document.createTextNode(' '));
  li.appendChild(delBtn);
  return li;
}


function startInlineEdit(spanEl, taskId, field /* 'text' | 'due' */) {
  const isText = field === 'text';
  const inputEl = document.createElement('input');
  inputEl.type = isText ? 'text' : 'date';

  if (isText) {
    inputEl.value = spanEl.textContent;
  } else {
   "
    const raw = spanEl.textContent.replace(/^—\s*/, '');
    inputEl.value = raw || '';
  }

  inputEl.setAttribute('data-editing', field);
  inputEl.style.minWidth = isText ? '12rem' : '10rem';

  spanEl.replaceWith(inputEl);
  inputEl.focus();
  if (isText) inputEl.select();

  const commit = () => {
    const val = inputEl.value.trim();
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    if (isText) {
      if (val) task.text = val; 
    } else {
      task.due = val; 
    }

    const newSpan = document.createElement('span');
    newSpan.className = isText ? 'task-text' : 'task-date';
    const label = isText ? task.text : formatDue(task.due);
    newSpan.textContent = label;
    if (!isText && !label) newSpan.classList.add('hidden');
    inputEl.replaceWith(newSpan);

    saveTasks(); 
  };

  const cancel = () => {
    const task = tasks.find(t => t.id === taskId);
    const newSpan = document.createElement('span');
    newSpan.className = isText ? 'task-text' : 'task-date';
    const label = isText ? (task ? task.text : spanEl.textContent) : formatDue(task ? task.due : '');
    newSpan.textContent = label;
    if (!isText && !label) newSpan.classList.add('hidden');
    inputEl.replaceWith(newSpan);
  };

  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') commit();
    if (e.key === 'Escape') cancel();
  });
  inputEl.addEventListener('blur', commit);
}


(function bootstrapFromDOM() {
  const items = Array.from(listEl.querySelectorAll('li'));
  items.forEach(li => {
  
    const textParts = [];
    for (const node of li.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) textParts.push(node.textContent);
    }
    const taskText = textParts.join(' ').replace(/\s+/g, ' ').trim();
    if (taskText) {
      const t = makeTask(taskText, "");
      tasks.push(t);
      li.replaceWith(renderTaskItem(t)); 
    } else {
      li.remove();
    }
  });
})();


function addTask() {
  const value = input.value.trim();
  if (!value) return;
  const dueVal = dateInput ? dateInput.value.trim() : "";
  const task = makeTask(value, dueVal);
  tasks.push(task);
  const li = renderTaskItem(task); 
  listEl.appendChild(li);
  input.value = '';
  if (dateInput) dateInput.value = '';
  input.focus();
}


function removeTask(taskId) {
  tasks = tasks.filter(t => t.id !== taskId);
  const li = listEl.querySelector(`li[data-id="${taskId}"]`);
  if (li) li.remove();
}


addBtn.addEventListener('click', addTask);
input.addEventListener('keydown', (e) => { if (e.key === 'Enter') addTask(); });
if (dateInput) {
  dateInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') addTask(); });
}

listEl.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-btn')) {
    const li = e.target.closest('li');
    if (!li) return;
    removeTask(li.dataset.id);
    return;
  }
  if (e.target.classList.contains('task-text')) {
    const li = e.target.closest('li');
    startInlineEdit(e.target, li.dataset.id, 'text');
    return;
  }
  if (e.target.classList.contains('task-date')) {
    const li = e.target.closest('li');
    startInlineEdit(e.target, li.dataset.id, 'due');
    return;
  }
});




