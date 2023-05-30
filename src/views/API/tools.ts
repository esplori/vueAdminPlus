import { post, get } from "@/utils/axios.js";
import contextPath from "@/utils/context-path.js";

// 生成二维码
export async function genereateQrcodeApi(data: Object) {
  const url = `${contextPath}/tools/genereateQrcode`;
  const options = {};
  return post(url, data, options);
}
// 获取Ip
export async function getRegionFromIpApi(data: Object) {
  const url = `${contextPath}/tools/getAddressFromIp`;
  const options = {};
  return get(url, data, options);
}
// 查询小说
export async function getBookListApi(data: Object) {
  const url = `${contextPath}/tools/getBookList`;
  const options = {};
  return post(url, data, options);
}
// 查询音乐列表
export async function getMusicListApi(data: Object) {
  const url = `${contextPath}/tools/getMusicList`;
  const options = {};
  return post(url, data, options);
}
// 新增音乐
export async function insertMusicItemApi(data: Object) {
  const url = `${contextPath}/tools/insertMusicItem`;
  const options = {};
  return post(url, data, options);
}
// 更新音乐
export async function updateMusicItemApi(data: Object) {
  const url = `${contextPath}/tools/updateMusicItem`;
  const options = {};
  return post(url, data, options);
}
// 删除音乐
export async function delMusicItemApi(data: Object) {
  const url = `${contextPath}/tools/delMusicItem`;
  const options = {};
  return post(url, data, options);
}
