"use strict";
(function () {
    const addTaskBtn = document.querySelector("#add-task-btn");
    const modalOverlay = document.querySelector("#modal-overlay");
    const closeModalBtn = document.querySelector("#close-modal-btn");
    const cancelBtn = document.querySelector("#cancel-btn");
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
})();
