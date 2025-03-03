document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
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
        
        if (todoText === '') {
            return; // 空の場合は何もしない
        }
        
        // 新しいTodoアイテムを作成
        const newTodo = {
            id: Date.now(),
            text: todoText,
            completed: false
        };
        
        // 配列に追加
        todos.push(newTodo);
        
        // ローカルストレージに保存
        saveToLocalStorage();
        
        // 入力欄をクリア
        todoInput.value = '';
        
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
            
            todoItem.innerHTML = `
                <p>${todo.text}</p>
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