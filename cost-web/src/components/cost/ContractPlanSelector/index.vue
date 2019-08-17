<!--
        import ContractPlanSelector from '@/components/cost/ContractPlanSelector/'
        page:{
            contractPlanSelector: { //合约规划树
                    show: false,
                    selectNode: null //当前节点{id:"8a80809964a726790164a727ced80001"}
                }
        }
        CB_dialogVisible (dialogVisible) {
            this.page.contractPlanSelector.show = dialogVisible
        },
        <ContractPlanSelector :dialogVisible="page.contractPlanSelector.show"
                              :enableSearch=true
                              @CB-dialogVisible="CB_dialogVisible"
                              v-model="page.contractPlanSelector.selectNode" />
-->
<template>
    <div class="filterContract">
        <el-dialog title="选择合约"
                   width="500"
                   :show-close="true"
                   :before-close="cancel"
                   :visible.sync="dialogVisible"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false">
            <el-form @submit.native.prevent>
                <el-input placeholder="search"
                          v-show="enableSearch"
                          v-model="filterText"
                          suffix-icon="el-icon-search"
                          class="search"> </el-input>
                <el-tree v-if="dialogVisible"
                         class="filterTree"
                         :data="contractPlanTree"
                         node-key="id"
                         ref="contractSelectTree"
                         default-expand-all
                         :default-checked-keys="resourceCheckedKey"
                         show-checkbox
                         :filter-node-method="filterNode"
                         :check-strictly="true"
                         :highlight-current="true"
                         @check-change="checkChange"
                         @node-click="nodeClick"
                         :props="defaultProps">
                </el-tree>
                <div class="dialog-footer">
                    <el-button size="mini"
                               @click="cancel">取 消</el-button>
                    <el-button size="mini"
                               type="primary"
                               @click="confirm">确 定</el-button>
                </div>
            </el-form>

        </el-dialog>
    </div>
</template>
<script>
import {    listAllContractPlanTree,
    listAllExcludeLocked //非锁定合约规划
} from '@/api/cost/contractPlanTemplateAPI'
export default {
    props: {
        enableSearch: {
            // 开启搜索框
            type: Boolean,
            default: true
        },
        enableMultiSelect: {
            // 开启多选
            type: Boolean,
            default: false
        },
        dialogVisible: {
            // 显示
            type: Boolean,
            default: false
        },
        value: {
            // 选择值
            type: Object
        },
        locked: {
            //是否锁定
            type: Boolean,
            default: false
        },
        //参数
        params: {
            type: Object,
            default: {
                accountingObjectId: ''
            }
        }
    },
    data () {
        return {
            selectNode: null,
            selectNodes: [],
            contractPlanTree: [],
            filterText: '',
            i: 0,
            resourceCheckedKey: [],
            defaultProps: {
                children: 'children',
                label: 'name'
            }
        }
    },
    watch: {
        filterText (val) {
            this.$refs.contractSelectTree.filter(val)
        },
        dialogVisible: function (newValue, oldValue) {
            this.filterText = ''
            if (newValue) this.init()
        }
    },
    mounted () {
        //this.init()
        this.filterText = ''
    },
    methods: {
        init () {
            (this.locked && this.params.accountingObjectId) ? this.initContractPlanWithNoLockTreeData() : this.initContractPlanTreeData()
            this.$nextTick(function () {
                // 设置选中值
                // if (this.value && this.value.id) {
                //     this.resourceCheckedKey.push(this.value.id)
                // }
                this.$refs.contractSelectTree.setCheckedKeys([]);
            })
        },
        // 初始化规划库树数据
        initContractPlanTreeData () {
            listAllContractPlanTree({ type: '0', ownerId: '0' }).then(response => {
                this.contractPlanTree = response.data ? response.data : []
                this.filterDisabled(this.contractPlanTree[0])
            }).catch(error => {
                console.error(error)
                this.$showError(error.message ? error.message : 'msg_system_error')
            })
        },
        //初始化规划库树数据(无锁的)
        initContractPlanWithNoLockTreeData () {
            listAllExcludeLocked({ accountingObjectId: this.params.accountingObjectId }).then(response => {
                this.contractPlanTree = response.data ? response.data : []
                this.filterDisabled(this.contractPlanTree[0])
            }).catch(error => {
                console.error(error)
                this.$showError(error.message ? error.message : 'msg_system_error')
            })
        },
        confirm () {
            this.$emit('input', this.selectNode)
            this.$emit('CB-dialogVisible', false)
        },
        cancel () {
            this.$emit('CB-dialogVisible', false)
        },
        filterDisabled (data) {
            if (data && data.type !== '2') data.disabled = true
            for (let i = 0; i < data.children.length; i++) {
                if (data.children[i].type !== '2') {
                    data.children[i].disabled = true
                    if (data.children[i]) this.filterDisabled(data.children[i])
                }
            }
        },
        filterNode (value, data) {
            if (!value) return true
            return data.name.indexOf(value) !== -1
        },
        checkChange (item, node, self) {
            if (node == true) { // 点击未选中复选框
                this.selectNode = item
                this.$refs.contractSelectTree.setCheckedKeys([item.id])
            } else { // 点击已选中复选框，保证至少一个选中
                if (this.selectNode.id == item.id) {
                    this.$refs.contractSelectTree.setCheckedKeys([item.id])
                }
            }
        },
        nodeClick (item, node, self) {
            this.selectNode = item
            this.$refs.contractSelectTree.setCheckedKeys([item.id])
        }
    }
}
</script>
<style scoped>
.filterContract .el-input {
  width: 40%;
  margin-bottom: 1rem;
}
.dialog-footer {
  margin-top: 1rem;
}
.filterTree {
  height: 200px;
  overflow-y: scroll;
}
.filterContract .el-dialog__headerbtn {
  display: none;
}
</style>