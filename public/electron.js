const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const { ipcMain } = require('electron');
const Database = require('./api/Database');
const Porn = require('./api/Porn');
const pornhub = require('@justalk/pornhub-api');
const { mainModule } = require('process');
const { strict } = require('assert');
const MainDB = new Database({name: 'pornsmain'});
ipcMain.on('getPornList', (event, arg) => {
  event.returnValue=MainDB.getPornList();
})
let mainWindow;
ipcMain.on('addPornAdding', (event, arg) => {
  console.log(arg);
  var temp2 = getArrayFromCommedString(arg[2].toString());
  var temp1 = getArrayFromCommedString(arg[1].toString());
  var artifact = new Porn(arg[0], temp2, temp1, arg[3]);
    if(!(MainDB.isPresent(artifact))){
      MainDB.addPorn(artifact);
      event.returnValue='ok';
    }else{
      event.returnValue='element already present';
    }
  })
  ipcMain.on('fetchUrlListAdding', async (event, arg) => {

    var i=0;
    while(i<arg.length){
      console.log(arg[i]);
      if((arg[i].toString().includes("http")&&arg[i].toString().includes("pornhub"))){
        const video = await pornhub.page(arg[i].toString(), ['title','tags','pornstars','thumbnail_url']);
        if(typeof video!=="undefined"){
        var artifact = new Porn(video.title, video.tags, video.pornstars, video.thumbnail_url);
        if(!(MainDB.isPresent(artifact))){
          MainDB.addPorn(artifact);
        }
        }
      }
      var str = '\nDone : '+ i+' of '+arg.length;
      mainWindow.webContents.send('fetchUrlListStatus', str);
      i++;
    }    mainWindow.webContents.send('updatePornList');

    mainWindow.webContents.send('fetchUrlListStatus', 'k');
    })

  ipcMain.on('updatePornList', (event, arg)=>{
    mainWindow.webContents.send('updatePornList');
  })
ipcMain.on('closeAddPornModal', (event, arg) => {
    mainWindow.webContents.send('closeAddPornModal');
  })
  ipcMain.on('closeFetchFromUrlModal', (event, arg) => {
      mainWindow.webContents.send('closeFetchFromUrlModal');
    })

  ipcMain.on('addPornFetch', async (event, arg) => {
    const url=arg;
    const video = await pornhub.page(url, ['title','tags','pornstars','thumbnail_url']);
    mainWindow.webContents.send('addPornFetched', video);
  })

  function getArrayFromCommedString(arg){
    var i = 0;
            var result = [];
            var temp = arg;
            while(i<temp.length){
                console.log(temp);
                console.log(temp.charAt(i));
                    if(temp.charAt(i)===','){
                        if(temp.charAt(i-1)===' '){
                            result=[...result, temp.slice(0, i-1)];
                        }else{
                            result=[...result, temp.slice(0, i)];
                        }
                        if(temp.charAt(i+1)===' '){
                            temp=temp.slice(i+2, temp.length); 
                        }else{
                            temp=temp.slice(i+1, temp.length); 
                        }
                        i=0;
                    }
                
                i++;
            }
            result=[...result, temp];
            return result;
}
function createWindow() {
  console.log("USERDATA IS");
  console.log(app.getPath('userData'));
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
