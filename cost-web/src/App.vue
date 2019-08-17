<template>
  <div id="app" :class="this.themecolor">
    <router-view></router-view>
  </div>
</template>

<script>
import "@/assets/css/theme/index.scss";
import { toggleClass } from "@/utils/common/index";
import {
  Constants,
  setLocalItem,
  getLocalItem,
  removeLocalItem
} from "@/utils/common/cache";
import { LoginPrepare } from "@/config/loginPrepare.js";
export default {
  name: "app",
  data() {
    return {};
  },
  mounted() {
    let cacheColor = getLocalItem(Constants.Theme_Color);
    this.themecolor = cacheColor || this.themecolor;
    toggleClass(document.body, this.themecolor);
    window.loginPrepare = () => {
      LoginPrepare(this.$router, this.$store);
    };
    // console.log(loginPrepare());
    setLocalItem(Constants.CURRENT_MENUID, "CostManager");
  },
  computed: {
    themecolor: {
      get() {
        return this.$store.state.themecolor;
      },
      set(val) {
        this.$store.commit("setThemeColor", val);
      }
    }
  },
  watch: {
    themecolor: {
      handler() {
        toggleClass(document.body, this.themecolor);
      }
    }
  }
};
</script>
<style lang="less">
.v-table-header-row {
  background: #e3e7ec;
}
.custom-4DA1FF .el-input.is-disabled .el-input__inner {
  color: #000000;
}
.v-table-htable {
  font-size: 14px;
}
.v-table-btable {
  font-size: 14px;
}
.el-popper {
  margin-top: 5px !important;
}
.el-table__header-wrapper tr {
  background: #e3e7ec;
}
.el-table [class^="el-icon-"],
.el-table [class*=" el-icon-"] {
  width: 15px;
  font-size: 14px;
}
.el-textarea__inner {
  border-radius: 0;
}
.el-select-dropdown {
  border-radius: 2px;
}
.subTitle {
  padding: 10px;
  display: block; /*不显示子标题*/
}
.breadcrumb-child {
  font-size: 14px;
  font-weight: bold;
  .fa {
    margin: 0 10px 0 2px;
  }
}
.button-area {
  padding: 5px 30px 5px 0;
  text-align: right;
}
.form-unit {
  height: 32px;
  line-height: 32px;
  font-size: 14px;
  background: #f5f7fa;
  margin: 15px 0;
  padding: 0 15px;
}
.pagination_bar {
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: center;
}
.infoEdit {
  float: left;
  width: 60%;
  height: 100%;
  margin-top: 20px;
}

.logoEdit {
  float: left;
  width: 20%;
  height: 100%;
  margin-left: 50px;
  margin-top: 100px;
  text-align: center;
  padding: 0 30px;
}
// 查询区域
.search-area {
  background: #f5f7fa;
  padding: 10px 10px 0;
  margin-bottom: 10px;
  position: relative;
  overflow: hidden;
  .el-form-item--small.el-form-item {
    margin-bottom: 10px;
  }

  .arrow-top {
    position: absolute;
    border-top: 8px transparent dashed;
    border-left: 8px transparent dashed;
    border-right: 8px transparent dashed;
    border-bottom: 8px solid #f5f7fa;
    top: -16px;
    right: 54px;
  }
}

.custom-tree-node {
  -ms-flex: 1;
  flex: 1;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  -ms-flex-pack: justify;
  justify-content: space-between;
  font-size: 12px;
  padding-right: 8px;
}

/*分页居右*/
.el-pagination {
  text-align: right;
}
/*steps定制*/
.custom-4DA1FF {
  /*已完成*/
  .el-step__head.is-finish {
    color: orange;
    border-color: orange;
    .el-step__icon.is-text {
      background: orange;
      color: #ffffff;
    }
  }
  .el-step__title.is-finish {
    color: orange;
  }

  /*已完成 鼠标hover事件*/
  .el-step__head.is-finish:hover {
    color: #248dca;
    border-color: #248dca;
    .el-step__icon.is-text {
      background: #248dca;
      color: #ffffff;
    }
  }
  .el-step__title.is-finish:hover {
    color: #248dca;
  }
  /*在途*/

  .el-step__head.is-process {
    color: gray;
    border-color: gray;
    .el-step__icon.is-text {
      background: gray;
      color: #ffffff;
      .el-dropdown {
        background: gray;
        color: #ffffff;
      }
    }
  }
  .el-step__title.is-process {
    color: gray;
  }

  /*未开始*/
  .el-step__head.is-flex {
    color: gray;
    border-color: gray;
    .el-step__icon.is-text {
      background: gray;
      color: #ffffff;
      .el-dropdown {
        background: gray;
        color: #ffffff;
      }
    }
  }
  .el-step__title.is-flex {
    color: gray;
  }

  /*等待*/
  .el-step__head.is-wait {
    color: gray;
    border-color: gray;
    .el-step__icon.is-text {
      background: gray;
      color: #ffffff;
      .el-dropdown {
        background: gray;
        color: #ffffff;
      }
    }
  }
  .el-step__title.is-wait {
    color: gray;
  }
}

/*在谷歌下移除input[number]的上下箭头*/
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0;
}
/*在firefox下移除input[number]的上下箭头*/
input[type="number"] {
  -moz-appearance: textfield;
}
/* 可编辑表格列必填标记 */
.cost-table-header-required > div:before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}

/* 设置表头的高度 */
#app .el-table--small th {
  padding: 2px 0px;
}

/*金额输入居左*/
#app .el-input-number.is-without-controls .el-input__inner {
  text-align: left;
}
#app .el-dialog__title {
  font-size: 16px;
}

/*菜单*/
.el-menu {
  border-right: none !important;
}
/*高度*/
.el-menu-item,
.el-submenu__title {
  height: 30px !important;
  line-height: 30px !important;
  color: #ccc;
}
.el-aside {
  color: #fff;
}
/*主菜单的样式*/
/*背景色，字色*/
.el-submenu__title {
  color: #fff !important;
  background-color: #3f4f83 !important;
}
/*鼠标悬浮时*/
.el-submenu__title:focus,
.el-submenu__title:hover {
  outline: 0 !important;
  color: #409eff !important;
  background: #3f4f83 !important;
}

/*子菜单样式#1f2d3c*/
/*背景色，字色*/
.el-menu-item {
  color: #fff !important;
  background-color: #2b314d !important;
}
/*鼠标悬浮时*/
.el-menu-item:hover {
  outline: 0 !important;
  color: #0080cb !important;
  background: #dadee2 !important;
}
.el-menu-item.is-active {
  color: #fff !important;
  background: #ffffff !important;
}
</style>
