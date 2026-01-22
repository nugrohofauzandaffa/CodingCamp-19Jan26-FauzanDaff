// --- SELECTORS ---
const todoInput = document.querySelector(".todo-input");
const todoDate = document.querySelector(".todo-date");
const todoButton = document.querySelector(".add-btn");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");
const deleteAllBtn = document.querySelector(".delete-all-btn");
const emptyMsg = document.getElementById("empty-msg");
const greetingElement = document.getElementById("greeting");
const progressBarFill = document.getElementById("progress-fill");
const progressText = document.getElementById("progress-text");
const usernameElement = document.getElementById("username");
const greetingTimeElement = document.getElementById("greeting-time");

// --- EVENT LISTENERS ---
document.addEventListener("DOMContentLoaded", () => {
    setGreeting();
    loadName();
    checkUI();
});

usernameElement.addEventListener("input", function(){
    localStorage.setItem("todo_username", usernameElement.innerText);
});

// Load username from localStorage
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", handleItemClick);
filterOption.addEventListener("change", filterTodo);
deleteAllBtn.addEventListener("click", deleteAll);

// --- FUNCTIONS ---

// Fitur Sapaan Otomatis
function setGreeting() {
    const hour = new Date().getHours();
    let greet = "Hello";
    
    if (hour < 12) greet = "Selamat Pagi";
    else if (hour < 18) greet = "Selamat Siang";
    else greet = "Selamat Malam";

    const greetingTimeElement = document.getElementById("greeting-time");

    if (greetingTimeElement) {
        greetingTimeElement.innerText = greet;
    }
}

function loadName() {
    const savedName = localStorage.getItem("todo_username");

    if (savedName && savedName.trim() !== "") {
        usernameElement.innerText = savedName;
    } else {
        usernameElement.innerText = "User";
    }
}

// Update Progress Bar
function updateProgress() {
    const items = todoList.querySelectorAll(".todo-item");
    const totalTodos = items.length;
    let completedTodos = 0;

    items.forEach(todo => {
        if (todo.classList.contains("completed")) {
            completedTodos++;
        }
    });

    const percent = totalTodos === 0 ? 0 : Math.round((completedTodos / totalTodos) * 100);

    progressBarFill.style.width = `${percent}%`;
    progressText.innerText = `${percent}% Selesai`;
    
    if(percent === 100 && totalTodos > 0) {
        progressBarFill.style.background = "#2ecc71";
    } else {
        progressBarFill.style.background = "linear-gradient(90deg, #4cc9f0, #4361ee)";
    }
}

// Cek Tampilan Kosong & Update
function checkUI() {
    const taskCount = todoList.children.length;
    if (taskCount === 0) {
        emptyMsg.style.display = "block";
        todoList.style.display = "none";
    } else {
        emptyMsg.style.display = "none";
        todoList.style.display = "block";
    }
    updateProgress();
}

function addTodo(event) {
    event.preventDefault();
    if (todoInput.value === "") return;

    // --- PEMBUATAN ELEMEN SEMANTIC ---
    
    // Article (Container Card)
    const todoItem = document.createElement("article"); 
    todoItem.classList.add("todo-item");

    // Konten Teks
    const contentDiv = document.createElement("div");
    contentDiv.classList.add("todo-content");
    
    // Judul menggunakan H3
    const taskTitle = document.createElement("h3");
    taskTitle.innerText = todoInput.value;
    
    // Tanggal menggunakan Time
    const taskDate = document.createElement("time");
    if(todoDate.value) {
        taskDate.setAttribute("datetime", todoDate.value);
        taskDate.innerText = todoDate.value;
    } else {
        taskDate.innerText = "Hari ini";
    }
    taskDate.classList.add("task-date");

    contentDiv.appendChild(taskTitle);
    contentDiv.appendChild(taskDate);
    todoItem.appendChild(contentDiv);

    // Tombol Aksi
    const actionDiv = document.createElement("div");
    actionDiv.classList.add("action-btn-group");

    // Tombol Check
    const checkBtn = document.createElement("button");
    checkBtn.innerHTML = '&#10003;';
    checkBtn.classList.add("check-btn");
    checkBtn.setAttribute("aria-label", "Tandai Selesai");
    
    // Tombol Trash
    const trashBtn = document.createElement("button");
    trashBtn.innerHTML = '&#10005;';
    trashBtn.classList.add("trash-btn");
    trashBtn.setAttribute("aria-label", "Hapus Tugas");

    actionDiv.appendChild(checkBtn);
    actionDiv.appendChild(trashBtn);
    todoItem.appendChild(actionDiv);

    // Bungkus dengan LI untuk struktur List yang valid
    const listItem = document.createElement("li");
    listItem.appendChild(todoItem);
    
    todoList.appendChild(listItem);
    
    todoInput.value = "";
    checkUI();
}

function handleItemClick(event) {
    const item = event.target;
    // Cari elemen article (untuk visual/class)
    const todoArticle = item.closest(".todo-item"); 
    // Cari elemen li (untuk dihapus strukturnya)
    const listRow = item.closest("li");

    if (!todoArticle) return;

    // HAPUS TUGAS
    if (item.classList.contains("trash-btn")) {
        todoArticle.style.opacity = "0";
        todoArticle.style.transform = "translateX(20px)";
        
        // Tunggu animasi selesai baru hapus LI
        setTimeout(() => {
            if(listRow) listRow.remove(); 
            checkUI();
        }, 300);
    }

    // CEKLIS TUGAS
    if (item.classList.contains("check-btn")) {
        todoArticle.classList.toggle("completed");
        
        // Disable tombol jika sudah selesai
        if(todoArticle.classList.contains("completed")){
            item.disabled = true;
            item.style.opacity = "0.3";
            item.style.cursor = "not-allowed";
        }
        checkUI();
        filterTodo({ target: filterOption });
    }
}

function deleteAll(event) {
    event.preventDefault();
    if(confirm("Yakin mau hapus semua tugas?")) {
        todoList.innerHTML = "";
        checkUI();
    }
}

function filterTodo(event) {
    const listItems = todoList.children; // Ini adalah koleksi LI
    const filterValue = event.target.value;

    Array.from(listItems).forEach(function(li) {
        const article = li.querySelector(".todo-item");
        if (!article) return;

        switch (filterValue) {
            case "all":
                li.style.display = "block";
                break;
            case "completed":
                if (article.classList.contains("completed")) {
                    li.style.display = "block";
                } else {
                    li.style.display = "none";
                }
                break;
            case "uncompleted":
                if (!article.classList.contains("completed")) {
                    li.style.display = "block";
                } else {
                    li.style.display = "none";
                }
                break;
        }
    });
}