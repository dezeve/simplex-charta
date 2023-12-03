const electron = require("electron")
const url = require("url")
const path = require("path")

const fs = require("fs")

const { app, BrowserWindow, Menu, ipcMain, Notification, dialog } = electron

const NEW_WINDOW_NOTIFICATION_TITLE = "Error!"
const NEW_WINDOW_NOTIFICATION_BODY = "This window already opened"

const ADD_TODO_SUCCESS_NOTIFICATION_TITLE= "Success!"
const ADD_TODO_SUCCESS_NOTIFICATION_BODY= "The new todo has been successfully saved"

const TODO_DATA_ERROR_NOTIFICATION_TITLE = "Error!"
const TODO_DATA_ERROR_NOTIFICATION_BODY = "You cannot save todo items blankly"

let isNewAddTodoWindowOpened = false
let isNewTodoListOpened = false
let isAddSettingsWindowOpened = false
let isAddFindAndReplaceWindowOpened = false

let isFileExists = false
let existingFilePath

let mainWindow

app.on("ready", () => {
    console.log("Platform=\t" + process.platform)

    console.log("App working")

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

    ipcMain.on("key: closeNewTodo", () => {
        newTodoWindow.close()
        newTodoWindow = 0
        isNewAddTodoWindowOpened = false
    })

    ipcMain.on("key: closeTodoList", () => {
        todoListWindow.close()
        todoListWindow = 0
        isNewTodoListOpened = false
    })

    ipcMain.on("key: openAddTodo", () => {
        (!isNewAddTodoWindowOpened) ? newAddTodoWindow() : showWindowErrorNotification()
        isNewAddTodoWindowOpened = true
    })

    ipcMain.on("key: saveTodo", (err, data) => {
        if (data) {
          const todoData = JSON.parse(fs.readFileSync("src/database/todoData.json"))
      
          let todo = {
            text: data
          }
      
          todoData.todoItems.push(todo);
      
          fs.writeFile("src/database/todoData.json", JSON.stringify(todoData), (err) => {
            if (err) {
              throw err;
            }
      
            showAddTodoSuccessNotification()
            newTodoWindow.close()
            isNewAddTodoWindowOpened = false

            if(isNewTodoListOpened) {
                todoListWindow.reload()
            }

          });
        } else {
          showTodoDataErrorNotification();
        }
      });

      ipcMain.on("key: saveFile", (event, content) => {

        if(!isFileExists) {

            dialog.showSaveDialog({
                title: "Save File",
                filters:
              [
                  {name: "JavaScript Files", extensions: ["js"] },
                  {name: "HTML Files", extensions: ["html"]},
                  {name: "Python Files", extensions: ["py"]},
                  {name: "CSS Files", extensions: ["css"]},
                  {name: "PHP Files", extensions: ["php"]},
                  {name: "Java Files", extensions: ["java"]},
                  {name: "JSON Files", extensions: ["json"]},
                  {name: "Text Files", extensions: ["txt"]}
              ]
              }).then((result) => {
                
                if (result.canceled != true) {
                    
                  const fileExtension = path.extname(result.filePath);
      
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
      
      ipcMain.on("key: closeSettings", () => {
        addSettingsWindow.close()
        addSettingsWindow = 0
        isAddSettingsWindowOpened = false
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

      ipcMain.on("key: openFindAndReplace", () => {
        (!isAddFindAndReplaceWindowOpened) ? newFindAndReplaceWindow() : showWindowErrorNotification()
        isAddFindAndReplaceWindowOpened = true
      })

      ipcMain.on("key: closeFindAndReplace",  () => {
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

    mainWindow.on("close", () => {
        app.quit()
    })
})

const mainMenuTemplate = [
    {
        label: "Exit",
        accelerator: "Ctrl+Q",
        role: "quit"
    },
    {
    label: "File Options",
    submenu: [
            {
                label: "Open",
                accelerator: "Ctrl+O",
                click() {
                    dialog.showOpenDialog({
                        title: "Open File"
                    }).then((result) => {

                        if(result.canceled != true) {
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

                }
            }
        ]
    },
    {
        label: "Todo Options",
        submenu: [
            {
                label: "Open Todo List",
                click() {
                    (!isNewTodoListOpened) ? newTodoList() : showWindowErrorNotification()
                    isNewTodoListOpened = true
                }
            },
            {
                label: "Add New Todo",
                click() {
                    (!isNewAddTodoWindowOpened) ? newAddTodoWindow() : showWindowErrorNotification()
                    isNewAddTodoWindowOpened = true
                }
            }
        ]
    },
    {
        label: "Settings",
        click() {
            (!isAddSettingsWindowOpened) ? newSettingsWindow() : showWindowErrorNotification()
            isAddSettingsWindowOpened = true
        }
    },
    {
    label: "Dev Tools",
    submenu: [
        {
            label: "Open Dev Tools",
            click(item, focusedWindow) {
                focusedWindow.toggleDevTools()
            }
        },
        {
            label: "Refresh",
            accelerator: "Ctrl+R",
            role: "reload"
        }
    ]
    }
]

function newAddTodoWindow() {
    newTodoWindow = new BrowserWindow({
        width: 500,
        height: 200,
        title: "New Todo",
        webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true
        },
        resizable: false
    })

    newTodoWindow.setMenu(null)

    newTodoWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, "../pages/newTodo.html"),
            protocol: "file:",
            slashes: true
        })
    )

    newTodoWindow.on("close", () => {
        newTodoWindow = null
        isNewAddTodoWindowOpened = false
    })
}

function newTodoList() {
    todoListWindow = new BrowserWindow({
        width: 600,
        height: 600,
        title: "Todo List",
        webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true
        },
        resizable: false
    })

    todoListWindow.setMenu(null)

    todoListWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, "../pages/todoList.html"),
            protocol: "file:",
            slashes: true
        })
    )

    todoListWindow.on("close", () => {
        todoListWindow = null
        isNewTodoListOpened = false
    })
}

function newSettingsWindow() {
    addSettingsWindow = new BrowserWindow({
        width: 600,
        height: 625,
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
        width: 600,
        height: 400,
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

function showWindowErrorNotification() {
    new Notification({
        title: NEW_WINDOW_NOTIFICATION_TITLE,
        body: NEW_WINDOW_NOTIFICATION_BODY
    }).show()
}

function showAddTodoSuccessNotification() {
    new Notification({
        title: ADD_TODO_SUCCESS_NOTIFICATION_TITLE,
        body: ADD_TODO_SUCCESS_NOTIFICATION_BODY
    }).show()
}

function showTodoDataErrorNotification() {
    new Notification({
        title: TODO_DATA_ERROR_NOTIFICATION_TITLE,
        body: TODO_DATA_ERROR_NOTIFICATION_BODY
    }).show()
}
