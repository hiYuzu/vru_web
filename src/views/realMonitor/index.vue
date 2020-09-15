<template>
  <div>
    <div class="baidumap" id="allmap"></div>
    <map-dialog
      v-show="mapDialogVisible"
      :dialogVisible="mapDialogVisible"
      :timeRange="timeRange"
      :monitorVOMap="monitorVOMap"
      :oilVOList="oilVOList"
      :alarmListInfo="alarmVOList"
      :monitorChart="monitorChart"
      :alarmChart="alarmChart"
      :dialogTitle="title"
      :institutionId="institutionId"
    ></map-dialog>
  </div>
</template>
<script>
import { mapPointsQuery, institutionDataQuery } from "@/api/user";
import { fomatDateToStrToYMD } from "@/utils/date.js";
import MapDialog from "./../../components/MapDialog.vue";
export default {
  name: "realMonitor",
  data() {
    return {
      map: null,
      mapDialogVisible: false,
      timeRange: ["2020-09-01 00:00:00", "2020-09-01 23:59:59"], //时间范围
      monitorVOMap: [],
      oilVOList: [],
      alarmVOList: [],
      alarmChart: null,
      monitorChart: null,
      title: "",
      institutionId: "",
      timer: null
    };
  },
  components: { MapDialog },
  mounted() {
    this.mapDialogVisible = false;
    let dt = fomatDateToStrToYMD(new Date());
    let t1 = dt + " 00:00:00";
    let t2 = dt + " 23:59:59";
    this.timeRange = [t1, t2];
    this.baiduMap();
    this.getMapPoint();
    /* if (this.timer) {
      clearInterval(this.timer);
    } else {
      var i = 0;
      this.timer = setInterval(() => {
        this.getMapPoint(i);
      }, 30000);
    } */
  },
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
    baiduMap() {
      this.map = new window.BMap.Map("allmap"); //创建地图
      this.map.enableScrollWheelZoom(); ////启用滚轮放大缩小
      this.map.enableDragging();
      let point = new window.BMap.Point(117.56479, 39.096422); //设置地图位置
      this.map.centerAndZoom(point, 15);
      let styleJson = [
        {
          featureType: "poilabel",
          elementType: "labels",
          stylers: {
            visibility: "off"
          }
        }
      ];
      this.map.setMapStyle({ styleJson: styleJson });
      //添加地图类型控件
      this.map.addControl(
        new window.BMap.MapTypeControl({
          mapTypes: [window.BMAP_NORMAL_MAP, window.BMAP_HYBRID_MAP]
        })
      );
      this.map.clearOverlays();
    },
    //查询地图上的点位信息
    getMapPoint(num) {
      console.info(num);
      let that = this;
      mapPointsQuery()
        .then(res => {
          if (res.status) {
            let arrPois = [];
            const { data } = res.data;
            for (let i = 0; i < data.length; i++) {
              if (i == 0) {
                data[i].alarmCount = 0;
                data[i].warnCount = 3;
              }
              if (i == 2) {
                data[i].alarmCount = 0;
                data[i].warnCount = 0;
              }
              let point = new window.BMap.Point(data[i].mapX, data[i].mapY);

              arrPois.push(point);
              that.addMarker(data[i]);
            }
            that.map.setViewport(arrPois);
          }
        })
        .catch(() => {
          //this.$message.error("查询地图上的数据异常！");
        });
    },
    //地图上秒点
    addMarker(data) {
      let image = "";
      let that = this;
      let point = new window.BMap.Point(data.mapX, data.mapY);
      if (data.alarmCount > 0) {
        image = require("../../assets/images/realMonitor/alarm1.gif");
      } else if (data.warnCount > 0) {
        image = require("../../assets/images/realMonitor/warning1.gif");
      } else {
        image = require("../../assets/images/realMonitor/normal.png");
      }
      let myIcon = new window.BMap.Icon(image, new window.BMap.Size(47, 57));
      let marker = new window.BMap.Marker(point, { icon: myIcon }); // 创建标注
      this.map.addOverlay(marker);
      this.showInfoWindow(marker, data.pointId);
      marker.addEventListener(
        "onclick",
        function() {
          that.bindMarkerClick(data);
        },
        false
      );
    },
    showInfoWindow(marker, id) {
      let html = [
        "<div class='infoBoxContent'><div class='title'><strong>报警分析</strong></div>",
        "<div class='list'>",
        "<div class='dataInfo'>",
        "<div style='margin:10px 0px;'>",
        "<label>NMHC浓度：<span>5.107</span></label>",
        "<label>时间：<span>2020-09-14 15:20:34</span></label>",
        "</div>",
        "<div style='margin:10px 0px;'>",
        "<label>出口温度：234</label>",
        "<label>压力：234</label>",
        "<label>流量：234</label>",
        "</div>",
        "<div style='margin:10px 0px;'>",
        "<label>进口温度：234</label>",
        "<label>压力：234</label>",
        "<label>流量：234</label>",
        "</div>",
        "</div>",
        "<div class='chart' id='alarmlineChart" +
          id +
          "' style='width:310px;height:120px;'>",
        "</div>",
        "</div>",
        "</div>"
      ];
      let image = require("../../assets/images/realMonitor/borderBg.png");
      let infoBox = new window.BMapLib.InfoBox(this.map, html.join(""), {
        offset: new window.BMap.Size(0, 25),
        boxStyle: {
          background: "url(" + image + ") no-repeat center top",
          width: "340px",
          height: "263px"
        },
        closeIconMargin: "1px 1px 0 0",
        enableAutoPan: true,
        align: window.INFOBOX_AT_TOP
      });
      infoBox.open(marker);

      let myChart1 = this.$echarts.init(
        document.getElementById("alarmlineChart" + id),
        "macarons"
      );
      myChart1.setOption({
        grid: {
          left: "10%",
          top: "18%",
          right: "8%",
          bottom: "15%"
        },
        legend: {
          textStyle: {
            color: "#4c6cb3"
          }
        },
        tooltip: {},
        dataset: {
          source: [
            ["product", "预警", "报警"],
            ["气液比", 10, 3],
            ["NMHC浓度", 5, 2],
            ["压力", 9, 3]
          ]
        },
        color: ["#ffc773", "#e01f54"], //ffb980
        xAxis: {
          type: "category",
          axisLine: {
            lineStyle: {
              color: "#4c6cb3"
            }
          }
        },
        yAxis: {
          axisLine: {
            lineStyle: {
              color: "#4c6cb3"
            }
          }
        },
        series: [{ type: "bar" }, { type: "bar" }]
      });
    },
    //地图上的点绑定click事件
    bindMarkerClick(data) {
      this.mapDialogVisible = false;
      this.getInstitutionData(data);
    },
    //获取油气处理装置信息、发油信息
    async getInstitutionData(data) {
      var that = this;
      var params = {
        institutionId: data.pointId,
        beginTime: that.timeRange[0],
        endTime: that.timeRange[1]
      };
      that.title = data.pointName;
      that.institutionId = data.pointId;
      await institutionDataQuery(params)
        .then(res => {
          const { data } = res.data;
          that.monitorVOMap = this.handlerMonitorVOData(data.monitorVOMap);
          that.oilVOList = data.oilVOList;
          that.alarmVOList = data.alarmVOList;
          this.monitorChart = data.monitorVOChart;
          this.alarmChart = data.alarmVOChart;
          that.showmapDialogVisible();
        })
        .catch(() => {});
    },
    //处理monitorVOMap的数据格式
    handlerMonitorVOData(monitorVOMap) {
      let arry = [];
      for (let time in monitorVOMap) {
        let infoJson = monitorVOMap[time];
        infoJson["dataTime"] = time;
        arry.push(infoJson);
      }
      return arry;
    },
    showmapDialogVisible() {
      this.mapDialogVisible = true;
    }
  }
};
</script>

<style scoped lang="scss">
.baidumap {
  width: 100%;
  height: calc(100vh - 70px - 50px);
  padding: 0;
  margin: -10px 0px 0px;
  overflow: hidden;
}
</style>

<style>
.dataInfo {
  padding: 2px;
}
.dataInfo label {
  margin: 6px 5px;
  border: 1px solid #b1eef0;
  border-radius: 4px;
  padding: 4px;
  font-size: 12px;
  background: rgba(90, 121, 186, 0.7); /*  rgba(0, 0, 0, 0.07); */
}
.infoBoxContent {
  font-size: 12px;
}
.infoBoxContent .title {
  text-align: center;
  width: 100%;
  font-size: 12px;
  padding-top: 10px;
  font-weight: normal;
  color: #fff;
  letter-spacing: 2px;
  font-weight: normal;
  overflow: hidden;
}
.infoBoxContent .list {
  background: rgba(255, 255, 255, 0.8) /* #5a79ba */ /* #516bb1 */
    /*  #02366c */;
  margin: 5px 16px 0px;
  color: #fff;
  height: 220px;
  padding: 5px 1px;
}
.infoBox img {
  display: none;
}
</style>
