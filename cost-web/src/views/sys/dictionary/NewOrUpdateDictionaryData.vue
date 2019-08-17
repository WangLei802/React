<template>
    <div>
        <el-row>
            <el-form :model="dictionaryDataModel"
                     status-icon
                     :rules='rules'
                     ref="dictionaryData"
                     label-width='150px'>
                <el-col :span="4"
                        style='margin-top: 10px;'>
                    <div class="logoEdit">
                        <f-image-upload height='150px'
                                        v-model="dictionaryDataModel.picture"
                                        width='50px'
                                        @deleteAvatar="deleteAvatar"></f-image-upload>
                    </div>
                </el-col>
                <el-col :span="20"
                        style='margin-top: 10px;'>
                    <el-col :span="12">
                        <el-form-item :label='this.$ls("lbl_dict_type")'>
                            <span class='el-input'>{{dictionaryDataModel.dictType}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label='上级字典数据'>
                            <el-input v-model="dictName"
                                      disabled="disabled"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item :label='this.$ls("lbl_label_cn")'
                                      prop="dictLabelCn">
                            <el-input v-model='dictionaryDataModel.dictLabelCn'
                                      :placeholder='this.$l("lbl_label_cn")'
                                      :maxlength="50"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item :label='this.$ls("lbl_label_en")'
                                      prop="dictLabelEn">
                            <el-input v-model='dictionaryDataModel.dictLabelEn'
                                      :placeholder='this.$l("lbl_label_en")'
                                      :maxlength="50"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item :label='this.$ls("lbl_value")'
                                      prop="dictValue">
                            <el-input v-model='dictionaryDataModel.dictValue'
                                      :placeholder='this.$l("lbl_value")'
                                      :maxlength="20"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item :label='this.$ls("lbl_dict_level")'
                                      prop="dictLevel">
                            <el-input v-model="dictionaryDataModel.dictLevel"
                                      :placeholder='this.$l("lbl_dict_level")'
                                      :maxlength="2"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item :label='this.$ls("lbl_sort")'
                                      prop="treeSort">
                            <el-input v-model='dictionaryDataModel.treeSort'
                                      :placeholder='this.$l("lbl_sort")'
                                      :maxlength="2"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label='this.$ls("lbl_is_sys")'
                                      prop="isSys">
                            <fd-radio v-model='dictionaryDataModel.isSys'
                                      :placeholder='this.$l("lbl_is_sys")'
                                      type="sys_yes_no"></fd-radio>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item :label='this.$ls("lbl_remark")'
                                      prop="remarks">
                            <el-input type='textarea'
                                      v-model='dictionaryDataModel.remarks'
                                      :placeholder='this.$l("lbl_remark")'
                                      :maxlength="200"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24"
                            class="detail-button-box">
                        <el-button type='primary'
                                   @click='onSubmit("dictionaryData")'
                                   :disabled="disInput">{{this.$l('btn_save')}}</el-button>
                        <el-button @click='cancel'>{{this.$l('btn_back')}}</el-button>
                    </el-col>
                </el-col>
            </el-form>
        </el-row>
    </div>
</template>
<script >
import { updateDictionaryData, createDictionaryData, getDictionaryDataDetail } from '@/api/sys/dictionaryAPI'
import { ptn } from '@/utils/common/validate'
export default {
    mounted: function () {
        this.dictionaryDataModel.dictType = this.$route.query.dictType
        this.dictionaryDataModel.id = this.$route.query.id ? this.$route.query.id : ''

        var that = this

        if (this.dictionaryDataModel.id !== '') {
            getDictionaryDataDetail(this.dictionaryDataModel.id).then(response => {
                that.dictionaryDataModel = response.data
                if (response.data.dictLevel === undefined || response.data.dictLevel === null || response.data.dictLevel === '') {
                    that.dictionaryDataModel.dictLevel = 1
                }
            }).catch(error => {
                console.log(error)
            })
        }
    },
    data () {
        return {
            rules: {
                dictLabelCn: [{ pattern: ptn.all_match(1, 50), message: this.$l('msg_dict_labelcn'), required: true, trigger: 'blur' }],
                dictLabelEn: [{ pattern: ptn.all_match(1, 50), message: this.$l('msg_dict_labelen'), required: true, trigger: 'blur' }],
                dictValue: [{ pattern: ptn.all_match(1, 20), message: this.$l('msg_dict_value'), required: true, trigger: 'blur' }],
                remarks: [{ pattern: ptn.all_match(0, 200), message: this.$l('msg_remark'), trigger: 'blur' }],
                treeSort: [{ pattern: ptn.positive_interger(), message: this.$l('msg_tree_sort'), trigger: 'blur' }],
                //dictLevel: [{ pattern: ptn.positive_interger(), message: this.$l('msg_tree_sort'), trigger: 'blur' }]
            },
            disInput: false,
            dictName: '',
            dictionaryDataModel: {
                id: '',
                dictType: '',
                dictLabelCn: '',
                dictLabelEn: '',
                dictValue: '',
                status: '',
                isSys: '1',
                updateTime: '',
                remarks: '',
                parentId: '-1',
                code: '',
                picture: '',
                dictLevel: '',
                treeSort: ''
            },
            isAvatarDelete: false
        }
    },
    created: function () {
        if (this.$route.query.parentId !== undefined) {
            this.dictionaryDataModel.parentId = this.$route.query.parentId
        }
        if (this.$route.query.parentName !== undefined) {
            this.dictName = this.$route.query.parentName
        }
    },
    methods: {
        deleteAvatar (isAvatarDelete) {
            this.isAvatarDelete = isAvatarDelete
        },
        onSubmit (formName) {
            this.dictionaryDataModel.treeSort = this.dictionaryDataModel.treeSort + ''
            if (this.dictionaryDataModel.treeSort === '') {
                this.dictionaryDataModel.treeSort = null
            }
            if (this.dictionaryDataModel.dictLevel === '') {
                this.dictionaryDataModel.dictLevel = null
            }
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.dictionaryDataModel.id = this.$route.query.id ? this.$route.query.id : ''
                    this.disInput = true
                    if (this.dictionaryDataModel.id === '') {
                        console.log(this.dictionaryDataModel)
                        createDictionaryData(this.dictionaryDataModel)
                            .then(response => {
                                this.$router.push({
                                    name: 'DictionaryDataList',
                                    query: { dictType: this.dictionaryDataModel.dictType }
                                })
                                this.disInput = false
                                this.$showSuccess(response.message)
                            })
                            .catch(error => {
                                this.disInput = false
                                console.log(error)
                            })
                    } else {
                        updateDictionaryData(this.dictionaryDataModel)
                            .then(response => {
                                this.$router.push({
                                    name: 'DictionaryDataList',
                                    query: { dictType: this.dictionaryDataModel.dictType }
                                })
                                this.disInput = false
                                this.$showSuccess(response.message)
                            })
                            .catch(error => {
                                this.disInput = false
                                console.log(error)
                            })
                    }
                } else {
                    if (this.dictionaryDataModel.treeSort === null) {
                        this.dictionaryDataModel.treeSort = ''
                    }
                    if (this.dictionaryDataModel.dictLevel === null) {
                        this.dictionaryDataModel.dictLevel = ''
                    }
                }
            })
        },
        cancel () {
            this.$router.push({
                name: 'DictionaryDataList',
                query: { dictType: this.dictionaryDataModel.dictType }
            })
        }
    }
}
</script>
<style scoped>
@import '../../../styles/detail.scss';
</style>
