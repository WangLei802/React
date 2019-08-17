import { Constants, setLocalItem } from "@/utils/common/cache";
import { getAllClientRouters } from "@/api/platform/clientRouterAPI";
import RouterExecutor from "@/router/RouterExecutor";
import { getLocalItem } from "@/utils/common/cache";
import { getMyPermissions } from "@/utils/sys/PermissionUtil.js";
import { getAllParameter } from "@/utils/sys/ParameterUtil.js";
import sys_config from "@/config/config.js";
import { getAllDictionaryDatasFromUrl } from "@/utils/sys/DictUtil";
import { get } from "@/utils/sys/http";
export function LoginPrepare(router, store) {
  getAllParameter();
  getClientRouter(router, store);
  getInfo(store);
  getALLMenue(store);
  getAllDictionaryDatasFromUrl();
  getMyPermissions();
}
export function initTimer(store) {
  let menuIntervalInfo = sys_config.menu;
  if (!menuIntervalInfo) {
    return;
  }
  // 定时器
  window.timers = [];
  for (var i = 0; i < menuIntervalInfo.length; i++) {
    let {
      menuName,
      eventName,
      timeInterval,
      needPolling,
      columnName,
      api
    } = menuIntervalInfo[i];
    callAPI(api, menuName, eventName, store, columnName);
    if (needPolling) {
      // 定时器，清空定时器
      window.timers.push(
        setInterval(() => {
          callAPI(api, menuName, eventName, store);
        }, timeInterval * 1000)
      ); // 分钟
    }
  }
}

// 调用api
function callAPI(api, menuName, eventName, store, columnName = "length") {
  get(api)
    .then(response => {
      // 更新菜单
      updateMenu(menuName, response.data[columnName] || 0, store);
    })
    .catch(e => {
      console.log(e);
    });
}

// 更新菜单
export function updateMenu(menuName, updatedValue, store) {
  let menu = JSON.parse(getLocalItem(Constants.MENU)) || [];
  menu.forEach(v => {
    updateMenuByMenuName(v.children, menuName, updatedValue || 0);
  });
  setLocalItem(Constants.MENU, JSON.stringify(menu));
  store.dispatch("setMenuData", menu); // 获取菜单
  menu.forEach(item => {
    if (item.id === getLocalItem(Constants.CURRENT_MENUID)) {
      setLocalItem(Constants.LEFT_MENU, JSON.stringify(item));
      store.dispatch("setLeftMenuObj");
    }
  });
}

// 更新菜单数据
function updateMenuByMenuName(menu, menuName, count) {
  for (let i = 0; i < menu.length; i++) {
    if (menu[i].menuNameEn === menuName) {
      menu[i].count = count;
    } else if (menu[i].children) {
      updateMenuByMenuName(menu[i].children, menuName, count);
    }
  }
  return menu;
}

function getClientRouter(router, store) {
  getAllClientRouters()
    .then(response => {
      setLocalItem(
        Constants.CLIENT_ROUTERS,
        typeof response.data === "string"
          ? response.data
          : JSON.stringify(response.data)
      );
      var data = [];
      RouterExecutor(data, response.data);
      router.addRoutes(data);
      let path = location.pathname;
      // 判断页面是否存在，路由不存在
      if (!JSON.stringify(response.data).includes(path)) {
        path = "/";
      }
      router.push({
        path: path ? path : "/"
      });
      // 初始化定时器
      if (sys_config.menu) {
        initTimer(store);
      }
    })
    .catch(error => {
      console.log(error);
    });
}

function getInfo(store) {
  store.dispatch("GetInfo"); // 拉取用户信息
}

function getALLMenue(store) {
  store.dispatch("getAllMenu"); // 获取菜单
  console.log('获取菜单')
  console.log(store.dispatch("getAllMenu"))
}
