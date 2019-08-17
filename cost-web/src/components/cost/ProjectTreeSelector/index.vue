<!-- 组件选择组件 -->
<template>
    <div class="projectTreeSelect"
         :style="{'background': getThemeColor($store.state.themecolor)}">
        <div class="topSearch"
             :style="{'box-shadow': '0px 5px 7px '+getThemeColor($store.state.themecolor)}">
            <!-- 公司/项目 -->
            <!-- <span @click="changeTreeType">{{page.tree.treeTypeName}}</span> -->
            <!-- 搜索框 -->
            <el-input placeholder="过滤"
                      v-model="page.tree.filterText"
                      :clearable=true
                      suffix-icon="el-icon-search"></el-input>
        </div>
        <div>
            <div class="resultSet"
                 :style="{'background': getThemeColor($store.state.themecolor),'position':'relative'}">
                {{page.tree.grandFatherName}}
                <i class="el-icon-caret-bottom"
                   @click="page.tree.showDepartTree=!page.tree.showDepartTree"></i>

                <div v-show="page.tree.showDepartTree"
                     :style="{'position':'absolute','top':'30px','left':'0px','z-index':'999','opacity':'0.9','height':'500px','overflow':'auto','width':'300px'}">
                    <el-tree :data="page.tree.selectAccountingObjectTreeData"
                             :props="page.tree.defaultProps"
                             ref="departTree"
                             accordion
                             node-key="id"
                             :style="{'height':'500px','overflow':'auto'}"
                             @node-click="handleNodeClick">
                        <span :title="node.label"
                              class="custom-tree-node"
                              slot-scope="{ node, data }">
                            {{ node.label }}
                        </span>
                    </el-tree>
                </div>
            </div>
            <div class="tree">
                <el-tree :data="page.tree.data"
                         :props="page.tree.defaultProps"
                         :filter-node-method="filterNode"
                         ref="tree"
                         accordion
                         node-key="id"
                         :default-expanded-keys="page.tree.defaultExpandedKeys"
                         @node-click="handleNodeClick">
                    <span :title="node.label"
                          class="custom-tree-node"
                          slot-scope="{ node, data }">
                        {{ node.label }}
                    </span>
                </el-tree>
            </div>
        </div>
    </div>
</template>

<script>
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import { getLocalItem, Constants } from '@/utils/common/cache'
import COSTENUM from '@/utils/cost/enum'
import {
    getProjectTargetTree // 获取树
} from '@/api/cost/selectTargetCostAPI'
export default {
    name: 'ProjectTreeSelector',
    props: {
        value: {
            type: Object
        }
    },
    data () {
        return {
            page: {
                themeColor: '',
                selectNode: null, // 当前节点
                tree: {
                    grandFatherName: '',
                    treeType: COSTENUM.projectTreeType.TREE_NODE_COMPANY,
                    treeTypeName: '公司',
                    showDepartTree: false, // 是否显示部门树
                    filterText: '', // 过滤字段
                    data: [],
                    defaultExpandedKeys: [], // 默认展开节点
                    defaultProps: {
                        children: 'children',
                        label: 'text'
                    },
                    selectAccountingObjectTreeData: [] // 当前选中
                }
            }
        }
    },

    components: {},

    computed: {},

    mounted () {
        console.log(COSTENUM.projectTreeType)
        //this.page.themeColor = this.getThemeColor()
        this.getTreeData()
    },

    methods: {
        // 获取科目树
        getTreeData () {
            LoadingUtil.showLoading()
            getProjectTargetTree()
                .then(response => {
                    LoadingUtil.hideLoading()
                    this.page.tree.data = response.data
                    this.page.tree.defaultExpandedKeys.push(this.value ? this.value.id : response.data[0].id)

                    this.rebuildDepartTreeForQuery()
                })
                .catch(error => {
                    console.log(error)
                    LoadingUtil.hideLoading()
                    this.$showError(error.message ? error.message : 'msg_system_error')
                })
        },
        // 点击节点查询
        handleTreeNodeClick (node) {
            this.selectNode = node
            this.selectNode["brotherNodeList"] = this.$refs.tree.getNode(node.parentId).childNodes || []
            this.$emit('input', this.selectNode)
        },
        // 过滤
        filterNode (value, data) {
            if (!value) return true
            return data.text ? data.text.indexOf(value) !== -1 : '' // && data.type === this.page.tree.treeType
        },
        // 改变类型
        changeTreeType () {
            if (this.page.tree.treeType === COSTENUM.projectTreeType.TREE_NODE_COMPANY) {
                this.page.tree.treeType = COSTENUM.projectTreeType.TREE_NODE_PROJECT
                this.page.tree.treeTypeName = '项目'
            } else {
                this.page.tree.treeType = COSTENUM.projectTreeType.TREE_NODE_COMPANY
                this.page.tree.treeTypeName = '公司'
            }
        },
        // 获取主题颜色
        getThemeColor (theme) {
            //let theme = getLocalItem(Constants.Theme_Color)
            if (theme) {
                theme = '#' + theme
                theme = theme.replace('custom-', '')
            } else {
                theme = '#409eff'
            }
            return theme
        },
        // 树节点点击事件
        handleNodeClick (data) {
            console.log(data)
            // 成本分期
            if (data.type === COSTENUM.projectTreeType.TREE_NODE_ACC_OBJ) {
                this.page.accountingObjectId = data.id
                this.rebuildDepartTree(data)// 成本分期变化
            }
            this.handleTreeNodeClick(data)
        },
        // 成本分期变化重新构建部门(COSTENUM.projectTreeType.TREE_NODE_DEPT)树
        rebuildDepartTree (selectNode) {
            let grandFatherItem = this.$refs.tree.getNode(selectNode.parentId).parent.data
            this.page.tree.grandFatherName = grandFatherItem.text
            this.page.tree.selectAccountingObjectTreeData = grandFatherItem.children
        },
        // 查询当前的公司
        rebuildDepartTreeForQuery () {
            this.$nextTick(function () {
                try {
                    let node = null
                    node = this.$refs.tree.getNode(this.value.id)
                    this.page.tree.grandFatherName = node.parent.parent.data.text
                    this.page.tree.selectAccountingObjectTreeData = node.parent.parent.data.children
                } catch (error) {

                }

            })
        }

    },
    watch: {

        'value': function (val) {
            // this.page.tree.filterText = val ? val.text : ''
        },
        'page.tree.filterText': function (val) {
            this.$refs.tree.filter(val)
        }
    }
}

</script>
<style scoped>
/*tree横向滚动调的坑---start*/
.tree {
  overflow-y: auto;
  overflow-x: scroll;
  /* width: 80px; */
  height: 500px;
  background-color: #ffffff;
}
.el-tree {
  min-width: 100%;
  font-size: 14px;
  display: inline-block !important;
}
/*tree横向滚动调的坑---end*/

.projectTreeSelect .topSearch {
  height: 40px;
  padding: 5px;
  color: #fff;
  text-align: center;
}
.projectTreeSelect .el-input {
  width: 80%;
}
.projectTreeSelect .resultSet {
  height: 30px;
  margin-top: 10px;
  text-align: center;
  color: #fff;
  line-height: 30px;
}
.projectTreeSelect .el-step__head {
  width: 100% !important;
}
.projectTreeSelect .el-step__icon.is-text {
  line-height: 21px;
}
</style>