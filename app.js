// particlesJS lib
particlesJS.load('particles-js', './particles.json', function () {
    console.log('callback - particles-js config loaded');
});

// Vars
const userData = localStorage.getItem("user_data");


// DOM elements
const welcomeModal = new bootstrap.Modal(document.getElementById('welcomeModal'));
const appContent = document.getElementById("appContent");
const userNameInput = document.getElementById("userNameInput");
const saveUserNameButton = document.getElementById("saveUserNameButton");
const userAvatar = document.getElementById("userAvatar");
const userName = document.getElementById("userName");
const time = document.getElementById("time");
const taskTitleInput = document.getElementById("taskTitleInput");
const taskDescriptionInput = document.getElementById("taskDescriptionInput");
const createTaskButton = document.getElementById("createTaskButton");
const taskList = document.getElementById("taskList");
const clearAllTasksButton = document.getElementById("clearAllTasksButton");
const batteryCharge = document.getElementById("batteryCharge");
const taskNumber = document.getElementById("taskNumber");
const batteryChargeIcon = document.getElementById("batteryChargeIcon");

// Remove all tasks
function removeAllTasks() {
    // Show warning message
    Swal.fire({
        title: 'Warning',
        text: 'Remove all tasks?',
        icon: 'warning',
        confirmButtonText: 'Yes',
        cancelButtonText: "No",
        showCancelButton: true
    }).then((res) => {
        // Show success message
        if (res.isConfirmed) {
            Swal.fire({
                title: "All tasks removed!",
                text: "Your task list is empty.",
                confirmButtonText: "Okay!",
            }).then(() => {
                // Remove from UI
                taskList.innerHTML = "";
                // Clear LocalStorage
                localStorage.setItem("tasks", JSON.stringify([]));
                // Reload page
                window.location.reload();
            })
        }
    })
}

// Task EL
function createTaskElement(title, description) {
    // Container => Header/Description
    const container = document.createElement("div");
    container.classList.add("px-3")

    const taskEl = document.createElement("div");
    taskEl.classList.add("rounded-4", "shadow", "p-4", "todo", "mt-4");

    // Header => Title/Remove button
    const header = document.createElement("div");
    header.classList.add("d-flex", "justify-content-between", "align-items-center");

    // Task title
    const taskTitle = document.createElement("h4");
    taskTitle.innerHTML = title;

    // Remove task button
    const removeTaskButton = document.createElement("i");
    removeTaskButton.classList.add("bi", "bi-trash", "text-danger");

    removeTaskButton.addEventListener("click", event => {
        removeTaskFromLocalStorage(taskTitle.innerText);
        removeTask(event, title);
    })

    // Description
    const taskDescription = document.createElement("p");
    taskDescription.classList.add("mb-0");
    taskDescription.innerHTML = description;

    taskEl.append(header, taskDescription);
    header.append(taskTitle, removeTaskButton);
    container.append(taskEl);
    taskList.appendChild(container);
}

// Save task in Localstorage
function saveTaskInLocalStorage(title, description) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks.push({
        title,
        description
    });

    // Add task in localStorage
    localStorage.setItem("tasks", JSON.stringify(tasks));

    Swal.fire({
        title: "Task created!",
        text: `Task title: ${title}`,
        icon: "success",
        confirmButtonText: "Close this window"
    }).then(res => {
        if (res.isConfirmed) {
            window.location.reload();
        }
    })
}

// Remove task from localstorage
function removeTaskFromLocalStorage(taskTitle) {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    tasks.forEach(function (task, index) {
        if (taskTitle === task.title) {
            tasks.splice(index, 1);
        }
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Remove task element
function removeTask(element, title) {
    Swal.fire({
        title: "Remove task?",
        text: `Task title: ${title}`,
        icon: "question",
        confirmButtonText: "Yes",
        showCancelButton: true,
        cancelButtonText: "No"
    }).then(res => {
        if (res.isConfirmed) {
            element.target.parentElement.parentElement.parentElement.remove();

            window.location.reload();
        }
    });
}

// Check task values
function checkTaskValues(title, description) {
    if (title.trim() === "" || description.trim() === "") {
        // Show warning message
        Swal.fire({
            title: "Inputs is empty!",
            icon: "warning",
            text: "please enter task title and task description",
            confirmButtonText: "Okay!"
        });
    }
    /*Create task*/
    else {
        // Create task in UI
        createTaskElement(title, description);
        // Save in localstorage
        saveTaskInLocalStorage(title, description);
    }
}

// Get tasks
function getTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks.forEach(({ title, description }) => {
        createTaskElement(title, description);
    })
}

// EVENTS
function events() {
    // Clear all tasks
    clearAllTasksButton.addEventListener("click", () => {
        if (taskList.innerHTML !== "") {
            // Show warning message
            removeAllTasks();
        } else {
            // Show message(Task list is empty)
            Swal.fire({
                title: 'Warning',
                text: 'Task list is empty',
                icon: 'warning',
                confirmButtonText: 'Close'
            })
        }
    });

    document.addEventListener("DOMContentLoaded", () => {
        // Check localstorage value
        if (localStorage.getItem("tasks") == null) {
            localStorage.setItem("tasks", JSON.stringify([]));
        }

        // Get tasks
        getTasks();
    });

    // Create task
    createTaskButton.addEventListener("click", () => {
        checkTaskValues(taskTitleInput.value, taskDescriptionInput.value);
        taskTitleInput.value = "";
        taskDescriptionInput.value = "";
    })
}

events();

// Task number
taskNumber.innerHTML = `Tasks number: ${JSON.parse(localStorage.getItem("tasks")).length}`

// User avatar
userAvatar.innerHTML = userData.charAt(0);

// User name
userName.innerHTML = `Hello <span class="bg-success text-light shadow rounded-2 px-2 py-1">${userData}</span>`;

// batteryCharge
setInterval(() => {
    let batteryChargeStatus = navigator.getBattery().then(res => {

        batteryCharge.innerHTML = res.level * 100 + " %"

        // Status icon
        if (res.charging) {
            batteryChargeIcon.className = "bi bi-battery-charging";
        } else if (!res.charging && res.level >= .85) {
            batteryChargeIcon.className = "bi bi-battery-full";
        } else {
            batteryChargeIcon.className = "bi bi-battery-half";
        }
    });
}, 1000)