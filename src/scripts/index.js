const electron = require("electron")
const { ipcRenderer } = electron

ipcRenderer.on("key: addTodoItem", (e, todoItems) => {
    console.log(todoItems)
})
