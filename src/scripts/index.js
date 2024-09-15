const electron = require("electron")
const { ipcRenderer } = electron
const fs = require("fs")

ace.require("ace/ext/language_tools")

const editor = ace.edit("editor")
const fontSize = getFontSize()
const theme = getTheme()

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

ipcRenderer.on("key: setMode", (e, fileExtension) => {
    switch (fileExtension) {
        case ".js":
            editor.session.setMode("ace/mode/javascript")
            break;
        case ".html":
            editor.session.setMode("ace/mode/html")
            break;
        case ".py":
            editor.session.setMode("ace/mode/python")
            break;
        case ".css":
            editor.session.setMode("ace/mode/css")
            break;
        case ".php":
            editor.session.setMode("ace/mode/php")
            break;
        case ".java":
            editor.session.setMode("ace/mode/java")
            break;
        case ".json":
            editor.session.setMode("ace/mode/json")
            break;
        case ".txt":
            editor.session.setMode("ace/mode/text")
            break;
        default:
            ipcRenderer.send("key: showFileExtensionNotFound")
    }
})

ipcRenderer.on("key: undo", () => {
    editor.undo()
})

ipcRenderer.on("key: redo", () => {
    editor.redo()
})

ipcRenderer.on("key: gotoLine", () => {
    editor.execCommand("gotoline")
})

ipcRenderer.on("key: removeLine", () => {
    editor.execCommand("removeline")
})

ipcRenderer.on("key: toggleComment", () => {
    editor.execCommand("togglecomment")
})

ipcRenderer.on("key: find", () => {
    editor.execCommand("find")
})

ipcRenderer.on("key: selectAll", () => {
    editor.execCommand("selectall")
})

ipcRenderer.on("key: openSettings", () => {
    editor.execCommand("showSettingsMenu")
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
