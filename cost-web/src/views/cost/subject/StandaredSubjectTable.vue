<template>
  <!-- operate button -->
  <div ref="StandaredSubjectTable">
    <!-- table -->
    <div ref="multipleTable">
      <el-table
        :data="tableData"
        :row-style="showRow"
        align="left"
        stripe
        border
        tooltip-effect="dark"
        style="width: 100%"
        :height="tHeight"
        size="small"
      >
        <!-- 序号 -->
        <!-- <el-table-column type="index"
                                 :label="$l('lbl_no')"
                                 :index="indexMethod"
                                 width="50"
        fixed></el-table-column>-->
        <!-- 级别 -->
        <el-table-column
          prop="level"
          :label="this.$l('lbl_standared_subject_level')"
          width="70"
          fixed
        >
          <template slot-scope="scope">{{ scope.row.code | FLevel }}</template>
        </el-table-column>
        <!-- 科目编码 -->
        <el-table-column
          prop="code"
          :label="this.$l('lbl_standared_subject_code')"
          width="180"
          align="left"
          fixed
        >
          <template slot-scope="scope">
            <div
              v-if="!scope.row._editStatus || !scope.row.isLeaf"
              :style="{'width':'100%','text-align':'left','padding-left':(getLevel(scope.row.code)-1)*5+'px'}"
            >
              <i
                :class="!scope.row._expanded ? 'fa fa-plus-square-o' : 'fa fa-minus-square-o' "
                :title="!scope.row._expanded ? '展开' : '收起'"
                style="font-size:14px;font-weight:bold;cursor:pointer"
                v-if="!scope.row.isLeaf && !scope.row._editStatus"
                @click="handleExpandClick(scope.row)"
              ></i>
              &nbsp;{{ scope.row.code }}
            </div>

            <code-input
              v-model.trim="scope.row.code"
              :placeholder="$l('lbl_standared_subject_code')"
              v-if="scope.row._editStatus && scope.row.isLeaf"
              @blur="handleRowChange('code',scope.row.code,scope.row,$event)"
            />
          </template>
        </el-table-column>

        <!-- 科目名称 -->
        <el-table-column
          prop="name"
          :label="this.$l('lbl_standared_subject_name')"
          show-overflow-tooltip
          fixed
        >
          <template slot-scope="scope">
            <span
              v-if="!scope.row._editStatus"
              :title="scope.row.name"
            >{{scope.row.name | cutString(20)}}</span>
            <el-input
              size="mini"
              v-model.trim="scope.row.name"
              :placeholder="$l('lbl_standared_subject_name')"
              v-if="scope.row._editStatus"
              @blur="handleRowChange('name',scope.row.name,scope.row,$event)"
            ></el-input>
          </template>
        </el-table-column>

        <!-- 财务科目编码 -->
        <el-table-column
          prop="financialSubjectCode"
          show-overflow-tooltip
          :label="this.$l('lbl_standared_subject_financial_subject_code')"
          width="95"
        >
          <template
            slot-scope="scope"
          >{{scope.row.level === '1'?'--':scope.row.financialSubjectCode}}</template>
        </el-table-column>

        <!-- 财务科目名称 -->
        <el-table-column
          prop="financialSubjectName"
          show-overflow-tooltip
          :label="this.$l('lbl_standared_subject_financial_subject_name')"
          width="120"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.level !== '1' && scope.row.financialSubjectCode">
              <span v-if="!scope.row._editStatus">{{scope.row.financialSubjectName}}</span>
              <fd-select
                v-model="scope.row.financialSubjectCode"
                type="cost_subject_financial_subject_name"
                :clearable="false"
                v-if="scope.row._editStatus"
                @change="financialSubjectNameChange(scope.row)"
              ></fd-select>
            </span>
            
            <span v-else></span>
          </template>
        </el-table-column>

        <!-- 分类 -->
        <!-- <el-table-column prop="type"
                                 :label="this.$l('lbl_standared_subject_type')"
                                 show-overflow-tooltip
                                 width="150">
                    <template slot-scope="scope">
                        <span v-if="!scope.row._editStatus">
                            <fd-label :code="scope.row.categoryCode"
                                      type="cost_subject_category"></fd-label>
                        </span>
                        <fd-select v-model='scope.row.categoryCode'
                                   type="cost_subject_category"
                                   :clearable="false"
                                   v-if="scope.row._editStatus"></fd-select>
                    </template>
        </el-table-column>-->
        <!-- 分摊规则 -->
        <el-table-column
          prop="apportionmentRuleCode"
          :label="this.$l('lbl_standared_subject_apportionment_rule')"
          show-overflow-tooltip
          width="110"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.level !== '1'">
              <span v-if="!scope.row._editStatus">
                {{selectData.cost_subject_apportionment_rule_code[scope.row.apportionmentRuleCode]}}
                <!-- <fd-label :code="scope.row.apportionmentRuleCode"
                type="cost_subject_apportionment_rule_code"></fd-label>-->
              </span>
              <fd-select
                v-model="scope.row.apportionmentRuleCode"
                type="cost_subject_apportionment_rule_code"
                :clearable="false"
                v-if="scope.row._editStatus"
              ></fd-select>
            </span>
            
            <span v-if="scope.row.level === '1'">--</span>
          </template>
        </el-table-column>

        <!-- 责任条线 -->
        <!-- <el-table-column prop="subject.responsibleLine"
                                 :label="'责任条线'"
                                 width="150">
                    <template slot-scope="scope">
                        <span v-if="!scope.row._editStatus">
                            <fd-label :code="scope.row.responsibleLine"
                                      type="cost_subject_responsible_line"></fd-label>
                        </span>
                        <fd-select v-model='scope.row.responsibleLine'
                                   type="cost_subject_responsible_line"
                                   :clearable="false"
                                   v-if="scope.row._editStatus"></fd-select>
                    </template>
        </el-table-column>-->
        <!-- 默认不是预备费类型 -->
        <el-table-column prop="reserveCostType" :label="'预备费类型'" show-overflow-tooltip width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.level !== '1'">
              <span v-if="!scope.row._editStatus">
                {{selectData.cost_subject_reserve_cost_type[scope.row.reserveCostType]}}
                <!-- <fd-label :code="scope.row.reserveCostType"
                type="cost_subject_reserve_cost_type"></fd-label>-->
              </span>
              <fd-select
                v-model="scope.row.reserveCostType"
                type="cost_subject_reserve_cost_type"
                :clearable="false"
                v-if="scope.row._editStatus"
              ></fd-select>
            </span>
            
            <span v-if="scope.row.level === '1'">--</span>
          </template>
        </el-table-column>

        <!-- 责任部门 -->
        <el-table-column
          prop="responsibleDeptCode"
          :label="this.$l('lbl_standared_subject_responsible_department')"
          show-overflow-tooltip
          width="100"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.level !== '1'">
              <span v-if="!scope.row._editStatus">
                {{selectData.cost_subject_responsible_dept_code[scope.row.responsibleDeptCode]}}
                <!-- <fd-label :code="scope.row.responsibleDeptCode"
                type="cost_subject_responsible_dept_code"></fd-label>-->
              </span>
              <fd-select
                v-model="scope.row.responsibleDeptCode"
                type="cost_subject_responsible_dept_code"
                :clearable="false"
                v-if="scope.row._editStatus"
              ></fd-select>
            </span>
            
            <span v-if="scope.row.level === '1'">--</span>
          </template>
        </el-table-column>

        <!-- 状态 -->
        <el-table-column
          prop="status"
          :label="this.$l('lbl_standared_subject_enable')"
          show-overflow-tooltip
          align="center"
          width="50"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.level !== '1'">
              {{selectData.cost_subject_status[scope.row.status]}}
              <!-- <fd-label :code="scope.row.status"
              type="cost_subject_status"></fd-label>-->
            </span>
            
            <span v-if="scope.row.level === '1'">--</span>
          </template>
        </el-table-column>

        <!-- 操作列 -->
        <el-table-column :label="this.$l('lbl_operation')" width="200" fixed="right">
          <template slot-scope="scope">
            <div
              v-if="scope.$index !== 0 && scope.level!=='1' && pageStatus.initSuccess"
              style="text-align:left"
            >
              <!-- 新增 -->
              <el-button
                size="mini"
                type="text"
                icon="el-icon-plus"
                title="新增节点"
                :disabled="scope.row._isNew && scope.row._editStatus"
                v-if="!scope.row._editStatus && scope.row.status === '1' && scope.row._permission_save"
                @click="handleAddClick(scope.row,$event)"
              ></el-button>

              <!-- 编辑 -->
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                :title="$l('btn_edit')"
                :disabled="scope.row._isNew && scope.row._editStatus"
                v-if="scope.row._permission_save"
                @click="editRow(scope.$index, scope.row,$event)"
              ></el-button>

              <!-- 保存 -->
              <el-button
                size="mini"
                type="text"
                icon="fa fa-floppy-o"
                :title="$l('btn_save')"
                @click="saveRow(scope.$index, scope.row)"
                v-if="scope.row._permission_save"
                :disabled="!scope.row._editStatus"
              ></el-button>

              <!-- 取消 -->
              <el-button
                size="mini"
                type="text"
                icon="fa fa-undo"
                :title="$l('btn_cancel')"
                v-if="scope.row._permission_save"
                @click="cancelEditRow(scope.$index, scope.row)"
                :disabled="!scope.row._editStatus"
              ></el-button>

              <!-- 删除 -->
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                :title="$l('btn_delete')"
                @click="deleteRow(scope.$index, scope.row)"
                v-if="scope.row._permission_delete"
                :disabled="scope.row._editStatus"
              ></el-button>

              <!-- 禁用 -->
              <el-button
                size="mini"
                type="text"
                icon="el-icon-circle-check-outline"
                :title="$l('btn_enable')"
                @click="changeStatusRow(scope.$index, scope.row)"
                v-if="scope.row.status === '0' && scope.row.isLeaf && scope.row._permission_changeStatus"
                :disabled="scope.row._editStatus"
              ></el-button>

              <!-- 启用 -->
              <el-button
                size="mini"
                type="text"
                icon="el-icon-remove-outline"
                :title="$l('btn_disable')"
                @click="changeStatusRow(scope.$index, scope.row)"
                v-if="scope.row.status === '1' && scope.row.isLeaf && scope.row._permission_changeStatus"
                :disabled="scope.row._editStatus"
              ></el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import {
  getSubjectList,
  saveOrUpdateSubject,
  deleteGroupSubject,
  generateCode,
  changeStatus
} from '@/api/cost/subjectAPI'
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import { getValueByKey } from '@/utils/sys/ParameterUtil.js'
import { FLevel, cutString } from '@/filters/cost/'
import codeInput from '@/components/cost/CodeInput/'
import COSTENUM from '@/utils/cost/enum'
import COSTBUSINESS from '@/utils/cost/business'
import { tableHeight } from '@/utils/common/index'
import { getLocalItem, setLocalItem, removeLocalItem } from '@/utils/common/cache'
import sys_config from '@/config/config.js'
import { calc } from '@/utils/common/calc'
import { deepCopy, ifNull } from '@/utils/cost/objectHelper'
export default {
  props: {
    queryObj_passed_in: {
      type: Object
    }
  },
  data () {
    return {
      tableHeight: '0',
      fullHeight: document.documentElement.clientHeight,
      specialNode: COSTENUM.SPECIAL_SUBJECT_CODE_FLAG,
      pageStatus: {
        initSuccess: true,
        maxLevel: 5, // 最大级别
        levelStartCode: [], // 级别初始编码
        expandedLevel: sys_config.expandedLevel,//默认展开二级
        edit: false
      },
      pageModel: {
        id: 'uuid',
        name: '',
        code: '',
        level: '0',
        financialSubjectCode: '',
        financialSubjectName: '',
        categoryCode: '0',
        apportionmentRuleCode: '0',
        responsibleDeptCode: '0',
        // responsibleLine: '0', // 责任条线
        reserveCostType: '0', // 默认不是预备费类型
        status: '1',
        parent: 'parentRow.code',
        childs: '',
        sort: 0,
        type: '0',
        ownerId: '',
        isDeleted: '0',
        _editStatus: true,
        _expanded: true,
        _show: true,
        _isNew: false,
        _hover: false,
        _permission_save: true,
        _permission_delete: true,
        _permission_changeStatus: true
      },
      importFileUrl: process.env.COST_API + '/subject/importSubjectData',
      fileList: [],
      tableData: [],
      selectEidtRow: [],
      selectExpandArray: [],
      subjectCodeList: [],
      selectData: {
        cost_subject_status: [],//状态
        cost_subject_responsible_dept_code: [],//责任部门
        cost_subject_reserve_cost_type: [],//预备费
        cost_subject_apportionment_rule_code: [],//分摊规则
        cost_subject_financial_subject_name: [],//财务科目名称
      }
    }
  },
  components: {
    'code-input': codeInput
  },
  filters: {
    FLevel,
    cutString
  },
  computed: {
    tHeight: function () {
      let options = {
        fullHeight: this.$store.getters.fullHeight,
        opened: this.$store.getters.sidebar.opened,
        showForm: this.$store.getters.showForm,
        obj: this,
        otherHeight: 140
      }
      return `${tableHeight(options)}px`
    },
    queryObj: function () {
      return deepCopy(this.queryObj_passed_in)
    }
  },
  methods: {
    // 序号
    indexMethod (index) {
      return index + 1
    },
    settingTableHeight: function () {
      const topHeight = this.$refs['multipleTable'].getBoundingClientRect().top
      this.tableHeight = this.fullHeight - topHeight - 80
      this.$refs['multipleTable'].style.Height = this.tableHeight + 'px'
    },
    initParamter: function () {
      // 初始化参数
      const _this = this
      const _setMaxLevel = getValueByKey('cost.subject.max.level')
      if (_setMaxLevel) {
        try {
          _this.pageStatus.maxLevel = parseInt(_setMaxLevel)
          if (_this.pageStatus.maxLevel > 9) _this.pageStatus.maxLevel = 9
          for (let i = 1; i < _this.pageStatus.maxLevel; i++) {
            const _setLevelCode = getValueByKey('cost.subject.base.code.level.' + i)
            if (!_setLevelCode) {
              _this.pageStatus.initSuccess = false
              _this.$showNormalError((i + 1) + _this.$l('msg_standared_miss_code'))
              break
            } else {
              _this.pageStatus.levelStartCode[i - 1] = _setLevelCode
            }
          }
        } catch (error) {
          _this.pageStatus.initSuccess = false
          _this.$showError(error.message ? error.message : 'msg_system_error')
        }
      }
    },
    initTableData: function (response) {
      // 初始化表格
      response.data.map(item => {
        //item.updateDate = new Date(item.updateDate).format()
        item._editStatus = false
        item._expanded = true //false
        item._show = true //item.level === '1'
        item._isNew = false
        item._hover = false

        //处理默认展开级别
        let _level = item.code.split('.').length
        item._expanded = calc.Mul(ifNull(_level, 0), 1) < this.pageStatus.expandedLevel + 1
        item._show = calc.Mul(ifNull(_level, 0), 1) < this.pageStatus.expandedLevel + 2

        item._permission_save = this.$checkPersmissionByCode('cost:subject:save')
        item._permission_delete = this.$checkPersmissionByCode('cost:subject:delete')
        item._permission_changeStatus = this.$checkPersmissionByCode('cost:subject:changeStatus')
      })
      this.tableData = response.data
    },
    checkCanAddRow: function (row) {
      // 检查是否显示增加子节点按钮（控制到最大层级）
      let checkLastIsNot99 = true
      if (row.code.length > 3) {
        checkLastIsNot99 = row.code.substring(row.code.length - 3, row.code.length) !== this.specialNode
      }
      return checkLastIsNot99 && (row.code.split('.').length < this.pageStatus.maxLevel)
    },
    showRow: function (row) {
      // 行隐藏
      const show = row.row._show
      return show ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;' : 'display:none;'
    },
    getList () {
      // 获取数据
      LoadingUtil.showLoading()
      getSubjectList(this.queryObj)
        .then(response => {
          LoadingUtil.hideLoading()
          this.initTableData(response)
        })
        .catch(error => {
          console.log(error)
          this.$showError(error.message ? error.message : 'msg_system_error')
        })
    },
    sortList () {
      this.getList()
      // this.tableData.sort((item1, item2) => { return item1.code > item2.code })
    },
    getLevel (parentCode) {
      // 获取级别
      return parentCode.split('.').length
    },
    getParentChild (parentCode) {
      // 获取下级子节点
      const _this = this
      let _ChildRow = []
      _ChildRow = _this.subjectCodeList.filter(item => {
        return item.indexOf(parentCode + '.') > -1
      })
      return _ChildRow
    },
    getInsertRowIndex (parentIndex, parentCode) {
      // 获取待插入的行号
      let _insertIndex = 0
      const _ChildRowArray = this.tableData.filter(item => {
        return item.code.substr(0, parentCode.length + 1) === parentCode + '.'
      })
      _insertIndex = parentIndex + _ChildRowArray.length + 1
      return _insertIndex
    },
    getDefaultRow (index, parentRow) {
      return {
        // id: uuidv1(),
        name: '',
        code: null,
        level: (this.getLevel(parentRow.code) + 1).toString(),
        financialSubjectCode: '',
        financialSubjectName: '',
        categoryCode: '',
        apportionmentRuleCode: '',
        responsibleDeptCode: '',
        // responsibleLine: '', // 责任条线
        reserveCostType: '0', // 默认不是预备费类型
        status: '1',
        parent: parentRow.code,
        childs: '',
        sort: 0,
        type: '0', // 0：集团科目，1：公司科目， 2: 项目科目
        ownerId: '0',
        isDeleted: '0',
        node_source: '0',
        _editStatus: true,
        _expanded: true,
        _show: true,
        _isNew: false,
        _hover: false,
        isLeaf: true,
        _permission_save: true,
        _permission_delete: true,
        _permission_changeStatus: true
      }
    },
    getROwIndex (row) {
      const _index = this.tableData.lastIndexOf(row)
      return _index
    },
    addRowToTable (index, parentRow) {
      const _this = this
      generateCode({ 'code': parentRow.code, type: '0', ownerId: '0' })
        .then(response => {
          const _row = this.getDefaultRow(index, parentRow)
          _row.responsibleDeptCode = parentRow.responsibleDeptCode // 继承父节点责任部门 可修改
          _row.code = response.data
          _row._isNew = true
          this.tableData.splice(index, 0, _row)
          _this.pageStatus.edit = true
        })
        .catch(error => {
          console.log(error)
          _this.$showError(error.message ? error.message : 'msg_system_error')
          _this.pageStatus.edit = false
        })
    },
    deleteRowFromTable (index) {
      this.tableData.splice(index, 1)
    },
    toggleSelection (rows) {
      const _this = this
      _this.tableData.map(item => {
        item._editStatus = false
      })
    },
    checkRowIsChange (rowData) {
      if (!this.selectEidtRow[rowData.id]) return true
      const newValue = JSON.parse(JSON.stringify(rowData))
      const oldValue = JSON.parse(JSON.stringify(this.selectEidtRow[rowData.id]))
      newValue._editStatus = oldValue._editStatus = true
      newValue._expanded = oldValue._expanded = true
      newValue._show = oldValue._show = true
      newValue._isNew = oldValue._isNew = false
      newValue._hover = oldValue._hover = false
      return JSON.stringify(newValue) !== JSON.stringify(oldValue)
    },
    checkCode (code) {
      debugger
      const _this = this
      let _checkResult = true
      const _lastCode = code.substring(0, _this.pageStatus.levelStartCode[0].length)
      // if (!code) {
      //     _checkResult = false
      // } else if (_lastCode !== _this.pageStatus.levelStartCode[0]) {
      //     _checkResult = false
      // }
      const _filter = _this.tableData.filter(item => { return item.code === code })
      if (_filter && _filter.length > 1) _checkResult = false // 已经存在
      return _checkResult
    },
    deleteRow (index, rowData) {
      this.$confirm(this.$l('msg_standared_delete_code'), this.$l('msg_delete_tips'), {
        confirmButtonText: this.$l('btn_confirm'),
        cancelButtonText: this.$l('btn_cancel'),
        type: 'warning'
      }).then(() => {
        deleteGroupSubject(rowData)
          .then(response => {
            this.$showSuccess(response.message)
            if (response.status !== '404') this.$delete(this.tableData, index)
            this.getList()
          })
          .catch(error => {
            console.log(error)
            this.$showError(error.message ? error.message : 'msg_system_error')
          })
      })
        .catch(() => { })
    },
    editRow (index, rowData, event) {
      if (this.pageStatus.edit) {
        this.$showError('msg_subject_finish_edit')
        return
      }
      this.pageStatus.edit = true
      // rowData.id
      const newItem = this.tableData[index]
      this.selectEidtRow[rowData.id] = JSON.parse(JSON.stringify(rowData))
      newItem._editStatus = !newItem._editStatus
      Vue.set(this.tableData, index, newItem)
    },
    cancelEditRow (index, rowData) {
      if (rowData._isNew) {
        this.tableData.splice(index, 1)
      } else {
        Vue.set(this.tableData, index, this.selectEidtRow[rowData.id])
      }
      this.pageStatus.edit = false
    },
    saveRow (index, rowData) {
      const _this = this
      // if(!_this.checkRowIsChange(rowData)){
      //     _this.$showError('msg_standared_no_data_modified')
      //     _this.toggleSelection()
      //     return
      // }
      const _checkResult = _this.checkCode(rowData.code)
      // if (rowData.code && rowData.code.split('.').length !== 4 && rowData.code.indexOf(this.specialNode) > -1) {
      //     this.$showNormalError('只有三级科目新增四级子节点的时候，才可以新增' + this.specialNode + '子节点。')
      //     return
      // }
      if (_checkResult) {
        saveOrUpdateSubject(rowData)
          .then(response => {
            LoadingUtil.hideLoading()
            _this.toggleSelection()
            if (response.code !== '2000') {
              _this.$showError(response.message)
            } else {
              rowData._isNew = false
              rowData.id = response.data.id || ''
              rowData.version = response.data.version || 0
              Vue.set(this.tableData, index, rowData)
              _this.sortList()
              _this.$showSuccess(response.message)
            }
            _this.pageStatus.edit = false
          })
          .catch(error => {
            _this.$showError(error.message ? error.message : 'msg_system_error')
            console.log(error)
            _this.pageStatus.edit = false
          })
      } else {
        this.$showError('msg_standared_wrong_data')
        _this.pageStatus.edit = false
      }
    },
    changeStatusRow (index, rowData) {
      const _this = this
      const _postRowData = JSON.parse(JSON.stringify(rowData))
      _postRowData.status = (1 - _postRowData.status).toString()
      changeStatus(_postRowData)
        .then(response => {
          LoadingUtil.hideLoading()
          _this.toggleSelection()
          if (response.code !== '2000') {
            _this.$showError(response.message)
          } else {
            _postRowData.version = response.data.version || 0
            Vue.set(_this.tableData, index, _postRowData)
            _this.$showSuccess(response.message)
          }
        })
        .catch(error => {
          _this.$showError(error.message ? error.message : 'msg_system_error')
          console.log(error)
        })
    },
    handleRowChange (fieldType, fieldValue, rowData, event) {
      let _reg = ''
      let _errmsg = null
      if (fieldValue.length === 0) {
        this.$showError('msg_standared_empty_data')
        event.currentTarget.focus()
        return
      }
      switch (fieldType) {
        case 'code':
          fieldValue = fieldValue.replace(/\./g, '')
          _reg = /^\+?[1-9][0-9]{0,30}$/
          _errmsg = this.$l('lbl_standared_subject_code') + this.$l('msg_standared_wrong_data')
          break
        case 'name':
          _reg = /^.{0,30}$/
          _errmsg = this.$l('lbl_standared_subject_name') + this.$l('msg_standared_wrong_data')
          break
        case 'financialSubjectCode':
          fieldValue = fieldValue.replace(/\./g, '')
          _reg = /^\+?[1-9][0-9]{0,30}$/
          _errmsg = this.$l('lbl_standared_subject_financial_subject_code') + this.$l('msg_standared_wrong_data')
          break
        case 'financialSubjectName':
          _reg = /^.{0,30}$/
          _errmsg = this.$l('lbl_standared_subject_financial_subject_name') + this.$l('msg_standared_wrong_data')
          break
        default:
          break
      }
      if (!fieldValue.match(_reg) && !this.checkCode(rowData.code)) {
        this.$showNormalError(_errmsg)
        event.currentTarget.focus()
      }
    },
    handleAddClick (row, event) {
      if (!this.checkCanAddRow(row)) {
        this.$showNormalError('超出最大级别（' + this.pageStatus.maxLevel + '）或为' + this.specialNode)
        return
      }
      if (this.pageStatus.edit) {
        this.$showError('msg_subject_finish_edit')
        return
      }
      if (row.code && row.code.indexOf(this.specialNode) > -1) {
        this.$showNormalError(this.specialNode + '科目不能新增子节点。')
        return
      }
      this.pageStatus.edit = true
      const _index = this.getROwIndex(row)
      const _insertIndex = this.getInsertRowIndex(_index, row.code)
      this.addRowToTable(_insertIndex, row)
    },
    handleExpandClick (rowData) {
      //LoadingUtil.showLoading()
      let parentExpanded
      this.tableData.map(item => {
        if (item.code === rowData.code) {
          item._expanded = !item._expanded
          parentExpanded = item._expanded
        }
        if (item.code.indexOf(rowData.code) > -1 && item.code !== rowData.code) {
          item._show = parentExpanded
          item._expanded = parentExpanded
        }
      })

      //setTimeout(LoadingUtil.hideLoading(), 1000)
      if (rowData.code.level === '1') {
        this.fullHeight = document.documentElement.clientHeight
      }
    },
    // 下载文件
    handleExport () {
      LoadingUtil.showLoading()
      setTimeout(function () {
        LoadingUtil.hideLoading()
      }, 2000)
      COSTBUSINESS.download(process.env.COST_API + '/subject/exportSubjectData')
    },
    handleUploadBefore (file) {
      LoadingUtil.showLoading()
      this.fileName = file.name
      var extension = file.name.split('.')[1] === 'xlsx' || file.name.split('.')[1] === 'xls'
      var isLt2M = file.size / 1024 / 1024 < 1
      if (!extension) {
        this.$showError('msg_standared_subject_file_extension')
        LoadingUtil.hideLoading()
      }
      if (!isLt2M) {
        this.$showError('msg_standared_subject_file_size')
        LoadingUtil.hideLoading()
      }
      return extension && isLt2M
    },
    handleUploadSuccess (response, file, fileList) {
      const _this = this
      if (response.code !== '2000') {
        this.$showError(response.message)
        LoadingUtil.hideLoading()
      } else {
        if (response.status !== '404' && response && response.data) {
          _this.initTableData(response)
        }
        LoadingUtil.hideLoading()
        this.$showSuccess(response.message)
      }
    },
    handleMouseEnter (row, column, cell, event) {
      return
      this.tableData.map(item => {
        if (item.code === row.code) {
          item._hover = true
        } else {
          item._hover = false
        }
      })
    },
    financialSubjectNameChange (rowData) {
      rowData.financialSubjectName = this.selectData.cost_subject_financial_subject_name[rowData.financialSubjectCode]
    }
  },
  mounted () {
    // console.log(COSTENUM.SPECIAL_SUBJECT_CODE_FLAG)
    this.tableData.map(item => { item._editStatus = false })
    this.initParamter()
    this.$nextTick(function () {
      this.settingTableHeight()
    })
    // window.onresize = () => {
    //   return (() => {
    //     this.fullHeight = document.documentElement.clientHeight
    //   })()
    // }
    let allDICTIONARY = getLocalItem("DICTIONARY")
    allDICTIONARY = JSON.parse(allDICTIONARY)
    allDICTIONARY['cost_subject_status'].map(item => {
      this.selectData.cost_subject_status[item.dictValue] = item.dictLabelCn
    })
    allDICTIONARY['cost_subject_responsible_dept_code'].map(item => {
      this.selectData.cost_subject_responsible_dept_code[item.dictValue] = item.dictLabelCn
    })
    allDICTIONARY['cost_subject_reserve_cost_type'].map(item => {
      this.selectData.cost_subject_reserve_cost_type[item.dictValue] = item.dictLabelCn
    })
    allDICTIONARY['cost_subject_apportionment_rule_code'].map(item => {
      this.selectData.cost_subject_apportionment_rule_code[item.dictValue] = item.dictLabelCn
    })
    allDICTIONARY['cost_subject_financial_subject_name'].map(item => {
      this.selectData.cost_subject_financial_subject_name[item.dictValue] = item.dictLabelCn
    })

  },
  watch: {
    fullHeight (val) {
      this.settingTableHeight()
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
