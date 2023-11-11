const electron = require("electron")
const { ipcRenderer } = electron

let newTodoExit = document.querySelector("#newTodoExit")
let saveTodoButton = document.querySelector("#saveTodoButton")

newTodoExit.addEventListener("click", () => {
    ipcRenderer.send("key: closeNewTodo")
})

saveTodoButton.addEventListener("click", () => {
    ipcRenderer.send("key: saveTodo")
})
