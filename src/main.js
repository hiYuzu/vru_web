import Vue from "vue";
import Element from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "@/styles/index.scss";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/permission";
import echarts from "echarts";
import FileSaver from "file-saver";
import XLSX from "xlsx";

Vue.use(Element);
Vue.config.productionTip = false;
Vue.prototype.$echarts = echarts;
Vue.prototype.$FileSaver = FileSaver;
Vue.prototype.$XLSX = XLSX;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
