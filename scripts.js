// scripts.js
document.addEventListener('DOMContentLoaded', () => {
    const taskTitleInput = document.getElementById('task-title');
    const taskDescriptionInput = document.getElementById('task-description');
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');

    addTaskButton.addEventListener('click', () => {
        const title = taskTitleInput.value;
        const description = taskDescriptionInput.value;

        if (title && description) {
            addTask(title, description);
            taskTitleInput.value = '';
            taskDescriptionInput.value = '';
        }
    });

    const addTask = (title, description) => {
        const task = document.createElement('div');
        task.classList.add('task');

        const taskTitle = document.createElement('h2');
        taskTitle.textContent = title;

        const taskDescription = document.createElement('p');
        taskDescription.textContent = description;

        task.appendChild(taskTitle);
        task.appendChild(taskDescription);
        taskList.appendChild(task);
    };
});
