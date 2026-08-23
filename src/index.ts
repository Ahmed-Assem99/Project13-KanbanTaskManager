(function () {
  const addTaskBtn: HTMLButtonElement | null =
    document.querySelector("#add-task-btn");
  const modalOverlay: Element | null = document.querySelector("#modal-overlay");
  const closeModalBtn: HTMLButtonElement | null =
    document.querySelector("#close-modal-btn");
  const modalTitle: Element | null = document.querySelector("#modal-title");
  const taskTitle: HTMLInputElement | null =
    document.querySelector("#task-title");
  const titleError: Element | null = document.querySelector("#title-error");
  const taskPriority: HTMLInputElement | null =
    document.querySelector("#task-priority");
  const taskDueDate: HTMLInputElement | null =
    document.querySelector("#task-due-date");
  const dateError: Element | null = document.querySelector("#date-error");
  const taskDescription: HTMLInputElement | null =
    document.querySelector("#task-description");
  const descriptionError: Element | null =
    document.querySelector("#description-error");
  const cancelBtn: HTMLButtonElement | null =
    document.querySelector("#cancel-btn");
  const submitBtn: HTMLButtonElement | null =
    document.querySelector("#submit-btn");
  const tasksToDo: HTMLDivElement | null =
    document.querySelector("#tasks-todo");
  const todoCounter = document.querySelector("#todo-counter");
  const tasksInProgress: HTMLDivElement | null =
    document.querySelector("#tasks-in-progress");
  const inProgressCounter = document.querySelector("#inprogress-counter");

  interface Task {
    title: string;
    priority?: string;
    date?: string;
    description?: string;
    createdAt?: string;
  }

  let tasks: Array<Task> = JSON.parse(
    localStorage.getItem("TaskHistory") ?? "[]",
  );
  displayToDoTasks(tasks);
  let currentIndex: number | undefined = undefined;

  let inProgressTasks: Array<Task> = JSON.parse(
    localStorage.getItem("inProgressTasks") ?? "[]",
  );
  displayInProgressTasks(inProgressTasks);
  let currentProgressIndex: number | undefined = undefined;

  let completedTasks: Array<Task> = JSON.parse(
    localStorage.getItem("completedTasks") ?? "[]",
  );
  displayCompletedTasks(completedTasks);
  //-------Modal Overlay Features------///
  function closeModal(): void {
    modalOverlay?.classList.add("hidden");
    modalOverlay?.classList.remove("flex");
  }

  function openModal(): void {
    modalOverlay?.classList.remove("hidden");
    modalOverlay?.classList.add("flex");
  }
  addTaskBtn?.addEventListener("click", (e) => {
    openModal();
  });

  modalOverlay?.addEventListener("click", (e) => {
    if (e.target !== modalOverlay) return;
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
      taskTitle?.classList.replace(
        "focus:ring-indigo-500",
        "focus:ring-red-500",
      );
      taskTitle?.classList.replace(
        "focus:border-indigo-500",
        "focus:border-red-500",
      );
      taskTitle?.classList.replace("border-slate-300", "border-red-500");
      titleError?.classList.remove("hidden");
      return;
    } else if (taskDueDate?.value && new Date(taskDueDate.value) < new Date()) {
      taskDueDate?.classList.replace(
        "focus:ring-indigo-500",
        "focus:ring-red-500",
      );
      taskDueDate?.classList.replace(
        "focus:border-indigo-500",
        "focus:border-red-500",
      );
      taskDueDate?.classList.replace("border-slate-300", "border-red-500");
      dateError?.classList.remove("hidden");
      return;
    } else {
      taskTitle?.classList.replace(
        "focus:ring-red-500",
        "focus:ring-indigo-500",
      );
      taskTitle?.classList.replace(
        "focus:border-red-500",
        "focus:border-indigo-500",
      );
      taskTitle?.classList.replace("border-red-500", "border-slate-300");

      taskDueDate?.classList.replace(
        "focus:ring-red-500",
        "focus:ring-indigo-500",
      );
      taskDueDate?.classList.replace(
        "focus:border-red-500",
        "focus:border-indigo-500",
      );
      taskDueDate?.classList.replace("border-red-500", "border-slate-300");

      titleError?.classList.add("hidden");
      dateError?.classList.add("hidden");
      addNewTask();
      closeModal();
    }
  });
  //-------------Todo Tasks Features---------------//
  function addNewTask(): void {
    const newTask: Task = {
      title: taskTitle!.value,
      priority: taskPriority?.value,
      date: taskDueDate?.value,
      description: taskDescription?.value,
      createdAt: new Date().toISOString(),
    };



    const completedIndex = submitBtn?.dataset.completedIndex;

    if (completedIndex !== undefined) {
      completedTasks[Number(completedIndex)] = newTask;

      delete submitBtn!.dataset.completedIndex;
    }


    else if (currentIndex !== undefined) {
      newTask.createdAt = tasks[currentIndex].createdAt ?? newTask.createdAt;

      tasks[currentIndex] = newTask;

      currentIndex = undefined;
    }


    else if (currentProgressIndex !== undefined) {
      newTask.createdAt =
        inProgressTasks[currentProgressIndex].createdAt ?? newTask.createdAt;

      inProgressTasks[currentProgressIndex] = newTask;

      currentProgressIndex = undefined;
    }


    else {
      tasks.push(newTask);
    }



    localStorage.setItem("TaskHistory", JSON.stringify(tasks));

    localStorage.setItem("inProgressTasks", JSON.stringify(inProgressTasks));

    localStorage.setItem("completedTasks", JSON.stringify(completedTasks));



    clearForum();

    displayToDoTasks(tasks);

    displayInProgressTasks(inProgressTasks);

    displayCompletedTasks(completedTasks);
  }

  function clearForum(): void {
    taskTitle!.value = "";
    taskPriority!.value = "";
    taskDueDate!.value = "";
    taskDescription!.value = "";

    delete submitBtn?.dataset.completedIndex;
  }

  function displayToDoTasks(tasks: Array<Task>): void {
    todoCounter!.innerHTML = `${tasks.length} tasks`;
    tasksToDo!.innerHTML = "";
    if (tasks.length === 0) {
      tasksToDo!.innerHTML = `         <div
                  class="flex flex-col items-center justify-center py-12 text-slate-400"
                >
                  <i
                    class="fa-regular fa-folder-open text-4xl mb-3 opacity-50"
                  ></i>
                  <p class="text-sm">No tasks yet</p>
                  <p class="text-xs mt-1">Click + to add one</p>
                </div>
      `;
    } else {
      tasks.forEach((task, index) => {
        tasksToDo!.innerHTML += `
    <div class="group bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all duration-200  " data-task-id="task-1787482776610-2hw9mld">
        <!-- Top Bar -->
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-slate-300"></span>
            <span class="text-[10px] font-medium text-slate-400 uppercase tracking-wider">#${String(index + 1).padStart(3, "0")}</span>
          </div>
          <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button class="edit-btn text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 w-7 h-7 rounded-lg flex items-center justify-center transition-colors" data-index="${index}" title="Edit task">
              <i class="fa-solid fa-pen text-xs pointer-events-none"></i>
            </button>
            <button class="delete-btn text-slate-400 hover:text-red-500 hover:bg-red-50 w-7 h-7 rounded-lg flex items-center justify-center transition-colors" data-index="${index}" title="Delete task">
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
            <span>   ${
              task.createdAt
                ? new Date(task.createdAt).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })
                : "Unknown"
            }</span>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex flex-wrap gap-2">
          
        <button class="progress-status-btn text-[11px] px-3 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-1.5 hover:scale-105 active:scale-95 bg-amber-100 text-amber-700 hover:bg-amber-200" data-index="${index}" data-status="in-progress">
          <i class="fa-solid fa-play pointer-events-none"></i> <span class="pointer-events-none">Start</span>
        </button>
      
        <button class="completed-status-btn text-[11px] px-3 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-1.5 hover:scale-105 active:scale-95 bg-emerald-100 text-emerald-700 hover:bg-emerald-200" data-index="${index}" data-status="completed">
          <i class="fa-solid fa-check pointer-events-none"></i> <span class="pointer-events-none">Complete</span>
        </button>
      
        </div>
      </div>`;
      });
    }
  }

  function editTask(index: number): void {
    currentIndex = index;
    taskTitle!.value = tasks[index].title;
    taskPriority!.value = tasks[index].priority ? tasks[index].priority : "";
    taskDueDate!.value = tasks[index].date ? tasks[index].date : "";
    taskDescription!.value = tasks[index].description
      ? tasks[index].description
      : "";
    openModal();
  }
  function deleteTask(index: number): void {
    tasks.splice(index, 1);
    localStorage.setItem("TaskHistory", JSON.stringify(tasks));
    displayToDoTasks(tasks);
  }

  tasksToDo?.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;

    const editButton = target.closest(".edit-btn") as HTMLButtonElement | null;
    const deleteButton = target.closest(
      ".delete-btn",
    ) as HTMLButtonElement | null;
    const inProgressButton = target.closest(
      ".progress-status-btn",
    ) as HTMLButtonElement | null;
    const completedButton = target.closest(
      ".completed-status-btn",
    ) as HTMLButtonElement | null;

    if (editButton) {
      const editIndex = Number(editButton.dataset.index);
      editTask(editIndex);
      return;
    }

    if (deleteButton) {
      const deleteIndex = Number(deleteButton.dataset.index);
      deleteTask(deleteIndex);
      return;
    }

    if (inProgressButton) {
      const inProgressIndex = Number(inProgressButton.dataset.index);
      inProgressTasks.push(tasks[inProgressIndex]);
      localStorage.setItem("inProgressTasks", JSON.stringify(inProgressTasks));
      displayInProgressTasks(inProgressTasks);
      deleteTask(inProgressIndex);
      return;
    }

    if (completedButton) {
      const completedIndex = Number(completedButton.dataset.index);

      moveTodoToCompleted(completedIndex);

      return;
    }
  });

  //-----------In Progress Tasks----------//

  function displayInProgressTasks(tasks: Array<Task>): void {
    tasksInProgress!.innerHTML = "";
    inProgressCounter!.innerHTML = `${tasks.length} tasks`;
    if (tasks.length === 0) {
      tasksInProgress!.innerHTML = `         <div
                  class="flex flex-col items-center justify-center py-12 text-slate-400"
                >
                  <i
                    class="fa-regular fa-folder-open text-4xl mb-3 opacity-50"
                  ></i>
                  <p class="text-sm">No tasks yet</p>
                  <p class="text-xs mt-1">Click + to add one</p>
                </div>
      `;
    } else {
      tasks.forEach((task, index) => {
        tasksInProgress!.innerHTML += `
<div class="group bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all duration-200  " data-task-id="task-1787493091072-kkva6e3">
        <!-- Top Bar -->
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-amber-400"></span>
            <span class="text-[10px] font-medium text-slate-400 uppercase tracking-wider">#002</span>
          </div>
          <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button class="edit-btn text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 w-7 h-7 rounded-lg flex items-center justify-center transition-colors" data-index="${index}" title="Edit task">
              <i class="fa-solid fa-pen text-xs pointer-events-none"></i>
            </button>
            <button class="delete-btn text-slate-400 hover:text-red-500 hover:bg-red-50 w-7 h-7 rounded-lg flex items-center justify-center transition-colors" data-index="${index}" title="Delete task">
              <i class="fa-solid fa-trash-can text-xs pointer-events-none"></i>
            </button>
          </div>
        </div>

        <!-- Title -->
        <h3 class="font-semibold text-slate-800 mb-2 leading-snug ">
          ${task.title}
        </h3>

        <!-- Description -->
        

        <!-- Tags Row -->
        <div class="flex flex-wrap items-center gap-2 mb-4">
          <!-- Priority Badge -->
          <span class="bg-amber-50 text-amber-600 text-[10px] font-semibold px-2 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-wide">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            ${task.priority}
          </span>
          
          
        </div>

        <!-- Meta Info -->
        <div class="flex items-center gap-3 text-xs text-slate-400 pb-3 mb-3 border-b border-slate-100">
          
          <div class="flex items-center gap-1.5" title="Created 8/23/2026, 4:51:31 PM">
            <i class="fa-regular fa-clock"></i>
            <span> ${
              task.createdAt
                ? new Date(task.createdAt).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })
                : "Unknown"
            }</span>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex flex-wrap gap-2">
          
        <button class="status-btn text-[11px] px-3 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-1.5 hover:scale-105 active:scale-95 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-700" data-index="${index}" data-status="todo">
          <i class="fa-solid fa-arrow-rotate-left pointer-events-none"></i> <span class="pointer-events-none">To Do</span>
        </button>
      
        <button class="status-btn text-[11px] px-3 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-1.5 hover:scale-105 active:scale-95 bg-emerald-100 text-emerald-700 hover:bg-emerald-200" data-index="${index}" data-status="completed">
          <i class="fa-solid fa-check pointer-events-none"></i> <span class="pointer-events-none">Complete</span>
        </button>
      
        </div>
      </div>
`;
      });
    }
  }

  function editProgressTask(index: number): void {
    currentProgressIndex = index;
    taskTitle!.value = inProgressTasks[index].title;
    taskPriority!.value = inProgressTasks[index].priority
      ? inProgressTasks[index].priority
      : "";
    taskDueDate!.value = inProgressTasks[index].date
      ? inProgressTasks[index].date
      : "";
    taskDescription!.value = inProgressTasks[index].description
      ? inProgressTasks[index].description
      : "";
    openModal();
  }
  function deleteProgressTask(index: number): void {
    inProgressTasks.splice(index, 1);
    localStorage.setItem("inProgressTasks", JSON.stringify(inProgressTasks));
    displayInProgressTasks(inProgressTasks);
  }

  tasksInProgress?.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;

    const editButton = target.closest(".edit-btn") as HTMLButtonElement | null;

    const deleteButton = target.closest(
      ".delete-btn",
    ) as HTMLButtonElement | null;

    const inProgressButton = target.closest(
      ".status-btn[data-status='todo']",
    ) as HTMLButtonElement | null;

    const completedButton = target.closest(
      ".status-btn[data-status='completed']",
    ) as HTMLButtonElement | null;

    // EDIT
    if (editButton) {
      const editIndex = Number(editButton.dataset.index);

      editProgressTask(editIndex);

      return;
    }

    // DELETE
    if (deleteButton) {
      const deleteIndex = Number(deleteButton.dataset.index);

      deleteProgressTask(deleteIndex);

      return;
    }

    // MOVE BACK TO TODO
    if (inProgressButton) {
      const todoIndex = Number(inProgressButton.dataset.index);

      tasks.push(inProgressTasks[todoIndex]);

      inProgressTasks.splice(todoIndex, 1);

      localStorage.setItem("TaskHistory", JSON.stringify(tasks));

      localStorage.setItem("inProgressTasks", JSON.stringify(inProgressTasks));

      displayToDoTasks(tasks);
      displayInProgressTasks(inProgressTasks);

      return;
    }

    // MOVE TO COMPLETED
    if (completedButton) {
      const completedIndex = Number(completedButton.dataset.index);

      moveToCompleted(completedIndex);

      return;
    }
  });

  //-----------Completed Tasks----------//
  const tasksCompleted =
    document.querySelector<HTMLDivElement>("#tasks-completed");

  tasksCompleted?.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;



    const editButton = target.closest(
      ".edit-completed-btn",
    ) as HTMLButtonElement | null;

    if (editButton) {
      const index = Number(editButton.dataset.index);

      const task = completedTasks[index];

      if (!task) return;

      taskTitle!.value = task.title;
      taskPriority!.value = task.priority ?? "";
      taskDueDate!.value = task.date ?? "";
      taskDescription!.value = task.description ?? "";


      submitBtn!.dataset.completedIndex = String(index);


      currentIndex = undefined;
      currentProgressIndex = undefined;

      openModal();

      return;
    }



    const deleteButton = target.closest(
      ".delete-completed-btn",
    ) as HTMLButtonElement | null;

    if (deleteButton) {
      const index = Number(deleteButton.dataset.index);

      if (Number.isNaN(index)) return;

      completedTasks.splice(index, 1);

      localStorage.setItem("completedTasks", JSON.stringify(completedTasks));

      displayCompletedTasks(completedTasks);

      return;
    }



    const todoButton = target.closest(
      '.status-btn[data-status="todo"]',
    ) as HTMLButtonElement | null;

    if (todoButton) {
      const index = Number(todoButton.dataset.index);

      const task = completedTasks[index];

      if (!task) return;

      tasks.push(task);

      completedTasks.splice(index, 1);

      localStorage.setItem("TaskHistory", JSON.stringify(tasks));

      localStorage.setItem("completedTasks", JSON.stringify(completedTasks));

      displayToDoTasks(tasks);
      displayCompletedTasks(completedTasks);

      return;
    }



    const progressButton = target.closest(
      '.status-btn[data-status="in-progress"]',
    ) as HTMLButtonElement | null;

    if (progressButton) {
      const index = Number(progressButton.dataset.index);

      const task = completedTasks[index];

      if (!task) return;

      inProgressTasks.push(task);

      completedTasks.splice(index, 1);

      localStorage.setItem("inProgressTasks", JSON.stringify(inProgressTasks));

      localStorage.setItem("completedTasks", JSON.stringify(completedTasks));

      displayInProgressTasks(inProgressTasks);
      displayCompletedTasks(completedTasks);

      return;
    }
  });

  function displayCompletedTasks(tasks: Array<Task>): void {
    const tasksCompleted =
      document.querySelector<HTMLDivElement>("#tasks-completed");

    const completedCounter = document.querySelector("#completed-counter");

    if (!tasksCompleted) return;

    if (completedCounter) {
      completedCounter.innerHTML = `${tasks.length} tasks`;
    }

    tasksCompleted.innerHTML = "";

    if (tasks.length === 0) {
      tasksCompleted.innerHTML = `
      <div class="flex flex-col items-center justify-center py-12 text-slate-400">
        <i class="fa-regular fa-folder-open text-4xl mb-3 opacity-50"></i>
        <p class="text-sm">No tasks yet</p>
        <p class="text-xs mt-1">Complete a task to see it here</p>
      </div>
    `;
      return;
    }

    tasks.forEach((task, index) => {
      tasksCompleted.innerHTML += `
     <div class="group bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all duration-200  opacity-75" data-task-id="task-1787493091072-kkva6e3">
        <!-- Top Bar -->
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span class="text-[10px] font-medium text-slate-400 uppercase tracking-wider">#002</span>
          </div>
          <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
  <button
  type="button"
  class="edit-completed-btn text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
  data-index="${index}"
  title="Edit task"
>
  <i class="fa-solid fa-pen text-xs pointer-events-none"></i>
</button>

<button
  type="button"
  class="delete-completed-btn text-slate-400 hover:text-red-500 hover:bg-red-50 w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
  data-index="${index}"
  title="Delete task"
>
  <i class="fa-solid fa-trash-can text-xs pointer-events-none"></i>
</button>
          </div>
        </div>

        <!-- Title -->
        <h3 class="font-semibold text-slate-800 mb-2 leading-snug line-through text-slate-500">
          ${task.title}
        </h3>

        <!-- Description -->
        

        <!-- Tags Row -->
        <div class="flex flex-wrap items-center gap-2 mb-4">
          <!-- Priority Badge -->
          <span class="bg-amber-50 text-amber-600 text-[10px] font-semibold px-2 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-wide">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            ${task.priority}
          </span>
          
          
          
          
          
          
            <span class="bg-emerald-100 text-emerald-600 text-[10px] font-semibold px-2 py-1 rounded-full uppercase tracking-wide flex items-center gap-1">
              <i class="fa-solid fa-check"></i>
              Done
            </span>
          
        </div>

        <!-- Meta Info -->
        <div class="flex items-center gap-3 text-xs text-slate-400 pb-3 mb-3 border-b border-slate-100">
          
          <div class="flex items-center gap-1.5" title="Created 8/23/2026, 4:51:31 PM">
            <i class="fa-regular fa-clock"></i>
            <span> ${
              task.createdAt
                ? new Date(task.createdAt).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })
                : "Unknown"
            }</span>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex flex-wrap gap-2">
          
        <button class="status-btn text-[11px] px-3 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-1.5 hover:scale-105 active:scale-95 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-700" data-index="${index}" data-status="todo">
          <i class="fa-solid fa-arrow-rotate-left pointer-events-none"></i> <span class="pointer-events-none">To Do</span>
        </button>
      
        <button class="status-btn text-[11px] px-3 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-1.5 hover:scale-105 active:scale-95 bg-amber-100 text-amber-700 hover:bg-amber-200" data-index="${index}" data-status="in-progress">
          <i class="fa-solid fa-play pointer-events-none"></i> <span class="pointer-events-none">Start</span>
        </button>
      
        </div>
      </div>
    `;
    });
  }
  function moveTodoToCompleted(index: number): void {
    const task = tasks[index];

    if (!task) return;


    completedTasks.push(task);


    tasks.splice(index, 1);


    localStorage.setItem("TaskHistory", JSON.stringify(tasks));

    localStorage.setItem("completedTasks", JSON.stringify(completedTasks));


    displayToDoTasks(tasks);
    displayCompletedTasks(completedTasks);
  }
  function moveToCompleted(index: number): void {
    const completedTask = inProgressTasks[index];

    if (!completedTask) return;


    completedTasks.push(completedTask);


    inProgressTasks.splice(index, 1);


    localStorage.setItem("completedTasks", JSON.stringify(completedTasks));

    localStorage.setItem("inProgressTasks", JSON.stringify(inProgressTasks));


    displayCompletedTasks(completedTasks);
    displayInProgressTasks(inProgressTasks);
  }
})();
