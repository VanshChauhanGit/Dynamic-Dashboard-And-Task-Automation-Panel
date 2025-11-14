# Dynamic Admin Dashboard

This project is a complete, fully responsive Admin Dashboard built from scratch using only vanilla HTML, CSS, and JavaScript. It demonstrates core front-end development principles, including DOM manipulation, API integration, local storage, and state management without relying on any frameworks.

This dashboard is built as a single-page application (SPA) where content is dynamically shown and hidden based on user navigation.

## ✨ Features

### 1. Dashboard & Layout

- **Fully Responsive Design:** Adapts seamlessly to desktop, tablet, and mobile screens.
- **Collapsible Sidebar:** A modern navigation sidebar that can be expanded or collapsed.
- **Mobile-First Navigation:** Includes a mobile-friendly hamburger menu and sidebar backdrop.
- **Clean Navbar:** A sticky top navbar holding a search bar, notification icon, and profile dropdown.
- **Statistic Cards:** Dynamic cards on the dashboard to show key metrics (e.g., Total Users, Pending Tasks).
- **CSS-Based Chart:** A simple, visually appealing bar chart built purely with HTML and CSS.

### 2. User Management (API Integration)

- **Real-Time Data:** Fetches user data from the `jsonplaceholder` API.
- **Dynamic Table:** Renders the user data in a clean, responsive table.
- **Client-Side Pagination:** Manages large datasets by splitting them into pages (5 users per page).
- **Live Search:** Instantly filters users by name, email, or company as the user types.
- **Sorting:** Sorts users alphabetically by name (A-Z or Z-A).

### 3. Task Automation Panel

- **Full CRUD Functionality:** Users can Create, Read, Update, and Delete tasks.
- **Data Persistence:** All tasks are saved to `localStorage`, so they persist between browser sessions.
- **Task Filtering:** Dynamically filter tasks based on priority (Low, Medium, High), status (To Do, In Progress, Done), or upcoming deadline.
- **Reusable Modal:** A single, reusable modal is used for both adding new tasks and editing existing ones.

### 4. Advanced JavaScript Features

- **Light/Dark Mode:** A theme toggle that switches the entire UI between light and dark modes.
- **Theme Persistence:** The user's theme preference is saved in `localStorage`.
- **Custom Toast Notifications:** A non-blocking toast notification system to provide user feedback (e.g., "Task added successfully," "Error loading users").
- **Form Validation:** Client-side validation for the task form to ensure required fields (like title and deadline) are filled out.

## 🚀 Challenges & Solutions

Building a project of this scope with vanilla JavaScript presents several interesting challenges:

### State Management

- **Challenge:** Without a library like React or Vue, managing the application's "state" (current page, user list, task list, theme, etc.) can get complicated.
- **Solution:** A single global `appState` object was created to act as the "single source of truth." All functions read from and write to this object. Functions like `renderTasks()` or `renderUsersPage()` are called whenever the state changes to update the UI.

### Reusable Components

- **Challenge:** Creating reusable components like the modal and toast notifications without a component-based framework.
- **Solution:** Utility functions (`openModal()`, `closeModal()`, `showToast()`) were written to control generic HTML elements. The task modal, for example, is populated with different data depending on whether the user is "adding" or "editing."

### Event Handling

- **Challenge:** Managing numerous event listeners, especially for dynamically created elements (like edit/delete buttons on tasks).
- **Solution:** Event delegation was used on the main task list (`taskList.addEventListener(...)`). This single listener catches clicks from all child elements, improving performance and simplifying the code.

## 🔮 Future Improvements

This project provides a strong foundation. Here are some ways it could be extended:

- **JavaScript Charting Library:** Replace the CSS-based chart with a library like `Chart.js` or `D3.js` to render dynamic, interactive charts based on real data.
- **Real Backend:** Replace `localStorage` with a backend service like Firebase or a custom `Node.js/Express` API to allow for user authentication and multi-user data storage.
- **Confirmation Modal:** Replace the native `confirm()` dialog (used for deleting tasks) with a custom, beautifully styled confirmation modal for a more professional user experience.
- **Framework Migration:** As a learning exercise, refactor the project using a modern framework like `React`, `Angular`, or `Vue` to see how they simplify state management and component creation.
