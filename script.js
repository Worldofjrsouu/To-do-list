let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
let currentFilter = 'all';

const taskInput = document.getElementById('taskInput');
const addBtn    = document.getElementById('addBtn');
const taskList  = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const clearDone = document.getElementById('clearDone');
const filterBtns = document.querySelectorAll('.filter-btn');

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;
  tasks.push({ id: Date.now(), text, done: false });
  taskInput.value = '';
  saveTasks();
  render();
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) task.done = !task.done;
  saveTasks();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  render();
}

function clearCompleted() {
  tasks = tasks.filter(t => !t.done);
  saveTasks();
  render();
}

function getFiltered() {
  if (currentFilter === 'active') return tasks.filter(t => !t.done);
  if (currentFilter === 'done')   return tasks.filter(t => t.done);
  return tasks;
}

function render() {
  const filtered = getFiltered();
  taskList.innerHTML = '';

  if (filtered.length === 0) {
    taskList.innerHTML = `<li class="empty-state">No tasks here!</li>`;
  } else {
    filtered.forEach(task => {
      const li = document.createElement('li');

      const check = document.createElement('div');
      check.className = 'task-check' + (task.done ? ' checked' : '');
      check.addEventListener('click', () => toggleTask(task.id));

      const span = document.createElement('span');
      span.className = 'task-text' + (task.done ? ' done' : '');
      span.textContent = task.text;

      const del = document.createElement('button');
      del.className = 'delete-btn';
      del.textContent = '×';
      del.title = 'Delete';
      del.addEventListener('click', () => deleteTask(task.id));

      li.appendChild(check);
      li.appendChild(span);
      li.appendChild(del);
      taskList.appendChild(li);
    });
  }

  const activeCount = tasks.filter(t => !t.done).length;
  taskCount.textContent = `${activeCount} task${activeCount !== 1 ? 's' : ''} left`;
}

// Events
addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') addTask();
});

clearDone.addEventListener('click', clearCompleted);

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  });
});

// Init
render();