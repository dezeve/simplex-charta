const electron = require("electron")
const { ipcRenderer } = electron

const findValue = document.querySelector("#findValue")
const replaceValue = document.querySelector("#replaceValue")
const closeFindAndReplace = document.querySelector("#closeFindAndReplace")
const doFindAndReplace = document.querySelector("#doFindAndReplace")
