const electronLocalshortcut = require('electron-localshortcut')

export function register(win, key, cb) {
	electronLocalshortcut.register(win, key, () => {
		cb()
	})
}

export function isRegistered(win, key) {
	return electronLocalshortcut.isRegistered(win, key)
}

export function unregister(win, key) {
	electronLocalshortcut.unregister(win, key)
}

export function unregisterAll(win) {
	electronLocalshortcut.unregisterAll(win)
}