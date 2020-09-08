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
    <el-tabs type="border-card" style="width:100%">
      <el-tab-pane
        class="tabContent"
        style="width:100%;display:block;;overflow:hidden;"
      >
        <span slot="label"><i class="el-icon-date"></i> 油气处理装置</span>
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
              :xAxisData="xAxisData"
              :seriesData="seriesData"
              :top="50"
              :bottom="35"
              :right="10"
              :height="400"
              :legend="legend"
            ></monitor-vo-echarts>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane class="tabContent">
        <span slot="label"><i class="el-icon-date"></i>发油信息</span>
        <el-table
          :data="tableDataOil"
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
      <el-tab-pane
        class="tabContent"
        style="width:100%;display:block;;overflow:hidden;"
      >
        <span slot="label"><i class="el-icon-date"></i> 预警、报警</span>
        <div
          style="width:100%;display:flex; flex-direction:row;overflow:hidden;"
        >
          <el-table
            :data="tableDataAlarm"
            border
            stripe
            height="400px"
            style="width: 100%;flex:4;display:block;"
          >
            <el-table-column
              align="center"
              v-for="item in theadBodyAlarm"
              :key="item.prop"
              :width="item.width"
              :prop="item.prop"
              :label="item.text"
              :fixed="tableDataAlarm.length > 0 ? item.fixed : false"
            >
            </el-table-column>
            <el-table-column align="center" prop="levelNo" label="报警类型">
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
              :chartsData="chartsData"
              :height="400"
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
          prop: "dataId",
          text: "dataId",
          hidden: true
        },
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
          prop: "deviceName",
          text: "设备信息"
        },
        {
          prop: "alarmName",
          text: "报警名称"
        },
        {
          prop: "alarmInfo",
          text: "报警信息"
        },
        {
          prop: "alarmTime",
          text: "报警时间"
        }
      ],
      xAxisData: [
        "2020-09-01",
        "2020-09-02",
        "2020-09-03",
        "2020-09-04",
        "2020-09-05",
        "2020-09-06",
        "2020-09-07"
      ],
      legend: [
        "出口NMHC浓度",
        "出口温度",
        "出口压力",
        "出口流量",
        "进口温度",
        "进口压力",
        "进口流量"
      ],
      seriesData: [
        {
          name: "出口NMHC浓度",
          type: "line",
          areaStyle: {},
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: "出口温度",
          type: "line",
          areaStyle: {},
          data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
          name: "出口压力",
          type: "line",
          areaStyle: {},
          data: [150, 232, 201, 154, 190, 330, 410]
        },
        {
          name: "出口流量",
          type: "line",
          areaStyle: {},
          data: [320, 332, 301, 334, 390, 330, 320]
        },
        {
          name: "进口温度",
          type: "line",
          label: {
            normal: {
              show: true,
              position: "top"
            }
          },
          areaStyle: {},
          data: [820, 932, 901, 934, 1290, 1330, 1320]
        },
        {
          name: "进口压力",
          type: "line",
          areaStyle: {},
          data: [320, 332, 301, 334, 390, 330, 320]
        },
        {
          name: "进口流量",
          type: "line",
          areaStyle: {},
          data: [320, 332, 301, 334, 390, 330, 320]
        }
      ],
      chartsData: [
        { value: 535, name: "预警", itemStyle: { color: "#e6a23c" } },
        { value: 510, name: "报警", itemStyle: { color: "#f56c6c" } }
      ]
    };
  },
  props: [
    "dialogVisible",
    "monitorVOMap",
    "oilVOList",
    "alarmListInfo",
    "dialogTitle"
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
      },
      deep: true
    }
  },
  mounted() {
    this.tableDataVo = this.monitorVOMap;
    this.tableDataOil = this.oilVOList;
    this.tableDataAlarm = this.alarmListInfo;
    this.title = this.dialogTitle + "油气概况";
  },

  methods: {}
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
  height: 430px;
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
  height: 430px;
  overflow: hidden;
}
.mapDialog::v-deep .el-dialog__headerbtn .el-dialog__close {
  color: #fff;
}
</style>
