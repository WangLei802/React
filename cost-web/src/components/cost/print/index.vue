<template>
  <div class="content">
    <div class="title">
      <div class="img">
        <img :src="imgUrl" alt>
      </div>
      <div>设计变更、现场签证指令单</div>
    </div>
    <table style="border-collapse:collapse;" cellpadding="12;" cellspacing="0;" align="center">
      <tr align="left" class="tr">
        <td>公司名称：</td>
        <td></td>
        <td>签证编号：</td>
        <td colspan="2">PRJ0064301-HT-GCSJ-2019-0001</td>
        <!-- <td rowspan="5"></td> -->
      </tr>
      <tr align="left">
        <td class="width">项目名称</td>
        <td style="width: 220px;"></td>
        <td class="width">施工单位名称</td>
        <td style="width: 220px;">基本信息基本信息基本信息</td>
        <!-- <td rowspan="5"></td> -->
      </tr>
      <tr align="left">
        <td>签证名称</td>
        <td></td>
        <td>提出部门</td>
        <td colspan="2"></td>
      </tr>
      <tr align="left">
        <td>合同编码</td>
        <td></td>
        <td>合同名称</td>
        <td colspan="2"></td>
      </tr>
      <tr align="left">
        <td>签证原因</td>
        <td colspan="4"></td>
      </tr>
      <tr align="center">
        <td colspan="5">变更签证内容</td>
      </tr>
      <tr align="left">
        <td>A</td>
        <td colspan="4">撒大大撒旦阿瑟东撒的撒</td>
      </tr>
      <tr align="left">
        <td>B</td>
        <td colspan="4"></td>
      </tr>
      <tr>
        <td colspan="5" style="height:100px"></td>
      </tr>
      <tr align="center">
        <!-- <td colspan="5">项目经验</td> -->
        <td colspan="1">施工单位签名盖章确认</td>
        <td colspan="2">监理公司签名盖章确认</td>
        <td colspan="1">建设单位签名盖章确认</td>
      </tr>
      <tr>
        <td colspan="1" style="height:120px"></td>
        <td colspan="2" style="height:120px"></td>
        <td colspan="1" style="height:120px"></td>
        <!-- <td colspan="5" style="height:100px"></td> -->
      </tr>
    </table>
  </div>
</template>
<script>
export default {
  // props: {
  //   startPlaceholder: {
  //     required: true
  //   },
  //   endPlaceholder: {
  //     required: true
  //   }
  // },
  data() {
    return {
      imgUrl: require("@/assets/img/logo2.png")
    };
  },
  methods: {}
};
</script>
<style scoped>
.content {
  width: 750px;
  margin: 0 auto;
}
td {
  /* width: 160px; */
  height: 30px;
  font-size: 12px;
  font-weight: bold;
}

.head {
  width: 100%;
  height: 100px;
  background: coral;
}

.name_id {
  width: 100%;
  display: flex;
}

table tr td {
  border: 1.5px solid #000;
}

table .tr td {
  border-top: 1px solid #ffffff;
  border-left: 1px solid #ffffff;
  border-right: 1px solid #ffffff;
}

.title {
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  color: #000;
  font-size: 24px;
  font-weight: bold;
  display: flex;
  /* position: relative; */
}

.img {
  /* position: absolute; */
  margin-right: 20px;
  /* width: 100%; */
}
.width {
  width: 150px;
}
</style>