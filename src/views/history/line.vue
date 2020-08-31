<template>
  <div class="body">
    <div class="head">
      <span class="">发油库 : </span>
      <el-select
        v-model="head.institutionName"
        placeholder="请选择发油库"
        size="mini"
        @change="queryByHeadByDeviceCode"
      >
        <el-option
          v-for="item in institutionData"
          :key="item.label"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span class="">发油设备 : </span>
      <el-select
        v-model="head.deviceCode"
        placeholder="请选择发油设备"
        size="mini"
        @change="queryByHeadByDeviceCode"
      >
        <el-option
          v-for="item in deviceData"
          :key="item.label"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span class="">监测物质 : </span>
      <el-select
        v-model="head.thingName"
        placeholder="请选择"
        size="mini"
        multiple
        collapse-tags
      >
        <el-option
          v-for="item in thingData"
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
      >
      </el-date-picker>
      <el-button
        type="primary"
        icon="el-icon-search"
        size="mini"
        @click="queryByHeadByDeviceCode"
        >搜索
      </el-button>
      <el-button
        type="primary"
        icon="el-icon-receiving"
        size="mini"
        @click="queryByHeadByDeviceCode"
        >导出到Excel
      </el-button>
    </div>
    <div class="pmClass">
      <div class="tableDiv">
        <div class="box-header">
          <h3 class="box-title">PM统计数据</h3>
        </div>
        <div id="main" style="width:100%;height:400px;"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { getStatisticData } from "@/api/user";

export default {
  name: "historyLine",
  data() {
    return {
      head: {
        institutionName: null,
        deviceCode: null,
        thingName: null,
        time: null
      },

      institutionData: [],
      deviceData: [],
      thingData: [],

      xAxisData: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      seriesData: [820, 932, 901, 934, 1290, 1330, 1320]
    };
  },
  methods: {
    initPmSta() {
      let queryParams = this.$store.state.statistic.queryParam;
      let param = {};
      param.deviceCode = queryParams.deviceCode;
      param.batchNo = queryParams.batchNo;
      param.streetId = [];
      for (let i = 0; i < queryParams.streetId.length; i++) {
        param.streetId.push(queryParams.streetId[i]);
      }
      //发送请求
      getStatisticData(param)
        .then(res => {
          if (res.success) {
            //表格，分页
            this.total = parseFloat(res.total);
            this.allTableData = res.data.tableData;
            this.getData(this.currentPage, this.pageSize);
            //lineChart
            if (res.data.lineData == null) {
              this.xAxisData = [];
            } else {
              this.xAxisData = res.data.lineData.xAxisData;
            }
            if (res.data.lineData == null) {
              this.seriesData = [];
            } else {
              this.seriesData = res.data.lineData.seriesData;
            }
          }
        })
        .catch(() => {
          this.$message.error("查询PM数据异常！");
        });
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.getData(this.currentPage, size);
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getData(currentPage, this.pageSize);
    },
    getData(currentPage, pageSize) {
      let index = (currentPage - 1) * pageSize;
      this.tableData = this.allTableData.slice(index, index + pageSize);
    },
    queryByHeadByDeviceCode() {},
    queryByDeviceCodeAndTime() {},
    myEcharts() {
      var myChart = this.$echarts.init(document.getElementById("main"));
      var option = {
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: "line"
          }
        ]
      };
      myChart.setOption(option);
    }
  },
  mounted() {
    this.myEcharts();
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
