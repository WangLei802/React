<template>
    <div class="tree"
         :style="{'height':cHeight,'overflow':'hidden'}">
        <el-input placeholder="search"
                  v-show="searchVal"
                  v-model="filterText"
                  suffix-icon="el-icon-search"
                  :clearable=true
                  class="search"
                  size="mini"> </el-input>
        <el-tree class="filter-tree"
                 style="height:90%"
                 :data="sbleData"
                 highlight-current
                 :default-expand-all=true
                 :expand-on-click-node=false
                 :filter-node-method="filterNode"
                 @node-click="handleNodeClick"
                 ref="contractSelectTree"
                 :props="defaultProps"
                 size="mini">
            <span slot-scope="{ node, data }">
                <span v-show="showIcon">
                    <i :class="[data.type ==='2'?'el-icon-tickets':'el-icon-menu']"></i>
                </span>
                <span :style="{'cursor':data.type ==='2'?'default':'pointer','font-size':'12px'}"
                      :title="data.type ==='2'?'规划':'类别'">
                    {{ node.label }}
                </span>
            </span>
        </el-tree>

    </div>
</template>
<script>
export default {
    name: 'ContractSelectTree',
    data: function () {
        return {
            filterText: '',
            contractData: [],
            value8: this.value,
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
    props: {
        sbleData: {
            type: Array
        },
        searchVal: {
            type: Boolean
        },
        showIcon: false,
        cHeight: {
            type: String,
            default: '500px'
        }
    },
    created () {

    },
    methods: {
        handleNodeClick (dataObj, Node, Componen) {
            this.$emit('changeCheckedNode', dataObj)
        },
        filterNode (value, data) {
            if (!value) return true
            return data.name.indexOf(value) !== -1
        }
    }
}
</script>
<style scoped>
.tree {
  height: auto;
}
.el-tree {
  border: 0 none !important;
}
.el-tree-node__expand-icon {
  border: 0 none !important;
}

.search {
  margin: 0.3rem;
  width: 90%;
  margin-bottom: 0.2rem;
}
</style>

