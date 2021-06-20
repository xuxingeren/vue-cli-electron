<template>
  <div class="shortcon">
    <div class="btn">
			<a-button type="primary" @click="globalShortcutClick"
      >{{ state.globalBind ? "取消" : "绑定" }}globalShortcut Ctrl+F</a-button
    >
		</div>
		<div class="box">
			<div class="webviewBox">
				<p>webview</p>
				<webview ref="webviewRef" class="webview" src="https://www.baidu.com" :preload="state.preload" ></webview>
			</div>
			<div class="iframeBox">
				<p>iframe</p>
				<iframe class="iframe" src="https://www.baidu.com" frameborder="0"></iframe>
			</div>
		</div>
  </div>
</template>

<script>
const { remote } = require('electron')
import {
  defineComponent,
  onMounted,
  onUnmounted,
  reactive,
  getCurrentInstance,
	ref
} from 'vue'
import Mousetrap from 'mousetrap'
const path = require('path')

export default defineComponent({
  setup() {
		const webviewRef = ref(null)
    const state = reactive({
      globalBind: false,
      preload: '',
    })
    const { proxy } = getCurrentInstance()
    const { $message } = proxy
    async function globalShortcutClick() {
      await window.ipcRenderer.invoke('win-globalShortcut', !state.globalBind);
      state.globalBind = !state.globalBind
    }
    function handleKeyPress(event) {
			$message.success(`keyup 监听${event.key}`)
    }
		function webMessage(event) {
      console.log('在此监听事件中接收webview嵌套页面所响应的事件', event)
			$message.success(`webview：${event.args[0].data}`)
    }
    onMounted(() => {
			const webview = webviewRef.value
			state.preload = path.resolve(remote.app.getAppPath(), './webviewPreload.js')
			webview.addEventListener('ipc-message', webMessage)
			// webview.addEventListener('dom-ready', () => {
      //   webview.openDevTools()
      // })
			Mousetrap.bind('ctrl+k', function() { 
				$message.success(`Mousetrap ctrl+k`)
			})
      window.addEventListener('keyup', handleKeyPress, true)
      window.ipcRenderer.on('renderer-globalShortcut', (_event, data) => {
        $message.success(`globalShortcut：${data}`)
      })
			window.ipcRenderer.on('renderer-before-input-event', (_event, data) => {
        $message.success(`before-input-event捕获${data}`)
      })
			window.ipcRenderer.on('renderer-localshortcut', (_event, data) => {
        $message.success(`localshortcut：${data}`)
      })
    })
    onUnmounted(() => {
      window.removeEventListener('keyup', handleKeyPress, true)
			Mousetrap.unbind('ctrl+k')
			webviewRef.value && webviewRef.value.removeEventListener('ipc-message', webMessage)
      window.ipcRenderer.removeAllListeners('renderer-globalShortcut')
			window.ipcRenderer.removeAllListeners('renderer-localshortcut')
			window.ipcRenderer.removeAllListeners('renderer-before-input-event')
    })
    return {
      state,
			webviewRef,
      globalShortcutClick,
    }
  }
})
</script>

<style lang="scss" scoped>
.shortcon {
	flex: 1;
	display: flex;
	flex-direction: column;
	.btn {
		flex: 0 0 100px;
	}
	.box {
		flex: 1;
		display: flex;
		.webviewBox, .iframeBox {
			flex: 0 0 50%;
			display: flex;
			flex-direction: column;
			p {
				font-size: 20px;
				text-align: center;
				color: red;
			}
		}
		.webview {
			flex: 1;
		}
		.iframe {
			flex: 1;
		}
	}
}
</style>