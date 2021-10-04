/*==========================================*/
//               *selectors*                //
/*==========================================*/

const input = document.querySelector(".input");
const add = document.querySelector(".add");
const todoList = document.querySelector("#todo-container");

/*==========================================*/
//            *Event listeners*             //
/*==========================================*/

document.addEventListener("DOMContentLoaded", function(event) {
  // Your code to run since DOM is loaded and ready
  if (localStorage.hasOwnProperty('todos')) {
  const todos = JSON.parse(localStorage.getItem('todos'));
    todos.forEach(t => {
      createTodoItem(t)
    });
  }
});


add.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteCheck);

/*==========================================*/
//                *functions*               //
/*==========================================*/

function addTodo(e) {
  //prevnent form from submitting
  e.preventDefault();
  if (input.value.length > 0) {
 
    addTodoToLocalStorage(input.value)
    input.value = "";

    renderTodos()

    // reset input value
    input.value = "";
  }
}

function renderTodos() {
  // remove all the current dom elements as we're going to re-create them
  // this is inefficient but there's not an easy way to keep localStorage and the DOM in sync
  // without a framework
  const tasks = document.getElementById('todo-container');
  while (tasks.children.length > 0) {
    var task = tasks.children[0];
    tasks.removeChild(task);
  }

  // read todo's from local storage and display them
  const todos = JSON.parse(localStorage.getItem('todos'));
  todos.forEach(t => {
    // check that we're not creating the item again in the dom
    if (t !== input.value) {
      createTodoItem(t)
    }
  });
}

function addTodoToLocalStorage(todo) {

  let todos = [];

  // get any current todo's
  if (localStorage.hasOwnProperty('todos')) {
    todos = JSON.parse(localStorage.getItem('todos'));
  }
  // add new todo to todos array
  todos.push(todo)
  // make the array unique (no point in having duplicate todo's)
  todosUniq = [...new Set(todos)];

  // push new array to local storage
  localStorage.setItem('todos', JSON.stringify(todosUniq))
}

function createTodoItem(todo) {
    // get the container
    const tasksWrapper = document.getElementById('todo-container');
    // create the li element
    const taskItem = document.createElement("li");
    taskItem.classList.add('task-item')

    // create a div inside the list element
    const taskInner = document.createElement("div");
    taskInner.classList.add('task-inner');

    // create a container for the buttons
    const taskButtons = document.createElement("div");
    taskButtons.classList.add('buttons');

    // create container for task text
    const taskText = document.createElement("div");
    taskText.classList.add('task-text');
    taskText.innerText = todo;

    // create the buttons
    //completed tasks
    const completedBtn = document.createElement("button");
    completedBtn.innerHTML = `<i class="fa fa-check"></i>`;
    completedBtn.classList.add("completed");
    taskButtons.appendChild(completedBtn);

    //completed tasks
    const trashBtn = document.createElement("button");
    trashBtn.innerHTML = `<i class="fa fa-trash"></i>`;
    trashBtn.classList.add("trash");
    taskButtons.appendChild(trashBtn);


    // add the buttons div and text to the tasksInner
    taskInner.appendChild(taskText);
    taskInner.appendChild(taskButtons);

    // add the taskInner to the taskItem
    taskItem.appendChild(taskInner);

    // add the taskItem to the tasksWrapper
    tasksWrapper.appendChild(taskItem);
} 

function deleteCheck(e) {
  const item = e.target;
  if (item.classList[0] == "trash") {
    const todos = JSON.parse(localStorage.getItem('todos'));
    const index = todos.indexOf(item.parentElement.parentElement.innerText)
    if (index > -1) {
      todos.splice(index, 1);
    }
    localStorage.setItem('todos', JSON.stringify(todos))
    renderTodos()
  }
  if (item.classList[0] == "completed") {
    // item.previousSibling.style.textDecoration = "line-through";
    // item.parentElement.style.opacity = 0.5;
    console.log('completed');
  }
}
