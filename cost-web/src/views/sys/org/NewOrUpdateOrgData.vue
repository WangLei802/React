<template>
  <div>
    <el-row>
      <el-form :model="orgModel" status-icon :rules='rules' ref="orgModel" label-width='150px' >

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_org_last")'>
          <el-input :disabled="true"
          v-model="orgModel.parentName"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_org_code")' prop="orgCode">
          <el-input   v-bind:disabled="disabledInput"
          v-model="orgModel.orgCode" :placeholder='this.$l("lbl_org_code")'></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_org_name")' prop="orgName">
          <el-input  v-model='orgModel.orgName' :placeholder='this.$l("lbl_org_name")'></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_org_type")' prop="orgType" :placeholder="this.$l('lbl_org_type')">
          <fd-select  v-model="orgModel.orgType" type="sys_org_type" ></fd-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_org_incharge")' prop="appCode">
          <template>
          <el-select  v-model="orgModel.orgInCharge" filterable clearable :placeholder="this.$l('lbl_org_incharge')">
          <el-option
          v-for="item in users"
          :key="item.nickName"
          :label="item.nickName"
          :value="item.nickName">
          </el-option>
          </el-select>
          </template>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_org_city")'>
          <el-cascader expand-trigger="hover" style="width:100%;content: none" :options="cityOptions"   :placeholder="this.$l('lbl_org_city')" v-model='selectedOptions'>
          </el-cascader>
          </el-form-item>
        </el-col>
        <el-col :sapn="12">
          <el-form-item :label='this.$ls("lbl_org_sort")' prop="orgSort" style="width: 50%">
            <el-input  v-model='orgModel.sort' :placeholder='this.$l("lbl_org_sort")'></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="detail-button-box">
          <el-button type='primary' @click='onSubmit("orgModel")' v-bind:disabled="disInput" >{{this.$l('btn_save')}}</el-button>
          <el-button @click='cancel' >{{this.$l('btn_cancel')}}</el-button>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>

<script >
  import { LoadingUtil } from '@/utils/common/LoadingUtil'
  import { cityOptions } from '@/utils/common/city_data2017_element'
  import { ptn } from '@/utils/common/validate'
  import { addOrg, updateTopOrgList, getOrgById } from '@/api/sys/orgAPI'
  import TreeGrid from '@/components/sys/treeTable'
  import { searchUserList } from '@/api/sys/userManageAPI'
  export default {
    components: {
      TreeGrid
    },
    data() {
      return {
        rules: {
          orgCode: [{ pattern: ptn.all_match(1, 50), message: this.$l('msg_org_text'), required: true, trigger: 'blur' }],
          orgName: [{ pattern: ptn.all_match(1, 50), message: this.$l('msg_org_text'), required: true, trigger: 'blur' }],
          orgType: [{ required: true, message: this.$l('msg_org_type'), trigger: 'blur' }]
        },
        disabledInput: false,
        cityOptions: cityOptions,
        selectedOptions: [],
        users: [],
        userModel: {},
        disInput: false,
        orgModel: {
          id: '',
          parentId: '',
          parentName: '',
          orgCode: '',
          orgName: '',
          orgType: '',
          orgInCharge: '',
          sort: 0,
          orgCity: ''
        }
      }
    },
    mounted: function() {
      this.init()
    },
    methods: {
      init() {
        //  添加子级
        if (this.$route.query.handleType === 'createSon') {
          getOrgById({ id: this.$route.query.id })
            .then(response => {
              this.orgModel.parentId = response.data.id
              this.orgModel.parentName = response.data.orgName
              this.userModel.orgCode = response.data.orgCode
              searchUserList(this.userModel)
                .then(response => {
                  this.users = response.data.content
                })
                .catch(error => {
                  console.log(error)
                })
            })
            .catch(error => {
              console.log(error)
            })
        } else if (this.$route.query.handleType === 'edit') {
          this.disabledInput = true
          getOrgById({ id: this.$route.query.id })
            .then(response => {
              this.orgModel = response.data
              this.userModel.orgCode = response.data.orgCode
              searchUserList(this.userModel)
                .then(response => {
                  this.users = response.data.content
                })
                .catch(error => {
                  console.log(error)
                })
              this.selectedOptions = this.orgModel.orgCity.split(',').concat()
              if (this.orgModel.parentId !== '-1') {
                getOrgById({ id: this.orgModel.parentId })
                  .then(response => {
                    this.$set(this.orgModel, 'parentName', response.data.orgName)
                  })
              }
            })
            .catch(error => {
              console.log(error)
            })
        }
      },
      onSubmit(formName) {
        var validateResult = true
        this.$refs[formName].validate((valid) => {
          if (!valid) {
            validateResult = false
          }
        })
        if (!validateResult) {
          return
        }
        LoadingUtil.showLoading()
        this.disInput = true
        this.orgModel.orgCity = this.selectedOptions.join(',')
        if (this.orgModel.id === '') {
          addOrg(this.orgModel)
            .then(response => {
              LoadingUtil.hideLoading()
              if (response.code === '2000') {
                this.$router.push({
                  name: 'OrgManager'
                })
                this.$showSuccess(response.message)
              } else {
                this.$showError(response.message)
              }
            })
            .catch(error => {
              this.disInput = false
              console.log(error)
            })
        } else {
          updateTopOrgList(this.orgModel)
            .then(response => {
              LoadingUtil.hideLoading()
              if (response.code === '2000') {
                this.$router.push({
                  name: 'OrgManager'
                })
                this.$showSuccess(response.message)
              } else {
                this.$showError(response.message)
              }
            })
            .catch(error => {
              this.disInput = false
              console.log(error)
            })
        }
      },
      cancel() {
        this.$router.push({
          name: 'OrgManager'
        })
      }
    }
  }
</script>

<style scoped>
  @import '../../../styles/detail.scss';
</style>

<style>
  .custom-00a597 .el-cascader-menu__item--extensible:after {
    content: '\E604';
  }

</style>
