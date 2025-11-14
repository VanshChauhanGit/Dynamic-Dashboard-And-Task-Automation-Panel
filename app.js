document.addEventListener("DOMContentLoaded", () => {
  const appState = {
    theme: "light",
    users: [],
    filteredUsers: [],
    usersCurrentPage: 1,
    usersPerPage: 5,
    tasks: [],
    filteredTasks: [],
    editingTaskId: null,
  };

  //  Selectors
  const body = document.body;
  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebar-toggle");
  const dashboardContainer = document.getElementById("dashboard-container");
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
  const sidebarBackdrop = document.getElementById("sidebar-backdrop");
  const navLinks = document.querySelectorAll(".nav-link");
  const pageSections = document.querySelectorAll(".page-section");
  const themeToggle = document.getElementById("theme-toggle");
  const iconSun = document.querySelector(".icon-sun");
  const iconMoon = document.querySelector(".icon-moon");
  const profileButton = document.getElementById("profile-button");
  const profileDropdownMenu = document.getElementById("profile-dropdown-menu");

  // Modals
  const taskModal = document.getElementById("task-modal");
  const modalBackdrop = document.getElementById("modal-backdrop");
  const modalDismissButtons = document.querySelectorAll(
    '[data-dismiss="modal"]'
  );
  const addTaskBtn = document.getElementById("add-task-btn");
  const taskForm = document.getElementById("task-form");
  const modalTitle = document.getElementById("modal-title");

  // Toasts
  const toastContainer = document.getElementById("toast-container");

  // Page: Users
  const usersTableBody = document.querySelector("#users-table tbody");
  const usersTableState = document.getElementById("users-table-state");
  const apiSearchInput = document.getElementById("api-search-input");
  const userSortSelect = document.getElementById("user-sort-select");
  const paginationControls = document.getElementById("pagination-controls");
  const paginationInfo = document.getElementById("pagination-info");
  const paginationButtons = document.getElementById("pagination-buttons");

  // Page: Tasks
  const taskList = document.getElementById("task-list");
  const filterPriority = document.getElementById("filter-priority");
  const filterStatus = document.getElementById("filter-status");
  const filterDeadline = document.getElementById("filter-deadline");

  // Page: Dashboard
  const statTotalUsers = document.getElementById("stat-total-users");
  const statPendingTasks = document.getElementById("stat-pending-tasks");

  // --- Functions (Toast & Modal) ---

  function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("active");
      modalBackdrop.classList.add("active");
    }
  }

  function closeModal() {
    const activeModal = document.querySelector(".modal.active");
    if (activeModal) {
      activeModal.classList.remove("active");
    }
    modalBackdrop.classList.remove("active");
  }

  // --- Part D: Light/Dark Mode ---

  function applyTheme() {
    body.className = `theme-${appState.theme}`;
    iconSun.style.display = appState.theme === "light" ? "block" : "none";
    iconMoon.style.display = appState.theme === "dark" ? "block" : "none";
    localStorage.setItem("dashboard-theme", appState.theme);
  }

  function toggleTheme() {
    appState.theme = appState.theme === "light" ? "dark" : "light";
    applyTheme();
  }

  function initTheme() {
    const savedTheme = localStorage.getItem("dashboard-theme");
    if (savedTheme) {
      appState.theme = savedTheme;
    }
    applyTheme();
  }

  // --- Part A: Layout & Navigation ---

  function toggleSidebar() {
    dashboardContainer.classList.toggle("sidebar-collapsed");
  }

  function toggleMobileMenu() {
    sidebar.classList.toggle("active");
    sidebarBackdrop.classList.toggle("active");
  }

  function navigateToPage(pageId) {
    pageSections.forEach((section) => section.classList.remove("active"));

    const targetPage = document.getElementById(`page-${pageId}`);
    if (targetPage) {
      targetPage.classList.add("active");
    }

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.dataset.page === pageId);
    });

    if (sidebar.classList.contains("active")) {
      toggleMobileMenu();
    }
  }

  // --- Part B: API Integration (Users) ---

  async function fetchUsers() {
    try {
      usersTableState.textContent = "Loading users...";
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      if (!response.ok) throw new Error("Failed to fetch users");

      appState.users = await response.json();
      appState.filteredUsers = [...appState.users];

      statTotalUsers.textContent = appState.users.length;

      appState.usersCurrentPage = 1;
      renderUsersPage();
    } catch (error) {
      console.error(error);
      usersTableState.textContent = "Error loading users. Please try again.";
      showToast("Error loading users", "error");
    }
  }

  function applyUserFiltersAndSort() {
    const searchTerm = apiSearchInput.value.toLowerCase();
    const sortOrder = userSortSelect.value;

    appState.filteredUsers = appState.users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.company.name.toLowerCase().includes(searchTerm)
    );

    if (sortOrder === "az") {
      appState.filteredUsers.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === "za") {
      appState.filteredUsers.sort((a, b) => b.name.localeCompare(a.name));
    }
  }

  function renderUsersPage() {
    usersTableBody.innerHTML = "";

    if (appState.filteredUsers.length === 0) {
      usersTableBody.innerHTML = `<tr><td colspan="4" class="table-state">No users found.</td></tr>`;
      paginationControls.style.display = "none";
      return;
    }

    const totalItems = appState.filteredUsers.length;
    const totalPages = Math.ceil(totalItems / appState.usersPerPage);
    const startIndex = (appState.usersCurrentPage - 1) * appState.usersPerPage;
    const endIndex = startIndex + appState.usersPerPage;
    const paginatedUsers = appState.filteredUsers.slice(startIndex, endIndex);

    paginatedUsers.forEach((user) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.company.name}</td>
                <td>${user.phone.split(" ")[0]}</td>
            `;
      usersTableBody.appendChild(row);
    });

    paginationControls.style.display = "flex";
    paginationInfo.textContent = `Showing ${startIndex + 1} to ${Math.min(
      endIndex,
      totalItems
    )} of ${totalItems} results`;

    paginationButtons.innerHTML = "";

    const prevBtn = document.createElement("button");
    prevBtn.textContent = "Previous";
    prevBtn.disabled = appState.usersCurrentPage === 1;
    prevBtn.addEventListener("click", () => {
      if (appState.usersCurrentPage > 1) {
        appState.usersCurrentPage--;
        renderUsersPage();
      }
    });
    paginationButtons.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement("button");
      pageBtn.textContent = i;
      pageBtn.className = i === appState.usersCurrentPage ? "active" : "";
      pageBtn.addEventListener("click", () => {
        appState.usersCurrentPage = i;
        renderUsersPage();
      });
      paginationButtons.appendChild(pageBtn);
    }

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Next";
    nextBtn.disabled = appState.usersCurrentPage === totalPages;
    nextBtn.addEventListener("click", () => {
      if (appState.usersCurrentPage < totalPages) {
        appState.usersCurrentPage++;
        renderUsersPage();
      }
    });
    paginationButtons.appendChild(nextBtn);
  }

  function handleUserSearchAndSort() {
    applyUserFiltersAndSort();
    appState.usersCurrentPage = 1;
    renderUsersPage();
  }

  // --- Part C: Task Automation Panel ---

  function loadTasks() {
    const savedTasks = localStorage.getItem("dashboard-tasks");
    appState.tasks = savedTasks ? JSON.parse(savedTasks) : [];
    applyTaskFilters();
    renderTasks();
    updateDashboardStats();
  }

  function saveTasks() {
    localStorage.setItem("dashboard-tasks", JSON.stringify(appState.tasks));
    updateDashboardStats();
  }

  function applyTaskFilters() {
    const priority = filterPriority.value;
    const status = filterStatus.value;
    const deadline = filterDeadline.value;

    const now = new Date();
    const sevenDaysFromNow = new Date(now.setDate(now.getDate() + 7));

    appState.filteredTasks = appState.tasks.filter((task) => {
      const priorityMatch = priority === "all" || task.priority === priority;
      const statusMatch = status === "all" || task.status === status;

      let deadlineMatch = true;
      if (deadline === "upcoming" && task.deadline) {
        const taskDeadline = new Date(task.deadline);
        deadlineMatch =
          taskDeadline <= sevenDaysFromNow && task.status !== "done";
      }

      return -priorityMatch && statusMatch && deadlineMatch;
    });
  }

  function renderTasks() {
    taskList.innerHTML = "";

    applyTaskFilters();

    if (appState.filteredTasks.length === 0) {
      taskList.innerHTML = `<div class="no-tasks">
                <h3>No tasks found</h3>
                <p>Try adjusting your filters or add a new task.</p>
            </div>`;
      return;
    }

    appState.filteredTasks.forEach((task) => {
      const taskCard = document.createElement("div");
      taskCard.className = "task-card";
      taskCard.dataset.id = task.id;

      const priorityClass = `badge-priority-${task.priority}`;
      const statusClass = `badge-status-${task.status
        .replace(" ", "")
        .toLowerCase()}`;

      const formattedDeadline = task.deadline
        ? new Date(task.deadline).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "No deadline";

      taskCard.innerHTML = `
                <div class="task-card-content">
                    <div class="task-card-header">
                        <h3>${task.title}</h3>
                    </div>
                    <p>${task.description || "No description"}</p>
                    <div class="task-card-footer">
                        <span class="badge ${priorityClass}">
                            <span class="badge-dot"></span>
                            ${
                              task.priority.charAt(0).toUpperCase() +
                              task.priority.slice(1)
                            }
                        </span>
                        <span class="badge ${statusClass}">
                            <span class="badge-dot"></span>
                            ${
                              task.status === "inprogress"
                                ? "In Progress"
                                : task.status.charAt(0).toUpperCase() +
                                  task.status.slice(1)
                            }
                        </span>
                        <span class="task-deadline">
                            <!-- Icon: Calendar -->
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                            ${formattedDeadline}
                        </span>
                    </div>
                </div>
                <div class="task-card-actions">
                    <button class="btn btn-secondary btn-sm edit-task-btn" title="Edit task">
                        <!-- Icon: Edit 2 -->
                        <svg class="icon-sm" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                    </button>
                    <button class="btn btn-danger btn-sm delete-task-btn" title="Delete task">
                        <!-- Icon: Trash 2 -->
                        <svg class="icon-sm" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                    </button>
                </div>
            `;
      taskList.appendChild(taskCard);
    });
  }

  function updateDashboardStats() {
    const pendingTasks = appState.tasks.filter(
      (task) => task.status !== "done"
    ).length;
    statPendingTasks.textContent = pendingTasks;
  }

  /**
   * Form Validation (Part D)
   */
  function validateTaskForm() {
    let isValid = true;
    const titleInput = document.getElementById("task-title");
    const deadlineInput = document.getElementById("task-deadline");

    titleInput.classList.remove("is-invalid");
    deadlineInput.classList.remove("is-invalid");

    if (titleInput.value.trim() === "") {
      titleInput.classList.add("is-invalid");
      isValid = false;
    }

    if (deadlineInput.value === "") {
      deadlineInput.classList.add("is-invalid");
      isValid = false;
    }

    if (!isValid) {
      showToast("Please fill in all required fields", "error");
    }
    return isValid;
  }

  function handleTaskFormSubmit(e) {
    e.preventDefault();

    if (!validateTaskForm()) return;

    const taskData = {
      id: appState.editingTaskId || `task-${Date.now()}`,
      title: document.getElementById("task-title").value.trim(),
      description: document.getElementById("task-description").value.trim(),
      priority: document.getElementById("task-priority").value,
      deadline: document.getElementById("task-deadline").value,
      status: document.getElementById("task-status").value,
    };

    if (appState.editingTaskId) {
      const taskIndex = appState.tasks.findIndex(
        (task) => task.id === appState.editingTaskId
      );
      if (taskIndex > -1) {
        appState.tasks[taskIndex] = taskData;
      }
      showToast("Task updated successfully", "success");
    } else {
      appState.tasks.push(taskData);
      showToast("Task added successfully", "success");
    }

    appState.editingTaskId = null;
    saveTasks();
    renderTasks();
    closeModal();
    taskForm.reset();
  }

  function handleOpenTaskModal(e) {
    const taskCard = e.target.closest(".task-card");
    if (!taskCard) return;

    const taskId = taskCard.dataset.id;
    const task = appState.tasks.find((t) => t.id === taskId);
    if (!task) return;

    if (e.target.closest(".edit-task-btn")) {
      appState.editingTaskId = taskId;
      modalTitle.textContent = "Edit Task";
      document.getElementById("task-id").value = task.id;
      document.getElementById("task-title").value = task.title;
      document.getElementById("task-description").value = task.description;
      document.getElementById("task-priority").value = task.priority;
      document.getElementById("task-deadline").value = task.deadline;
      document.getElementById("task-status").value = task.status;
      openModal("task-modal");
    } else if (e.target.closest(".delete-task-btn")) {
      if (confirm("Are you sure you want to delete this task?")) {
        appState.tasks = appState.tasks.filter((t) => t.id !== taskId);
        saveTasks();
        renderTasks();
        showToast("Task deleted", "info");
      }
    }
  }

  function initEventListeners() {
    sidebarToggle.addEventListener("click", toggleSidebar);
    mobileMenuToggle.addEventListener("click", toggleMobileMenu);
    sidebarBackdrop.addEventListener("click", toggleMobileMenu);

    // Navigation
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        navigateToPage(e.currentTarget.dataset.page);
      });
    });

    // Theme
    themeToggle.addEventListener("click", toggleTheme);

    // Profile Dropdown
    profileButton.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent window click from firing
      profileDropdownMenu.classList.toggle("active");
    });

    // Dropdown link navigation
    profileDropdownMenu.addEventListener("click", (e) => {
      if (e.target.matches(".dropdown-link") && e.target.dataset.pageLink) {
        e.preventDefault();
        navigateToPage(e.target.dataset.pageLink);
        profileDropdownMenu.classList.remove("active");
      }
    });

    // Modals
    modalDismissButtons.forEach((btn) =>
      btn.addEventListener("click", closeModal)
    );
    modalBackdrop.addEventListener("click", closeModal);

    // Users Page
    apiSearchInput.addEventListener("input", handleUserSearchAndSort);
    userSortSelect.addEventListener("change", handleUserSearchAndSort);

    // Tasks Page
    addTaskBtn.addEventListener("click", () => {
      appState.editingTaskId = null;
      modalTitle.textContent = "Add New Task";
      taskForm.reset();
      openModal("task-modal");
    });
    taskForm.addEventListener("submit", handleTaskFormSubmit);
    taskList.addEventListener("click", handleOpenTaskModal);
    filterPriority.addEventListener("change", renderTasks);
    filterStatus.addEventListener("change", renderTasks);
    filterDeadline.addEventListener("change", renderTasks);

    window.addEventListener("click", () => {
      if (profileDropdownMenu.classList.contains("active")) {
        profileDropdownMenu.classList.remove("active");
      }
    });
  }

  function initializeApp() {
    initTheme();
    initEventListeners();
    fetchUsers();
    loadTasks();
  }

  initializeApp();
});
