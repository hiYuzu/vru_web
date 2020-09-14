<template>
  <div
    :id="this.id"
    :style="{ height: height + 'px', width: width + '%' }"
  ></div>
</template>

<script>
export default {
  name: "PieEcharts",
  props: {
    height: {
      type: Number,
      default: 370
    },
    width: {
      type: Number,
      default: 100
    },
    legendData: {
      type: Array,
      default: function() {
        return ["直接访问", "邮件营销"];
      }
    },
    seriesData: {
      type: Array,
      default: function() {
        return [
          {
            name: "直接访问",
            value: 335
          },
          {
            name: "邮件营销",
            value: 310
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
    }
  },
  methods: {
    renderPieChart: function() {
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
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "right",
          data: this.legendData
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: this.seriesData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
      return myChart;
    }
  },
  watch: {
    seriesData: {
      handler() {
        this.renderPieChart();
      }
    },
    legendData: {
      handler() {
        this.renderPieChart();
      }
    }
  },
  mounted() {
    var myChart1 = this.renderPieChart();
    window.addEventListener("resize", () => {
      myChart1.resize();
    });
  }
};
</script>

<style scoped></style>
