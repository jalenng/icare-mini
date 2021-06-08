const { ipcMain } = require('electron')

const { timerSystem, breakSystem, blockerSystem } = require('../systems/systems')

/* ------------------------------------------------------------------------- */
/* System-related */

// Reset the timer
ipcMain.handle('timer-reset', () => {
  timerSystem.reset()
})

// End the timer (and start the break)
ipcMain.handle('timer-end', () => {
  timerSystem.end()
})

// Toggle pause/play
ipcMain.handle('timer-toggle', () => {
  timerSystem.togglePause()
})

// Block the timer from running
ipcMain.handle('timer-block', () => {
  timerSystem.block()
})

// Get break status
ipcMain.on('get-break-status', (event) => {
  event.reply('receive-break-status', breakSystem.getStatus())
})

// Play sound file
ipcMain.handle('play-sound', () => {
  breakSystem.playSound()
})

// Get list of open windows
ipcMain.on('get-open-windows', async (event) => {
  event.returnValue = global.systems.appSnapshot.getLastSnapshot()
})

// Get timer status
ipcMain.on('get-blockers', (event) => {
  event.reply('receive-blockers', blockerSystem.getBlockers())
})

// Clear blockers
ipcMain.handle('clear-blockers', () => {
  blockerSystem.clear()
})
