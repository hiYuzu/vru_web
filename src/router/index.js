import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

const routes = [
  {
    path: "/login",
    component: () => import("@/views/login/index")
  },
  {
    path: "/401",
    component: () => import("@/views/errorPage/401")
  },
  {
    path: "/",
    component: () => import("@/views/home/index")
  },
  {
    path: "*",
    component: () => import("@/views/errorPage/404")
  },
  {
    path: "/alarmData",
    component: () => import("@/views/alarmData/index")
  },
  {
    path: "/alarmStat",
    component: () => import("@/views/alarmStatistic/index")
  }
];

const router = new Router({
  mode: "history",
  scrollBehavior: () => ({ y: 0 }),
  routes
});

export default router;
