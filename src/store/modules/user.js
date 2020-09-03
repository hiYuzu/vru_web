import { login, logout, getVaildCode } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";

const state = {
  token: getToken()
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  }
};

const actions = {
  login({ commit }, userInfo) {
    const { userCode, userPassword, validCode } = userInfo;
    return new Promise((resolve, reject) => {
      login({
        userCode: userCode.trim(),
        userPassword: userPassword,
        validCode: validCode
      })
        .then(response => {
          const { status, msg, data } = response.data;
          if (status) {
            commit("SET_TOKEN", data);
            setToken(data);
            resolve();
          } else {
            reject(msg);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          commit("SET_TOKEN", "");
          removeToken();
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  resetToken({ commit }) {
    return new Promise(resolve => {
      commit("SET_TOKEN", "");
      removeToken();
      resolve();
    });
  },
  //获取验证码
  getVaildCode() {
    return new Promise((resolve, reject) => {
      getVaildCode()
        .then(response => {
          const { status, data } = response;
          if (status) {
            resolve(data);
          } else {
            reject("获取验证码失败");
          }
        })
        .catch(error => {
          console.info(error);
          reject(error);
        });
    });
  }
};
export default {
  namespaced: true,
  state,
  mutations,
  actions
};
