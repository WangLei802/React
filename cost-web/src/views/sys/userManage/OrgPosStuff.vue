<template>
    <div>
        <el-row :gutter="10">
            <el-col :span="spans[type][0]"
                    :style="{height: tHeight + 'px'}"
                    style="margin-top:50px">
                <el-input placeholder="输入关键字进行过滤（组织）"
                          v-model="OrgfilterText"> </el-input>
                <el-tree class="filter-tree"
                         check-strictly
                         node-key="id"
                         :data="treeData"
                         highlight-current
                         :props="defaultProps"
                         @node-click="getNodeData"
                         :filter-node-method="filterNodeOrg"
                         ref="orgMenuTree"
                         default-expand-all
                         :expand-on-click-node="false"
                         :style="{height: (tHeight-30) + 'px'}">
                </el-tree>
            </el-col>
            <el-col :span="spans[type][1]"
                    :style="{height: tHeight + 'px'}"
                    style="margin-top:50px">
                <el-input placeholder="输入关键字进行过滤（岗位）"
                          v-model="filterText"> </el-input>
                <el-tree class="filter-tree"
                         check-strictly
                         node-key="id"
                         :data="posData"
                         highlight-current
                         :props="defaultPosProps"
                         @node-click="getUserData"
                         :filter-node-method="filterNode"
                         ref="menuTree"
                         default-expand-all
                         :expand-on-click-node="false"
                         :style="{height: (tHeight-30) + 'px'}">
                </el-tree>
            </el-col>

            <el-col :span="spans[type][2]">
                <mt-searchform>
                    <template slot="buttons">
                        <!-- <el-button icon='el-icon-plus'
                                   type='primary'
                                   @click='add'>{{$l("btn_add")}}</el-button> -->
                    </template>

                    <template slot="form">
                        <el-row>
                            <el-col :span="6">
                                <el-form-item :label='this.$ls("lbl_userName")'>
                                    <el-input v-model="userQueryModel.username"
                                              :maxlength='20'></el-input>
                                </el-form-item>
                            </el-col>

                            <el-col :span="6">
                                <el-form-item :label='this.$ls("lbl_name")'>
                                    <el-input v-model='userQueryModel.nickName'
                                              :maxlength='20'></el-input>
                                </el-form-item>
                            </el-col>

                            <el-col :span="6">
                                <el-form-item :label='this.$ls("lbl_email")'>
                                    <el-input v-model='userQueryModel.email'
                                              :maxlength='50'></el-input>
                                </el-form-item>
                            </el-col>

                            <el-col :span="6"
                                    class="search-btn">
                                <el-form-item>
                                    <el-button type="info"
                                               @click='search'>{{$l("btn_search")}}</el-button>
                                    <el-button @click='reset'>{{$l("btn_reset")}}</el-button>
                                </el-form-item>
                            </el-col>

                            <el-col :span="6">
                                <el-form-item :label='this.$ls("lbl_mobile")'>
                                    <el-input v-model='userQueryModel.mobile'
                                              :maxlength='11'></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item :label='$ls("lbl_status")'>
                                    <fd-select v-model="userQueryModel.status"
                                               type="sys_user_status"
                                               clearable> </fd-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </template>
                </mt-searchform>
                <UserManageTable :queryObj_passed_in='userQueryModel'
                                 ref='UserManageTable'></UserManageTable>
            </el-col>
        </el-row>

    </div>
</template>
<script>
import { tableHeight } from '@/utils/common/index'
import UserManageTable from '@/views/sys/userManage/UserManageTable'
import { getTopOrgList, orgPositionList, getOrgName } from '@/api/sys/orgAPI'
// import { getLocalItem } from '@/utils/common/cache'
import { getValueByKey } from '@/utils/sys/ParameterUtil.js'
export default {
    components: {
        UserManageTable
    },
    data () {
        return {
            test: '请输入{test}===={}===',
            posData: [],
            nowOrgCode: '',
            type: getValueByKey('user.link.model') || 1, // 1:岗位在组织下 2：岗位组织无关系
            spans: {                1: [5, 5, 14],
                2: [5, 5, 14],
                3: [0, 5, 19]            },
            userQueryModel: {
                username: '',
                nickName: '',
                email: '',
                mobile: '',
                status: '',
                pageNum: 1,
                orgCode: '',
                pageSize: 20
            },
            OrgfilterText: '',
            filterText: '',
            externalData: [],
            treeData: [],
            defaultProps: {
                children: 'children',
                label: 'orgName'
            },
            defaultPosProps: {
                children: 'children',
                label: 'name'
            },
            formInline: {
                user: '',
                region: ''
            },
            currentMenu: {}
        }
    },
    computed: {
        tHeight: function () {
            let options = {
                fullHeight: this.$store.getters.fullHeight,
                opened: this.$store.getters.sidebar.opened,
                otherHeight: 120,
                obj: this
            }
            return `${tableHeight(options)}`
        }
    },
    mounted () {
    },
    created: function () {
        this.initLeftMenuTree()
        // this.initPosition()
    },
    watch: {
        filterText (val) {
            this.$refs.menuTree.filter(val)
        },
        OrgfilterText (val) {
            this.$refs.orgMenuTree.filter(val)
        },
        multipleSelection: function () {
            this.apiSelected = []
            for (const i in this.multipleSelection) {
                this.apiSelected.push(this.multipleSelection[i])
            }
        }
    },
    methods: {
        initVM () {
            this.userQueryModel.pageNum = 1
        },
        reset () {
            this.userQueryModel.username = ''
            this.userQueryModel.nickName = ''
            this.userQueryModel.email = ''
            this.userQueryModel.mobile = ''
            this.userQueryModel.status = ''
        },
        // 初始化组织
        initLeftMenuTree () {
            getTopOrgList({ username: localStorage.getItem('userName') }).then(response => {
                this.treeData = response.data
            })
        },
        getUsersByPositionCode (param) {
            // getUsersByPositionCode(param).then(response => {
            //   this.userlist = response.data
            // })
            this.$refs.UserManageTable.getUsersByPositionCode(param)
        },
        // 根据组织code获取相应的岗位列表
        orgPositionList (param) {
            orgPositionList(param).then(response => {
                this.posData = response.data
            })
        },
        // 获取岗位的组织机构，包括岗位的子岗位
        getOrgName () {
            getOrgName().then(response => {
                this.userlist = response.data
            })
        },
        search () {
            this.initVM()
            this.$refs.UserManageTable.getList()
        },
        add () {
            if (!this.currentMenu || !this.currentMenu.id) {
                this.$showError('lbl_position_first')
                return
            }
            this.$router.push({
                name: 'NewOrUpdateUser',
                query: { positionMenu: this.currentMenu }
            })
        },
        filterNode (value, data) {
            if (!value) return true
            return (data.name.indexOf(value) !== -1) || (data.name.indexOf(value) !== -1)
        },
        filterNodeOrg (value, data) {
            if (!value) return true
            return (data.orgName.indexOf(value) !== -1) || (data.orgName.indexOf(value) !== -1)
        },
        getNodeData (data) {
            this.nowOrgCode = data.orgCode
            this.orgPositionList({ orgCode: data.orgCode, userName: localStorage.getItem('userName') })
        },
        getUserData (data) {
            this.currentMenu = data
            this.getUsersByPositionCode({ username: localStorage.getItem('userName'), positionCode: data.code, orgCode: this.nowOrgCode })
        }
    }
}
</script>
<style scoped>
@import '../../../styles/list.scss';
</style>

