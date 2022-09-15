import { post, get } from "@/utils/axios.js";
import contextPath from "@/utils/context-path.js";

export async function deployApi(data: Object) {
  const url = `${contextPath}/tools/deploy`;
  const options = {};
  return post(url, data, options);
}

export async function genereateQrcodeApi(data: Object) {
  const url = `${contextPath}/tools/genereateQrcode`;
  const options = {};
  return post(url, data, options);
}
export async function getRegionFromIpApi(data: Object) {
  const url = `${contextPath}/tools/getAddressFromIp`;
  const options = {};
  return get(url, data, options);
}

