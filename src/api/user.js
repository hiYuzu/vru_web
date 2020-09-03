import { post, get } from "@/utils/request";
//系统
export const login = params => post("vruApi/login", params);
export const getInfo = () => get("userInfo", null);
export const logout = params => post("logout", params);
export const historyHeadInit = () => post("historyHeadInit", null);
export const historyQuery = params => post("historyQuery", params);
export const getVaildCode = () => post("/vruApi/getValidCode", null);
//报警数据
export const getInstitutionHead = () => post("getInstitutionHead", null);
export const getAuthorityDeviceHead = params =>
  post("getAuthorityDeviceHead", params);
export const exportExcel = params => post("exportExcel", params);
export const getAlarmShowDataCount = params =>
  post("getAlarmShowDataCount", params);
//报警统计
export const getAlarmShowData = params => post("getAlarmShowData", params);
export const onOffLineStatistic = () => post("onOffLineStatistic", null);
export const onLineStatistic = () => post("onLineStatistic", null);
export const offLineStatistic = () => post("offLineStatistic", null);
export const alarmRank = params => post("alarmRank", params);
//TODO..
