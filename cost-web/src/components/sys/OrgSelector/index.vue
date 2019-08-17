/*
 <fd-orgselector :orgCode="userQueryModel.orgCode"
                              @selectChange="selectChange"
                              @orgCodeChange="orgCodeChange" />
 */
<template>
  <div>
    <el-col :span="6">
      <el-form-item label='集团：'>
        <el-select v-model="selectData.groupCode"
                   :filterable="true"
                   @change="changeSelect(ENUMTYPE.GROUP,$event)"
                   placeholder="请选择">
          <el-option v-for="(item,index) in selectData.groupList"
                     :key="index"
                     :label="item.orgName"
                     :value="item.orgCode">
          </el-option>
        </el-select>
      </el-form-item>
    </el-col>

    <el-col :span="6">
      <el-form-item label='公司：'>
        <el-select v-model="selectData.companyCode"
                   :filterable="true"
                   @change="changeSelect(ENUMTYPE.COMPANY,$event)"
                   placeholder="请选择">
          <el-option v-for="(item,index) in selectData.companyList"
                     :key="index"
                     :label="item.orgName"
                     :value="item.orgCode">
          </el-option>
        </el-select>
      </el-form-item>
    </el-col>

    <el-col :span="6">
      <el-form-item label='事业部：'>
        <el-select v-model="selectData.deptCode"
                   :filterable="true"
                   @change="changeSelect(ENUMTYPE.DEPT,$event)"
                   placeholder="请选择">
          <el-option v-for="(item,index) in selectData.deptList"
                     :key="index"
                     :label="item.orgName"
                     :value="item.orgCode">
          </el-option>
        </el-select>
      </el-form-item>
    </el-col>
  </div>
</template>
<script>
import {  getTopOrgList, listPositions, setPositions,
  orgPositionList, getOrgName} from '@/api/sys/orgAPI'
export default {
  name: "fd-orgselector",
  props: {
    value: {
      type: String
    }
  },
  data () {
    return {
      ENUMTYPE: {
        'GROUP': 'group',
        'COMPANY': 'company',
        'DEPT': 'dept',
        'ALL': 'ALL'
      },
      ENUMLEVEL: {
        'GROUP': 1,
        'COMPANY': 2,
        'DEPT': 3
      },
      selectData: {
        groupList: [],
        companyList: [],
        deptList: [],
        groupCode: null,
        companyCode: null,
        deptCode: null,
        //运算类
        _total_groupList: [],
        _total_companyList: [],
        _total_deptList: [],
        _selectItem: null,
        _orgLevel: null
      },
    }
  },
  mounted () {
  },
  created: function () {
    this.initLeftMenuTree()
  },
  methods: {
    //深拷贝
    deepCopy (obj) {
      return JSON.parse(JSON.stringify(obj))
    },
    // 初始化组织
    initLeftMenuTree () {
      let _this = this
      getTopOrgList({ username: localStorage.getItem('userName') }).then(response => {
        this.treeData = response.data
        this.treeData.map(item => {
          if (item.children && item.children.length > 0) {
            item.children.map(topGroupItem => {
              if (topGroupItem.children) {
                topGroupItem.children.map(groupItem => {
                  _this.selectData.groupList.push(groupItem)
                  if (groupItem.children) {
                    groupItem.children.map(companyItem => {
                      _this.selectData.companyList.push(companyItem)
                      if (companyItem.children) {
                        companyItem.children.map(deptItem => {
                          _this.selectData.deptList.push(deptItem)
                        })
                      }
                    })

                  }
                })

              }
            })
          }
        })

        //拷贝
        this.selectData._total_groupList = this.deepCopy(this.selectData.groupList)
        this.selectData._total_companyList = this.deepCopy(this.selectData.companyList)
        this.selectData._total_deptList = this.deepCopy(this.selectData.deptList)
      })
    },
    // 选择改变
    changeSelect (type, event) {

      //需要外传的数据
      if (event && this.selectData[type + 'List']) {
        let selectItem = this.selectData[type + 'List'].find(item => { return item.orgCode === event })
        let orgLevel = this.ENUMLEVEL[type.toUpperCase()]
        selectItem['_orgLevel'] = orgLevel
        this.$emit('selectChange', selectItem)


        if (!this.selectData._orgLevel) {
          this.selectData._orgLevel = orgLevel
          this.selectData._selectItem = selectItem
          this.$emit('orgCodeChange', selectItem)
        } else {
          if (this.selectData._orgLevel >= orgLevel) {
            this.selectData._orgLevel = orgLevel
            this.selectData._selectItem = selectItem
            this.$emit('orgCodeChange', selectItem)
          }
        }
      }

      //级联的数据
      switch (type) {
        case this.ENUMTYPE.GROUP:
        case this.ENUMTYPE.COMPANY:
          //重置下级选中
          //重置下级下拉数据源
          this.resetSelect(type)
          break;
        default:
          break;
      }


    },
    resetSelect (type) {
      let _this = this
      if (type === this.ENUMTYPE.ALL) {
        this.selectData.groupCode = null
        this.selectData.companyCode = null
        this.selectData.deptCode = null

        //拷贝
        this.selectData.groupList = this.deepCopy(this.selectData._total_groupList)
        this.selectData.companyList = this.deepCopy(this.selectData._total_companyList)
        this.selectData.deptList = this.deepCopy(this.selectData._total_deptList)
      } else if (type === this.ENUMTYPE.GROUP) {
        this.selectData.companyCode = null
        this.selectData.deptCode = null

        this.selectData.companyList = this.selectData._total_companyList.filter(item => {
          return item.parentId === _this.selectData._selectItem.id
        })
      } else if (type === this.ENUMTYPE.COMPANY) {
        this.selectData.deptCode = null

        this.selectData.deptList = this.selectData._total_deptList.filter(item => {
          return item.parentId === _this.selectData._selectItem.id
        })
      }
    }
  },
  watch: {
    value: function (newValue, oldValue) {
      if (!newValue) {
        this.resetSelect(this.ENUMTYPE.ALL)
      }
    }
  }
}
</script>
<style scoped>
</style>

