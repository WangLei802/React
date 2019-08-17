<!-- TargetCostCompilationList -->
<template>
  <div class='app-container'>

    <mt-searchform>

      <template slot="buttons">
        <el-button size="mini" icon="el-icon-plus" type="primary" @click="add" v-if="$checkPersmissionByCode('cost:siteVisaMgmt:create')">{{$l("btn_add")}}</el-button>
      </template>

      <template slot="form">
        <el-row :inline="true">
          <el-col :inline="true" :span="24">

            <ProjectSelector v-model='projectModel'>
              <template slot="projectSelectorButtons">
                <el-col :span="6"
                        class="search-btn">
                  <el-form-item>
                    <el-button size="mini" type="info"
                               @click='search'>{{$l("btn_search")}}</el-button>
                    <el-button size="mini" @click='reset'>{{$l("btn_reset")}}</el-button>
                  </el-form-item>
                </el-col>
              </template>
              <template slot="after">
                <!--<el-col :span="6">-->
                  <!--<el-form-item :label="'合同编号:'" >-->
                    <!--<el-input  v-model='queryModel.contractCode'></el-input>-->
                  <!--</el-form-item>-->
                <!--</el-col>-->

                <!--<el-col :span="6">-->
                  <!--<el-form-item :label="'现场签证编号:'" >-->
                    <!--<el-input  v-model='queryModel.code' ></el-input>-->
                  <!--</el-form-item>-->
                <!--</el-col>-->

                <el-col :span="6">
                  <el-form-item :label="'现场签证名称：'">
                    <el-input  v-model='queryModel.name' ></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item :label="'签证指令单：'" v-show="showInstruct">
                    <el-input  v-model='queryModel.instructionCode'></el-input>
                  </el-form-item>
                </el-col>


              </template>
            </ProjectSelector>
          </el-col>
        </el-row>

      </template>

    </mt-searchform>

    <el-tabs  v-model="activeName2" type="card" @tab-click="handleClick">
      <el-tab-pane label="现场签证列表" name="first">
        <SignVisaTable :queryObj_passed_in='queryModel' :projectModel="projectModel"
                               ref='SignVisaTable'></SignVisaTable>
      </el-tab-pane>
      <el-tab-pane label="指令单列表" name="second">
        <SignVisaInstructionTable  :queryObj_passed_in='queryModel' :projectModel="projectModel"
                                           ref='SignVisaInstructionTable'>
        </SignVisaInstructionTable>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
  import AccountingTargetSelector from '@/components/cost/AccountingTargetSelector/'
  import ProjectSelector from '@/components/cost/ProjectSelector/'
  import SignVisaTable from '@/views/cost/signVisa/SignVisaTable'
  import SignVisaInstructionTable from '@/views/cost/signVisa/SignVisaInstructionTable'
  export default {
    data() {
      return {
        activeName2: 'first',
        tabIndex: '0',
        showInstruct: false,
        projectModel: {
          companyId: '',
          projectId: ''
        },
        queryModel: {
          contractCode: '',
          alterationType: '2',
          code: '',
          name: '',
          instructionCode: '',
          pageNum: 1,
          pageSize: 20
        }
      }
    },
    components: {
      AccountingTargetSelector,
      ProjectSelector,
      SignVisaTable,
      SignVisaInstructionTable
    },
    mounted() {
      if (this.$route.query.isShowInstruct) {
        this.tabIndex = '1'
        this.activeName2 = 'second'
      }
      this.search()
    },

    methods: {
      handleClick(tab, event) {
        if (tab.index === '0') {
          this.tabIndex = '0'
          this.showInstruct = false
          this.$refs.SignVisaTable.getList()
        } else {
          this.tabIndex = '1'
          this.showInstruct = true
          this.$refs.SignVisaInstructionTable.getList()
        }
        console.log(tab, event)
      },
      add() {
        this.$router.push({
          name: 'NewOrUpdateSignVisa',
          query: { id: '', isEdit: true, isAdd: true }
        })
      },
      initVM() {
        this.queryModel.pageNum = 1
        this.queryModel.count = 0
        this.queryModel.pageSize = 20
      },
      reset() {
        this.queryModel.companyId = ''
        this.queryModel.projectId = ''
        this.queryModel.contractCode = ''
        this.queryModel.code = ''
        this.queryModel.name = ''
        this.queryModel.instructionCode = ''
        this.projectModel.projectId = ''
        this.projectModel.companyId = ''
      },
      search(tab) {
        // this.initVM()
        debugger
        if (this.tabIndex === '0') {
          this.$refs.SignVisaTable.getList()
        }
        if (this.tabIndex === '1') {
          this.$refs.SignVisaInstructionTable.getList()
        }
      }
    }
  }

</script>
