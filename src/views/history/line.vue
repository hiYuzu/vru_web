<template>
  <div class="body">
    <div class="head">
      <span class="">发油库 : </span>
      <el-select
        v-model="head.institutionId"
        placeholder="请选择发油库"
        size="mini"
        @change="filterDevice"
      >
        <el-option
          v-for="item in head.institutionData"
          :key="item.label"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span class="">发油设备 : </span>
      <el-select
        v-model="head.deviceId"
        placeholder="请选择发油设备"
        size="mini"
        @change="filterThing"
      >
        <el-option
          v-for="item in head.deviceData"
          :key="item.label"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span class="">监测物质 : </span>
      <el-select v-model="head.thingCode" placeholder="请选择" size="mini">
        <el-option
          v-for="item in head.thingData"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <span class="">数据类型 : </span>
      <el-select v-model="head.dataType" size="mini">
        <el-option
          v-for="item in dataTypeData"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <span class="">时间段 : </span>
      <el-date-picker
        size="mini"
        v-model="head.time"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        class="marginLeft"
        value-format="yyyy-MM-dd HH:mm:ss"
      >
      </el-date-picker>
      <el-button type="primary" icon="el-icon-search" size="mini" @click="query"
        >搜索
      </el-button>
    </div>
    <div class="pmClass">
      <div class="tableDiv">
        <div class="box-header">
          <h3 class="box-title">历史统计数据</h3>
        </div>
        <line-echart
          :xAxisData="xAxisData"
          :seriesData="seriesData"
          :top="35"
          :bottom="5"
          :height="280"
          v-if="'line' == this.$store.state.tab.activeTab"
        ></line-echart>
      </div>
    </div>
  </div>
</template>

<script>
import lineEchart from "@/components/LineEcharts";
import { historyHeadInit, historyQuery } from "@/api/user";

export default {
  name: "historyLine",
  components: { lineEchart },
  data() {
    return {
      head: {
        institutionId: null,
        deviceId: null,
        thingCode: null,
        dataType: 2011,
        time: [],
        institutionData: [],
        deviceData: [],
        thingData: []
      },
      deviceData: [],
      thingData: [],
      deviceThingData: [],
      dataTypeData: [
        { label: "实时数据", value: 2011 },
        { label: "分钟数据", value: 2051 },
        { label: "小时数据", value: 2061 },
        { label: "每日数据", value: 2031 }
      ],
      xAxisData: [],
      seriesData: []
    };
  },
  methods: {
    init() {
      return new Promise(resolve => {
        historyHeadInit().then(res => {
          const { data } = res.data;
          this.head.institutionData = data.institutionData;
          this.deviceData = data.deviceData;
          this.thingData = data.thingData;
          this.deviceThingData = data.deviceThingData;
          this.head.institutionId = this.head.institutionData[0].value;
          this.filterDevice();
          resolve(true);
        });
      });
    },
    query() {
      if (!this.checkFormField()) {
        return;
      }
      let deviceIds = Array.of(this.head.deviceId);
      let thingCodes = Array.of(this.head.thingCode);
      let dataType = this.head.dataType;
      let time = this.head.time;
      let param = {
        deviceIds,
        thingCodes,
        dataType,
        time
      };
      historyQuery(param).then(res => {
        const { data } = res.data;
        this.xAxisData = [];
        this.seriesData = [];
        for (let result of data) {
          this.xAxisData.push(result.beginTime);
          this.seriesData.push(result.thingAvg);
        }
      });
    },
    filterDevice() {
      this.head.deviceData = [];
      this.head.deviceId = null;
      for (let device of this.deviceData) {
        if (this.head.institutionId == device.id) {
          this.head.deviceData.push(device);
        }
      }
      if (this.head.deviceData.length > 0) {
        this.head.deviceId = this.head.deviceData[0].value;
      }
      this.filterThing();
    },
    filterThing() {
      this.head.thingData = [];
      this.head.thingCode = null;

      for (let thing of this.thingData) {
        let status = false;
        for (let deviceThing of this.deviceThingData) {
          if (
            this.head.deviceId == deviceThing.deviceId &&
            deviceThing.thingId == thing.id
          ) {
            status = true;
            break;
          }
        }
        if (status) {
          this.head.thingData.push(thing);
        }
      }
      if (this.head.thingData.length > 0) {
        this.head.thingCode = this.head.thingData[0].value;
      }
    },
    checkFormField() {
      if (!this.head.institutionId) {
        alert("选择发油库");
        return false;
      }
      if (!this.head.deviceId) {
        alert("选择设备");
        return false;
      }
      if (!this.head.thingCode) {
        alert("选择监测物");
        return false;
      }
      if (this.head.time == "") {
        alert("选择时间");
        return false;
      }
      return true;
    },
    dateFormatter(str) {
      let d = new Date(str);
      let year = d.getFullYear();
      let month =
        d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
      let day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
      let hour = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
      let minute = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
      let second = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
      return (
        [year, month, day].join("-") + " " + [hour, minute, second].join(":")
      );
    }
  },
  mounted() {
    this.head.time.push(
      this.dateFormatter(new Date(new Date() - 24 * 60 * 60 * 1000))
    );
    this.head.time.push(this.dateFormatter(new Date()));
    this.init().then(() => {
      this.query();
    });
  }
};
</script>

<style scoped lang="scss">
.body {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;

  .head {
    display: flex;
    height: 50px;
    width: 100%;
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

  .pmClass {
    flex-grow: 1;
    width: 100%;

    .tableDiv {
      margin: 0px 5px;
      padding-right: 15px;
      position: relative;
      height: 700px;
      border-radius: 5px;
      border: 2px solid rgba(0, 0, 0, 0.1);
      border-top: 3px solid #87a7f9;
      background-color: #ffffff;
    }

    .box-header {
      border-bottom: 1px solid #f4f4f4;
      color: #444;
      padding: 10px;

      .box-title {
        display: inline-block;
        font-size: 18px;
        margin: 0;
        line-height: 1;
      }
    }
  }
}
</style>
