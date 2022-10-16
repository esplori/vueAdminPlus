import { get, post } from "@/utils/axios.js";
import contextPath from "@/utils/context-path.js";

export async function insertMenuApi(data: any) {
  const url = `${contextPath}/admin/insertMenu`;
  const options = { showLoading: false };
  return post(url, data, options);
}

export async function getAllMenusApi(data: any) {
  const url = `${contextPath}/admin/getAllMenus`;
  const options = { showLoading: false };
  return get(url, data, options);
}
export async function updateMenuApi(data: any) {
  const url = `${contextPath}/admin/updateMenu`;
  const options = { showLoading: false };
  return post(url, data, options);
}
export async function deleteMenuApi(data: any) {
  const url = `${contextPath}/admin/deleteMenu`;
  const options = { showLoading: false };
  return post(url, data, options);
}


