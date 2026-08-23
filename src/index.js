"use strict";
(function () {
    const addTaskBtn = document.querySelector("#add-task-btn");
    const modalOverlay = document.querySelector("#modal-overlay");
    const closeModalBtn = document.querySelector("#close-modal-btn");
    const modalTitle = document.querySelector("#modal-title");
    const taskTitle = document.querySelector("#task-title");
    const titleError = document.querySelector("#title-error");
    const taskPriority = document.querySelector("#task-priority");
    const taskDueDate = document.querySelector("#task-due-date");
    const dateError = document.querySelector("#date-error");
    const taskDescription = document.querySelector("#task-description");
    const descriptionError = document.querySelector("#description-error");
    const cancelBtn = document.querySelector("#cancel-btn");
    const submitBtn = document.querySelector("#submit-btn");
    const tasksToDo = document.querySelector("#tasks-todo");
    const todoCounter = document.querySelector("#todo-counter");
    let tasks;
    tasks = JSON.parse(localStorage.getItem("TaskHistory") ?? "[]");
    displayToDoTasks(tasks);
    let inProgressTasks;
    let completedTasks;
    function closeModal() {
        modalOverlay?.classList.add("hidden");
        modalOverlay?.classList.remove("flex");
    }
    function openModal() {
        modalOverlay?.classList.remove("hidden");
        modalOverlay?.classList.add("flex");
    }
    addTaskBtn?.addEventListener("click", (e) => {
        openModal();
    });
    modalOverlay?.addEventListener("click", (e) => {
        if (e.target !== modalOverlay)
            return;
        closeModal();
    });
    closeModalBtn?.addEventListener("click", (e) => {
        closeModal();
    });
    cancelBtn?.addEventListener("click", (e) => {
        closeModal();
    });
    submitBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        if (!taskTitle?.value) {
            taskTitle?.classList.replace("focus:ring-indigo-500", "focus:ring-red-500");
            taskTitle?.classList.replace("focus:border-indigo-500", "focus:border-red-500");
            taskTitle?.classList.replace("border-slate-300", "border-red-500");
            titleError?.classList.remove("hidden");
            return;
        }
        else if (taskDueDate?.value && new Date(taskDueDate.value) < new Date()) {
            taskDueDate?.classList.replace("focus:ring-indigo-500", "focus:ring-red-500");
            taskDueDate?.classList.replace("focus:border-indigo-500", "focus:border-red-500");
            taskDueDate?.classList.replace("border-slate-300", "border-red-500");
            dateError?.classList.remove("hidden");
            return;
        }
        else {
            taskTitle?.classList.replace("focus:ring-red-500", "focus:ring-indigo-500");
            taskTitle?.classList.replace("focus:border-red-500", "focus:border-indigo-500");
            taskTitle?.classList.replace("border-red-500", "border-slate-300");
            taskDueDate?.classList.replace("focus:ring-red-500", "focus:ring-indigo-500");
            taskDueDate?.classList.replace("focus:border-red-500", "focus:border-indigo-500");
            taskDueDate?.classList.replace("border-red-500", "border-slate-300");
            titleError?.classList.add("hidden");
            dateError?.classList.add("hidden");
            addNewTask();
            closeModal();
        }
    });
    function addNewTask() {
        let newTask = {
            title: taskTitle.value,
            priority: taskPriority?.value,
            date: taskDueDate?.value,
            description: taskDescription?.value,
        };
        tasks.push(newTask);
        localStorage.setItem("TaskHistory", JSON.stringify(tasks));
        clearForum();
        displayToDoTasks(tasks);
    }
    function clearForum() {
        taskTitle.value = "";
        taskPriority.value = "";
        taskDueDate.value = "";
        taskDescription.value = "";
    }
    function displayToDoTasks(tasks) {
        todoCounter.innerHTML = `${tasks.length} tasks`;
        tasksToDo.innerHTML = "";
        tasks.forEach((task, index) => {
            tasksToDo.innerHTML += `
    <div class="group bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all duration-200  " data-task-id="task-1787482776610-2hw9mld">
        <!-- Top Bar -->
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-slate-300"></span>
            <span class="text-[10px] font-medium text-slate-400 uppercase tracking-wider">#${String(index + 1).padStart(3, "0")}</span>
          </div>
          <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button class="edit-btn text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 w-7 h-7 rounded-lg flex items-center justify-center transition-colors" data-task-id="task-1787482776610-2hw9mld" title="Edit task">
              <i class="fa-solid fa-pen text-xs pointer-events-none"></i>
            </button>
            <button class="delete-btn text-slate-400 hover:text-red-500 hover:bg-red-50 w-7 h-7 rounded-lg flex items-center justify-center transition-colors" data-task-id="task-1787482776610-2hw9mld" title="Delete task">
              <i class="fa-solid fa-trash-can text-xs pointer-events-none"></i>
            </button>
          </div>
        </div>
        <!-- Title -->
        <h3 class="font-semibold text-slate-800 mb-2 leading-snug ">
          ${task.title}
        </h3>

        <!-- Description -->
        
          <p class="text-slate-500 text-sm mb-4 leading-relaxed line-clamp-2">
            ${task.description}
          </p>
        

        <!-- Tags Row -->
        <div class="flex flex-wrap items-center gap-2 mb-4">
          <!-- Priority Badge -->
          <span class="bg-amber-50 text-amber-600 text-[10px] font-semibold px-2 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-wide">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            ${task.priority}
          </span>
          
          
            <span class="bg-orange-100 text-orange-600 text-[10px] font-semibold px-2 py-1 rounded-full uppercase tracking-wide">
              Due Soon
            </span>
          
        </div>
        <!-- Meta Info -->
        <div class="flex items-center gap-3 text-xs text-slate-400 pb-3 mb-3 border-b border-slate-100">
          
            <div class="flex items-center gap-1.5 text-orange-500">
              <i class="fa-regular fa-calendar"></i>
              <span>${task.date ? new Date(task.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}</span>
            </div>
          
          <div class="flex items-center gap-1.5" title="Created 8/23/2026, 1:59:36 PM">
            <i class="fa-regular fa-clock"></i>
            <span>Just now</span>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex flex-wrap gap-2">
          
        <button class="status-btn text-[11px] px-3 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-1.5 hover:scale-105 active:scale-95 bg-amber-100 text-amber-700 hover:bg-amber-200" data-task-id="task-1787482776610-2hw9mld" data-status="in-progress">
          <i class="fa-solid fa-play pointer-events-none"></i> <span class="pointer-events-none">Start</span>
        </button>
      
        <button class="status-btn text-[11px] px-3 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-1.5 hover:scale-105 active:scale-95 bg-emerald-100 text-emerald-700 hover:bg-emerald-200" data-task-id="task-1787482776610-2hw9mld" data-status="completed">
          <i class="fa-solid fa-check pointer-events-none"></i> <span class="pointer-events-none">Complete</span>
        </button>
      
        </div>
      </div>`;
        });
    }
})();
