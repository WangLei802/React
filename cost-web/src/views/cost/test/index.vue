<!-- 测试 -->
<template>
    <el-tabs v-model="activeName"
             @tab-click="handleClick">
        <el-tab-pane label="用户管理"
                     name="first">
            <el-table :data="tableData1"
                      v-if="activeName === 'first'"
                      style="width: 100%">
                <el-table-column prop="date"
                                 label="日期"
                                 width="180">
                </el-table-column>
                <el-table-column prop="name"
                                 label="姓名"
                                 width="180">
                </el-table-column>
                <el-table-column prop="address"
                                 label="地址">
                </el-table-column>
                <el-table-column prop="date1"
                                 label="日期"
                                 width="180">
                </el-table-column>
                <el-table-column prop="name1"
                                 label="姓名"
                                 width="180">
                </el-table-column>
                <el-table-column prop="address1"
                                 label="地址">
                </el-table-column>
                <el-table-column prop="date2"
                                 label="日期"
                                 width="180">
                </el-table-column>
                <el-table-column prop="name2"
                                 label="姓名"
                                 width="180">
                </el-table-column>
                <el-table-column prop="address2"
                                 label="地址">
                </el-table-column>
                <el-table-column prop="date3"
                                 label="日期"
                                 width="180">
                </el-table-column>
                <el-table-column prop="name3"
                                 label="姓名"
                                 width="180">
                </el-table-column>
                <el-table-column prop="address3"
                                 label="地址">
                </el-table-column>

                <el-table-column prop="date4"
                                 label="日期"
                                 width="180">
                </el-table-column>
                <el-table-column prop="name4"
                                 label="姓名"
                                 width="180">
                </el-table-column>
                <el-table-column prop="address4"
                                 label="地址">
                </el-table-column>
                <el-table-column prop="date5"
                                 label="日期"
                                 width="180">
                </el-table-column>
                <el-table-column prop="name5"
                                 label="姓名"
                                 width="180">
                </el-table-column>
                <el-table-column prop="address5"
                                 label="地址">
                </el-table-column>
            </el-table>

        </el-tab-pane>
        <el-tab-pane label="配置管理"
                     name="second">
            <el-table :data="tableData2"
                      v-if="activeName === 'second'"
                      style="width: 100%">
                <el-table-column prop="date"
                                 label="日期"
                                 width="180">
                </el-table-column>
                <el-table-column prop="name"
                                 label="姓名"
                                 width="180">
                </el-table-column>
                <el-table-column prop="address"
                                 label="地址">
                </el-table-column>
                <el-table-column prop="date1"
                                 label="日期"
                                 width="180">
                </el-table-column>
                <el-table-column prop="name1"
                                 label="姓名"
                                 width="180">
                </el-table-column>
                <el-table-column prop="address1"
                                 label="地址">
                </el-table-column>
                <el-table-column prop="date2"
                                 label="日期"
                                 width="180">
                </el-table-column>
                <el-table-column prop="name2"
                                 label="姓名"
                                 width="180">
                </el-table-column>
                <el-table-column prop="address2"
                                 label="地址">
                </el-table-column>
                <el-table-column prop="date3"
                                 label="日期"
                                 width="180">
                </el-table-column>
                <el-table-column prop="name3"
                                 label="姓名"
                                 width="180">
                </el-table-column>
                <el-table-column prop="address3"
                                 label="地址">
                </el-table-column>

                <el-table-column prop="date4"
                                 label="日期"
                                 width="180">
                </el-table-column>
                <el-table-column prop="name4"
                                 label="姓名"
                                 width="180">
                </el-table-column>
                <el-table-column prop="address4"
                                 label="地址">
                </el-table-column>
                <el-table-column prop="date5"
                                 label="日期"
                                 width="180">
                </el-table-column>
                <el-table-column prop="name5"
                                 label="姓名"
                                 width="180">
                </el-table-column>
                <el-table-column prop="address5"
                                 label="地址">
                </el-table-column>
            </el-table>

        </el-tab-pane>
        <el-tab-pane label="角色管理"
                     name="third">
            <el-table :data="tableData3"
                      v-if="activeName === 'third'"
                      style="width: 100%">
                <el-table-column prop="date"
                                 label="日期"
                                 width="180">
                </el-table-column>
                <el-table-column prop="name"
                                 label="姓名"
                                 width="180">
                </el-table-column>
                <el-table-column prop="address"
                                 label="地址">
                </el-table-column>
                <el-table-column prop="date1"
                                 label="日期"
                                 width="180">
                </el-table-column>
                <el-table-column prop="name1"
                                 label="姓名"
                                 width="180">
                </el-table-column>
                <el-table-column prop="address1"
                                 label="地址">
                </el-table-column>
                <el-table-column prop="date2"
                                 label="日期"
                                 width="180">
                </el-table-column>
                <el-table-column prop="name2"
                                 label="姓名"
                                 width="180">
                </el-table-column>
                <el-table-column prop="address2"
                                 label="地址">
                </el-table-column>
                <el-table-column prop="date3"
                                 label="日期"
                                 width="180">
                </el-table-column>
                <el-table-column prop="name3"
                                 label="姓名"
                                 width="180">
                </el-table-column>
                <el-table-column prop="address3"
                                 label="地址">
                </el-table-column>

                <el-table-column prop="date4"
                                 label="日期"
                                 width="180">
                </el-table-column>
                <el-table-column prop="name4"
                                 label="姓名"
                                 width="180">
                </el-table-column>
                <el-table-column prop="address4"
                                 label="地址">
                </el-table-column>
                <el-table-column prop="date5"
                                 label="日期"
                                 width="180">
                </el-table-column>
                <el-table-column prop="name5"
                                 label="姓名"
                                 width="180">
                </el-table-column>
                <el-table-column prop="address5"
                                 label="地址">
                </el-table-column>
            </el-table>
        </el-tab-pane>
        <el-tab-pane label="定时任务补偿"
                     name="fourth">
            <el-table :data="tableData4"
                      v-if="activeName === 'fourth'"
                      style="width: 100%">
                <el-table-column prop="date"
                                 label="日期"
                                 width="180">
                </el-table-column>
                <el-table-column prop="name"
                                 label="姓名"
                                 width="180">
                </el-table-column>
                <el-table-column prop="address"
                                 label="地址">
                </el-table-column>
                <el-table-column prop="date1"
                                 label="日期"
                                 width="180">
                </el-table-column>
                <el-table-column prop="name1"
                                 label="姓名"
                                 width="180">
                </el-table-column>
                <el-table-column prop="address1"
                                 label="地址">
                </el-table-column>
                <el-table-column prop="date2"
                                 label="日期"
                                 width="180">
                </el-table-column>
                <el-table-column prop="name2"
                                 label="姓名"
                                 width="180">
                </el-table-column>
                <el-table-column prop="address2"
                                 label="地址">
                </el-table-column>
                <el-table-column prop="date3"
                                 label="日期"
                                 width="180">
                </el-table-column>
                <el-table-column prop="name3"
                                 label="姓名"
                                 width="180">
                </el-table-column>
                <el-table-column prop="address3"
                                 label="地址">
                </el-table-column>

                <el-table-column prop="date4"
                                 label="日期"
                                 width="180">
                </el-table-column>
                <el-table-column prop="name4"
                                 label="姓名"
                                 width="180">
                </el-table-column>
                <el-table-column prop="address4"
                                 label="地址">
                </el-table-column>
                <el-table-column prop="date5"
                                 label="日期"
                                 width="180">
                </el-table-column>
                <el-table-column prop="name5"
                                 label="姓名"
                                 width="180">
                </el-table-column>
                <el-table-column prop="address5"
                                 label="地址">
                </el-table-column>
            </el-table>
        </el-tab-pane>
    </el-tabs>

</template>

<script>
export default {
    data () {
        return {
            activeName: 'second',
            tableData1: [],
            tableData2: [],
            tableData3: [],
            tableData4: []
        }
    },

    components: {},

    computed: {},

    methods: {
        handleClick (tab, event) {
            console.log(tab, event);
        }
    },
    mounted: function () {
        let i = 0
        while (i < 400) {
            this.tableData1.push({
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄',
                date1: '2016-05-02',
                name1: '王小虎',
                address1: '上海市普陀区金沙江路 1518 弄',
                date2: '2016-05-02',
                name2: '王小虎',
                address2: '上海市普陀区金沙江路 1518 弄',
                date3: '2016-05-02',
                name3: '王小虎',
                address3: '上海市普陀区金沙江路 1518 弄',
                date4: '2016-05-02',
                name4: '王小虎',
                address4: '上海市普陀区金沙江路 1518 弄',
                date5: '2016-05-02',
                name5: '王小虎',
                address5: '上海市普陀区金沙江路 1518 弄',
            })

            this.tableData2.push({
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄',
                date1: '2016-05-02',
                name1: '王小虎',
                address1: '上海市普陀区金沙江路 1518 弄',
                date2: '2016-05-02',
                name2: '王小虎',
                address2: '上海市普陀区金沙江路 1518 弄',
                date3: '2016-05-02',
                name3: '王小虎',
                address3: '上海市普陀区金沙江路 1518 弄',
                date4: '2016-05-02',
                name4: '王小虎',
                address4: '上海市普陀区金沙江路 1518 弄',
                date5: '2016-05-02',
                name5: '王小虎',
                address5: '上海市普陀区金沙江路 1518 弄',
            })
            this.tableData3.push({
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄',
                date1: '2016-05-02',
                name1: '王小虎',
                address1: '上海市普陀区金沙江路 1518 弄',
                date2: '2016-05-02',
                name2: '王小虎',
                address2: '上海市普陀区金沙江路 1518 弄',
                date3: '2016-05-02',
                name3: '王小虎',
                address3: '上海市普陀区金沙江路 1518 弄',
                date4: '2016-05-02',
                name4: '王小虎',
                address4: '上海市普陀区金沙江路 1518 弄',
                date5: '2016-05-02',
                name5: '王小虎',
                address5: '上海市普陀区金沙江路 1518 弄',
            })
            this.tableData4.push({
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄',
                date1: '2016-05-02',
                name1: '王小虎',
                address1: '上海市普陀区金沙江路 1518 弄',
                date2: '2016-05-02',
                name2: '王小虎',
                address2: '上海市普陀区金沙江路 1518 弄',
                date3: '2016-05-02',
                name3: '王小虎',
                address3: '上海市普陀区金沙江路 1518 弄',
                date4: '2016-05-02',
                name4: '王小虎',
                address4: '上海市普陀区金沙江路 1518 弄',
                date5: '2016-05-02',
                name5: '王小虎',
                address5: '上海市普陀区金沙江路 1518 弄',
            })
            i++
        }
    }
}

</script>
<style lang='scss' scoped>
</style>