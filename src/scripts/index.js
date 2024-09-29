const electron = require("electron")
const { ipcRenderer } = electron
const fs = require("fs")

ace.require("ace/ext/language_tools")

const config = JSON.parse(fs.readFileSync("src/config/config.json"))
const editor = ace.edit("editor")

var nativeSetOption = editor.setOption

editor.setTheme(config.theme)
editor.setFontSize(config.fontSize)
editor.session.setMode("ace/mode/text")

editor.setOptions({
    keyboardHandler: config.keyboardHandler,
    wrap: config.wrap,
    cursorStyle: config.cursorStyle,
    foldStyle: config.foldStyle,
    useSoftTabs: config.useSoftTabs,
    tabSize: config.tabSize,
    enableLiveAutocompletion: config.useLiveAutocompletion
})

ipcRenderer.on("key: openFile", (e, openedFileContent) => {
    editor.setValue(openedFileContent)
})

ipcRenderer.on("key: saveFile", () => {
    ipcRenderer.send("key: saveFile", editor.getValue())
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

function updateEditorTheme(selectedTheme, config) {
    config.theme = selectedTheme
    updateConfig(config)
}

function updateKeyboardHandler(selectedKeyboardHandler, config) {
    config.keyboardHandler = selectedKeyboardHandler
    updateConfig(config)
}

function updateEditorFontSize(selectedFontSize, config) {
    config.fontSize = selectedFontSize + "px"
    updateConfig(config)
}

function updateWrap(selectedWrap, config) {
    config.wrap = selectedWrap
    updateConfig(config)
}

function updateCursorStyle(selectedCursorStyle, config) {
    config.cursorStyle = selectedCursorStyle
    updateConfig(config)
}

function updateFoldStyle(selectedFoldStyle, config) {
    config.foldStyle = selectedFoldStyle
    updateConfig(config)
}

function updateSoftTabs(selectedValue, config) {
    config.useSoftTabs = selectedValue
    updateConfig(config)
}

function updateTabSize(selectedTabSize, config) {
    config.tabSize = selectedTabSize
    updateConfig(config)
}

function updateLiveAutocompletion(selectedValue, config) {
    config.useLiveAutocompletion = selectedValue
    updateConfig(config)
}

function updateConfig(config) {
    config = JSON.stringify(config, null, 2)
    fs.writeFileSync("src/config/config.json", config)
}

editor.setOption = function(key, value) {
    if (key === "theme") {
        updateEditorTheme(value, config)
    } else if (key === "keyboardHandler") {
        updateKeyboardHandler(value, config)
    } else if (key === "fontSize") {
        updateEditorFontSize(value, config)
    } else if (key === "wrap") {
        updateWrap(value, config)
    } else if (key === "cursorStyle") {
        updateCursorStyle(value, config)
    } else if (key === "foldStyle") {
        updateFoldStyle(value, config)
    } else if (key === "useSoftTabs") {
        updateSoftTabs(value, config)
    } else if (key === "tabSize") {
        updateTabSize(value, config)
    } else if (key === "enableLiveAutocompletion") {
        updateLiveAutocompletion(value, config)
    } 
    nativeSetOption.call(editor, key, value)
}
