import Vue from "vue";
import Router from "vue-router";

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router);

/* Layout */
import componentsObj from "@/router/componentsPull";
import NotFoundComponent from "@/views/sys/login/index";
/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
// export const constantRouterMap = [
//   { path: '*', component: NotFoundComponent, hidden: true }]
export const constantRouterMap = [
  {
    path: "/login",
    component: componentsObj.login,
    hidden: true
  },
  {
    path: "/",
    component: componentsObj.Layout,
    redirect: "/dashboard",
    name: "Dashboard",
    children: [
      {
        path: "dashboard",
        component: componentsObj.Dashboard
      },
      // 用户信息
      {
        props: true,
        name: "UserProfile",
        path: "/userProfile",
        component: componentsObj.UserProfile
      },
      {
        props: true,
        name: "UpdateUserPassword",
        path: "/updateUserPassword",
        component: componentsObj.UpdateUserPassword
      },
      {
        props: true,
        name: "NewOrUpdateUserProfile",
        path: "/newOrUpdateUserProfile",
        component: componentsObj.NewOrUpdateUserProfile
      },
      // 字典管理
      {
        props: true,
        name: "Dictionary",
        path: "/dictionary",
        component: componentsObj.dictionary
      },
      {
        props: true,
        name: "DictionaryDataList",
        path: "/dict/dictionaryDataList",
        component: componentsObj.DictionaryDataList
      },
      {
        props: true,
        name: "NewOrUpdateDictionaryType",
        path: "/dict/newOrUpdateDictionaryType",
        component: componentsObj.NewOrUpdateDictionaryType
      },
      {
        props: true,
        name: "NewOrUpdateDictionaryData",
        path: "/dict/newOrUpdateDictionaryData",
        component: componentsObj.NewOrUpdateDictionaryData
      },
      // 日志管理
      {
        props: true,
        name: "audit",
        path: "/audit",
        component: componentsObj.audit
      },
      {
        props: true,
        name: "logdetails",
        path: "/logdetails",
        component: componentsObj.logdetails
      },
      // 使用者管理
      {
        props: true,
        name: "usageInformation",
        path: "/usageInformation",
        component: componentsObj.usageInformation
      },
      // 菜单管理
      {
        props: true,
        name: "MenuManager",
        path: "/MenuManager",
        component: componentsObj.MenuManager
      },
      {
        props: true,
        name: "NewOrUpdateMenuData",
        path: "/menu/newOrUpdateMenuData",
        component: componentsObj.NewOrUpdateMenuData
      },
      // 国际化
      {
        props: true,
        name: "LangList",
        path: "/langList",
        component: componentsObj.LangList
      },
      {
        props: true,
        name: "NewOrUpdateLang",
        path: "/i18n/newOrUpdateLang",
        component: componentsObj.NewOrUpdateLang
      },
      {
        props: true,
        name: "LangTypeList",
        path: "/i18n/langTypeList",
        component: componentsObj.LangTypeList
      },
      {
        props: true,
        name: "NewOrUpdateLangType",
        path: "/i18n/newOrUpdateLangType",
        component: componentsObj.NewOrUpdateLangType
      },
      // 开发团队
      {
        props: true,
        name: "Team",
        path: "/systemConfig/team",
        component: componentsObj.Team
      },
      // 参数管理
      {
        props: true,
        name: "ParameterList",
        path: "/param",
        component: componentsObj.ParameterList
      },
      {
        props: true,
        name: "NewOrUpdateParameter",
        path: "/param/newOrUpdateParameter",
        component: componentsObj.NewOrUpdateParameter
      },
      // 例子
      {
        props: true,
        name: "ComponentExample",
        path: "/systemConfig/ComponentExample",
        component: componentsObj.ComponentExample
      },
      // 角色
      {
        props: true,
        name: "RoleList",
        path: "/role",
        component: componentsObj.RoleList
      },
      {
        props: true,
        name: "NewOrUpdateRole",
        path: "/role/NewOrUpdateRole",
        component: componentsObj.NewOrUpdateRole
      },
      {
        props: true,
        name: "RoleUserList",
        path: "/role/RoleUserList",
        component: componentsObj.RoleUserList
      },
      // 用户管理
      {
        props: true,
        name: "UserManageList",
        path: "/UserManageList",
        component: componentsObj.UserManageList
      },
      {
        props: true,
        name: "NewOrUpdateUser",
        path: "/userManage/NewOrUpdateUser",
        component: componentsObj.NewOrUpdateUser
      },

      // 邮件管理
      {
        props: true,
        name: "EmailList",
        path: "/emailList",
        component: componentsObj.EmailList
      },
      {
        props: true,
        name: "EmailDetails",
        path: "/email/emailDetails",
        component: componentsObj.EmailDetails
      },
      // 邮件服务器管理
      {
        props: true,
        name: "EmailServerList",
        path: "/EmailServerList",
        component: componentsObj.EmailServerList
      },
      {
        props: true,
        name: "NewOrUpdateEmailServer",
        path: "/emailServer/NewOrUpdateEmailServer",
        component: componentsObj.NewOrUpdateEmailServer
      },
      // 邮件模板管理
      {
        props: true,
        name: "EmailTemplateList",
        path: "/EmailTemplateList",
        component: componentsObj.EmailTemplateList
      },
      {
        props: true,
        name: "NewOrUpdateEmailTemplate",
        path: "/emailTemplate/NewOrUpdateEmailTemplate",
        component: componentsObj.NewOrUpdateEmailTemplate
      },
      // License管理
      {
        props: true,
        name: "LicenseList",
        path: "/license",
        component: componentsObj.LicenseList
      },
      {
        props: true,
        name: "NewOrUpdateLicense",
        path: "/license/NewOrUpdateLicense",
        component: componentsObj.NewOrUpdateLicense
      },
      // 资源管理
      {
        props: true,
        name: "ResourceList",
        path: "/resourceList",
        component: componentsObj.ResourceList
      },
      // 角色授权管理
      {
        props: true,
        name: "RoleResAuthList",
        path: "/roleResAuthList",
        component: componentsObj.RoleResAuthList
      },
      // Widget Datasource管理
      {
        props: true,
        name: "WidgetDatasourceList",
        path: "/widgetDatasourceList",
        component: componentsObj.WidgetDatasourceList
      },
      {
        props: true,
        name: "NewOrUpdateWidgetDatasource",
        path: "/widgetDatasource/NewOrUpdateWidgetDatasource",
        component: componentsObj.NewOrUpdateWidgetDatasource
      },
      // Widget管理
      {
        props: true,
        name: "WidgetList",
        path: "/widgetList",
        component: componentsObj.WidgetList
      },
      {
        props: true,
        name: "NewOrUpdateWidget",
        path: "/widget/NewOrUpdateWidget",
        component: componentsObj.NewOrUpdateWidget
      },
      // Dashboard管理
      {
        props: true,
        name: "DashboardList",
        path: "/dashboardlist",
        component: componentsObj.DashboardList
      },
      {
        props: true,
        name: "NewOrUpdateDashboard",
        path: "/dashboard/NewOrUpdateDashboard",
        component: componentsObj.NewOrUpdateDashboard
      },
      {
        props: true,
        name: "NewOrUpdateDashboardWidget",
        path: "/dashboard/NewOrUpdateDashboardWidget",
        component: componentsObj.Dashboard
      },
      // 应用管理
      {
        props: true,
        name: "ApplicationList",
        path: "/application/ApplicationList",
        component: componentsObj.ApplicationList
      },
      {
        props: true,
        name: "NewOrUpdateApplication",
        path: "/application/NewOrUpdateApplication",
        component: componentsObj.NewOrUpdateApplication
      },
      // ApplicationModule管理
      {
        props: true,
        name: "AppModuleList",
        path: "/appModuleList",
        component: componentsObj.AppModuleList
      },
      {
        props: true,
        name: "NewOrUpdateAppModule",
        path: "/appmodule/NewOrUpdateAppModule",
        component: componentsObj.NewOrUpdateAppModule
      },
      // 网关管理
      {
        props: true,
        name: "GatewayInternalList",
        path: "/gatewayInternal/GatewayInternalList",
        component: componentsObj.GatewayInternalList
      },
      {
        props: true,
        name: "NewOrUpdateGatewayInternal",
        path: "/gatewayInternal/NewOrUpdateGatewayInternal",
        component: componentsObj.NewOrUpdateGatewayInternal
      },
      // ApplicationModule管理
      {
        props: true,
        name: "AppModuleList",
        path: "/appModuleList",
        component: componentsObj.AppModuleList
      },
      {
        props: true,
        name: "NewOrUpdateAppModule",
        path: "/appmodule/NewOrUpdateAppModule",
        component: componentsObj.NewOrUpdateAppModule
      },
      // 应用API管理
      {
        props: true,
        name: "ApplicationAPIList",
        path: "/applicationapi/ApplicationAPIList",
        component: componentsObj.ApplicationAPIList
      },
      {
        props: true,
        name: "NewOrUpdateApplicationAPI",
        path: "/applicationapi/NewOrUpdateApplicationAPI",
        component: componentsObj.NewOrUpdateApplicationAPI
      },
      // Cost
      {
        props: true,
        name: "StandaredSubjectList",
        path: "/standaredsubject",
        component: componentsObj.StandaredSubjectList
      },
      {
        props: true,
        name: "projectConfigList",
        path: "/projectConfig/projectConfigList",
        component: componentsObj.projectConfigList
      },
      {
        props: true,
        name: "ContractPlanningLibrary",
        path: "/ContractPlanning",
        component: componentsObj.ContractPlanningLibrary
      },
      {
        props: true,
        name: "ContractPlanAccObjList",
        path: "/contractPlanAccObj/ContractPlanAccObjList",
        component: componentsObj.ContractPlanAccObjList
      },
      {
        props: true,
        name: "ContractPlanTemplate",
        path: "/ContractPlanTemplate",
        component: componentsObj.ContractPlanTemplate
      },
      {
        props: true,
        name: "TargetCostCompilationList",
        path: "/targetCostCompilation/list",
        component: componentsObj.TargetCostCompilationList
      },
      {
        props: true,
        name: "NewOrUpdateTargetCostCompilation",
        path: "/targetCostCompilation/NewOrUpdate",
        component: componentsObj.NewOrUpdateTargetCostCompilation
      },
      {
        props: true,
        name: "TargectCostList",
        path: "/selectTargetCost/TargectCostList",
        component: componentsObj.TargectCostList
      },
      {
        props: true,
        name: "TargetCostAdjustmentList",
        path: "/targetCostAdjustment/list",
        component: componentsObj.TargetCostAdjustmentList
      },
      {
        props: true,
        name: "NewOrUpdateTargetCostAdjustment",
        path: "/targetCostAdjustment/NewOrUpdate",
        component: componentsObj.NewOrUpdateTargetCostAdjustment
      },
      {
        props: true,
        name: "TargetCostQueryList",
        path: "/targetCostQueryList/list",
        component: componentsObj.TargetCostQueryList
      },
      {
        props: true,
        name: "ProjectList",
        path: "/projectModule/list",
        component: componentsObj.ProjectList
      },
      {
        props: true,
        name: "AccountingObjectList",
        path: "/accountingObject/list",
        component: componentsObj.AccountingObjectList
      },
      {
        props: true,
        name: "TargetCostContractPlanList",
        path: "/targetCostContractPlan/list",
        component: componentsObj.TargetCostContractPlanList
      },
      {
        props: true,
        name: "NewOrUpdateTargetCostContractPlan",
        path: "/targetCostContractPlan/NewOrUpdate",
        component: componentsObj.NewOrUpdateTargetCostContractPlan
      },
      {
        props: true,
        name: "NewOrUpdateTargetCostContractPlanAdjustment",
        path: "targetCostContractPlan/Adjustment",
        component: componentsObj.NewOrUpdateTargetCostContractPlanAdjustment
      },
      {
        props: true,
        name: "TargetCostContractPlanOverview",
        path: "targetCostContractPlan/Overview",
        component: componentsObj.TargetCostContractPlanOverview
      },
      {
        props: true,
        name: "TargetCostContractPlanQuery",
        path: "targetCostContractPlan/Query",
        component: componentsObj.TargetCostContractPlanQuery
      },
      {
        props: true,
        name: "ContractSignPrimaryList",
        path: "signContract/ContractSignPrimaryList",
        component: componentsObj.ContractSignPrimaryList
      },
      {
        props: true,
        name: "NewContractInformation",
        path: "contractSignPrimaryList/NewOrUpdate",
        component: componentsObj.NewContractInformation
      },
      {
        props: true,
        name: "CostTest",
        path: "cost/test",
        component: componentsObj.CostTest
      },
      {
        props: true,
        name: "ConstructionList",
        path: "constructionBudget/ConstructionList",
        component: componentsObj.ConstructionList
      },
      {
        props: true,
        name: "DiameterList",
        path: "uniformDiameter/DiameterList",
        component: componentsObj.DiameterList
      },
      {
        props: true,
        name: "ConsolidationList",
        path: "rotaryConsolidation/ConsolidationList",
        component: componentsObj.ConsolidationList
      },
      {
        props: true,
        name: "BidBondList",
        path: "bidBondBack/BidBondList",
        component: componentsObj.BidBondList
      },
      {
        props: true,
        name: "MonthlyPlayList",
        path: "monthlyPlay/MonthlyPlayList",
        component: componentsObj.MonthlyPlayList
      },
      {
        props: true,
        name: "OutputValueCheckList",
        path: "outputValueCheckList/OutputValueCheckList",
        component: componentsObj.OutputValueCheckList
      },
      {
        props: true,
        name: "OutputValueCheckInfoData",
        path: "outputValueCheckList/OutputValueCheckInfoData",
        component: componentsObj.OutputValueCheckInfoData
      },
      {
        props: true,
        name: "ProjectNoticeList",
        path: "projectNotice/ProjectNoticeList",
        component: componentsObj.ProjectNoticeList
      },
      {
        props: true,
        name: "ProjectDataApproveList",
        path: "projectDataApprove/ProjectDataApproveList",
        component: componentsObj.ProjectDataApproveList
      },
      {
        props: true,
        name: "IneffectiveCostList",
        path: "ineffectiveCost/IneffectiveCostList",
        component: componentsObj.IneffectiveCostList
      },
      {
        props: true,
        name: "IneffectiveCostCheckList",
        path: "ineffectiveCostCheck/IneffectiveCostCheckList",
        component: componentsObj.IneffectiveCostCheckList
      },
      {
        props: true,
        name: "CostControlDetail",
        path: "signContract/CostControlDetail",
        component: componentsObj.CostControlDetail
      },
      {
        props: true,
        name: "CostBiddingDetail",
        path: "signContract/CostBiddingDetail",
        component: componentsObj.CostBiddingDetail
      },
      {
        props: true,
        name: "KeepCostConfirmList",
        path: "costConfirmation/KeepCostConfirmList",
        component: componentsObj.KeepCostConfirmList
      },
      {
        props: true,
        name: "CostConfirmListShare",
        path: "costConfirmationShare/CostConfirmListShare",
        component: componentsObj.CostConfirmListShare
      },
      {
        props: true,
        name: "DynamicCostList",
        path: "dynamicCost/DynamicCostList",
        component: componentsObj.DynamicCostList
      },
      {
        props: true,
        name: "ContractsSignCostSplit",
        path: "dynamicCost/ContractsSignCostSplit",
        component: componentsObj.ContractsSignCostSplit
      },
      {
        props: true,
        name: "FundPlanList",
        path: "fundPlan/FundPlanList",
        component: componentsObj.FundPlanList
      },
      {
        props: true,
        name: "DesignChangeRequest",
        path: "dynamicCost/DesignChangeRequest",
        component: componentsObj.DesignChangeRequest
      },
      {
        props: true,
        name: "LocaleVisaApplication",
        path: "dynamicCost/LocaleVisaApplication",
        component: componentsObj.LocaleVisaApplication
      },
      {
        props: true,
        name: "WithoutContractApply",
        path: "dynamicCost/WithoutContractApply",
        component: componentsObj.WithoutContractApply
      },
      {
        props: true,
        name: "SiteVisaConfirmation",
        path: "dynamicCost/SiteVisaConfirmation",
        component: componentsObj.SiteVisaConfirmation
      },
      {
        props: true,
        name: "DesignChangeConfirmation",
        path: "dynamicCost/DesignChangeConfirmation",
        component: componentsObj.DesignChangeConfirmation
      },
      {
        props: true,
        name: "ContractSettlement",
        path: "dynamicCost/ContractSettlement",
        component: componentsObj.ContractSettlement
      },
      {
        props: true,
        name: "ContractChange",
        path: "dynamicCost/ContractChange",
        component: componentsObj.ContractChange
      },
      {
        props: true,
        name: "ContractTransfer",
        path: "dynamicCost/ContractTransfer",
        component: componentsObj.ContractTransfer
      },
      {
        props: true,
        name: "BPMapproval",
        path: "dynamicCost/BPMapproval",
        component: componentsObj.BPMapproval
      },
      {
        props: true,
        name: "FundsYearList",
        path: "fundsYear/FundsYearList",
        component: componentsObj.FundsYearList
      },
      {
        props: true,
        name: "FundsYearList",
        path: "fundsYear/NewOrUpdateFundsYear",
        component: componentsObj.NewOrUpdateFundsYear
      },
      {
        props: true,
        name: "FundsMonthList",
        path: "fundsMonth/FundsMonthList",
        component: componentsObj.FundsMonthList
      },
      {
        props: true,
        name: "NewOrUpdateFundsMonth",
        path: "fundsMonth/NewOrUpdateFundsMonth",
        component: componentsObj.NewOrUpdateFundsMonth
      },
      {
        props: true,
        name: "ChangeFormatAlocation",
        path: "dynamicCost/ChangeFormatAlocation",
        component: componentsObj.ChangeFormatAlocation
      },
      {
        props: true,
        name: "QueryDynamicCost",
        path: "dynamicCost/QueryDynamicCost",
        component: componentsObj.QueryDynamicCost
      }
    ]
  }
];

export default new Router({
  mode: "history", //后端支持可开
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
});
// 异步挂载的路由
// 动态需要根据权限加载的路由表
export const asyncRouterMap = [
  {
    path: "*",
    redirect: "/404",
    hidden: true
  }
];
