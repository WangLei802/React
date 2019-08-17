<template>
  <div>
  <el-upload
    class="upload-demo"
    name="file"
    :action="uploadUrl"
    :headers="headers"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :before-remove="beforeRemove"
    :on-success="handleFileSuccess"
    :limit="limit"
    :on-exceed="handleExceed"
    :file-list="showFileListData">
      <el-button size="mini" type="primary" v-if="showBtn">点击上传</el-button>
  </el-upload>
  </div>
</template>
<script>
  import { ApiConstants } from '@/utils/common/ApiConstants'
  import { Base64Util } from '@/utils/common/common'
  import { FileUtil } from '@/utils/common/common'

  export default {
    name: 'f-file-upload',
    props: {
      value: {
        required: true
      },
      limit: {
        type: Number,
        default: 3
      },
      size: {
        type: Number,
        default: 5
      }
    },
    data() {
      return {
        fileSize: this.size,
        headers: FileUtil.getHeaders(),
        uploadUrl: ApiConstants.UPLOAD_URL,
        showFileListData: this.decodeFileList(this.value),
        saveFileListData: this.value,
        limitCount: this.limit,
        showBtn: true
      }
    },
    methods: {
      beforeFileUpload(file) {
        console.log(this.imageSize)
        const isLt2M = file.size / 1024 / 1024 < this.fileSize
        if (!isLt2M) {
          this.$message.error('上传文件大小不能超过 ' + this.fileSize + 'MB!')
        }
        return isLt2M
      },
      getSaveFileList(fileList) {
        const list = []
        fileList.forEach((item, index) => {
          if (item.response) {
            list.push(item.response.data)
          } else {
            list.push(item.url)
          }
        })
        return list.join(',')
      },
      decodeFileList(fileSaveList) {
        const fileSaveArray = fileSaveList.split(',')
        const list = []
        if (fileSaveList) {
          fileSaveArray.forEach((item, index) => {
            try {
              const fileModel = JSON.parse(Base64Util.decode(item))
              const file = {}
              file.name = fileModel.name // 解析出名字显示在页面上
              file.url = item
              list.push(file)
            } catch (e) {
              console.log('exception: ' + e.toString() + item)
              console.log(Base64Util.decode(item))
              console.log(fileSaveList)
            }
          })
        }
        return list
      },
      handleRemove(file, fileList) {
        this.saveFileListData = this.getSaveFileList(fileList)
        this.showFileListData = this.decodeFileList(this.saveFileListData)
        this.$emit('input', this.saveFileListData)
        this.checkLimitCount()
      },
      handlePreview(file) {
        window.open(FileUtil.getFileUrlById(file.url))
      },
      handleExceed(files, fileList) {
        const length = files.length
        const total = files.length + fileList.length
        this.$message.warning('当前限制选择 ' + this.limitCount + ' 个文件，本次选择了 ' + length + ' 个文件，共选择了 ' + total + ' 个文件')
      },
      handleFileSuccess(response, file, fileList) {
        this.saveFileListData = this.getSaveFileList(fileList)
        this.showFileListData = this.decodeFileList(this.saveFileListData)
        this.$emit('input', this.saveFileListData)
        this.checkLimitCount()
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`)
      },
      checkLimitCount() {
        if (this.showFileListData) {
          if (this.showFileListData.length >= this.limitCount) {
            this.showBtn = false
          } else {
            this.showBtn = true
          }
        }
      }
    },
    watch: {
      // 页面上从接口获取图片ID后才能给imageId赋值，这时需要监听这个属性的变化
      value: function(val) {
        this.saveFileListData = val
        this.showFileListData = this.decodeFileList(this.saveFileListData)
        this.checkLimitCount()
      }
    }
  }
</script>
