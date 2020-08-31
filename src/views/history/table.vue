<template>
  <div class="body">
    <div class="head">
      <span class="">发油库 : </span>
      <el-select
        v-model="head.institutionId"
        placeholder="请选择发油库"
        size="mini"
        @change="queryByHeadByDeviceCode"
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
        @change="queryByHeadByDeviceCode"
      >
        <el-option
          v-for="item in head.deviceData"
          :key="item.label"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span class="">监测物质 : </span>
      <el-select
        v-model="head.thingCode"
        placeholder="请选择"
        size="mini"
        multiple
        collapse-tags
      >
        <el-option
          v-for="item in head.thingData"
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
    <div class="pmClass">
      <div class="tableDiv">
        <div class="box-header">
          <h3 class="box-title">PM统计数据</h3>
        </div>
        <tl-table
          :tableData="tableData"
          :theadBody="theadBody"
          :height="height"
        ></tl-table>
        <el-pagination
          background
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
      </div>
    </div>
  </div>
</template>

<script>
import tlTable from "@/components/TableNoPage.vue";
import { queryHead } from "@/api/user";

export default {
  name: "PmStatistic",
  components: { tlTable },
  data() {
    return {
      head: {
        institutionId: null,
        deviceId: null,
        thingCode: [],
        time: null,
        institutionData: [],
        deviceData: [],
        thingData: []
      },
      total: 5,
      currentPage: 1,
      pageSize: 10,
      pageSizes: [10, 20, 30, 40, 50],
      xAxisData: [],
      seriesData: [],
      tableData: [],
      allTableData: [],
      height: 620,
      theadBody: [
        {
          prop: "deviceName",
          text: "车辆名称"
        },
        {
          prop: "deviceCode",
          text: "设备编号"
        },
        {
          prop: "batchNo",
          text: "批次号"
        },
        {
          prop: "streetName",
          text: "道路名称"
        },
        {
          prop: "beginTime",
          text: "开始时间",
          width: 150
        },
        {
          prop: "endTime",
          text: "结束时间",
          width: 150
        },
        {
          prop: "speed",
          text: "车速(km/h)"
        },
        {
          prop: "humidity",
          text: "湿度(%)"
        },
        {
          prop: "temperature",
          text: "温度(℃)"
        },
        {
          prop: "windSpeed",
          text: "风速(m/s)"
        },
        {
          prop: "pm1Road",
          text: "PM1道路(mg/m23)"
        },
        {
          prop: "pm25Road",
          text: "PM2.5道路(mg/m23)"
        },
        {
          prop: "pm10Road",
          text: "PM10道路(mg/m23)"
        },
        {
          prop: "nox",
          text: "NOx(ppm)"
        }
      ]
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      queryHead(null)
        .then(res => {
          const { data } = res.data;
          if (data) {
            this.head.institutionData = data.institutionData;
            this.head.deviceData = data.deviceData;
            this.head.thingData = data.thingData;
            this.head.institutionId = this.head.institutionData[0].value;
            this.head.deviceId = this.head.deviceData[0].value;
          } else {
            this.head = {
              institutionId: null,
              deviceId: null,
              thingCode: [],
              institutionData: [],
              deviceData: [],
              thingData: []
            };
          }
        })
        .catch(() => {
          this.$message.error("查询数据异常！");
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
    queryByDeviceCodeAndTime() {}
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
      .el-pagination {
        bottom: 3px;
        position: absolute;
      }
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
