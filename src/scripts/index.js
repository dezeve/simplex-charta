const electron = require("electron");
const { ipcRenderer } = electron;

let sendButton = document.querySelector("#sendButton");
let sendValue = document.querySelector("#sendValue");
let openNewWindowButton = document.querySelector("#openNewWindowButton");

sendButton.addEventListener("click", () => {
    ipcRenderer.send("key: sendValue", sendValue.value);
})

openNewWindowButton.addEventListener("click", () => {
    ipcRenderer.send("key: openNewWindow", true);
})
