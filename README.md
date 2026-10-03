# Kanban Task Manager

A simple Kanban board for organizing tasks across **To Do**, **In Progress** and **Completed** columns. Tasks are saved in your browser, so they are still there after a refresh.

**Live demo:** https://project13-kanban-task-manager.vercel.app/

## Features

- **Three-column board** – To Do, In Progress and Completed, each with a live task counter.
- **Move tasks** – use the action buttons or drag and drop a card to another column (mouse and touch).
- **Priority levels** – Low, Medium or High for every task.
- **Due dates** – optional due date shown on the card.
- **Descriptions** – optional description of up to 500 characters, with a character counter.
- **Form validation** – the title is required and the due date cannot be in the past; errors are shown inline.
- **Edit and delete** – update or remove tasks in any column.
- **Persistence** – tasks are stored in `localStorage` and reloaded on startup.
- **Responsive layout** – columns stack on small screens.

## Tech Stack

- TypeScript (compiled to `src/index.js`)
- HTML5
- [Tailwind CSS](https://tailwindcss.com/) v4
- [Font Awesome](https://fontawesome.com/) icons
- Deployed on [Vercel](https://vercel.com/)

## Running Locally

Prerequisites: [Node.js](https://nodejs.org/) and npm.

```bash
# 1. Clone the repository
git clone https://github.com/Ahmed-Assem99/Project13-KanbanTaskManager.git
cd Project13-KanbanTaskManager

# 2. Install dependencies
npm install

# 3. Build the CSS (re-run on changes with --watch)
npx @tailwindcss/cli -i ./src/input.css -o ./src/output.css --watch

# 4. If you edit src/index.ts, recompile it to src/index.js
npx tsc src/index.ts --target es2020 --removeComments

# 5. Serve the project root with any static server, e.g.
npx serve .
```

Then open the URL printed in the terminal.
