<template>
  <el-dialog
    title="油气概况"
    width="80%"
    :visible.sync="visible"
    :close-on-click-modal="false"
    append-to-body
  >
    <el-tabs type="border-card">
      <el-tab-pane>
        <span slot="label"><i class="el-icon-date"></i> 油气处理装置</span>
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="出口NMHC浓度">
            <el-input v-model="form.name"></el-input>
            <span> g/m3 </span>
          </el-form-item>
          <el-form-item label="出口压力">
            <el-input v-model="form.name"></el-input>
            <span> kPa </span>
          </el-form-item>
          <el-form-item label="出口温度 ">
            <el-input v-model="form.name"></el-input>
            <span> ℃</span>
          </el-form-item>
          <el-form-item label="出口流量">
            <el-input v-model="form.name"></el-input>
            <span>m3/h </span>
          </el-form-item>
          <el-form-item label="进口温度">
            <el-input v-model="form.name"></el-input>
            <span> ℃ </span>
          </el-form-item>
          <el-form-item label="进口压力">
            <el-input v-model="form.name"></el-input>
            <span>kPa</span>
          </el-form-item>
          <el-form-item label="进口流量">
            <el-input v-model="form.name"></el-input>
            <span>m3/h</span>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="发油信息">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="发油时间">
            <el-date-picker
              v-model="form.time"
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="油品类型">
            <el-input v-model="form.type"></el-input>
          </el-form-item>
          <el-form-item label="油品来源（炼油厂或储油库名称 ">
            <el-input v-model="form.company"></el-input>
          </el-form-item>
          <el-form-item label="油品去处（加油站名称）">
            <el-input v-model="form.station"></el-input>
          </el-form-item>
          <el-form-item label="发油体积">
            <el-input v-model="form.OilVolume"></el-input>
            <span> m3 </span>
          </el-form-item>
          <el-form-item label="回气体积">
            <el-input v-model="form.returnGasVolume"></el-input>
            <span>m3</span>
          </el-form-item>
          <el-form-item label="发油气液比">
            <el-input v-model="form.name"></el-input>
            <span>-</span>
          </el-form-item>
          <el-form-item label="油气收集系统压力">
            <el-input v-model="form.name"></el-input>
            <span>kPa</span>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="报警、预警">报警、预警</el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script>
export default {
  name: "MapDialog",
  data() {
    return {
      visible: this.dialogVisible,
      form: {
        name: "",
        type: "",
        company: "",
        station: "",
        OilVolume: "",
        returnGasVolume: ""
      }
    };
  },
  props: ["dialogVisible"],
  watch: {
    dialogVisible: {
      handler() {
        this.visible = this.dialogVisible;
      },
      deep: true
    }
  },
  mounted() {},
  methods: {}
};
</script>
