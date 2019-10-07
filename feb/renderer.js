// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { ipcRenderer } = require('electron')

const { remote } = require("electron"); // 获取remote模块
const { BrowserWindow } = remote; // 从remote当中获取BrowserWindow

// const browserWindow = new BrowserWindow(); // 实例化获取的BrowserWindow

ipcRenderer.send('send', '发送数据')
ipcRenderer.on('reply', function (event, data) {
    console.log('主进程回复过来的数据' + data)
})