<template>
  <div class="index_body" style="overflow-y:auto;overflow-x:hidden;">
    <div class="div_chart">
      <el-col :span="12">
        <div class="body1">
          <div class="box-header">
            <h3 class="box-title">连接状态</h3>
            <div class="chartHead">
              <el-button
                type="primary"
                icon="el-icon-refresh-right"
                size="mini"
                @click="query"
                >刷新
              </el-button>
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
            <h3 class="box-title">在线站点</h3>
            <div class="chartHead">
              <el-button
                type="primary"
                icon="el-icon-refresh-right"
                size="mini"
                @click="query"
                >刷新
              </el-button>
            </div>
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
      <el-col :span="12">
        <div class="body1">
          <div class="box-header">
            <h3 class="box-title">离线站点</h3>
            <div class="chartHead">
              <el-button
                type="primary"
                icon="el-icon-refresh-right"
                size="mini"
                @click="query"
                >刷新
              </el-button>
            </div>
          </div>
          <div class="box-body">
            <pie-echarts
              :legendData="chart3.legendData"
              :seriesData="chart3.seriesData"
            ></pie-echarts>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="body2">
          <div class="box-header">
            <h3 class="box-title">
              报警排名
            </h3>
            <div class="chartHead">
              <el-radio-group v-model="levelNo" size="mini">
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
              :xAxisData="chart4.xAxisData"
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
import { onOffLineStatistic, alarmRank } from "@/api/user";
export default {
  name: "AlarmStatistic",
  components: { PieEcharts, BarEcharts },
  data() {
    return {
      levelNo: "1",
      timeRange: "30",
      chart1: {
        legendData: ["在线", "离线"],
        seriesData: [
          {
            name: "在线",
            value: 0
          },
          {
            name: "离线",
            value: 0
          }
        ]
      },
      chart2: {
        legendData: ["正常", "故障"],
        seriesData: [
          {
            name: "正常",
            value: 0
          },
          {
            name: "故障",
            value: 0
          }
        ]
      },
      chart3: {
        legendData: ["断开连接", "其他"],
        seriesData: [
          {
            name: "断开连接",
            value: 0
          },
          {
            name: "其他",
            value: 0
          }
        ]
      },
      chart4: {
        xAxisData: [],
        seriesData: [
          {
            name: "报警次数",
            type: "bar",
            barWidth: "60%",
            data: []
          }
        ]
      }
    };
  },
  watch: {
    timeRange: function() {
      this.resetChart4();
    },
    levelNo: function() {
      this.resetChart4();
    }
  },
  methods: {
    query() {
      onOffLineStatistic()
        .then(response => {
          if (response.data.status) {
            let data = response.data.data;
            this.chart1.seriesData[0].value = data.N + data.D;
            this.chart1.seriesData[1].value = data.O + data.others;
            this.chart2.seriesData[0].value = data.N;
            this.chart2.seriesData[1].value = data.D;
            this.chart3.seriesData[0].value = data.O;
            this.chart3.seriesData[1].value = data.others;
          }
        })
        .catch(() => {
          this.$message.error("设备在线离线统计失败！");
        });
      this.resetChart4();
    },
    resetChart4() {
      let param = {
        levelNo: this.levelNo,
        timeRange: this.timeRange
      };
      alarmRank(param)
        .then(response => {
          if (response.data.status) {
            let data = response.data.data;
            this.chart4.xAxisData = data.xAxisData;
            this.chart4.seriesData[0].data = data.seriesData;
          }
        })
        .catch(() => {
          this.$message.error("报警排名统计失败！");
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
  .head {
    padding: 0px 0px 15px;
    align-items: center;
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
