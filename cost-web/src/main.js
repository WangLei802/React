import 'babel-polyfill'
import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import 'element-ui/lib/theme-chalk/index.css'
import 'vue-easytable/libs/themes-base/index.css'
import '@/styles/index.scss' // global css
import '@/icons' // icon
import '@/router/permission' // permission control
import {
  VTable,
  VPagination
} from 'vue-easytable'
import 'font-awesome/scss/font-awesome.scss'
// import Print from 'vue-print-nb'
// Vue.use(Print);
// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)

// 自定义组件
import FButton from './components/sys/Button/f-button.vue'
import FInput from './components/sys/Input/f-input.vue'
import FDLabel from './components/sys/DictionaryLabel/fd-label'
import FDSelect from './components/sys/DictionarySelect/fd-select'
import FDRadio from './components/sys/DictionaryRadio/fd-radio'
import FDCheckBox from './components/sys/DictionaryCheckBox/fd-checkbox'
import FUpload from './components/sys/Upload/f-upload'
import FImageUpload from './components/sys/Upload/f-image-upload'
import FFileUpload from './components/sys/Upload/f-file-upload'
import FDJson from './components/sys/JsonEditor/fd-json'
import FdApplicationSelect from './components/platform/ApplicationSelect/fd-applicationselect'

Vue.component(VTable.name, VTable)
Vue.component(VPagination.name, VPagination)
Vue.component('f-button', FButton)
Vue.component('f-input', FInput)
Vue.component(FDLabel.name, FDLabel)
Vue.component(FDSelect.name, FDSelect)
Vue.component(FDRadio.name, FDRadio)
Vue.component(FDCheckBox.name, FDCheckBox)
Vue.component(FUpload.name, FUpload)
Vue.component(FImageUpload.name, FImageUpload)
Vue.component(FFileUpload.name, FFileUpload)
Vue.component(FDJson.name, FDJson)
Vue.component(FdApplicationSelect.name, FdApplicationSelect)

// 组件封装
import input from './components/common/Input/mt-input.vue'
import searchForm from './components/common/searchForm/mt-searchform.vue'
import table from './components/common/table/mt-table.vue'
import date from './components/common/date/mt-date'
import pagination from './components/common/pagination/mt-pagination'

Vue.component('mt-input', input)
Vue.component('mt-searchform', searchForm)
Vue.component('mt-table', table)
Vue.component('mt-date', date)
Vue.component('mt-pagination', pagination)


// global js
import '@/utils/common/date.js'
import '@/utils/common/utils.js'
import '@/utils/sys/DictUtil.js'
import Print from '@/utils/common/print'
Vue.use(Print)
import {
  beforeLoginPrepare
} from '@/config/beforeLoginPrepare.js'
beforeLoginPrepare()
import {
  initSys
} from '@/config/sys.js'
initSys()
Vue.config.productionTip = false
