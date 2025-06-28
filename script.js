// DOM Elements
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const themeToggle = document.getElementById('themeToggle');
const notification = document.getElementById('notification');
const totalTasksElement = document.getElementById('totalTasks');
const completedTasksElement = document.getElementById('completedTasks');
const pendingTasksElement = document.getElementById('pendingTasks');

// Initialize tasks array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Initialize theme
const currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);
if (currentTheme === 'dark') themeToggle.checked = true;

// Render tasks
function renderTasks(filter = 'all') {
    taskList.innerHTML = '';
    
    let filteredTasks = tasks;
    if (filter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    } else if (filter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    }
    
    if (filteredTasks.length === 0) {
        taskList.innerHTML = `<li class="empty-state">No ${filter} tasks found</li>`;
    } else {
        filteredTasks.forEach((task, index) => {
            const li = document.createElement('li');
            if (task.completed) li.classList.add('completed');
            
            li.innerHTML = `
                <span class="task-text">${task.text}</span>
                <div class="task-actions">
                    <button class="complete-btn" onclick="toggleComplete(${index})">
                        <i class="fas fa-${task.completed ? 'undo' : 'check'}"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteTask(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            taskList.appendChild(li);
        });
    }
    
    updateStats();
}

// Add new task
function addTask() {
    const text = taskInput.value.trim();
    if (text === '') {
        showNotification('Please enter a task');
        return;
    }
    
    tasks.push({
        text,
        completed: false,
        createdAt: new Date()
    });
    
    saveTasks();
    taskInput.value = '';
    renderTasks();
    showNotification('Task added successfully');
}

// Toggle task completion
function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
    showNotification(`Task marked as ${tasks[index].completed ? 'completed' : 'pending'}`);
}

// Delete task
function deleteTask(index) {
    const deletedTask = tasks.splice(index, 1)[0];
    saveTasks();
    renderTasks();
    showNotification('Task deleted');
}

// Clear completed tasks
function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
    showNotification('Completed tasks cleared');
}

// Filter tasks
function filterTasks(type) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    renderTasks(type);
}

// Update statistics
function updateStats() {
    totalTasksElement.textContent = tasks.length;
    const completedCount = tasks.filter(task => task.completed).length;
    completedTasksElement.textContent = completedCount;
    pendingTasksElement.textContent = tasks.length - completedCount;
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Show notification
function showNotification(message) {
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Theme toggle
themeToggle.addEventListener('change', function() {
    if (this.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
});

// Initialize app
function init() {
    renderTasks();
    
    // Add task on Enter key
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addTask();
    });
}

init();