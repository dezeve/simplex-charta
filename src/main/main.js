const electron = require("electron")
const url = require("url")
const fs = require("fs")

const path = require("path")

const { app, BrowserWindow, Menu, ipcMain, dialog } = electron

const isDarwin = process.platform === "darwin"

let isSettingsWindowOpened = false
let isFindAndReplaceWindowOpened = false
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
        findAndReplaceWindow.close()
        findAndReplaceWindow = 0
        isFindAndReplaceWindowOpened = false
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
    ...(isDarwin
        ? [{
            label: app.name,
            submenu: [
                { role: 'quit' }
            ]
        }]
        :
        []),
    {
        label: "File",
        submenu: [
            {
                label: "New",
                accelerator: isDarwin ? "Cmd+N" : "Ctrl+N",
                click() {
                    openNewFile()
                }
            },
            {
                label: "Open",
                accelerator: isDarwin ? "Cmd+O" : "Ctrl+O",
                click() {
                    openFile()
                }
            },
            {
                label: "Save",
                accelerator: isDarwin ? "Cmd+S" : "Ctrl+S",
                click() {
                    mainWindow.webContents.send("key: saveFile")
                }
            },
            {
                label: "Close",
                click() {
                    mainWindow.webContents.send("key: closeFile")
                    mainWindow.webContents.send("key: setTextMode")

                    isFileExists = false
                },
                accelerator: isDarwin ? "Cmd+W" : "Ctrl+W"
            },
            ...(isDarwin
                ? []
                :
                [{
                    label: "Exit",
                    accelerator: isDarwin ? "Cmd+Q" : "Ctrl+Q",
                    role: "quit"
                }]
            )
        ]
    },
    {
        label: "Edit",
        submenu: [
            {
                label: "Find and Replace",
                click() {
                    if (isFindAndReplaceWindowOpened) {
                        dialog.showErrorBox("Error", "This window already opened!")
                    } else {
                        openFindAndReplaceWindow()
                    }

                    isFindAndReplaceWindowOpened = true
                }
            },
            {
                label: "Go to Selected Line",
                click() {
                    if (isGotoSelectedLineWindowOpened) {
                        dialog.showErrorBox("Error", "This window already opened!")
                    } else {
                        openGotoSelectedLineWindow()
                    }

                    isGotoSelectedLineWindowOpened = true
                }
            }
        ]
    },
    ...(isDarwin
        ? [{
            label: "Settings",
            submenu: [
                {
                    label: "Open Settings",
                    click() {
                        if (isSettingsWindowOpened) {
                            dialog.showErrorBox("Error", "This window already opened!")
                        } else {
                            newSettingsWindow()
                        }
        
                        isSettingsWindowOpened = true
                    },
                    accelerator: "Cmd+D"
                }
            ]
        }]
        :
        [{
            label: "Settings",
            click() {
                if (isSettingsWindowOpened) {
                    dialog.showErrorBox("Error", "This window already opened!")
                } else {
                    newSettingsWindow()
                }

                isSettingsWindowOpened = true
            },
            accelerator: "Ctrl+D"
        }]
    ),
    {
        label: "Dev",
        submenu: [
            {
                label: "Dev Tools",
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools()
                },
                accelerator: isDarwin ? "Cmd+E" : "Ctrl+E"
            },
            {
                label: "Reload",
                accelerator: isDarwin ? "Cmd+R" : "Ctrl+R",
                role: "reload"
            }
        ]
    }
]

function newSettingsWindow() {
    settingsWindow = new BrowserWindow({
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

    settingsWindow.setMenu(null)

    settingsWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, "../pages/settings.html"),
            protocol: "file:",
            slashes: true
        })
    )

    settingsWindow.on("close", () => {
        settingsWindow = null
        isSettingsWindowOpened = false
    })
}

function openFindAndReplaceWindow() {
    findAndReplaceWindow = new BrowserWindow({
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

    findAndReplaceWindow.setMenu(null)

    findAndReplaceWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, "../pages/findAndReplace.html"),
            protocol: "file:",
            slashes: true
        })
    )

    findAndReplaceWindow.on("close", () => {
        findAndReplaceWindow = null
        isFindAndReplaceWindowOpened = false
    })
}

function openGotoSelectedLineWindow() {
    gotoSelectedLineWindow = new BrowserWindow({
        width: 350,
        height: 165,
        title: "Go to Selected Line",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        },
        resizable: false
    })

    gotoSelectedLineWindow.setMenu(null)

    gotoSelectedLineWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, "../pages/gotoSelectedLine.html"),
            protocol: "file:",
            slashes: true
        })
    )

    gotoSelectedLineWindow.on("close", () => {
        gotoSelectedLineWindow = null
        isGotoSelectedLineWindowOpened = false
    })
}

function openNewFile() {
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

function openFile() {
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
