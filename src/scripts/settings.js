const electron = require("electron")
const {ipcRenderer } = electron

const closeSettingsButton = document.querySelector("#closeSettingsButton")

closeSettingsButton.addEventListener("click", () => {
    ipcRenderer.send("key: closeSettings")
})