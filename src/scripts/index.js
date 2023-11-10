const electron = require("electron");
const { ipcRenderer } = electron;

let newTodoButton = document.querySelector("#newTodoButton");
let sendValue = document.querySelector("#sendValue");
let openNewWindowButton = document.querySelector("#openNewWindowButton");

newTodoButton.addEventListener("click", () => {
    ipcRenderer.send("key: openNewTodoWindow", sendValue.value);
})

openNewWindowButton.addEventListener("click", () => {
    ipcRenderer.send("key: openNewWindow", true);
})
