// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App';
import goods from 'components/goods/goods';
import ratings from 'components/ratings/ratings';
import seller from 'components/seller/seller';

import 'common/stylus/index.styl';

// 路由映射组件
const routes = [
  { path: '/goods', component: goods },
  { path: '/ratings', component: ratings },
  { path: '/seller', component: seller }
];

// 创建实例并传给routes
var router = new VueRouter({
  routes
});

// 模块化机制编程，导入Vue和VueRouter，要调用Vue.use(VueRouter)
// 全局注册
Vue.use(VueRouter);
Vue.use(VueResource);

// 默认组件
router.push('/goods');

// 创建和挂载根实例
var app = new Vue({
  template: '<App/>',
  components: { App },
  router: router
});
app.$mount('#app');

