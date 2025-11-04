document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('newTodoInput');
    const addTodoBtn = document.getElementById('addTodoBtn');
    const todoList = document.getElementById('todoList');
    const todoCounter = document.getElementById('todoCounter');
    const searchInput = document.getElementById('searchTodoInput');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const inputError = document.getElementById('inputError');
    const noResultsState = document.getElementById('noResults');

    let currentFilter = 'all'; // all, active, or completed
    let currentSearchTerm = '';

    // --- Utility Functions ---

    /**
     * Debounces a function call.
     */
    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    };

    /**
     * Gets todos from localStorage. Handles errors gracefully.
     */
    const getTodos = () => {
        try {
            const json = localStorage.getItem('todos');
            return json ? JSON.parse(json) : [];
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return [];
        }
    };

    /**
     * Saves todos to localStorage. Handles errors gracefully.
     */
    const saveTodos = (todos) => {
        try {
            localStorage.setItem('todos', JSON.stringify(todos));
        } catch (error) {
            console.error('Error writing to localStorage:', error);
        }
    };

    // --- Todo Management ---

    /**
     * Renders the filtered and searched todos.
     */
    const renderTodos = () => {
        const todos = getTodos();
        let filteredTodos = todos;

        // 1. Apply Search Filter
        const searchTermLower = currentSearchTerm.toLowerCase().trim();
        if (searchTermLower) {
            filteredTodos = filteredTodos.filter(todo => 
                todo.text.toLowerCase().includes(searchTermLower)
            );
        }

        // 2. Apply Category Filter
        if (currentFilter === 'active') {
            filteredTodos = filteredTodos.filter(todo => !todo.completed);
        } else if (currentFilter === 'completed') {
            filteredTodos = filteredTodos.filter(todo => todo.completed);
        }

        // 3. Render List and Update Counter/No Results State
        todoList.innerHTML = '';
        
        if (filteredTodos.length === 0) {
            noResultsState.style.display = 'block';
        } else {
            noResultsState.style.display = 'none';
            filteredTodos.forEach(todo => {
                const li = document.createElement('li');
                li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
                li.dataset.id = todo.id;
                
                li.innerHTML = `
                    <input type="checkbox" data-action="toggle" ${todo.completed ? 'checked' : ''}>
                    <span class="todo-text">${todo.text}</span>
                    <button class="delete-btn" data-action="delete">Delete</button>
                `;
                todoList.appendChild(li);
            });
        }

        // 4. Update Counter
        const totalCount = todos.length;
        const completedCount = todos.filter(todo => todo.completed).length;
        todoCounter.textContent = `📝 Todo List (${totalCount} total, ${completedCount} completed)`;
    };

    /**
     * Adds a new todo item.
     */
    const addTodo = () => {
        const text = todoInput.value.trim();
        inputError.textContent = '';

        if (text.length === 0) {
            inputError.textContent = 'Todo cannot be empty.';
            return;
        }

        const newTodo = {
            id: Date.now(), // Unique ID using timestamp
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };

        const todos = getTodos();
        todos.unshift(newTodo); // Add to the top
        saveTodos(todos);
        
        todoInput.value = ''; // Clear input
        renderTodos();
    };

    /**
     * Toggles the completion status of a todo.
     * @param {number} id The ID of the todo to toggle.
     */
    const toggleTodo = (id) => {
        const todos = getTodos();
        const todo = todos.find(t => t.id == id);
        if (todo) {
            todo.completed = !todo.completed;
            saveTodos(todos);
            renderTodos();
        }
    };

    /**
     * Deletes a todo item.
     * @param {number} id The ID of the todo to delete.
     */
    const deleteTodo = (id) => {
        let todos = getTodos();
        todos = todos.filter(t => t.id != id);
        saveTodos(todos);
        renderTodos();
    };

    /**
     * Handles filter button clicks.
     * @param {string} filter The filter value ('all', 'active', 'completed').
     */
    const setFilter = (filter) => {
        currentFilter = filter;
        filterButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        renderTodos();
    };

    // --- Event Listeners ---

    // Add Todo Button
    addTodoBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });

    // Event Delegation for Todo Interactions (Toggle and Delete)
    todoList.addEventListener('click', (e) => {
        const listItem = e.target.closest('.todo-item');
        if (!listItem) return;

        const todoId = listItem.dataset.id;
        const action = e.target.dataset.action;

        if (action === 'toggle' || e.target.type === 'checkbox') {
            toggleTodo(todoId);
        } else if (action === 'delete') {
            deleteTodo(todoId);
        }
    });

    // Filter Buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => setFilter(btn.dataset.filter));
    });

    // Debounced Search (400ms delay)
    const debouncedSearch = debounce(() => {
        currentSearchTerm = searchInput.value;
        renderTodos();
    }, 400);

    searchInput.addEventListener('input', debouncedSearch);

    // Initial load
    renderTodos();
});