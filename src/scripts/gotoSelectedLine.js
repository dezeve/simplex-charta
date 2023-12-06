const electron = require("electron")
const { ipcRenderer } = electron

const lineInput = document.querySelector("#lineInput")
const getSelectedLineInput = document.querySelector("#getSelectedLineInput")

getSelectedLineInput.addEventListener("click", () => {
    if (!isNaN(lineInput.value - lineInput.value) && lineInput.value.trim() !== "") {
        ipcRenderer.send("key: gotoLine", lineInput.value)
    } else {
        ipcRenderer.send("key: showGotoLineError")
    }
})
