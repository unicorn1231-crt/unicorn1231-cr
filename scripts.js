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
    const taskDeadlineInput = document.getElementById('task-deadline');
    const taskPriorityInput = document.getElementById('task-priority');
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');
    const taskSidebar = document.getElementById('task-sidebar');

    const loadTasks = async () => {
        const tasksSnapshot = await db.collection('tasks').get();
        tasksSnapshot.forEach(doc => {
            const taskData = doc.data();
            addTaskToDOM(doc.id, taskData.title, taskData.description, taskData.status, taskData.date, taskData.githubCommit, taskData.deadline, taskData.priority, taskData.elapsedTime);
            addTaskToSidebar(doc.id, taskData.title);
        });
    };

    const addTaskToDOM = (id, title, description, status = 'not-started', date = '', githubCommit = '', deadline = '', priority = 'low', elapsedTime = 0) => {
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
        taskMeta.classList.add('task-meta');
        const taskStatus = document.createElement('span');
        taskStatus.classList.add('status', `status-${status}`);
        taskStatus.textContent = status.charAt(0).toUpperCase() + status.slice(1);
        taskStatus.addEventListener('click', () => changeTaskStatus(id, taskStatus));
        const taskDate = document.createElement('span');
        taskDate.classList.add('date');
        taskDate.textContent = date;
        const taskDeadline = document.createElement('span');
        taskDeadline.classList.add('date');
        taskDeadline.textContent = `Deadline: ${deadline}`;
        const taskPriority = document.createElement('span');
        taskPriority.classList.add('priority', `priority-${priority}`);
        taskPriority.textContent = priority.charAt(0).toUpperCase() + priority.slice(1);
        const taskElapsedTime = document.createElement('span');
        taskElapsedTime.classList.add('elapsed-time');
        taskElapsedTime.textContent = `Elapsed Time: ${elapsedTime} mins`;
        const taskGitHubCommit = document.createElement('a');
        taskGitHubCommit.classList.add('github-commit');
        taskGitHubCommit.href = githubCommit;
        taskGitHubCommit.textContent = githubCommit;
        taskMeta.appendChild(taskStatus);
        taskMeta.appendChild(taskDate);
        taskMeta.appendChild(taskDeadline);
        taskMeta.appendChild(taskPriority);
        taskMeta.appendChild(taskElapsedTime);
        taskMeta.appendChild(taskGitHubCommit);

        task.appendChild(taskContent);
        task.appendChild(taskMeta);
        taskList.appendChild(task);

        if (status === 'in-progress') {
            startElapsedTimeUpdate(id, taskElapsedTime);
        }
    };

    const addTaskToSidebar = (id, title) => {
        const taskItem = document.createElement('li');
        taskItem.textContent = title;
        taskItem.addEventListener('click', () => {
            const taskElement = document.querySelector(`.task[data-id='${id}']`);
            taskElement.scrollIntoView({ behavior: 'smooth' });
        });
        taskSidebar.appendChild(taskItem);
    };

    const changeTaskStatus = async (id, taskStatusElement) => {
        const statuses = ['not-started', 'in-progress', 'done'];
        let currentStatusIndex = statuses.indexOf(taskStatusElement.textContent.toLowerCase().replace(/\s+/g, '-'));
        currentStatusIndex = (currentStatusIndex + 1) % statuses.length;
        const newStatus = statuses[currentStatusIndex];

        await db.collection('tasks').doc(id).update({ status: newStatus });

        taskStatusElement.textContent = newStatus.charAt(0).toUpperCase() + newStatus.slice(1).replace('-', ' ');
        taskStatusElement.className = `status status-${newStatus}`;

        const taskElement = document.querySelector(`.task[data-id='${id}'] .elapsed-time`);
        if (newStatus === 'in-progress') {
            startElapsedTimeUpdate(id, taskElement);
        } else {
            stopElapsedTimeUpdate(id);
        }
    };

    const startElapsedTimeUpdate = (id, taskElapsedTimeElement) => {
        const updateInterval = setInterval(async () => {
            const taskDoc = await db.collection('tasks').doc(id).get();
            const taskData = taskDoc.data();
            const newElapsedTime = taskData.elapsedTime + 1;
            await db.collection('tasks').doc(id).update({ elapsedTime: newElapsedTime });
            taskElapsedTimeElement.textContent = `Elapsed Time: ${newElapsedTime} mins`;
        }, 60000); // 1分ごとに更新

        elapsedTimeIntervals[id] = updateInterval;
    };

    const stopElapsedTimeUpdate = (id) => {
        clearInterval(elapsedTimeIntervals[id]);
        delete elapsedTimeIntervals[id];
    };

    addTaskButton.addEventListener('click', async () => {
        const title = taskTitleInput.value;
        const description = taskDescriptionInput.value;
        const deadline = taskDeadlineInput.value;
        const priority = taskPriorityInput.value;

        if (title && description) {
            const newTask = {
                title: title,
                description: description,
                status: 'not-started',
                date: new Date().toLocaleDateString(),
                githubCommit: '',
                deadline: deadline,
                priority: priority,
                elapsedTime: 0
            };
            const docRef = await db.collection('tasks').add(newTask);

            addTaskToDOM(docRef.id, title, description, newTask.status, newTask.date, newTask.githubCommit, newTask.deadline, newTask.priority, newTask.elapsedTime);
            addTaskToSidebar(docRef.id, title);
            taskTitleInput.value = '';
            taskDescriptionInput.value = '';
            taskDeadlineInput.value = '';
            taskPriorityInput.value = 'low';
        }
    });

    loadTasks();
});


