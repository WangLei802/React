<template>
  <div>
    <el-dialog
      title="提示"
      :visible.sync="isShowContract"
      width="80%"
      @close="closeDialog"
    >

      <div>

        <!-- <div style="text-align:right;margin-bottom:10px">
            <el-button size="mini" type="cancel" @click='cancel'>{{this.$l('btn_back')}}</el-button>
            <el-button size="mini" type="primary"  @click='confirmContract2'>确认</el-button>
            
        </div> -->

        <div>
          <el-row>
            <el-col :span="6">
              <el-form-item label='单据类型：'>
                <!-- <el-input v-model='queryModel.contractType' ></el-input> -->
                <el-select v-model="value" placeholder="请选择">
                  <el-option
                    v-for="item in invoicveType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <!-- <el-col :span="6">
              <el-form-item label='单据编号:'>
                <el-input v-model='queryModel.contractCode'></el-input>
              </el-form-item>
            </el-col> -->
            <el-col :span="6">
              <el-form-item label='单据名称：'>
                <el-input v-model='queryModel.contractName'></el-input>
              </el-form-item>
            </el-col>


            <el-col :span="8"
                    class="search-btn"
                    style="text-align:right">
              <el-form-item>
                <el-button size="mini" type="cancel" @click='cancel'>{{this.$l('btn_back')}}</el-button>
                <el-button size="mini" type="primary"  @click='confirmContract2'>确认</el-button>
                <el-button size="mini" type="info"
                           @click='search'>{{$l("btn_search")}}
                </el-button>
                <el-button size="mini" @click='reset'>{{$l("btn_reset")}}</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>

      <el-table :data="selectTable" row-key="id" size="small" :height="tHeight">

        <!-- <el-table-column type="selection" align="center" width="55"></el-table-column> -->
        <el-table-column label="选择" width="136">
          <template slot-scope="scope">
            <!-- class="textRadio" -->
            <el-radio @change="getCurrentRow(scope.row)" :label="scope.$index" v-model="radio" class="textRadio">
              &nbsp;
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column property="code" label="单据编号" width="250"></el-table-column>
        <el-table-column property="name" label="单据名称" width="250"></el-table-column>
        <!-- estimatedAmt -->
        <el-table-column property="estimatedAmt" label="金额（元）" width="120"></el-table-column>
        <el-table-column property="createdBy" label="经办人"  width="120"></el-table-column>
        <el-table-column prop="createdDate" label="提交日期" :formatter='this.$dateFormat("createdDate","yyyy-MM-dd")'  width="120">
        </el-table-column>
      </el-table>

      <div class='pagination_bar'>
        <el-pagination
          @size-change='handleSizeChange'
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
import { getContractList } from "@/api/cost/designAlteration";
import { tableHeight } from "@/utils/common/index";
import {
  saveOrUpdateIneffectiveCost,
  getQueryContractList,
  getContractDetail,
  getVisaList,
  getIneffectiveAlteration,
  getContractListByAlterationStatus
} from "@/api/cost/ineffectiveCostModel";
import { NumFormat, Version, dateFormat } from "@/filters/cost/";
export default {
  filters: {
    dateFormat
  },
  name: "ContractSelector",
  props: {
    showContract: {
      required: true,
      type: Boolean
    },
    projectId: {
      required: false,
      type: String
    }
  },
  data() {
    return {
      // 单据类型
      value: "1",
      invoicveType: [
        {
          value: "1",
          label: "设计变更"
        },
        {
          value: "2",
          label: "现场签证"
        },
        {
          value: "3",
          label: "无合同费用"
        }
      ],
      radio: "",
      isShowContract: false,
      selectTable: [],
      contractModel: {},
      tableHeight: "0",
      fullHeight: document.documentElement.clientHeight,
      queryModel: {
        contractType: "",
        contractCode: "",
        contractStatus: "5",
        contractName: "",
        projectId: "",
        pageNum: 1,
        pageSize: 20,
        count: 0
      },
      ContractListByAlterationStatus: {
        // 合同编号查询
        visaId: localStorage.getItem("visaId"),
        contractName: "",
        contractCode: ""
      },
      contractQueryModel: {
        // 变更签证编号/无合同编号查询条件
        type: "1", // 1：设计变更 2:现场签证 3：无合同费用
        projectId: "",
        code: "",
        name: ""
      }
    };
  },
  methods: {
    getList() {
      this.radio = "";
      this.contractQueryModel.type = this.value;
      this.contractQueryModel.code = this.queryModel.contractCode;
      this.contractQueryModel.name = this.queryModel.contractName;
      if (
        localStorage.getItem("projectId") &&
        localStorage.getItem("projectId") != ""
      ) {
        this.contractQueryModel.projectId = localStorage.getItem("projectId");
      }
      getIneffectiveAlteration(this.contractQueryModel)
        .then(response => {
          this.selectTable = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    confirmContract2() {
      debugger;
      this.isShowContract = false;
      if (this.radio === "") {
        this.contractModel = {};
      }
      // localStorage.setItem('fx', JSON.stringify(this.selectTable))
      // alert(JSON.stringify(this.selectTable))
      // this.contractModel.forEach(item => {
      //   this.$set(item, 'selectType', this.value)

      // })
      // alert(this.value)
      this.$emit("confirmContract2", this.contractModel);
      // this.$emit('confirmContract2', this.selectType)
      this.$emit("cancelSearch", this.value);
    },
    closeDialog() {
      this.$emit("closeDialog", false);
    },
    cancel() {
      debugger;
      this.isShowContract = false;
      // 向父组件传值
      this.$emit("cancelDialog", false);
    },
    search() {
      this.radio = "";
      this.getList();
    },
    reset() {
      this.contractQueryModel.code = "";
      this.contractQueryModel.name = "";
      // this.queryModel.code = ''
      this.queryModel.contractName = "";
      this.contractQueryModel.value = "1";
      this.getList();
    },
    getCurrentRow(contractDetail) {
      debugger;
      this.contractModel = contractDetail;
    },
    handleSizeChange(val) {
      debugger;
      this.queryModel.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      debugger;
      this.queryModel.pageNum = val;
      this.getList();
    }
  },
  watch: {
    showContract: function(newValue, oldValue) {
      debugger;
      this.isShowContract = newValue;
      this.getList();
      // this.contractModel = this.selectTable[0] //修改不默认显示
    },
    projectId: function(newValue, oldValue) {
      debugger;
      this.contractQueryModel.projectId = newValue;
    }
  },
  mounted: function() {
    this.queryModel.contractType = "";
    this.queryModecontractCode = "";
    this.queryModel.contractName = "";
    this.queryModel.projectId = "";
    this.getList();
    this.radio = "";
  },
  computed: {
    tHeight: function() {
      let options = {
        fullHeight: this.$store.getters.fullHeight,
        opened: this.$store.getters.sidebar.opened,
        showForm: this.$store.getters.showForm,
        obj: this
      };
      return `${tableHeight(options)}px`;
    }
  }
};
</script>
