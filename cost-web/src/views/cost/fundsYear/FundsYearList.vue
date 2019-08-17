<!-- fundsYearList -->
<template>
    <div class='app-container'>
        <mt-searchform>
            <template slot="buttons">
                <el-button size="mini"
                           icon='el-icon-plus'
                           type='primary'
                           v-if="$checkPersmissionByCode('cost:fundsYear:create')"
                           @click='add'>{{$l("btn_add")}}</el-button>
            </template>
            <template slot="form">
                <el-row :inline="true">
                    <el-col :inline="true"
                            label-width="120px"
                            :span="24">
                        <ProjectSelector v-model='p_queryModel'
                                         :showTobe=false
                                         :show="{group: true,company: true,dept: true, project: true,accObj:true}">
                            <template slot="projectSelectorButtons">
                                <el-col :span="6"
                                        class="search-btn">
                                    <el-form-item>
                                        <el-button size="mini"
                                                   type="primary"
                                                   @click='search'>{{$l("btn_search")}}</el-button>
                                        <el-button size="mini"
                                                   @click='reset'>{{$l("btn_reset")}}</el-button>
                                    </el-form-item>
                                </el-col>
                            </template>
                            <template slot="after">
                                <el-col :span="6">
                                    <el-form-item :label="'资金计划年份：'">
                                        <el-select v-model='queryModel.fundsYear'
                                                   placeholder="请选择"
                                                   :clearable="true">
                                            <el-option v-for="item in selectData.fundsYearList"
                                                       :key="item.value"
                                                       :label="item.label"
                                                       :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item :label="'审批状态：'">
                                        <fd-select v-model='queryModel.status'
                                                   placeholder="请选择"
                                                   type="cost_flow_status"
                                                   :clearable="true"></fd-select>
                                    </el-form-item>
                                </el-col>
                            </template>
                        </ProjectSelector>
                    </el-col>
                </el-row>
            </template>
        </mt-searchform>

        <FundsYearTable :queryObj_passed_in='queryModel'
                        ref='NewOrUpdateFundsYear'></FundsYearTable>
    </div>
</template>

<script>
import AccountingTargetSelector from '@/components/cost/AccountingTargetSelector/'
import ProjectSelector from '@/components/cost/ProjectSelector/'
import FundsYearTable from '@/views/cost/fundsYear/FundsYearTable'
import COSTENUM from '@/utils/cost/enum'
export default {
    data () {
        return {
            p_queryModel: {
                companyId: '',
                accObjId: '',
                projectId: ''
            },
            queryModel: {
                companyId: '',
                accObjId: '',
                projectId: '',
                fundsNo: '',
                fundsYear: '',
                status: '',
                pageNum: 1,
                pageSize: 40,
                count: 0
            },
            selectData: {
                fundsYearList: [{ label: 2018, value: 2018 }, { label: 2019, value: 2019 }]
            }
        }
    },
    components: {
        ProjectSelector,
        FundsYearTable
    },
    mounted () {
        this.search()
    },

    methods: {
        add () {
            this.$router.push({
                name: 'NewOrUpdateFundsYear',
                query: { id: 0, isEdit: true }
            })
        },
        initVM () {
            this.queryModel.pageNum = 1
            this.queryModel.count = 0
            this.queryModel.pageSize = 20
        },
        reset () {
            this.p_queryModel.companyId = ''
            this.p_queryModel.projectId = ''
            this.p_queryModel.accObjId = ''
            this.queryModel.status = ''
            this.p_queryModel.stageId = ''
            this.p_queryModel.fundsNo = ''
            this.p_queryModel.fundsYear = ''
        },
        search () {
            this.$refs.NewOrUpdateFundsYear.getList()
        }
    },
    watch: {
        p_queryModel: {
            handler (newValue, oldValue) {
                console.log(' value change')
                this.queryModel.companyId = newValue.companyId
                this.queryModel.projectId = newValue.projectId
                this.queryModel.accObjId = newValue.accObjId
            },
            deep: true
        }
    }
}

</script>
<style scoped>
@import '../../../styles/list.scss';
.el-select {
  width: 200px;
}
</style>
