import { get, post } from "@/utils/axios.js";
import contextPath from "@/utils/context-path.js";

// 文章分页列表
export async function getListApi(data: any) {
  const url = `${contextPath}/sd/getList`;
  const options = { showLoading: true };
  return post(url, data, options);
}
export function sdUploadApi() {
  const url = `${contextPath}/account/sdUpload`
  return url;
}