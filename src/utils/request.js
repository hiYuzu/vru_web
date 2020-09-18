import axios from "axios";
import { MessageBox, Message } from "element-ui";
import store from "@/store";
import { getToken } from "@/utils/auth";
import qs from "qs";
import { headersTokenKey } from "@/config";

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
});

service.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded;charset=UTF-8";

service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers[headersTokenKey] = getToken();
    }
    return config;
  },
  error => {
    console.log(error);
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  response => {
    const res = response;
    return res;
  },
  error => {
    const status = error.response.status;
    if (status === 400 || status === 401 || status === 403 || status === 404) {
      MessageBox.confirm(
        "您已注销，您可以取消停留在此页面，或重新登录",
        "确认注销",
        {
          confirmButtonText: "重新登录",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        store.dispatch("user/resetToken").then(() => {
          location.reload();
        });
      });
    } else {
      Message({
        message: error.message,
        type: "error",
        duration: 5 * 1000
      });
    }
  }
);

export function get(url, params) {
  return service.get(url, params);
}

export function post(url, params) {
  return service.post(url, qs.stringify(params, { arrayFormat: "repeat" }));
}

export function postImage(url, params) {
  return service.post(url, params, {
    headers: { "Content-Type": "multipart/form-data" }
  });
}
