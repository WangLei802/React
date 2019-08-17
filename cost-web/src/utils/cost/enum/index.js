import projectTreeType from './projectTreeType'
import contractPlanType from './contractPlanType'
import accountingTargetType from './accountingTargetType'
import subjectNodeSourceType from './subjectNodeSourceType'
import stepType from './stepType'
import contractStepType from './contractStepType'
import publicStallType from './publicStallType'
import module from './module'
import accountingTargetCNType from './accountingTargetCNType'


export default {
  projectTreeType, // 项目成本分期树类型
  contractPlanType, // 合约规划编制行节点分类
  accountingTargetType, // 成本分期类型
  SPECIAL_SUBJECT_CODE_FLAG: '.99', // 特殊科目标识
  subjectNodeSourceType, // 科目类型(集团0/自建1)
  stepType: stepType, //阶段
  contractStepType: contractStepType, //合约规划阶段
  publicStallType: publicStallType, //公摊
  module, // 功能模块'
  accountingTargetCNType: accountingTargetCNType //成本分期中文类型
}
