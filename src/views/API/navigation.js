import { get, post } from "@/utils/axios.js";
import contextPath from "@/utils/context-path.js";

export async function getListApi(data) {
  const url = `${contextPath}/nav/admin/getList`;
  const options = {};
  return post(url, data, options);
}
export async function getDetailApi(data) {
  const Url = `${contextPath}/nav/getDetail`;
  const options = {};
  return get(Url, data, options);
}
export async function postPageApi(data) {
  const url = `${contextPath}/nav/addItem`;
  const options = { showLoading: true };
  return post(url, data, options);
}
export async function delApi(data) {
  const Url = `${contextPath}/nav/deleteItem`;
  const options = { showLoading: true };
  return post(Url, data, options);
}
export async function editPageApi(data) {
  const url = `${contextPath}/nav/updateItem`;
  const options = { showLoading: true };
  return post(url, data, options);
}
export async function getCateApi(data) {
  const url = `${contextPath}/pages/getCate`;
  const options = {};
  return get(url, data, options);
}
export async function updateCateApi(data) {
  const url = `${contextPath}/pages/updateCate`;
  const options = { showLoading: true };
  return post(url, data, options);
}
export async function delCateApi(data) {
  const Url = `${contextPath}/pages/delCate`;
  const options = { showLoading: true };
  return post(Url, data, options);
}
export async function insertCateApi(data) {
  const url = `${contextPath}/pages/insertCate`;
  const options = { showLoading: true };
  return post(url, data, options);
}
export async function getImageListApi(data) {
  const url = `${contextPath}/pages/getImageList`;
  const options = {};
  return post(url, data, options);
}
export async function delFileApi(data) {
  const url = `${contextPath}/pages/delFile`;
  const options = {};
  return post(url, data, options);
}
export async function updateUserInfoApi(data) {
  const url = `${contextPath}/account/updateUserInfo`;
  const options = { showLoading: true };
  return post(url, data, options);
}
export async function getUserInfoApi(data) {
  const url = `${contextPath}/account/getUserInfo`;
  const options = {};
  return get(url, data, options);
}
