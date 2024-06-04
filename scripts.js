document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('google-login-btn').addEventListener('click', googleLogin);
});

let currentProject = null;

function googleLogin() {
    auth.signInWithPopup(provider)
        .then(result => {
            document.getElementById('auth').style.display = 'none';
            document.getElementById('task-manager').style.display = 'flex';
            loadProjects();
        })
        .catch(error => {
            console.error("Error logging in with Google: ", error);
            alert(error.message);
        });
}

function loadProjects() {
    const projectList = document.getElementById('project-list');
    projectList.innerHTML = '';
    db.ref('projects').once('value', snapshot => {
        snapshot.forEach(childSnapshot => {
            const li = document.createElement('li');
            li.textContent = childSnapshot.val().name;
            li.onclick = () => selectProject(childSnapshot.key);
            projectList.appendChild(li);
        });
    });
}

function addProject() {
    const newProject = document.getElementById('new-project').value;
    db.ref('projects').push({
        name: newProject
    }).then(() => {
        loadProjects();
    });
}

function selectProject(projectId) {
    currentProject = projectId;
    document.getElementById('project-title').textContent = 'プロジェクト: ' + projectId;
    loadTasks();
}

function loadTasks() {
    const notStartedTasks = document.getElementById('not-started-tasks');
    const inProgressTasks = document.getElementById('in-progress-tasks');
    const completedTasks = document.getElementById('completed-tasks');
    notStartedTasks.innerHTML = '';
    inProgressTasks.innerHTML = '';
    completedTasks.innerHTML = '';
    db.ref(`projects/${currentProject}/tasks`).once('value', snapshot => {
        snapshot.forEach(childSnapshot => {
            const li = document.createElement('li');
            li.textContent = childSnapshot.val().task;
            const status = childSnapshot.val().status;
            li.onclick = () => changeStatus(childSnapshot.key, status);
            if (status === 'Not Started') {
                notStartedTasks.appendChild(li);
            } else if (status === 'In Progress') {
                inProgressTasks.appendChild(li);
            } else if (status === 'Completed') {
                completedTasks.appendChild(li);
            }
        });
    });
}

function addTask() {
    const newTask = document.getElementById('new-task').value;
    db.ref(`projects/${currentProject}/tasks`).push({
        task: newTask,
        status: 'Not Started'
    }).then(() => {
        loadTasks();
    });
}

function changeStatus(taskId, currentStatus) {
    let newStatus;
    if (currentStatus === 'Not Started') {
        newStatus = 'In Progress';
    } else if (currentStatus === 'In Progress') {
        newStatus = 'Completed';
    } else {
        newStatus = 'Not Started';
    }
    db.ref(`projects/${currentProject}/tasks/${taskId}`).update({
        status: newStatus
    }).then(() => {
        loadTasks();
    });
}

