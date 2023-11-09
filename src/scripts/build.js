const electron = require("electron");
const url = require("url");
const path = require("path");

const { app, BrowserWindow, Menu, ipcMain } = electron;

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

    ipcMain.on("key: sendValue", (err, data) => {
        console.log(data)
    })

    ipcMain.on("key: openNewWindow", () => {
        console.log("Window Opened!");
        newWindow();
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

function newWindow() {
    addWindow = new BrowserWindow({
        width: 400,
        height: 400,
        title: "New Window",
        webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true
        }
    })

    addWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, "../pages/new.html"),
            protocol: "file:",
            slashes: true
        })
    )

    addWindow.on("close", () => {
        addWindow = null;
    })
}
