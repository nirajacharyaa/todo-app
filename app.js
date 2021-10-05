/*==========================================*/
//               *selectors*                //
/*==========================================*/

const input = document.querySelector("#input");
const add = document.querySelector(".add");
const todoList = document.querySelector("#todo-container");

/*==========================================*/
//            *Event listeners*             //
/*==========================================*/

// Your code to run since DOM is loaded and ready
document.addEventListener("DOMContentLoaded", () => renderTodos());
add.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteCheck);

/*==========================================*/
//                *functions*               //
/*==========================================*/

function addTodo(e) {
  //prevnent form from submitting
  e.preventDefault();
  if (input.value) {
    addTodoToLocalStorage(input.value);
    input.value = "";
    renderTodos();
  }
}

function renderTodos() {
  // remove all the current dom elements as we're going to re-create them
  // this is inefficient but there's not an easy way to keep localStorage and the DOM in sync
  // without a framework
  todoList.innerHTML = "";

  // read todo's from local storage and display them
  const todos = JSON.parse(localStorage.getItem("todos"));
  // check that we're not creating the item again in the dom
  todos?.forEach((t) => createTodoItem(t));
}

function addTodoToLocalStorage(text) {
  let todos = [];

  // get any current todo's
  if (localStorage.hasOwnProperty("todos")) {
    todos = JSON.parse(localStorage.getItem("todos") || "");
  }

  if (todos.map((todo) => todo.text).includes(text)) return;

  // each todo will be an object of following properties
  let newTodo = {
    text,
    completed: false,
  };

  // add new todo to todos array
  updatedTodos = [...todos, newTodo];

  // push new todos to local storage
  localStorage.setItem("todos", JSON.stringify(updatedTodos));
}

function createTodoItem(todo) {
  // get the container
  const tasksWrapper = document.getElementById("todo-container");
  // create the li element
  const taskItem = document.createElement("li");
  taskItem.classList.add("task-item");

  // create a div inside the list element
  const taskInner = document.createElement("div");
  taskInner.classList.add("task-inner");
  if (todo.completed) taskInner.classList.add("taskCompleted");

  // create a container for the buttons
  const taskButtons = document.createElement("div");
  taskButtons.classList.add("buttons");

  // create container for task text
  const taskText = document.createElement("div");
  taskText.classList.add("task-text");
  taskText.innerText = todo.text;

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
  const todos = JSON.parse(localStorage.getItem("todos"));
  if (item.classList.contains("trash")) {
    const index = todos
      .map(({ text }) => text)
      .indexOf(item.parentElement.parentElement.innerText);

    if (index > -1) {
      todos.splice(index, 1);
    }
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  if (item.classList.contains("completed")) {
    // get the clicked item
    let clickedItemIndex = todos
      .map(({ text }) => text)
      .findIndex((ele) => ele === item.parentElement.parentElement.innerText);

    // toggle todo state
    todos[clickedItemIndex].completed = !todos[clickedItemIndex].completed;
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  renderTodos();
}

function clearStorage()
{
  if(confirm("Do you really want to clear?"))
  {
    localStorage.clear();
    update()
    location.reload();
  }
}
