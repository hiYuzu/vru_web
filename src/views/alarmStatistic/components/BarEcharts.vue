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
            name: "Forest",
            type: "bar",
            barGap: 0,
            data: [320, 332, 301, 334, 390, 122]
          },
          {
            name: "Steppe",
            type: "bar",
            data: [220, 182, 191, 234, 290, 55]
          },
          {
            name: "Desert",
            type: "bar",
            data: [150, 232, 201, 154, 190, 133]
          },
          {
            name: "Wetland",
            type: "bar",
            data: [98, 77, 101, 99, 40, 111]
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
      let _this = this;
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
          type: "value",
          max: function(value) {
            if (_this.showMax) return value.max;
            else return value;
          },
          axisLabel: {
            formatter: function(value) {
              return value.toFixed(2);
            }
          }
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
