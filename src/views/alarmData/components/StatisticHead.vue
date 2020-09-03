<template>
  <div class="head">
    <span class="">发油库: </span>
    <el-select
      v-model="institutionId"
      placeholder="请选择"
      size="mini"
      @change="getAuthorityDeviceHead"
    >
      <el-option
        v-for="item in institutionData"
        :key="item.label"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <span class="">设备: </span>
    <el-select v-model="queryParam.deviceCode" placeholder="请选择" size="mini">
      <el-option
        v-for="item in deviceData"
        :key="item.label"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <span class="">报警类型：</span>
    <el-select v-model="queryParam.alarmCode" placeholder="请选择" size="mini">
      <el-option
        v-for="item in alarmData"
        :key="item.label"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <span class="">时间段: </span>
    <el-date-picker
      size="mini"
      v-model="queryParam.time"
      type="datetimerange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
    >
    </el-date-picker>
    &nbsp;
    <el-button type="primary" icon="el-icon-search" size="mini" @click="query"
      >搜索
    </el-button>
    <el-button
      type="primary"
      icon="el-icon-refresh-right"
      size="mini"
      @click="init"
      >重置
    </el-button>
    <el-button
      type="primary"
      icon="el-icon-receiving"
      size="mini"
      @click="exportExcel"
      >导出到Excel
    </el-button>
  </div>
</template>
<script>
import {
  getInstitutionHead,
  exportExcel,
  getAuthorityDeviceHead
} from "@/api/user";
export default {
  name: "StatisticHead",
  data: function() {
    return {
      institutionId: "",
      queryParam: {
        deviceCode: "",
        alarmCode: "",
        time: ["2020-06-01 15:33:26", "2020-06-30 13:28:45"]
      },
      institutionData: [],
      deviceData: [],
      thingData: [],
      alarmData: [
        { label: "气液比", value: "GLR" },
        { label: "压力", value: "PRE" },
        { label: "NMHC浓度", value: "NMHC" },
        { label: "断开连接", value: "O" }
      ]
    };
  },
  methods: {
    init() {
      getInstitutionHead()
        .then(response => {
          if (response.data.status) {
            this.institutionData = response.data.data;
          } else {
            this.$message.error("初始化查询失败！");
          }
        })
        .catch(() => {
          this.$message.error("数据查询异常！");
        });
    },
    getAuthorityDeviceHead() {
      let params = {
        institutionId: this.institutionId
      };
      getAuthorityDeviceHead(params)
        .then(response => {
          if (response.data.status) {
            this.deviceData = response.data.data;
          }
        })
        .catch(() => {
          this.$message.error("设备查询异常！");
        });
    },
    setQueryParam(value) {
      this.$store.dispatch("statistic/setQueryParam", value);
    },
    setHeadInit(value) {
      this.$store.dispatch("statistic/setHeadInit", value);
    },
    query() {
      this.setQueryParam(this.queryParam);
      this.setHeadInit(true);
      this.$bus.emit("queryStatistics");
    },
    exportExcel() {
      if (this.isEdge()) {
        this.$message.error("抱歉！Edge浏览器无法下载文件！");
        return false;
      }
      let queryParams = this.$store.state.statistic.queryParam;
      let param = {};
      param.deviceCode = queryParams.deviceCode;
      param.alarmCode = queryParams.alarmCode;
      param.thingCode = queryParams.thingCode;
      param.time = queryParams.time;
      param.type = "excel_alarm";
      let fileName = "报警统计.xls";
      //发送请求
      exportExcel(param).then(res => {
        const blob = new Blob([res]);
        if ("download" in document.createElement("a")) {
          // 非IE下载
          const elink = document.createElement("a");
          elink.download = fileName;
          elink.style.display = "none";
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          // 释放URL对象
          URL.revokeObjectURL(elink.href);
          document.body.removeChild(elink);
        } else {
          // IE10+下载
          navigator.msSaveBlob(blob, fileName);
        }
      });
    },
    isEdge() {
      let flag = false;
      // 取得浏览器的userAgent字符串
      let userAgent = navigator.userAgent;
      if (userAgent.indexOf("Edge") > -1) {
        flag = true;
      }
      return flag;
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style lang="scss">
.head {
  @extend .flexBox !optional;
  flex-wrap: wrap;
  padding: 5px 0px;
  align-items: center;
  > span {
    margin-left: 10px;
    color: #8492a6;
    font-size: 13px;
  }
  .el-select {
    width: 150px;
    margin-left: 5px;
    position: relative;
  }
  .el-date-editor.el-input__inner {
    margin-left: 5px !important;
    width: 350px !important;
  }
  .marginLeft {
    margin-right: 20px;
  }
  .el-button--mini {
    font-size: 13px !important;
  }
}
</style>
