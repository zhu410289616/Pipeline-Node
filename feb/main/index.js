const {app} = require('electron')
const {ipcMain} = require('electron')

//https://github.com/sindresorhus/electron-store
const Store = require('electron-store')
const store = new Store()
//https://github.com/megahertz/electron-log
const log = require('electron-log');

ipcMain.on('send', function (event, data) {
    console.log(data)
    event.sender.send('reply', '接收到事件后进行回复')
})

// log.info('Hello, log');
// log.warn('Some problem appears');

store.set('unicorn', '🦄');
console.log(store.get('unicorn'));
//=> '🦄'

// Use dot-notation to access nested properties
store.set('foo.bar', true);
console.log(store.get('foo'));
//=> {bar: true}

store.delete('unicorn');
console.log(store.get('unicorn'));
//=> undefined

store.set('test-key', 'test-value');
store.set('foo.bar', true)

app.on('ready', () => {
    console.log('app ready')
})


