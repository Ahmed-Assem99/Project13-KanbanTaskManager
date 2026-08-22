(function(){
    const addTaskBtn:HTMLButtonElement|null = document.querySelector("#add-task-btn")
    const modalOverlay:Element|null = document.querySelector("#modal-overlay")
    const closeModalBtn:HTMLButtonElement|null = document.querySelector("#close-modal-btn")
    const cancelBtn:HTMLButtonElement|null = document.querySelector("#cancel-btn")



function closeModal():void{
modalOverlay?.classList.add("hidden")
modalOverlay?.classList.remove("flex")
}

function openModal():void{
modalOverlay?.classList.remove("hidden")
modalOverlay?.classList.add("flex")
}
    addTaskBtn?.addEventListener("click",e=>{
openModal()
    })

    modalOverlay?.addEventListener("click",e=>{
if (e.target !== modalOverlay) return;
closeModal()
    })

    closeModalBtn?.addEventListener("click",e=>{
closeModal()
    })

    cancelBtn?.addEventListener("click",e=>{
closeModal()
    })

})()