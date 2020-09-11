<template>
  <div :id="this.id" :style="{ height: height + 'px', width: '100%' }"></div>
</template>

<script>
export default {
  name: "monitor-vo-echarts",
  props: {
    height: {
      type: Number,
      default: 250
    },
    width: {
      type: Number,
      default: 100
    },
    left: {
      type: Number,
      default: 10
    },
    right: {
      type: Number,
      default: 10
    },
    top: {
      type: Number,
      default: 20
    },
    bottom: {
      type: Number,
      default: 10
    },
    xAxisData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    legend: {
      type: Array,
      default: function() {
        return [];
      }
    },
    visualMap: null,
    seriesData: {
      type: Array,
      default: function() {
        return [];
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
  watch: {
    seriesData: {
      handler() {
        this.renderPieChart();
      }
    },
    xAxisData: {
      handler() {
        this.renderPieChart();
      }
    }
  },
  computed: {
    id: function() {
      return parseInt(Math.random() * 1000000);
    }
  },
  methods: {
    renderPieChart: function() {
      let myChart = this.$echarts.init(
        document.getElementById(this.id),
        "macarons"
      );

      myChart.clear();
      myChart.setOption({
        title: {
          text: this.title,
          textStyle: {
            fontSize: 16,
            fontWeight: 100
          }
        },
        grid: {
          top: this.top,
          left: this.left,
          right: this.right,
          bottom: this.bottom,
          containLabel: true
        },
        tooltip: {
          trigger: "axis"
        },
        toolbox: {
          show: true,
          orient: "horizontal",
          right: 26,
          top: 20,
          itemSize: 15,
          showTitle: false,
          /*   backgroundColor: "rgba(102,204,255,0.4)", */
          feature: {
            dataZoom: {
              yAxisIndex: "none"
            },
            saveAsImage: {
              show: true,
              type: "jpeg",
              icon:
                "image://data:image/png;base64,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"
            },
            dataView: { show: true, readOnly: false }
          }
        },
        legend: { data: this.legend },
        dataZoom: [
          {
            show: true,
            startValue: this.xAxisData[0]
          },
          {
            type: "inside"
          }
        ],
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.xAxisData
        },
        yAxis: {
          type: "value"
        },
        visualMap: this.visualMap,
        series: this.seriesData
      });
      return myChart;
    }
  },
  mounted() {
    var myChart = this.renderPieChart();
    window.addEventListener("resize", () => {
      myChart.resize();
    });
  }
};
</script>

<style></style>
