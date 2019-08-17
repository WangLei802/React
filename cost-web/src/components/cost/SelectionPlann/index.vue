<template>
    <div class="filterContract">
        <el-dialog title="选择合约"
                   @close='closeDialog'
                   width="500"
                   :visible.sync="dialogVisible"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false">
            <el-form>
                <el-input placeholder="search"
                          v-show="searchVal"
                          v-model="filterText"
                          suffix-icon="el-icon-search"
                          class="search"
                          size="mini"> </el-input>
                <el-tree class="filterTree"
                         :data="contractPlanTree"
                         node-key="id"
                         ref="contractSelectTree"
                         default-expand-all
                         show-checkbox
                         :filter-node-method="filterNode"
                         check-strictly
                         @check-change="handleClick"
                         :props="defaultProps">
                </el-tree>
                <div class="dialog-footer">
                    <el-button size="mini"
                               @click="innerVisible">取 消</el-button>
                    <el-button size="mini"
                               type="primary"
                               @click="outerVisible">确 定</el-button>
                </div>
            </el-form>

        </el-dialog>
    </div>
</template>
<script>
export default {
    props: {
        dialogVisible: {
            type: Boolean
        },
        contractPlanTree: {
            type: Array
        }
    },
    data () {
        return {
            checkoutNode: {},
            subjectObj: {},
            ischecked: false,
            isCloud: false,
            searchVal: true,
            filterText: '',
            i: 0,
            defaultProps: {
                children: 'children',
                label: 'name'

            }
        }
    },
    watch: {
        filterText (val) {
            this.$refs.contractSelectTree.filter(val)
        }
    },
    created () {
        this.filterDisabled()
    },
    methods: {
        outerVisible () {
            this.$refs.contractSelectTree.setCheckedKeys([])
            this.$emit('changeCheckedObj', this.subjectObj)
        },
        innerVisible () {
            this.closeDialog()
        },
        filterDisabled () {
            for (let i = 0; i < this.contractPlanTree.length; i++) {
                if (this.contractPlanTree[i].type == 2) {
                    this.contractPlanTree[i].disabled = true
                }
            }
        },
        filterNode (value, data) {
            if (!value) return true
            return data.name.indexOf(value) !== -1
        },

        closeDialog () {
            this.$refs.contractSelectTree.setCheckedKeys([])
            this.$emit('closeDialogDialogVisible')
        },
        handleClick (data, checked, node) {
            this.i++
            if (checked) {
                this.$refs.contractSelectTree.setCheckedNodes([])
                this.$refs.contractSelectTree.setCheckedNodes([data])
                this.getCheckedNodes(data)
                // 交叉点击节点
            } else {
                this.$refs.contractSelectTree.setCheckedNodes([])

                // 点击已经选中的节点，置空
            }
        },
        getCheckedNodes (dataObj, Node) {
            this.subjectObj = {}
            this.subjectObj = dataObj
            this.checkoutNode = Node
            if (dataObj.children.length == 0) { // && this.isCloud == false
                // this.$emit('changeCheckedObj', subjectObj)
            }
        },
        handleClose (done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done()
                })
                .catch(_ => { })
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
