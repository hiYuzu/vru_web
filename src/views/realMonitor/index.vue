<template>
  <div>
    <div class="baidumap" id="allmap"></div>
    <map-dialog
      v-show="mapDialogVisible"
      :dialogVisible="mapDialogVisible"
      :monitorVOMap="monitorVOMap"
      :oilVOList="oilVOList"
      :alarmListInfo="alarmVOList"
    ></map-dialog>
  </div>
</template>
<script>
import { mapPointsQuery, institutionDataQuery } from "@/api/user";
import MapDialog from "./../../components/MapDialog.vue";
export default {
  name: "realMonitor",
  data() {
    return {
      map: null,
      mapDialogVisible: false,
      monitorVOMap: [],
      oilVOList: [],
      alarmVOList: []
    };
  },
  components: { MapDialog },
  mounted() {
    this.mapDialogVisible = false;
    this.baiduMap();
    this.getMapPoint();
  },
  methods: {
    baiduMap() {
      this.map = new window.BMap.Map("allmap"); //创建地图
      this.map.enableScrollWheelZoom(); ////启用滚轮放大缩小
      this.map.enableDragging();
      let point = new window.BMap.Point(117.56479, 39.096422); //设置地图位置
      this.map.centerAndZoom(point, 16);
      //添加地图类型控件
      this.map.addControl(
        new window.BMap.MapTypeControl({
          mapTypes: [window.BMAP_NORMAL_MAP, window.BMAP_HYBRID_MAP]
        })
      );
      this.map.clearOverlays();
    },
    //查询地图上的点位信息
    getMapPoint() {
      let that = this;
      mapPointsQuery()
        .then(res => {
          if (res.status) {
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
              that.addMarker(data[i]);
            }
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
        image = require("../../assets/images/realMonitor/alarm.gif");
      } else if (data.warnCount > 0) {
        image = require("../../assets/images/realMonitor/warning.gif");
      } else {
        image = require("../../assets/images/realMonitor/normal.png");
      }
      let myIcon = new window.BMap.Icon(image, new window.BMap.Size(300, 157));
      let marker = new window.BMap.Marker(point, { icon: myIcon }); // 创建标注
      this.map.addOverlay(marker);
      marker.addEventListener(
        "onclick",
        function() {
          that.bindMarkerClick(data);
        },
        false
      );
    },
    //地图上的点绑定click事件
    bindMarkerClick(data) {
      this.mapDialogVisible = false;
      this.getInstitutionData(data);
    },
    //获取油气处理装置信息、发油信息
    async getInstitutionData(data) {
      var that = this;
      var params = { institutionId: data.pointId, beginTime: "", endTime: "" };
      await institutionDataQuery(params)
        .then(res => {
          const { data } = res.data;
          that.monitorVOMap = this.handlerMonitorVOData(data.monitorVOMap);
          that.oilVOList = data.oilVOList;
          that.alarmVOList = data.alarmVOList;
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
