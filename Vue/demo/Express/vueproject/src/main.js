// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// import {post,get} from './request/http'

// Vue.prototype.$post = post;
// Vue.prototype.$get = get;
Vue.config.productionTip = false
// var url = process.env.BASE_API
// axios.get(url+'/product')
//   .then(function (response) {
//     console.log(response);
//   })
//   .catch(function (error) {
//     console.log(error);
//   });
  console.log(process.env)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
