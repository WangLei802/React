<template>
  <div class="content">
    <div class="title">
      <div class="img">
        <img :src="imgUrl" alt>
      </div>
      <div class="title">设计变更、现场签证指令单</div>
    </div>
    <table class="border_collapse bor" cellpadding="5;" cellspacing="0;" align="center">
      <tr align="left" class="td">
        <td class="width td">合同名称</td>
        <td colspan="6">{{queryObj.contractName}}</td>
      </tr>
      <tr align="left" class="td">
        <td class="width td">施工单位名称</td>
        <td colspan="6">{{queryObj.constructionUnit}}</td>
      </tr>
      <tr align="left" class="td">
        <td class="width td">审批单编号</td>
        <td colspan="6">{{queryObj.code}}</td>
      </tr>
      <tr align="left" class="height td">
        <td class="td">变更签证原因</td>
        <td colspan="6">{{queryObj.alterationContent}}</td>
      </tr>
      <tr align="left" class="height td" border="0">
        <td class="td">变更签证内容</td>
        <td colspan="6">
          <table class="wid" cellpadding="0;" cellspacing="0;">
            <tr class="height">
              <td>{{queryObj.variationContent}}</td>
            </tr>
            <tr align="right">
              <td>
                甲方工程师：
                <span class="span"></span>年
                <span class="span"></span>月
                <span class="span"></span>日
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr align="left" class="height td" border="0">
        <td class="td">建设单位</td>
        <td class="td">
          <table align="center" cellpadding="0;" cellspacing="0;">
            <tr class="height">
              <td></td>
            </tr>
            <tr align="right">
              <td>项目经理：（盖章、签字）</td>
            </tr>
          </table>
        </td>
        <td class="td" align="center">监理单位</td>
        <td class="td">
          <table align="center" cellpadding="0;" cellspacing="0;">
            <tr class="height">
              <td></td>
            </tr>
            <tr align="right">
              <td>（盖章、签字）</td>
            </tr>
          </table>
        </td>
        <td class="td" align="center">施工单位</td>
        <td class="td">
          <table align="center" cellpadding="0;" cellspacing="0;">
            <tr class="height">
              <td></td>
            </tr>
            <tr align="right">
              <td>项目经理：（盖章、签字）</td>
            </tr>
          </table>
        </td>
      </tr>
      <td colspan="5">注：本单由项目部主办，一式四份：项目部、监理、施工单位、成本部各一份</td>
    </table>
  </div>
</template>
<script>
export default {
  props: {
    print: {
      type: Object
    }
  },
  data() {
    return {
      queryObj: this.print,
      imgUrl: require("@/assets/img/logo2.png")
    };
  },
  methods: {}
};
</script>
<style scoped>
.content {
  width: 800px;
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
.bor{
  margin-top: 20px;
}
.td {
  border: 1.5px solid #000;
}

.td1 {
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
  /* display: flex; */
  /* position: relative; */
}

.img {
  /* position: absolute; */
  margin-right: 20px;
  width: 100px;
  /* width: 100%; */
}

.img  img{
  width: 100%;
}


.width {
  width: 15%;
}

.height {
  height: 200px;
}

.border_collapse {
  width: 100%;
  border: 0;
  border-collapse: collapse;
}

.wid {
  width: 100%;
}

.span {
  display: inline-block;
  width: 40px;
}
</style>