const electron = require("electron")
const { ipcRenderer } = electron

const saveFontSizeButton = document.querySelector("#saveFontSizeButton")
const fontSizeInput = document.querySelector("#fontSizeInput")

const themeList = document.querySelectorAll(".dropdown-item")

themeList.forEach((theme) => {
  theme.addEventListener("click", (event) => {
    const selectedTheme = event.target.textContent
    ipcRenderer.send("key: updateEditorTheme", selectedTheme)
  })
})

saveFontSizeButton.addEventListener("click", () => {
  const fontSize = fontSizeInput.value
  if (fontSize >= 5 && fontSize <= 75) {
    ipcRenderer.send("key: updateFontSize", fontSize)
  } else {
    ipcRenderer.send("key: showFontSizeError")
  }
})
