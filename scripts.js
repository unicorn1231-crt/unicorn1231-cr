// scripts.js
// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAVes7d5z_IwTEGK2jZqzQn1TaJrHw-Atc",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "task-3878b",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "1:1014776256193:web:1167c032873bd8a54de640"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', () => {
    const taskTitleInput = document.getElementById('task-title');
    const taskDescriptionInput = document.getElementById('task-description');
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');

    const loadTasks = async () => {
        const tasksSnapshot = await db.collection('tasks').get();
        tasksSnapshot.forEach(doc => {
            const taskData = doc.data();
            addTaskToDOM(doc.id, taskData.title, taskData.description);
        });
    };

    const addTaskToDOM = (id, title, description) => {
        const task = document.createElement('div');
        task.classList.add('task');
        task.setAttribute('data-id', id);

        const taskTitle = document.createElement('h2');
        taskTitle.textContent = title;

        const taskDescription = document.createElement('p');
        taskDescription.textContent = description;

        task.appendChild(taskTitle);
        task.appendChild(taskDescription);
        taskList.appendChild(task);
    };

    addTaskButton.addEventListener('click', async () => {
        const title = taskTitleInput.value;
        const description = taskDescriptionInput.value;

        if (title && description) {
            const docRef = await db.collection('tasks').add({
                title: title,
                description: description
            });

            addTaskToDOM(docRef.id, title, description);
            taskTitleInput.value = '';
            taskDescriptionInput.value = '';
        }
    });

    loadTasks();
});

