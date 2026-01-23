// --- SELECTORS ---
const todoInput = document.querySelector(".todo-input");
const todoDate = document.querySelector(".todo-date");
const prioritySelect = document.getElementById("priority-select"); // Selector Prioritas
const searchInput = document.getElementById("search-input");     // Selector Search
const todoButton = document.querySelector(".add-btn");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");
const deleteAllBtn = document.querySelector(".delete-all-btn");
const emptyMsg = document.getElementById("empty-msg");
const greetingTimeElement = document.getElementById("greeting-time");
const usernameElement = document.getElementById("username");
const progressBarFill = document.getElementById("progress-fill");
const progressText = document.getElementById("progress-text");

// --- EVENT LISTENERS ---
document.addEventListener("DOMContentLoaded", () => {
    setGreeting();
    loadName();
    checkUI();
});

todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", handleItemClick);
filterOption.addEventListener("change", filterTodo);
deleteAllBtn.addEventListener("click", deleteAll);

// Listener Search (Real-time)
searchInput.addEventListener("input", function() {
    const searchText = searchInput.value.toLowerCase();
    const items = todoList.querySelectorAll("li");

    items.forEach(item => {
        const text = item.querySelector("h3").innerText.toLowerCase();
        if (text.includes(searchText)) {
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }
    });
});

// Listener Simpan Nama User
usernameElement.addEventListener("input", () => {
    localStorage.setItem("todo_username", usernameElement.innerText);
});

// --- FUNCTIONS ---

// 1. Sapaan Waktu & Nama
function setGreeting() {
    const hour = new Date().getHours();
    let greet = "Hello";
    if (hour >= 5 && hour < 12) greet = "Selamat Pagi";
    else if (hour >= 12 && hour < 15) greet = "Selamat Siang";
    else if (hour >= 15 && hour < 18) greet = "Selamat Sore";
    else greet = "Selamat Malam";
    
    if (greetingTimeElement) greetingTimeElement.innerText = greet;
}

function loadName() {
    const savedName = localStorage.getItem("todo_username");
    if (savedName) usernameElement.innerText = savedName;
}

// 2. Add Todo (Dengan Priority & Sort)
function addTodo(event) {
    event.preventDefault();
    if (todoInput.value === "") return;

    // A. Buat Struktur Semantic Article
    const todoItem = document.createElement("article"); 
    todoItem.classList.add("todo-item");

    // B. Konten Kiri (Judul, Tanggal, Badge)
    const contentDiv = document.createElement("div");
    contentDiv.classList.add("todo-content");
    
    const taskTitle = document.createElement("h3");
    taskTitle.innerText = todoInput.value;
    
    // Wrapper untuk Tanggal dan Badge
    const metaDiv = document.createElement("div");
    metaDiv.classList.add("task-meta");

    // Badge Prioritas
    const priority = prioritySelect.value;
    const priorityBadge = document.createElement("span");
    priorityBadge.innerText = priority;
    priorityBadge.classList.add("priority-badge", `p-${priority}`);

    // Tanggal
    const taskDate = document.createElement("time");
    taskDate.innerText = todoDate.value ? todoDate.value : "No Date";
    taskDate.classList.add("task-date");

    metaDiv.appendChild(priorityBadge);
    metaDiv.appendChild(taskDate);

    contentDiv.appendChild(taskTitle);
    contentDiv.appendChild(metaDiv);
    todoItem.appendChild(contentDiv);

    // C. Tombol Aksi Kanan
    const actionDiv = document.createElement("div");
    actionDiv.classList.add("action-btn-group");

    const checkBtn = document.createElement("button");
    checkBtn.innerHTML = '&#10003;';
    checkBtn.classList.add("check-btn");
    checkBtn.setAttribute("aria-label", "Selesai");
    
    const trashBtn = document.createElement("button");
    trashBtn.innerHTML = '&#10005;';
    trashBtn.classList.add("trash-btn");
    trashBtn.setAttribute("aria-label", "Hapus");

    actionDiv.appendChild(checkBtn);
    actionDiv.appendChild(trashBtn);
    todoItem.appendChild(actionDiv);

    // D. Bungkus dengan LI
    const listItem = document.createElement("li");
    listItem.appendChild(todoItem);
    
    todoList.appendChild(listItem);
    
    // E. Reset & Sortir Otomatis
    todoInput.value = "";
    sortTodo(); // <-- TUGAS BARU LANGSUNG DIURUTKAN
    checkUI();
}

// 3. Auto Sort (High Priority di Atas)
function sortTodo() {
    const items = Array.from(todoList.children);
    const priorityWeight = { "high": 3, "medium": 2, "low": 1 };

    items.sort((a, b) => {
        // Ambil text dari badge, lalu lowercase
        const priorityA = a.querySelector(".priority-badge").innerText.toLowerCase();
        const priorityB = b.querySelector(".priority-badge").innerText.toLowerCase();
        // Bandingkan bobot
        return priorityWeight[priorityB] - priorityWeight[priorityA];
    });

    items.forEach(item => todoList.appendChild(item));
}

// 4. Handle Click (Delete & Check)
function handleItemClick(event) {
    const item = event.target;
    const todoArticle = item.closest(".todo-item"); 
    const listRow = item.closest("li");

    if (!todoArticle) return;

    if (item.classList.contains("trash-btn")) {
        todoArticle.style.opacity = "0";
        todoArticle.style.transform = "translateX(20px)";
        setTimeout(() => {
            if(listRow) listRow.remove(); 
            checkUI();
        }, 300);
    }

    if (item.classList.contains("check-btn")) {
        todoArticle.classList.toggle("completed");
        if(todoArticle.classList.contains("completed")){
            item.disabled = true;
            item.style.opacity = "0.3";
            item.style.cursor = "not-allowed";
        }
        checkUI();
        filterTodo({ target: filterOption });
    }
}

// 5. Update Progress & Confetti
function updateProgress() {
    const items = todoList.querySelectorAll(".todo-item");
    const totalTodos = items.length;
    let completedTodos = 0;

    items.forEach(todo => {
        if (todo.classList.contains("completed")) completedTodos++;
    });

    const percent = totalTodos === 0 ? 0 : Math.round((completedTodos / totalTodos) * 100);

    progressBarFill.style.width = `${percent}%`;
    progressText.innerText = `${percent}% Selesai`;
    
    // Efek Perayaan jika 100%
    if(percent === 100 && totalTodos > 0) {
        progressBarFill.style.background = "#2ecc71";
        progressBarFill.style.boxShadow = "0 0 20px #2ecc71"; // Glow hijau
        greetingTimeElement.innerText = "🏆 Luar Biasa"; // Ganti sapaan
    } else {
        progressBarFill.style.background = "linear-gradient(90deg, #4cc9f0, #4361ee)";
        progressBarFill.style.boxShadow = "none";
        setGreeting(); // Kembalikan sapaan waktu jika belum 100%
    }
}

// 6. Utility Functions
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

function deleteAll(event) {
    event.preventDefault();
    if(confirm("Yakin mau hapus semua tugas?")) {
        todoList.innerHTML = "";
        checkUI();
    }
}

function filterTodo(event) {
    const listItems = todoList.children;
    const filterValue = event.target.value;

    Array.from(listItems).forEach(function(li) {
        const article = li.querySelector(".todo-item");
        if (!article) return;
        switch (filterValue) {
            case "all":
                li.style.display = "block";
                break;
            case "completed":
                if (article.classList.contains("completed")) li.style.display = "block";
                else li.style.display = "none";
                break;
            case "uncompleted":
                if (!article.classList.contains("completed")) li.style.display = "block";
                else li.style.display = "none";
                break;
        }
    });
}