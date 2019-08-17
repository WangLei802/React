<!-- StandaredSubjectList.vue -->
<template>
    <div class="app-container">
        <!--<div class="subTitle">-->
        <!--<div class="breadcrumb-child">-->
        <!--<i class="fa fa-folder-open-o"></i>{{this.$l('lbl_standared_subject_list')}}-->
        <!--</div>-->
        <div class="button-area right">
            <div style="width:100px;float:left;text-align:right">
                <el-button size="mini"
                           icon='el-icon-download'
                           type='primary'
                           v-if="$checkPersmissionByCode('cost:subject:exportSubjectData')"
                           @click='handleExport'>{{$l('lbl_standared_subject_export')}}</el-button>
            </div>

            <div style="width:100px;float:left;text-align:right">
                <el-upload name="file"
                           :action="importFileUrl"
                           :show-file-list="false"
                           :before-upload="handleUploadBefore"
                           :on-success="handleUploadSuccess"
                           v-if="$checkPersmissionByCode('cost:subject:importSubjectData')"
                           accept="multipart/form-data,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
                    <el-button size="mini"
                               icon='el-icon-upload2'
                               type='primary'>{{$l('lbl_standared_subject_import')}}</el-button>
                </el-upload>
            </div>
        </div>
        <!--</div>-->
        <el-form :inline="true"
                 class="demo-form-inline"
                 v-if="false"
                 size="mini">
            <el-form-item :label='this.$ls("lbl_standared_subject_type")'>
                <fd-select v-model='standaredSubjectQueryModel.type'
                           type="cost_subject_type"
                           :clearable="true"></fd-select>
            </el-form-item>
            <el-form-item :label='this.$ls("lbl_standared_subject_companyId")'>
                <el-select v-model="standaredSubjectQueryModel.companyId"
                           placeholder="请选择">
                    <el-option v-for="item in selectData.companyIdList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label='this.$ls("lbl_standared_subject_projectId")'>
                <el-select v-model="standaredSubjectQueryModel.projectId"
                           placeholder="请选择">
                    <el-option v-for="item in selectData.projectIdList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label='this.$ls("lbl_standared_subject_groupId")'
                          v-if="false">
                <el-select v-model="standaredSubjectQueryModel.groupId"
                           placeholder="请选择">
                    <el-option v-for="item in selectData.groupIdList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
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
        </el-form>
        <StandaredSubjectTable :queryObj_passed_in='standaredSubjectQueryModel'
                               ref="StandaredSubjectTable"></StandaredSubjectTable>
    </div>
</template>

<script>
import COSTBUSINESS from '@/utils/cost/business'
import StandaredSubjectTable from '@/views/cost/subject/StandaredSubjectTable'
export default {
    data () {
        return {
            importFileUrl: COSTBUSINESS.upload(process.env.COST_API + '/subject/importSubjectData'),
            selectData: {
                typeList: [],
                companyIdList: [],
                projectIdList: [],
                groupIdList: []
            },
            standaredSubjectQueryModel: {
                type: '0',
                companyId: '',
                projectId: '',
                groupId: ''
            }
        }
    },

    components: {
        StandaredSubjectTable
    },

    computed: {},

    mounted () {
        this.$refs.StandaredSubjectTable.getList()
    },

    methods: {
        search () {
            this.$refs.StandaredSubjectTable.getList()
        },
        reset () {
            this.queryObj.type = ''
            this.queryObj.companyId = ''
            this.queryObj.projectId = ''
            this.queryObj.groupId = ''
        },
        handleExport () {
            this.$refs.StandaredSubjectTable.handleExport()
        },
        handleUploadBefore (file) {
            this.$refs.StandaredSubjectTable.handleUploadBefore(file)
        },
        handleUploadSuccess (response, file, fileList) {
            this.$refs.StandaredSubjectTable.handleUploadSuccess(response, file, fileList)
        }
    }
}
</script>
<style lang='scss' scoped>
.right {
  float: right;
}
</style>
