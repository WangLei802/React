<template>
    <div class='app-container'>
        <!--组织或岗位-人-->
        <org-or-pos-stuff v-if="type!=1"></org-or-pos-stuff>
        <!--组织-人-岗位-->
        <!-- <org-pos-stuff v-if="type==1"></org-pos-stuff> -->
    </div>
</template>
<script>
import OrgOrPosStuff from '@/views/sys/userManage/OrgOrPosStuff'
import OrgPosStuff from '@/views/sys/userManage/OrgPosStuff'
import UserManageTable from '@/views/sys/userManage/UserManageTable'

import { getValueByKey } from '@/utils/sys/ParameterUtil.js'
export default {
    components: {
        UserManageTable,
        OrgPosStuff,
        OrgOrPosStuff
    },
    data () {
        return {
            posData: [],
            type: getValueByKey('user.link.model'), // 1:岗位在组织下 2：岗位组织无关系,
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
    mounted () {
        this.type = getValueByKey('user.link.model')
        // this.type = 2
        // alert(this.type)
    },
    created: function () {
    },
    watch: {
    },
    methods: {
    }
}
</script>
<style scoped>
@import '../../../styles/list.scss';
</style>

