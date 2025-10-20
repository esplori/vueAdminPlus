import { get } from "@/utils/axios.js";
import contextPath from "@/utils/context-path.js";

// 文章分页列表
export async function getListApi(data: any) {
  const url = `${contextPath}/ai/getList`;
  const options = { showLoading: true };
  return get(url, data, options);
}