<template>
  <div class="app-container">

    <mt-searchform>
      <template slot="buttons">
      </template>

      <template slot="form">
        <el-row :inline="true">
          <el-col :inline="true"
                  label-width="120px"
                  :span="24">
            <ProjectSelector v-model='queryModel'
                             :show="{group: true,company: true,dept: true, project: true,accObj:false}">
              <template slot="projectSelectorButtons">
                <el-col :span="6"
                        class="search-btn">
                  <el-form-item>
                    <el-button size="mini" type="info" @click='search'>{{$l("btn_search")}}</el-button>
                    <el-button size="mini" type="info" @click='reset'>{{$l("btn_reset")}}</el-button>
                  </el-form-item>
                </el-col>
              </template>
            </ProjectSelector>
          </el-col>
        </el-row>
      </template>
    </mt-searchform>
    <!--<el-form :inline="true"
             class="demo-form-inline"
             label-width="70px">
      <el-form-item :label="''">
        <ProjectSelector v-model='queryModel'></ProjectSelector>
      </el-form-item>

      <el-form-item>
        <f-button class="special-btn"
                  type='primary'
                  @click='search'
                  label="btn_search"></f-button>
      </el-form-item>
      <el-form-item>
        <f-button class="special-btn"
                  type='primary'
                  @click='reset'
                  label="btn_reset"></f-button>
      </el-form-item>
    </el-form>-->

    <tree-grid id="cost-aosl-tree" :columns="columns" :tree-structure="true" :data-source="tableData" :height="tHeight">
      <el-table-column  label="分期确定规则" width="200">
        <template slot-scope="scope">
          <fd-select v-model="scope.row.attr.phaseStageId"
                     type="cost_accounting_object_setting_phase"
                     v-if="scope.row.attr && scope.row.attr.phaseStageId"
                     @change="(v) => handleSelectPhase(v, scope.row)"
                     :disabled="scope.row.attr.stageId !== '1'"></fd-select>
        </template>
      </el-table-column>
    </tree-grid>
  </div>

</template>

<script>
import ProjectSelector from '@/components/cost/ProjectSelector/'
import TreeGrid from '@/components/sys/treeTable'
import { updateAccountingObjectSetting, listAccountingObjectSettingTree } from '@/api/cost/accountObjectSettingAPI'
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import { tableHeight } from '@/utils/common/index'
export default {
  data() {
    return {
      queryModel: {
        companyId: '',
        projectId: ''
      },
      aosModel: {
        projectId: '',
        phaseStageId: ''
      },
      columns: [
        {
          text: '组织',
          dataIndex: 'text'
        }
      ],
      tableData: [],
      phaseStageId: '2'
    }
  },
  components: {
    ProjectSelector,
    TreeGrid
  },
  mounted() {
    this.initTableData()
  },
  computed: {
    tHeight: function() {
      let options = {
        fullHeight: this.$store.getters.fullHeight,
        opened: this.$store.getters.sidebar.opened,
        showForm: this.$store.getters.showForm,
        obj: this
      }
      return `${tableHeight(options)}px`
    }
  },
  methods: {
    initTableData() {
      LoadingUtil.showLoading()
      listAccountingObjectSettingTree(this.queryModel).then(response => {
        LoadingUtil.hideLoading()
        this.tableData = response.data
      })
    },
    reset() {
      this.queryModel.companyId = ''
      this.queryModel.projectId = ''
    },
    search() {
      this.initTableData()
    },
    handleSelectPhase(v, row) {
      LoadingUtil.showLoading()
      this.aosModel.projectId = row.id
      this.aosModel.phaseStageId = v
      updateAccountingObjectSetting(this.aosModel).then(response => {
        LoadingUtil.hideLoading()
        if (response.code === '2000') {
          this.$showSuccess(response.message)
        } else {
          this.$showError(response.message)
        }
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<style>
  .el-select {
    width: 200px;
  }
  .app-container #cost-aosl-tree tr td:first-child .cell{
    text-align:left
  }
  .app-container #cost-aosl-tree table.el-table__header tr th:first-child .cell{
    display:block
  }
</style>
