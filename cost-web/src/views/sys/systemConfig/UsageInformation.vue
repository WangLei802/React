<template>
    <div class='app-container'>

        <div class="logoEdit">
          <f-image-upload      v-model='usageInformation.logo' @deleteAvatar="deleteAvatar" ></f-image-upload>
    </div>

        <div class="infoEdit">
            <el-form :model="usageInformation" status-icon :rules="rules" ref="usageForm"  label-width='150px'>
                <el-form-item :label='$ls("lbl_companyNameCn")'>
                    <span class='el-input'>{{usageInformation.companyNameCn}}</span>
                </el-form-item>
                <el-form-item :label='$ls("lbl_companyNameEn")'>
                    <span class='el-input'>{{usageInformation.companyNameEn}}</span>
                </el-form-item>
                <el-form-item :label='$ls("lbl_systemNameCn")' prop="systemNameCn">
                    <el-input v-model='usageInformation.systemNameCn' placeholder='' :maxlength="20"></el-input>
                </el-form-item>
                <el-form-item :label='$ls("lbl_systemNameEn")' prop="systemNameEn">
                    <el-input v-model='usageInformation.systemNameEn' placeholder='' :maxlength="200"></el-input>
                </el-form-item>
                <el-form-item label='copyrightCn:' prop="copyrightCn">
                    <el-input v-model='usageInformation.copyrightCn' placeholder='' :maxlength="50"></el-input>
                </el-form-item>
                <el-form-item label='copyrightEn:' prop="copyrightEn" :maxlength="50">
                    <el-input v-model='usageInformation.copyrightEn' placeholder='' :maxlength="50"></el-input>
                </el-form-item>
                <el-form-item :label='$ls("lbl_systemVersion")'>
                    <span class='el-input'>{{usageInformation.systemVersion}}</span>
                </el-form-item>
                <el-form-item>
                    <el-button type='primary' @click='save'>{{$l('btn_save')}}</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>


<script>
import {
  getUsageInformation,
  getLogoUrlByImageCode,
  createUsageInformation,
  updateUsageInformation
} from '@/api/sys/usageInformationAPI'
import {
  ptn
} from '@/utils/common/validate'
import { LoadingUtil } from '@/utils/common/LoadingUtil'
export default {
  data() {
    var checkCopyrightCn = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$l('msg_usage_copycn')))
      } else {
        callback()
      }
    }
    var checkCopyrightEn = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$l('msg_usage_copyen')))
      } else {
        callback()
      }
    }
    return {
      usageInformation: {
        id: '',
        companyNameCn: '',
        companyNameEn: '',
        logo: '',
        systemNameCn: '',
        systemNameEn: '',
        copyrightCn: '',
        copyrightEn: '',
        systemVersion: '',
        version: ''
      },
      logoUrl: '',
      rules: {
        systemNameCn: [{ pattern: ptn.cn_num(1, 20), message: this.$l('msg_usage_syscn'), required: true, trigger: 'blur' }],
        systemNameEn: [{ pattern: ptn.en_num(1, 200), message: this.$l('msg_usage_sysen'), required: true, trigger: 'blur' }],
        copyrightCn: [{ required: true, validator: checkCopyrightCn, trigger: 'blur' }],
        copyrightEn: [{ required: true, validator: checkCopyrightEn, trigger: 'blur' }]
      },
      isAvatarDelete: false
    }
  },
  methods: {
    uploadImg: function() {
      this.$refs['uploadImg'].change()
    },
    deleteAvatar(isAvatarDelete) {
      this.isAvatarDelete = isAvatarDelete
    },
    save() {
      this.isAvatarDelete ? this.usageInformation.logo = '' : null
      this.$refs.usageForm.validate((valid) => {
        if (valid) {
          if (this.usageInformation == null || this.usageInformation.id === '') {
            createUsageInformation(this.usageInformation).then(response => {
              this.usageInformation = response.data
              this.$message.success(this.$l('' + response.message))
            })
          } else {
            updateUsageInformation(this.usageInformation).then(response => {
              this.$message.success(this.$l('' + response.message))
            })
          }
        }
      })
    }
  },
  mounted: function() {
    LoadingUtil.showLoading()
    getUsageInformation()
      .then(response => {
        if (response.data != null) {
          LoadingUtil.hideLoading()
          this.usageInformation = response.data
          // getLogoUrlByImageCode(this.usageInformation.logo).then(
          //   logoUrlResponse => {
          //     this.logoUrl = logoUrlResponse.data
          //   }
          // )
        }
      })
      .catch(error => {
        console.log(error)
        this.$message.success(this.$l('msg_system_error'))
      })
  }
}
</script>
<style scoped lang="less">
.logo-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.logo-uploader .el-upload:hover {
  border-color: #409eff;
}
.logo-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}
.el-form-item__label:before{
    content: "*";
    color: #f56c6c;
    margin-right: 4px;
}
.upload-image-btn{
  display: block;
}
</style>
