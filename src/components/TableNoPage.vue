<template>
  <el-table
    :data="tableData"
    :height="height"
    border
    style="width: 100%;position: absolute"
    size="small"
    :row-style="tableRowStyle"
    :header-cell-style="tableHeaderColor"
  >
    <el-table-column
      align="center"
      v-for="item in theadBody"
      :key="item.prop"
      :min-width="item.width == null ? false : item.width"
      :prop="item.prop"
      :label="item.text"
      :sortable="item.sortable == null ? false : item.sortable"
    ></el-table-column>
  </el-table>
</template>

<script scoped>
export default {
  name: "TableNoPag",
  props: {
    height: {
      type: Number,
      default: 280
    },
    tableData: {
      type: Array,
      default: function() {
        return [
          {
            date: "2016-05-03",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄"
          },
          {
            date: "2016-05-02",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄"
          },
          {
            date: "2016-05-04",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄"
          },
          {
            date: "2016-05-01",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄"
          },
          {
            date: "2016-05-08",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄"
          },
          {
            date: "2016-05-06",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄"
          },
          {
            date: "2016-05-07",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄"
          }
        ];
      }
    },
    theadBody: {
      type: Array,
      default: function() {
        return [
          {
            prop: "date",
            text: "日期"
          },
          {
            prop: "name",
            text: "姓名"
          },
          {
            prop: "address",
            text: "地址"
          }
        ];
      }
    }
  },
  methods: {
    // 修改table header的背景色
    tableHeaderColor({ rowIndex }) {
      if (rowIndex === 0) {
        if (this.$route.name == "home") {
          return "color: #5f89f7;font-weight:bold;";
          /*whz修改return "color: #008acd;font-weight:bold;";*/
        } else {
          return "background:#d8edfb;color:#5f89f7;font-weight:500;font-size=18";
          /* whz修改return "background:#d8edfb;color:#0470bc;font-weight:500;font-size=18";*/
        }
      }
    },
    tableRowStyle() {
      return "background-color: #ffffff";
    }
  }
};
</script>

<style lang="scss" scoped></style>
