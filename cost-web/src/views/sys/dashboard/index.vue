<template>
    <div class="dashboard-container"
         style="margin:0">
        <!-- <div class="button-area" style="top:-56px; z-index:99;color:#606266" v-if="isAdmin" >
      <el-button class="ordinary-btn" icon='el-icon-plus' type='primary' @click="addWidgets">{{this.$l("lbl_dashboard_use_add")}}</el-button>
      <el-button class="ordinary-btn" icon='el-icon-delete' type='primary' @click="deleteDashboard" v-if="false">{{this.$l("lbl_dashboard_use_delete")}}</el-button>
      <el-button class="ordinary-btn" icon='el-icon-back' type='primary' @click="backDashboard" v-show="role">{{this.$l("lbl_dashboard_use_back")}}</el-button>
    </div> -->
        
        <!-- 选择widget -->
        <el-dialog v-if="flag" :title="this.$l('lbl_widget_list')"
                   :visible.sync="dialogWidgetsSelect"
                   :modal="true"
                   :lock-scroll="true">
            <el-form :inline="true"
                     class="demo-form-inline"
                     :model="widgetQueryModel"
                     style="text-align:center">
                <el-form-item>
                    <el-form-item>
                        <el-input v-model="widgetQueryModel.name"
                                  :placeholder='this.$ls("lbl_widget_name")'></el-input>
                    </el-form-item>
                    <el-form-item>
                        <f-button class="special-btn"
                                  type='primary'
                                  @click='searchWidget'
                                  label="btn_search"></f-button>
                    </el-form-item>
                </el-form-item>
                <el-row style="max-height:220px;overflow:auto">
                    <el-col :span="6"
                            v-for="(item, index) in widgetList"
                            :key="index"
                            :offset="index%3===0 ? 0 : 3"
                            class="selectWidgetItem">
                        <el-card :body-style="{ padding: '0px' }">

                            <el-row>
                                <el-col :span="16"
                                        style="padding:5px;overflow:hidden;">
                                    {{item.name}}
                                </el-col>
                                <el-col :span="8"
                                        style="padding:5px;">
                                    <el-button @click="addSelectWidget(item)"
                                               style="float: right; padding: 3px"
                                               type="text">添加</el-button>
                                </el-col>
                            </el-row>
                            <div class="text item">
                                <el-row style="text-align:center">
                                    <img :src="item.shortCut"
                                         style="width:180px;height:100px;" />
                                </el-row>
                                <el-row style="padding:10px;">
                                    <fd-label :code="item.widgetType"
                                              type="sys_widget_type"></fd-label>{{item.des}}
                                </el-row>
                            </div>

                        </el-card>
                    </el-col>
                </el-row>
            </el-form>
        </el-dialog>

        <!-- dashboard -->
        <div v-if="flag" class="clear widgetsContainer">
            <draggable @update="datadragEnd"
                       :options="{disabled:disabled,chooseClass:'choose',animation:150,ghostClass:'ghostClass',dragClass:'dragClass'}">
                <transition-group>
                    <fd-widget-container v-for="(item,index) in widgets"
                                         :id="item.config.position"
                                         @change-prop="changeProp($event,index)"
                                         @refresh="refresh($event,index)"
                                         @change-chart-type="changeChartType($event,index)"
                                         :key="index"
                                         :title="item.name"
                                         :color="item.config.color"
                                         :mini="item.config.mini"
                                         :refreshButtonEnable="item.config.refreshButtonEnable"
                                         :miniButtonEnable="item.config.miniButtonEnable"
                                         :fullScreenButtonEnable="item.config.fullScreenButtonEnable"
                                         :closeButtonEnable="item.config.closeButtonEnable">
                        <div v-if="item.status.toString()!=='0'"
                             class="widgetDisabled">
                            <fd-label :code="item.status"
                                      type="sys_widget_status"></fd-label>
                        </div>
                        <fd-widget :type="item.widgetType"
                                   :dataType="item.dataType"
                                   :data="item.dataContent"
                                   v-if="item.config.reload&&item.status.toString()==='0'" />
                    </fd-widget-container>
                </transition-group>
            </draggable>
        </div>
        <div class="img_box">
            <img :src="src" alt="">
        </div>
    </div>
</template>

<script>
import fdWidget from "../dashboardManage/widgets/fd-widget";
import fdWidgetContainer from "../dashboardManage/widgets/fd-widgetContainer";

import draggable from "vuedraggable";
import Sortable from "sortablejs";

import { LoadingUtil } from "@/utils/common/LoadingUtil";
import { mapGetters } from "vuex";
import { getMeProfile } from "@/api/sys/userAPI";
import {
  getDashboardDetail,
  updateDashboardWidgetInfo,
  deleteDashboard
} from "@/api/sys/dashboardManageAPI";
import {
  getUserDashboard,
  saveUserDashboard,
  updateUserDashboardWidgetInfo,
  deleteUserDashboard
} from "@/api/sys/dashboardUserManageAPI";
import { searchWidgetList } from "@/api/sys/widgetManageAPI";
import { getLocalItem, Constants } from "@/utils/common/cache";
export default {
  name: "dashboard",
  computed: {
    ...mapGetters(["name", "roles"])
  },
  data() {
    return {
      flag:false,
      themeColor: "",
      isSystemEdit: false,
      dialogWidgetsSelect: false,
      disabled: false,
      role: "",
      isAdmin: false,
      src: require("@/assets/img/default.13e643d.png"),
      imgObj: [
        require("@/assets/widget/pie.png"),
        require("@/assets/widget/line.png"),
        require("@/assets/widget/bar.png"),
        require("@/assets/widget/histogram.png"),
        require("@/assets/widget/table.png"),
        require("@/assets/widget/define.png")
      ],
      vm: {
        id: "",
        userName: "",
        nickName: "",
        mobile: "",
        version: "",
        status: "",
        avatar: ""
      },
      widgetQueryModel: {
        name: "",
        moduleType: "",
        widgetType: "",
        dataType: "",
        status: "",
        pageNum: 1,
        pageSize: 1000,
        sortBy: "id",
        order: -1
      },
      dashboardModel: {
        id: "",
        title: "",
        des: "",
        type: "",
        relateId: "",
        layoutType: "",
        isDefault: "0",
        version: ""
      },
      widgetList: [],
      widgets: [],
      postWidgets: []
    };
  },
  mounted: function() {
    this.isAdmin =
      (JSON.parse(getLocalItem("USER_INFO")) || {}).username === "admin";
    LoadingUtil.showLoading();
    this.themeColor = this.getThemeColor();
    this.role = this.$route.query.role;
    if (this.role) {
      this.isSystemEdit = true;
    } else {
      this.isSystemEdit = false;
    }
    this.dashboardModel.id = this.$route.query.id ? this.$route.query.id : "0";
    getMeProfile()
      .then(response => {
        this.vm = response.data;
      })
      .catch(error => {
        console.log(error);
      });

    // 获取用户dashboard
    this.getDashboard();
    LoadingUtil.hideLoading();
  },
  watch: {
    widgets: {
      handler(newValue, oldValue) {
        for (let i = 0; i < newValue.length; i++) {
          newValue[i].config.position = i;
        }
      },
      deep: true
    }
  },
  methods: {
    getThemeColor() {
      let theme = getLocalItem(Constants.Theme_Color);
      if (theme) {
        theme = "#" + theme;
        theme = theme.replace("custom-", "");
      } else {
        theme = "";
      }
      return theme;
    },
    getDefaultConfig(i) {
      return {
        position: i || this.widgets.length,
        color: this.getThemeColor(),
        mini: false,
        refreshButtonEnable: true,
        miniButtonEnable: true,
        reload: true,
        fullScreenButtonEnable: true,
        closeButtonEnable: true
      };
    },
    handleDashboardData(response) {
      if (!response.data) return;
      this.dashboardModel.id = response.data.id;
      this.dashboardModel.title = response.data.title;
      this.dashboardModel.des = response.data.des;
      this.dashboardModel.type = response.data.type; // 1system,2user
      this.dashboardModel.relateId = response.data.relateId;
      this.dashboardModel.layoutType = response.data.layoutType;
      this.dashboardModel.isDefault = response.data.isDefault;
      this.dashboardModel.version = response.data.version;

      if (!response.data.widgetList) return;
      this.widgets = response.data.widgetList;
      this.widgets.map(item => {
        try {
          item.config = JSON.parse(item.config);
        } catch (err) {
          item.config = this.getDefaultConfig();
        }
        item.widgetType = this.widgetType_to_name(item.widgetType);
      });
      this.widgets = this.widgets.sort(function(item1, item2) {
        return item1.config.position > item2.config.position;
      });
    },
    getDashboard(cb) {
      if (!this.isSystemEdit || this.role === "2") {
        getUserDashboard()
          .then(response => {
            this.handleDashboardData(response);
            if (cb) this.saveDashboardWidget(cb);
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        getDashboardDetail(this.dashboardModel.id)
          .then(response => {
            this.handleDashboardData(response);
            if (cb) this.saveDashboardWidget(cb);
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    saveDashboardWidget(cb) {
      let _param = {
        dashboardId: this.dashboardModel.id,
        widgetPositionList: []
      };
      for (var i = 0; i < this.postWidgets.length; i++) {
        let _item = this.postWidgets[i];
        let _configObj = _item.config;
        let _config = {
          position: _configObj.position,
          color: _configObj.color,
          mini: _configObj.mini,
          refreshButtonEnable: _configObj.refreshButtonEnable || true,
          miniButtonEnable: _configObj.miniButtonEnable || true,
          reload: true,
          fullScreenButtonEnable: _configObj.fullScreenButtonEnable || true,
          closeButtonEnable: _configObj.closeButtonEnable || true
        };
        _param.widgetPositionList.push({
          config: JSON.stringify(_config),
          widgetId: _item.id
        });
      }
      if (this.isSystemEdit && this.role === "1") {
        updateDashboardWidgetInfo(_param)
          .then(response => {
            if (cb) this.getDashboard();
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        updateUserDashboardWidgetInfo(_param)
          .then(response => {
            if (cb) this.getDashboard();
          })
          .catch(error => {
            console.log(error);
          });
      }
      _param = null;
    },
    saveDashboardDetail() {
      // 系统dashboard
      if (this.dashboardModel.type === "1" && !this.isSystemEdit) {
        // 新增
        let _userDashboardInfo = JSON.parse(
          JSON.stringify(this.dashboardModel)
        );
        _userDashboardInfo.id = "";
        _userDashboardInfo.type = "2";
        _userDashboardInfo.relateId = this.vm.id; // 用户id
        _userDashboardInfo.title = this.vm.nickName + "的Dashboard";
        saveUserDashboard(_userDashboardInfo)
          .then(response => {
            this.getDashboard(true);
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        this.saveDashboardWidget();
      }
    },
    deleteDashboard() {
      if (this.isSystemEdit && this.role === "1") {
        deleteDashboard(this.dashboardModel.id)
          .then(response => {
            this.getDashboard();
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        deleteUserDashboard(this.dashboardModel.id)
          .then(response => {
            this.getDashboard();
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    searchWidget() {
      LoadingUtil.showLoading();
      searchWidgetList(this.widgetQueryModel)
        .then(response => {
          LoadingUtil.hideLoading();
          response.data.content.map(item => {
            item.updateDate = new Date(item.updateDate).format();
            item.shortCut = this.imgObj[item.widgetType];
          });

          this.widgetList = response.data.content;
          this.widgetQueryModel.count = response.data.totalElements;
        })
        .catch(error => {
          console.log(error);
        });
    },
    backDashboard() {
      this.$router.push({
        name: "DashboardList"
      });
    },
    addWidgets() {
      this.dialogWidgetsSelect = true;
      this.searchWidget();
    },
    widgetType_to_name(type) {
      let typeName = "";
      switch (type.toString()) {
        case "0":
          typeName = "pie";
          break;
        case "1":
          typeName = "line";
          break;
        case "2":
          typeName = "bar";
          break;
        case "3":
          typeName = "histogram";
          break;
        case "4":
          typeName = "table";
          break;
        case "5":
          typeName = "define";
          break;
        default:
          typeName = "define";
          break;
      }
      return typeName;
    },
    addSelectWidget(obj) {
      let _f = this.widgets.filter(item => {
        return item.id === obj.id;
      });
      if (_f.length > 0) {
        this.$showError("the_widget_exisits");
        return;
      }

      let _c = {
        id: obj.id,
        status: obj.status,
        name: obj.name,
        data: obj.data,
        dataContent: obj.dataContent || null,
        widgetType: this.widgetType_to_name(obj.widgetType),
        dataType: obj.dataType, // obj.dataType //1/html,2/json/,3api
        config: {
          position: this.widgets.length + 1,
          color: this.getThemeColor(),
          mini: false,
          refreshButtonEnable: true,
          miniButtonEnable: true,
          reload: true,
          fullScreenButtonEnable: true,
          closeButtonEnable: true
        }
      };
      this.widgets.push(_c);
      this.postWidgets = this.widgets;
      this.saveDashboardDetail();
      this.dialogWidgetsSelect = false;
    },
    changeChartType(widType, index) {
      // let _widget = this.widgets[index];
      // _widget.widgetType = widType.value;
      // Vue.set(this.widgets, index, _widget);
      this.widgets[index]["widgetType"] = widType.value;
    },
    refresh: function(event, index) {
      this.widgets[index].config.reload = false;
      let _this = this;
      setTimeout(function() {
        _this.widgets[index].config.reload = true;
      }, 10);
    },
    deleteWidget(index) {
      this.widgets.splice(index, 1);
      this.postWidgets = this.widgets;
      this.saveDashboardDetail();
    },
    changeProp(prop, index) {
      console.info(prop, index);
      this.widgets[index].config[prop.key] = prop.value;
      // 0正常 1删除 2停用 3冻结
      if (prop.key === "status" && prop.value === "1") {
        this.postWidgets = this.widgets;
        this.deleteWidget(index);
      } else {
        this.postWidgets = this.widgets;
        this.saveDashboardDetail();
      }
    },
    swapItems: function(arryData, index, tindex) {
      console.log(JSON.stringify(arryData));
      let arr = JSON.parse(JSON.stringify(arryData));
      // index是当前元素下标，tindex是拖动到的位置下标
      // 如果当前元素在拖动目标位置的下方，先将当前元素从数组拿出，数组长度-1，我们直接给数组拖动目标位置的地方新增一个和当前元素值一样的元素，
      // 我们再把数组之前的那个拖动的元素删除掉，所以要len+1
      if (index > tindex) {
        arr.splice(tindex, 0, arr[index]);
        arr.splice(index + 1, 1);
      } else {
        // 如果当前元素在拖动目标位置的上方，先将当前元素从数组拿出，数组长度-1，我们直接给数组拖动目标位置+1的地方新增一个和当前元素值一样的元素，
        // 这时，数组len不变，我们再把数组之前的那个拖动的元素删除掉，下标还是index
        arr.splice(tindex + 1, 0, arr[index]);
        arr.splice(index, 1);
      }
      let positionIndex = 0;
      arr.map(item => {
        item.config.position = positionIndex;
        positionIndex++;
      });
      try {
        this.$set("widgets", arr);
      } catch (err) {
        console.log(err);
      }
      this.postWidgets = arr;
      // this.widgets = arr;
      console.log(JSON.stringify(arr));
    },
    datadragEnd(evt) {
      console.log("拖动前的索引 :" + evt.oldIndex);
      console.log("拖动后的索引 :" + evt.newIndex);
      if (evt.newIndex > evt.oldIndex) {
        // 向后
        this.swapItems(this.widgets, evt.oldIndex, evt.newIndex);
      } else {
        // 向前
        this.swapItems(this.widgets, evt.oldIndex, evt.newIndex);
      }
      this.saveDashboardDetail();
    },
    getProps: function() {
      this.widgets.map(item => {
        console.log(item);
        console.log(this.$refs.widget0.id);
      });
    }
  },
  components: {
    draggable,
    Sortable,

    fdWidget,
    fdWidgetContainer
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-container {
  position: relative;
}
.el-col {
  margin-bottom: 10px;
}
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
  &-add_widget {
    float: left;
    width: 300px;
    height: 100px;
    line-height: 100px;
    margin: 10px;
    border: 1px dashed #cccccc;
    text-align: center;
    background-color: rgb(248, 248, 234);
  }
  &-add_widget_text {
    font-size: 28px;
    letter-spacing: 5px;
    color: #cccccc;
  }
}

.ghostClass {
  border: 1px dashed #000;
  cursor: move;
}
.dragClass {
  cursor: move;
}
.choose {
  cursor: move;
}
.clear {
  width: 100%;
  clear: both;
}
.widgetsContainer {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
}
.widget {
  width: 30%;
  float: left;
  margin: 10px;
}
.widget:hover {
  /* cursor: move; */
}
.selectWidgetItem {
  text-align: left;
}
.selectWidgetItem:hover {
  font-weight: bold;
}
.img_box {
  margin: 0px;
  text-align: center;
  padding-top: 40px;
  box-sizing: border-box;
}
.img_box img {
  width: 90%;
  //   height: 100%;
}
</style>
