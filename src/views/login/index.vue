<template>
  <div id="login" :style="{ backgroundPosition: -offsetbg + 'px 0px' }">
    <div id="mainBody">
      <div
        :style="{ backgroundPosition: offset1 + 'px 80px' }"
        class="cloud"
      ></div>
      <div
        :style="{ zIndex: 2, backgroundPosition: offset2 + 'px 490px' }"
        class="cloud"
      ></div>
    </div>
    <!--   <div class="logintop">
      <span>欢迎登录油气回收在线监测系统</span>
    </div> -->
    <div class="loginbody">
      <span style="height: 100px"></span>
      <div class="logintop">
        <span>欢迎登录油气回收在线监测系统</span>
      </div>
      <div class="loginbox">
        <div class="twobar">
          <a href="javascript:;" class="twobar-item twobar-item-android"
            ><span class="twobar-layer"></span
          ></a>
          <a href="javascript:;" class="twobar-item twobar-item-apple">
            <span class="twobar-layer"></span>
          </a>
        </div>
        <ul>
          <!-- #426666 -->
          <li
            data-v-37dfd6fc=""
            style="color:#fff;font-weight:bold;margin-bottom:5px;"
          >
            <label>用户登录</label>
          </li>
          <li>
            <div class="form-message"></div>
          </li>
          <li>
            <input type="text" v-model="loginForm.userCode" class="loginuser" />
          </li>
          <li>
            <input
              type="password"
              v-model="loginForm.userPassword"
              class="loginpwd"
              @keyup.enter="logins"
            />
          </li>
          <li id="drag_wrap" class="fm-item">
            <valid-code
              status="status"
              :successFun="onMpanelSuccess"
              :errorFun="onMpanelError"
            ></valid-code>
          </li>
          <li style="margin-top:30px;">
            <button type="submit" class="loginbtn" @click="logins">
              登录
            </button>
          </li>
        </ul>
      </div>
    </div>
    <div class="loginbm">
      CopyRight © 2019-2050 By 天津七一二通信广播股份有限公司
    </div>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import ValidCode from "./../../components/ValidCode.vue";
var checkStatus = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("请拖动滑块完成验证"));
  } else {
    callback();
  }
};
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        userCode: "",
        userPassword: "",
        validCode: ""
      },
      redirect: undefined,
      otherQuery: {},
      offset1: 450,
      offset2: 0,
      offsetbg: 0,
      mainwidth: 1600,
      status: [{ validator: checkStatus, trigger: "change" }]
    };
  },
  components: { ValidCode },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true
    }
  },
  mounted: function() {
    let token = getToken();
    if (token) {
      this.$router.push("/");
    }
    /*  setInterval(this.cloud1, 70);
    setInterval(this.cloud2, 90); */
  },
  methods: {
    logins: function() {
      if (
        this.loginForm.userCode === "" ||
        this.loginForm.userPassword === ""
      ) {
        this.$message.error("账号或密码不能为空");
        return;
      }
      if (this.loginForm.validCode === "") {
        this.$message.error("请拖住滑块，拖动到最右边，进行验证");
        return;
      } else {
        this.$store
          .dispatch("user/login", this.loginForm)
          .then(() => {
            this.$router.push({
              path: this.redirect || "/",
              query: this.otherQuery
            });
          })
          .catch(error => {
            this.$message.error(error);
          });
      }
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    },
    cloud1() {
      if (this.offset1 >= this.mainwidth) {
        this.offset1 = -580;
      }
      if (this.offset2 >= this.mainwidth) {
        this.offset2 = -580;
      }
      this.offset1 += 1.1;
      this.offset2 += 1;
    },
    cloud2() {
      if (this.offsetbg >= this.mainwidth) {
        this.offsetbg = -580;
      }
      this.offsetbg += 0.9;
    },
    onMpanelError() {},
    onMpanelSuccess() {
      this.$store
        .dispatch("user/getVaildCode", this.loginForm)
        .then(res => {
          this.loginForm.validCode = res;
        })
        .catch(error => {
          this.$message.error(error);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
ul {
  display: block;
  margin: 0;
  padding: 0;
  list-style: none;
}

li {
  display: block;
  margin: 0;
  padding: 0;
  list-style: none;
}

img {
  border: 0;
}

#login {
  /* background: {
    color: #5f89f7;
    image: url(~@/assets/images/login/light.png);
    repeat: no-repeat;
  } */
  height: 100%;
  display: flex;
  overflow: hidden;
  #mainBody {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 101;
    .cloud {
      position: absolute;
      top: 0px;
      left: 0px;
      width: 100%;
      height: 100%;
      background: {
        image: url(~@/assets/images/login/cloud.png);
        repeat: no-repeat;
      }
      opacity: 0.5;
    }
  }
  .logintop {
    height: 47px;
    position: absolute;
    top: 0%;
    /*  background: url(~@/assets/images/login/loginbg1.png) repeat-x; */
    background: #5a79ba /*  #426666 */;
    z-index: 100;
    width: 100%;
    span {
      color: #fff;
      line-height: 47px;
      background: url(~@/assets/images/login/loginsj.png) no-repeat 21px 18px;
      text-indent: 44px;
      color: #fff;
      float: left;
    }
  }
  .loginbody {
    background: url(~@/assets/images/login/bg-login-1.jpg) no-repeat center
      center;
    width: 100%;
    height: 685px;
    overflow: hidden;
    position: absolute;
    top: 15%;
    /* margin-top: -430px; */
    z-index: 101;
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    justify-content: center;
    align-items: center;
    .loginbox {
      width: 850px;
      height: 500px;
      margin-left: 380px;
      /*   background: url(~@/assets/images/login/logininfo2.png) no-repeat; */
      ul {
        margin-top: 50px;
        margin-left: 475px;
        padding: 30px;
        border-radius: 10px;
        background: rgba(221, 235, 199, 0.3);
        box-shadow: 0px 0px 20px 4px #5a79ba /* #b5b5b5 */;
        li {
          margin-bottom: 25px;
          .form-message {
            height: 30px;
            width: 60%;
            margin-left: auto;
            margin-right: auto;
            text-align: left;
            float: left;
          }
          .loginuser {
            width: 299px;
            height: 47px;
            background: url(~@/assets/images/login/loginuser.png) no-repeat;
            border: none;
            line-height: 48px;
            padding-left: 44px;
            font-size: 14px;
            font-weight: bold;
          }
          .loginpwd {
            width: 299px;
            height: 47px;
            background: url(~@/assets/images/login/loginpassword.png) no-repeat;
            border: none;
            line-height: 48px;
            padding-left: 44px;
            font-size: 14px;
            color: #90a2bc;
          }
          .loginbtn {
            width: 299px;
            height: 40px;
            /*       background: url(~@/assets/images/login/buttonbg.png) repeat-x; */
            /*  background: #6e9ef8; */
            background: #5a79ba /* #426666 */;
            font-size: 14px;
            font-weight: bold;
            color: #fff;
            cursor: pointer;
            line-height: 40px;
            border: none;
          }
        }
      }
    }
  }
  .loginbm {
    height: 50px;
    line-height: 50px;
    text-align: center;
    background: url(~@/assets/images/login/loginbg2.png) repeat-x;
    position: absolute;
    bottom: 0px;
    width: 100%;
    color: #ffffff;
  }
  .imgClass {
    background: url(~@/assets/images/login/download_android.png) no-repeat;
    background-size: cover;
    width: 100px;
    height: 100px;
    margin: 0 auto;
    border: 1px solid #666;
    position: absolute;
    right: 20px;
    bottom: 70px;
  }
}
/*悬浮窗口*/
.twobar-item {
  background: url(~@/assets/images/login/pull_2.gif) no-repeat;
}
.twobar-layer {
  background: url(~@/assets/images/login/toolbar.png) no-repeat;
}
.twobar {
  display: block;
  position: absolute;
  z-index: 999999999;
  right: 1px;
  top: 0;
  margin-right: -6px;
  cursor: pointer;
  transition: all 0.3s ease;
} /*假设网页宽度为1200px，导航条在右侧悬浮*/
.twobar-item {
  display: block;
  width: 62px;
  height: 82px;
  margin-top: 1px;
}
.twobar-item:hover .twobar-layer {
  opacity: 1;
  filter: alpha(opacity=100);
  transform: scale(1);
  -webkit-transform: scale(1);
  -moz-transform: scale(1);
  -ms-transform: scale(1);
  -o-transform: scale(1);
}
.twobar-item-android .twobar-layer {
  height: 420px;
  background-position: 0 0;
}
.twobar-item-apple {
  background-position: 0 -550px;
}
.twobar-item-apple:hover {
  background-position: 0 -612px;
}
.twobar-item-apple .twobar-layer {
  height: 194px;
  background-position: 0 -222px;
}
.twobar-layer {
  position: absolute;
  right: -10px;
  bottom: -300px; /* -243px; */
  width: 172px;
  opacity: 0;
  filter: alpha(opacity=0);
  transform-origin: 95% 95%;
  -moz-transform-origin: 95% 95%;
  -ms-transform-origin: 95% 95%;
  -o-transform-origin: 95% 95%;
  -webkit-transform-origin: 95% 95%;
  transform: scale(0.01);
  -moz-transform: scale(0.01);
  -ms-transform: scale(0.01);
  -o-transform: scale(0.01);
  -webkit-transform: scale(0.01);
  transition: all 1s;
  -moz-transition: all 1s;
  -ms-transition: all 1s;
  -o-transition: all 1s;
  -webkit-transition: all 1s;
}

#drag_wrap {
  width: 300px; /*300px*/
  height: 35px;
  position: relative;
  background: #e8e8e8;
  margin: 20px 0px; /*300px auto*/
}
</style>
