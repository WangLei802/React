<template>
  <div class='app-container'>
    <el-form :model="licenseModel" ref="licenseModel" label-width='150px' style="margin:0 auto;width:300px"  >
      <h3 class="lic-tit"><i class="el-icon-warning"></i> {{this.$l("lbl_license_product_license")}}</h3>
      <el-col :span="24">
      <el-form-item :label='this.$ls("lbl_license_product_name_cn")' prop="productNameCn">
        <label >{{licenseModel.productNameCn}}</label>
      </el-form-item>
      </el-col>
      <el-col :span="24">
      <el-form-item :label='this.$ls("lbl_license_product_name_en")' prop="productNameCn">
        <label >{{licenseModel.productNameEn}}</label>
      </el-form-item>
      </el-col>
        <el-col :span="24">
      <el-form-item :label='this.$ls("lbl_license_product_code")' prop="productCode">
        <label >{{licenseModel.productCode}}</label>
      </el-form-item>
        </el-col>
          <el-col :span="24">
      <el-form-item :label='this.$ls("lbl_license_expiredDate")' prop="expiredDate">
        <label >{{licenseModel.expiredDate}}</label>
      </el-form-item>
          </el-col>
       <el-col :span="24">
      <el-form-item>
        <el-upload
            name="file"
            :action="importFileUrl"
            :headers="headers"
            :show-file-list="false"
            :before-upload="uploadLicense"
            :on-success="uploadSuccess"
            accept="multipart/form-data">
            <el-button v-if="isNew"  type="primary" style="margin-left:-80px;">{{this.$l('btn_license_upload')}}</el-button>
        </el-upload>
        <el-col :span="24" class="detail-button-box">
        <el-button @click='cancel' >{{this.$l('btn_back')}}</el-button>
        </el-col>
      </el-form-item></el-col>
    </el-form>
  </div>
</template>
<script >
import { getLicenseDetail } from '@/api/sys/licenseAPI'
import { FileUtil } from '@/utils/common/common'
export default {
  data() {
    return {
      licenseModel: {
        id: '',
        productCode: '',
        productNameCn: '',
        productNameEn: '',
        expiredDate: ''
      },
      isNew: false,
      headers: FileUtil.getHeaders(),
      importFileUrl: process.env.BASE_API + '/license/upload'
    }
  },
  mounted: function() {
    this.licenseModel.id = this.$route.query.id ? this.$route.query.id : ''
    if (this.licenseModel.id !== '') {
      getLicenseDetail(this.licenseModel.id).then(response => {
        this.licenseModel = response.data
      }).catch(error => {
        console.log(error)
      })
    } else {
      this.isNew = true
    }
  },
  methods: {
    back() {
      this.$router.push({
        name: 'LicenseList'
      })
    },
    uploadLicense(file) {
      this.fileName = file.name
      var extension = file.name.split('.')[1] === 'lic'
      var isLt2M = file.size / 1024 / 1024 < 1
      if (!extension) {
        this.$showError(this.$l('msg_license_file_extension'))
      }
      if (!isLt2M) {
        this.$showError(this.$l('msg_license_file_size'))
      }
      return extension && isLt2M
    },
    uploadSuccess(response, file, fileList) {
      if (response.code !== '2000') {
        this.$showError(response.message)
      } else {
        this.licenseModel = response.data
        this.$showSuccess(response.message)
      }
    },
    cancel() {
      this.$router.push({
        name: 'LicenseList'
      })
    }
  }
}
</script>
<style scoped>
@import '../../../styles/detail.scss';
.el-form-item__content > div{
  display: inline-block;
}
.lic-tit{
  text-align: center;
}
</style>
