const electron = require("electron")
const { ipcRenderer } = electron
const fs = require("fs")

ace.require("ace/ext/language_tools")

const editor = ace.edit("editor")
const fontSize = getFontSize()
const theme = getTheme()

const gotoLineOffcanvas = document.getElementById("gotoLineOffcanvas")
const offcanvas = new bootstrap.Offcanvas(gotoLineOffcanvas)
const gotoLineInput = document.getElementById("gotoLineInput")
const gotoLineButton = document.getElementById("gotoLineButton")

var nativeSetOption = editor.setOption

editor.setTheme(theme)
editor.setFontSize(fontSize)
editor.session.setMode("ace/mode/text")

editor.setOptions({
    enableLiveAutocompletion: true
})

ipcRenderer.on("key: openFile", (event, openedFileContent) => {
    editor.setValue(openedFileContent)
})

ipcRenderer.on("key: saveFile", () => {
    const content = editor.getValue()
    ipcRenderer.send("key: saveFile", content)
})

ipcRenderer.on("key: closeFile", () => {
    editor.setValue(null)
})

ipcRenderer.on("key: setJavaScriptMode", () => {
    editor.session.setMode("ace/mode/javascript")
})

ipcRenderer.on("key: setHTMLMode", () => {
    editor.session.setMode("ace/mode/html")
})

ipcRenderer.on("key: setPythonMode", () => {
    editor.session.setMode("ace/mode/python")
})

ipcRenderer.on("key: setCSSMode", () => {
    editor.session.setMode("ace/mode/css")
})

ipcRenderer.on("key: setPHPMode", () => {
    editor.session.setMode("ace/mode/php")
})

ipcRenderer.on("key: setJavaMode", () => {
    editor.session.setMode("ace/mode/java")
})

ipcRenderer.on("key: setJSONMode", () => {
    editor.session.setMode("ace/mode/json")
})

ipcRenderer.on("key: setTextMode", () => {
    editor.session.setMode("ace/mode/text")
})

ipcRenderer.on("key: gotoLine", () => {
    offcanvas.show()
})

ipcRenderer.on("key: undo", () => {
    editor.undo()
})

ipcRenderer.on("key: redo", () => {
    editor.redo()
})

ipcRenderer.on("key: removeLine", () => {
    editor.execCommand("removeline")
})

ipcRenderer.on("key: toggleComment", () => {
    editor.execCommand("togglecomment")
})

ipcRenderer.on("key: doSearchAndReplace", () => {
    editor.execCommand("find")
})

ipcRenderer.on("key: selectAll", () => {
    editor.execCommand("selectall")
})

ipcRenderer.on("key: openSettings", () => {
    editor.execCommand("showSettingsMenu")
})

gotoLineButton.addEventListener("click", () => {
    if (!isNaN(gotoLineInput.value - gotoLineInput.value) && gotoLineInput.value.trim() !== "") {
        editor.gotoLine(gotoLineInput.value)
    }
})

function getFontSize() {
    const fontSize = JSON.parse(fs.readFileSync("src/config/config.json")).fontSize
    return fontSize
}

function getTheme() {
    const config = JSON.parse(fs.readFileSync("src/config/config.json"))
    return config.theme
}

function updateEditorTheme(selectedTheme) {
    const config = JSON.parse(fs.readFileSync("src/config/config.json"))
    config.theme = selectedTheme
    const updatedConfig = JSON.stringify(config, null, 2)
    fs.writeFileSync("src/config/config.json", updatedConfig)
}

function updateEditorFontSize(selectedFontSize) {
    const config = JSON.parse(fs.readFileSync("src/config/config.json"))
    config.fontSize = selectedFontSize + "px"
    const updatedConfig = JSON.stringify(config, null, 2)
    fs.writeFileSync("src/config/config.json", updatedConfig)
}

editor.setOption = function(key, value) {
    if (key === "theme") {
        updateEditorTheme(value)
    } else if (key === "fontSize") {
        updateEditorFontSize(value)
    }
    nativeSetOption.call(editor, key, value)
}
