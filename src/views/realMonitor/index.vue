<template>
  <div>
    <div class="baidumap" id="allmap"></div>
  </div>
</template>
<script>
export default {
  name: "realMonitor",
  data() {
    return { map: null };
  },
  mounted() {
    this.baiduMap();
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
