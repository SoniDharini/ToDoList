document.getElementById('addTaskBtn').addEventListener('click', addTask);
document.getElementById('themeToggle').addEventListener('click', toggleTheme);

// Load tasks on page load
window.addEventListener('DOMContentLoaded', loadTasks);

let pendingCount = 0;
let completedCount = 0;

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    const priority = document.getElementById('priority').value;

    if (taskText === '') {
        showNotification("Please enter a task!");
        return;
    }

    const taskList = document.getElementById(`${priority.toLowerCase()}PriorityList`);

    // Create a new task item
    const li = document.createElement('li');

    // Create a checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', () => {
        li.classList.toggle('completed', checkbox.checked);
        updateTaskCounts();
        saveTasks();
    });

    li.appendChild(checkbox);
    li.appendChild(document.createTextNode(taskText));

    // Add delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', () => {
        taskList.removeChild(li);
        updateTaskCounts();
        saveTasks();
        showNotification("Task deleted!");
    });

    li.appendChild(deleteBtn);
    taskList.appendChild(li);

    // Save tasks to localStorage
    saveTasks();

    // Clear input field
    taskInput.value = '';
    showNotification("Task added!");
    updateTaskCounts();
}

function updateTaskCounts() {
    const allTasks = document.querySelectorAll('li');
    pendingCount = 0;
    completedCount = 0;

    allTasks.forEach(task => {
        if (task.classList.contains('completed')) {
            completedCount++;
        } else {
            pendingCount++;
        }
    });

    document.getElementById('pendingTasks').textContent = pendingCount;
    document.getElementById('completedTasks').textContent = completedCount;
}

function toggleTheme() {
    document.body.classList.toggle('dark');
    const themeToggleBtn = document.getElementById('themeToggle');
    themeToggleBtn.textContent = document.body.classList.contains('dark')
        ? "Light Mode"
        : "Dark Mode";

    // Save theme preference to localStorage
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
}

function showNotification(message) {
    const notification = document.getElementById('notifications');
    notification.textContent = message;
    notification.classList.remove('hidden');
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

function saveTasks() {
    const tasks = {
        high: Array.from(document.getElementById('highPriorityList').children).map(task => ({
            text: task.childNodes[1].textContent,
            completed: task.classList.contains('completed'),
        })),
        medium: Array.from(document.getElementById('mediumPriorityList').children).map(task => ({
            text: task.childNodes[1].textContent,
            completed: task.classList.contains('completed'),
        })),
        low: Array.from(document.getElementById('lowPriorityList').children).map(task => ({
            text: task.childNodes[1].textContent,
            completed: task.classList.contains('completed'),
        })),
    };

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || { high: [], medium: [], low: [] };

    // Load tasks into their respective lists
    Object.keys(savedTasks).forEach(priority => {
        const taskList = document.getElementById(`${priority}PriorityList`);
        savedTasks[priority].forEach(task => {
            const li = document.createElement('li');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', () => {
                li.classList.toggle('completed ', checkbox.checked);
                updateTaskCounts();
                saveTasks();
            });

            li.appendChild(checkbox);
            li.appendChild(document.createTextNode(task.text));

            if (task.completed) {
                li.classList.add('completed');
            }

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'delete-btn';
            deleteBtn.addEventListener('click', () => {
                taskList.removeChild(li);
                updateTaskCounts();
                saveTasks();
                showNotification("Task deleted!");
            });

            li.appendChild(deleteBtn);
            taskList.appendChild(li);
        });
    });

    // Load theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        document.getElementById('themeToggle').textContent = 'Light Mode';
    }

    updateTaskCounts(); // Update counts on load
}