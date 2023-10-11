const electron = require("electron");
const url = require("url");
const path = require("path");

const { app, BrowserWindow } = electron;

let mainWindow;

app.on("ready", () => {
    console.log("App working");

    mainWindow = new BrowserWindow({});

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, "../pages/indexPage.html"),
            protocol: "file:",
            slashes: true
        })
    )
});
