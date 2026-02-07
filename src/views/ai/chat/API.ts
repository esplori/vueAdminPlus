import { get,post } from "@/utils/axios.js";
import contextPath from "@/utils/context-path.js";

// 文章分页列表
export async function getListApi(data: any) {
  const url = `${contextPath}/ai/getList`;
  const options = { showLoading: true };
  return get(url, data, options);
}
// 文章分页列表
export async function getpostListApi(data: any) {
  const url = `${contextPath}/ai/getDetail`;
  const options = { showLoading: true };
  return get(url, data, options);
}
export async function updateTagsByIdApi(data: any) {
  const url = `${contextPath}/ai/updateTagsById`;
  const options = { showLoading: true };
  return post(url, data, options);
}