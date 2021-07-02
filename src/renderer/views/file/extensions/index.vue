<template>
  <div class="extensions">
    <a-upload
      accept="application/json"
      :customRequest="customRequest"
      name="file"
      :showUploadList="false"
      :multiple="true"
    >
      <a-button>
        <upload-outlined></upload-outlined>
        打开json
      </a-button>
    </a-upload>
  </div>
</template>

<script>
const { remote } = require('electron')
import { defineComponent, getCurrentInstance } from 'vue'

export default defineComponent({
  setup() {
    const { proxy } = getCurrentInstance()
    const { $message } = proxy
    function customRequest(fileData) {
      const path = fileData.file.path
      if (remote.session.defaultSession.getExtension('chklaanhfefbnpoihckbnefhakgolnmc')) {
        window.open('file:///' + path)
      } else {
        $message.warning('没有加载json拓展')
      }
    }
    return {
      customRequest
    }
  },
})
</script>

<style lang="scss" scoped>
.extensions {
}
</style>