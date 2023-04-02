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
// 查询音樂列表
export async function getMusicListApi(data: Object) {
  const url = `${contextPath}/tools/getMusicList`;
  const options = {};
  return post(url, data, options);
}


