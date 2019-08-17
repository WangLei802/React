<template>
    <div ref="contractSignList">
                        <el-table :data="tableDataList"
                                  stripe
                                  border
                                  tooltip-effect="dark"
                                  style="width: 100%"
                                  size="small"
                                  :height="tHeight">
                            <el-table-column fixed
                                             :label="$l('lbl_no')"
                                             width="100"
                                             type="index">
                            </el-table-column>

                            <el-table-column fixed
                                             prop="sureBidId"
                                             label="定标唯一识别码"
                                             width="150">

                            </el-table-column>


                            <el-table-column fixed
                                             prop="bidMoney"
                                             label="中标金额(元)">
                              <template slot-scope="scope">
                                {{ scope.row.bidMoney|NumFormat}}
                              </template>

                            </el-table-column>
                              <el-table-column fixed
                                             prop="bidType"
                                             label="类型"
                                             width="150">
                                <template slot-scope="scope">
                                  <fd-label :code="scope.row.bidType"
                                            type="bidding_way"></fd-label>
                                </template>

                            </el-table-column>

                            <el-table-column fixed
                                             prop="projectName"
                                             label="所属项目">

                            </el-table-column>
                            <el-table-column fixed
                                             prop="bidTitle"
                                             label="招标标题">
                            </el-table-column>
                            <el-table-column fixed
                                             prop="status"
                                             label="状态">

                                <template slot-scope="scope">
                                <span v-if="scope.row.status  ==='0' ">
                                    未生成合同
                                </span>
                                <span v-else-if="scope.row.status  ==='1' ">
                                    已生成合同
                                </span>

                            </template>
                            </el-table-column>
                            <el-table-column :label="$l('lbl_operation')"
                                             fixed="right"
                                             width="180">
                                <template slot-scope="scope">
                                   <el-button size="mini"
                                           type="text"
                                           icon="el-icon-view"
                                           :title="$l('btn_detail')"
                                           @click="checkRow(scope.$index, scope.row)"></el-button>


                                    <!-- 生成合同 -->
                                    <el-button size="mini"  v-if="scope.row.status  ==='0' && $checkPersmissionByCode('cost:contract:saveOrUpdate') "
                                               type="text"
                                               @click="buildContract(scope.$index, scope.row)"
                                               >生成合同</el-button>

                                </template>
                            </el-table-column>
                        </el-table>
                        <div class='pagination_bar'>
                         <mt-pagination @size-change='handleSizeChange'
                           @current-change='handleCurrentChange'
                           :current-page.sync='queryObj.pageNum'
                           :page-sizes='[10, 20, 30, 40]'
                           :page-size='queryObj.pageSize'
                           layout='sizes, prev, pager, next'
                           :total='queryObj.count'>
                        </mt-pagination>
                        </div>
                    </div>
</template>
<script>
import { NumFormat, Version } from "@/filters/cost/";
import { tableHeight } from "@/utils/common/index";
import { checkContractPlanStatus } from "@/api/cost/signContractAPI";
export default {
  props: {
    initData: {
      type: Object
    },
    value: {
      type: Object
    }
  },
  filters: {
    NumFormat,
    Version
  },
  watch: {
    initData: {
      handler(newValue, oldValue) {
        this.getListData();
      },
      deep: true
    }
  },
  data() {
    return {
      tableDataList: [],
      queryObj: {
        pageNum: 1,
        pageSize: 20,
        count: 0
      }
    };
  },
  computed: {
    tHeight: function() {
      let options = {
        fullHeight: this.$store.getters.fullHeight,
        opened: this.$store.getters.sidebar.opened,
        showForm: this.$store.getters.showForm,
        obj: this,
        otherHeight: 290
      };
      return `${tableHeight(options)}px`;
    }
  },
  mounted() {
    this.getListData();
  },

  methods: {
    handleSizeChange(val) {
      this.queryObj.pageSize = val;
      this.$emit("input", this.queryObj);
      this.getListData();
    },
    handleCurrentChange(val) {
      this.queryObj.pageNum = val;
      this.$emit("input", this.queryObj);
      this.getListData();
    },
    checkRow(index, rowData) {
      this.$router.push({
        name: "CostBiddingDetail",
        query: { contractId: rowData.id }
      });
    },
    buildContract(index, rowData) {
      checkContractPlanStatus({ id: rowData.id })
        .then(response => {
          if (response.data !== true) {
            this.$showError(response.message);
            return;
          } else {
            this.$router.push({
              name: "NewContractInformation",
              query: {
                costBiddingId: rowData.id,
                isOrEdit: true,
                contractStatus: "0",
                contractSource: "1",
                signOrEdit: false
              }
            });
          }
        })
        .catch(error => {
          console.log(error);
          this.$showError(error.message ? error.message : "msg_system_error");
        });
    },
    getListData() {
      if (this.initData) {
        console.log(this.initData);
        this.tableDataList = this.initData.content ? this.initData.content : [];

        this.queryObj.count = this.initData.totalElements;
      }
    }
  }
};
</script>
<style scoped>
@import "../../../styles/list.scss";
.el-select {
  width: 200px;
}
</style>
