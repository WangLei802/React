import Layout from "@/views/layout/Layout";
import login from "@/views/sys/login/index";
import noPage from "@/views/404";
import Dashboard from "@/views/sys/dashboard/index";
import NewOrUpdateDictionaryType from "@/views/sys/dictionary/NewOrUpdateDictionaryType";
import NewOrUpdateDictionaryData from "@/views/sys/dictionary/NewOrUpdateDictionaryData";
import DictionaryDataList from "@/views/sys/dictionary/DictionaryDataList";
import NewOrUpdateUserProfile from "@/views/sys/user/NewOrUpdateUserProfile";
import UpdateUserPassword from "@/views/sys/user/UpdateUserPassword";
import usageInformation from "@/views/sys/systemConfig/UsageInformation";
import dictionary from "@/views/sys/dictionary/DictionaryTypeList";
import audit from "@/views/sys/audit/AuditLogList";
import logdetails from "@/views/sys/audit/Logdetails";
import MenuManager from "@/views/sys/menu/MenuManageList";
import NewOrUpdateMenuData from "@/views/sys/menu/NewOrUpdateMenuData";
import NewOrUpdateLang from "@/views/sys/lang/NewOrUpdateLang";
import LangTypeList from "@/views/sys/lang/LangTypeList";
import NewOrUpdateLangType from "@/views/sys/lang/NewOrUpdateLangType";
import LangList from "@/views/sys/lang/LangList";
import UserProfile from "@/views/sys/user/UserProfile";
import Team from "@/views/sys/developer/Team";
import ParameterList from "@/views/sys/parameter/ParameterList";
import NewOrUpdateParameter from "@/views/sys/parameter/NewOrUpdateParameter";
import ComponentExample from "@/views/sys/componentExample/index";
import RoleList from "@/views/sys/role/RoleList";
import NewOrUpdateRole from "@/views/sys/role/NewOrUpdateRole";
import UserManageList from "@/views/sys/userManage/UserManageList";
import NewOrUpdateUser from "@/views/sys/userManage/NewOrUpdateUser";
import EmailList from "@/views/sys/email/EmailList";
import EmailDetails from "@/views/sys/email/EmailDetails";
import EmailServerList from "@/views/sys/emailServer/EmailServerList";
import NewOrUpdateEmailServer from "@/views/sys/emailServer/NewOrUpdateEmailServer";
import EmailTemplateList from "@/views/sys/emailTemplate/EmailTemplateList";
import NewOrUpdateEmailTemplate from "@/views/sys/emailTemplate/NewOrUpdateEmailTemplate";
import LicenseList from "@/views/sys/license/LicenseList";
import NewOrUpdateLicense from "@/views/sys/license/NewOrUpdateLicense";
import StandaredSubjectList from "@/views/cost/subject/StandaredSubjectList";
import projectConfigList from "@/views/cost/projectConfig/projectConfigList";
import ResourceList from "@/views/platform/resource/ResourceList";
import RoleResAuthList from "@/views/platform/roleResAuth/RoleResAuthList";
import WidgetDatasourceList from "@/views/sys/widgetDatasourceManage/WidgetDatasourceList";
import NewOrUpdateWidgetDatasource from "@/views/sys/widgetDatasourceManage/NewOrUpdateWidgetDatasource";
import WidgetList from "@/views/sys/widgetManage/WidgetList";
import NewOrUpdateWidget from "@/views/sys/widgetManage/NewOrUpdateWidget";
import DashboardList from "@/views/sys/dashboardManage/DashboardList";
import NewOrUpdateDashboard from "@/views/sys/dashboardManage/NewOrUpdateDashboard";
import ApplicationList from "@/views/platform/application/ApplicationList";
import NewOrUpdateApplication from "@/views/platform/application/NewOrUpdateApplication";
import RoleUserList from "@/views/sys/role/RoleUserList";
import GatewayInternalList from "@/views/platform/gateway/GatewayInternalList";
import NewOrUpdateGatewayInternal from "@/views/platform/gateway/NewOrUpdateGatewayInternal";
import UpdateUserRoles from "@/views/platform/userManage/UpdateUserRoles";
import AppModuleList from "@/views/platform/applicationModule/AppModuleList";
import NewOrUpdateAppModule from "@/views/platform/applicationModule/NewOrUpdateAppModule";
import ContractPlanningLibrary from "@/views/cost/contractPlan/ContractPlanList";
import ContractPlanAccObjList from "@/views/cost/contractPlanAccObj/ContractPlanAccObjList";
import ContractPlanTemplate from "@/views/cost/contractPlanTemplate/ContractPlanTemplateList";
import ApplicationAPIList from "@/views/platform/applicationapi/ApplicationAPIList";
import NewOrUpdateApplicationAPI from "@/views/platform/applicationapi/NewOrUpdateApplicationAPI";

import TargetCostCompilationList from "@/views/cost/targetCostCompilation/TargetCostCompilationList";
import NewOrUpdateTargetCostCompilation from "@/views/cost/targetCostCompilation/NewOrUpdateTargetCostCompilation";
import TargectCostList from "@/views/cost/selectTargetCost/TargectCostList";
import TargetCostAdjustmentList from "@/views/cost/targetCostAdjustment/TargetCostAdjustmentList";
import NewOrUpdateTargetCostAdjustment from "@/views/cost/targetCostAdjustment/NewOrUpdateTargetCostAdjustment";
import TargetCostQueryList from "@/views/cost/targetCostQuery/TargetCostQueryList";
import ClientRouterList from "@/views/sys/clientRouter/ClientRouterList";
import NewOrUpdateClientRouter from "@/views/sys/clientRouter/NewOrUpdateClientRouter";
import ProjectList from "@/views/cost/projectModule/ProjectList";
import AccountingObjectList from "@/views/cost/accountingObject/AccountingObjectList";
import TargetCostContractPlanList from "@/views/cost/targetCostContractPlan/TargetCostContractPlanList";
import NewOrUpdateTargetCostContractPlan from "@/views/cost/targetCostContractPlan/NewOrUpdateTargetCostContractPlan";
import NewOrUpdateTargetCostContractPlanAdjustment from "@/views/cost/targetCostContractPlan/NewOrUpdateTargetCostContractPlanAdjustment";
import TargetCostContractPlanOverview from "@/views/cost/targetCostContractPlan/TargetCostContractPlanOverview";
import TargetCostContractPlanQuery from "@/views/cost/targetCostContractPlan/TargetCostContractPlanQuery";
import ContractSignPrimaryList from "@/views/cost/signContract/ContractSignPrimaryList";
import NewContractInformation from "@/views/cost/signContract/NewContractInformation";
import CostTest from "@/views/cost/test/index";
import ConstructionList from "@/views/cost/constructionBudget/ConstructionList";
import DiameterList from "@/views/cost/uniformDiameter/DiameterList";
import ConsolidationList from "@/views/cost/rotaryConsolidation/ConsolidationList";
import ContractList from "@/views/cost/contractSettlement/ContractList";
import BidBondList from "@/views/cost/bidBondBack/BidBondList";
import MonthlyPlayList from "@/views/cost/monthlyPlay/MonthlyPlayList";
import OutputValueCheckList from "@/views/cost/payment/outputValueCheck/OutputValueCheckList";
import OutputValueCheckInfoData from "@/views/cost/payment/outputValueCheck/OutputValueCheckInfoData";
import ProjectNoticeList from "@/views/cost/projectNotice/ProjectNoticeList";
import ProjectDataApproveList from "@/views/cost/projectDataApprove/ProjectDataApproveList";
import IneffectiveCostList from "@/views/cost/ineffectiveCostModel/IneffectiveCostList";
import IneffectiveCostCheckList from "@/views/cost/ineffectiveCostCheck/IneffectiveCostCheckList";
import CostControlDetail from "@/views/cost/signContract/CostControlDetail";
import CostBiddingDetail from "@/views/cost/signContract/CostBiddingDetail";
import KeepCostConfirmList from "@/views/cost/costConfirmation/KeepCostConfirmList";
import CostConfirmListShare from "@/views/cost/costConfirmationShare/CostConfirmListShare";
import DynamicCostList from "@/views/cost/dynamicCost/DynamicCostList";
import ContractsSignCostSplit from "@/views/cost/dynamicCost/ContractsSignCostSplit";
import FundPlanList from "@/views/cost/fundPlan/FundPlanList";
import DesignChangeRequest from "@/views/cost/dynamicCost/DesignChangeRequest";
import LocaleVisaApplication from "@/views/cost/dynamicCost/LocaleVisaApplication";
import ContractTransfer from "@/views/cost/dynamicCost/ContractTransfer";
import ContractChange from "@/views/cost/dynamicCost/ContractChange";
import ContractSettlement from "@/views/cost/dynamicCost/ContractSettlement";
import DesignChangeConfirmation from "@/views/cost/dynamicCost/DesignChangeConfirmation";
import SiteVisaConfirmation from "@/views/cost/dynamicCost/SiteVisaConfirmation";
import WithoutContractApply from "@/views/cost/dynamicCost/WithoutContractApply";
import BPMapproval from "@/views/cost/BPMApproval/ApprovalList";
import FundsYearList from "@/views/cost/fundsYear/FundsYearList";
import NewOrUpdateFundsYear from "@/views/cost/fundsYear/NewOrUpdateFundsYear";
import FundsMonthList from "@/views/cost/fundsMonth/FundsMonthList";
import NewOrUpdateFundsMonth from "@/views/cost/fundsMonth/NewOrUpdateFundsMonth";
import ChangeFormatAlocation from "@/views/cost/dynamicCost/ChangeFormatAlocation";
import QueryDynamicCost from "@/views/cost/dynamicCost/QueryDynamicCost";
const componentsObj = {
  Layout: Layout,
  login: login,
  noPage: noPage,
  Dashboard: Dashboard,
  NewOrUpdateDictionaryType: NewOrUpdateDictionaryType,
  NewOrUpdateDictionaryData: NewOrUpdateDictionaryData,
  DictionaryDataList: DictionaryDataList,
  NewOrUpdateUserProfile: NewOrUpdateUserProfile,
  UpdateUserPassword: UpdateUserPassword,
  usageInformation: usageInformation,
  dictionary: dictionary,
  audit: audit,
  logdetails: logdetails,
  MenuManager: MenuManager,
  NewOrUpdateMenuData: NewOrUpdateMenuData,
  NewOrUpdateLang: NewOrUpdateLang,
  LangTypeList: LangTypeList,
  NewOrUpdateLangType: NewOrUpdateLangType,
  LangList: LangList,
  UserProfile: UserProfile,
  Team: Team,
  ParameterList: ParameterList,
  NewOrUpdateParameter: NewOrUpdateParameter,
  ComponentExample: ComponentExample,
  RoleList: RoleList,
  NewOrUpdateRole: NewOrUpdateRole,
  UserManageList: UserManageList,
  NewOrUpdateUser: NewOrUpdateUser,
  EmailList: EmailList,
  EmailDetails: EmailDetails,
  EmailServerList: EmailServerList,
  NewOrUpdateEmailServer: NewOrUpdateEmailServer,
  EmailTemplateList: EmailTemplateList,
  NewOrUpdateEmailTemplate: NewOrUpdateEmailTemplate,
  LicenseList: LicenseList,
  NewOrUpdateLicense: NewOrUpdateLicense,
  StandaredSubjectList: StandaredSubjectList,
  projectConfigList: projectConfigList,
  ResourceList: ResourceList,
  RoleResAuthList: RoleResAuthList,
  WidgetDatasourceList: WidgetDatasourceList,
  NewOrUpdateWidgetDatasource: NewOrUpdateWidgetDatasource,
  WidgetList: WidgetList,
  NewOrUpdateWidget: NewOrUpdateWidget,
  DashboardList: DashboardList,
  NewOrUpdateDashboard: NewOrUpdateDashboard,
  ApplicationList: ApplicationList,
  NewOrUpdateApplication: NewOrUpdateApplication,
  RoleUserList: RoleUserList,
  UpdateUserRoles: UpdateUserRoles,
  AppModuleList: AppModuleList,
  NewOrUpdateAppModule: NewOrUpdateAppModule,
  ClientRouterList: ClientRouterList,
  NewOrUpdateClientRouter: NewOrUpdateClientRouter,
  ContractPlanningLibrary: ContractPlanningLibrary,
  ContractPlanAccObjList: ContractPlanAccObjList,
  ContractPlanTemplate: ContractPlanTemplate,
  GatewayInternalList: GatewayInternalList,
  NewOrUpdateGatewayInternal: NewOrUpdateGatewayInternal,
  ApplicationAPIList: ApplicationAPIList,
  NewOrUpdateApplicationAPI: NewOrUpdateApplicationAPI,
  TargetCostCompilationList: TargetCostCompilationList,
  NewOrUpdateTargetCostCompilation: NewOrUpdateTargetCostCompilation,
  TargectCostList: TargectCostList,
  TargetCostAdjustmentList: TargetCostAdjustmentList,
  NewOrUpdateTargetCostAdjustment: NewOrUpdateTargetCostAdjustment,
  TargetCostQueryList: TargetCostQueryList,
  ProjectList: ProjectList,
  AccountingObjectList: AccountingObjectList,
  TargetCostContractPlanList: TargetCostContractPlanList,
  NewOrUpdateTargetCostContractPlan: NewOrUpdateTargetCostContractPlan,
  NewOrUpdateTargetCostContractPlanAdjustment: NewOrUpdateTargetCostContractPlanAdjustment,
  TargetCostContractPlanOverview: TargetCostContractPlanOverview,
  TargetCostContractPlanQuery: TargetCostContractPlanQuery,
  ContractSignPrimaryList: ContractSignPrimaryList,
  NewContractInformation: NewContractInformation,
  CostTest: CostTest,
  ConstructionList: ConstructionList,
  DiameterList: DiameterList,
  ConsolidationList: ConsolidationList,
  ContractList: ContractList,
  BidBondList: BidBondList,
  MonthlyPlayList: MonthlyPlayList,
  OutputValueCheckList: OutputValueCheckList,
  OutputValueCheckInfoData: OutputValueCheckInfoData,
  ProjectNoticeList: ProjectNoticeList,
  ProjectDataApproveList: ProjectDataApproveList,
  IneffectiveCostList: IneffectiveCostList,
  IneffectiveCostCheckList: IneffectiveCostCheckList,
  CostControlDetail: CostControlDetail,
  CostBiddingDetail: CostBiddingDetail,
  KeepCostConfirmList: KeepCostConfirmList,
  CostConfirmListShare: CostConfirmListShare,
  DynamicCostList: DynamicCostList,
  ContractsSignCostSplit: ContractsSignCostSplit,
  FundPlanList: FundPlanList,
  DesignChangeRequest: DesignChangeRequest,
  LocaleVisaApplication: LocaleVisaApplication,
  WithoutContractApply: WithoutContractApply,
  SiteVisaConfirmation: SiteVisaConfirmation,
  DesignChangeConfirmation: DesignChangeConfirmation,
  ContractSettlement: ContractSettlement,
  ContractChange: ContractChange,
  ChangeFormatAlocation: ChangeFormatAlocation,
  ContractTransfer: ContractTransfer,
  BPMapproval: BPMapproval,
  FundsYearList: FundsYearList,
  NewOrUpdateFundsYear: NewOrUpdateFundsYear,
  FundsMonthList: FundsMonthList,
  NewOrUpdateFundsMonth: NewOrUpdateFundsMonth,
  QueryDynamicCost: QueryDynamicCost
};

export default componentsObj;
