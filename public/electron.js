const {
    BrowserWindow,
    Tray,
    Menu,
    nativeImage,
    nativeTheme,
    app,
} = require('electron');
const path = require('path');

const isDev = require('electron-is-dev');
const isMacOS = process.platform === 'darwin';

const { createWindow } = require('./createWindows');

/* Initialize the stores and systems */
require('./store');
require('./initializeSystems');

require('./ipcHandlers');

/* References to windows */
global.mainWindow;
global.prefsWindow;


/*---------------------------------------------------------------------------*/
/* Mechanism to allow only one instance of the app at once */

// Try to get the lock
const gotSingleInstanceLock = app.requestSingleInstanceLock()
if (!gotSingleInstanceLock) app.exit()

// Show first instance if a second instance is requested
app.on('second-instance', () => {
    if (global.mainWindow && !global.mainWindow.isDestroyed()) {
        global.mainWindow.restore()
        global.mainWindow.focus()
    }
})


/*---------------------------------------------------------------------------*/
/* Configure login item settings */

app.setLoginItemSettings({
    openAtLogin: global.store.get('preferences.startup.startAppOnLogin'),
    enabled: global.store.get('preferences.startup.startAppOnLogin'),
    path: app.getPath('exe')
})


/*---------------------------------------------------------------------------*/
/* Application event handlers */
let appTray = null;

app.whenReady().then(() => {

    global.mainWindow = createWindow('main');

    // Pin main window if option is enabled
    global.mainWindow.setAlwaysOnTop(store.get('preferences.appearance.alwaysOnTop'));

    /* When app is activated and no windows are open, create a window */
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

    /* Create tray button */

    // Function to get path of icon file
    const getTrayImage = function() {

        // Calculate percentage
        const timerStatus = global.timerSystem.getStatus();
        const percentage = timerStatus.remainingTime / timerStatus.totalDuration * 100;
        const percentageMultOfFive = Math.round(percentage / 5) * 5;

        const folder = isMacOS 
            ? 'template'
            : nativeTheme.shouldUseDarkColors
                ? 'white'
                : 'black'; 

        const imagePath = (path.join(__dirname, `../tray_assets/${folder}/${percentageMultOfFive}.png`));

        return nativeImage.createFromPath(imagePath);
    }
    
    const contextMenu = Menu.buildFromTemplate([
        { label: 'iCare', enabled: false },
        { type: 'separator' },
        { label: 'Quit', click: app.exit }
    ]);

    appTray = new Tray(getTrayImage());
    appTray.setToolTip('iCare');
    appTray.setContextMenu(contextMenu);
    appTray.on('click', () => {
        global.mainWindow.show();
        global.mainWindow.focus();
    });

    // Update system tray icon on an interval
    setInterval(() => {        
        appTray.setImage(getTrayImage());

    }, 5000);

})

/* Handle closing all windows behavior for macOS */
app.on('window-all-closed', function () {
    if (isMacOS) app.exit();
})

/* Prevent loading of new websites */
app.on('web-contents-created', (event, contents) => {
    contents.on('will-navigate', (event, navigationUrl) => {
        event.preventDefault()
    })
})


/*---------------------------------------------------------------------------*/
/* Menu */
/*
- File
    * Preferences (Ctrl+,)
    * Close (Alt+F4)
- Dev
    * Reload (Ctrl+R)
    * Force Reload (Ctrl+Shift+R)
    * Toggle Developer Tools (Ctrl+Shift+I)
- Help (F1)
    * About iCare

*/

const menu = Menu.buildFromTemplate([
    {
        label: 'File',
        submenu: [
            {
                label: 'Preferences',
                accelerator: 'CmdOrCtrl+,',
                click: () => {
                    if (!global.prefsWindow || global.prefsWindow.isDestroyed())
                        global.prefsWindow = createWindow('preferences', 'prefs');
                    else {
                        global.prefsWindow.restore();
                        global.prefsWindow.focus();
                    }
                }
            },
            { type: 'separator' },
            { role: 'close' }
        ]
    },
    ... (isDev ? [
        {
            label: 'Dev',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
            ]
        }
    ] : []),
    {
        role: 'help',
        submenu: [
            {
                label: 'About',
                click: async () => {
                    const { shell } = require('electron')
                    await shell.openExternal('https://electronjs.org')
                }
            }
        ]
    },
])
Menu.setApplicationMenu(menu)



/*---------------------------------------------------------------------------*/
/* Theming */

// Update the Electron themeSource property
nativeTheme.themeSource = store.get('preferences.appearance.theme');

// Notify WebContents when the theme changes
nativeTheme.on('updated', () => {
    const themeName = nativeTheme.shouldUseDarkColors ? 'dark' : 'light';

    if (global.mainWindow && !global.mainWindow.isDestroyed())
        global.mainWindow.webContents.send('theme-updated', themeName);

    if (global.prefsWindow && !global.prefsWindow.isDestroyed())
        global.prefsWindow.webContents.send('theme-updated', themeName);
})