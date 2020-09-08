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
    component: () => import("@/views/home/index"),
    children: [
      {
        path: "realMonitor",
        name: "realMonitor",
        component: () => import("@/views/realMonitor/index"),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: "line",
        name: "line",
        component: () => import("@/views/history/line"),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: "table",
        name: "table",
        component: () => import("@/views/history/table"),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: "alarmData",
        name: "alarmData",
        component: () => import("@/views/alarmData/index"),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: "alarmStatistic",
        name: "alarmStatistic",
        component: () => import("@/views/alarmStatistic/index"),
        meta: {
          requiresAuth: true
        }
      }
    ]
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
