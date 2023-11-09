const electron = require("electron");
const { ipcRenderer } = electron;

let sendButton = document.querySelector("#sendButton");
let sendValue = document.querySelector("#sendValue");

sendButton.addEventListener("click", () => {
    ipcRenderer.send("key: sendValue", sendValue.value);
})
