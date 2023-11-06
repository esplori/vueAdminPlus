import { get, post } from "@/utils/axios.js";
import contextPath from "@/utils/context-path.js";

// 查询通知分页列表
export async function getNoticeApi(data: any) {
  const url = `${contextPath}/system/getNotice`;
  const options = {};
  return post(url, data, options);
}
// 查询通知分页列表
export async function getScheduleApi(data: any) {
  const url = `${contextPath}/system/getSchedule`;
  const options = {};
  return post(url, data, options);
}
// 查询通知分页列表
export async function saveScheduleApi(data: any) {
  const url = `${contextPath}/system/saveSchedule`;
  const options = {};
  return post(url, data, options);
}
