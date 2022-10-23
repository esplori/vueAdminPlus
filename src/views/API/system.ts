import { get, post } from "@/utils/axios.js";
import contextPath from "@/utils/context-path.js";

export async function getNoticeApi(data: any) {
  const url = `${contextPath}/system/getNotice`;
  const options = {};
  return post(url, data, options);
}