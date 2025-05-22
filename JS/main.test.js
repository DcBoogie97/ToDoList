/**
 * @jest-environment jsdom
 */
const {
  addToDo,
  deletecheck,
  savelocal,
  getTodos,
  removeLocalTodos,
  changeTheme,
  initApp
} = require('./main.js');


describe('ToDoList main.js functions', () => {
  let toDoInput, toDoBtn, toDoList, standardTheme, lightTheme, darkerTheme, title;
  let savedThemeBackup, todosBackup;

  // Mock alert
  beforeAll(() => {
    global.alert = jest.fn();
  });

  beforeEach(() => {
    // Backup localStorage
    savedThemeBackup = window.localStorage.getItem('savedTheme');
    todosBackup = window.localStorage.getItem('todos');

    // Set up DOM
    document.body.innerHTML = `
      <div id = "header">
        <div class="flexrow-container">
            <div class="standard-theme theme-selector"></div>
            <div class="light-theme theme-selector"></div>
            <div class="darker-theme theme-selector"></div>
        </div>
        <h1 id="title">Just do it.<div id="border"></div></h1>
    </div>

  <div id="form">
        <form>
            <input class="todo-input" type="text" placeholder="Add a task.">
            <button class="todo-btn" type="submit">I Got This!</button>
        </form>
    </div>

    <!-- div for top left corner -->
        <div class="version">
                         <div class="demo version-section"><a href="https://github.com/tusharnankani/ToDoList" class="github-corner">
                             <svg width="80" height="80" viewBox="0 0 250 250" style="fill:#151513; color:#fff; position: absolute; top: 0; border: 0; left: 0; transform: scale(-1, 1);">
                               <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
                               <path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path>
                               <path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path>
                             </svg></a>
                           </div>
    <div>
        <p><span id="datetime"></span></p>
        <script src="JS/time.js"></script>
    </div>

  <div id="myUnOrdList">
        <ul class="todo-list">
            <!-- (Basic Format)
            <div class="todo">
                items added to this list:
                <li></li>
                <button>delete</button>
                <button>check</button>
            </div> -->
        </ul>
    </div>
    `;
    // Call initApp to set up event listeners and selectors
    initApp();

    toDoInput = document.querySelector('.todo-input');
    toDoBtn = document.querySelector('.todo-btn');
    toDoList = document.querySelector('.todo-list');
    standardTheme = document.querySelector('.standard-theme');
    lightTheme = document.querySelector('.light-theme');
    darkerTheme = document.querySelector('.darker-theme');
    title = document.getElementById('title');

    // Reset localStorage
    window.localStorage.clear();
  });

  afterEach(() => {
    // Restore localStorage
    if (savedThemeBackup !== null) {
      window.localStorage.setItem('savedTheme', savedThemeBackup);
    } else {
      window.localStorage.removeItem('savedTheme');
    }
    if (todosBackup !== null) {
      window.localStorage.setItem('todos', todosBackup);
    } else {
      window.localStorage.removeItem('todos');
    }
    jest.clearAllMocks();
  });

  test('savelocal adds todo to localStorage', () => {
    savelocal('Test Todo');
    const todos = JSON.parse(localStorage.getItem('todos'));
    expect(todos).toContain('Test Todo');
  });

  test('removeLocalTodos removes todo from localStorage', () => {
    localStorage.setItem('todos', JSON.stringify(['A', 'B', 'C']));
    const fakeDiv = document.createElement('div');
    const li = document.createElement('li');
    li.innerText = 'B';
    fakeDiv.appendChild(li);
    removeLocalTodos(fakeDiv);
    const todos = JSON.parse(localStorage.getItem('todos'));
    expect(todos).toEqual(['A', 'C']);
  });

  test('changeTheme sets theme and updates DOM', () => {
    changeTheme('darker');
    expect(document.body.className).toBe('darker');
    expect(title.classList.contains('darker-title')).toBe(true);
    expect(document.querySelector('input').className).toBe('darker-input');
    changeTheme('light');
    expect(document.body.className).toBe('light');
    expect(title.classList.contains('darker-title')).toBe(false);
    expect(document.querySelector('input').className).toBe('light-input');
  });

  test('addToDo does not add empty todo and calls alert', () => {
    if (toDoInput) {
      toDoInput.value = '';
    }
    const event = { preventDefault: jest.fn() };
    addToDo(event);
    expect(global.alert).toHaveBeenCalledWith("You must write something!");
    expect(toDoList.children.length).toBe(0);
  });

  test('addToDo adds todo to DOM and localStorage', () => {
    window.savedTheme = 'standard';
    toDoInput.value = 'My Task';
    const event = { preventDefault: jest.fn() };
    addToDo(event);
    expect(toDoList.children.length).toBe(1);
    expect(toDoList.querySelector('li').innerText).toBe('My Task');
    const todos = JSON.parse(localStorage.getItem('todos'));
    expect(todos).toContain('My Task');
    expect(toDoInput.value).toBe('');
  });

  test('getTodos populates the DOM from localStorage', () => {
    window.savedTheme = 'standard';
    localStorage.setItem('todos', JSON.stringify(['Task1', 'Task2']));
    getTodos();
    expect(toDoList.children.length).toBe(2);
    expect(toDoList.children[0].querySelector('li').innerText).toBe('Task1');
    expect(toDoList.children[1].querySelector('li').innerText).toBe('Task2');
  });

  test('deletecheck removes todo from DOM and localStorage', () => {
    window.savedTheme = 'standard';
    // Add a todo
    toDoInput.value = 'DeleteMe';
    addToDo({ preventDefault: jest.fn() });
    const todoDiv = toDoList.querySelector('.todo');
    const deleteBtn = todoDiv.querySelector('.delete-btn');
    // Simulate click event
    const event = { target: deleteBtn };
    deletecheck(event);
    expect(toDoList.children.length).toBe(0);
    const todos = JSON.parse(localStorage.getItem('todos'));
    expect(todos).not.toContain('DeleteMe');
  });

  test('deletecheck toggles completed class on check-btn', () => {
    window.savedTheme = 'standard';
    toDoInput.value = 'CheckMe';
    addToDo({ preventDefault: jest.fn() });
    const todoDiv = toDoList.querySelector('.todo');
    const checkBtn = todoDiv.querySelector('.check-btn');
    const event = { target: checkBtn };
    expect(todoDiv.classList.contains('completed')).toBe(false);
    deletecheck(event);
    expect(todoDiv.classList.contains('completed')).toBe(true);
    deletecheck(event);
    expect(todoDiv.classList.contains('completed')).toBe(false);
  });
});