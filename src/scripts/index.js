const electron = require("electron")
const { ipcRenderer } = electron

ipcRenderer.on("key: saveFile", () => {
    console.log(editor.getValue())
})

ace.require("ace/ext/language_tools")

const editor = ace.edit("editor")

editor.setTheme("ace/theme/dawn")
editor.session.setMode("ace/mode/javascript")
editor.setFontSize("17px")

editor.setOptions({
    enableLiveAutocompletion: true
})
