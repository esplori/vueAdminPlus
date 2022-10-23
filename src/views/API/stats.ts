import { get } from "@/utils/axios.js";
import contextPath from "@/utils/context-path.js";

export async function getWebStatisticsApi(data: Object) {
  const url = `${contextPath}/stats/getWebStatistics`;
  const options = {showLoading: false};
  return get(url, {}, options);
}
