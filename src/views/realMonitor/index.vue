<template>
  <div>
    <div class="baidumap" id="allmap"></div>
  </div>
</template>
<script>
import { mapPointsQuery } from "@/api/user";
export default {
  name: "realMonitor",
  data() {
    return { map: null };
  },
  mounted() {
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
            console.info(data.length);
            debugger;
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
    addMarker(data) {
      let image = "";
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
