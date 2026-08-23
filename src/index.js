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
    let tasks;
    tasks = JSON.parse(localStorage.getItem('TaskHistory') ?? '[]');
    function closeModal() {
        modalOverlay?.classList.add("hidden");
        modalOverlay?.classList.remove("flex");
    }
    function openModal() {
        modalOverlay?.classList.remove("hidden");
        modalOverlay?.classList.add("flex");
    }
    addTaskBtn?.addEventListener("click", e => {
        openModal();
    });
    modalOverlay?.addEventListener("click", e => {
        if (e.target !== modalOverlay)
            return;
        closeModal();
    });
    closeModalBtn?.addEventListener("click", e => {
        closeModal();
    });
    cancelBtn?.addEventListener("click", e => {
        closeModal();
    });
    submitBtn?.addEventListener("click", e => {
        e.preventDefault();
        if (!taskTitle?.value) {
            taskTitle?.classList.replace('focus:ring-indigo-500', 'focus:ring-red-500');
            taskTitle?.classList.replace('focus:border-indigo-500', 'focus:border-red-500');
            taskTitle?.classList.replace('border-slate-300', 'border-red-500');
            titleError?.classList.remove('hidden');
            return;
        }
        else if (taskDueDate?.value && new Date(taskDueDate.value) < new Date()) {
            taskDueDate?.classList.replace('focus:ring-indigo-500', 'focus:ring-red-500');
            taskDueDate?.classList.replace('focus:border-indigo-500', 'focus:border-red-500');
            taskDueDate?.classList.replace('border-slate-300', 'border-red-500');
            dateError?.classList.remove('hidden');
            return;
        }
        else {
            taskTitle?.classList.replace('focus:ring-red-500', 'focus:ring-indigo-500');
            taskTitle?.classList.replace('focus:border-red-500', 'focus:border-indigo-500');
            taskTitle?.classList.replace('border-red-500', 'border-slate-300');
            taskDueDate?.classList.replace('focus:ring-red-500', 'focus:ring-indigo-500');
            taskDueDate?.classList.replace('focus:border-red-500', 'focus:border-indigo-500');
            taskDueDate?.classList.replace('border-red-500', 'border-slate-300');
            titleError?.classList.add('hidden');
            dateError?.classList.add('hidden');
            addNewTask();
            closeModal();
        }
    });
    function addNewTask() {
        let newTask = {
            title: taskTitle.value,
            priority: taskPriority?.value,
            date: taskDueDate?.value,
            description: taskDescription?.value
        };
        tasks.push(newTask);
        console.log(tasks);
        localStorage.setItem('TaskHistory', JSON.stringify(tasks));
        clearForum();
    }
    function clearForum() {
        taskTitle.value = '';
        taskPriority.value = '';
        taskDueDate.value = '';
        taskDescription.value = '';
    }
    function displayNewTask() {
    }
})();
