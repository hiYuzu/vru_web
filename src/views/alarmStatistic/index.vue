<template>
  <div class="index_body" style="overflow-y:auto;overflow-x:hidden;">
    <div class="div_chart">
      <!-- 设备在线离线统计 -->
      <el-col :span="12">
        <div class="body1">
          <div class="box-header">
            <h3 class="box-title">连接状态</h3>
          </div>
          <div class="box-body">
            <pie-echarts
              :legendData="chart1.legendData"
              :seriesData="chart1.seriesData"
            ></pie-echarts>
          </div>
        </div>
      </el-col>
      <!-- 在线设备正常报警统计 -->
      <el-col :span="12">
        <div class="body2">
          <div class="box-header">
            <h3 class="box-title">在线站点</h3>
          </div>
          <div class="box-body">
            <pie-echarts
              :legendData="chart2.legendData"
              :seriesData="chart2.seriesData"
            ></pie-echarts>
          </div>
        </div>
      </el-col>
    </div>
    <div class="div_chart">
      <!-- 离线设备状态统计 -->
      <el-col :span="12">
        <div class="body1">
          <div class="box-header">
            <h3 class="box-title">离线站点</h3>
          </div>
          <div class="box-body">
            <pie-echarts
              :legendData="chart3.legendData"
              :seriesData="chart3.seriesData"
            ></pie-echarts>
          </div>
        </div>
      </el-col>
      <!-- 7/30天内报警次数统计 -->
      <el-col :span="12">
        <div class="body2">
          <div class="box-header">
            <h3 class="box-title">
              报警排名
            </h3>
            <div class="chartHead">
              <el-radio-group v-model="warn_alarm" size="mini">
                <el-radio-button label="1">预警</el-radio-button>
                <el-radio-button label="2">报警</el-radio-button>
              </el-radio-group>
              <el-radio-group v-model="timeRange" size="mini">
                <el-radio-button label="7">7天</el-radio-button>
                <el-radio-button label="30">30天</el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div class="box-body">
            <bar-echarts
              :showMax="true"
              :legendData="chart4.xAxisData"
              :seriesData="chart4.seriesData"
            ></bar-echarts>
          </div>
        </div>
      </el-col>
    </div>
  </div>
</template>
<script>
import PieEcharts from "./components/PieEcharts.vue";
import BarEcharts from "./components/BarEcharts.vue";
export default {
  name: "AlarmStatistic",
  components: { PieEcharts, BarEcharts },
  data() {
    return {
      warn_alarm: "1",
      timeRange: "7",
      chart1: {
        legendData: [],
        seriesData: []
      },
      chart2: {
        legendData: [],
        seriesData: []
      },
      chart3: {
        legendData: [],
        seriesData: []
      },
      chart4: {
        xAxisData: [],
        seriesData: []
      }
    };
  },
  watch: {
    timeRange: function() {
      this.resetChart4();
    }
  },
  methods: {
    query() {
      //图1:设备在线离线统计
      onOffLineStatistic()
        .then(response => {
          if (response.data.status) {
            let data = response.data.data;
            this.chart1.legendData = data.legendData;
            this.chart1.seriesData = data.seriesData;
          }
        })
        .catch(() => {
          this.$message.error("设备在线离线统计失败！");
        });
      //图2：在线设备正常报警统计
      onLineStatistic()
        .then(response => {
          if (response.data.status) {
            let data = response.data.data;
            this.chart2.legendData = data.legendData;
            this.chart2.seriesData = data.seriesData;
          }
        })
        .catch(() => {
          this.$message.error("在线设备统计失败！");
        });
      //图3：离线设备状态统计
      offLineStatistic()
        .then(response => {
          if (response.data.status) {
            let data = response.data.data;
            this.chart3.legendData = data.legendData;
            this.chart3.seriesData = data.seriesData;
          }
        })
        .catch(() => {
          this.$message.error("离线设备统计失败！");
        });
      //图4：报警排名
      this.resetChart4();
    },
    resetChart4() {
      let param = {
        warnAlarm: this.warn_alarm,
        timeRange: this.timeRange
      };
      alarmRank(param)
        .then(response => {
          if (response.data.status) {
            let data = response.data.data;
            this.chart4.xAxisData = data.xAxisData;
            this.chart4.seriesData = data.seriesData;
          }
        })
        .catch(() => {
          this.$message.error("离线设备统计失败！");
        });
    }
  },
  mounted() {
    this.query();
  }
};
</script>
<style lang="scss" scoped>
.index_body {
  @extend .flexBox !optional;
  flex: 1;
  flex-wrap: wrap;
  align-content: flex-start;
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
