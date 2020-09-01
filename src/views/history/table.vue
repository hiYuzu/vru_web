<template>
  <div class="body">
    <div class="head">
      <span class="">发油库 : </span>
      <el-select
        v-model="head.institutionId"
        placeholder="请选择发油库"
        size="mini"
        @change="fileterDevice"
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
      >
      </el-date-picker>
      <el-button type="primary" icon="el-icon-search" size="mini" @click="query"
        >搜索
      </el-button>
      <el-button
        type="primary"
        icon="el-icon-receiving"
        size="mini"
        @click="fileterDevice"
        >导出到Excel
      </el-button>
    </div>
    <div class="pmClass">
      <div class="tableDiv">
        <div class="box-header">
          <h3 class="box-title">历史数据统计</h3>
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
import { historyHeadInit, historyQuery } from "@/api/user";

export default {
  name: "PmStatistic",
  components: { tlTable },
  data() {
    return {
      head: {
        institutionId: null,
        deviceId: null,
        thingCode: [],
        time: "",
        dataType: 2011,
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
      total: 5,
      currentPage: 1,
      pageSize: 10,
      pageSizes: [10, 20, 30, 40, 50],
      tableData: [],
      allTableData: [],
      height: 620,
      theadBody: [
        {
          prop: "deviceName",
          text: "设备名称"
        },
        {
          prop: "thingCode",
          text: "设备编号"
        },
        {
          prop: "thingAvg",
          text: "平均值"
        },
        {
          prop: "beginTime",
          text: "开始时间",
          width: 150
        }
      ]
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      historyHeadInit()
        .then(res => {
          const { data } = res.data;
          this.head.institutionData = data.institutionData;
          this.deviceData = data.deviceData;
          this.thingData = data.thingData;
          this.deviceThingData = data.deviceThingData;
          this.head.institutionId = this.head.institutionData[0].value;
          this.fileterDevice();
        })
        .catch(() => {
          this.$message.error("查询数据异常！");
        });
    },
    query() {
      if (this.head.time == "") {
        alert("选择时间");
        return;
      }
      if (this.head.deviceId == null) {
        alert("选择设备");
        return;
      }
      this.currentPage = 1;
      this.pageSize = 10;
      if (this.head.deviceId == null || this.head.thingCode.length == 0) {
        alert("选择监测物");
        return;
      }
      let deviceIds = Array.of(this.head.deviceId);
      let thingCodes = this.head.thingCode;
      let dataType = this.head.dataType;
      let time = this.head.time;
      let param = {
        deviceIds,
        thingCodes,
        dataType,
        time
      };
      historyQuery(param)
        .then(res => {
          const { data } = res.data;
          this.allTableData = data;
          if (data) {
            this.total = this.allTableData.length;
          } else {
            this.total = 0;
          }
          this.getData(this.currentPage, this.pageSize);
        })
        .catch(() => {
          this.$message.error("查询表格异常！");
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
      if (this.allTableData) {
        this.tableData = this.allTableData.slice(index, index + pageSize);
      } else {
        this.tableData = [];
      }
    },
    fileterDevice() {
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
      this.head.thingCode = [];

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
        this.head.thingCode[0] = this.head.thingData[0].value;
      }
    }
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
