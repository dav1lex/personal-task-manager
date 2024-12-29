const apiUrl = 'https://personal-task-manager-xhtv.onrender.com';

// Fetch tasks and display
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


// Add or update task
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

function deleteTask(taskId) {
    if (!taskId) {
        alert("Task ID is missing. Cannot delete the task.");
        return;
    }

    if (confirm("Are you sure you want to delete this task? This action cannot be undone.")) {
        fetch(`http://localhost:3000/api/tasks/${taskId}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (response.ok) {
                    alert("Task deleted successfully.");
                    fetchTasks(); // Refreshthe list
                } else {
                    return response.json().then((data) => {
                        console.error("Server Response:", data);
                        alert(`Failed to delete task: ${data.error || "Unknown error"}`);
                    });
                }
            })
            .catch((error) => {
                console.error("Network Error:", error);
                alert("ERROR.");
            });
    } else {
        alert("Task deletion canceled.");
    }
}

// Start editing task
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

// Reset the form to default
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

// Fetch tasks on load
fetchTasks();
