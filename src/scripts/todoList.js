const electron = require("electron")
const { ipcRenderer } = electron

let closeTodoListButton = document.querySelector("#closeTodoListButton")

closeTodoListButton.addEventListener("click", () => {
    ipcRenderer.send("key: closeTodoList", true)
})