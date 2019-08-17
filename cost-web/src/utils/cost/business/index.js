import COSTENUM from '../enum/'
import {
  getToken
} from '@/utils/common/auth' // 验权
import {
  deepCopy
} from '../objectHelper'

// 获取成本分期类型(PUTONG,KUAQI,FENQI,DAIFENQI)
// AccountingTargetModel:{name:null}
function getAccountingTargetType(accountingTargetModel) {
  const baseInfo = {
    intertemporalFlag: '跨期', //跨期标识,通过成本分期名称this.queryModel.accountingObjectText
    periodizationFlag: ['一期', '二期', '三期', '四期', '五期', '六期'], //分期标识
    toBeStaging: '待分期'
  }
  let flag = COSTENUM.accountingTargetType.PUTONG
  if (accountingTargetModel && accountingTargetModel.name) {
    if (accountingTargetModel.name.indexOf(baseInfo.intertemporalFlag) > -1) {
      flag = COSTENUM.accountingTargetType.KUAQI
    } else if (accountingTargetModel.name.indexOf(baseInfo.toBeStaging) > -1) {
      flag = COSTENUM.accountingTargetType.DAIFENQI
    } else {
      for (let i = 0; i < baseInfo.periodizationFlag.length; i++) {
        if (accountingTargetModel.name.indexOf(baseInfo.periodizationFlag[i]) > -1) {
          flag = COSTENUM.accountingTargetType.FENQI
          break
        }
      }

    }
  }
  return flag
}

// 项目本地生成科目编码(取最后级+1))
// 参数：parentSubjectCode
function generateCodeLocal(lastChildSubjectCode) {
  debugger
  let generateCode = ''
  if (lastChildSubjectCode) {
    let _arrayCode = []
    let lastCode
    _arrayCode = lastChildSubjectCode.split('.')
    if (_arrayCode.length > 1) {
      lastCode = parseInt(_arrayCode[_arrayCode.length - 1])
      lastCode += 1
      if (lastCode < 10) {
        _arrayCode[_arrayCode.length - 1] = '0' + lastCode
      } else {
        _arrayCode[_arrayCode.length - 1] = lastCode
      }
      generateCode = _arrayCode.join('.')
    } else {
      generateCode = lastChildSubjectCode + '.01'
    }

  }
  return generateCode
}

// 下载文件
function download(url) {
  if (!url) return
  if (url.indexOf('?') > -1) {
    url += '&token=' + getToken()
  } else {
    url += '?token=' + getToken()
  }
  window.location = url
}

// 上传文件
function upload(url) {
  if (!url) return
  if (url.indexOf('?') > -1) {
    url += '&token=' + getToken()
  } else {
    url += '?token=' + getToken()
  }
  return url
}

// 检查节点编码是否为集团.99节点
function checkIsSpecialCode(subjectItem) {
  let _isSpecialCode = false
  if (subjectItem && subjectItem.nodeSource && subjectItem.code) {
    if ((subjectItem.nodeSource === COSTENUM.subjectNodeSourceType.COMPANY || subjectItem.nodeSource === COSTENUM.subjectNodeSourceType.COMPANYLEAF) &&
      subjectItem.code.indexOf(COSTENUM.SPECIAL_SUBJECT_CODE_FLAG) > -1) {
      _isSpecialCode = true
    }
  }
  return _isSpecialCode
}

// 颜色池
function colorPool() {
  return ['red', 'orange', 'blue', 'green', 'Pink', 'Crimson']
}

export default {
  getAccountingTargetType: getAccountingTargetType,
  generateCodeLocal: generateCodeLocal,
  download: download, //下载
  upload: upload, //上传
  checkIsSpecialCode: checkIsSpecialCode,
  colorPool: colorPool
}
