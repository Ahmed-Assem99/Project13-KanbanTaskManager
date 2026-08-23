(function(){
    const addTaskBtn:HTMLButtonElement|null = document.querySelector("#add-task-btn")
    const modalOverlay:Element|null = document.querySelector("#modal-overlay")
    const closeModalBtn:HTMLButtonElement|null = document.querySelector("#close-modal-btn")
    const modalTitle:Element|null = document.querySelector("#modal-title")
    const taskTitle:HTMLInputElement|null= document.querySelector("#task-title")
    const titleError:Element|null = document.querySelector("#title-error")
    const taskPriority:HTMLInputElement|null=document.querySelector("#task-priority")
    const taskDueDate:HTMLInputElement|null=document.querySelector("#task-due-date")
    const dateError:Element|null = document.querySelector("#date-error")
    const taskDescription:HTMLInputElement|null=document.querySelector("#task-description")
    const descriptionError:Element|null=document.querySelector("#description-error")
    const cancelBtn:HTMLButtonElement|null = document.querySelector("#cancel-btn")
    const submitBtn:HTMLButtonElement|null = document.querySelector("#submit-btn")

    interface Task{
    title:string,
    priority?:string,
    date?:string,
    description?:string
}

    let tasks:Array<Task>;
    tasks=JSON.parse(localStorage.getItem('TaskHistory')??'[]')
 

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

submitBtn?.addEventListener("click",e=>{
    e.preventDefault(); 
    if(!taskTitle?.value){
taskTitle?.classList.replace('focus:ring-indigo-500','focus:ring-red-500')
taskTitle?.classList.replace('focus:border-indigo-500','focus:border-red-500')
taskTitle?.classList.replace('border-slate-300','border-red-500')
titleError?.classList.remove('hidden')
return
    }else if(taskDueDate?.value && new Date(taskDueDate.value) < new Date()){
taskDueDate?.classList.replace('focus:ring-indigo-500','focus:ring-red-500')
taskDueDate?.classList.replace('focus:border-indigo-500','focus:border-red-500')
taskDueDate?.classList.replace('border-slate-300','border-red-500')
dateError?.classList.remove('hidden')
return
    }
    else{
    taskTitle?.classList.replace('focus:ring-red-500','focus:ring-indigo-500')
taskTitle?.classList.replace('focus:border-red-500','focus:border-indigo-500')
taskTitle?.classList.replace('border-red-500','border-slate-300') 

taskDueDate?.classList.replace('focus:ring-red-500','focus:ring-indigo-500')
taskDueDate?.classList.replace('focus:border-red-500','focus:border-indigo-500')
taskDueDate?.classList.replace('border-red-500','border-slate-300')

    titleError?.classList.add('hidden')
    dateError?.classList.add('hidden')  
    addNewTask();
    closeModal();
    }
})

function addNewTask():void{

    let newTask:Task={
title:taskTitle!.value,
priority:taskPriority?.value,
date:taskDueDate?.value,
description:taskDescription?.value
    }
tasks.push(newTask)
console.log(tasks)
localStorage.setItem('TaskHistory',JSON.stringify(tasks))
clearForum();
}

function clearForum():void{
    taskTitle!.value='';
    taskPriority!.value='';
    taskDueDate!.value='';
    taskDescription!.value='';
}

function displayNewTask():void{
    
}


})()



