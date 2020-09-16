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
import { getDay } from "@/utils/date.js";
import MapDialog from "./../../components/MapDialog.vue";
import { mapZoomLevel } from "@/config";
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
      timer: null,
      zoomLevel: 16,
      infoBoxJson: {}
    };
  },
  components: { MapDialog },
  mounted() {
    this.mapDialogVisible = false;
    let t1 = getDay(-1);
    let t2 = getDay(0);
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
      this.map.addControl(this.geoLactionCtrl());
      this.map.addControl(this.zoomInOutCtrl());
      this.map.clearOverlays();
    },
    //查询地图上的点位信息
    getMapPoint(num) {
      console.info(num);
      this.map.clearOverlays();
      this.infoBoxJson = {};
      let that = this;
      mapPointsQuery()
        .then(res => {
          if (res.status) {
            let arrPois = [];
            const { data } = res.data;
            for (let i = 0; i < data.length; i++) {
              /*   if (i == 0) {
                data[i].alarmCount = 0;
                data[i].warnCount = 3;
              }
              if (i == 2) {
                data[i].alarmCount = 0;
                data[i].warnCount = 0;
              } */
              let point = new window.BMap.Point(data[i].mapX, data[i].mapY);

              arrPois.push(point);
              that.addMarker(data[i]);
            }
            that.map.setViewport(arrPois, { margins: [160, 20, 0, 100] });
          }
        })
        .catch(() => {
          //this.$message.error("查询地图上的数据异常！");
        });
    },
    //地图上描点
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
      that.map.addOverlay(marker);

      that.map.addEventListener("zoomend", function() {
        that.zoomLevel = that.map.getZoom();
        let infobox = that.infoBoxJson[data.pointId];
        if (that.zoomLevel >= mapZoomLevel) {
          if (infobox != undefined) {
            that.infoBoxJson[data.pointId].show();
          } else {
            that.showInfoWindow(marker, data);
          }
        } else {
          if (infobox != undefined) {
            that.infoBoxJson[data.pointId].hide();
          }
        }
      });

      marker.addEventListener(
        "onclick",
        function() {
          that.bindMarkerClick(data);
        },
        false
      );
    },
    //监测点位的窗口信息
    showInfoWindow(marker, data) {
      let id = data.pointId;
      let infoDatas = data.monitorVOMap;
      let time = "";
      for (let key in infoDatas) {
        time = key;
      }
      let json = infoDatas[time];
      let CKWD = json["出口温度"] == undefined ? "-" : json["出口温度"];
      let CKND = json["出口浓度"] == undefined ? "-" : json["出口浓度"];
      let CKYL = json["出口压力"] == undefined ? "-" : json["出口压力"];
      let CKLL = json["出口流量"] == undefined ? "-" : json["出口流量"];
      let JKWD = json["进口温度"] == undefined ? "-" : json["进口温度"];
      let JKYL = json["进口压力"] == undefined ? "-" : json["进口压力"];
      let JKLL = json["进口流量"] == undefined ? "-" : json["进口流量"];
      let html = [
        "<div class='infoBoxContent'><div class='title'><strong>报警分析</strong></div>",
        "<div class='list'>",
        "<div class='dataInfo'>",
        "<div style='margin:10px 0px;'>",
        "<label>出口浓度：<span>" + CKND + "</span></label>",
        "<label>时间：<span>" + time + "</span></label>",
        "</div>",
        "<div style='margin:10px 0px;'>",
        "<label>出口温度：" + CKWD + "</label>",
        "<label>压力：" + CKYL + "</label>",
        "<label>流量：" + CKLL + "</label>",
        "</div>",
        "<div style='margin:10px 0px;'>",
        "<label>进口温度：" + JKWD + "</label>",
        "<label>压力：" + JKYL + "</label>",
        "<label>流量：" + JKLL + "</label>",
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
        offset: new window.BMap.Size(10, 30),
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
      this.infoBoxJson[id] = infoBox;
      let chartDatas = data.alarmCountVOList;
      let dataArry = [];
      dataArry.push(["product", "预警", "报警"]);
      for (let i = 0; i < chartDatas.length; i++) {
        dataArry.push([
          chartDatas[i].alarmName,
          chartDatas[i].warnCount,
          chartDatas[i].alarmCount
        ]);
      }

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
          source: dataArry
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
        series: [
          {
            type: "bar",
            label: {
              show: true,
              position: "insideBottom"
            },
            barGap: 0.1,
            showBackground: true,
            backgroundStyle: {
              color: "rgba(220, 220, 220, 0.8)"
            }
          },
          {
            type: "bar",
            label: {
              show: true,
              position: "insideBottom"
            },
            showBackground: true,
            backgroundStyle: {
              color: "rgba(220, 220, 220, 0.8)"
            }
          }
        ]
      });
    },
    //地图上的点绑定click事件
    bindMarkerClick(data) {
      this.mapDialogVisible = false;
      this.getInstitutionData(data);
    },
    //获取油气处理装置信息、发油信息
    async getInstitutionData(data) {
      let that = this;
      let t1 = getDay(-1);
      let t2 = getDay(0);
      this.timeRange = [t1, t2];
      let params = {
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
    //自定义放大缩小控件
    zoomInOutCtrl() {
      function ZoomControl() {
        // 默认停靠位置和偏移量
        this.defaultAnchor = window.BMAP_ANCHOR_BOTTOM_RIGHT;
        this.defaultOffset = new window.BMap.Size(10, 160);
      }
      let that = this;
      // 通过JavaScript的prototype属性继承于BMap.Control
      ZoomControl.prototype = new window.BMap.Control();
      // 自定义控件必须实现自己的initialize方法,并且将控件的DOM元素返回
      // 在本方法中创建个div元素作为控件的容器,并将其添加到地图容器中
      ZoomControl.prototype.initialize = function(map) {
        // 创建一个DOM元素
        let mydiv = document.createElement("div");

        let divZoomIn = document.createElement("div");
        // 添加文字说明
        divZoomIn.appendChild(document.createTextNode("+"));
        // 设置样式
        divZoomIn.style.cursor = "pointer";
        divZoomIn.className = "zoomlevel";
        divZoomIn.style.boxShadow = "4px 4px 8px #BDBDBD";
        divZoomIn.style.border = "none";
        divZoomIn.style.borderRadius = "2px 0px 0px 0px";
        divZoomIn.style.backgroundColor = "#fefefe";
        divZoomIn.style.padding = " 2px 10px";
        divZoomIn.style.fontSize = "22px";
        divZoomIn.style.color = "#5a79ba";
        // 绑定事件,点击一次放大两级
        divZoomIn.onclick = function() {
          map.setZoom(map.getZoom() + 1);
          that.zoomLevel = that.map.getZoom();
          if (that.zoomLevel >= mapZoomLevel) {
            for (let key in that.infoBoxJson) {
              that.infoBoxJson[key].show();
            }
          }
        };
        //添加放大的img图标到div中
        mydiv.appendChild(divZoomIn);

        let divZoomOut = document.createElement("div");
        // 添加文字说明
        divZoomOut.appendChild(document.createTextNode("—"));
        // 设置样式
        divZoomOut.style.cursor = "pointer";
        divZoomOut.style.boxShadow = "4px 4px 5px #BDBDBD";
        divZoomOut.style.border = "none";
        divZoomOut.style.borderTop = "1px solid #f0f0f0";
        divZoomOut.style.borderRadius = "0px 0px 2px 0px";
        divZoomOut.style.backgroundColor = "#fefefe";
        divZoomOut.style.padding = " 8px 10px";
        divZoomOut.style.fontSize = "14px";
        divZoomOut.style.fontWeight = "bold";
        divZoomOut.style.color = "#5a79ba";

        // 绑定事件,点击一次放大两级
        divZoomOut.onclick = function() {
          map.setZoom(map.getZoom() - 1);
          that.zoomLevel = that.map.getZoom();
          if (that.zoomLevel >= mapZoomLevel) {
            for (let key in that.infoBoxJson) {
              that.infoBoxJson[key].hide();
            }
          }
        };
        divZoomOut.addEventListener("touchstart", function() {
          this.style.background = "#3385ff";
        });
        divZoomOut.addEventListener("touchend", function() {
          this.style.background = "#fefefe";
        });
        //添加放大的img图标到div中
        mydiv.appendChild(divZoomOut);
        // 添加DOM元素到地图中
        map.getContainer().appendChild(mydiv);

        // 将DOM元素返回
        return mydiv;
      };
      // 创建控件
      let myZoomControl = new ZoomControl();
      return myZoomControl;
    },
    //自定义定位控件
    geoLactionCtrl() {
      function getLocationControl() {
        // 默认停靠位置和偏移量
        this.defaultAnchor = window.BMAP_ANCHOR_BOTTOM_RIGHT;
        this.defaultOffset = new window.BMap.Size(10, 110);
      }
      let that = this;
      let image = require("../../assets/images/realMonitor/location.png");
      getLocationControl.prototype = new window.BMap.Control();
      getLocationControl.prototype.initialize = function(map) {
        let divGeolaction = document.createElement("div");
        divGeolaction.style.width = "35px";
        divGeolaction.className = "locationBtn";
        divGeolaction.style.height = "35px";
        divGeolaction.style.boxShadow = "4px 4px 5px rgba(0,0,0,0.5)";
        // 创建一个DOM元素
        divGeolaction.style.backgroundColor = "#fefefe";
        divGeolaction.style.border = "none";
        divGeolaction.style.borderRadius = "4px";
        //创建一个放大用的img
        let img_location = document.createElement("img");
        //设置img的src属性
        img_location.setAttribute("src", image);
        img_location.style.margin = "4px 3px 0px 4px";
        //为img设置点击事件
        img_location.onclick = function() {
          that.getMapPoint();
          //divGeolaction.style.background = "rgba(0,0,0,0.4)";
        };
        //添加放大的img图标到div中
        divGeolaction.appendChild(img_location);

        // 添加DOM元素到地图中
        map.getContainer().appendChild(divGeolaction);

        // 将DOM元素返回
        return divGeolaction;
      };
      // 创建控件
      let myGeoLactionCtrl = new getLocationControl();
      return myGeoLactionCtrl;
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
.anchorBL {
  display: none;
}
.locationBtn:hover {
  color: #333;
  background-color: #e6e6e6;
  border-color: #adadad;
}
.locationBtn:active {
  background-image: none;
  outline: 0;
  -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
  box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
}

.locationBtn:focus,
.locationBtn:hover {
  color: #333;
  text-decoration: none;
}
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
