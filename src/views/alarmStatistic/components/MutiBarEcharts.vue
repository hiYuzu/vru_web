<template>
  <div
    :id="this.id"
    :style="{ height: height + 'px', width: width + '%' }"
  ></div>
</template>

<script>
export default {
  name: "MutiBarEcharts",
  props: {
    height: {
      type: Number,
      default: 370
    },
    width: {
      type: Number,
      default: 100
    },
    xAxisData: {
      type: Array,
      default: function() {
        return ["09/21", "09/22", "09/23", "09/24", "09/25", "09/27"];
      }
    },
    seriesData: {
      type: Array,
      default: function() {
        return [
          {
            name: "气液比",
            type: "bar",
            data: [18, 23, 29, 10, 13, 16]
          },
          {
            name: "压力值",
            type: "bar",
            data: [19, 23, 31, 12, 14, 18]
          },
          {
            name: "浓度值",
            type: "bar",
            data: [19, 23, 31, 12, 13, 18]
          },
          {
            name: "流量比",
            type: "bar",
            data: [19, 23, 31, 12, 13, 18]
          }
        ];
      }
    }
  },
  data() {
    return {};
  },
  computed: {
    id: function() {
      return parseInt(Math.random() * 1000000);
    }
  },
  methods: {
    renderBarChart: function() {
      let myChart = this.$echarts.init(
        document.getElementById(this.id),
        "macarons"
      );
      myChart.setOption({
        legend: {
          data: ["气液比", "压力值", "浓度值", "流量比"]
        },
        grid: {
          top: "28",
          left: "10",
          right: "10",
          bottom: "15",
          containLabel: true
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        xAxis: {
          type: "category",
          data: this.xAxisData
        },
        yAxis: {
          type: "value"
        },
        series: this.seriesData
      });
      return myChart;
    }
  },
  watch: {
    seriesData: {
      handler() {
        this.renderBarChart();
      }
    },
    xAxisData: {
      handler() {
        this.renderBarChart();
      }
    }
  },
  mounted() {
    var myChart4 = this.renderBarChart();
    window.addEventListener("resize", () => {
      myChart4.resize();
    });
  }
};
</script>

<style scoped></style>
