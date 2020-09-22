<template>
  <div class="body">
    <div class="head">
      <span class="">发油库 : </span>
      <el-select
        v-model="head.institutionId"
        placeholder="请选择发油库"
        size="mini"
        @change="filterDevice"
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
        value-format="yyyy-MM-dd HH:mm:ss"
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
        >导出
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
        time: [],
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
          prop: "institutionName",
          text: "发油库名称"
        },
        {
          prop: "deviceName",
          text: "发油设备名称"
        },
        {
          prop: "thingName",
          text: "监测物"
        },
        {
          prop: "dataTypeName",
          text: "数据类型"
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
    this.head.time.push(
      this.dateFormatter(new Date(new Date() - 24 * 60 * 60 * 1000))
    );
    this.head.time.push(this.dateFormatter(new Date()));
    this.init().then(() => {
      this.query();
    });
  },
  methods: {
    init() {
      return new Promise(resolve => {
        historyHeadInit().then(res => {
          const { data } = res.data;
          this.head.institutionData = data.institutionData;
          this.deviceData = data.deviceData;
          this.thingData = data.thingData;
          this.deviceThingData = data.deviceThingData;
          this.head.institutionId = this.head.institutionData[0].value;
          this.filterDevice();
          resolve(true);
        });
      });
    },
    query() {
      this.currentPage = 1;
      this.pageSize = 10;
      this.total = 0;
      this.allTableData = [];
      if (!this.checkFormField()) {
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
      historyQuery(param).then(res => {
        const { data } = res.data;
        this.allTableData = data;
        if (data) {
          this.total = this.allTableData.length;
        }
        this.addField();
        this.getData(this.currentPage, this.pageSize);
      });
    },
    exportExcel() {
      var wb = this.$XLSX.utils.book_new();
      var tableArr = [
        {
          institutionName: "发油库名称",
          deviceName: "发油设备名称",
          thingName: "监测物",
          dataTypeName: "数据类型",
          thingAvg: "平均值",
          beginTime: "开始时间"
        }
      ];
      this.allTableData.forEach(item => {
        tableArr.push({
          institutionName: item.institutionName,
          deviceName: item.deviceName,
          thingName: item.thingName,
          dataTypeName: item.dataTypeName,
          thingAvg: item.thingAvg,
          beginTime: item.beginTime
        });
      });
      var ws = this.$XLSX.utils.json_to_sheet(tableArr, {
        header: [
          "institutionName",
          "deviceName",
          "thingName",
          "dataTypeName",
          "thingAvg",
          "beginTime"
        ],
        skipHeader: true
      });
      this.$XLSX.utils.book_append_sheet(wb, ws, "sheetName");
      var wbout = this.$XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        this.$FileSaver.saveAs(
          new Blob([wbout], {
            type: "application/octet-stream"
          }),
          "历史数据统计.xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
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
    filterDevice() {
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
    },
    addField() {
      let institutionName;
      for (let institution of this.head.institutionData) {
        if (this.head.institutionId == institution.value) {
          institutionName = institution.label;
          break;
        }
      }
      for (let table of this.allTableData) {
        table.institutionName = institutionName;
        for (let device of this.deviceData) {
          if (table.deviceId == device.value) {
            table.deviceName = device.label;
            break;
          }
        }
        for (let thing of this.thingData) {
          if (table.thingCode == thing.value) {
            table.thingName = thing.label;
            break;
          }
        }
        for (let dataType of this.dataTypeData) {
          if (table.dataType == dataType.value) {
            table.dataTypeName = dataType.label;
            break;
          }
        }
      }
    },
    checkFormField() {
      if (!this.head.institutionId) {
        alert("选择发油库");
        return false;
      }
      if (!this.head.deviceId) {
        alert("选择设备");
        return false;
      }
      if (this.head.thingCode.length == 0) {
        alert("选择监测物");
        return false;
      }
      if (this.head.time == "") {
        alert("选择时间");
        return false;
      }
      return true;
    },
    dateFormatter(str) {
      let d = new Date(str);
      let year = d.getFullYear();
      let month =
        d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
      let day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
      let hour = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
      let minute = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
      let second = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
      return (
        [year, month, day].join("-") + " " + [hour, minute, second].join(":")
      );
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
