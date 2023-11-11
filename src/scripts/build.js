const electron = require("electron")
const url = require("url")
const path = require("path")

const { app, BrowserWindow, Menu, ipcMain, Notification } = electron

const NEW_WINDOW_NOTIFICATION_TITLE = "Error!"
const NEW_WINDOW_NOTIFICATION_BODY = "You cannot open multiple instances of this window"

const ADD_TODO_SUCCESS_NOTIFICATION_TITLE= "Success!"
const ADD_TODO_SUCCESS_NOTIFICATION_BODY= "The new todo has been successfully saved"

let isNewAddTodoWindowOpened = false
let isNewTodoListOpened = false

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

    ipcMain.on("key: saveTodo", () => {
        showAddTodoSuccessNotification()
        newTodoWindow.close()
        isNewAddTodoWindowOpened = false
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
            label: "New"
        },
        {
            label: "Open"
        },
        {
            label: "Close"
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
