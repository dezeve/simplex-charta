const electron = require("electron")
const { ipcRenderer } = electron

let newTodoExit = document.querySelector("#newTodoExit")

newTodoExit.addEventListener("click", () => {
    ipcRenderer.send("key: closeNewTodo")
})