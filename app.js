/*==========================================*/
//               *selectors*                //
/*==========================================*/

const input = document.querySelector(".input");
const add = document.querySelector(".add");
const todoList = document.querySelector(".todo-container");

/*==========================================*/
//            *Event listeners*             //
/*==========================================*/

add.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteCheck);

/*==========================================*/
//                *functions*               //
/*==========================================*/

function addTodo(e) {
  //prevnent form from submitting
  e.preventDefault();
  if (input.value.length > 0) {
    //creating the taskWrapper
    const taskWrapper = document.createElement("div");
    taskWrapper.classList.add("todo");

    //creating the task
    const task = document.createElement("li");

    task.innerText = input.value;
    input.value = "";
    task.classList.add("tasklist");
    taskWrapper.appendChild(task);

    //completed tasks
    const completedBtn = document.createElement("button");
    completedBtn.innerHTML = `<i class="fa fa-check"></i>`;
    completedBtn.classList.add("completed");
    taskWrapper.appendChild(completedBtn);

    //completed tasks
    const trashBtn = document.createElement("button");
    trashBtn.innerHTML = `<i class="fa fa-trash"></i>`;
    trashBtn.classList.add("trash");
    taskWrapper.appendChild(trashBtn);
    todoList.appendChild(taskWrapper);
  }
}

function deleteCheck(e) {
  const item = e.target;
  if (item.classList[0] == "trash") {
    item.parentElement.classList.add("fall");
    item.parentElement.addEventListener("transitionend", function () {
      item.parentElement.remove();
    });
  }
  if (item.classList[0] == "completed") {
    item.previousSibling.style.textDecoration = "line-through";
    item.parentElement.style.opacity = 0.5;
  }
}
