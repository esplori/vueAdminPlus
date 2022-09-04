import { get, post } from "@/utils/axios.js";
import contextPath from "@/utils/context-path.js";

export async function getListApi(data) {
  const url = `${contextPath}/pages/getList`;
  const options = {};
  return post(url, data, options);
}
export async function getDetailApi(data) {
  const Url = `${contextPath}/pages/getDetail`;
  const options = {};
  return get(Url, data, options);
}
export async function searchApi(data) {
  const Url = `${contextPath}/pages/search`;
  const options = {};
  return get(Url, data, options);
}
export async function getRecomListApi(data) {
  const url = `${contextPath}/pages/getRecomList`;
  const options = {};
  return post(url, data, options);
}
export async function insertCommentApi(data) {
  const url = `${contextPath}/pages/insertComment`;
  const options = {};
  return post(url, data, options);
}
export async function getCommentApi(data) {
  const url = `${contextPath}/pages/getComment`;
  const options = {};
  return get(url, data, options);
}
export async function delCommentApi(data) {
  const url = `${contextPath}/pages/delComment`;
  const options = {};
  return post(url, data, options);
}
export async function getLatestCommentsApi(data) {
  const url = `${contextPath}/pages/getLatestComments`;
  const options = {};
  return get(url, data, options);
}
