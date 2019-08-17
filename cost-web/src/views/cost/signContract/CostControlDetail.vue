<!-- StandaredSubjectList.vue -->
<template>
    <div class="app-container">
        <div class="subTitle">
            <div class="breadcrumb-child">
                <i class="fa fa-folder-open-o"></i>费控合同信息
                <el-button size="mini"
                           @click="goback">{{$l("btn_back")}}</el-button>
            </div>

        </div>
        <el-form :inline="true"
                 ref="form"
                 :model="form"
                 label-width="120px"
                 size="mini">
            <el-row>
                <el-col :span="8">
                    <el-form-item :label="'项目编号'">
                        <el-input v-model="form.projectCode"
                                  placeholder="请输入内容"
                                  :disabled="true"></el-input>

                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label="'项目名称'">
                        <el-input v-model="form.projectName"
                                  placeholder="请输入内容"
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label="'合同编号'">
                        <el-input v-model="form.contractCode"
                                  placeholder="请输入内容"
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label="'合同名称'">
                        <el-input v-model="form.contractName"
                                  placeholder="请输入内容"
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label="'签约金额(元)'">
                        <el-input v-model="form.contractAmountIncludeTax"
                                  placeholder="请输入内容"
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label="'成本分摊金额(元)'">
                        <el-input v-model="form.sharedAmountByCostSystem"
                                  placeholder="请输入内容"
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label="'签约供方名称'">
                        <el-input v-model="form.signProviderName"
                                  placeholder="请输入内容"
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label="'签约供方编码'">
                        <el-input v-model="form.signProviderCode"
                                  placeholder="请输入内容"
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label="'签约日期'">
                        <el-input v-model="form.contractName"
                                  placeholder="请输入内容"
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

    </div>
</template>

<script>
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import { getCostControl } from '@/api/cost/signContractAPI'

import COSTENUM from '@/utils/cost/enum'
export default {
    data () {
        return {
            form: {
                projectCode: '',
                projectName: '',
                contractName: '',
                contractAmountIncludeTax: '',
                sharedAmountByCostSystem: '',
                signProviderName: '',
                signProviderCode: ''
            }
        }
    },

    mounted () {
        this.getContractData()
    },

    methods: {
        goback () {
            this.$router.push({
                name: 'ContractSignPrimaryList'
            })
        },
        getContractData () {
            let queryObj = {
                id: this.$route.query.contractId
            }
            getCostControl(queryObj)
                .then(response => {
                    LoadingUtil.hideLoading()

                    if (response.code === '2000') {
                        this.form.projectName = response.data.projectName
                        this.form.projectCode = response.data.projectCode
                        this.form.contractName = response.data.contractName
                        this.form.contractAmountIncludeTax = response.data.contractAmountIncludeTax
                        this.form.sharedAmountByCostSystem = response.data.sharedAmountByCostSystem
                        this.form.signProviderName = response.data.signProviderName
                        this.form.signProviderCode = response.data.signProviderCode
                    }
                })
                .catch(error => {
                    console.log(error)
                    this.$showError(error.message ? error.message : 'msg_system_error')
                })
        }

    }
}

</script>
<style scoped>
@import '../../../styles/list.scss';
.el-form-item__content .el-input {
  width: 220px;
}
.subTitle {
  margin-bottom: 20px;
}
.ordinary-btn {
  float: right;
}
</style>
