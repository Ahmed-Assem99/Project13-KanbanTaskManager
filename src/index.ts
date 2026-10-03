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
    id: number;
    title: string;
    priority?: string;
    date?: string;
    description?: string;
    createdAt?: string;
  }

  // Task IDs come from one counter so they stay unique across all columns.
  function nextId(): number {
    const id = Number(localStorage.getItem("taskIdCounter") ?? "0") + 1;
    localStorage.setItem("taskIdCounter", String(id));
    return id;
  }

  // True when the due date is today or within the next 3 days.
  function isDueSoon(date?: string): boolean {
    if (!date) return false;
    const [year, month, day] = date.split("-").map(Number);
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const due = new Date(year, month - 1, day);
    const daysLeft = Math.round((due.getTime() - start.getTime()) / 86400000);
    return daysLeft >= 0 && daysLeft <= 3;
  }

  function formatCount(count: number): string {
    return `${count} ${count === 1 ? "task" : "tasks"}`;
  }

  function formatId(id: number): string {
    return String(id).padStart(3, "0");
  }

  // Loads a column from localStorage, giving an ID to any task saved before IDs existed.
  function loadTasks(key: string): Array<Task> {
    const saved: Array<Task> = JSON.parse(localStorage.getItem(key) ?? "[]");
    let changed = false;
    saved.forEach((task) => {
      if (typeof task.id !== "number") {
        task.id = nextId();
        changed = true;
      }
    });
    if (changed) localStorage.setItem(key, JSON.stringify(saved));
    return saved;
  }

  let tasks: Array<Task> = loadTasks("TaskHistory");
  displayToDoTasks(tasks);
  let currentIndex: number | undefined = undefined;

  let inProgressTasks: Array<Task> = loadTasks("inProgressTasks");
  displayInProgressTasks(inProgressTasks);
  let currentProgressIndex: number | undefined = undefined;

  let completedTasks: Array<Task> = loadTasks("completedTasks");
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
      id: 0,
      title: taskTitle!.value,
      priority: taskPriority?.value,
      date: taskDueDate?.value,
      description: taskDescription?.value,
      createdAt: new Date().toISOString(),
    };



    const completedIndex = submitBtn?.dataset.completedIndex;

    if (completedIndex !== undefined) {
      const old = completedTasks[Number(completedIndex)];
      newTask.id = old.id;
      newTask.createdAt = old.createdAt ?? newTask.createdAt;
      completedTasks[Number(completedIndex)] = newTask;

      delete submitBtn!.dataset.completedIndex;
    }


    else if (currentIndex !== undefined) {
      newTask.id = tasks[currentIndex].id;
      newTask.createdAt = tasks[currentIndex].createdAt ?? newTask.createdAt;

      tasks[currentIndex] = newTask;

      currentIndex = undefined;
    }


    else if (currentProgressIndex !== undefined) {
      newTask.id = inProgressTasks[currentProgressIndex].id;
      newTask.createdAt =
        inProgressTasks[currentProgressIndex].createdAt ?? newTask.createdAt;

      inProgressTasks[currentProgressIndex] = newTask;

      currentProgressIndex = undefined;
    }


    else {
      newTask.id = nextId();
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
    todoCounter!.innerHTML = formatCount(tasks.length);
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
    <div class="task-card group bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all duration-200  " data-drag-status="todo" data-drag-index="${index}">
        <!-- Top Bar -->
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-slate-300"></span>
            <span class="text-[10px] font-medium text-slate-400 uppercase tracking-wider">#${formatId(task.id)}</span>
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
          
          ${
            isDueSoon(task.date)
              ? `<span class="bg-orange-100 text-orange-600 text-[10px] font-semibold px-2 py-1 rounded-full uppercase tracking-wide">Due Soon</span>`
              : ""
          }
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
    inProgressCounter!.innerHTML = formatCount(tasks.length);
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
<div class="task-card group bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all duration-200  " data-drag-status="in-progress" data-drag-index="${index}">
        <!-- Top Bar -->
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-amber-400"></span>
            <span class="text-[10px] font-medium text-slate-400 uppercase tracking-wider">#${formatId(task.id)}</span>
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
      completedCounter.innerHTML = formatCount(tasks.length);
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
     <div class="task-card group bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all duration-200  opacity-75" data-drag-status="completed" data-drag-index="${index}">
        <!-- Top Bar -->
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span class="text-[10px] font-medium text-slate-400 uppercase tracking-wider">#${formatId(task.id)}</span>
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

  //-----------Drag and Drop (mouse + touch via Pointer Events)----------//
  type Status = "todo" | "in-progress" | "completed";
  const DRAG_THRESHOLD = 6;
  const LONG_PRESS_MS = 250;

  function listFor(status: Status): Array<Task> {
    if (status === "todo") return tasks;
    if (status === "in-progress") return inProgressTasks;
    return completedTasks;
  }

  function moveTask(from: Status, index: number, to: Status): void {
    if (from === to) return;
    const task = listFor(from)[index];
    if (!task) return;
    listFor(from).splice(index, 1);
    listFor(to).push(task);
    localStorage.setItem("TaskHistory", JSON.stringify(tasks));
    localStorage.setItem("inProgressTasks", JSON.stringify(inProgressTasks));
    localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
    displayToDoTasks(tasks);
    displayInProgressTasks(inProgressTasks);
    displayCompletedTasks(completedTasks);
  }

  const columns = document.querySelectorAll<HTMLElement>(
    "#columns-container > [data-status]",
  );

  let pending: {
    card: HTMLElement;
    pointerId: number;
    pointerType: string;
    startX: number;
    startY: number;
    timer: number | undefined;
  } | null = null;
  let dragging: {
    ghost: HTMLElement;
    card: HTMLElement;
    from: Status;
    index: number;
    offsetX: number;
    offsetY: number;
    overColumn: HTMLElement | null;
  } | null = null;

  function highlightColumn(column: HTMLElement | null): void {
    columns.forEach((c) =>
      c.classList.toggle("ring-2", c === column),
    );
    columns.forEach((c) =>
      c.classList.toggle("ring-indigo-400", c === column),
    );
  }

  function startDrag(
    card: HTMLElement,
    clientX: number,
    clientY: number,
  ): void {
    const rect = card.getBoundingClientRect();
    const ghost = card.cloneNode(true) as HTMLElement;
    ghost.style.cssText = `position:fixed;z-index:100;pointer-events:none;width:${rect.width}px;left:${rect.left}px;top:${rect.top}px;opacity:.9;transform:rotate(2deg);box-shadow:0 10px 25px rgba(0,0,0,.2);`;
    document.body.appendChild(ghost);
    card.classList.add("opacity-40");
    document.body.style.userSelect = "none";
    dragging = {
      ghost,
      card,
      from: card.dataset.dragStatus as Status,
      index: Number(card.dataset.dragIndex),
      offsetX: clientX - rect.left,
      offsetY: clientY - rect.top,
      overColumn: null,
    };
  }

  function updateDrag(clientX: number, clientY: number): void {
    if (!dragging) return;
    dragging.ghost.style.left = `${clientX - dragging.offsetX}px`;
    dragging.ghost.style.top = `${clientY - dragging.offsetY}px`;
    const el = document.elementFromPoint(clientX, clientY);
    dragging.overColumn =
      (el?.closest("#columns-container > [data-status]") as HTMLElement | null) ??
      null;
    highlightColumn(dragging.overColumn);
  }

  function endDrag(drop: boolean): void {
    clearTimeout(pending?.timer);
    pending = null;
    if (!dragging) return;
    const { ghost, card, from, index, overColumn } = dragging;
    dragging = null;
    ghost.remove();
    card.classList.remove("opacity-40");
    document.body.style.userSelect = "";
    highlightColumn(null);
    if (drop && overColumn) {
      moveTask(from, index, overColumn.dataset.status as Status);
    }
  }

  document.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest("button")) return;
    const card = target.closest<HTMLElement>(".task-card");
    if (!card || !card.dataset.dragStatus) return;
    pending = {
      card,
      pointerId: e.pointerId,
      pointerType: e.pointerType,
      startX: e.clientX,
      startY: e.clientY,
      timer: undefined,
    };
    if (e.pointerType !== "mouse") {
      // Touch/pen: require a short press so normal scrolling still works.
      const { clientX, clientY } = e;
      pending.timer = window.setTimeout(() => {
        if (pending) {
          startDrag(pending.card, clientX, clientY);
          pending = null;
        }
      }, LONG_PRESS_MS);
    }
  });

  document.addEventListener("pointermove", (e) => {
    if (dragging) {
      updateDrag(e.clientX, e.clientY);
      return;
    }
    if (!pending || e.pointerId !== pending.pointerId) return;
    const moved = Math.hypot(
      e.clientX - pending.startX,
      e.clientY - pending.startY,
    );
    if (pending.pointerType === "mouse") {
      if (moved > DRAG_THRESHOLD) {
        startDrag(pending.card, e.clientX, e.clientY);
        pending = null;
        updateDrag(e.clientX, e.clientY);
      }
    } else if (moved > DRAG_THRESHOLD) {
      // Finger moved before the long press: the user is scrolling.
      clearTimeout(pending.timer);
      pending = null;
    }
  });

  document.addEventListener("pointerup", () => endDrag(true));
  document.addEventListener("pointercancel", () => endDrag(false));

  // Once a touch drag is active, stop the page from scrolling under the finger.
  document.addEventListener(
    "touchmove",
    (e) => {
      if (dragging) e.preventDefault();
    },
    { passive: false },
  );
  document.addEventListener("contextmenu", (e) => {
    if (dragging || pending) e.preventDefault();
  });
})();
