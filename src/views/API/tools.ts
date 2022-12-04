import { post, get } from "@/utils/axios.js";
import contextPath from "@/utils/context-path.js";

// 编译
export async function deployApi(data: Object) {
  const url = `${contextPath}/tools/deploy`;
  const options = {};
  return post(url, data, options);
}
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

