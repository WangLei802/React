/*
<DictionaryLabel type="cost_ineffective_type"
                         :subType="topType1"
                         :code="subType1" />
                         type字典类型
                         subType字典选择的子级id
                         code 子节下拉的选中值
 */
<template>
    <div>
        <div>{{labelText}}</div>
    </div>
</template>
<script>
import { getLocalItem, setLocalItem, removeLocalItem } from '@/utils/common/cache'
import { getDictionaryDataList } from '@/api/sys/dictionaryAPI'
export default {
    name: 'DictionaryLabel',
    data: function () {
        return {
            labelText: ''
        }
    },
    props: {
        type: String,
        subType: String,
        code: String
    },
    mounted () {
        if (this.type && this.subType && this.code) {
            this.getDictionaryListByType(this.type)
        }
    },
    methods: {
        initValue () {
            let item = this.selectData.find(item => item.dictValue === this.code)
            if (item) {
                this.labelText = item.dictLabelCn
            } else {
                this.labelText = ''
            }
        },
        initSelectData () {
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
            this.initValue()
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
        code: function () {
            this.getDictionaryListByType(this.type)
        }
    }
}
</script>


