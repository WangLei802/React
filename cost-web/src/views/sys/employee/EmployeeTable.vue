<template>
  <div ref="employeeTable">
    <el-table :height="tHeight" :data="tableData" stripe border  style="width: 100%">
      <el-table-column type="index" :index="this.$getTableIndex(this.queryObj)" :label="this.$l('lbl_no')" width="80"></el-table-column>
      <el-table-column prop="employeeName" :label="this.$l('lbl_userName')" ></el-table-column>
      <!--<el-table-column prop="nickName" :label="this.$l('lbl_nickName')" ></el-table-column>-->
      <el-table-column prop="typeList" :label="this.$l('lbl_employee_type')" ></el-table-column>
      <el-table-column prop="mobile" :label="this.$l('lbl_mobile')"></el-table-column>
      <el-table-column prop="telephone" :label="this.$l('lbl_phone')"></el-table-column>
      <el-table-column prop="email" :label="this.$l('lbl_email')" width="200"></el-table-column>
      <el-table-column  :label="this.$l('lbl_status')" width="120">
        <template slot-scope="scope">
          <fd-label :code="scope.row.status" type="sys_user_status"></fd-label>
        </template>
      </el-table-column>
      <el-table-column width="120" :label="this.$l('lbl_operation')">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status == '0'" type="text" icon="el-icon-remove-outline" :title="$l('btn_disable')" @click="disableOrActivate(scope.$index, scope.row)"></el-button>
          <el-button v-else type="text" icon="el-icon-circle-check" :title="$l('btn_enable')" @click="disableOrActivate(scope.$index, scope.row)"></el-button>
          <el-popover placement="left"  width="auto" trigger="hover" style="margin-left:10px;">
            <el-row style="margin:-6px;">
              <el-button class="ordinary-btn"  icon="el-icon-setting" style="margin-left:2px;"
                         @click="resetPassword(scope.$index, scope.row)">{{$l("btn_reset_pwd")}}</el-button>
              <el-button class="ordinary-btn"  icon="el-icon-edit-outline" style="margin-left:2px;"
                         @click="setSys(scope.$index, scope.row)" >{{$l("lbl_set_employee_type")}}</el-button>
            </el-row>
            <el-button slot="reference" type="text" icon="el-icon-menu"></el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <div class='pagination_bar'>
      <mt-pagination @size-change='handleSizeChange' @current-change='handleCurrentChange'
                     :current-page.sync='queryObj.pageNum' :page-sizes='[10, 20, 30, 40]'
                     :page-size='queryObj.pageSize' layout='sizes, prev, pager, next'
                     :total='queryObj.count'>
      </mt-pagination>
    </div>
  </div>
</template>
<script>
  import { getDictionaryDataList} from '@/api/sys/dictionaryAPI'
  import { employeeList, resetPassword, userLifecycle, getUserType} from '@/api/sys/employeeAPI'
  import { LoadingUtil } from '@/utils/common/LoadingUtil'
  import { tableHeight } from '@/utils/common/index'
  export default {
    props: {
      queryObj_passed_in: {
        type: Object
      },
      dict: [],
      externalData: {
        type: Array,
        default: function() {
          return []
        }
      }
    },
    computed: {
      tHeight: function() {
        let options = {
          fullHeight: this.$store.getters.fullHeight,
          opened: this.$store.getters.sidebar.opened,
          showForm: this.$store.getters.showForm,
          obj: this,
          otherHeight: 200
        }
        return `${tableHeight(options)}px`
      }
    },
    data() {
      return {
        tableData: [],
        queryObj: this.queryObj_passed_in,
        tableHeight: '0',
        fullHeight: document.documentElement.clientHeight
      }
    },
    methods: {
      getDict(){
        let _param = {dictType:'sys_employee_type'}
        getDictionaryDataList(_param)
          .then(response => {
            this.dict = response.data
          })
          .catch(error => {
            console.log(error)
          })
      },
      getList(param) {
        let _param = {dictType:'sys_employee_type'}
        getDictionaryDataList(_param)
          .then(response => {
            this.dict = response.data
            LoadingUtil.showLoading()
            employeeList(this.queryObj)
              .then(response => {
                LoadingUtil.hideLoading()
                response.data.content.forEach(li => {
                  li.typeList = ''
                  let type = ''
                  let param = { id: li.id }
                  getUserType(param).then(response2 => {
                    LoadingUtil.hideLoading()
                    this.dict.forEach(d => {
                     response2.data.forEach(li2 => {
                      if (li2 === d.dictValue) {
                        type += d.dictLabelCn +','
                          }
                      })
                    })
                    if (type !== '') {
                      type = type.substring(0 ,type.length - 1)
                    }

                    li.typeList = type
                  }).catch(error => {
                    console.log(error)
                  })
                  // li.typeList.forEach(li2 => {
                  //   this.dict.forEach(d => {
                  //     if (li2.employeeType !== undefined) {
                  //       if (li2.employeeType === d.dictValue) {
                  //         type += d.dictLabelCn + ','
                  //       }
                  //     }
                  //   })
                  // })


                })
                this.tableData = response.data.content
                this.queryObj.count = response.data.totalElements
              })
              .catch(error => {
                console.log(error)
              })

          })
          .catch(error => {
            console.log(error)
          })

      },
      handleSizeChange(val) {
        this.queryObj.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.queryObj.pageNum = val
        this.getList()
      },
      settingTableHeight: function() {
        // const topHeight = this.$refs['langTable'].getBoundingClientRect().top
        // this.tableHeight = this.fullHeight - topHeight - 80
        // this.$refs['langTable'].style.Height = this.tableHeight + 'px'
      },
      handleEdit(index, row) {
        this.$router.push({
          name: 'NewOrUpdateUser',
          query: { id: row.id }
        })
      },
      disableOrActivate(index, row, status) {
        const params = {
          id: row.id
        }
        LoadingUtil.showLoading()
        userLifecycle(params)
          .then(response => {
            LoadingUtil.hideLoading()
            if (response.code === '2000') {
              this.$showSuccess(response.message)
              this.getList()
            } else {
              this.$showError(response.message)
            }
          })
          .catch(error => {
            console.log(error)
          })
      },
      setSys(index, row) {
        this.$router.push({
          name: 'setUserType',
          query: {  id: row.id }
        })
      },

      resetPassword(index, row) {
        this.$confirm(this.$l('msg_confirm_reset_password'), this.$l('msg_information'), {
          confirmButtonText: this.$l('btn_confirm'),
          cancelButtonText: this.$l('btn_cancel'),
          type: 'warning'
        }).then(() => {
          const body = { id: row.id }
          LoadingUtil.showLoading()
          resetPassword(body).then(response => {
            LoadingUtil.hideLoading()
            this.$showSuccess(response.message)
            this.getList()
          }).catch(error => {
            console.log(error)
          })
        }).catch(() => {})
      }
    },
    mounted: function() {

      this.getList()
      this.$nextTick(function() {
        this.settingTableHeight()
      })
      // window.onresize = () => {
      //   return (() => {
      //     window.fullHeight = document.documentElement.clientHeight
      //     this.fullHeight = window.fullHeight
      //   })()
      // }
    },
    watch: {
      fullHeight(val) {
        this.settingTableHeight()
      }
    }
  }
</script>
