<template>
    <div class="contractPlan">
        <el-dialog :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   title="选择虚拟合约规划"
                   :visible.sync="dialogVirtualContractPlan"
                   width="80%"
                   top="3%"                           
                   :show-close="false"
                   :before-close="handleClose">
            <div style="margin-top:-30px">
                <mt-searchform>
                    <template slot="buttons">
                        <el-button size="mini"
                                   @click="cancel" v-show="isShow">返 回</el-button>
                        <el-button size="mini"
                                   type="primary"
                                   @click="submit" v-show="isShow">确 定</el-button>
                    </template>
                    <template slot="form">

                       <el-col :span="6">
                            <el-form-item label="一级分类：">

                                <el-select v-model="form.oneLevel"
                                          clearable
                                           placeholder="请选择">
                                    <el-option v-for="(item,index)  in oneLevelList"
                                               :key="index"
                                               :label="item.name"
                                               :value="item.cpId">
                                    </el-option>
                                </el-select>

                            </el-form-item>

                        </el-col>
                        <el-col :span="6" >
                            <el-form-item label="二级分类：">
                                <el-select v-model="form.twoLevel"
                                            clearable 
                                           placeholder="请选择">
                                    <el-option v-for="(item,index) in twoLevelList"
                                               :key="index"
                                               :label="item.name"
                                               :value="item.cpId">
                                    </el-option>
                                </el-select>

                            </el-form-item>
                        </el-col> 
                        <el-col :span="6">
                            <el-form-item label="合约规划名称：">
                                <el-input v-model='form.contractPlan'
                                          :maxlength="20"
                                          :clearable=true
                                           ></el-input>
                            </el-form-item>

                        </el-col>                   
                        <el-col :span="6"  style="width:20%"
                                class="search-btn">
                            <el-form-item class="search"
                                         >
                                <el-button size="mini"
                                           type="primary"
                                           @click="onSearch">查询</el-button>
                            </el-form-item>

                        </el-col>
      
                    </template>
                </mt-searchform>
                <div ref="targetCostCompilationTable">
                    <el-table :data="tableDataList"
                              stripe
                              border                              
                              :height="tHeight"    
                              tooltip-effect="dark"
                              style="width: 100%"
                              size="small"
                              @selection-change="handleSelectionChange"
                    >
                        <el-table-column label="选择"
                                         width="50"
                                         type="selection"
                        >
                            <!--<template slot-scope="scope">-->

                                <!--<el-checkbox v-model="checkedForm"-->
                                             <!--v-if="scope.row.locked"-->
                                             <!--:label="scope.row"-->
                                             <!--:disabled="true">&nbsp;</el-checkbox>-->

                                <!--<el-checkbox v-model="checkedForm"-->
                                             <!--v-else-->
                                             <!--:label="scope.row"-->
                                             <!--@change="controlSingle(scope.row)">&nbsp;</el-checkbox>-->
                            <!--</template>-->
                        </el-table-column>                        

                        <el-table-column prop="level1Name" width="300"
                                         label="一级分类">

                        </el-table-column>

                      <el-table-column prop="level2Name" width="300"
                                       label="二级分类">

                      </el-table-column>

                        <el-table-column prop="name"
                                         label="合约规划名称">
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <span slot="footer"
                  class="dialog-footer">
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { tableHeight } from '@/utils/common/index'
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import { findVirtualCpList, getFirstCategory, getSecondCategory } from '@/api/cost/signContractAPI'
export default {
  props: {
    value: {
      type: String
    },
    dialogVirtualContractPlan: {
      type: Boolean
    },
    activeName: {
      type: String,
      default: '2'
    },
    accountingObjectId: {
      type: String

    }
  },
  computed: {
    tHeight: function() {
      let options = {
        fullHeight: this.$store.getters.fullHeight,
        opened: this.$store.getters.sidebar.opened,
        showForm: this.$store.getters.showForm,
        obj: this
      }
      return `${tableHeight(options)}px`
    }
  },
  data() {
    return {
      tableHeight: '0',
      fullHeight: document.documentElement.clientHeight,
      isShow: false,
      accountObjectList: [],
      oneLevelList: [],
      twoLevelList: [],
      checkedForm: [],
      contractPlanList: [],
      form: {
        contractPlan: '',
        twoLevel: '',
        oneLevel: '',
        accountObject: ''
      },
      tableDataList: []
    }
  },
  mounted() {
    this.getFirstCategoryList()
    this.findVirtualCpList()

    this.checkedForm = []
  },
  watch: {
    fullHeight(val) {
      this.settingTableHeight()
    },
    'form.oneLevel': {
      handler(newValue, oldValue) {
        this.form.oneLevel = newValue
        this.form.twoLevel = ''
        this.getSecondCategoryList()
      },
      deep: true
    }

  },
  methods: {

    handleSelectionChange(val) {
      this.checkedForm = val
    },

    settingTableHeight: function() {
      const topHeight = this.$refs['targetCostCompilationTable'].getBoundingClientRect().top
      this.tableHeight = this.fullHeight - topHeight - 80
      this.$refs['targetCostCompilationTable'].style.Height = this.tableHeight + 'px'
    },
    getFirstCategoryList() {
      getFirstCategory({ ownerId: this.accountingObjectId }).then(response => {
        this.oneLevelList = response.data ? response.data : []
      })
    },
    getSecondCategoryList() {
      getSecondCategory({ firstCategoryId: this.form.oneLevel, ownerId: this.accountingObjectId }).then(response => {
        this.twoLevelList = response.data ? response.data : []
      })
    },
    onSearch() {
      LoadingUtil.showLoading()
      findVirtualCpList({ 'accountingObjectId': this.accountingObjectId, 'level1Id': this.form.oneLevel, 'level2Id': this.form.twoLevel, 'cpName': this.form.contractPlan }).then(response => {
        LoadingUtil.hideLoading()
        this.tableDataList = response.data
      }).catch(error => {
        LoadingUtil.hideLoading()
        console.log(error)
      })
    },
    submit() {
      this.$emit('closeVirtualDialogContractPlan', this.checkedForm)
    },
    findVirtualCpList() {
      LoadingUtil.showLoading()
      findVirtualCpList({ 'accountingObjectId': this.accountingObjectId })
        .then(response => {
          LoadingUtil.hideLoading()
          this.isShow = true
          this.tableDataList = response.data
        })
        .catch(error => {
          LoadingUtil.hideLoading()
          this.isShow = true
          console.log(error)
        })
    },
    cancel() {
      this.$emit('closeVirtualDialogContractPlan')
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    }
  }
}
</script>
<style scoped>
.el-dialog__headerbtn {
  display: none;
}

.el-form-item {
  /*width: 22%;*/
  /*float: left;*/
}
.el-form-item.search {
  /*width: 6%;*/
}
.el-form-item.search .el-form-item__content {
  margin-left: 20px;
}
</style>
