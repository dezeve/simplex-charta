const electron = require("electron");
const url = require("url");
const path = require("path");

const { app, BrowserWindow, Menu, ipcMain, Notification } = electron;

const NEW_WINDOW_NOTIFICATION_TITLE = "Error!"
const NEW_WINDOW_NOTIFICATION_BODY = "You cannot open multiple instances of this window"

let isNewTodoWindowOpened = false;

let mainWindow;

app.on("ready", () => {
    console.log("Platform=\t" + process.platform)

    console.log("App working");

    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    });

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, "../pages/index.html"),
            protocol: "file:",
            slashes: true
        })
    )

    const mainMenu = electron.Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);

    ipcMain.on("key: openNewTodoWindow", () => {
        newTodoWindow();
    })

    ipcMain.on("newTodo: close", () => {
        console.log("New Todo Window Closed!");
        addWindow.close();
        addWindow = 0;
    })

    mainWindow.on("close", () => {
        app.quit();
    })
});

const mainMenuTemplate = [
    {
        label: "Exit (CTRL + Q)",
        accelerator: "Ctrl+Q",
        role: "quit"
    },
    {
    label: "File",
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
                label: "Add New Todo",
                click() {
                    (!isNewTodoWindowOpened) ? newTodoWindow() : showWindowErrorNotification()
                    isNewTodoWindowOpened = true;
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
                focusedWindow.toggleDevTools();
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

function newTodoWindow() {
    addWindow = new BrowserWindow({
        width: 500,
        height: 250,
        title: "New Todo",
        webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true
        },
        resizable: false,
        frame: false
    })

    addWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, "../pages/newTodo.html"),
            protocol: "file:",
            slashes: true
        })
    )

    addWindow.on("close", () => {
        addWindow = null;
    })
}

function showWindowErrorNotification() {
    new Notification({
        title: NEW_WINDOW_NOTIFICATION_TITLE,
        body: NEW_WINDOW_NOTIFICATION_BODY
    }).show()
}
