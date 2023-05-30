import { get, post } from "@/utils/axios.js";
const contextPath = "/promote-service";

export async function getTbkShopListApi(data: any) {
  const url = `${contextPath}/promote/getList`;
  const options = { showLoading: true };
  return get(url, data, options);
}
export async function getTbkListApi(data: any) {
  const url = `${contextPath}/promote/getList/${data.page}`;
  const options = {};
  return get(url, {}, options);
}

export async function getCateApi(data: any) {
  const url = `${contextPath}/promote/getCate`;
  const options = {};
  return get(url, data, options);
}

export async function insertCateApi(data: Object) {
  const url = `${contextPath}/promote/insertCate`;
  const options = { showLoading: true };
  return post(url, data, options);
}

export async function updateCateApi(data: Object) {
  const url = `${contextPath}/promote/updateCate`;
  const options = { showLoading: true };
  return post(url, data, options);
}
export async function delCateApi(data: Object) {
  const Url = `${contextPath}/promote/delCate`;
  const options = { showLoading: true };
  return post(Url, data, options);
}
export async function delTbkApi(data: Object) {
  const Url = `${contextPath}/promote/delItem`;
  const options = { showLoading: true };
  return post(Url, data, options);
}
