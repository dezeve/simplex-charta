const electron = require("electron")
const { ipcRenderer } = electron

const editor = ace.edit("editor")
editor.setTheme("ace/theme/dawn")
editor.session.setMode("ace/mode/javascript")
editor.setFontSize("17px")
