import { get, post } from "@/utils/axios.js";
import contextPath from "@/utils/context-path.js";

// 查询导航列表
export async function getListApi(data: Object) {
  const url = `${contextPath}/nav/admin/getList`;
  const options = {};
  return post(url, data, options);
}
// 查询导航详情
export async function getDetailApi(data: Object) {
  const Url = `${contextPath}/nav/getDetail`;
  const options = {};
  return get(Url, data, options);
}
// 新增导航
export async function postPageApi(data: Object) {
  const url = `${contextPath}/nav/addItem`;
  const options = { showLoading: true };
  return post(url, data, options);
}
// 删除导航
export async function delApi(data: Object) {
  const Url = `${contextPath}/nav/deleteItem`;
  const options = { showLoading: true };
  return post(Url, data, options);
}
// 更新导航
export async function editPageApi(data: Object) {
  const url = `${contextPath}/nav/updateItem`;
  const options = { showLoading: true };
  return post(url, data, options);
}
// 更新导航分类
export async function updateNavCateApi(data: any) {
  const url = `${contextPath}/nav/updateCate`;
  const options = { showLoading: true };
  return post(url, data, options);
}
// 删除导航分类
export async function delNavCateApi(data: any) {
  const Url = `${contextPath}/nav/delCate`;
  const options = { showLoading: true };
  return post(Url, data, options);
}
// 新增导航分类
export async function insertNavCateApi(data: any) {
  const url = `${contextPath}/nav/insertCate`;
  const options = { showLoading: true };
  return post(url, data, options);
}
// 查询分类列表
export async function getNavCateApi(data: any) {
  const url = `${contextPath}/nav/getCate`;
  const options = {};
  return get(url, data, options);
}
