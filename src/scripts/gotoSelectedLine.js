const electron = require("electron")
const { ipcRenderer } = electron

let lineInput = document.querySelector("#lineInput")
let getSelectedLineInput = document.querySelector("#getSelectedLineInput")

getSelectedLineInput.addEventListener("click", () => {
    ipcRenderer.send("key: gotoLine", lineInput.value)
})
