<template>
  <div>
  <el-upload
    class="upload-demo"
    name="file"
    :action="uploadUrl"
    :headers="headers"
    :on-progress = "progress"
    :before-upload="beforeFileUpload"
    :on-success="handleFileSuccess"
    :show-file-list="false"
    style="display: inline"
     >
    <el-button size="mini" type="primary" :disabled="isShow">点击上传</el-button>
  </el-upload>
  </div>
</template>
<script>
  import { LoadingUtil } from "@/utils/common/LoadingUtil";
  import { ApiConstants } from '@/utils/common/ApiConstants'
  import { Base64Util } from '@/utils/common/common'
  import { FileUtil } from '@/utils/common/common'
  import uuidv1 from 'uuid/v1'
  import { getToken } from '@/utils/common/auth'

  export default {
    name: 'CostFileUpload',
    props: {
      value: {
        required: false
      },
      limit: {
        type: Number,
        default: 3
      },
      size: {
        type: Number,
        default: 100
      },
      attachmentData: {
        type: Array
      },
      outerId: {
        type: String
      },
      isShow:{
        type:Boolean
      }
    },
    data() {
      return {
        fileSize: this.size,
        headers: FileUtil.getHeaders(),
        uploadUrl: ApiConstants.UPLOAD_URL,
        limitCount: this.limit,
      }
    },
    mounted() {
      console.log(this.attachmentData)
    },
    methods: {
      progress(){
        LoadingUtil.showLoading();
      },
      beforeFileUpload(file) {
        // debugger
        console.log(file.size / 1024 / 1024)
        console.log(this.fileSize)
        const isLt2M = file.size / 1024 / 1024 < this.fileSize
        console.log(isLt2M)
        if (!isLt2M) {
          this.$message.error('上传文件大小不能超过 ' + this.fileSize + 'MB!')
        }
        return isLt2M
      },
      handleExceed(files, fileList) {
        const length = files.length
        const total = files.length + fileList.length
        this.$message.warning('当前限制选择 ' + this.limitCount + ' 个文件，本次选择了 ' + length + ' 个文件，共选择了 ' + total + ' 个文件')
      },
      handleFileSuccess(response, file, fileList) {
        debugger
        if (response.code === '2000') {
          let fileData = {}
          fileData.name = file.name
          fileData.fileUrl = process.env.BASE_API + '/file/get?token=' + getToken() + '&key=' + encodeURIComponent(response.data)
          fileData.uploadDate = FileUtil.getFileById(response.data).uploadTime
          fileData.outerId = this.outerId
          fileData.index = uuidv1()
          this.attachmentData.push(fileData)
          LoadingUtil.hideLoading();
          this.$showSuccess(response.message);
          console.log(this.attachmentData)
        } else {
          this.$showError(response.message)
        }
      }
    },
    watch: {
    }
  }
</script>
