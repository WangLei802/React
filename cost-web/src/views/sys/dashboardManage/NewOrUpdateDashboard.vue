<!-- NewOrUpdateDashboard -->
<template>
  <div class='app-container'>
    <div class="subTitle">
      <div class="breadcrumb-child">
        <i class="fa fa-folder-open-o"></i>{{this.$l('lbl_dashboard_detail')}}</div>
    </div>
    <div class="infoEdit">
      <el-form label-width='150px' :model="dashboardModel" ref="dashboardModel" :rules="rules">
        <el-form-item :label='this.$ls("lbl_dashboard_title")' prop="title">
          <el-input v-model='dashboardModel.title' :placeholder='this.$l("lbl_dashboard_title")'></el-input>
        </el-form-item>
        <el-form-item :label='this.$ls("lbl_dashboard_description")' prop="des">
          <el-input type='textarea' v-model='dashboardModel.des' :placeholder='this.$l("lbl_dashboard_description")'></el-input>
        </el-form-item>
        <el-form-item :label='this.$ls("lbl_dashboard_type")' prop="type">
          <fd-select v-model='dashboardModel.type' type="sys_dashboard_type" :clearable="true"  :placeholder='this.$l("lbl_dashboard_type")'></fd-select>
        </el-form-item>
        <el-form-item :label='this.$ls("lbl_dashboard_realte_id")' prop="relateId" v-show="false">
          <el-input v-model='dashboardModel.relateId' :placeholder='this.$l("lbl_dashboard_realte_id")'></el-input>
        </el-form-item>
        <el-form-item :label='this.$ls("lbl_dashboard_layout_type")' prop="type">
          <fd-select v-model='dashboardModel.layoutType' type="sys_dashboard_layout_type" :clearable="true"  :placeholder='this.$l("lbl_dashboard_layout_type")'></fd-select>
        </el-form-item>
        <el-form-item :label='this.$ls("lbl_dashboard_is_default")' v-show="false">
          <el-checkbox v-model="dashboardModel.isDefault"></el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button type='primary' @click='onSubmit("dashboardModel")'
          :disabled="(dashboardModel.type==='1'&&addUsable.userDataExist) || (dashboardModel.type==='0'&&addUsable.systemDataExist)">{{this.$l('btn_save')}}</el-button>
          <el-button @click='cancel'>{{this.$l('btn_cancel')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  getDashboardDetail,
  saveDashboard,
  updateDashboardBaseInfo
} from '@/api/sys/dashboardManageAPI'
import { getMeProfile } from '@/api/sys/userAPI'
import { ptn } from '@/utils/common/validate'
export default {
  data() {
    return {
      addUsable: {
        userDataExist: false,
        systemDataExist: false
      },
      vm: {
        id: '',
        userName: '',
        nickName: '',
        mobile: '',
        version: '',
        status: '',
        avatar: ''
      },
      dashboardModel: {
        id: '',
        title: '',
        des: '',
        type: '',
        relateId: '0',
        layoutType: '',
        isDefault: '0',
        status: '1',
        version: ''
      },
      rules: {
        title: [
          {
            pattern: ptn.cn_en_num(5, 35),
            message: this.$l('msg_dashboard_title'),
            required: true,
            trigger: 'blur'
          }
        ],
        type: [
          {
            message: this.$l('msg_dashboard_type'),
            required: true,
            trigger: 'change'
          }
        ],
        relateId: [
          {
            message: this.$l('msg_dashboard_relate_id'),
            required: true,
            trigger: 'change'
          }
        ],
        layoutType: [
          {
            message: this.$l('msg_dashboard_layout_type'),
            required: true,
            trigger: 'change'
          }
        ]
      }
    }
  },

  components: {},

  computed: {},
  watch: {
    'dashboardModel.type': function(newValue, oldValue) {
      if (newValue === '0') {
        this.dashboardModel.relateId = '0'
      } else {
        this.dashboardModel.relateId = this.vm.id
      }
    }
  },
  mounted: function() {
    this.addUsable.userDataExist = this.$route.query.userDataExist
    this.addUsable.systemDataExist = this.$route.query.systemDataExist
    this.dashboardModel.id = this.$route.query.id ? this.$route.query.id : ''
    if (this.dashboardModel.id !== '') {
      getDashboardDetail(this.dashboardModel.id)
        .then(response => {
          this.dashboardModel = response.data
        })
        .catch(error => {
          console.log(error)
        })
    }

    getMeProfile()
      .then(response => {
        this.vm = response.data
      })
      .catch(error => {
        console.log(error)
      })
  },

  methods: {
    onEditorBlur: function() {},
    onEditorFocus: function() {},
    onEditorChange: function() {},
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.dashboardModel.id === '') {
            saveDashboard(this.dashboardModel)
              .then(response => {
                this.$router.push({
                  name: 'DashboardList'
                })
                this.$showSuccess(response.message)
              })
              .catch(error => {
                console.log(error)
              })
          } else {
            updateDashboardBaseInfo(this.dashboardModel)
              .then(response => {
                this.$router.push({
                  name: 'DashboardList'
                })
                this.$showSuccess(response.message)
              })
              .catch(error => {
                console.log(error)
              })
          }
        }
      })
    },
    cancel() {
      this.$router.push({
        name: 'DashboardList'
      })
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
