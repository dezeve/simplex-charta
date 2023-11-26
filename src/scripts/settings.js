const electron = require("electron")
const { ipcRenderer } = electron

const closeSettingsButton = document.querySelector("#closeSettingsButton")

closeSettingsButton.addEventListener("click", () => {
    ipcRenderer.send("key: closeSettings")
})

const themeList = document.querySelectorAll(".dropdown-item");

themeList.forEach((theme) => {
  theme.addEventListener("click", (event) => {
    const selectedTheme = event.target.textContent;
    ipcRenderer.send("key: updateEditorTheme", selectedTheme)
  })
})
