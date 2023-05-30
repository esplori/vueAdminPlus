import { get, post } from "@/utils/axios.js";
import contextPath from "@/utils/context-path.js";

// 查询通知分页列表
export async function getNoticeApi(data: any) {
  const url = `${contextPath}/system/getNotice`;
  const options = {};
  return post(url, data, options);
}
