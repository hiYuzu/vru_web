<template>
  <div class="home-container">
    <!--   <div class="home-text">name: 首页</div> -->
    <nav-header />
    <nav-tab />
    <keep-alive exclude="realMonitor">
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
import NavHeader from "./../../components/NavHeader.vue";
import NavTab from "./../../components/NavTab.vue";
export default {
  name: "Home",
  data() {
    return {
      activeName: "windows",
      DataList: [
        {
          label: "windows打包",
          name: "windows",
          content: "windows"
        },
        {
          label: "mac打包",
          name: "mac",
          content: "mac"
        },
        {
          label: "打包记录",
          name: "history",
          content: "history"
        },
        {
          label: "下载",
          name: "download",
          content: ""
        },
        {
          label: "程序配置",
          name: "setting",
          content: ""
        }
      ]
    };
  },
  components: { NavHeader, NavTab },
  methods: {
    handleTabsChange(tab) {
      this.$store.commit("handleTabsChange", tab.name);
    }
  }
};
</script>

<style lang="scss" scoped>
/* .home {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
} */
</style>
