<template>
  <div class="statisticDiv">
    <statistic-head></statistic-head>
    <div class="alarmStat">
      <div class="tableDiv">
        <div class="box-header">
          <h3 class="box-title">报警数据查询</h3>
        </div>
        <el-pagination
          background
          :hide-on-single-page="false"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          prev-text="上一页"
          next-text="下一页"
        >
        </el-pagination>
        <table-no-pag
          :height="440"
          :tableData="table.tableData"
          :theadBody="table.theadBody"
          :cellColorStyle="cellColor"
        ></table-no-pag>
      </div>
    </div>
  </div>
</template>
<script>
import TableNoPag from "./components/TableNoPag.vue";
import StatisticHead from "./components/StatisticHead.vue";
import { getAlarmShowData, getAlarmShowDataCount } from "@/api/user";
export default {
  name: "AlarmData",
  components: { TableNoPag, StatisticHead },
  data() {
    return {
      currentPage: 1,
      pageSizes: [10, 20, 30, 40, 50],
      pageSize: 10,
      total: 10,
      param: {},
      colorStyle: "background-color: #000000",
      table: {
        tableData: [],
        theadBody: [
          {
            prop: "institution",
            text: "发油库"
          },
          {
            prop: "deviceName",
            text: "发油设备"
          },
          {
            prop: "institutionAddress",
            text: "发油库区域"
          },
          {
            prop: "alarmName",
            text: "告警名称"
          },
          {
            prop: "levelName",
            text: "预警报警"
          },
          {
            prop: "alarmInfo",
            text: "告警信息"
          },
          {
            prop: "alarmTime",
            text: "告警时间"
          }
        ]
      }
    };
  },
  mounted() {
    if (this.$store.state.statistic.statisticHeadInit) {
      this.initData();
    }
  },
  created() {
    this.$bus.on("queryStatistics", this.initData);
  },
  beforeDestroy() {
    this.$bus.off("queryStatistics", this.initData);
  },
  methods: {
    initData() {
      let queryParam = this.$store.state.statistic.queryParam;
      this.param = queryParam;
      if (queryParam.time.length == 0) {
        return;
      }
      this.param.beginTime = queryParam.time[0];
      this.param.endTime = queryParam.time[1];
      getAlarmShowDataCount(this.param)
        .then(response => {
          //得到报警数据总数
          this.total = response.data.data;
          if (this.total > 0) {
            this.getData(this.currentPage, this.pageSize);
          }
          if (this.total == 0) {
            this.table.tableData = [];
          }
        })
        .catch(() => {
          this.$message.error("查询报警数据量异常！");
        });
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.getData(this.currentPage, size);
    },
    handleCurrentChange(currentPage) {
      this.getData(currentPage, this.pageSize);
    },
    getData(currentPage, pageSize) {
      this.param.rowIndex = (currentPage - 1) * pageSize;
      this.param.rowCount = pageSize;
      getAlarmShowData(this.param)
        .then(response => {
          this.table.tableData = response.data.data;
        })
        .catch(() => {
          this.$message.error("查询报警数据异常！");
        });
    },
    cellColor({ row, columnIndex }) {
      if (columnIndex === 5) {
        if (row.levelName == "预警") {
          return "background-color:#FFA500;font-weight:bold;color:#000000";
        } else if (row.levelName == "报警") {
          return "background-color:#FF401A;font-weight:bold;color:#000000";
        }
      }
    }
  }
};
</script>
<style lang="scss">
.statisticDiv {
  @extend .flexBox !optional;
  flex-direction: column;
  flex-grow: 1;
}
.alarmStat {
  flex-grow: 1;
  position: relative;
  .tableDiv {
    margin: 0px 5px;
    padding-right: 15px;
    position: relative;
    height: 525px;
    border-radius: 5px;
    border: 2px solid rgba(0, 0, 0, 0.1);
    border-top: 3px solid #87a7f9; //whz修改#00c0ef;
    background-color: #ffffff;
    .el-pagination {
      bottom: 3px;
      position: absolute;
    }
  }
  .chart {
    margin-top: 10px;
    margin-left: 5px;
    margin-right: 5px;
    border-radius: 5px;
    border: 2px solid rgba(0, 0, 0, 0.1);
    border-top: 3px solid #87a7f9; //whz修改#00c0ef;
    background-color: #ffffff;
    padding-bottom: 10px;
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
</style>
