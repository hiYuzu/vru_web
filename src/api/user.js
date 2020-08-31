import { post, get } from "@/utils/request";

export const login = params => post("login", params);
export const getInfo = () => get("userInfo", null);
export const logout = params => post("logout", params);
export const queryHead = params => post("queryHead", params);
