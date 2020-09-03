<!--本页为tab标签-->
<template>
  <div>
    <el-tabs
      v-model="editableTabsValue"
      type="card"
      closable
      @tab-remove="removeTab"
      @tab-click="handleClickTab"
    >
      <el-tab-pane
        :key="item.name"
        v-for="item in editableTabs"
        :label="item.title"
        :name="item.name"
        :url="item.url"
      ></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: "NavTab",
  data() {
    return {
      editableTabsValue: "realMonitor",
      editableTabs: [
        {
          title: "实时监控",
          name: "realMonitor",
          url: "realMonitor"
        }
      ],
      tabIndex: 1,
      openedTab: ["realMonitor"],
      openedTitle: ""
    };
  },
  methods: {
    handleClickTab(tab) {
      console.info(tab);
      this.$store.commit("tab/changeTab", tab.name);
      this.$router.push(tab.name);
    },
    removeTab(targetName) {
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }
      this.$store.commit("tab/deductTab", targetName);
      let deductIndex = this.openedTab.indexOf(targetName);
      this.openedTab.splice(deductIndex, 1);
      this.$router.push(activeName);
      this.editableTabsValue = activeName;
      this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      if (this.openedTab.length === 0) {
        var params = { name: "realMonitor", title: "实时监控" };
        this.$store.commit("tab/addTab", params);
        this.$router.push("realMonitor");
      }
    }
  },
  computed: {
    getOpenedTab() {
      let val = this.$store.state.tab.openedTab;
      console.info(val);
      return val;
    },
    changeTab() {
      return this.$store.state.tab.activeTab;
    },
    getTitle() {
      let val = this.$store.state.tab.openedTitle;
      console.info(val);
      return val;
    }
  },
  watch: {
    getOpenedTab(val) {
      if (val.length > this.openedTab.length) {
        // 添加了新的tab页
        // 导致$store.state中的openedTab长度
        // 大于
        // 标签页中的openedTab长度
        // 因此需要新增标签页
        let newTab = val[val.length - 1]; // 新增的肯定在数组最后一个
        let title = this.$store.state.tab.openedTitle;
        ++this.tabIndex;
        this.editableTabs.push({
          title: title,
          name: newTab,
          url: newTab,
          content: ""
        });
        this.editableTabsValue = newTab;
        this.openedTab.push(newTab);
        //this.openedUrl.push(url);
        console.info(this.route);
        //this.$router.push(this.route);
      }
    },
    changeTab(val) {
      // 监听activetab以实现点击左侧栏时激活已存在的标签
      if (val !== this.editableTabsValue) {
        this.editableTabsValue = val;
      }
    },
    $route: {
      handler: function(route) {
        console.info("wqoshi");
        console.info(route);
        console.info("ssss");
      },
      immediate: true
    }
  },
  created() {
    // 刷新页面时（F11)
    // 因为<router-view>的<keep-alive>，会保留刷新时所在的router
    // 但是tab标签页因为刷新而被重构了，tab没有了
    // 因此需要将router回到index
    this.$router.push("realMonitor");
  }
};
</script>

<style scoped></style>
