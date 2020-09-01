import { post, get } from "@/utils/request";

export const login = params => post("/vruApi/login", params);
export const getInfo = () => get("userInfo", null);
export const logout = params => post("logout", params);
export const historyHeadInit = () => post("historyHeadInit", null);
export const historyQuery = params => post("historyQuery", params);
export const getVaildCode = () => post("/vruApi/getValidCode", null);
