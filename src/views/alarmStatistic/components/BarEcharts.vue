<template>
  <div
    :id="this.id"
    :style="{ height: height + 'px', width: width + '%' }"
  ></div>
</template>

<script>
export default {
  name: "BarEcharts",
  props: {
    height: {
      type: Number,
      default: 370
    },
    width: {
      type: Number,
      default: 100
    },
    isLegend: {
      type: Boolean,
      default: false
    },
    showMax: {
      type: Boolean,
      default: false
    },
    xAxisData: {
      type: Array,
      default: function() {
        return ["12:00", "12:01", "12:02", "12:03", "12:04", "12:05"];
      }
    },
    seriesData: {
      type: Array,
      default: function() {
        return [
          {
            name: "报警次数",
            type: "bar",
            barWidth: "60%",
            data: [10, 52, 200, 334, 390, 330]
          }
        ];
      }
    },
    title: {
      type: String,
      default: function() {
        return "";
      }
    }
  },
  data() {
    return {};
  },
  computed: {
    id: function() {
      return parseInt(Math.random() * 1000000);
    },
    legendData: function() {
      let legendData = [];
      let _this = this;
      this.seriesData.forEach(function(elem) {
        elem.type = "bar";
        if (_this.isLegend) {
          legendData.push(elem.name);
        }
      });
      return legendData;
    }
  },
  methods: {
    renderBarChart: function() {
      let myChart = this.$echarts.init(
        document.getElementById(this.id),
        "macarons"
      );
      myChart.setOption({
        title: {
          text: this.title,
          textStyle: {
            fontSize: 16,
            fontWeight: "500",
            color: "#409EFF"
          }
        },
        legend: {
          data: this.legendData
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
