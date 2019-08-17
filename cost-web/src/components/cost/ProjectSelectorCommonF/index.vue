<!--
    集团、公司、部门、项目、成本分期五级下拉级联组件
    【使用场景】：查询列表
    【示例】：
    __________________________________________________________________________________________________

        import ProjectSelector from '@/components/cost/ProjectSelector/'
        <ProjectSelector v-model='queryModel' :show="" @change="projectSelector_SelectChange">
            <template slot="before">前置内容</template>
            <template slot="after">后置内容</template>
        </ProjectSelector>
    _________________________________________________________________________________________________

    【参数】：
    _________________________________________________________________________________________________

        // 集团，公司，部门为companyId，双向绑定，projectId为项目id
        queryModel: {
            companyId: '',
            projectId: '',
            accObjId：''
        }

        //默认显示(成本分期不显示)
        showSetting:{
            group: true, //显示集团
            company: true,//显示公司
            dept: true,//显示部门
            project: true,//显示项目
            accObj:false//显示成本分期
        }

        //手动选择下拉值改变事件
        @change="projectSelector_SelectChange"
    _________________________________________________________________________________________________
-->
<template>
  <div>

    <el-col :span="span.fCompany">
      <el-form-item label="法人公司：" prop="fCompany">
        <el-select v-model="queryObj.legalCompanyName"
                   placeholder="请选择" @change="changeLocationValue" style="width: 240px"
        >
          <el-option
            v-for="item in queryObj.fCompanylist"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          >
          </el-option>
        </el-select>
        <!-- <el-input v-else  v-model="form.corporateCompanyName" :disabled="true" ></el-input> -->
      </el-form-item>
    </el-col>
    <el-col :span="span.project">
      <el-form-item label="项目名称："
                    v-show="show.project"
                    prop="projectName"
      >
        <el-select v-model="queryObj.projectId" style="width: 240px"
                   filterable
                   clearable
                   placeholder="请选择"
                   @change="changeSelect(ENUMTYPE.PROJECT,$event)"
                   @clear="clearSelect(ENUMTYPE.PROJECT)">
          <el-option v-for="(item,index)  in selectData.projectList"
                     :key="index"
                     :label="item.text"
                     :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-col>
    <!-- 合同编号 -->
    <el-col :span="span.accObj">
      <el-form-item :label="'合同编号：'" prop="contractCode">
        <el-input v-model="queryObj.contractCode" :disabled="buttonDisable" style="width:240px;">
          <span @click="addRowToTableConstract" v-show="isEdit" slot="append" class="el-icon-search"
                :style="{'cursor':'pointer'}"></span>
        </el-input>

      </el-form-item>
    </el-col>
    <el-col :span="span.fCompany">
      <el-form-item label='合同名称：' prop='contractNameIn'>
        <el-input v-model='queryObj.contractName' style="width: 240px" :disabled="true"></el-input>
      </el-form-item>
      <slot name="after"></slot>
    </el-col>
    <slot name="before"></slot>
    <ContractSelector
      :showContract="isShowContract"
      :projectId="queryObj.projectId"
      :type="'signed'"
      v-on:cancelDialog="cancelDialog"
      v-on:closeDialog="closeDialog"
      v-on:confirmContract="confirmContract">
    </ContractSelector>
  </div>
</template>
<script>
  import {
    getProjectAccountingTargetTree,
    getCompanylist
  } from '@/api/cost/selectTargetCostAPI'
  import COSTENUM from '@/utils/cost/enum'
  import { getLocalItem, setLocalItem } from '@/utils/common/cache'
  import { mapGetters } from 'vuex'
  import ContractSelector from '@/components/cost/ContractSelector/'
  import { getPaymentCashDepositCode } from '@/api/cost/bidBondAPI'

  export default {
    name: 'ProjectSelector',
    props: {
      value: {
        type: Object,
        default: function() {
          return {
            companyId: '', // 可能是groupId ||  companyId || deptId
            companyName: '',
            projectId: '', // 项目id
            accObjId: '', // 成本分期id
            projectName: ''
            // corporateCompanyId:'',

          }
        }
      },
      // 标签宽度
      labelWidth: {
        type: Object,
        default: function() {
          return {
            group: 120,
            company: 120,
            dept: 120,
            project: 120,
            accObj: 120
          }
        }
      },
      // 列宽
      span: {
        type: Object,
        default: function() {
          return {
            group: 8,
            company: 8,
            dept: 8,
            project: 8,
            accObj: 8,
            fCompany: 8
          }
        }
      },
      show: {
        type: Object,
        default: function() {
          return {
            group: true,
            company: true,
            dept: true,
            project: true,
            accObj: false,
            fCompany: false
          }
        }
      }
    },
    data: function() {
      return {
        ENUMTYPE: {
          'GROUP': 'GROUP',
          'COMPANY': 'COMPANY',
          'DEPT': 'DEPT',
          'PROJECT': 'PROJECT',
          'ACC_OBJ': 'ACC_OBJ'
        },
        radio: '',
        isEdit: true,
        data: [],
        queryModuleName: '',
        contractInfo: {},
        contractDetail: {},
        visaInfo: [],
        selectTable: [],
        isShowContract: false,
        buttonDisable: false,
        contractQueryModel: {
          projectId: '',
          contractId: '',
          contractCode: '',
          contractName: '',
          contractType: '',
          contractStatus: '5',
          pageNo: 1,
          pageSize: 10,
          count: 0
        },
        queryObj: {
          groupId: '',
          companyId: '',
          companyName: '',
          deptId: '',
          projectId: '',
          projectName: '',
          accObjId: '',
          fCompanylist: '',
          contractId: '',
          contractCode: '',
          contractName: '',
          contractNumber: '',
          legalCompanyId: '',
          legalCompanyName: ''
          // corporateCompanyId:'',
          // corporateCompanyName:''
        },
        totalData: {
          allData: [], // 所有展开数据
          groupList: [],
          companyList: [],
          deptList: [],
          projectList: [],
          accObjList: []
        },
        selectData: {
          groupList: [],
          companyList: [],
          deptList: [],
          projectList: [],
          accObjList: []
        },
        rules: {
          projectName: [
            { required: true, message: '请选择项目', trigger: 'blur' }
          ],
          fCompany: [
            { required: true, message: '请选择法人公司', trigger: 'blur' }
          ],
          contractNameIn: [
            { required: true, message: '请填写合同名称', trigger: 'blur' }
          ],
          contractCode: [
            { required: true, message: '请填写合同编号', trigger: 'blur' }
          ]
        }
      }
    },
    components: {
      ContractSelector
    },
    computed: {
      ...mapGetters(['selectOrg'])
    },
    mounted: function() {
      this.getList()
      this.initValue(true)
    },
    methods: {
      deepCopy(data) {
        return JSON.parse(JSON.stringify(data))
      },
      initValue(init) {
        // 初始化
        debugger
        this.queryObj.projectId = this.$route.query.projectId
        this.queryObj.projectName = this.$route.query.projectName
        this.queryObj.legalCompanyName = this.$route.query.legalCompanyName
        this.queryObj.contractCode = this.$route.query.contractId
        this.queryObj.contractName = this.$route.query.contractName
        // debugger
        // parentIds
        let _item = this.totalData.allData.find(item => {
          return item.id === this.value.companyId
        })
        if (_item) {
          switch (_item.type) {
            case COSTENUM.projectTreeType.TREE_NODE_GROUP:
              this.queryObj.groupId = this.value.companyId
              if (!init) {
                this.initCompanySelect()
                this.initDeptSelect()
                this.initProjectSelect()
                this.initAccObjSelect()
              }
              break
            case COSTENUM.projectTreeType.TREE_NODE_COMPANY:
              // this.queryObj.companyId = this.value.companyId
              if (!init) {
                this.initDeptSelect()
                this.initProjectSelect()
                this.initAccObjSelect()
              }
              break
            case COSTENUM.projectTreeType.TREE_NODE_DEPT:
              this.queryObj.deptId = this.value.companyId
              if (!init) {
                this.initProjectSelect()
                this.initAccObjSelect()
              }
              break
            default:
              break
          }
        }
        // this.queryObj.projectId = this.value.projectId
        if (this.queryObj.projectId) {
          this.initAccObjSelect()
        }
        // this.queryObj.accObjId = this.value.accObjId
        localStorage.setItem('accObjId', this.value.accObjId)
      },
      emitValue(companyId, projectId, objId, projectName) {
        let param = {
          projectId: this.queryObj.projectId
        }
        getCompanylist(param)
          .then(response => {
            console.log(response.data)
            this.queryObj.fCompanylist = response.data
          })
          .catch(error => {
            console.log(error)
            this.$showError(error.message ? error.message : 'msg_system_error')
          })

        this.$emit('input', {
          companyId: this.queryObj.companyId,
          companyName: this.queryObj.companyName,
          projectId: projectId || this.queryObj.projectId,
          accObjId: objId || this.queryObj.accObjId,
          projectName: projectName || this.queryObj.projectName,
          fCompanylist: this.queryObj.fCompanylist
        })
      },
      changeLocationValue(val) {
        let obj = {}
        obj = this.queryObj.fCompanylist.find((item) => {
          if (item.name === val) {
            localStorage.setItem('legalCompanyId', item.id)
            localStorage.setItem('legalCompanyName', item.name)
            this.queryObj.legalCompanyId = item.id
            this.queryObj.legalCompanyName = item.name
          }
        })
      },
      initGroupSelect(isInit) {
        // 集团
        this.selectData.groupList = this.data[0].children
        if (isInit) this.totalData.groupList = this.deepCopy(this.selectData.groupList)

        // 所有展开数据
        if (isInit) this.totalData.allData = this.totalData.allData.concat(this.totalData.groupList)
      },
      initCompanySelect(isInit) {
        // 公司
        let _companyArray = []
        if (isInit) {
          this.selectData.groupList.map(item => {
            if (item && item.children && item.children.length > 0) _companyArray = _companyArray.concat(item.children)
          })
        } else {
          this.queryObj.deptId = ''
          if (this.queryObj.groupId) {
            let _group = this.selectData.groupList.find(item => {
              return item.id === this.queryObj.groupId
            })
            _companyArray = _group ? _group.children : this.deepCopy(this.totalData.companyList)
          } else {
            _companyArray = this.deepCopy(this.totalData.companyList)
            this.initDeptSelect()
          }
        }
        this.selectData.companyList = _companyArray
        if (isInit) this.totalData.companyList = this.deepCopy(this.selectData.companyList)

        // 所有展开数据
        if (isInit) this.totalData.allData = this.totalData.allData.concat(this.totalData.companyList)
      },
      initDeptSelect(isInit) {
        // 事业部
        let _deptArray = []
        if (isInit) {
          this.selectData.companyList.map(item => {
            if (item && item.children && item.children.length > 0) _deptArray = _deptArray.concat(item.children)
          })
        } else {
          // this.queryObj.deptId = ''
          // this.queryObj.projectId = ''
          if (this.queryObj.companyId) {
            let _company = this.selectData.companyList.find(item => {
              return item.id === this.queryObj.companyId
            })
            _deptArray = _company ? _company.children : this.deepCopy(this.totalData.deptList)
          } else {
            _deptArray = this.deepCopy(this.totalData.deptList)
            this.initProjectSelect()
          }
        }
        this.selectData.deptList = _deptArray
        if (isInit) this.totalData.deptList = this.deepCopy(this.selectData.deptList)

        // 所有展开数据
        if (isInit) this.totalData.allData = this.totalData.allData.concat(this.totalData.deptList)
      },
      initProjectSelect(isInit) {
        // 项目
        let _projectArray = []
        if (isInit) {
          this.selectData.deptList.map(item => {
            if (item && item.children && item.children.length > 0) _projectArray = _projectArray.concat(item.children)
          })
        } else {
          if (this.queryObj.deptId) {
            let _dept = this.selectData.deptList.find(item => {
              return item.id === this.queryObj.deptId
            })
            _projectArray = _dept ? _dept.children : this.deepCopy(this.totalData.projectList)
          } else {
            _projectArray = this.deepCopy(this.totalData.projectList)
          }
        }
        this.selectData.projectList = _projectArray
        if (isInit) this.totalData.projectList = this.deepCopy(this.selectData.projectList)

        // 所有展开数据
        if (isInit) this.totalData.allData = this.totalData.allData.concat(this.totalData.projectList)
      },
      initAccObjSelect(isInit) {
        // 成本分期
        let _accObjArray = []
        if (isInit) {
          this.selectData.projectList.map(item => {
            if (item && item.children && item.children.length > 0) _accObjArray = _accObjArray.concat(item.children)
          })
        } else {
          if (this.queryObj.projectId) {
            let _project = this.selectData.projectList.find(item => {
              return item.id === this.queryObj.projectId
            })
            _accObjArray = _project ? _project.children : this.deepCopy(this.totalData.accObjList)
          } else {
            _accObjArray = this.deepCopy(this.totalData.accObjList)
          }
        }
        this.selectData.accObjList = _accObjArray
        if (isInit) this.totalData.accObjList = this.deepCopy(this.selectData.accObjList)

        // 所有展开数据
        if (isInit) this.totalData.allData = this.totalData.allData.concat(this.totalData.accObjList)
      },
      // 初始化数据
      initData() {
        // debugger
        // 初始加载
        this.initGroupSelect(true)
        this.initCompanySelect(true)
        this.initDeptSelect(true)
        this.initProjectSelect(true)
        this.initAccObjSelect(true)
      },
      // 获取列表
      getList() {
        this.totalData.allData = []
        let storage_key = 'components_cost_ProjectSelector'
        this.data = getLocalItem(storage_key)
        if (!this.data) {
          console.log('ajax request [components_cost_ProjectSelector] data ')
          getProjectAccountingTargetTree()
            .then(response => {
              this.data = response.data
              setLocalItem(storage_key, this.data, 60 * 60)// 缓存1个小时
              this.initData()
            })
            .catch(error => {
              console.log(error)
              this.$showError(error.message ? error.message : 'msg_system_error')
            })
        } else {
          this.initData()
        }
      },
      // 清除选择
      clearSelect(ENUMTYPE) {
        this.changeSelect(ENUMTYPE, null)
      },
      // 选择改变
      changeSelect(type, event) {
        // debugger
        if (event && this.totalData.allData) {
          let selectItem = this.totalData.allData.find(item => {
            return item.id === event
          })
          // alert(JSON.stringify(selectItem))
          // localStorage.setItem("")
          this.$emit('change', selectItem)
        }
        switch (type) {
          case this.ENUMTYPE.GROUP:
            // this.queryObj.companyId = ''
            this.queryObj.deptId = ''
            this.queryObj.projectId = ''
            this.queryObj.accObjId = ''
            if (this.queryObj.groupId === '') this.initData()
            break
          case this.ENUMTYPE.COMPANY:
            this.queryObj.deptId = ''
            this.queryObj.projectId = ''
            this.queryObj.accObjId = ''
            if (this.queryObj.companyId === '') this.initData()
            break
          case this.ENUMTYPE.DEPT:
            this.queryObj.projectId = ''
            this.queryObj.accObjId = ''
            if (this.queryObj.deptId === '') this.initData()
            break
          case this.ENUMTYPE.PROJECT:
            if (this.queryObj.projectId === '') this.initData()
            break
          case this.ENUMTYPE.ACC_OBJ:
            if (this.queryObj.accObjId === '') this.initData()
            break
        }

        let obj = {}
        obj = this.selectData.projectList.find((item) => { // 这里的userList就是上面遍历的数据源
          return item.id === event// 筛选出匹配数据
        })
        // alert(JSON.stringify(obj))
        this.queryObj.projectId = obj.id
        this.queryObj.projectName = obj.text
        this.emitValue()
      },
      cancelDialog(data) {
        debugger
        this.isShowContract = data
      },
      closeDialog(data) {
        debugger
        this.isShowContract = data
      },
      addRowToTableConstract() {
        // debugger
        this.isShowContract = true
      },
      getPaymentCashDepositCode() {
        let param = {
          contractCode: this.queryObj.contractCode
        }
        // alert(JSON.stringify(param))
        getPaymentCashDepositCode(param)
          .then(response => {
            // this.ConstructionModel.receiptsNo = response.data
            localStorage.setItem('receiptsNo', response.data)
          })
          .catch(error => {
            console.log(error)
            this.$showError(error.message ? error.message : 'msg_system_error')
          })
      },
      confirmContract(data) {
        this.queryObj.contractCode = data.contractCode
        this.queryObj.contractName = data.contractName
        this.queryObj.projectId = data.projectId
        this.queryObj.projectName = data.projectName
        // 给项目id赋值
        localStorage.setItem('contractId', this.queryObj.contractCode)
        localStorage.setItem('contractName', this.queryObj.contractName)
        localStorage.setItem('projectId', this.queryObj.projectId)
        localStorage.setItem('projectName', this.queryObj.projectName)
        let param = {
          projectId: this.queryObj.projectId
        }
        getCompanylist(param)
          .then(response => {
            console.log(response.data)
            this.queryObj.fCompanylist = response.data
            this.queryObj.legalCompanyName = response.data.name
          })
          .catch(error => {
            console.log(error)
            this.$showError(error.message ? error.message : 'msg_system_error')
          })
        this.getPaymentCashDepositCode()
      },
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row)
          })
        } else {
          this.$refs.multipleTable.clearSelection()
        }
      },
      handleSelect(selection, row) {
        for (let i = 0; i < selection.length; i++) {
          if (selection[i].index === row.index) {
            this.tableData.forEach((item) => {
              if (item.index === row.index) {
                item.checked = true
              }
            })
          }
        }
      },

      handleSelectAll(selection, row) {
        // 全选/取消全选
        let allChecked = true
        if (selection.length === 0) {
          allChecked = false
        }
        this.tableData.forEach((item) => {
          item.checked = allChecked
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      // confirmContract() {
      //   this.queryObj.contractCode = this.contractInfo.contractCode
      //   // this.queryObj.contractName = data.contractName
      //   this.queryObj.contractId = this.contractInfo.contractId
      //   this.queryObj.contractName = this.contractInfo.contractName
      //   this.queryObj.contractNumber = this.contractInfo.contractNumber
      //   this.queryObj.companyId = this.contractInfo.companyId
      //   this.queryObj.companyName = this.contractInfo.companyName
      //   localStorage.setItem('companyId', this.contractInfo.companyId)
      //   localStorage.setItem('contractId', this.contractInfo.contractId)
      //   localStorage.setItem('contractName', this.contractInfo.contractName)
      //   this.isShowContract = false
      //   alert(this.queryObj.contractCode)
      //   this.getPaymentCashDepositCode(this.queryObj.contractCode);
      //   // this.getVisaList()
      // },
      getCurrentRow(contractDetail) {
        this.contractInfo = contractDetail
      },
      cancel() {
        this.contractInfo = ''
        this.isShowContract = false
      }
    },
    watch: {
      'value': {
        handler(newValue, oldValue) {
          console.log(' value change')
          this.initValue()
        },
        deep: true
      },
      'selectOrg': {
        handler(newValue, oldValue) {
          // debugger
          let _select = newValue || oldValue
          if (_select && _select.type) {
            let companyId = ''
            let projectId = ''
            let accObjId = ''
            switch (_select.type) {
              case COSTENUM.projectTreeType.TREE_NODE_GROUP:
              case COSTENUM.projectTreeType.TREE_NODE_COMPANY:
              case COSTENUM.projectTreeType.TREE_NODE_DEPT:
                companyId = _select.id
                break
              case COSTENUM.projectTreeType.TREE_NODE_PROJECT:
                projectId = _select.id
                break
              default:
                break
            }
            // alert(companyId)
            this.emitValue(companyId, projectId, accObjId)
          }
        },
        deep: true
      }
    }

  }
</script>
<style scoped>
</style>
