<template>
  <div class="localFile">
    <div class="header">
      <a-button type="primary" @click="download('https://xuxinblog.oss-cn-qingdao.aliyuncs.com/blog/2021/04/22/1.png')">点击下载图片</a-button>
      <a-upload
        :customRequest="customRequest"
        name="file"
        :showUploadList="false"
        :multiple="true"
      >
        <a-button>
          <upload-outlined></upload-outlined>
          添加本地音乐
        </a-button>
      </a-upload>
    </div>
    <div class="box">
      <div class="imgBox">
        <span>本地图片加载</span>
        <a-image
          :width="200"
          :height="200"
          :src="state.image"
          fallback="data:image/png;base64,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"
        />
      </div>
      <div class="audioBox">
        <div id="waveform"></div>
        <div class="btns">
          <a-button
            type="primary"
            shape="circle"
            @click="play"
            :disabled="state.audioStatus === 'loading'"
          >
            <template #icon>
              <LoadingOutlined v-if="state.audioStatus === 'loading'" />
              <PlayCircleOutlined v-else-if="state.audioStatus !== 'play'" />
              <PauseCircleOutlined v-else-if="state.audioStatus !== 'pause'" />
            </template>
          </a-button>
        </div>
      </div>
    </div>
    <audio :src="state.audio" controls></audio>
  </div>
</template>

<script>
import WaveSurfer from 'wavesurfer.js'
import { useRoute } from 'vue-router'
import { defineComponent, onMounted, onUnmounted, reactive } from 'vue'
import { LgetItem, LsetItem } from '@/utils/storage'

export default defineComponent({
  setup() {
    const route = useRoute()
    const state = reactive({
      image: '',
      audio: '',
      wavesurfer: null,
      audioStatus: 'loading',
    })
    function download(url) {
      window.ipcRenderer.invoke('start-download', {
        downloadUrl: url,
        folder: '',
      })
    }
    function customRequest(fileData) {
      state.audioStatus = 'loading'
      const file = fileData.file
      state.wavesurfer.load(window.URL.createObjectURL(file))
      // if (file) {
      //   var reader = new FileReader()
      //   reader.onload = function (evt) {
      //     var blob = new window.Blob([new Uint8Array(evt.target.result)])
      //     state.wavesurfer.loadBlob(blob)
      //   }
      //   reader.onerror = function (evt) {
      //     console.error(evt)
      //   }
      //   reader.readAsArrayBuffer(file)
      // }
      const path = 'atom:///' + fileData.file.path
      state.audio = path
    }
    function play() {
      state.wavesurfer.playPause()
    }
    onMounted(() => {
      const localImage = LgetItem('localImage')
      if (route.query.image) {
        download(route.query.image)
      } else {
        if (localImage) {
          state.image = localImage
        }
      }
      window.ipcRenderer.on('download-done', (_event, data) => {
        state.image = 'atom:///' + data.filePath
        console.log(state.image)
        LsetItem('localImage', state.image)
      })
      state.wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: '#fff',
        cursorColor: '#fff',
        height: 200,
        barWidth: 5,
        barGap: 2,
        progressColor: '#7fb2cc',
      })
      state.wavesurfer.on('play', () => {
        state.audioStatus = 'play'
      })
      state.wavesurfer.on('pause', () => {
        state.audioStatus = 'pause'
      })
      state.wavesurfer.on('ready', () => {
        state.audioStatus = 'pause'
      })
    })
    onUnmounted(() => {
      window.ipcRenderer.removeAllListeners('download-done')
    })
    return {
      download,
      state,
      customRequest,
      play,
    }
  },
})
</script>

<style lang="scss">
.localFile {
  flex: 1;
  .header {
    padding: 20px;
  }
  .box {
    .imgBox {
      display: flex;
      flex-direction: column;
    }
    .audioBox {
      display: flex;
      flex-direction: column;
      position: relative;
      margin-bottom: 20px;
      #waveform {
        width: 100%;
        background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
          url('https://wavesurfer-js.org/css/bg.jpg') no-repeat center;
        background-size: cover;
      }
      .btns {
        position: absolute;
        left: 0;
        bottom: 0;
        z-index: 10;
      }
    }
  }
}
</style>
