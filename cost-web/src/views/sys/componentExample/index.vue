<template>
  <div>
    <el-row>
      <div class="form-unit">字典组件</div>
      <el-form label-width='150px'>
        <el-col :span="12">
          <el-form-item :label='$l("lbl_gender")'>
            <!--<span></span>-->
            <fd-label type="sys_user_sex" :code ='vm.sex' ></fd-label>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='$l("lbl_menu_type")'>
            <!--<span></span>-->
            <fd-radio v-model="vm.menuType" type="sys_menu_type"></fd-radio>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='$l("lbl_gender")'>
            <!--<i>*</i>-->
            <fd-select v-model = 'vm.sex' type="sys_user_sex" :clearable="true" @change="testChange"></fd-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='$l("lbl_menu_type")'>
            <!--<span></span>-->
            <fd-checkbox v-model="vm.CheckedMenuType" type="sys_menu_type" ></fd-checkbox>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='$l("lbl_gender")'>
            <!--<i>*</i>-->
            <fd-select v-model = 'vm.userType' type="sys_user_type" :multiple='true' ></fd-select>
          </el-form-item>
        </el-col>
      </el-form>
      <el-col :span="24">
        <div class="form-unit" >input组件</div>
      </el-col>
      <el-col :span="24">
        <div style="height: 10px"></div>
      </el-col>
      <el-form label-width='150px'>
        <el-col :span="12">
          <el-form-item :label='$l("lbl_sing")'>
            <!--<i>*</i>&nbsp;-->
            <el-input v-model='vm.sign' :placeholder='$l("lbl_sing")'></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label='$l("lbl_sing")'>
            <el-input v-model='vm.val_1'></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12" >
          <el-form-item label='上传'>
            <f-file-upload v-model="fileList" :limit="limit" :size="size"></f-file-upload>
          </el-form-item>
        </el-col>

        <el-col :span="24" class="detail-button-box">
          <el-button type='primary' @click='save' v-bind:disabled="disInput">{{this.$l('btn_save')}}</el-button>
          <el-button  @click='error'>{{this.$l('btn_back')}}</el-button>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
<script>
  import { getMeProfile } from '@/api/sys/userAPI'
  import { FileUtil } from '@/utils/common/common'
  export default {
    name: 'componentExample',
    data() {
      return {
        size: 1,
        limit: 4,
        vm: {
          sex: '1', // 用户性别
          userType: '1',
          menuType: '1',
          CheckedMenuType: ['1']
        },
        testdata: {
          sign: '', // 个性签名
          val_1: ''
        },

        fileList: 'eyJpZCI6ImJkYTgwMzhhYmJhNzQyNWY5YTkxYWVkMmFhY2QyNTczLzEucG5nIiwibmFtZSI6IjEucG5nIn0=,eyJpZCI6ImJkYTgwMzhhYmJhNzQyNWY5YTkxYWVkMmFhY2QyNTczLzEucG5nIiwibmFtZSI6IjEucG5nIn0='
      }
    },
    mounted: function() {
      getMeProfile()
        .then(response => {
          this.testdata = response.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    methods: {
      save: function() {
        debugger
        console.log(FileUtil.getFileByIds(this.fileList))
        console.log(FileUtil.getFileUrlById('eyJpZCI6ImJkYTgwMzhhYmJhNzQyNWY5YTkxYWVkMmFhY2QyNTczLzEucG5nIiwibmFtZSI6IjEucG5nIn0='))
        console.log(FileUtil.getFileById('eyJpZCI6ImJkYTgwMzhhYmJhNzQyNWY5YTkxYWVkMmFhY2QyNTczLzEucG5nIiwibmFtZSI6IjEucG5nIn0='))
        this.$showSuccess('msg_save_success')
      },
      error() {
        console.log(this.fileList)
        this.$showError('msg_system_error')
      },
      testChange: function(value) {
        console.log(value)
      }
    }

  }
</script>
<style scoped>
  @import '../../../styles/detail.scss';
</style>

