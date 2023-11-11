const electron = require("electron")
const { ipcRenderer } = electron

let closeTodoListButton = document.querySelector("#closeTodoListButton")
let addTodoButton = document.querySelector("#addTodoButton")

closeTodoListButton.addEventListener("click", () => {
    ipcRenderer.send("key: closeTodoList")
})

addTodoButton.addEventListener("click", () => {
    ipcRenderer.send("key: openAddTodo")
})