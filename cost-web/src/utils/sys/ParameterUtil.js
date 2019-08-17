import { setLocalItem, getLocalItem, Constants } from '@/utils/common/cache'
import { getAllParameters } from '@/api/sys/paramAPI'

export function getAllParameter() {
  try {
    getAllParameters().then(response => {
      const data = response.data
      setLocalItem(Constants.PARAMETERS, JSON.stringify(data))
    }).catch(error => {
      console.log(error)
    })
  } catch (e) {
    console.log(e)
  }
}

export function getValueByKey(key) {
  let value
  const data = JSON.parse(getLocalItem(Constants.PARAMETERS))
  if (data) {
    const parameter = data.find(item => item.parameterKey === key)
    value = parameter.parameterValue
  }
  return value
}

export function getParameterByKey(key) {
  let parameter
  const data = JSON.parse(getLocalItem(Constants.PARAMETERS))
  if (data) {
    parameter = data.find(item => item.parameterKey === key)
  }
  return parameter
}
