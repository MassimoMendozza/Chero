const { app, BrowserWindow, Main, ipcRenderer } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const { ipcMain } = require('electron');
const Database = require('./api/Database');
const Porn = require('./api/Porn');
const pornhub = require('@justalk/pornhub-api');
const xvideos = require('@rodrigogs/xvideos');
const { mainModule } = require('process');
const { strict } = require('assert');
const brain = require('brain.js');
const MainDB = new Database({ name: 'pornsmain' });

var playermode = 0; //0=random 1=model
var pornList = MainDB.getPornList();
var net = new brain.NeuralNetwork({
  hiddenLayers:[4]
});
var evaluatedArray = [];
var seenPornlist = [];

ipcMain.on('getPornList', (event, arg) => {
  event.returnValue = MainDB.getPornList();
})

ipcMain.on('minimize', (event,arg)=>{
  mainWindow.minimize();
})

ipcMain.on('maximize', (event, args)=>{
  console.log('bro');
  mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
})


ipcMain.on('close', (event, args)=>{
  mainWindow.close();
})

let mainWindow;
ipcMain.on('addPornAdding', (event, arg) => {
  var temp2 = getArrayFromCommedString(arg[2].toString());
  var temp1 = getArrayFromCommedString(arg[1].toString());
  var artifact = new Porn(arg[0], temp2, temp1, arg[3], arg[4]);
  if (!(MainDB.isPresent(artifact))) {
    console.log('made check');
    MainDB.addPorn(artifact);
    console.log('porn added');
    event.returnValue = 'ok';
  } else {
    event.returnValue = 'element already present';
  }
})
ipcMain.on('fetchUrlListAdding', async (event, arg) => {

  var i = 0;
  while (i < arg.length) {
    if ((arg[i].toString().includes("http") && arg[i].toString().includes("pornhub"))) {
      const video = await pornhub.page(arg[i].toString(), ['title', 'tags', 'thumbnail_url']);
      var pornstars = await pornhub.page(arg[i].toString(), ['pornstars']);
      if (pornstars.error === "An error occured") {
        pornstars = [];
      }
      if (video.error !== "An error occured") {
        var artifact = new Porn(video.title, video.tags, pornstars, video.thumbnail_url, arg[i].toString());
        if (!(MainDB.isPresent(artifact))) {
          MainDB.addPorn(artifact);
        }
      }
    }
    var str = '\nDone : ' + i + ' of ' + arg.length;
    mainWindow.webContents.send('fetchUrlListStatus', str);
    i++;
  } mainWindow.webContents.send('updatePornList');

  mainWindow.webContents.send('fetchUrlListStatus', 'k');
})

ipcMain.on('updatePornList', (event, arg) => {
  mainWindow.webContents.send('updatePornList');
})
ipcMain.on('closeAddPornModal', (event, arg) => {
  mainWindow.webContents.send('closeAddPornModal');
})
ipcMain.on('closeFetchFromUrlModal', (event, arg) => {
  mainWindow.webContents.send('closeFetchFromUrlModal');
})

ipcMain.on('addPornFetch', async (event, arg) => {
  const url = arg;
  if (arg.includes("pornhub.com")) {
    var video = await pornhub.page(url, ['title', 'tags', 'thumbnail_url']);
    var pornstars = await pornhub.page(arg, ['pornstars']);
    if (pornstars.error === "An error occured") {
      video.pornstars = [];
    } else {
      video.pornstars = pornstars.pornstars;
    }
  } else if (arg.includes("xvideos.com")) {
    const details = await xvideos.videos.details({ url: arg });
    var video = {};
    video['title'] = details['title'];
    video['thumbnail_url'] = details['image'];
    video['pornstars'] = video['tags'] = [];
  }
  mainWindow.webContents.send('addPornFetched', video);
})

ipcMain.on('openPlayer', (event, arg) => {
  if (MainDB.getHistorySize() === 0) {
    var rndPorn = pornList[Math.floor(Math.random() * pornList.length)];
    seenPornlist.push(rndPorn.hashID);
    event.sender.send('pornToWatch', rndPorn);
  } else {
    evaluate(arg[0], arg[1]);
    event.sender.send('pornToWatch', getNetPorn());
  }
})

ipcMain.on('wrongClick', (event, arg) => {
  var now = new Date();
  var start = new Date(now.getFullYear(), 0, 0);
  var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  var oneDay = 1000 * 60 * 60 * 24;
  var day = Math.floor(diff / oneDay);
  var weekDay = now.getDay();
  weekDay++;
  var minutes = (now.getHours() * 60) + now.getMinutes() + 1;
  MainDB.addHistory(arg[0], arg[1], arg[2], day / 366, weekDay / 7, minutes / 1440, 0);
  console.log(MainDB.getTrainArrayFromHistory());
  evaluate(arg[1], arg[2]);
  event.sender.send('pornToWatch', getNetPorn());
})

ipcMain.on('orgasmClick', (event, arg) => {
  var now = new Date();
  var start = new Date(now.getFullYear(), 0, 0);
  var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  var oneDay = 1000 * 60 * 60 * 24;
  var day = Math.floor(diff / oneDay);
  var weekDay = now.getDay();
  weekDay++;
  var minutes = (now.getHours() * 60) + now.getMinutes() + 1;
  MainDB.addHistory(arg[0], arg[1], arg[2], day / 366, weekDay / 7, minutes / 1440, 1);
  event.sender.send('came');
})

ipcMain.on('trainNet', (event, arg) => {
  net.train(MainDB.getTrainArrayFromHistory());
  console.log('done');
})

function evaluate(moods, values) {
  net.train(MainDB.getTrainArrayFromHistory(),
  {
    // Defaults values --> expected validation
    iterations: 20000, // the maximum times to iterate the training data --> number greater than 0
    errorThresh: 0.005, // the acceptable error percentage from training data --> number between 0 and 1
    log: false, // true to use console.log, when a function is supplied it is used --> Either true or a function
    logPeriod: 10, // iterations between logging out --> number greater than 0
    learningRate: 0.3, // scales with delta to effect training rate --> number between 0 and 1
    momentum: 0.1, // scales with next layer's change value --> number between 0 and 1
    callback: null, // a periodic call back that can be triggered while training --> null or function
    callbackPeriod: 10, // the number of iterations through the training data between callback calls --> number greater than 0
    timeout: Infinity, // the max number of milliseconds to train for --> number greater than 0
  }
  );
  var now = new Date();
  var start = new Date(now.getFullYear(), 0, 0);
  var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  var oneDay = 1000 * 60 * 60 * 24;
  var day = Math.floor(diff / oneDay);
  var weekDay = now.getDay();
  weekDay++;
  var minutes = (now.getHours() * 60) + now.getMinutes() + 1;
  var ev = MainDB.getEvaluateArray(moods, values, weekDay / 7, day / 366, minutes / 1440);
  evaluatedArray = [];
  for (var i = 0; i < ev.length; i++) {
    evaluatedArray[i] = {
      hashID: ev[i].hashID,
      outcome: net.run(ev[i].evaluateObj).outcome
    };
  }
  evaluatedArray.sort((a, b) => parseFloat(b.outcome) - parseFloat(a.outcome));
  console.log('done');
}

function getNetPorn() {
  if (seenPornlist.length === evaluatedArray.length) {
    seenPornlist = []
  }console.log('seen');
  console.log(seenPornlist);
  console.log('eva');
  console.log(evaluatedArray);

  for (var i = 0; i < evaluatedArray.length; i++) {
    if (!(seenPornlist.includes(evaluatedArray[i].hashID))) {
      seenPornlist.push(evaluatedArray[i].hashID);
      console.log(evaluatedArray[i]);
      return MainDB.getPornFromHash(evaluatedArray[i].hashID);
    }
  }
}

ipcMain.on('evaluateNet', (event, arg) => {
  console.log(evaluatedArray);
})

function getArrayFromCommedString(arg) {
  var i = 0;
  var result = [];
  var temp = arg;
  while (i < temp.length) {
    if (temp.charAt(i) === ',') {
      if (temp.charAt(i - 1) === ' ') {
        result = [...result, temp.slice(0, i - 1)];
      } else {
        result = [...result, temp.slice(0, i)];
      }
      if (temp.charAt(i + 1) === ' ') {
        temp = temp.slice(i + 2, temp.length);
      } else {
        temp = temp.slice(i + 1, temp.length);
      }
      i = 0;
    }

    i++;
  }
  result = [...result, temp];
  return result;
}
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    minheight: 1024,
    minwidth: 768,
    'min-Height': 800,
    'min-Width': 600,
    show: false,
    frame: false,
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
