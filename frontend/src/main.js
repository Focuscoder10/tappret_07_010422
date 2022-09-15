import Vue from 'vue';
import App from './App.vue';
import router from './router';
import VueMeta from 'vue-meta';

import '@fortawesome/fontawesome-free/css/all.css';
import '@fontsource/lato';
import store from './store';

Vue.config.productionTip = false;

Vue.use(VueMeta);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
