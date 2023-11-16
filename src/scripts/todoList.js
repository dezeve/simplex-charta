const electron = require("electron")
const { ipcRenderer } = electron

const todoData = require("../database/todoData.json")
const todoItems = todoData.todoItems

let closeTodoListButton = document.querySelector("#closeTodoListButton")
let addTodoButton = document.querySelector("#addTodoButton")

listTodoItems()
checkTodoCount()

closeTodoListButton.addEventListener("click", () => {
    ipcRenderer.send("key: closeTodoList")
})

addTodoButton.addEventListener("click", () => {
    ipcRenderer.send("key: openAddTodo")
})

function listTodoItems() {
    for (const item of todoItems) {
        const container = document.querySelector(".todo-container")
    
        const row = document.createElement("div")
        row.className = "row card my-2"
    
        const cardBody = document.createElement("div")
        cardBody.className = "card-body text-start row"
    
        const p = document.createElement("p")
        p.className = "card-text col-sm-9"
        p.innerText = item.text
    
        const a = document.createElement("a")
        a.className = "btn btn-success col-sm-3 align-self-center"
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
    }
}

function checkTodoCount() {
    const container = document.querySelector(".todo-container")
    const alertContainer = document.querySelector(".alert-container")

    document.querySelector(".total-count-container").innerText = container.children.length

    if (container.children.length !== 0) {
        alertContainer.style.display = "none"
    } else {
        alertContainer.style.display = "block"
    }
}
