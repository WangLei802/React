<template>
    <el-select v-model='myValue'
               :placeholder="placeholder"
               :multiple="multiple"
               :clearable="clearable"
               :disabled="disabled"
               @change="handleChange"
               size="mini">
        <el-option v-for='item in selectData'
                   :key='item.dictValue'
                   :label='$checkLocaleIsCn() ? item.dictLabelCn : item.dictLabelEn'
                   :value='item.dictValue'>
        </el-option>
    </el-select>
</template>
<script>
import { getLocalItem, setLocalItem, removeLocalItem } from '@/utils/common/cache'
import { getDictionaryDataList } from '@/api/sys/dictionaryAPI'
export default {
    name: 'DictionarySelect',
    data: function () {
        return {
            myValue: this.value,
            baseData: [],
            selectData: []
        }
    },
    props: {
        value: {
            required: true
        },
        type: String,
        subType: String,
        placeholder: {
            type: String,
            default: ''
        },
        multiple: Boolean,
        clearable: Boolean,
        disabled: Boolean
    },
    mounted () {
        if (this.type) {
            this.getDictionaryListByType(this.type)
        }
    },
    methods: {
        handleChange (event) {
            this.$emit('change', event)
        },
        initSelectData () {
            console.log('initSelectData')
            if (this.subType) {
                let sub = this.baseData.find(item => item.dictValue === this.subType)
                if (sub) {
                    this.selectData = sub.children
                } else {
                    this.selectData = []
                }
            } else {
                this.selectData = this.baseData
            }
        },
        getDictionaryListByType (type) {
            let cacheData = getLocalItem(type)
            if (!cacheData) {
                getDictionaryDataList({ 'dictType': type }).then(response => {
                    if (response.data) {
                        setLocalItem(type, response.data)
                        this.baseData = response.data
                        this.initSelectData()
                    }
                }).catch(error => {
                    console.log(error)
                })
            } else {
                this.baseData = cacheData
                this.initSelectData()
            }

        }
    },
    watch: {
        value: function (val) {
            this.myValue = val
        },
        subType: function (val) {
            this.initSelectData()
        },
        myValue: function (val) {
            this.$emit('input', val) // 触发 input 事件，并传入新值
        }
    }
}
</script>



