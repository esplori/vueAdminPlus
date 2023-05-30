import { get, post } from "@/utils/axios.js";
import contextPath from "@/utils/context-path.js";
// 新增菜单
export async function insertMenuApi(data: any) {
  const url = `${contextPath}/admin/insertMenu`;
  const options = { showLoading: false };
  return post(url, data, options);
}
// 查询所有菜单
export async function getAllMenusApi(data: any) {
  const url = `${contextPath}/admin/getAllMenus`;
  const options = { showLoading: false };
  return get(url, data, options);
}
// 更新菜单
export async function updateMenuApi(data: any) {
  const url = `${contextPath}/admin/updateMenu`;
  const options = { showLoading: false };
  return post(url, data, options);
}
// 删除菜单
export async function deleteMenuApi(data: any) {
  const url = `${contextPath}/admin/deleteMenu`;
  const options = { showLoading: false };
  return post(url, data, options);
}
// 文件上传地址
export function fileUploadApi() {
  return `${contextPath}/account/upload`;
}
