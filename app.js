/*==========================================*/
//               *selectors*                //
/*==========================================*/

const input = document.querySelector("#input");
const add = document.querySelector(".add");
const todoList = document.querySelector("#todo-container");
const snackbar = document.getElementById("snackbar");
let darkMode = document.querySelector(".dark-mode");
let lightMode = document.querySelector(".light-mode");
let dark_body = document.body;
let dark_input = document.querySelector("form input");
let dark_taskItem = document.querySelector(".task-item");
let dark_formBtn = document.querySelector("form button");
let dark_title = document.querySelector("header h1");
let currentTime = document.querySelector(".currentTime");
let currentDesc = document.querySelector(".currentDesc");
let currentWeather = document.querySelector(".currentWeather");
let currentLocation = document.querySelector(".currentLocation");
let progressBar = document.querySelector(".bar");
/*==========================================*/
//            *Event listeners*             //
/*==========================================*/

// Your code to run since DOM is loaded and ready
document.addEventListener("DOMContentLoaded", () => renderTodos());
add.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteButton);
todoList.addEventListener("click", checkButton);
todoList.addEventListener("click", editButton);
darkMode.addEventListener("click", toggleDark);
lightMode.addEventListener("click", toggleDark);

/*==========================================*/
//                *functions*               //
/*==========================================*/

//options - navigator => get current location
var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

function success(pos) {
  var crd = pos.coords;
  weather(crd.latitude, crd.longitude);
}

function error(err) {
  console.warn("ERROR(" + err.code + "): " + err.message);
}

//will start weather function in seccess function
navigator.geolocation.getCurrentPosition(success, error, options);

//get current location weather(connected with navigator)
function weather(latitude, longitude) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=cc899ff07e1cdf8cd42fe037272216fb&units=metric`
  )
    .then(function (resp) {
      return resp.json();
    }) // Convert data to json
    .then(function (data) {
      if (data.main.temp > 0) {
        currentWeather.style.color = "#d19a66";
      } else {
        currentWeather.style.color = "#61aeee";
      }
      currentWeather.style.fontSize = "3rem";
      //insert weather data
      currentWeather.innerHTML = data.main.temp.toFixed(1) + "&deg;";
      currentDesc.innerHTML = data.weather[0].description;
      currentLocation.innerHTML = data.name;

      //based on local time automatically switch to dark theme
      if (
        new Date() <= new Date(data.sys.sunrise * 1000) ||
        new Date() >= new Date(data.sys.sunset * 1000)
      ) {
        toggleDark();
      }
    })
    .catch((err) => {
      throw err;
    });
}

//get current time with a format "YYYY/MM/DD **:**:**"
function now() {
  let today = new Date();
  var year = today.getFullYear();
  var month = (today.getMonth() + 1);
  var dateTime = today.getDate();

  var date = year;
  date += ((month < 10) ? '/0' : "/") + month;
  date += ((date < 10) ? '/0' : "/") + dateTime;

  var hour = today.getHours();
  var minute = today.getMinutes();
  var second = today.getSeconds();

  var time = ((hour < 10) ? '0' : '') + hour;
    if (hour == 0)
      time = '00';
  time += ((minute < 10) ? ':0' : ':') + minute;
  time += ((second < 10) ? ':0' : ':') + second;
  return `${date}\n${time}`;
}
setInterval(currentT, 1000);

function currentT() {
  currentTime.innerHTML = String(now());
}

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
  let checkedItem = 0;
  let progressP = 0;
  const todos = JSON.parse(localStorage.getItem("todos"));
  //console.log(todos.length);
  if (todos) {
    for (i = 0; i < todos.length; i++) {
      if (todos[i].completed) {
        checkedItem++;
      }
    }
    progressP = (checkedItem / todos.length) * 100;
  }
  progressBar.style.width = progressP + "%";
  console.log(progressBar.style.width);
  progressBar.innerHTML = progressP.toFixed(1) + "%";

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
    date: now(),
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

  const editBtn = document.createElement("button");
  editBtn.innerHTML = `<i class="fa fa-pencil-alt"></i>`;
  editBtn.classList.add("edited");
  taskButtons.appendChild(editBtn);

  //completed tasks
  const trashBtn = document.createElement("button");
  trashBtn.innerHTML = `<i class="fa fa-trash"></i>`;
  trashBtn.classList.add("trash");
  taskButtons.appendChild(trashBtn);

  // get date
  let taskDate = document.createElement("div");
  taskDate.setAttribute("class", "task-date");
  taskDate.textContent = todo.date;
  if (todo.completed) taskDate.classList.add("taskCompleted");

  // add the taskDate to the taskItem
  taskItem.appendChild(taskDate);

  // add the buttons div and text to the tasksInner
  taskInner.appendChild(taskText);
  taskInner.appendChild(taskButtons);

  // add the taskInner to the taskItem
  taskItem.appendChild(taskInner);

  // add the taskItem to the tasksWrapper
  tasksWrapper.appendChild(taskItem);
}

function deleteButton(e) {
  const item = e.target;
  const todos = JSON.parse(localStorage.getItem("todos"));
  if (item.classList.contains("trash")) {
    const index = todos
      .map(({ text }) => text)
      .indexOf(item.parentElement.parentElement.innerText);

    if (index > -1) {
      todos.splice(index, 1);
      showSnackBar("Deleted Todo Successfully..");
    }
    localStorage.setItem("todos", JSON.stringify(todos));
  }
  renderTodos();
}

function checkButton(e) {
  const item = e.target;
  const todos = JSON.parse(localStorage.getItem("todos"));
  if (item.classList.contains("completed")) {

    let clickedItemIndex = todos
      .map(({ text }) => text)
      .findIndex((ele) => ele === item.parentElement.parentElement.innerText);

    todos[clickedItemIndex].completed = !todos[clickedItemIndex].completed;
    localStorage.setItem("todos", JSON.stringify(todos));
  }
  renderTodos();
}

function editButton(e) {
  const item = e.target;
  const todos = JSON.parse(localStorage.getItem("todos"));
  if (item.classList.contains("edited")) {
    let flag = prompt("Please enter your new description of todolist","");
    if(flag != null && flag != ""){
    const index = todos
    .map(({ text }) => text)
    .indexOf(item.parentElement.parentElement.innerText);

    if (index > -1) {
    todos.splice(index, 1);

    let dateTime = item.parentElement.parentElement.parentElement.innerText ;
    let tempobj = {text: flag, completed: false, date: dateTime.slice(0, 19)};
    todos.splice(index, 0,tempobj);
    showSnackBar("Todo List Updated Successfully...");
    }
    localStorage.setItem("todos", JSON.stringify(todos));
    }
  }
  renderTodos();
}

function showSnackBar(msg) {
  snackbar.innerText = msg;
  snackbar.className = "show";
  setTimeout(function () {
    snackbar.className = "";
  }, 3000);
}

function clearStorage() {
  if (confirm("Do you really want to clear?")) {
     localStorage.removeItem("todos");
  }
}

function allDoneStorage() {
  var items = JSON.parse(localStorage.getItem("todos"));
  if (confirm("Do you really want to set all-done?")) {
    items.map(function (e) {
      if (!e.completed) {
        e.completed = true;
      }
    });
    localStorage.setItem("todos", JSON.stringify(items));
  }
}

function allUnDoneStorage() {
  var items = JSON.parse(localStorage.getItem("todos"));
  if (confirm("Do you really want to undone all TodoList?")) {
    items.map(function (e) {
      if (e.completed) {
        e.completed = false;
      }
    });
    localStorage.setItem("todos", JSON.stringify(items));
  }
}


function toggleDark() {
  if (!darkMode.classList.contains("display-none")) {
    darkMode.classList.add("display-none");
    lightMode.classList.remove("display-none");
    dark_body.classList.add("dark");
    dark_input.classList.add("dark");
    dark_formBtn.classList.add("dark");
    dark_title.style.color = "white";
  } else {
    lightMode.classList.add("display-none");
    darkMode.classList.remove("display-none");
    dark_body.classList.remove("dark");
    dark_input.classList.remove("dark");
    dark_formBtn.classList.remove("dark");
    dark_title.style.color = "#05445e";
  }
}

const dark_light_Item = localStorage.getItem("dark-light");
const dark_light_button = document.querySelector(".dark-light");
let temp = localStorage.getItem(".dark-light");

function enableDarkMode(){
  document.body.classList.add('dark-light');
  localStorage.setItem('dark-light', 'enabled');
  darkMode.classList.add("display-none");
  lightMode.classList.remove("display-none");
  dark_body.classList.add("dark");
  dark_input.classList.add("dark");
  dark_formBtn.classList.add("dark");
  dark_title.style.color = "white";
}

function disableDarkMode() {
  document.body.classList.remove('dark-light');
  localStorage.setItem('dark-light', null);
  lightMode.classList.add("display-none");
  darkMode.classList.remove("display-none");
  dark_body.classList.remove("dark");
  dark_input.classList.remove("dark");
  dark_formBtn.classList.remove("dark");
  dark_title.style.color = "#05445e";
}

if (dark_light_Item === 'enabled') {
  enableDarkMode();
}

dark_light_button.addEventListener('click', () => {
  temp = localStorage.getItem('dark-light');
  if (temp !== 'enabled') {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
});