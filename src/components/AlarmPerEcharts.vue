<template>
  <div
    :id="this.id"
    :style="{ height: height + 'px', width: width + '%' }"
  ></div>
</template>

<script>
export default {
  name: "AlarmPerEcharts",
  props: {
    height: {
      type: Number,
      default: 250
    },
    width: {
      type: Number,
      default: 100
    },
    chartsData: {
      type: Array,
      default: function() {
        return [
          { value: 535, name: "报警" },
          { value: 535, name: "预警" }
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
      let _this = this;
      myChart.setOption(
        {
          title: {
            text: this.title,
            textStyle: {
              fontSize: 16,
              fontWeight: "500",
              color: "#fff"
            }
          },
          legend: {
            data: ["预警", "报警"]
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow"
            }
          },
          toolbox: {
            feature: {
              dataView: { show: true, readOnly: false },
              saveAsImage: { show: true }
            }
          },
          series: [
            {
              name: "预警、报警占比",
              type: "pie",
              radius: "65%",
              center: ["50%", "50%"],
              selectedMode: "single",
              label: {
                formatter: "{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ",
                backgroundColor: "#eee",
                borderColor: "#aaa",
                borderWidth: 1,
                borderRadius: 4,
                rich: {
                  a: {
                    color: "#999",
                    lineHeight: 22,
                    align: "center"
                  },
                  hr: {
                    borderColor: "#aaa",
                    width: "100%",
                    borderWidth: 0.5,
                    height: 0
                  },
                  b: {
                    fontSize: 16,
                    lineHeight: 33
                  },
                  per: {
                    color: "#eee",
                    backgroundColor: "#5a79ba",
                    padding: [2, 4],
                    borderRadius: 2
                  }
                }
              },
              data: _this.chartsData
            }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          }
        },
        true
      );
      return myChart;
    }
  },
  watch: {
    chartsData: {
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
  mounted() {
    var myChart2 = this.renderPieChart();
    window.addEventListener("resize", () => {
      myChart2.resize();
    });
  }
};
</script>

<style scoped></style>
