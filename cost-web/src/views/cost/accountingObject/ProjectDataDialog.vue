<template>
    <div class="projectDialog">
        <el-dialog title="项目主数据列表"
                   class="accountObject"
                   :visible.sync="dialogVisible"
                   width="65%"
                   :show-close="false"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false">
            <el-table border
                      :span-method="arraySpans"
                      :data="customAccountObject"
                      :height="400"
                      style="width: 100%;margin-bottom:10px;"
                      :cell-style="tableCellClassName">
                <el-table-column prop="parcelPhaseName"
                                 label="分期"
                                 >
                </el-table-column>

                <el-table-column prop="fCompanyName"
                                 label="法人公司"
                                 width="180">
                </el-table-column>
                <el-table-column prop="name3" width="80"
                                 label="业态">
                </el-table-column>

                <el-table-column prop="product_property"
                                 label="产品属性"
                                 width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.product_property ==='1' ">
                            毛坯
                        </span>
                        <span v-else-if="scope.row.product_property ==='2' ">
                            精装
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="buildingArea"
                                 label="建设用地面积"
                                 width="150">
                    <template slot-scope="scope">
                        <span>{{scope.row.buildingArea | NumFormat}}</span>
                    </template>

                </el-table-column>
                <el-table-column prop="totalBuildingArea"
                                 label="总建筑面积"
                                 width="150">
                    <template slot-scope="scope">

                        <div>
                            <span v-if="scope.$index%3==0">{{scope.row.totalBuildingArea | NumFormat}}</span>
                            <span v-if="scope.$index%3==1 && isEadit">
                                <el-input v-model="scope.row.roughBuildingArea"
                                          :class="{ active: scope.row._isValid }"></el-input>
                            </span>
                            <span v-if="scope.$index%3==1 && !isEadit">{{scope.row.roughBuildingArea | NumFormat}}</span>
                            <span v-if="scope.$index%3==2 && isEadit">
                                <el-input v-model="scope.row.hardboundBuildingArea"
                                          :class="{ active: scope.row._isValid }"></el-input>
                            </span>
                            <span v-if="scope.$index%3==2 && !isEadit">{{scope.row.hardboundBuildingArea | NumFormat}}</span>
                        </div>

                    </template>

                </el-table-column>
                <el-table-column prop="totalSellArea"
                                 label="总可售面积"
                                 width="120">
                    <template slot-scope="scope">
                        <div>
                            <span v-if="scope.$index%3==0">{{scope.row.totalSellArea | NumFormat}}</span>
                            <span v-else-if="scope.$index %3==1 && isEadit">
                                <el-input v-model="scope.row.roughSellArea" @change="isStandRoughSellArea(scope.row,scope.$index)"></el-input>
                                </el-input>
                            </span>
                            <span v-else-if="scope.$index %3==1 && !isEadit">{{scope.row.roughSellArea | NumFormat}}</span>
                            <span v-else-if="scope.$index%3==2 && isEadit">
                                <el-input v-model="scope.row.hardboundSellArea" @change="isStandRoughSellArea(scope.row,scope.$index)"></el-input>
                            </span>
                            <span v-else-if="scope.$index%3==2 && !isEadit">{{scope.row.hardboundSellArea | NumFormat}}</span>
                        </div>

                    </template>

                </el-table-column>

            </el-table>
            <span>
                <el-button size="mini"
                           @click="cancel">取 消</el-button>
                <el-button size="mini"
                           type="primary"
                           @click="submit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import {
  NumFormat, // 千位符
  FLevel,
  dateFormat,
  Version
} from '@/filters/cost/'
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import {
  updateAccountObject, tobeSyncList, saveSyncMds
} from '@/api/cost/accountObjectAPI'
export default {
  props: {
    dialogVisible: {
      type: Boolean
    },
    projectDialogData: {
      type: Object
    }
  },
  filters: {
    NumFormat,
    FLevel,
    dateFormat,
    Version
  },
  data() {
    return {
      fCompanyArr: [],
      fCompany: 0,
      isEadit: false,
      customAccountObject: [],
      publicComponents: [
        {
          '_isValid': false,
          'phaseId': '', // 项目主数据分期ID
          'phaseCode': '', // 项目主数据分期编码
          'phaseName': '', // 项目主数据分期名称
          'fCompanyId': '', // 法人公司ID
          'fCompanyName': '', // 法人公司名称
          'businessTypeCode': '', // 业态编号
          'businessTypeName': '', // 业态名称
          'name1': '', // 一级业态
          'name2': '', // 二级业态,产品类型
          'name3': '', // 三级业态,产品类型
          'roughBuildingArea': '', // 毛坯建筑面积
          'roughSellArea': '', // 毛坯可售面积
          'hardboundBuildingArea': '', // 精装建筑面积
          'hardboundSellArea': '', // 精装可售面积
          'buildingArea': '', // 建设用地面积
          'totalBuildingArea': '', // 总建筑面积
          'totalSellArea': '', // 总可售面积
          'product_property': '1',
          'parcelPhaseName': ''
        }, {
          '_isValid': false,
          'phaseId': '', // 项目主数据分期ID
          'phaseCode': '', // 项目主数据分期编码
          'phaseName': '', // 项目主数据分期名称
          'fCompanyId': '', // 法人公司ID
          'fCompanyName': '', // 法人公司名称
          'businessTypeCode': '', // 业态编号
          'businessTypeName': '', // 业态名称
          'name1': '', // 一级业态
          'name2': '', // 二级业态,产品类型
          'name3': '', // 三级业态,产品类型
          'roughBuildingArea': '', // 毛坯建筑面积
          'roughSellArea': '', // 毛坯可售面积
          'hardboundBuildingArea': '', // 精装建筑面积
          'hardboundSellArea': '', // 精装可售面积
          'buildingArea': '', // 建设用地面积
          'totalBuildingArea': '', // 总建筑面积
          'totalSellArea': '', // 总可售面积
          'product_property': '2',
          'parcelPhaseName': ''
        }
      ],
      roughAccountObject:
                {
                  '_isValid': false,
                  'ispush': '1',
                  'phaseId': '', // 项目主数据分期ID
                  'phaseCode': '', // 项目主数据分期编码
                  'phaseName': '', // 项目主数据分期名称
                  'fCompanyId': '', // 法人公司ID
                  'fCompanyName': '', // 法人公司名称
                  'businessTypeCode': '', // 业态编号
                  'businessTypeName': '', // 业态名称
                  'name1': '', // 一级业态
                  'name2': '', // 二级业态,产品类型
                  'name3': '', // 三级业态,产品类型
                  'roughBuildingArea': '', // 毛坯建筑面积
                  'roughSellArea': '', // 毛坯可售面积
                  'hardboundBuildingArea': '', // 精装建筑面积
                  'hardboundSellArea': '', // 精装可售面积
                  'buildingArea': '', // 建设用地面积
                  'totalBuildingArea': '', // 总建筑面积
                  'totalSellArea': '', // 总可售面积
                  'product_property': '1',
                  'parcelPhaseName': ''
                },

      hardboundAccountObject:
                {
                  '_isValid': false,
                  'ispush': '1',
                  'phaseId': '', // 项目主数据分期ID
                  'phaseCode': '', // 项目主数据分期编码
                  'phaseName': '', // 项目主数据分期名称
                  'fCompanyId': '', // 法人公司ID
                  'fCompanyName': '', // 法人公司名称
                  'businessTypeCode': '', // 业态编号
                  'businessTypeName': '', // 业态名称
                  'name1': '', // 一级业态
                  'name2': '', // 二级业态,产品类型
                  'name3': '', // 三级业态,产品类型
                  'roughBuildingArea': '', // 毛坯建筑面积
                  'roughSellArea': '', // 毛坯可售面积
                  'hardboundBuildingArea': '', // 精装建筑面积
                  'hardboundSellArea': '', // 精装可售面积
                  'buildingArea': '', // 建设用地面积
                  'totalBuildingArea': '', // 总建筑面积
                  'totalSellArea': '', // 总可售面积
                  'product_property': '2',
                  'parcelPhaseName': ''
                },
      accountObject: []
    }
  },
  methods: {
    // 总可售面积总数只能改小，不能改大
    isStandRoughSellArea(row, indexes) {
      for (let i = 0; i < this.customAccountObject.length; i++) {
        if (indexes === i && i % 3 === 1 && this.customAccountObject[i].roughSellArea > this.customAccountObject[i - 1].totalSellArea) {
          return this.$showNormalError('请正确填写第毛坯与精装的总可售面积,毛坯与精装的总可售面积之和需要不能大于产品的总可售面积')
        } else if (indexes === i && i % 3 === 2 && this.customAccountObject[i].hardboundSellArea > this.customAccountObject[i - 2].totalSellArea) {
          return this.$showNormalError('请正确填写第毛坯与精装的总可售面积,毛坯与精装的总可售面积之和需要不能大于产品的总可售面积')
        }
      }
    },
    // 合并单元格
    arraySpans({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }

      if (columnIndex === 1) {
        const _row = this.fCompanyArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    getSpanArr(data) {
      this.spanArr = []
      this.pos = 0
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1)
          this.pos = 0
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i] && (data[i].parcelPhaseName === data[i - 1].parcelPhaseName)) {
            this.spanArr[this.pos] += 1
            this.spanArr.push(0)
          } else {
            this.spanArr.push(1)
            this.pos = i
          }
        }
      }

      this.fCompanyArr = []
      this.fCompany = 0
      for (var k = 0; k < data.length; k++) {
        if (k === 0) {
          this.fCompanyArr.push(1)
          this.fCompany = 0
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[k].fCompanyName === data[k - 1].fCompanyName) {
            this.fCompanyArr[this.fCompany] += 1
            this.fCompanyArr.push(0)
          } else {
            this.fCompanyArr.push(1)
            this.fCompany = k
          }
        }
      }
    },
    tobeSyncInfoList() {
      let queryData = {
        // projectId: this.projectDialogData.projectId,
        projectId: this.projectDialogData.projectId,
        stageId: this.projectDialogData.stageId
      }
      LoadingUtil.showLoading()

      tobeSyncList(queryData)
        .then(response => {
          LoadingUtil.hideLoading()
          this.accountObject = response.data
          this.customAccountObject = []
          this.isEadit = true

          for (let i = 0; i < this.accountObject.length; i++) {
            this.customAccountObject.push(this.accountObject[i])
            this.roughAccountObject.roughBuildingArea = this.accountObject[i].roughBuildingArea
            this.roughAccountObject.phaseName = this.accountObject[i].phaseName
            this.roughAccountObject.parcelPhaseName = this.accountObject[i].parcelPhaseName
            this.roughAccountObject.fCompanyName = this.accountObject[i].fCompanyName
            this.roughAccountObject.roughSellArea = this.accountObject[i].roughSellArea
            this.hardboundAccountObject.phaseName = this.accountObject[i].phaseName
            this.hardboundAccountObject.parcelPhaseName = this.accountObject[i].parcelPhaseName
            this.hardboundAccountObject.fCompanyName = this.accountObject[i].fCompanyName
            this.hardboundAccountObject.hardboundBuildingArea = this.accountObject[i].hardboundBuildingArea
            this.hardboundAccountObject.hardboundSellArea = this.accountObject[i].hardboundSellArea
            this.customAccountObject.push(JSON.parse(JSON.stringify(this.roughAccountObject)))
            this.customAccountObject.push(JSON.parse(JSON.stringify(this.hardboundAccountObject)))
          }
          this.getSpanArr(this.customAccountObject)
        })
        .catch(error => {
          console.log(error)
          this.$showError(error.message ? error.message : 'msg_system_error')
          this.isEadit = true
        })
    },
    changeTotalArea() {
      let _check = true
      for (let i = 0; i < this.customAccountObject.length; i++) {
        if (i % 3 === 1) {
          let keys = i + 1
          let allIndexs = i - 1
          if (this.customAccountObject[keys].hardboundBuildingArea === '') {
            let allBuildingArea = parseFloat(this.customAccountObject[i].roughBuildingArea)
            if (allBuildingArea !== parseFloat(this.customAccountObject[allIndexs].totalBuildingArea)) {
              this.customAccountObject[i]._isValid = true
              this.customAccountObject[keys]._isValid = true
              this.$showNormalError('毛坯精装面积之和需等于总建筑面积，请重新输入')
              _check = false
              break
            }
          } else {
            let allBuildingArea = parseFloat(this.customAccountObject[i].roughBuildingArea) + parseFloat(this.customAccountObject[keys].hardboundBuildingArea)
            if (allBuildingArea !== parseFloat(this.customAccountObject[allIndexs].totalBuildingArea)) {
              this.customAccountObject[keys]._isValid = true
              this.customAccountObject[i]._isValid = true
              this.$showNormalError('毛坯精装面积之和需等于总建筑面积，请重新输入')
              _check = false
              break
            }
          }
        } else if (i % 3 === 2) {
          let key = i - 1
          let allIndex = i - 2
          if (this.customAccountObject[key].roughBuildingArea === '') {
            let allBuildingArea = parseFloat(this.customAccountObject[i].hardboundBuildingArea)
            if (allBuildingArea !== parseFloat(this.customAccountObject[allIndex].totalBuildingArea)) {
              this.customAccountObject[key]._isValid = true
              this.customAccountObject[i]._isValid = true
              this.$showNormalError('毛坯精装面积之和需等于总建筑面积，请重新输入')
              _check = false
              break
            }
          } else {
            let allBuildingArea = parseFloat(this.customAccountObject[i].hardboundBuildingArea) + parseFloat(this.customAccountObject[key].roughBuildingArea)
            if (allBuildingArea !== parseFloat(this.customAccountObject[allIndex].totalBuildingArea)) {
              this.customAccountObject[key]._isValid = true
              this.customAccountObject[i]._isValid = true
              this.$showNormalError('毛坯精装面积之和需等于总建筑面积，请重新输入')
              _check = false
              break
            }
          }
        }
      }
      return _check
    },
    cancel() {
      this.$emit('closeDialogDialogVisible')
    },
    submit() {
      // if (!this.changeTotalArea()) return
      if (!this.changeTotalArea()) {
        return this.$showNormalError('毛坯精装面积之和需等于总建筑面积，请重新输入')
      }
      this.businessType = []
      for (let i = 0; i < this.customAccountObject.length; i++) {
        if (i % 3 === 1 && (this.customAccountObject[i].roughSellArea === null)) {
          return this.$showError('需要填写毛坯可售面积、精装可售面积')
        } else if (i % 3 === 2 && (this.customAccountObject[i].hardboundSellArea === null)) {
          return this.$showError('需要填写毛坯可售面积、精装可售面积')
        }
        if (i % 3 === 0) {
          let keys = i + 1
          let allIndexs = i + 2
          this.customAccountObject[i].roughBuildingArea = this.customAccountObject[keys].roughBuildingArea
          this.customAccountObject[i].roughSellArea = this.customAccountObject[keys].roughSellArea
          this.customAccountObject[i].hardboundBuildingArea = this.customAccountObject[allIndexs].hardboundBuildingArea
          this.customAccountObject[i].hardboundSellArea = this.customAccountObject[allIndexs].hardboundSellArea
          this.businessType.push(this.customAccountObject[i])
        }

        if (i % 3 === 1 && this.customAccountObject[i].roughSellArea > this.customAccountObject[i - 1].totalSellArea) {
          return this.$showNormalError('请正确填写第毛坯与精装的总可售面积,毛坯与精装的总可售面积之和需要不能大于产品的总可售面积')
        } else if (i % 3 === 2 && this.customAccountObject[i].hardboundSellArea > this.customAccountObject[i - 2].totalSellArea) {
          return this.$showNormalError('请正确填写第毛坯与精装的总可售面积,毛坯与精装的总可售面积之和需要不能大于产品的总可售面积')
        }
      }
      let _isCheck = true
      debugger
      console.log(this.businessType)
      for (let i = 0; i < this.businessType.length; i++) {
        if (this.businessType[i].roughBuildingArea === null && this.businessType[i].roughSellArea === null && this.businessType[i].hardboundBuildingArea === null && this.businessType[i].hardboundSellArea === null) {
          this.$showError('需要填写毛坯可售面积、精装建筑面积、精装可售面积、毛坯建筑面积')
          _isCheck = false
          break
        }
      }
      if (!_isCheck) return
      console.log('businessType')
      console.log(this.businessType)
      let inforData = {
        'projectId': this.projectDialogData.projectId,
        'stageId': this.projectDialogData.stageId,
        'businessTypeList': this.businessType

      }
      saveSyncMds(inforData)
        .then(response => {
          if (response.code === '2000') {
            this.$emit('closeDialogDialogVisible', 1)
            this.$showSuccess(response.message)
          }
        })
        .catch(error => {
          console.log(error)
          this.$showError(error.message ? error.message : 'msg_system_error')
          //   // this.$emit('closeDialogDialogVisible', 1)
        })
    },
    tableCellClassName({ row, column, rowIndex, columnIndex }) {
      if ((row.ispush !== '1' && (columnIndex === 5 || columnIndex === 6)) || columnIndex === 4) {
        return 'background:#ccc'
      } else {
        return ''
      }
    }
  },
  mounted() {
    this.tobeSyncInfoList()
  }
}
</script>
<style scoped>
.projectDialog .el-table__body-wrapper {
  height: 300px;
}
.tableCellClassName {
  background: #ececec;
}
.active .el-input__inner {
  background: red;
  color: #fff;
}
</style>

