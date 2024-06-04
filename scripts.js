let currentProject = null;

// ログイン処理
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            document.getElementById('auth').style.display = 'none';
            document.getElementById('task-manager').style.display = 'flex';
            loadProjects();
        })
        .catch(error => {
            console.error("Error logging in: ", error);
        });
}

// サインアップ処理
function signup() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
            document.getElementById('auth').style.display = 'none';
            document.getElementById('task-manager').style.display = 'flex';
            loadProjects();
        })
        .catch(error => {
            console.error("Error signing up: ", error);
        });
}

// プロジェクトの読み込み
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

// プロジェクトの追加
function addProject() {
    const newProject = document.getElementById('new-project').value;
    db.ref('projects').push({
        name: newProject
    }).then(() => {
        loadProjects();
    });
}

// プロジェクトの選択
function selectProject(projectId) {
    currentProject = projectId;
    document.getElementById('project-title').textContent = 'プロジェクト: ' + projectId;
    loadTasks();
}

// タスクの読み込み
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

// タスクの追加
function addTask() {
    const newTask = document.getElementById('new-task').value;
    db.ref(`projects/${currentProject}/tasks`).push({
        task: newTask,
        status: 'Not Started'
    }).then(() => {
        loadTasks();
    });
}

// タスクのステータス変更
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

