<template>
  <el-dialog
    title="油气概况"
    width="80%"
    :visible.sync="visible"
    :close-on-click-modal="false"
    append-to-body
    center
  >
    <div>
      <el-tabs type="border-card">
        <el-tab-pane class="tabContent">
          <span slot="label"><i class="el-icon-date"></i> 油气处理装置</span>
          <el-table
            :data="tableDataVo"
            border
            stripe
            height="80%"
            style="width: 100%;position: absolute;"
          >
            <el-table-column
              align="center"
              width="160"
              prop="dataTime"
              label="时间"
              fixed="true"
            >
            </el-table-column>
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
        </el-tab-pane>
        <el-tab-pane class="tabContent">
          <span slot="label"><i class="el-icon-date"></i>发油信息</span>
          <el-table
            :data="tableDataOil"
            border
            stripe
            height="80%"
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
        <el-tab-pane class="tabContent">
          <span slot="label"><i class="el-icon-date"></i> 预警、报警</span>
          <el-table
            :data="tableDataAlarm"
            border
            stripe
            height="80%"
            style="width: 100%;position: absolute;"
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
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: "MapDialog",
  data() {
    return {
      visible: this.dialogVisible,
      total: 5,
      currentPage: 1,
      pagesize: 10,
      pageSizes: [10, 20, 30, 40, 50],
      tableDataVo: [],
      tableDataOil: [],
      tableDataAlarm: [],
      theadBodyVo: [
        {
          prop: "出口NMHC浓度",
          text: "出口NMHC浓度"
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
          prop: "time",
          text: "报警时间"
        }
      ]
    };
  },
  props: ["dialogVisible", "monitorVOMap", "oilVOList", "alarmListInfo"],
  watch: {
    dialogVisible: {
      handler() {
        this.visible = this.dialogVisible;
        this.tableDataVo = this.monitorVOMap;
        this.tableDataOil = this.oilVOList;
        this.tableDataAlarm = this.alarmListInfo;
      },
      deep: true
    }
  },
  mounted() {
    this.tableDataVo = this.monitorVOMap;
    this.tableDataOil = this.oilVOList;
    this.tableDataAlarm = this.alarmListInfo;
  },

  methods: {}
};
</script>
<style scoped>
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
  height: 400px;
  overflow: auto;
}
</style>
