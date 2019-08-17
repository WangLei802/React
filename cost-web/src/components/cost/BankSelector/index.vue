<template>
    <div style="height:auto;overflow:hidden">
        <el-dialog title="选择银行"
                   :visible.sync="isShowBank"
                   width="60%"
                   @close="closeDialog">

            <mt-searchform style="margin-top: -30px;">

                <template slot="buttons">
                    <el-button size="mini"
                               type="cancel"
                               @click='cancel'>{{this.$l('btn_back')}}</el-button>

                    <el-button size="mini"
                               type="primary"
                               @click='confirmBank'>确认选择</el-button>
                </template>

                <template slot="form">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label='银行档案ID：'>
                                <el-input v-model='queryModel.bankDocId'></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label='银行名称：'>
                                <el-input v-model='queryModel.name'></el-input>
                            </el-form-item>

                        </el-col>
                        <el-col :span="8"
                                class="search-btn">
                            <el-form-item>
                                <el-button size="mini"
                                           type="info"
                                           @click='search'>{{$l("btn_search")}}</el-button>
                                <el-button size="mini"
                                           @click='reset'>{{$l("btn_reset")}}</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </template>
            </mt-searchform>

            <el-table :data="data"
                      row-key="id"
                      size="small"
                      stripe
                      border
                      tooltip-effect="dark"
                      v-loading="loading"
                      :height="tHeight">

                <!-- <el-table-column type="selection" align="center" width="55"></el-table-column> -->
                <el-table-column label="选择"
                                 width="60">
                    <template slot-scope="scope">
                        <!-- class="textRadio" -->
                        <el-radio @change.native="getCurrentRow(scope.row)"
                                  :label="scope.$index + '' + queryModel.pageNum"
                                  v-model="radio"
                                  class="textRadio">&nbsp;</el-radio>
                    </template>
                </el-table-column>

                <el-table-column prop="bankDocId"
                                 label="银行档案ID"
                                 width="300"
                                 show-overflow-tooltip></el-table-column>

                <el-table-column prop="name"
                                 label="银行名称"
                                 show-overflow-tooltip></el-table-column>
            </el-table>

            <div class='pagination_bar'>
                <el-pagination @size-change='handleSizeChange'
                               @current-change='handleCurrentChange'
                               :current-page.sync='queryModel.pageNum'
                               :page-sizes='[10, 20, 30, 40]'
                               :page-size='queryModel.pageSize'
                               layout='sizes, prev, pager, next'
                               :total='queryModel.count'>
                </el-pagination>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { getBankPageInfo } from '@/api/cost/applyPaymentContract'
import { tableHeight } from '@/utils/common/index'
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import {
  dateFormat
} from '@/filters/cost/'
export default {
  name: 'BankSelector',
  props: {
    showBank: {
      required: true,
      type: Boolean
    }
  },
  data() {
    return {
        radio: '',
        data: [],
        isShowBank: false,
        tableHeight: '0',
        fullHeight: document.documentElement.clientHeight,
        queryModel: {
          name: '',
          bankDocId: '',
          pageNum: 1,
          pageSize: 20,
          count: 0
        },
        selectedBank: {},
        loading: false,
        isShowBank: false
    }
  },
  methods: {
    getList() {
        this.loading = true
        getBankPageInfo(this.queryModel).then(response => {
            this.loading = false
            this.data = response.data.content ? response.data.content : []
            this.queryModel.count = response.data.totalElements
        }).catch(error => {
          console.log(error)
        })
    },
    confirmBank() {
        this.isShowBank = false
        if (this.radio === '') {
            this.selectedBank = {}
        }
        this.$emit('confirmBank', this.selectedBank)
        this.$emit('closeDialog', false)
    },
    closeDialog() {
        this.$emit('closeDialog', false)
    },
    cancel() {
        this.isShowBank = false
        // 向父组件传值
        this.$emit('cancelDialog', false)
    },
    search() {
        this.getList()
    },
    reset() {
        this.queryModel.name = ''
        this.queryModel.bankDocId = ''
        this.queryModel.pageNum = 1
        this.queryModel.pageSize = 20
    },
    getCurrentRow(row) {
        this.selectedBank = row
    },
    handleSizeChange(val) {
        this.queryModel.pageSize = val
        this.getList()
    },
    handleCurrentChange(val) {
        this.queryModel.pageNum = val
        this.getList()
    }
  },
  computed: {
    tHeight: function() {
        return '280px'
    }
  },
  watch: {
    "showBank": function (newValue, oldValue) {
        this.radio = ''
        this.isShowBank = newValue
        if (newValue) {
            this.getList()
        }
    }
  }
}
</script>
