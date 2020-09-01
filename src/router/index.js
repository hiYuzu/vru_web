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
    path: "/table",
    component: () => import("@/views/history/table")
  },
  {
    path: "/line",
    component: () => import("@/views/history/line")
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
        component: () => import("@/views/home/realMonitor"),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: "queryData",
        name: "queryData",
        component: () => import("@/views/home/queryData"),
        meta: {
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: "*",
    component: () => import("@/views/errorPage/404")
  }
];

const router = new Router({
  mode: "history",
  scrollBehavior: () => ({ y: 0 }),
  routes
});

export default router;
