<template>
  <div class='app-container'>

    <div style="width:100%; text-align:right; padding: 10px 20px 0 0;">
      <el-button size="mini"
                 @click='handleBack'>{{$l('btn_back')}}
      </el-button>

      <el-button size="mini"
                 type='primary'
                 :disabled="buttonDisable"
                 v-show="isShowAdd"
                 @click='saveConstruction'
                 label="btn_save">{{$l('btn_save')}}
      </el-button>
      <el-button size="mini"
                 type='primary'
                 @click='submitConstructionCost'
                 v-show="isShowSubmit"
                 :disabled="buttonDisableSub"
                 label="lbl_cost_compilation_submit">{{$l('lbl_cost_compilation_submit')}}
      </el-button>
    </div>

    <!-- :disabled="operateState == '' ? false : true" -->
    <el-form label-width='120px' status-icon size="mini"
             :model="ConstructionModel" ref="ConstructionModel" :rules="rules"

             :disabled="!isEdit">
      <div class="form-unit">基本信息</div>

      <!-- <AccountSelector  style="width: 100%;" :show="show" v-model="project"></AccountSelector> -->

      <el-row :gutter="12">
        <ProjectAccountSelect v-model="projectModel"
                              :span="{project: 8,accObj: 8}"
                              :disabled="{project:true}"
                              autoselect="up"
                              @change="changeProject"/>
        <el-col :span="8">
          <!-- 资金计划版本 isUpdate-->
          <el-form-item :label="'资金计划版本：'">
            <el-input v-model="ConstructionModel.periodVersion"
                      :disabled="true"
                      style="width:220px;">
              <span slot="append" style="cursor:pointer" v-if="operateState == '0'"
                    @click="selectHistoryVersions">历史版本</span>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 资金计划名称-->
          <el-form-item :label="'资金计划名称：'">
            <el-input v-model="ConstructionModel.fundsPlanName" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 经办人 -->
          <el-form-item :label="'经办人：'">
            <el-input v-model="ConstructionModel.operator" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 提交日期： -->
          <el-form-item :label="'提交日期：'" prop="operateDate">
            <!-- <el-input v-model='ConstructionModel.operateDate' :disabled="true"></el-input> -->
            <el-date-picker v-model='ConstructionModel.operateDate'
                            :disabled="true"
                            type="date"></el-date-picker>
          </el-form-item>
        </el-col>
        <!-- 审批状态 -->
        <el-col :span="8">
          <!-- 审批状态： -->
          <el-form-item :label="'审批状态：'" prop="statusCh">
            <el-input v-model='ConstructionModel.statusCh' :disabled="true"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <!-- 审批日期： -->
          <el-form-item :label="'审批日期：'" prop="approveDate">
            <!-- <el-input v-model='ConstructionModel.approveDate' :disabled="true"></el-input> -->
            <el-date-picker v-model='ConstructionModel.approveDate'
                            :disabled="true"
                            type="date"
                            style="width:245px;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <!-- 详细说明 -->
          <el-form-item :label="'详细说明：'">
            <el-input type="textarea"
                      :autosize="{ minRows: 4, maxRows: 6}"
                      placeholder="请输入内容"
                      v-model="ConstructionModel.remark">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-form label-width='120px' status-icon size="mini" :rules="rules"
             :disabled="operateState == '0' ? true : false">
      <div class="form-unit">待签订合约规划付款计划</div>

      <el-col :span="1">
        <el-form-item :label="'付款周期：'" prop="payDate">
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item>
        <el-date-picker
            v-model="startMonth"
            :picker-options="pickerOptions0"
            type="month"
            placeholder="选择月"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="6">
          <el-form-item>
              <el-date-picker
                :picker-options="pickerOptions1"
                v-model="endMonth"
                type="month"
                placeholder="选择月"
                value-format="yyyy-MM-dd">
              </el-date-picker>
          <!-- :disabled="!isCanSearch" -->
          </el-form-item>
      </el-col>
      <el-col :span="6">
          <el-form-item>
            <el-button type="primary" @click="getQuarter()" :disabled="!isCanSearch">确定</el-button>
          </el-form-item>
      </el-col>



      <p style="width:100%;text-align:right;font-size:14px;">单位：元</p>
    </el-form>

    <el-table :data="fundsModelsList" border stripe size="small"
              :header-cell-style="headerCellStyle"
              :cell-style="cellStyle">
      <el-table-column label="合约规划名称" prop="contractPlanningName"></el-table-column>
      <el-table-column label="合约规划金额" prop="contractPlanningAmount">
        <template slot-scope="scope">{{ scope.row.contractPlanningAmount | NumFormat }}</template>
      </el-table-column>
      <el-table-column v-for="(item,index) in HeadersArry" :label="item" :key="index">
        <template slot-scope="scope">
          <!-- <span>{{item}}</span> -->
          <el-form :model="scope.row" :inline-message="true" :status-icon="true"
                   :disabled="operateState == '0' ? true : false">
            <el-form-item :prop="item">
              <el-input-number v-model.number="scope.row[item]"
                         :precision="2"  :controls="false"
                        style="margin-top:10px;"
                        ></el-input-number>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
    </el-table>

    <!-- 历史版本弹窗 -->
    <el-dialog title="历史版本" :visible.sync="isShowVersionsDialog">
      <el-form :model="versionsForm" label-width="100px">
        <el-row>
          <!-- <el-col :span="8">
            <el-form-item label="阶段">
              <el-select v-model="versionsForm.stage">
                <el-option label="投后" value="2"></el-option>
                <el-option label="预备会" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->

          <el-col :span="8">
            <el-form-item label="提交日期：">
              <el-date-picker v-model="versionsForm.date" type="date"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item>
              <el-button type="primary" @click="searchHistory">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table :data="historyList">
        <el-table-column label="选择">
          <template slot-scope="scope">
            <!-- <el-radio class="textRadio">&nbsp;</el-radio> -->
            <el-radio @change.native="getCurrentRow(scope.row)"
                      :label="scope.$index"
                      v-model="radio"
                      class="textRadio">&nbsp;
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column label="版本号" prop="periodVersion"></el-table-column>
        <el-table-column label="提交日期" prop='operateDate'
                        :formatter='this.$dateFormat("operateDate","yyyy-MM-dd")'
                        ></el-table-column>
        <el-table-column label="经办人" prop='operator'></el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取消</el-button>
        <el-button @click="confirmContract" type='primary'>确定</el-button>
      </div>

    </el-dialog>

  </div>
</template>
<script>
  import {
    saveOrUpdateFundPlan,
    getQuarter,
    getFunPlanDetail,
    fundsPeriodVersion,
    getVerification
  } from '@/api/cost/fundPlanApi'
  import { getMeProfile } from '@/api/sys/userAPI'
  import { getApprove } from '@/api/cost/approve'
  import ProjectAccountSelect from '@/components/cost/ProjectAccountSelect/'
  import { NumFormat, Version } from '@/filters/cost/'
  export default {
    props: {
      vm_passed_in: {
        default: function() {
          return {
            id: '',
            projectId: '',
            accountObjectId: '',
            groupNumber: '',
            agent: '',
            operateDate: ''
          }
        }
      },
      handleType: ''
    },
    filters: {
      NumFormat,
      Version
    },
    components: {
      ProjectAccountSelect
    },
    data() {
      var validateAccobj = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择项目分期'))
        } else {
          callback()
        }
      }
      return {
        contractModel: {},
        startMonth: '',
        endMonth: '',
        show: {
          costModel: true,
          project: true,
          accObj: true
        },
        radio: '',
        value: '',
        rules: {
          accObjId: [{ required: true, validator: validateAccobj, trigger: 'change' }],
          payDate: [
            { required: true }
          ]
        },
        tableData: [],
        isEdit: false,
        isShowSpan: false,
        isShowAdd: true,
        isShowSubmit: true,
        isShowBack: false,
        buttonDisable: false,
        buttonDisableSub: false,
        selectTable: [],
        isShowContract: false,
        throwDetailData: [],
        ConstructionModel: {
          id: '',
          accountingObjectId: '', // 分期id
          receiptsNo: '',
          receiptsName: '',
          pVersion: '',
          stageId: '',
          periodVersion: '', // 资金计划版本
          fundsPlanName: '', // 资金计划名称
          listPayPlan: [],
          operator: '',
          operateDate: '',
          remark: '',
          status: '0',
          createdBy: JSON.parse(JSON.parse(localStorage.getItem('USER_INFO')).val).username,
          listMap: [],
          payMoneySum: 0,
          projectId: '', // 项目id
          value: '', // 版本 除了升版为0， 其他都设为1
          statusCh: '草稿',
          approveDate: '',
          companyId: ''
        },
        accObjId: '',
        fundsPlanData: {},
        HeadersArry: '',
        historyList: [],
        fundsModelsList: [],
        projectModel: {
          projectId: '',
          accObjId: ''
          // accObjName: ''
        },
        projectAccountSelectItem: null, // 选择的成本分期model
        isCanSubmit: true, // 是否可提交
        isCanSearch: false,
        operateState: '',
        isShowVersionsDialog: false,
        versionsForm: {
          // stage: '',
          date: ''
        },
        pickerOptions0: {
          disabledDate: (time) => {
            debugger
            if (this.startMonth !== '' && this.endMonth !== null) {
              return time.getTime() > (new Date(this.endMonth)).getTime()
            } else {
              // return time.getTime() < Date.now() - 8.64e7
            }
          }
        },
        pickerOptions1: {
          disabledDate: (time) => {
            debugger
            return time.getTime() < (new Date(this.startMonth)).getTime()
          }
        }

      }
    },
    mounted: function() {
      if (this.$route.query.isAdd) {
        this.buttonDisableSub = true
        this.ConstructionModel.operateDate = new Date().format()
        this.ConstructionModel.operator = this.$getUserInfo()['nickName']
      } else {
        this.operateState = this.$route.query.operateState // 0-查看  1-编辑  3-升版
        this.ConstructionModel.id = this.$route.query.id
        this.buttonDisableSub = false
      }
      this.isEdit = this.$route.query.isEdit
      if (!this.isEdit) {
        this.isShowSpan = true
        this.buttonDisable = true
        this.isShowAdd = false
        this.isShowSubmit = false
        this.isShowBack = true
      }
      if (this.ConstructionModel.id) {
        this.getDetail()
      }

      // this.init()
    },
    methods: {
      // 表头颜色
      headerCellStyle({ row, column, rowIndex, columnIndex }) {
        let baseFontColor = ';color:#fff'
        let columnData = row[columnIndex]
        // 蓝色区域
        if (rowIndex === 0 && columnIndex < 2) return 'background:RGB(54,147,208)' + baseFontColor
        // 橘色区域
        if (rowIndex === 0 && columnIndex > 1) return 'background:RGB(255,102,0)' + baseFontColor
      },
      // 列颜色
      cellStyle(row, column, rowIndex, columnIndex) {
        // alert(columnIndex)
        // if ( rowIndex !== 0 && columnIndex < 3) return 'background:red'
        if (rowIndex === 1 && columnIndex === 2) { // 指定坐标
          return 'background:pink'
        } else {
          return ''
        }
      },
      cancelDialog() {
        this.isShowVersionsDialog = false
      },
      confirmContract() {
        if (this.radio === '') {
          this.contractModel = {}
          this.$showError('请选择历史版本')
          return false
        }
        this.isShowContract = false
        this.ConstructionModel = this.contractModel
        this.isShowVersionsDialog = false
        // 查询参数
        this.startMonth = this.ConstructionModel.payStart
        this.endMonth = this.ConstructionModel.payEnd
        this.isCanSearch = true
        this.getQuarter('edit')
      },
      getCurrentRow(contractDetail) {
        this.contractModel = contractDetail
      },
      searchHistory() {
        let versionsFormDate = ''
        if (this.versionsForm.date == '' || this.versionsForm.date == null) {
          versionsFormDate = ''
        } else {
          versionsFormDate = this.versionsForm.date.format()
        }
        let param = {
          id: this.$route.query.id,
          accountingObjectId: this.$route.query.accountingObjectId,
          // stageId:this.versionsForm.stage,
          updatedDate: versionsFormDate
        }
        fundsPeriodVersion(param).then(response => {
          // console.log(response.data)
          // this.historyList = response.data
          this.historyList = response.data.filter(item => {
            return item.periodVersion !== this.ConstructionModel.periodVersion
          })
        }).catch(error => {
          console.log(error)
        })
      },
      calculateTotalAmount(row, index) {
        let rowSum = 0
        for (var x in row) {
          if (x !== 'contractPlanId' && x !== 'contractPlanningAmount' && x !== 'contractPlanningName') {
            if (row[x] === undefined || row[x] === '') {
              row[x] = 0
            }
            rowSum += row[x]
          }
        }
        if (rowSum) {
          if (!(rowSum === row.contractPlanningAmount)) {
            this.$showError('您的季度总金额和合约规划金额不等')
            this.isCanSubmit = false
          }
        }
      },

      handleBack() {
        this.$router.push({
          name: 'FundPlanList'
        })
      },
      // 根据时间查询季度
      getQuarter(type) {
        if (!this.isCanSearch) {
          return
        }
        // let startMonth = this.startMonth[0]
        // let endMonth = this.startMonth[1]
        let param = {
          startTime: this.startMonth,
          endTime: this.endMonth,
          accountingObjectId: this.ConstructionModel.accountingObjectId
        }
        getQuarter(param).then(response => {
          this.fundsPlanData = response.data
          this.HeadersArry = response.data.fundsPlanMap // 表头
          // 只有新增的时候去拿查询接口里面的list
          if (!type) {
            this.fundsModelsList = response.data.fundsModelsList // 表格内容
          }
          this.ConstructionModel.payMoneySum = response.data.payCount // 合约计划总额
        })
      },
      // 查看是否可以选择成本分期
      getVerification(val) {
        getVerification(val.id)
          .then(response => {
            console.log(response.message)
            if (response.message !== '' && response.message !== null && response.message !== 'null') {
              this.$showError(response.message)
              this.isShowAdd = false
              return
            }
            // debugger
            this.isShowAdd = true
            this.ConstructionModel.accountingObjectId = val.id
            this.ConstructionModel.accountingObjectName = val.text
            this.ConstructionModel.fundsPlanName = val.text + '—' + '全周期资金计划'
            this.ConstructionModel.projectId = val.id
            this.ConstructionModel.stageId = (val['attr'] && val['attr']['stageId']) ? val['attr']['stageId'] : null
            this.ConstructionModel.projectId = val.parentId
          })
          .catch(error => {
            // console.log(error)
            this.$showError(error.message ? error.message : 'msg_system_error')
          })
      },
      // 选择项目 or 分期
      changeProject(val) {
        if (val.type === 'acc_obj') {
          this.getVerification(val)
        }
        this.projectAccountSelectItem = val // 当前选择的成本分期
        this.ConstructionModel.companyId = null
        if (val.parentIds) {
          let pathArray = val.parentIds.split(',')
          if (pathArray.length === 5) {
            this.ConstructionModel.companyId = pathArray[3] // 取事业部ID为公司id  //acc  5   //proid 4
          }
        }
        // alert(this.ConstructionModel.companyId)
      },
      submitConstructionCost() {
        this.$refs['ConstructionModel'].validate((valid) => {
          if (valid) {
            this.ConstructionModel.status = '1'
            this.ConstructionModel.listMap = this.fundsModelsList
            this.ConstructionModel.payStart = this.startMonth
            this.ConstructionModel.payEnd = this.endMonth
            this.ConstructionModel.value = this.operateState === '3' ? '0' : '1'

            let isPass = true
            if (this.ConstructionModel.companyId || this.ConstructionModel.payStart == '' || this.ConstructionModel.payEnd == '') {
              this.$showError('请填写必填信息')
              isPass = false
            }
            if (!isPass) {
              return
            }
            saveOrUpdateFundPlan(this.ConstructionModel)
              .then(response => {
                this.$showSuccess(response.message)
                this.handleBack()
              })
              .catch(error => {
                console.log(error)
                this.$showError(error.message ? error.message : 'msg_system_error')
              })
          }
        })
      },
      saveConstruction() {
        this.ConstructionModel.status = '0'
        this.ConstructionModel.listMap = this.fundsModelsList
        this.ConstructionModel.payStart = this.startMonth
        this.ConstructionModel.payEnd = this.endMonth
        this.ConstructionModel.value = this.operateState === '3' ? '0' : '1'

        let isPass = true
        if (this.ConstructionModel.companyId || this.ConstructionModel.payStart == '' || this.ConstructionModel.payEnd == '') {
          this.$showError('请填写必填信息')
          isPass = false
        }
        if (!isPass) {
          return
        }
        saveOrUpdateFundPlan(this.ConstructionModel)
          .then(response => {
            this.$showSuccess(response.message)
            this.ConstructionModel.id = response.data
            this.isShowAdd = true
            this.isShowBack = true
            this.buttonDisableSub = false
          })
          .catch(error => {
            // console.log(error)
            this.$showError(error.message ? error.message : 'msg_system_error')
          })
      },
      inputAccountObject() {
        this.ConstructionModel.groupNumber = this.ConstructionModel.accountObjectId + '_IC'
      },
      // 获取详情数据
      getDetail() {
        let param = { id: this.ConstructionModel.id }
        getFunPlanDetail(param).then(response => {
          this.ConstructionModel = response.data
          this.projectModel.projectId = response.data.projectId
          this.projectModel.accObjId = response.data.accountingObjectId
          this.projectModel.companyId = response.data.companyId

          if (this.$route.query.isUpdate) {
            this.ConstructionModel.statusCh = '草稿'
          } else {
            if (this.ConstructionModel.status == '0') {
              this.ConstructionModel.statusCh = '草稿'
            } else if (this.ConstructionModel.status == '1') {
              this.ConstructionModel.statusCh = '审核中'
            } else if (this.ConstructionModel.status == '2') {
              this.ConstructionModel.statusCh = '已审批'
            } else if (this.ConstructionModel.status == '3') {
              this.ConstructionModel.statusCh = '已驳回'
            }
          }

          getApprove({ bizTablePkValue: this.ConstructionModel.id })
            .then(response => {
              if (response.data != undefined && response.data.approveDate != undefined) {
                this.ConstructionModel.approveDate = new Date(response.data.approveDate).format()
              }
            })
            .catch(error => {
              console.log(error)
              this.$showError(error.message ? error.message : 'msg_system_error')
            })
          this.ConstructionModel.operateDate = new Date(response.data.operateDate).format()
          console.log(response.data.listMap)
          // debugger
          this.fundsModelsList = response.data.listMap
          if (this.$route.query.isUpdate) {
            this.ConstructionModel.periodVersion = 'V' + (Number(response.data.periodVersion.split('V')[1]) + 1)
          } else {
            this.ConstructionModel.periodVersion = response.data.periodVersion
          }

          // 查询参数
          this.startMonth = response.data.payStart
          this.endMonth = response.data.payEnd
          this.isCanSearch = true
          this.getQuarter('edit')
        }).catch(error => {
          console.log(error)
        })
      },
      // 历史版本
      selectHistoryVersions() {
        this.searchHistory()
        this.isShowVersionsDialog = true
      }
    },
    watch: {
      startMonth(val) {
        if (this.ConstructionModel.accountingObjectId && this.startMonth && this.endMonth) {
          this.isCanSearch = true
        }
      },
      endMonth(val) {
        if (this.ConstructionModel.accountingObjectId && this.startMonth && this.endMonth) {
          this.isCanSearch = true
        }
      },
      ConstructionModel: {
        handler() {
          if (this.ConstructionModel.accountingObjectId && this.startMonth && this.endMonth) {
            this.isCanSearch = true
          }
        },
        deep: true
      }
    }
  }
</script>

<style>
  .custom-00a597 .el-cascader-menu__item--extensible:after {
    content: '\E604';
  }

</style>
