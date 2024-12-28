const apiUrl = 'http://localhost:3000/api/tasks';

// Fetch tasks and display them
function fetchTasks() {
    fetch(apiUrl)
        .then((response) => response.json())
        .then((tasks) => {
            console.log("Fetched tasks:", tasks); // Debug
            const taskList = document.getElementById('task-list');
            taskList.innerHTML = '';
            tasks.forEach((task) => {
                const taskDiv = document.createElement('div');
                taskDiv.classList.add('task');
                taskDiv.innerHTML = `
                    <h3>${task.name}</h3>
                    <p>${task.description || 'No description provided'}</p>
                    <p>Due: ${task.due_date || 'No due date set'}</p>
                    <p>Status: ${task.status === 0 ? 'Pending' : 'Completed'}</p>
                    <button onclick="startEditTask(${task.id})">Edit</button>
                    <button onclick="deleteTask(${task.id})">Delete</button>
                `;
                taskList.appendChild(taskDiv);
            });
        })
        .catch((error) => console.error("Error fetching tasks:", error));
}


// Add or update a task
document.getElementById('task-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('task-id').value;
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const due_date = document.getElementById('due_date').value;
    const status = parseInt(document.getElementById('status').value || 0);

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${apiUrl}/${id}` : apiUrl;

    fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, due_date, status }),
    }).then(() => {
        resetForm();
        fetchTasks();
    });
});

// Delete a task
function deleteTask(id) {
    fetch(`${apiUrl}/${id}`, { method: 'DELETE' }).then(() => {
        fetchTasks();
    });
}

// Start editing a task
function startEditTask(id) {
    fetch(`${apiUrl}/${id}`)
        .then((response) => response.json())
        .then((task) => {
            document.getElementById('task-id').value = task.id;
            document.getElementById('name').value = task.name;
            document.getElementById('description').value = task.description;
            document.getElementById('due_date').value = task.due_date;
            document.getElementById('status').value = task.status;

            document.getElementById('form-title').innerText = 'Edit Task';
            document.getElementById('submit-button').innerText = 'Update Task';
            document.getElementById('status-label').style.display = 'block';
            document.getElementById('status').style.display = 'block';
        });
}

// Reset the form to default "Add Task" mode
function resetForm() {
    document.getElementById('task-id').value = '';
    document.getElementById('name').value = '';
    document.getElementById('description').value = '';
    document.getElementById('due_date').value = '';
    document.getElementById('status').value = 0;

    document.getElementById('form-title').innerText = 'Add Task';
    document.getElementById('submit-button').innerText = 'Add Task';
    document.getElementById('status-label').style.display = 'none';
    document.getElementById('status').style.display = 'none';
}

// Fetch tasks on page load
fetchTasks();
