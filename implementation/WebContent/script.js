const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE_URL = isLocal 
  ? 'http://127.0.0.1:4000/api' 
  : 'https://studenttaskmanager-91tz.onrender.com/api';

// Helper: Show alert
function showAlert(message, type = 'success') {
  const alertContainer = document.getElementById('alertContainer');
  const authAlert = document.getElementById('authAlert');
  const targetAlert = authAlert || alertContainer;

  if (!targetAlert) return;

  targetAlert.textContent = message;
  targetAlert.className = `alert alert-${type}`;
  targetAlert.style.display = 'block';

  setTimeout(() => {
    targetAlert.style.display = 'none';
  }, 3000);
}

// Authentication Check
function checkAuth() {
  const currentPage = document.body.dataset.page;
  const token = localStorage.getItem('taskManagerToken');
  const user = JSON.parse(localStorage.getItem('taskManagerUser') || 'null');

  // If not logged in and not on login or register page, redirect to login
  if (!token && currentPage && currentPage !== 'register') {
    window.location.href = 'index.html';
  }

  // If logged in and on login page, redirect to dashboard
  if (token && !currentPage) {
    window.location.href = 'dashboard.html';
  }

  // Set username in header if available
  const userNameDisplay = document.getElementById('userNameDisplay');
  if (userNameDisplay && user) {
    userNameDisplay.textContent = user.name || user.email;
  }
}

// Logout handler
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('taskManagerToken');
    localStorage.removeItem('taskManagerUser');
    window.location.href = 'index.html';
  });
}

// Global fetch wrapper for error handling
async function fetchAPI(endpoint, options = {}) {
  try {
    const token = localStorage.getItem('taskManagerToken');
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('taskManagerToken');
        localStorage.removeItem('taskManagerUser');
        // Only redirect if not on login/register page
        const currentPage = document.body.dataset.page;
        if (currentPage && currentPage !== 'register') {
          window.location.href = 'index.html';
          return;
        }
      }
      throw new Error(data?.message || `API Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

// --- Page Specific Logic ---
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  
  const page = document.body.dataset.page;

  // Login Page Logic (index.html)
  if (!page) {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        
        if (email && password) {
          const originalText = submitBtn.textContent;
          submitBtn.textContent = 'Please wait...';
          submitBtn.disabled = true;
          
          try {
            const data = await fetchAPI('/user/login', {
              method: 'POST',
              body: JSON.stringify({ email, password })
            });
            
            if (data && data.success) {
              localStorage.setItem('taskManagerToken', data.token);
              localStorage.setItem('taskManagerUser', JSON.stringify(data.user));
              window.location.href = 'dashboard.html';
            }
          } catch (error) {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            showAlert(error.message || 'Login failed. Invalid credentials.', 'danger');
          }
        }
      });
    }
  }

  // Register Page Logic (register.html)
  if (page === 'register') {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
      registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        
        if (name && email && password) {
          const originalText = submitBtn.textContent;
          submitBtn.textContent = 'Please wait...';
          submitBtn.disabled = true;
          
          try {
            const data = await fetchAPI('/user/register', {
              method: 'POST',
              body: JSON.stringify({ name, email, password })
            });
            
            if (data && data.success) {
              localStorage.setItem('taskManagerToken', data.token);
              localStorage.setItem('taskManagerUser', JSON.stringify(data.user));
              showAlert('Registration successful!', 'success');
              setTimeout(() => window.location.href = 'dashboard.html', 1000);
            }
          } catch (error) {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            showAlert(error.message || 'Registration failed.', 'danger');
          }
        }
      });
    }
  }

  // Dashboard Logic
  if (page === 'dashboard') {
    loadDashboardStats();
  }

  // Tasks Page Logic
  if (page === 'tasks') {
    loadTasks();
  }

  // Add/Edit Task Logic
  if (page === 'add-task') {
    initAddEditTask();
  }
});

// --- API & UI Functions ---

// Fetch tasks and update dashboard stats
async function loadDashboardStats() {
  try {
    const data = await fetchAPI('/task/get');
    
    if (data && data.success && data.tasks) {
      const tasks = data.tasks;
      const total = tasks.length;
      const completed = tasks.filter(t => t.status === 'completed').length;
      const pending = total - completed;

      document.getElementById('totalTasks').textContent = total;
      document.getElementById('completedTasks').textContent = completed;
      document.getElementById('pendingTasks').textContent = pending;
    }
  } catch (error) {
    document.getElementById('totalTasks').textContent = '-';
    document.getElementById('completedTasks').textContent = '-';
    document.getElementById('pendingTasks').textContent = '-';
  }
}

// Fetch tasks and render grid
async function loadTasks() {
  const taskGrid = document.getElementById('taskGrid');
  if(!taskGrid) return;
  taskGrid.innerHTML = '<div class="empty-state glass-panel" style="grid-column: 1 / -1;"><p>Loading tasks...</p></div>';

  try {
    const data = await fetchAPI('/task/get');
    taskGrid.innerHTML = '';

    if (!data || !data.success || !data.tasks || data.tasks.length === 0) {
      taskGrid.innerHTML = `
        <div class="empty-state glass-panel" style="grid-column: 1 / -1;">
          <p>No tasks found. Get started by creating one!</p>
          <a href="add-task.html" class="btn btn-primary">Create Task</a>
        </div>
      `;
      return;
    }

    data.tasks.forEach(task => {
      const statusStr = (task.status || 'pending').toLowerCase();
      const title = task.task_title || 'Untitled Task';
      
      const card = document.createElement('div');
      card.className = 'task-card glass-panel';
      card.innerHTML = `
        <span class="task-status status-${statusStr}">${task.status}</span>
        <h3>${escapeHTML(title)}</h3>
        ${task.description ? `<p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 0.5rem;">${escapeHTML(task.description)}</p>` : ''}
        ${task.due_date ? `<p style="color: var(--primary-color); font-size: 0.85rem; margin-bottom: 1rem; font-weight: 500;">📅 Due: ${new Date(task.due_date).toLocaleDateString()}</p>` : ''}
        <div class="task-actions" style="${!task.description && !task.due_date ? 'margin-top: 1rem;' : ''}">
          ${statusStr !== 'completed' ? `<button class="btn btn-success btn-small" onclick="updateTaskStatus('${task.id}', 'completed', '${escapeHTML(title)}')">Complete</button>` : `<button class="btn btn-outline btn-small" onclick="updateTaskStatus('${task.id}', 'pending', '${escapeHTML(title)}')">Reopen</button>`}
          <a href="add-task.html?id=${task.id}" class="btn btn-primary btn-small">Edit</a>
          <button class="btn btn-danger btn-small" onclick="deleteTask('${task.id}')">Delete</button>
        </div>
      `;
      taskGrid.appendChild(card);
    });

  } catch (error) {
    taskGrid.innerHTML = `
      <div class="empty-state glass-panel" style="grid-column: 1 / -1; border-color: var(--danger-color);">
        <p style="color: var(--danger-color);">Failed to load tasks: ${error.message}</p>
      </div>
    `;
  }
}

// Update task status (Complete / Reopen)
window.updateTaskStatus = async function(id, newStatus, title) {
  try {
    await fetchAPI(`/task/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status: newStatus, title: title })
    });
    
    showAlert(`Task marked as ${newStatus}`, 'success');
    loadTasks(); // Reload the grid
  } catch (error) {
    showAlert('Failed to update task status.', 'danger');
  }
}

// Delete Task
window.deleteTask = async function(id) {
  if (!confirm('Are you sure you want to delete this task?')) return;
  
  try {
    await fetchAPI(`/task/delete/${id}`, {
      method: 'DELETE'
    });
    showAlert('Task deleted successfully', 'success');
    loadTasks(); // Reload the grid
  } catch (error) {
    showAlert('Failed to delete task.', 'danger');
  }
}

// Add/Edit Task Form Logic
async function initAddEditTask() {
  const form = document.getElementById('taskForm');
  const titleInput = document.getElementById('taskTitle');
  const descInput = document.getElementById('taskDescription');
  const dateInput = document.getElementById('taskDueDate');
  const statusGroup = document.getElementById('statusGroup');
  const statusInput = document.getElementById('taskStatus');
  const pageTitle = document.getElementById('pageTitle');
  const navAddEdit = document.getElementById('navAddEdit');
  const submitBtn = document.getElementById('submitBtn');
  
  // Check URL params for ID (Edit mode)
  const urlParams = new URLSearchParams(window.location.search);
  const taskId = urlParams.get('id');

  if (taskId) {
    // Edit Mode
    pageTitle.textContent = 'Edit Task';
    navAddEdit.textContent = 'Edit Task';
    submitBtn.textContent = 'Update Task';
    statusGroup.style.display = 'block'; // Show status dropdown
    
    try {
      // Fetch specific task to populate form
      const data = await fetchAPI('/task/get');
      const tasks = data.tasks || [];
      const task = tasks.find(t => String(t.id) === String(taskId));
      
      if (task) {
        document.getElementById('taskId').value = task.id;
        titleInput.value = task.task_title || '';
        if (descInput) descInput.value = task.description || '';
        if (dateInput && task.due_date) {
          dateInput.value = new Date(task.due_date).toISOString().split('T')[0];
        }
        statusInput.value = (task.status || 'pending').toLowerCase();
      } else {
        showAlert('Task not found', 'danger');
        setTimeout(() => window.location.href = 'tasks.html', 2000);
      }
    } catch (error) {
      showAlert('Failed to load task details', 'danger');
    }
  }

  // Handle Form Submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('taskId').value;
    const title = titleInput.value.trim();
    
    if (!title) {
      showAlert('Title is required', 'danger');
      return;
    }

    const taskData = {
      title: title, 
      description: descInput ? descInput.value.trim() : '',
      due_date: dateInput && dateInput.value ? dateInput.value : null,
      status: taskId ? statusInput.value : 'pending'
    };

    try {
      if (id) {
        // Update (PUT)
        await fetchAPI(`/task/update/${id}`, {
          method: 'PUT',
          body: JSON.stringify(taskData)
        });
        showAlert('Task updated successfully', 'success');
      } else {
        // Create (POST)
        await fetchAPI('/task/add', {
          method: 'POST',
          body: JSON.stringify(taskData)
        });
        showAlert('Task created successfully', 'success');
      }
      
      setTimeout(() => {
        window.location.href = 'tasks.html';
      }, 1000);
      
    } catch (error) {
      showAlert(error.message || 'Failed to save task', 'danger');
    }
  });
}

// Utility to prevent XSS
function escapeHTML(str) {
  return String(str).replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}
