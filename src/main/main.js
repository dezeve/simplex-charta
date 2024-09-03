const electron = require("electron")
const url = require("url")
const fs = require("fs")

const path = require("path")

const { app, BrowserWindow, Menu, ipcMain, dialog } = electron

let isAddSettingsWindowOpened = false
let isAddFindAndReplaceWindowOpened = false
let isGotoSelectedLineWindowOpened = false

let isFileExists = false
let existingFilePath

let mainWindow

app.on("ready", () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    })

    mainWindow.setMinimumSize(500, 300)

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, "../pages/index.html"),
            protocol: "file:",
            slashes: true
        })
    )

    const mainMenu = electron.Menu.buildFromTemplate(mainMenuTemplate)
    Menu.setApplicationMenu(mainMenu)

    ipcMain.on("key: saveFile", (event, content) => {
        if (!isFileExists) {
            dialog.showSaveDialog({
                title: "Save File",
                filters:
                    [
                        { name: "JavaScript Files", extensions: ["js"] },
                        { name: "HTML Files", extensions: ["html"] },
                        { name: "Python Files", extensions: ["py"] },
                        { name: "CSS Files", extensions: ["css"] },
                        { name: "PHP Files", extensions: ["php"] },
                        { name: "Java Files", extensions: ["java"] },
                        { name: "JSON Files", extensions: ["json"] },
                        { name: "Text Files", extensions: ["txt"] }
                    ]
            }).then((result) => {
                if (result.canceled != true) {
                    const fileExtension = path.extname(result.filePath)

                    switch (fileExtension) {
                        case ".js":
                            mainWindow.webContents.send("key: setJavaScriptMode")
                            break;
                        case ".html":
                            mainWindow.webContents.send("key: setHTMLMode")
                            break;
                        case ".py":
                            mainWindow.webContents.send("key: setPythonMode")
                            break;
                        case ".css":
                            mainWindow.webContents.send("key: setCSSMode")
                            break;
                        case ".php":
                            mainWindow.webContents.send("key: setPHPMode")
                            break;
                        case ".java":
                            mainWindow.webContents.send("key: setJavaMode")
                            break;
                        case ".json":
                            mainWindow.webContents.send("key: setJSONMode")
                            break;
                        case ".txt":
                            mainWindow.webContents.send("key: setTextMode")
                            break;
                        default:
                            mainWindow.webContents.send("key: setTextMode")
                    }
                    fs.writeFileSync(result.filePath, content)
                    existingFilePath = result.filePath
                    isFileExists = true
                }
            })
        } else {
            fs.writeFileSync(existingFilePath, content)
        }
    })

    ipcMain.on("key: updateEditorTheme", (e, selectedUpdateTheme) => {
        mainWindow.webContents.send("key: updateEditorTheme", selectedUpdateTheme)
    })

    ipcMain.on("key: updateFontSize", (e, selectedFontSize) => {
        mainWindow.webContents.send("key: updateEditorFontSize", selectedFontSize)
    })

    ipcMain.on("key: showFontSizeError", () => {
        dialog.showErrorBox("Error", "Invalid font size!")
    })

    ipcMain.on("key: closeFindAndReplace", () => {
        addFindAndReplaceWindow.close()
        addFindAndReplaceWindow = 0
        isAddFindAndReplaceWindowOpened = false
    })

    ipcMain.on("key: doFindAndReplace", (err, data) => {
        mainWindow.webContents.send("key: findAndReplace", data)
    })

    ipcMain.on("key: showFindAndReplaceError", () => {
        dialog.showErrorBox("Error", "Invalid find value!")
    })

    ipcMain.on("key: gotoLine", (err, data) => {
        mainWindow.webContents.send("key: doGotoLine", data)
    })

    ipcMain.on("key: showGotoLineError", () => {
        dialog.showErrorBox("Error", "Invalid line number!")
    })

    mainWindow.on("close", () => {
        app.quit()
    })
})

const mainMenuTemplate = [
    {
        label: "File",
        submenu: [
            {
                label: "New",
                accelerator: "Ctrl+N",
                click() {
                    dialog.showSaveDialog({
                        title: "New File",
                        filters: [
                            { name: "All Files", extensions: ["*"] }
                        ]
                    }).then(result => {
                        if (!result.canceled) {
                            const filePath = result.filePath
                            fs.writeFileSync(filePath, "")

                            const fileExtension = path.extname(result.filePath)

                            switch (fileExtension) {
                                case ".js":
                                    mainWindow.webContents.send("key: setJavaScriptMode")
                                    break;
                                case ".html":
                                    mainWindow.webContents.send("key: setHTMLMode")
                                    break;
                                case ".py":
                                    mainWindow.webContents.send("key: setPythonMode")
                                    break;
                                case ".css":
                                    mainWindow.webContents.send("key: setCSSMode")
                                    break;
                                case ".php":
                                    mainWindow.webContents.send("key: setPHPMode")
                                    break;
                                case ".java":
                                    mainWindow.webContents.send("key: setJavaMode")
                                    break;
                                case ".json":
                                    mainWindow.webContents.send("key: setJSONMode")
                                    break;
                                case ".txt":
                                    mainWindow.webContents.send("key: setTextMode")
                                    break;
                                default:
                                    dialog.showErrorBox("Error", "The program could not recognize the file extension and will run in Plain text mode.")
                                    mainWindow.webContents.send("key: setTextMode")
                            }

                            isFileExists = true
                            existingFilePath = result.filePath
                        }
                    })
                }
            },
            {
                label: "Open",
                accelerator: "Ctrl+O",
                click() {
                    dialog.showOpenDialog({
                        title: "Open File"
                    }).then((result) => {
                        if (result.canceled != true) {
                            const fileExtension = path.extname(result.filePaths[0]).toString()

                            switch (fileExtension) {
                                case ".js":
                                    mainWindow.webContents.send("key: setJavaScriptMode")
                                    break;
                                case ".html":
                                    mainWindow.webContents.send("key: setHTMLMode")
                                    break;
                                case ".py":
                                    mainWindow.webContents.send("key: setPythonMode")
                                    break;
                                case ".css":
                                    mainWindow.webContents.send("key: setCSSMode")
                                    break;
                                case ".php":
                                    mainWindow.webContents.send("key: setPHPMode")
                                    break;
                                case ".java":
                                    mainWindow.webContents.send("key: setJavaMode")
                                    break;
                                case ".json":
                                    mainWindow.webContents.send("key: setJSONMode")
                                    break;
                                case ".txt":
                                    mainWindow.webContents.send("key: setTextMode")
                                    break;
                                default:
                                    dialog.showErrorBox("Error", "The program could not recognize the file extension and will run in Plain text mode.")
                                    mainWindow.webContents.send("key: setTextMode")
                            }

                            const openedFileContent = fs.readFileSync(result.filePaths[0]).toString()
                            mainWindow.webContents.send("key: openFile", openedFileContent)

                            isFileExists = true
                            existingFilePath = result.filePaths[0].toString()
                        }
                    })
                }
            },
            {
                label: "Save",
                accelerator: "Ctrl+S",
                click() {
                    mainWindow.webContents.send("key: saveFile")
                }
            },
            {
                label: "Close",
                click() {
                    mainWindow.webContents.send("key: closeFile")
                    isFileExists = false
                    mainWindow.webContents.send("key: setTextMode")
                },
                accelerator: "Ctrl+W"
            },
            {
                label: "Exit",
                accelerator: "Ctrl+Q",
                role: "quit"
            }
        ]
    },
    {
        label: "Edit",
        submenu: [
            {
                label: "Find and Replace",
                click() {
                    if (isAddFindAndReplaceWindowOpened) {
                        dialog.showErrorBox("Error", "This window already opened!")
                    } else {
                        newFindAndReplaceWindow()
                    }

                    isAddFindAndReplaceWindowOpened = true
                }
            },
            {
                label: "Go to Selected Line",
                click() {
                    if (isGotoSelectedLineWindowOpened) {
                        dialog.showErrorBox("Error", "This window already opened!")
                    } else {
                        newGotoSelectedLineWindow()
                    }

                    isGotoSelectedLineWindowOpened = true
                }
            }
        ]
    },
    {
        label: "Settings",
        click() {
            if (isAddSettingsWindowOpened) {
                dialog.showErrorBox("Error", "This window already opened!")
            } else {
                newSettingsWindow()
            }

            isAddSettingsWindowOpened = true
        }
    },
    {
        label: "Dev",
        submenu: [
            {
                label: "Dev Tools",
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools()
                },
                accelerator: "Ctrl+E"
            },
            {
                label: "Reload",
                accelerator: "Ctrl+R",
                role: "reload"
            }
        ]
    }
]

function newSettingsWindow() {
    addSettingsWindow = new BrowserWindow({
        width: 450,
        height: 300,
        title: "Settings",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        },
        resizable: false
    })

    addSettingsWindow.setMenu(null)

    addSettingsWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, "../pages/settings.html"),
            protocol: "file:",
            slashes: true
        })
    )

    addSettingsWindow.on("close", () => {
        addSettingsWindow = null
        isAddSettingsWindowOpened = false
    })
}

function newFindAndReplaceWindow() {
    addFindAndReplaceWindow = new BrowserWindow({
        width: 400,
        height: 250,
        title: "Find and Replace",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        },
        resizable: false
    })

    addFindAndReplaceWindow.setMenu(null)

    addFindAndReplaceWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, "../pages/findAndReplace.html"),
            protocol: "file:",
            slashes: true
        })
    )

    addFindAndReplaceWindow.on("close", () => {
        addFindAndReplaceWindow = null
        isAddFindAndReplaceWindowOpened = false
    })
}

function newGotoSelectedLineWindow() {
    addGotoSelectedLineWindow = new BrowserWindow({
        width: 350,
        height: 175,
        title: "Go to Selected Line",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        },
        resizable: false
    })

    addGotoSelectedLineWindow.setMenu(null)

    addGotoSelectedLineWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, "../pages/gotoSelectedLine.html"),
            protocol: "file:",
            slashes: true
        })
    )

    addGotoSelectedLineWindow.on("close", () => {
        addGotoSelectedLineWindow = null
        isGotoSelectedLineWindowOpened = false
    })
}
