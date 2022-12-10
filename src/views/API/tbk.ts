import { get, post } from "@/utils/axios.js";
const contextPath = "/tbk-service";

export async function getTbkShopListApi(data: any) {
  const url = `${contextPath}/tbk/getList`;
  const options = {};
  return get(url, data, options);
}
export async function getTbkListApi(data: any) {
  const url = `${contextPath}/tbk/getList/${data.page}`;
  const options = {};
  return get(url, {}, options);
}

export async function getCateApi(data: any) {
  const url = `${contextPath}/tbk/getCate`;
  const options = {};
  return get(url, data, options);
}

export async function insertCateApi(data: Object) {
  const url = `${contextPath}/tbk/insertCate`;
  const options = { showLoading: true };
  return post(url, data, options);
}

export async function updateCateApi(data: Object) {
  const url = `${contextPath}/tbk/updateCate`;
  const options = { showLoading: true };
  return post(url, data, options);
}
export async function delCateApi(data: Object) {
  const Url = `${contextPath}/tbk/delCate`;
  const options = { showLoading: true };
  return post(Url, data, options);
}
export async function delTbkApi(data: Object) {
  const Url = `${contextPath}/tbk/delItem`;
  const options = { showLoading: true };
  return post(Url, data, options);
}
