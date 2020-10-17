const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const { ipcMain } = require('electron');
const Database = require('./api/Database');
const Porn = require('./api/Porn');
const pornhub = require('@justalk/pornhub-api');
const { mainModule } = require('process');
const MainDB = new Database({name: 'pornsmain'});
ipcMain.on('getPornList', (event, arg) => {
  event.returnValue=MainDB.getPornList();
})
let mainWindow;
ipcMain.on('addPornAdding', (event, arg) => {
  console.log(arg);
  var artifact = new Porn(arg[0], arg[2], arg[1], arg[3]);
    if(!(MainDB.isPresent(artifact))){
      MainDB.addPorn(artifact);
      event.returnValue='ok';
    }else{
      event.returnValue='element already present';
    }
  })

  ipcMain.on('updatePornList', (event, arg)=>{
    mainWindow.webContents.send('updatePornList');
  })
ipcMain.on('closeAddPornModal', (event, arg) => {
    mainWindow.webContents.send('closeAddPornModal');
  })

  ipcMain.on('addPornFetch', async (event, arg) => {
    const url=arg;
    const video = await pornhub.page(url, ['title','tags','pornstars','thumbnail_url']);
    mainWindow.webContents.send('addPornFetched', video);
  })

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        minheight: 800,
        minwidth: 600,
        show: false,  
        frame:false,
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true,   
        }
    });
    const startURL = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`;

    mainWindow.loadURL(startURL);
    mainWindow.setMenu(null);
    mainWindow.webContents.openDevTools();
    mainWindow.once('ready-to-show', () => mainWindow.show());
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}
app.on('ready', createWindow);
