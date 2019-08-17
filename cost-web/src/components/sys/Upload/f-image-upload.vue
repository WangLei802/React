<template>
    <div style="position:relative;" class="uploader" :style="{height:height,width:width}">
      <el-upload
          class="avatar-uploader"
          name="file"
          :action="uploadUrl"
          :headers="headers"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" id="avatar" :src="imageUrl" class="avatar" :style="{height:height,width:width}">
              <i v-else class="el-icon-plus avatar-uploader-icon"  :style="{height:height,width:width,lineHeight:lineHeight}"></i>
      </el-upload>
      <div v-if="imageUrl" class="prevent-uploader" @click="beforeUpload">
        <div style="position:relative;"  :style="{height:height,width:width}">
          <div class="delete-icon" @click.stop="deleteIcon"><i class="el-icon-error"></i></div>
        </div>
      </div>
    </div>
</template>
<script>
import { ApiConstants } from '@/utils/common/ApiConstants'
import { FileUtil } from '@/utils/common/common'
export default {
  name: 'f-image-upload',
  props: {
    value: {
      required: true
    },
    size: {
      type: Number,
      default: 2
    },
    height: {
      type: String,
      default: '178px'
    },
    width: {
      type: String,
      default: '178px'
    }
  },
  data() {
    return {
      imageSize: this.size,
      headers: FileUtil.getHeaders(),
      uploadUrl: ApiConstants.UPLOAD_URL,
      imageUrl: this.value && FileUtil.getFileUrlById(this.value),
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  mounted: function() {
  },
  computed: {
    lineHeight() {
      return this.height
    }
  },
  methods: {
    beforeUpload() {
      this.$message.error('请先删除图片')
    },
    deleteIcon() {
      this.imageUrl = ''
      this.$emit('deleteAvatar', true)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || 'image/png'
      const isLt2M = file.size / 1024 / 1024 < this.imageSize
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG或PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 ' + this.imageSize + 'MB!')
      }
      return isJPG && isLt2M
    },
    handleAvatarSuccess(res, file) {
      // this.$emit('showImgEvent', res.data, file.name)

      this.$emit('input', res.data) // 触发 input 事件，并传入新值
      this.imageUrl = FileUtil.getFileUrlById(res.data)
      this.$emit('deleteAvatar', false)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  },
  watch: {
    // 页面上从接口获取图片ID后才能给value赋值，这时需要监听这个属性的变化
    value: function(val) {
      this.imageUrl = val && FileUtil.getFileUrlById(val)
    }
  }
}
</script>
<style>
  .uploader{
    position: relative;
    /*width: 178px;*/
    /*height: 178px;*/
  }
  .prevent-uploader{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .delete-icon .el-icon-error{
    position: absolute;
    right: -8px;
    top: -6px;
    color: lightcoral;
  }
  .el-icon-plus.avatar-uploader-icon{
    /*line-height:6.5;*/
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    /*width: 178px;*/
    /*height: 178px;*/
    /*line-height: 178px;*/
    text-align: center;
  }
  .avatar {
    /*width: 178px;*/
    /*height: 178px;*/
    display: block;
  }
</style>
