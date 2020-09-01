<template>
  <el-header>
    <div class="header_logo">
      <img
        src="../assets/images/home/logox.png"
        style="height:30px;width:60px;float: left;    
        filter:drop-shadow(#000 0px 2px 2px);
        -webkit-filter: drop-shadow(#000 0px 2px 2px);"
      />
      <span class="hTitle">油气回收在线监测系统</span>
    </div>
    <div class="header_menu">
      <ul>
        <li class="list" @click="clickMenu('realMonitor')">
          <router-link :to="{ name: 'realMonitor' }">
            <img
              src="../assets/images/home/RealMonitoring.png"
              style="width: 32px; height: 32px"
            /><br />实时监测
          </router-link>
        </li>

        <li class="list" style="display: inline">
          <router-link :to="{ name: 'dataAud' }">
            <img
              src="../assets/images/home/sjsh.png"
              style="width: 32px; height: 32px"
            /><br />数据查询
          </router-link>
        </li>
        <li class="list" style="display: inline">
          <router-link :to="{ name: 'home' }">
            <img
              src="../assets/images/home/dbfx.png"
              style="width: 32px; height: 32px"
            /><br />数据分析
          </router-link>
        </li>
        <li class="list" style="display: none">
          <router-link :to="{ name: 'home' }">
            <img
              src="../assets/images/home/Accueil.png"
              style="width: 32px; height: 32px"
            /><br />帮助中心
          </router-link>
        </li>
        <li class="list" @click="logout">
          <a>
            <span class="c4"></span>
            安全退出
          </a>
        </li>
      </ul>
    </div>
  </el-header>
</template>

<script>
import { removeToken } from "./../utils/auth.js";
export default {
  name: "NavHeader",
  data() {
    return {
      openedTab: []
    };
  },
  methods: {
    logout: function() {
      removeToken();
      this.$router.push("/login");
    },
    clickMenu(componentName) {
      this.openedTab = this.$store.state.openedTab;
      // tabNum 为当前点击的列表项在openedTab中的index，若不存在则为-1
      let tabNum = this.openedTab.indexOf(componentName);
      if (tabNum === -1) {
        // 该标签当前没有打开
        // 将componentName加入到已打开标签页state.openedTab数组中
        this.$store.commit("addTab", componentName);
      } else {
        // 该标签是已经打开过的，需要激活此标签页
        this.$store.commit("changeTab", componentName);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.flexBox {
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
}
.el-header {
  background-color: #5f89f7;
  height: 70px !important;
  padding: 0 0 !important;
  .hTitle {
    font-size: 20px;
    font-weight: bold;
    margin-top: -10px;
    margin-left: 5px;
    color: #fff;
    text-shadow: 5px 2px 4px #000;
  }
  @extend .flexBox;
  .header_logo {
    /*  flex-basis: 53px; */
    margin-top: 20px;
    margin-left: 10px;
  }
  .header_menu {
    flex-grow: 1;
    margin-right: 8px;
    ul {
      @extend .flexBox;
      justify-content: flex-end;
      list-style: none;
      padding-right: 10px;
      margin: 0;
      li {
        margin-top: 4px;
        padding: 0;
        a {
          cursor: pointer;
          display: inline-block;
          width: 80px;
          text-align: center;
          height: 62px;
          padding: 5px 7px 5px;
          text-decoration: none;
          font-size: 12px;
          color: #fff;
          text-shadow: 0px -1px rgba(0, 0, 0, 0.2);
          border-radius: 3px;
          overflow: hidden;
          border-radius: 5px;
          &:hover {
            background: rgba(0, 0, 0, 0.25);
          }
          .c4 {
            background: url(../assets/images/home/n4.png) no-repeat;
            display: block;
            margin: 0px auto 3px;
            width: 32px;
            height: 32px;
            overflow: hidden;
          }
        }
        /* .router-link-active {
          background: rgba(0, 0, 0, 0.25);
        } */
      }
    }
  }
}
</style>
