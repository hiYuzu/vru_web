import Vue from "vue";
import Element from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "@/styles/index.scss";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/permission";
import VueBus from "vue-bus";
import Echarts from "echarts";
import "echarts/lib/chart/line";
import "echarts/lib/chart/bar";
import "echarts/lib/chart/pie";
import "echarts/theme/macarons";
Vue.use(Element);
Vue.use(VueBus);
Vue.use(Echarts);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
