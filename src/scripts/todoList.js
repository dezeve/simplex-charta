const electron = require("electron")
const { ipcRenderer } = electron

let closeTodoListButton = document.querySelector("#closeTodoListButton")
let addTodoButton = document.querySelector("#addTodoButton")

checkTodoCount()

closeTodoListButton.addEventListener("click", () => {
    ipcRenderer.send("key: closeTodoList")
})

addTodoButton.addEventListener("click", () => {
    ipcRenderer.send("key: openAddTodo")
})

ipcRenderer.on("key: addTodoItem", (e, todo) => {
    const container = document.querySelector(".todo-container")

    const row = document.createElement("div")
    row.className = "row card my-2"

    const cardBody = document.createElement("div")
    cardBody.className = "card-body text-start"

    const p = document.createElement("p")
    p.className = "card-text"
    p.innerText = todo.text

    const a = document.createElement("a")
    a.className = "btn btn-success"
    a.innerText = "Done"

    a.addEventListener("click", (e) => {
        if(confirm("Are you sure to delete this Todo?")){
            e.target.parentNode.parentNode.remove()
            checkTodoCount()
        }
    })

    cardBody.appendChild(p)
    cardBody.appendChild(a)

    row.appendChild(cardBody)

    container.appendChild(row)
    checkTodoCount()
})

function checkTodoCount() {
    const container = document.querySelector(".todo-container")
    const alertContainer = document.querySelector(".alert-container")

    if (container.children.length !== 0) {
        alertContainer.style.display = "none"
    } else {
        alertContainer.style.display = "block"
    }
}
