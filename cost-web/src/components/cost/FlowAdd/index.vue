<template>
    <div>
      <div>
      <!--<span class="addFlow" @click="addFlow" style="cursor: pointer;margin-bottom:10px; float: left;background: #0080cb;color: #fff;padding: 7px 15px; font-size: 12px;  border-radius: 3px;">-->
          <!--<i></i>添加流程-->
        <!--</span>-->
        <span v-if="$store.state.user.isFromBpm">
          <el-button size="mini" type="primary" @click="addFlow" :disabled="true" style="margin: 5px">添加流程</el-button>
        </span>
        <span v-else>
          <el-button size="mini" type="primary" @click="addFlow" :disabled="isShowAddBtn" style="margin: 5px">添加流程</el-button>
        </span>
        
         
        <el-table border stripe size="small" :data="flowData">
           <!-- 序号 -->
           <!-- 原代码 -->
          <!-- <el-table-column type="index"
                       :index="this.$index"
                       :label="this.$l('lbl_no')"
                       width="80">
          </el-table-column> -->
          <!-- 后改 -->
          <el-table-column type="index"
                       :label="this.$l('lbl_no')"
                       width="80">
          </el-table-column>
          <el-table-column label="编号" prop="procinstid">
              <template slot-scope="scope">
                {{scope.row.procinstid}}
              </template>
          </el-table-column>
          <el-table-column label="流程主题" prop="topic" >
              <template slot-scope="scope">
                <a :href='scope.row.url' target="_blank" style="color:blue;text-decoration: underline;">{{scope.row.topic}}</a>
              </template>
          </el-table-column>
          <el-table-column label="经办人" prop="agentname">
              <template slot-scope="scope">
                {{scope.row.agentname}}
              </template>
          </el-table-column>
          <el-table-column label="提交日期" prop="startdate"
                  :formatter='this.$dateFormat("startdate","yyyy-MM-dd")'>
              <template slot-scope="scope">
                {{scope.row.startdate | dateFormat('yyyy-MM-dd')}}
              </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column :label="this.$l('lbl_operation')"
                          width="200">
            <template slot-scope="scope">
              <!-- 删除 -->
              <el-button size="mini"
                        type="text"
                        icon="el-icon-delete"
                         v-if="showDeleteButton"
                        :title="$l('btn_delete')"
                        @click="deleteRow(scope.$index, scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        </div>
      <!-- 关联流程弹窗 -->
      <el-dialog title="关联流程" :visible.sync="isShowVersionsDialog">
        <el-form label-width="100px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="流程编号：">
                <el-input v-model="flowParam.procinstid"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="流程名称：">
                <el-input v-model="flowParam.topic"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="申请人：">
                <el-input v-model="flowParam.agentname"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="提交日期：" >
                  <el-date-picker style="width:120px;"
                    v-model='flowParam.startTime'
                    type="date"
                    placeholder="开始日期">
                  </el-date-picker>
                  -
                  <el-date-picker style="width:120px;"
                    v-model='flowParam.endTime'
                    type="date"
                    placeholder="结束日期">
                  </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <!-- <el-form-item> -->

                <el-button  type='primary' @click="confirmContract1" style="float:right">确定</el-button>
                <el-button type="primary" @click="searchFlow" style="float:right;margin-right:10px;">查询</el-button>
                <el-button @click="cancelDialog" style="float:right">取消</el-button>
              <!-- </el-form-item> -->
            </el-col>
          </el-row>
        </el-form>

        <el-table  :data="flowList">

          <!-- <el-table-column width="60" >
              <template slot-scope="scope">
                    <el-checkbox-group>
                      <el-checkbox v-model="radio"
                                   :label="scope.$index"
                                    @change.native="getCurrentRow(scope.row)">&nbsp;</el-checkbox>
                    </el-checkbox-group>
              </template>
          </el-table-column> -->
          <!-- <el-table-column label="选择">
            <template slot-scope="scope">
              <el-radio-group v-model="radio">
                <el-radio @change.native="getCurrentRow(scope.row)"
                          :label="scope.$index"
                          class="textRadio">&nbsp;</el-radio>
             </el-radio-group>
            </template>
          </el-table-column> -->
          <el-table-column label="选择"
                           width="55">
                  <template slot-scope="scope">
                      <el-checkbox v-model="checkedForm"
                                    :label="scope.row"
                                    @change="controlSingle(scope.row)">&nbsp;</el-checkbox>
                  </template>
          </el-table-column>
          <el-table-column label="流程编号" prop="procinstid"></el-table-column>
          <el-table-column label="流程名称" prop="topic" width="230px"></el-table-column>
          <el-table-column label="组织" prop='orgName'></el-table-column>
          <el-table-column label="申请人" prop="agentname"></el-table-column>
          <el-table-column label="提交日期" prop="startdate" :formatter='this.$dateFormat("startdate","yyyy-MM-dd")'></el-table-column>
        </el-table>

        <div class='pagination_bar'>
            <el-pagination @size-change='handleSizeChange'
                  @current-change='handleCurrentChange'
                  :current-page.sync='flowParam.pageNum'
                  :page-sizes='[10, 20, 30, 40]'
                  :page-size='flowParam.pageSize'
                  layout='sizes, prev, pager, next'
                  :total='flowParam.count'>
            </el-pagination>
        </div>

        <!-- <div slot="footer" class="dialog-footer">
            <el-button @click="cancelDialog">取消</el-button>
            <el-button  type='primary' @click="confirmContract1">确定</el-button>
        </div> -->

      </el-dialog>
    </div>
</template>
<script>
  import { saveOrUpdateBidBond, getPaymentCashDepositCode, getmystartforfkList, associationprocess } from '@/api/cost/bidBondAPI'
  import uuidv1 from 'uuid/v1'
import { NumFormat, Version, dateFormat } from '@/filters/cost/'
  export default {
    filters: {
      dateFormat
    },
    props: {
    showDeleteButton: {
      type: Boolean,
      default: true
    }
    },
    name: 'CostFileUpload',

    data() {
      return {
        flowParam: {
          procinstid: '',
          topic: '',
          agentname: '',
          startTime: '',
          endTime: '',
          pageNum: 1,
          pageSize: 20,
          count: 0
        },
        selFlowData: [],
        flowData: [],
        flowModel: {},
        flowList: '',
        isShowVersionsDialog: false,
        isShowAddBtn: false,
        isEdit: false,
        isShow:false,
        radio: '',
        radioList: [],
        checkedForm: []
      }
    },
    mounted: function() {
      // alert(this.showDeleteButton)
      debugger
      // localStorage.setItem('flowData',"")
      if (this.$route.query.id == undefined || this.$route.query.id == '') {
      } else {
        // this.flowData = JSON.parse(this.$route.query.costRelateFlowList)
        this.associationprocess()
      }
      this.isEdit = this.$route.query.isEdit.toString() === 'true'
      this.isShow = this.$route.query.isShow.toString() === 'true'
      if(!this.isEdit){
        this.isShowAddBtn = true
      }
      if(!this.isShow){
        this.isShowAddBtn = true
      }
    },
    methods: {
      // 查询关联流程表格
      associationprocess() {
        let param = {
          bizTablePkValue: this.$route.query.id
        }
        associationprocess(param)
          .then(response => {
            this.flowData = response.data
            this.$emit('flow', this.flowData)
            console.log(response.data)
          })
          .catch(error => {
            console.log(error)
            this.$showError(error.message ? error.message : 'msg_system_error')
          })
      },
      confirmContract1() {
        // debugger
        // this.flowData = localStorage.getItem('flowData')
        console.log('selFlowData')
        console.log(this.selFlowData)
        this.flowData = this.flowData.concat(this.selFlowData)
        console.log('flowData')
        console.log(this.flowData)
        var hash = []
        for (var i = 0; i < this.flowData.length; i++) {
          for (var j = i + 1; j < this.flowData.length; j++) {
            if (this.flowData[i].procinstid === this.flowData[j].procinstid) {
              ++i
            }
          }
          hash.push(this.flowData[i])
        }
        console.log('hash')
        console.log(hash)
        this.flowData = []
        this.flowData = hash
        this.isShowVersionsDialog = false
        this.flowParam.procinstid = ''
        this.flowParam.topic = ''
        this.flowParam.agentname = ''
        this.flowParam.startTime = ''
        this.flowParam.endTime = ''
        this.flowParam.pageNum = 1
        this.flowParam.pageSize = 20
        this.flowParam.count = 0
        // debugger
        this.$emit('flow', this.flowData)
        console.log('sure')
        console.log(this.flowData)
        // localStorage.setItem('flowData', JSON.stringify(this.flowData))
      },
      controlSingle(row) {
        console.log(this.checkedForm)
        // this.selFlowData.push(row)
        // this.selFlowData = this.flowData
        if (row.checked == undefined || row.checked == false) {
          row.checked = true
          let isInsert = true
          for (let i = 0; i < this.selFlowData.length; i++) {
            if (this.selFlowData[i].procinstid == row.procinstid) {
              isInsert = false
            }
          }
          if (isInsert) {
            this.selFlowData.push(row)
          }
          console.log('selFlowDatapush')
          console.log(this.selFlowData)
          // this.flowData = this.flowData.concat(this.selFlowData)
          // console.log(this.flowData)
        } else {
          row.checked = false
        }
      },
      searchFlow() {
        // debugger
        this.getmystartforfkList()
      },
      deleteRow(index, rowData) {
        //  debugger
        this.$confirm('确认删除该记录', {
          confirmButtonText: this.$l('btn_confirm'),
          cancelButtonText: this.$l('btn_cancel'),
          type: 'warning'
        }).then(() => {
          // this.flowData.splice(index, 1)
          this.flowData.splice(index, 1)
          this.selFlowData.splice(index, 1)
          // alert(JSON.stringify(this.flowData))
          this.$emit('flow', this.flowData)
          // localStorage.setItem('flowData', JSON.stringify(this.flowData))
        })
          .catch(() => { })
      },
      cancelDialog() {
        //  debugger
        this.selFlowData = []
        this.isShowVersionsDialog = false
      },

      getCurrentRow(contractDetail) {
        // debugger
        this.flowModel = contractDetail
      },
      handleSizeChange(val) {
        //  debugger
        this.flowParam.pageSize = val
        this.getmystartforfkList()
      },
      handleCurrentChange(val) {
        //  debugger
        this.flowParam.pageNum = val
        this.getmystartforfkList()
      },
      // 添加关联
      addFlow() {
        //  debugger
        // alert(JSON.stringify(this.flowData))
        this.checkedForm = []
        this.isShowVersionsDialog = true
        this.getmystartforfkList()
      },

      // 查询关联列表
      getmystartforfkList() {
        //  debugger
        let param = {
          procinstid: this.flowParam.procinstid,
          topic: this.flowParam.topic,
          agentname: this.flowParam.agentname,
          startTime: this.flowParam.startTime,
          endTime: this.flowParam.endTime,
          pageNum: this.flowParam.pageNum,
          pageSize: this.flowParam.pageSize
        }
        getmystartforfkList(param)
          .then(response => {
            this.flowList = response.data.content
            this.flowParam.count = response.data.totalElements
            console.log('data')
            console.log(response.data)
          })
          .catch(error => {
            console.log(error)
            this.$showError(error.message ? error.message : 'msg_system_error')
          })
      }

    }
  }
</script>
