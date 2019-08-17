<template>
    <div class='app-container'>

        <el-row style="height:100%">

            <el-col :span="8" style="height:100%;margin-top: 20px;">
                <el-tree  style="overflow:scroll; height: 90%; overflow-x: hidden;margin-right: 20px;"
                          class="filter-tree"
                          node-key="id"
                          highlight-current
                          :props="defaultProps"
                          :data="moduleData"
                          :expand-on-click-node="false"
                          ref="moduleTree"
                          default-expand-all
                          @node-click="handleNodeClick"
                          v-loading="loading">
                </el-tree>

                <!--<el-table :data="moduleData"
                          stripe
                          border
                          size="small"
                          :height="tHeight"
                          style="width: 100%">
                    <el-table-column label="功能模块名称"
                                     prop="moduleName"></el-table-column>
                    <el-table-column label="功能模块编码"
                                     prop="moduleCode"></el-table-column>
                </el-table>-->
            </el-col>

            <el-col :span="16">
                <mt-searchform>
                    <template slot="form">
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label='合同类型编码'>
                                    <el-input v-model="queryModel.contractTypeCode"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label='合同类型名称'>
                                    <el-input v-model="queryModel.contractTypeName"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6"
                                    class="search-btn">
                                <el-form-item>
                                    <el-button  size="mini"
                                                type="info"
                                                @click='search'>{{$l("btn_search")}}</el-button>
                                    <el-button  size="mini"
                                                type="info"
                                                @click='reset'>{{$l("btn_reset")}}</el-button>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </template>
                </mt-searchform>

                <el-table :data="contractTypeTablePageData"
                          stripe
                          border
                          size="small"
                          :height="tHeight"
                          style="width: 100%">
                    <!-- 序号 -->
                    <el-table-column type="index"
                                     :label="this.$l('lbl_no')"
                                     width="80"></el-table-column>
                    <el-table-column label="合同类型编码"
                                     prop="contractTypeCode"></el-table-column>
                    <el-table-column label="合同类型名称"
                                     prop="contractTypeName"></el-table-column>
                    <!-- 操作 -->
                    <el-table-column :label="this.$l('lbl_operation')"
                                     width="150">
                        <template slot-scope="scope">
                            <!-- 合同授权 -->
                            <el-button  size="mini"
                                        type="text"
                                        icon="el-icon-setting"
                                        title="合同授权"
                                        @click="handleAuth(scope.row)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <div class='pagination_bar'
                     v-if="contractTypeTableData.length">
                    <mt-pagination @size-change='handleSizeChange'
                                   @current-change='handleCurrentChange'
                                   :current-page.sync='queryModel.pageNum'
                                   :page-sizes='[10, 20, 30, 40]'
                                   :page-size='queryModel.pageSize'
                                   layout='sizes, prev, pager, next'
                                   :total='contractTypeTableData.length'>
                    </mt-pagination>
                </div>
            </el-col>
        </el-row>

        <el-dialog title="分配数据权限"
                   :visible.sync="showDialog"
                   :show-close="true"
                   width="40%"
                   @close="handleCloseDialog">
            <el-table :data="roleTableData"
                      stripe
                      border
                      v-loading="roleTableLoading"
                      height="300"
                      size="small"
                      ref="roleTable"
                      @selection-change="handleSelectionChange">
                <el-table-column label="操作"
                                 type="selection"
                                 checked="true"></el-table-column>
                <!-- 序号 -->
                <el-table-column fixed
                                 :label="$l('lbl_no')"
                                 width="100"
                                 type="index"></el-table-column>
                <el-table-column prop="roleName"
                                 label="角色"
                                 width="200"></el-table-column>
                <el-table-column prop="remark"
                                 label="描述"></el-table-column>
            </el-table>
            <div style="text-align: center;margin-top: 10px;">
                <el-button  size="mini"  type='primary'
                           @click='handleConfirm'>{{this.$l('btn_confirm')}}</el-button>
                <el-button  size="mini"  @click='cancel'>{{this.$l('btn_cancel')}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getContractTypes, saveCotractTypeRole, getRoleList, getModuleList } from '@/api/cost/dataPermissionAPI'
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import { tableHeight } from '@/utils/common/index'
export default {
    data () {
        return {
            defaultProps: {
                label: 'moduleName'
            },
            moduleData: [],
            contractTypeTableData: [],
            roleTableData: [],
            queryModel: {
                contractTypeCode: '',
                contractTypeName: '',
                roleName: '',
                pageNum: 1,
                pageSize: 20
            },
            contractTypeCode: '',
            moduleCode: '',
            saveModel: {
                contractTypeCode: '',
                moduleCode: '',
                contractTypeRoleList: []
            },
            showDialog: false,
            roleTableLoading: false,
            loading: false
        }
    },
    mounted () {
        this.getModuleList()
        // this.getList()
    },
    methods: {
        getList () {
            LoadingUtil.showLoading()
            getContractTypes(this.queryModel).then(res => {
                LoadingUtil.hideLoading()
                this.contractTypeTableData = res.data
            }).catch(err => {
                console.log(err)
            })
        },
        getModuleList() {
            getModuleList().then(res => {
                this.moduleData = res.data
            }).catch(err => {
                console.log(err)
            })
        },
        getRoleList () {
            this.roleTableLoading = true
            getRoleList({ contractTypeCode: this.contractTypeCode, moduleCode: this.moduleCode }).then(res => {
                this.roleTableData = res.data
                this.$nextTick(() => {
                    this.roleTableData.forEach(row => {
                        if (row.checked) {
                            this.$refs.roleTable.toggleRowSelection(row)
                        }
                    })
                })
                this.roleTableLoading = false
            }).catch(err => {
                console.log(err)
            })
        },
        search () {
            this.getList()
        },
        reset () {
            this.queryModel.contractTypeCode = ''
            this.queryModel.contractTypeName = ''
            this.queryModel.pageSize = 20
            this.queryModel.pageNum = 1
        },
        handleAuth (row) {
            this.showDialog = true
            this.contractTypeCode = row.contractTypeCode
            this.saveModel.contractTypeCode = row.contractTypeCode
            this.getRoleList()
        },
        cancel () {
            this.roleTableData = []
            this.showDialog = false
        },
        handleCloseDialog () {
            this.roleTableData = []
        },
        handleSelectionChange (val) {
            this.saveModel.contractTypeRoleList = val
        },
        handleConfirm () {
            this.dialogTableLoading = true
            saveCotractTypeRole(this.saveModel).then(res => {
                this.dialogTableLoading = false
                this.showDialog = false
                if (res.code === '2000') {
                    this.$showSuccess(res.message)
                } else {
                    this.$showError(res.message)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        handleSizeChange (v) {
            this.queryModel.pageSize = v
        },
        handleCurrentChange (v) {
            this.queryModel.pageNum = v
        },
        handleNodeClick(data) {
            this.saveModel.moduleCode = data.moduleCode
            this.moduleCode = data.moduleCode
            this.getList()
        }
    },
    computed: {
        contractTypeTablePageData () {
            let start = (this.queryModel.pageNum - 1) * this.queryModel.pageSize
            let end = this.queryModel.pageNum * this.queryModel.pageSize
            return this.contractTypeTableData.slice(start, end)
        },
        tHeight: function () {
            let options = {
                fullHeight: this.$store.getters.fullHeight,
                opened: this.$store.getters.sidebar.opened,
                showForm: this.$store.getters.showForm,
                obj: this
            }
            return `${tableHeight(options)}px`
        }
    }
}
</script>

<style scoped>
</style>
