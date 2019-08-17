<!-- TargetCostCompilationList -->
<template>
  <div class='app-container'>

    <mt-searchform>

      <template slot="buttons">
      <el-button size="mini" icon="el-icon-plus" type="primary" @click="add" v-if="$checkPersmissionByCode('cost:designAlterationMgmt:create')">{{$l("btn_add")}}</el-button>
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
                  <!--<el-form-item :label="'设计变更编号:'" >-->
                    <!--<el-input  v-model='queryModel.code' ></el-input>-->
                  <!--</el-form-item>-->
                <!--</el-col>-->

                <el-col :span="6">
                  <el-form-item :label="'设计变更名称：'">
                    <el-input  v-model='queryModel.name' ></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item :label="'变更指令单：'" v-show="showInstruct">
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
      <el-tab-pane label="设计变更列表" name="first">
        <DesignAlterationTable :queryObj_passed_in='queryModel' :projectModel="projectModel"
                               ref='DesignAlterationTable'></DesignAlterationTable>
      </el-tab-pane>
      <el-tab-pane label="指令单列表" name="second">
        <DesignAlterationInstructionTable  :queryObj_passed_in='queryModel' :projectModel="projectModel"
                                           ref='DesignAlterationInstructionTable'>
        </DesignAlterationInstructionTable>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
  import AccountingTargetSelector from '@/components/cost/AccountingTargetSelector/'
  import ProjectSelector from '@/components/cost/ProjectSelector/'
  import DesignAlterationTable from '@/views/cost/designAlteration/DesignAlterationTable'
  import DesignAlterationInstructionTable from '@/views/cost/designAlteration/DesignAlterationInstructionTable'
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
          alterationType: '1',
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
      DesignAlterationTable,
      DesignAlterationInstructionTable
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
          this.$refs.DesignAlterationTable.getList()
        } else {
          this.tabIndex = '1'
          this.showInstruct = true
          this.$refs.DesignAlterationInstructionTable.getList()
        }
        console.log(tab, event)
      },
      add() {
        this.$router.push({
          name: 'NewOrUpdateDesignAlteration',
          query: { id: '', isEdit: true, isAdd: true }
        })
      },
      initVM() {
        this.queryModel.pageNum = 1
        this.queryModel.count = 0
        this.queryModel.pageSize = 20
      },
      reset() {
        this.projectModel.companyId = ''
        this.projectModel.projectId = ''
        this.queryModel.contractCode = ''
        this.queryModel.code = ''
        this.queryModel.name = ''
        this.queryModel.instructionCode = ''
        this.projectModel.projectId = ''
        this.projectModel.companyId = ''
      },
      search(tab) {
        // this.initVM()
        if (this.tabIndex === '0') {
          this.$refs.DesignAlterationTable.getList()
        }
        if (this.tabIndex === '1') {
          this.$refs.DesignAlterationInstructionTable.getList()
        }
      }
    }
  }

</script>

