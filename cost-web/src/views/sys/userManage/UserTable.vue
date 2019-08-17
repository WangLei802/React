<template>
    <div ref="UserTable">
        <el-table :height="tHeight"
                  :data="tableData"
                  stripe
                  border
                  style="width: 100%">
            <el-table-column type="index"
                             :index="this.$getTableIndex(this.queryObj)"
                             :label="this.$l('lbl_no')"
                             width="80"></el-table-column>
            <el-table-column prop="username"
                             :label="this.$l('lbl_userName')"
                             width="100"></el-table-column>
            <el-table-column prop="nickName"
                             :label="this.$l('lbl_nickName')"></el-table-column>
            <el-table-column prop="email"
                             :label="this.$l('lbl_email')"
                             width="200"></el-table-column>
            <el-table-column prop="mobile"
                             :label="this.$l('lbl_mobile')"
                             width="160"></el-table-column>
            <el-table-column prop="phone"
                             :label="this.$l('lbl_phone')"></el-table-column>
            <el-table-column prop="orgNames"
                             :label="this.$l('lbl_org_name')"
                             width="200"></el-table-column>
            <el-table-column :label="this.$l('lbl_status')"
                             width="100">
                <template slot-scope="scope">
                    <fd-label :code="scope.row.status"
                              type="sys_user_status"></fd-label>
                </template>
            </el-table-column>
            <el-table-column width="120"
                             :label="this.$l('lbl_operation')">
                <template slot-scope="scope">
                    <el-button type="text"
                               icon="el-icon-edit"
                               :title="$l('btn_edit')"
                               @click="handleEdit(scope.$index, scope.row)"></el-button>
                    <el-popover placement="left"
                                width="auto"
                                trigger="hover"
                                style="margin-left:10px;">
                        <el-row style="margin:-6px;">
                            <el-button class="ordinary-btn"
                                       icon="el-icon-circle-check-outline"
                                       @click="updateUserRoles(scope.$index, scope.row)">{{$l("btn_allot_role")}}</el-button>
                            <!-- <el-button class="ordinary-btn"
                                       icon="el-icon-setting"
                                       style="margin-left:2px;"
                                       @click="resetPassword(scope.$index, scope.row)">{{$l("btn_reset_pwd")}}</el-button> -->
                            <!-- <el-button class="ordinary-btn"  icon="el-icon-time" style="margin-left:2px;"
                         @click="updateUserPosition(scope.$index, scope.row)">{{$l("lbl_set_position")}}</el-button> -->
                            <!-- <el-button class="ordinary-btn"
                                       icon="el-icon-edit-outline"
                                       style="margin-left:2px;"
                                       @click="updateUserOrg(scope.$index, scope.row)">{{$l("lbl_set_org")}}</el-button> -->
                            <!-- <el-button class="ordinary-btn"
                                       icon="el-icon-edit-outline"
                                       style="margin-left:2px;"
                                       @click="setSys(scope.$index, scope.row)">{{$l("lbl_set_sysadmin")}}</el-button> -->
                            <!--<mt-button class="ordinary-btn"  icon="el-icon-edit-outline" style="margin-left:2px;"-->
                            <!--@click="setBulter(scope.$index, scope.row)" >{{$l("lbl_set_butler")}}</mt-button>-->
                        </el-row>
                        <el-button slot="reference"
                                   type="text"
                                   icon="el-icon-menu"></el-button>
                    </el-popover>
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
import { searchUserListRecursion, userLifecycle, resetPassword } from '@/api/sys/userManageAPI'
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import { UpdateUserRoles } from '@/views/platform/userManage/UpdateUserRoles'
import { UpdateUserPosition } from '@/views/sys/userManage/UpdateUserPosition'
import { UpdateUserOrg } from '@/views/sys/userManage/UpdateUserOrg'
import { tableHeight } from '@/utils/common/index'
import { getUsersByPositionCode } from '@/api/sys/orgAPI'
export default {
    props: {
        queryObj_passed_in: {
            type: Object
        },
        externalData: {
            type: Array,
            default: function () {
                return []
            }
        }
    },
    computed: {
        tHeight: function () {
            let options = {
                fullHeight: this.$store.getters.fullHeight,
                opened: this.$store.getters.sidebar.opened,
                showForm: this.$store.getters.showForm,
                obj: this,
                otherHeight: 240
            }
            return `${tableHeight(options)}px`
        }
    },
    data () {
        return {
            tableData: [],
            queryObj: this.queryObj_passed_in,
            tableHeight: '0',
            fullHeight: document.documentElement.clientHeight
        }
    },
    methods: {
        getList (param) {
            LoadingUtil.showLoading()
            this.queryObj
            // param = { positionCode: '1', username: 'admin' }
            // getUsersByPositionCode(param).then((response) => {
            //   LoadingUtil.hideLoading()
            //   this.tableData = response.data
            // })
            searchUserListRecursion(this.queryObj)
                .then(response => {
                    LoadingUtil.hideLoading()
                    response.data.content.forEach(function (value, index, array) {
                        value.orgNames = value.orgNames.join(',')
                    })
                    this.tableData = response.data.content
                    this.queryObj.count = response.data.totalElements
                })
                .catch(error => {
                    console.log(error)
                })
        },
        updateUserRoles (index, row) {
            this.$router.push({
                name: 'UpdateUserRoles',
                query: { id: row.id }
            })
        },
        updateUserPosition (index, row) {
            this.$router.push({
                name: 'UpdateUserPosition',
                query: { id: row.id }
            })
        },
        updateUserOrg (index, row) {
            this.$router.push({
                name: 'UpdateUserOrg',
                query: { id: row.id }
            })
        },
        handleSizeChange (val) {
            this.queryObj.pageSize = val
            this.getList()
        },
        handleCurrentChange (val) {
            this.queryObj.pageNum = val
            this.getList()
        },
        settingTableHeight: function () {
            // const topHeight = this.$refs['langTable'].getBoundingClientRect().top
            // this.tableHeight = this.fullHeight - topHeight - 80
            // this.$refs['langTable'].style.Height = this.tableHeight + 'px'
        },
        handleEdit (index, row) {
            this.$router.push({
                name: 'NewOrUpdateUser',
                query: { id: row.id }
            })
        },
        disableOrActivate (index, row, status) {
            const params = {
                username: row.username,
                status: status
            }
            LoadingUtil.showLoading()
            userLifecycle(params)
                .then(response => {
                    LoadingUtil.hideLoading()
                    if (response.code === '2000') {
                        this.$showSuccess(response.message)
                        this.getList()
                    } else {
                        this.$showError(response.message)
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },
        setSys (index, row) {
            this.$router.push({
                name: 'setUserType',
                query: { username: row.username, id: row.id }
            })
        },

        resetPassword (index, row) {
            this.$confirm(this.$l('msg_confirm_reset_password'), this.$l('msg_information'), {
                confirmButtonText: this.$l('btn_confirm'),
                cancelButtonText: this.$l('btn_cancel'),
                type: 'warning'
            }).then(() => {
                const body = { username: row.username }
                LoadingUtil.showLoading()
                resetPassword(body).then(response => {
                    LoadingUtil.hideLoading()
                    this.$showSuccess(response.message)
                    this.getList()
                }).catch(error => {
                    console.log(error)
                })
            }).catch(() => { })
        }
    },
    mounted: function () {
        this.getList()
        this.$nextTick(function () {
            this.settingTableHeight()
        })
        // window.onresize = () => {
        //   return (() => {
        //     window.fullHeight = document.documentElement.clientHeight
        //     this.fullHeight = window.fullHeight
        //   })()
        // }
    },
    watch: {
        fullHeight (val) {
            this.settingTableHeight()
        }
    }
}
</script>
