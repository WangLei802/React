<template>
    <el-upload
        class="avatar-uploader"
        name="image"
        :action="action"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <!-- <el-upload
        class="picture-card" 
        :action="action"
        name="image"
        list-type="picture-card"
        :on-preview="handleAvatarSuccess"
        :on-remove="beforeAvatarUpload">
        <i class="el-icon-plus"></i>
    </el-upload> -->
</template>
<script>
export default {
  name: 'f-upload',
  props: {
    action: {
      type: String,
      required: true
    },
    imageUrl: this.logoUrl
  },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  mounted: function() {
  },
  methods: {
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG或PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    handleAvatarSuccess(res, file) {
      this.$emit('showImgEvent', res.data)
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  }
}
</script>
<style>
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
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
