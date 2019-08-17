<!-- 科目编码 -->
<template>
    <div style="width:100%">
        {{familyCode}}
        <el-input v-model.trim="lastCode"
                  @change="updateValue"
                  @blur="blurEvent"
                  :placeholder="placeholder"
                  :style="{'vertical-align':'middle','border-radius':'2px','width':'50px','border':lastCode.length === 0 ? '1px solid red' :''}"></el-input>
    </div>
</template>

<script>
export default {
    name: 'CodeInput',
    props: {
        value: {
            type: [String],
            required: true
        },
        placeholder: {
            type: [String],
            required: false,
            default: ''
        }
    },
    data: function () {
        return {
            lastCode: '',
            familyCode: ''
        }
    },
    mounted: function () {
        this.initValue()
    },
    methods: {
        initValue () {
            const codeArray = this.value.split('.')
            this.lastCode = codeArray[codeArray.length - 1]
            if (this.lastCode) this.lastCode = this.lastCode.replace('xx', '')
            this.familyCode = this.value.substring(0, this.value.length - this.lastCode.length)
            if (this.familyCode) this.familyCode = this.familyCode.replace('xx', '')
        },
        updateValue () {
            const _fullCode = this.familyCode + this.lastCode
            this.$emit('input', _fullCode)
            // this.$emit('blur')
        },
        blurEvent () {
            const _fullCode = this.familyCode + this.lastCode
            this.$emit('blur', _fullCode)
        }
    },
    watch: {
        value: function (newValue, oldValue) {
            this.initValue()
        }
    }
}

</script>
<style lang='scss' scoped>
</style>