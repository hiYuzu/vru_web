const state = {
  id: "123456",
  openedTab: ["realMonitor"],
  activeTab: "realMonitor",
  openedTitle: "实时监控"
};

const mutations = {
  addTab(state, params) {
    var name = params.name;
    var title = params.title;
    state.openedTab.push(name);
    state.openedTitle = title;
  },
  changeTab(state, name) {
    state.activeTab = name;
  },
  deductTab(state, name) {
    let index = state.openedTab.indexOf(name);
    state.openedTab.splice(index, 1);
  }
};

export default {
  namespaced: true,
  state,
  mutations
};
