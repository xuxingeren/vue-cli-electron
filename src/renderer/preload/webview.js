const { ipcRenderer } = require('electron')
window.addEventListener('keyup', handleKeyPress, true)
function handleKeyPress(event) {
	console.log(event.key)
	ipcRenderer.sendToHost('ipc-message', {
		data: event.key
	})
}