const state = {
  queryParam: {
    deviceCode: "",
    alarmCode: "",
    time: []
  },
  statisticHeadInit: false
};
const mutations = {
  setParam(state, param) {
    state.queryParam.deviceCode = param.deviceCode;
    state.queryParam.alarmCode = param.alarmCode;
    state.queryParam.time = param.time;
  },
  setInit(state, param) {
    state.statisticHeadInit = param;
  }
};
const actions = {
  setQueryParam(context, param) {
    context.commit("setParam", param);
  },
  setHeadInit(context, isInit) {
    context.commit("setInit", isInit);
  }
};
export default {
  namespaced: true,
  state,
  mutations,
  actions
};
