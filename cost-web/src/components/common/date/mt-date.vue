<template>
  <div  ref="date">
    <el-col :span="6">
      <el-form-item :label='this.$ls("lbl_start_time")'>
        <el-date-picker
          class="start-time"
          v-model="startTime"
          type="datetime"
          placeholder="开始时间"
          default-time="12:00:00" :start-placeholder="startPlaceholder"
          @change="changeStartTime">
        </el-date-picker>
      </el-form-item>
    </el-col>
    <el-col :span="6">
      <el-form-item :label='this.$ls("lbl_end_time")'>
        <el-date-picker
          class="end-time"
          v-model="endTime"
          type="datetime"
          placeholder="结束时间"
          default-time="12:00:00" :end-placeholder="endPlaceholder"
          @change="changeEndTime">
        </el-date-picker>
      </el-form-item>
    </el-col>
  </div>
</template>
<script>
  export default{
    props: {
      startPlaceholder: {
        required: true
      },
      endPlaceholder: {
        required: true
      }
    },
    data() {
      return {
        startTime: '',
        endTime: ''
      }
    },
    methods: {
      changeStartTime(val) {
        if (this.endTime < val && this.endTime && val) {
          this.$message.error('起始时间必须小于结束时间，请重新选择')
          this.startTime = ''
          return
        }
        this.$emit('timeChoose', val, 0)
      },
      changeEndTime(val) {
        if (val < this.startTime && val) {
          this.$message.error('结束时间必须大于于起始时间，请重新选择')
          this.endTime = ''
          return
        }
        this.$emit('timeChoose', val, 1)
      }
    }
  }

</script>
<style>
  .el-date-editor.el-input.el-input--mini.el-input--prefix.el-date-editor--datetime{
    width:168px;
  }
  @media only screen and (min-width: 1200px) {
    .start-time{
      margin-right:5px;
    }
    .end-time{
      margin-left:5px;
    }
  }

</style>

