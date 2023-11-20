const electron = require("electron")
const { ipcRenderer } = electron

const text = document.querySelector("#text")

text.spellcheck = false
