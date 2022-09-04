import { post, get } from "@/utils/axios";
import contextPath from "@/utils/context-path";

export async function loginApi(data: Object) {
  const url = `${contextPath}/account/login`;
  const options = { showLoading: true };
  return post(url, data, options);
}
export async function logoutApi(data: Object) {
  const url = `${contextPath}/account/logout`;
  const options = {};
  return post(url, data, options);
}
export async function registerApi(data: Object) {
  const url = `${contextPath}/account/register`;
  const options = { showLoading: true };
  return post(url, data, options);
}
export async function getValidEmailEffectiveApi(data: Object) {
  const url = `${contextPath}/account/getValidEmailEffective`;
  const options = { showLoading: true };
  return get(url, data, options);
}
