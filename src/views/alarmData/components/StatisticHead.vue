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
    <el-select
      v-model="queryParam.deviceCode"
      clearable
      placeholder="请选择"
      size="mini"
    >
      <el-option
        v-for="item in deviceData"
        :key="item.label"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <span class="">报警类型：</span>
    <el-select
      v-model="queryParam.alarmCode"
      clearable
      placeholder="请选择"
      size="mini"
    >
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
  getAlarmShowData,
  getAuthorityDeviceHead
} from "@/api/user";
import { getDay } from "@/utils/date.js";
export default {
  name: "StatisticHead",
  data: function() {
    return {
      institutionId: "",
      queryParam: {
        deviceCode: "",
        alarmCode: "",
        time: []
      },
      institutionData: [],
      deviceData: [],
      thingData: [],
      alarmData: [
        { label: "气液比", value: "QYB" },
        { label: "流量比", value: "LLB" },
        { label: "浓度值", value: "ND" },
        { label: "压力值", value: "YL" },
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
            this.institutionId = this.institutionData[0].value;
            this.getAuthorityDeviceHead();
          } else {
            this.$message.error("初始化查询失败！");
          }
        })
        .catch(() => {
          this.$message.error("数据查询异常！");
        });
      this.query();
    },
    getAuthorityDeviceHead() {
      let params = {
        institutionId: this.institutionId
      };
      getAuthorityDeviceHead(params)
        .then(response => {
          if (response.data.status) {
            this.deviceData = response.data.data;
            this.queryParam.deviceCode = this.deviceData[0].value;
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
      let queryParams = this.$store.state.statistic.queryParam;
      if (queryParams.time.length == 0) {
        this.$message.error("查询条件不明确");
        return;
      }
      let param = {};
      param.deviceCode = queryParams.deviceCode;
      param.alarmCode = queryParams.alarmCode;
      param.beginTime = queryParams.time[0];
      param.endTime = queryParams.time[1];
      let allTableData = [];
      getAlarmShowData(param).then(response => {
        if (response.data.status) {
          allTableData = response.data.data;
          if (allTableData.length > 0) {
            this.exportData(allTableData);
          } else {
            this.$message.warning("无数据");
          }
        }
      });
    },
    exportData(allTableData) {
      let wb = this.$XLSX.utils.book_new();
      let tableArr = [
        {
          institution: "发油库",
          deviceName: "发油设备",
          institutionAddress: "发油库区域",
          alarmName: "告警名称",
          levelName: "预警报警",
          alarmInfo: "告警信息",
          alarmTime: "告警时间"
        }
      ];
      allTableData.forEach(item => {
        tableArr.push({
          institution: item.institution,
          deviceName: item.deviceName,
          institutionAddress: item.institutionAddress,
          alarmName: item.alarmName,
          levelName: item.levelName,
          alarmInfo: item.alarmInfo,
          alarmTime: item.alarmTime
        });
      });
      var ws = this.$XLSX.utils.json_to_sheet(tableArr, {
        header: [
          "institution",
          "deviceName",
          "institutionAddress",
          "alarmName",
          "levelName",
          "alarmInfo",
          "alarmTime"
        ],
        skipHeader: true
      });
      this.$XLSX.utils.book_append_sheet(wb, ws, "sheetName");
      var wbout = this.$XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        this.$FileSaver.saveAs(
          new Blob([wbout], {
            type: "application/octet-stream"
          }),
          "告警统计.xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    }
  },
  mounted() {
    this.queryParam.time = [getDay(-1), getDay(0)];
    this.init();
  }
};
</script>
<style lang="scss">
.head {
  @extend .flexBox !optional;
  flex-wrap: wrap;
  padding: 0px 0px 15px;
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
