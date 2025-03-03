document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const dueDateInput = document.getElementById('due-date-input');
    const categorySelect = document.getElementById('category-select');
    const addButton = document.getElementById('add-button');
    const todoList = document.getElementById('todo-list');

    // ローカルストレージからTodoを読み込む
    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    // 初期表示
    renderTodos();

    // 「追加」ボタンのクリックイベント
    addButton.addEventListener('click', addTodo);

    // Enterキーでも追加できるように
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });

    // Todoを追加する関数
    function addTodo() {
        const todoText = todoInput.value.trim();
        const dueDate = dueDateInput.value.trim();
        const category = categorySelect.value;

        if (todoText === '') {
            return; // 空の場合は何もしない
        }

        // 新しいTodoアイテムを作成
        const newTodo = {
            id: Date.now(),
            text: todoText,
            dueDate: dueDate, // 締め切り日を追加
            category: category, // カテゴリを追加
            completed: false
        };

        // 配列に追加
        todos.push(newTodo);

        // ローカルストレージに保存
        saveToLocalStorage();

        // 入力欄をクリア
        todoInput.value = '';
        dueDateInput.value = '';
        categorySelect.value = '仕事'; // デフォルト値にリセット

        // Todo一覧を再描画
        renderTodos();
    }

    // Todoを削除する関数
    function deleteTodo(id) {
        todos = todos.filter(todo => todo.id !== id);
        saveToLocalStorage();
        renderTodos();
    }

    // Todoの完了状態を切り替える関数
    function toggleComplete(id) {
        todos = todos.map(todo => {
            if (todo.id === id) {
                return { ...todo, completed: !todo.completed };
            }
            return todo;
        });
        saveToLocalStorage();
        renderTodos();
    }

    // Todo一覧を描画する関数
    function renderTodos() {
        // リストをクリア
        todoList.innerHTML = '';

        // すべてのTodoを描画
        todos.forEach(todo => {
            const todoItem = document.createElement('li');
            todoItem.classList.add('todo-item');
            if (todo.completed) {
                todoItem.classList.add('completed');
            }

            // 締め切り日とカテゴリを表示
            const dueDateText = todo.dueDate ? `（締め切り: ${todo.dueDate}）` : '';

            todoItem.innerHTML = `
                <p>${todo.text} ${dueDateText} [${todo.category}]</p>
                <div class="todo-actions">
                    <button class="complete-btn" data-id="${todo.id}">✓</button>
                    <button class="delete-btn" data-id="${todo.id}">×</button>
                </div>
            `;

            todoList.appendChild(todoItem);
        });

        // 完了ボタンのイベントリスナーを設定
        document.querySelectorAll('.complete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                toggleComplete(id);
            });
        });

        // 削除ボタンのイベントリスナーを設定
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                deleteTodo(id);
            });
        });
    }

    // ローカルストレージに保存する関数
    function saveToLocalStorage() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }
});