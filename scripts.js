// scripts.js
// Firebase configuration
const firebaseConfig = {
    apiKey: "取得したAPIキー",
    authDomain: "取得したauthDomain",
    projectId: "取得したprojectId",
    storageBucket: "取得したstorageBucket",
    messagingSenderId: "取得したmessagingSenderId",
    appId: "取得したappId"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', () => {
    const taskTitleInput = document.getElementById('task-title');
    const taskDescriptionInput = document.getElementById('task-description');
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');
    const sidebar = document.getElementById('sidebar');

    const loadTasks = async () => {
        const tasksSnapshot = await db.collection('tasks').get();
        tasksSnapshot.forEach(doc => {
            const taskData = doc.data();
            addTaskToDOM(doc.id, taskData.title, taskData.description, taskData.status, taskData.date, taskData.githubCommit);
            addTaskToSidebar(doc.id, taskData.title, taskData.status);
        });
    };

    const addTaskToDOM = (id, title, description, status = 'not-started', date = '', githubCommit = '') => {
        const task = document.createElement('div');
        task.classList.add('task');
        task.setAttribute('data-id', id);

        const taskContent = document.createElement('div');
        const taskTitle = document.createElement('h2');
        taskTitle.textContent = title;
        const taskDescription = document.createElement('p');
        taskDescription.textContent = description;
        taskContent.appendChild(taskTitle);
        taskContent.appendChild(taskDescription);

        const taskMeta = document.createElement('div');
        const taskStatus = document.createElement('span');
        taskStatus.classList.add('status', `status-${status}`);
        taskStatus.textContent = status.replace(/-/g, ' ');
        taskMeta.appendChild(taskStatus);

        const taskActions = document.createElement('div');
        taskActions.classList.add('actions');
        const notStartedButton = document.createElement('button');
        notStartedButton.classList.add('status-not-started');
        notStartedButton.textContent = '未着手';
        notStartedButton.onclick = () => updateTaskStatus(id, 'not-started');
        const inProgressButton = document.createElement('button');
        inProgressButton.classList.add('status-in-progress');
        inProgressButton.textContent = '実行中';
        inProgressButton.onclick = () => updateTaskStatus(id, 'in-progress');
        const doneButton = document.createElement('button');
        doneButton.classList.add('status-done');
        doneButton.textContent = '完了';
        doneButton.onclick = () => updateTaskStatus(id, 'done');

        taskActions.appendChild(notStartedButton);
        taskActions.appendChild(inProgressButton);
        taskActions.appendChild(doneButton);
        taskMeta.appendChild(taskActions);

        task.appendChild(taskContent);
        task.appendChild(taskMeta);
        taskList.appendChild(task);
    };

    const addTaskToSidebar = (id, title, status) => {
        const taskItem = document.createElement('li');
        taskItem.textContent = title;
        taskItem.onclick = () => scrollToTask(id);
        sidebar.appendChild(taskItem);
    };

    const scrollToTask = (id) => {
        const taskElement = document.querySelector(`.task[data-id="${id}"]`);
        if (taskElement) {
            taskElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const updateTaskStatus = async (id, status) => {
        await db.collection('tasks').doc(id).update({ status });
        const taskElement = document.querySelector(`.task[data-id="${id}"]`);
        if (taskElement) {
            const statusElement = taskElement.querySelector('.status');
            statusElement.className = `status status-${status}`;
            statusElement.textContent = status.replace(/-/g, ' ');
        }
    };

    addTaskButton.addEventListener('click', async () => {
        const title = taskTitleInput.value;
        const description = taskDescriptionInput.value;

        if (title && description) {
            const newTask = {
                title: title,
                description: description,
                status: 'not-started',
                date: new Date().toLocaleDateString(),
                githubCommit: ''
            };
            const docRef = await db.collection('tasks').add(newTask);

            addTaskToDOM(docRef.id, title, description, newTask.status, newTask.date, newTask.githubCommit);
            addTaskToSidebar(docRef.id, title, newTask.status);
            taskTitleInput.value = '';
            taskDescriptionInput.value = '';
        }
    });

    sidebar.innerHTML = '<h2>Tasks</h2><ul></ul>';
    loadTasks();
});

