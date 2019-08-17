<template>
    <div class="login-container">
        <div class="pic-logbg">
            <img class="pic-404__parent"
                 :src="login_bg"
                 alt="">

        </div>
        <div class="logininfo">
            <div class="loging">{{vm.companyName}} {{vm.systemName}}</div>
            <el-form autoComplete="on"
                     :model="loginForm"
                     :rules="loginRules"
                     ref="loginForm"
                     label-position="left"
                     label-width="0px"
                     class="card-box login-form"
                     size="medium">
                <h3 class="login">{{$l("lbl_userLogin")}}</h3>
                <el-form-item prop="username">
                    <el-input name="username"
                              type="text"
                              v-model="loginForm.username"
                              autoComplete="on"
                              :placeholder='$l("lbl_userName")'>
                        <i slot="prefix"
                           class="fa fa-user"></i>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input name="password"
                              :type="pwdType"
                              @keyup.enter.native="handleLogin"
                              v-model="loginForm.password"
                              autoComplete="on"
                              :placeholder='$l("lbl_userPassword")'>
                        <i slot="prefix"
                           class="fa fa-lock"></i>
                    </el-input>
                    <span class="show-pwd"
                          @click="showPwd">
                        <svg-icon icon-class="eye" />
                    </span>
                </el-form-item>

                <el-form-item>
                    <el-row>
                        <el-col :span="12">
                            <el-checkbox v-model="checked">{{$l("lbl_rememberMe")}}</el-checkbox>
                        </el-col>
                        <el-col :span="12">
                            <!-- <el-select v-model="value" placeholder="请选择" @change="changeLocale" v-if="vm.langSwitch" >
                        <el-option v-for='item in options' :key='item.langTypeCode' :label='item.langTypeLocaleDesc' :value='item.langTypeCode'>
                        </el-option>
                    </el-select> -->
                        </el-col>
                    </el-row>
                </el-form-item>

                <div class="login-box">
                    <el-button size="medium"
                               type="primary"
                               style="width:100%;"
                               :disabled="loading"
                               @click.native.prevent="handleLogin">
                        {{$l("btn_login")}}
                    </el-button>
                </div>
            </el-form>
        </div>
        <div class="foot">{{vm.copyright}}</div>
        <el-dialog :visible.sync="isShowModel"
                   width="500px">
            <img style="width:100%"
                 src="http://172.19.50.42:9012/view/97892612fce19ef7cafeebd8003b0014">
        </el-dialog>
    </div>
</template>
<script>
import { logetInitData } from "@/api/sys/loginAPI";
import login_bg from "@/assets/login-bg.jpg";
import { getLangTypeList } from "@/api/sys/i18nAPI";
import { Constants, setLocalItem, getLocalItem } from "@/utils/common/cache";
import { getAllDictionaryDatasFromUrl } from "@/utils/sys/DictUtil";
import { getAllParameter } from "@/utils/sys/ParameterUtil.js";
import { LoadingUtil } from "@/utils/common/LoadingUtil";
import { getAllClientRouters } from "@/api/platform/clientRouterAPI";
import RouterExecutor from "@/router/RouterExecutor";
export default {
  name: "login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$l("msg_login_username")));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$l("msg_login_password")));
      } else {
        callback();
      }
    };
    return {
      vm: {
        companyNameCn: "",
        companyNameEn: "",
        systemNameCn: "",
        systemNameEn: "",
        systemName: "",
        companyName: "",
        copyrightCn: "",
        copyrightEn: "",
        copyright: "",
        langSwitch: getLocalItem(Constants.LANGSWITCH) === "1",
        themeSwitch: false
      },
      companyInfo: {},
      isShowModel: false,
      options: [],
      value: this.$i18n.locale,
      checked: false,
      loginForm: {
        username: "",
        password: "",
        language: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [{ required: true, trigger: "blur", validator: validatePass }]
      },
      loading: false,
      pwdType: "password",
      login_bg
    };
  },
  mounted: function() {
    // LoadingUtil.showLoading()
    let userName = localStorage.getItem("userName");
    this.checked = !!userName;
    this.loginForm.username = userName;
    this.logetData();
    this.options = JSON.parse(getLocalItem(Constants.LANG_TYPE));
    // getLangTypeList()
    //     .then(response => {
    //         LoadingUtil.hideLoading()
    //         this.options = response.data
    //     })
    //     .catch(error => {
    //         console.log(error)
    //     })
  },
  methods: {
    logetData() {
      const _this = this;
      // logetInitData()
      //     .then(response => {
      this.companyInfo = JSON.parse(getLocalItem(Constants.COMPANY));
      if (_this._i18n.locale === "cn") {
        _this.vm.systemName = this.companyInfo.systemNameCn;
        _this.vm.companyName = this.companyInfo.companyNameCn;
        _this.vm.copyright = this.companyInfo.copyrightCn;
      } else {
        _this.vm.systemName = this.companyInfo.systemNameEn;
        _this.vm.companyName = this.companyInfo.companyNameEn;
        _this.vm.copyright = this.companyInfo.copyrightEn;
      }
      const themeSwitch = getLocalItem(Constants.THEMESWITCH);
      _this.vm.themeSwitch = themeSwitch;
      // })
      // .catch(error => {
      //     console.log(error)
      // })
    },
    changeLocale(value) {
      this._i18n.locale = value;
      if (window.localStorage) {
        localStorage.setItem("locale", value);
      }
      if (value === "cn") {
        this.vm.systemName = this.companyInfo.systemNameCn;
        this.vm.companyName = this.companyInfo.companyNameCn;
        this.vm.copyright = this.companyInfo.copyrightCn;
      } else {
        this.vm.systemName = this.companyInfo.systemNameEn;
        this.vm.companyName = this.companyInfo.companyNameEn;
        this.vm.copyright = this.companyInfo.copyrightEn;
      }
    },
    topictogge() {
      this.isShowModel = true;
    },
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          if (this.checked) {
            localStorage.setItem("userName", this.loginForm.username);
          } else {
            localStorage.removeItem("userName");
          }
          this.loading = true;
          this.$store
            .dispatch("Login", this.loginForm)
            .then(response => {
              if (response.code === "2000") {
                this.$store.dispatch("GetInfo"); // 拉取用户信息
                this.$router.push({ path: "/" });
              } else {
                this.$showError(response.message);
              }
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },
    getClientRouter() {
      getAllClientRouters()
        .then(response => {
          setLocalItem(Constants.CLIENT_ROUTERS, JSON.stringify(response.data));
          var data = [];
          RouterExecutor(data, response.data);
          // let currentPath = getLocalItem(Constants.CURRENT_PATH)
          this.$router.addRoutes(data);
          this.$router.push({ path: "/" });
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  input:-webkit-autofill {
    box-shadow: 0 0 0px 1000px #fff inset !important;
    -webkit-box-shadow: 0 0 0px 1000px #fff inset !important;
    -webkit-text-fill-color: #000 !important;
  }
  .pic-logbg {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .pic-logbg img {
    width: 100%;
    height: 100%;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .logininfo {
    position: absolute;
    width: 400px;
    left: 50%;
    top: 50%;
    margin: -170px 0 0 -200px;
  }
  .loging {
    font-size: 25px;
    color: #4372b6;
    text-align: center;
    font-weight: 200;
    letter-spacing: 1px;
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .login {
    font-size: 16px;
    color: #333;
    border-bottom: 0px solid #d3e6f1;
    margin-bottom: 15px;
  }
  .login-form {
    width: 400px;
    background: #fff;
    box-shadow: 0 0 5px 1px #ddd;
    overflow: hidden;
    margin-top: 20px;
    padding: 15px 35px 35px;
  }
  .fa {
    font-size: 16px;
    color: #999;
    margin-left: 5px;
  }
  .submint {
    border: 0 none;
    margin-top: 10px;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 0;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
  .el-icon-menu {
    float: right;
    margin-right: 31px;
    margin-top: 2px;
    font-size: 30px;
  }
  .lange {
    padding-left: 8%;
    padding-top: 10px;
    padding-bottom: 10px;
    line-height: 35px;
    clear: both;
    display: flex;
    height: 55px;
    span {
      color: #f5e4aa;
    }
    .el-icon-minus {
      color: #f5e4aa;
    }
    .el-select {
      background: #fff;
      width: 128px;
    }
    .half {
      float: left;
      width: 40%;
      height: 100%;
    }
    .theme {
      float: left;
      width: 20%;
      height: 100%;
      .fa {
        font-size: 22px;
        color: #fff;
        margin-left: 15px;
      }
    }
  }
}
.foot {
  width: 100%;
  text-align: center;
  position: absolute;
  z-index: 200;
  bottom: 10px;
  left: 0;
  right: 0;
  color: #9e9e9e;
  font-size: 14px;
}
.popper__arrow {
  display: none !important;
}
.v-modal {
  position: relative;
}
</style>
