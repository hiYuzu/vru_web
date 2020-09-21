<template>
  <div class="index_body" style="overflow-y:auto;overflow-x:hidden;">
    <div class="head">
      <span class="">时间段: </span>
      <el-date-picker
        size="mini"
        v-model="time"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['00:00:00', '23:59:59']"
      >
      </el-date-picker>
      &nbsp;
      <el-button
        type="primary"
        icon="el-icon-search"
        size="mini"
        @click="initQuery"
        >搜索
      </el-button>
    </div>
    <div class="div_chart">
      <el-col :span="12">
        <div class="body1">
          <div class="box-header">
            <h3 class="box-title">警报占比</h3>
            <div class="chartHead">
              <el-radio-group v-model="levelOfPie" size="mini">
                <el-radio-button label="1">预警</el-radio-button>
                <el-radio-button label="2">报警</el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div class="box-body">
            <pie-echarts
              :legendData="chart1.legendData"
              :seriesData="chart1.seriesData"
            ></pie-echarts>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="body2">
          <div class="box-header">
            <h3 class="box-title">
              警报排名
            </h3>
            <div class="chartHead">
              <el-radio-group v-model="levelOfBar" size="mini">
                <el-radio-button label="1">预警</el-radio-button>
                <el-radio-button label="2">报警</el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div class="box-body">
            <bar-echarts
              :xAxisData="chart2.xAxisData"
              :seriesData="chart2.seriesData"
            ></bar-echarts>
          </div>
        </div>
      </el-col>
    </div>
    <div class="div_chart">
      <el-col :span="12">
        <div class="body2">
          <div class="box-header">
            <h3 class="box-title">预警统计</h3>
            <div class="chartHead">
              <span class="">发油库: </span>
              <el-select
                v-model="institutionIdOfWarn"
                placeholder="请选择"
                size="mini"
                @change="getWarnDeviceHead"
              >
                <el-option
                  v-for="item in institutionData"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              &nbsp;
              <span>设备: </span>
              <el-select
                v-model="deviceCodeOfWarn"
                placeholder="请选择"
                size="mini"
              >
                <el-option
                  v-for="item in deviceDataOfWarn"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              &nbsp;
              <el-button
                type="primary"
                icon="el-icon-refresh-right"
                size="mini"
                @click="getWarnStat"
                >刷新
              </el-button>
            </div>
          </div>
          <div class="box-body">
            <muti-bar-echarts
              :xAxisData="chart3.xAxisData"
              :seriesData="chart3.seriesData"
            ></muti-bar-echarts>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="body1">
          <div class="box-header">
            <h3 class="box-title">报警统计</h3>
            <div class="chartHead">
              <span class="">发油库: </span>
              <el-select
                v-model="institutionIdOfAlarm"
                placeholder="请选择"
                size="mini"
                @change="getAlarmDeviceHead"
              >
                <el-option
                  v-for="item in institutionData"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              &nbsp;
              <span>设备: </span>
              <el-select
                v-model="deviceCodeOfAlarm"
                placeholder="请选择"
                size="mini"
              >
                <el-option
                  v-for="item in deviceDataOfAlarm"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              &nbsp;
              <el-button
                type="primary"
                icon="el-icon-refresh-right"
                size="mini"
                @click="getAlarmStat"
                >刷新
              </el-button>
            </div>
          </div>
          <div class="box-body">
            <muti-bar-echarts
              :xAxisData="chart4.xAxisData"
              :seriesData="chart4.seriesData"
            ></muti-bar-echarts>
          </div>
        </div>
      </el-col>
    </div>
  </div>
</template>
<script>
import PieEcharts from "./components/PieEcharts.vue";
import BarEcharts from "./components/BarEcharts.vue";
import MutiBarEcharts from "./components/MutiBarEcharts";
import {
  getInstitutionHead,
  getAuthorityDeviceHead,
  getAlarmPercent,
  getAlarmRank,
  getAlarmStatistic
} from "@/api/user";
import { getDay } from "@/utils/date.js";
export default {
  name: "AlarmStatistic",
  components: { PieEcharts, BarEcharts, MutiBarEcharts },
  data() {
    return {
      time: [],
      levelOfPie: "1",
      levelOfBar: "1",
      institutionData: [],
      institutionIdOfWarn: "",
      institutionIdOfAlarm: "",
      deviceCodeOfWarn: "",
      deviceCodeOfAlarm: "",
      deviceDataOfWarn: [],
      deviceDataOfAlarm: [],
      chart1: {
        legendData: ["气液比", "压力值", "浓度值", "流量比", "断开连接"],
        seriesData: []
      },
      chart2: {
        xAxisData: [],
        seriesData: [
          {
            name: "警报次数",
            type: "bar",
            barWidth: "60%",
            data: []
          }
        ]
      },
      chart3: {
        xAxisData: [],
        seriesData: []
      },
      chart4: {
        xAxisData: [],
        seriesData: []
      }
    };
  },
  methods: {
    initQuery() {
      getInstitutionHead()
        .then(response => {
          if (response.data.status) {
            this.institutionData = response.data.data;
            this.institutionIdOfWarn = this.institutionData[0].value;
            this.getWarnDeviceHead();
            this.institutionIdOfAlarm = this.institutionIdOfWarn;
            this.getAlarmDeviceHead();
          } else {
            this.$message.error("初始化查询失败！");
          }
        })
        .catch(() => {
          this.$message.error("数据查询异常！");
        });
      this.queryPercent();
      this.queryRank();
    },
    queryPercent() {
      let param = {
        levelNo: this.levelOfPie,
        beginTime: this.time[0],
        endTime: this.time[1]
      };
      getAlarmPercent(param)
        .then(response => {
          if (response.data.status) {
            let data = response.data.data;
            this.chart1.seriesData = [
              {
                name: "气液比",
                value: data.QYB
              },
              {
                name: "压力值",
                value: data.YL
              },
              {
                name: "浓度值",
                value: data.ND
              },
              {
                name: "流量比",
                value: data.LLB
              },
              {
                name: "断开连接",
                value: data.O
              }
            ];
          }
        })
        .catch(() => {
          this.$message.error("查询警报类型占比失败");
        });
    },
    queryRank() {
      let param = {
        levelNo: this.levelOfBar,
        beginTime: this.time[0],
        endTime: this.time[1]
      };
      getAlarmRank(param)
        .then(response => {
          if (response.data.status) {
            let data = response.data.data;
            this.chart2.xAxisData = data.xAxisData;
            this.chart2.seriesData[0].data = data.seriesData;
          }
        })
        .catch(() => {
          this.$message.error("查询警报排名失败");
        });
    },
    getWarnDeviceHead() {
      let param = { institutionId: this.institutionIdOfWarn };
      getAuthorityDeviceHead(param)
        .then(response => {
          if (response.data.status) {
            this.deviceDataOfWarn = response.data.data;
            this.deviceCodeOfWarn = this.deviceDataOfWarn[0].value;
            this.getWarnStat();
          }
        })
        .catch(() => {
          this.$message.error("设备查询异常！");
        });
    },
    getAlarmDeviceHead() {
      let param = { institutionId: this.institutionIdOfAlarm };
      getAuthorityDeviceHead(param)
        .then(response => {
          if (response.data.status) {
            this.deviceDataOfAlarm = response.data.data;
            this.deviceCodeOfAlarm = this.deviceDataOfAlarm[0].value;
            this.getAlarmStat();
          }
        })
        .catch(() => {
          this.$message.error("设备查询异常！");
        });
    },
    getWarnStat() {
      if (this.deviceCodeOfWarn == "") {
        this.$message.error("请选择设备！");
        return;
      }
      let param = {
        levelNo: "1",
        deviceCode: this.deviceCodeOfWarn,
        beginTime: this.time[0],
        endTime: this.time[1]
      };
      getAlarmStatistic(param)
        .then(response => {
          if (response.data.status) {
            let data = response.data.data;
            this.chart3.xAxisData = data.xAxisData;
            this.chart3.seriesData = data.seriesData;
          }
        })
        .catch(() => {
          this.$message.error("查询预警统计失败");
        });
    },
    getAlarmStat() {
      if (this.deviceCodeOfAlarm == "") {
        this.$message.error("请选择设备！");
        return;
      }
      let param = {
        levelNo: "2",
        deviceCode: this.deviceCodeOfAlarm,
        beginTime: this.time[0],
        endTime: this.time[1]
      };
      getAlarmStatistic(param)
        .then(response => {
          if (response.data.status) {
            let data = response.data.data;
            this.chart4.xAxisData = data.xAxisData;
            this.chart4.seriesData = data.seriesData;
          }
        })
        .catch(() => {
          this.$message.error("查询报警统计失败");
        });
    }
  },
  watch: {
    levelOfPie: {
      handler() {
        this.queryPercent();
      }
    },
    levelOfBar: {
      handler() {
        this.queryRank();
      }
    }
  },
  mounted() {
    this.time = [getDay(-7), getDay(0)];
    this.initQuery();
  }
};
</script>
<style lang="scss" scoped>
.index_body {
  @extend .flexBox !optional;
  flex: 1;
  flex-wrap: wrap;
  align-content: flex-start;
  .head {
    padding: 0px 0px 5px;
    align-items: center;
    > span {
      margin-left: 15px;
      color: #8492a6;
      font-size: 13px;
    }
  }
  .div_chart {
    width: 100%;
    margin: 0px 8px 10px 8px;
    .chartHead {
      float: right;
      margin-right: 15px;
    }
    .body1,
    .body2 {
      margin-right: 10px;
      margin-left: 10px;
      border-radius: 5px;
      border: 2px solid rgba(0, 0, 0, 0.1);
      border-top: 3px solid #87a7f9; //whz修改#00c0ef;
      padding-top: 2px;
      background: #ffffff;
    }
  }
  .box-header {
    border-bottom: 1px solid #f4f4f4;
    color: #444;
  }
  .box-header .box-title {
    display: inline-block;
    font-size: 16px;
    margin: 0;
    padding: 6px 6px 6px 10px;
  }
  .box-search {
    float: right;
    font-size: 15px;
  }
}
</style>
