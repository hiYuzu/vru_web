<template>
  <el-dialog
    :title="title"
    width="80%"
    :visible.sync="visible"
    :close-on-click-modal="false"
    append-to-body
    center
    class="mapDialog"
  >
    <el-tabs type="border-card" style="width:100%" @tab-click="handleClick">
      <el-tab-pane
        class="tabContent"
        style="width:100%;display:block;overflow:hidden;"
      >
        <span slot="label"><i class="el-icon-date"></i> 油气处理装置</span>
        <div class="oilFilter">
          <el-form :inline="true" :model="mapForm" class="demo-form-inline">
            <span for="time">时间段： </span>
            <el-date-picker
              v-model="mapForm.timeRange"
              type="daterange"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']"
              size="mini"
            >
            </el-date-picker>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              style="margin-left:10px;"
              @click="query"
              >搜索
            </el-button>
          </el-form>
        </div>
        <div
          style="width:100%;display:flex; flex-direction:row;overflow:hidden;"
        >
          <el-table
            :data="tableDataVo"
            border
            stripe
            height="400px"
            style="flex:4"
          >
            <el-table-column
              align="center"
              v-for="item in theadBodyVo"
              :key="item.prop"
              :width="item.width"
              :prop="item.prop"
              :label="item.text"
              :fixed="tableDataVo.length > 0 ? item.fixed : false"
            >
            </el-table-column>
          </el-table>
          <div style="flex:3">
            <monitor-vo-echarts
              autoresize
              :xAxisData="xAxisData"
              :seriesData="seriesData"
              :top="50"
              :bottom="35"
              :right="10"
              :height="400"
              :legend="legend"
              :key="itemKey"
            ></monitor-vo-echarts>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane class="tabContent">
        <span slot="label"><i class="el-icon-date"></i>发油信息</span>
        <el-table
          :data="tableDataOil"
          :key="itemKey"
          border
          stripe
          height="400px"
          style="width: 100%;position: absolute;"
        >
          <el-table-column
            align="center"
            v-for="item in theadBodyOil"
            :key="item.prop"
            :width="item.width"
            :prop="item.prop"
            :label="item.text"
            :fixed="tableDataOil.length > 0 ? item.fixed : false"
          >
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane class="tabContent" style="width:100%;overflow:hidden;">
        <span slot="label"><i class="el-icon-date"></i> 预警、报警</span>
        <div class="alarmFilter">
          <el-form :inline="true" :model="mapForm" class="demo-form-inline">
            <span for="time">时间段： </span>
            <el-date-picker
              v-model="mapForm.timeRange"
              type="daterange"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']"
              size="mini"
            >
            </el-date-picker>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              style="margin-left:10px;"
              @click="query"
              >搜索
            </el-button>
          </el-form>
        </div>
        <div
          style="width:100%;display:flex; flex-direction:row;overflow:hidden;"
        >
          <el-table
            :data="tableDataAlarm"
            :key="itemKey"
            border
            stripe
            height="400px"
            style="width: 100%;flex:4;display:block;"
          >
            <el-table-column
              align="center"
              sortable
              v-for="item in theadBodyAlarm"
              :key="item.prop"
              :width="item.width"
              :prop="item.prop"
              :label="item.text"
              :fixed="tableDataAlarm.length > 0 ? item.fixed : false"
            >
            </el-table-column>
            <el-table-column
              align="center"
              prop="levelNo"
              label="报警级别"
              sortable
            >
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.levelNo === '1' ? 'warning' : 'danger'"
                  disable-transitions
                  >{{ scope.row.levelNo === "1" ? "预警" : "报警" }}</el-tag
                >
              </template>
            </el-table-column>
          </el-table>

          <div style="flex:3;display:block;">
            <alarm-per-echarts
              autoresize
              :chartsData="chartsData"
              :height="400"
              :key="itemKey"
            ></alarm-per-echarts>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script>
import MonitorVoEcharts from "./MonitorVoEcharts.vue";
import AlarmPerEcharts from "./AlarmPerEcharts.vue";
import { institutionDataQuery } from "@/api/user";
export default {
  name: "MapDialog",
  data() {
    return {
      visible: this.dialogVisible,
      title: "油气概况",
      total: 5,
      currentPage: 1,
      pagesize: 10,
      pageSizes: [10, 20, 30, 40, 50],
      tableDataVo: [],
      tableDataOil: [],
      tableDataAlarm: [],
      dataZoom: [],
      theadBodyVo: [
        {
          prop: "dataTime",
          text: "时间",
          width: 152
        },
        {
          prop: "出口NMHC浓度",
          text: "出口NMHC浓度",
          width: 100
        },
        {
          prop: "出口温度",
          text: "出口温度"
        },
        {
          prop: "出口压力",
          text: "出口压力"
        },
        {
          prop: "出口流量",
          text: "出口流量"
        },
        {
          prop: "进口温度",
          text: "进口温度"
        },
        {
          prop: "进口压力",
          text: "进口压力"
        },
        {
          prop: "进口流量",
          text: "进口流量"
        }
      ],
      theadBodyOil: [
        {
          prop: "dataFysj",
          text: "发油时间"
        },
        {
          prop: "dataYplx",
          text: "出口油品类型"
        },
        {
          prop: "dataYply",
          text: "油品来源"
        },
        {
          prop: "dataYpqc",
          text: "油品去处"
        },
        {
          prop: "dataFytj",
          text: "发油体积"
        },
        {
          prop: "dataHqtj",
          text: "回气体积"
        },
        {
          prop: "dataFyqyb",
          text: "发油气液比"
        },
        {
          prop: "dataSjxtyl",
          text: "油气收集系统压力"
        }
      ],
      theadBodyAlarm: [
        {
          prop: "alarmName",
          text: "报警类型"
        },
        {
          prop: "alarmInfo",
          text: "报警信息"
        },
        {
          prop: "deviceName",
          text: "设备信息"
        },
        {
          prop: "alarmTime",
          text: "报警时间"
        }
      ],
      xAxisData: [],
      legend: [
        "出口NMHC浓度",
        "出口温度",
        "出口压力",
        "出口流量",
        "进口温度",
        "进口压力",
        "进口流量"
      ],
      seriesData: [],
      chartsData: [
        { value: 0, name: "预警", itemStyle: { color: "#e6a23c" } },
        { value: 0, name: "报警", itemStyle: { color: "#f56c6c" } }
      ],
      mapForm: {
        timeRange: this.timeRange,
        beginTime: "",
        endTime: ""
      },
      itemKey: ""
    };
  },
  props: [
    "dialogVisible",
    "timeRange",
    "monitorVOMap",
    "oilVOList",
    "alarmListInfo",
    "dialogTitle",
    "institutionId",
    "monitorChart",
    "alarmChart"
  ],
  components: { MonitorVoEcharts, AlarmPerEcharts },
  watch: {
    dialogVisible: {
      handler() {
        this.visible = this.dialogVisible;
        this.tableDataVo = this.monitorVOMap;
        this.tableDataOil = this.oilVOList;
        this.tableDataAlarm = this.alarmListInfo;
        this.title = this.dialogTitle + "油气概况";
        this.mapForm.timeRange = this.timeRange;
        if (this.monitorChart != null) {
          this.legend = this.monitorChart.chart_thing;
          this.xAxisData = this.monitorChart.chart_time;
          this.seriesData = this.getSeriesDataMonitor(this.monitorChart);
        } else {
          this.legend = [];
          this.xAxisData = [];
          this.seriesData = [];
        }
        if (this.chartsData != null) {
          this.chartsData = this.getSeriersDataAlarm(this.alarmChart);
        }
      },
      deep: true
    }
  },
  mounted() {
    this.tableDataVo = this.monitorVOMap;
    this.tableDataOil = this.oilVOList;
    this.tableDataAlarm = this.alarmListInfo;
    this.title = this.dialogTitle + "油气概况";
    this.mapForm.timeRange = this.timeRange;
  },

  methods: {
    handleClick() {
      this.query();
    },
    //获取油气装置echarts图表的serierData
    getSeriesDataMonitor(data) {
      let seriesData = [];
      for (let key in data) {
        if (key != "chart_thing" && key != "chart_time") {
          seriesData.push({
            name: key,
            type: "line",
            areaStyle: {},
            data: data[key]
          });
        }
      }
      return seriesData;
    },
    //获取报警数据的占比serierData
    getSeriersDataAlarm(data) {
      let seriesData = [];
      seriesData.push({
        value: data.chart_alarm,
        name: "预警",
        itemStyle: { color: "#e6a23c" }
      });
      seriesData.push({
        value: data.chart_alarm,
        name: "报警",
        itemStyle: { color: "#f56c6c" }
      });
      return seriesData;
    },
    //查询油装置气信息
    async query() {
      let that = this;
      that.tableDataVo = [];
      if (that.mapForm.timeRange.length > 0) {
        that.mapForm.beginTime = that.mapForm.timeRange[0];
        that.mapForm.endTime = this.mapForm.timeRange[1];
      }
      var params = {
        institutionId: that.institutionId,
        beginTime: that.mapForm.beginTime,
        endTime: that.mapForm.endTime
      };
      await institutionDataQuery(params)
        .then(res => {
          const { data } = res.data;
          that.itemKey = Math.random();
          that.tableDataVo = that.handlerMonitorVOData(data.monitorVOMap);
          if (data.monitorVOChart != null) {
            that.legend = data.monitorVOChart.chart_thing;
            that.xAxisData = data.monitorVOChart.chart_time;
            that.seriesData = that.getSeriesDataMonitor(data.monitorVOChart);
          } else {
            that.legend = [];
            that.xAxisData = [];
            that.seriesData = [];
          }
          if (data.alarmVOChart != null) {
            that.tableDataAlarm = that.handlerMonitorVOData(data.alarmVOList);
            that.chartsData = that.getSeriersDataAlarm(data.alarmVOChart);
          } else {
            that.tableDataAlarm = [];
            that.chartsData = [];
          }
        })
        .catch(() => {});
    },
    /*   //查询报警信息
    async queryAlarm() {
      let that = this;
      if (that.mapForm.alarmTime.length > 0) {
        that.mapForm.beginTime = that.mapForm.alarmTime[0];
        that.mapForm.endTime = this.mapForm.alarmTime[1];
      }
      var params = {
        institutionId: that.institutionId,
        beginTime: that.mapForm.beginTime,
        endTime: that.mapForm.endTime
      };
      await institutionDataQuery(params)
        .then(res => {
          const { data } = res.data;
          that.itemKey = Math.random();
          that.tableDataAlarm = that.handlerMonitorVOData(data.alarmVOList);
          that.chartsData = that.getSeriersDataAlarm(data.alarmVOChart);
        })
        .catch(() => {});
    }, */
    //处理monitorVOMap的数据格式
    handlerMonitorVOData(monitorVOMap) {
      let arry = [];
      for (let time in monitorVOMap) {
        let infoJson = monitorVOMap[time];
        infoJson["dataTime"] = time;
        arry.push(infoJson);
      }
      return arry;
    }
  }
};
</script>
<style scoped lang="scss">
.el-form--inline .el-form-item::v-deep {
  margin-right: 50px;
}
span.unit {
  position: absolute;
  float: right;
  width: 70px;
}
.el-dialog-div::v-deep {
  height: 60vh;
  overflow: auto;
}
.tabContent {
  height: 520px;
  overflow: hidden;
}
.mapDialog::v-deep .el-dialog--center .el-dialog__body {
  padding: 15px;
}
.mapDialog::v-deep .el-dialog__header {
  background: #5a79ba;
}
.mapDialog::v-deep .el-dialog__title {
  color: #fff;
}

.mapDialog::v-deep .el-tabs__content {
  height: 460px;
  overflow: hidden;
}
.mapDialog::v-deep .el-dialog__headerbtn .el-dialog__close {
  color: #fff;
}
.alarmFilter,
.oilFilter {
  width: 100%;
  display: block;
  padding-bottom: 10px;
}
.alarmFilter span {
  color: #8492a6;
}
</style>
