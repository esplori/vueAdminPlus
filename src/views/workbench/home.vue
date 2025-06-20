<template>
  <div class="home">
    <!-- 每日一句 -->
    <el-alert :title="dailySentence" class="dailySentence" />
    <div class="card-item">
      <div class="statistic-card-list">
        <el-row>
          <el-col :span="4" v-for="(item, index) in state.momCardList" :key="index">
            <div class="statistic-card">
              <el-statistic :value="item.value">
                <template #title>
                  <div class="statistic-title">
                    {{ item.name }}
                  </div>
                </template>
              </el-statistic>
              <div class="statistic-footer">
                <div class="footer-item">
                  <span class="name">{{ item.momName }}</span>
                  <span class="red" v-if="item.momNum > 0">
                    {{ Math.abs(item.momNum) }}
                    <el-icon>
                      <CaretTop />
                    </el-icon>
                  </span>
                  <span class="green" v-else>
                    {{ Math.abs(item.momNum) }}
                    <el-icon v-if="item.momNum !== 0">
                      <CaretBottom />
                    </el-icon>
                  </span>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>


      <div class="dayViews">
        <div class="chart-name">最近30天访问量</div>
        <div id="dayViews" style="width: 100%; height: 300px"></div>
      </div>
      <div class="date-picker-change">
        <el-radio-group v-model="state.tabPosition" @change="tabChange" size="large">
          <el-radio-button label="toDay">今天</el-radio-button>
          <el-radio-button label="yesterday">最近两天</el-radio-button>
          <el-radio-button label="7day">最近7天</el-radio-button>
          <el-radio-button label="30day">最近30天</el-radio-button>
        </el-radio-group>
      </div>
      <div class="type-data">
        <div class="chart-item" v-for="(item, index)  in state.chartsDomList" :key="index">
          <div class="chart-name">{{ item.name }}</div>
          <div :id="item.type"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getWebStatisticsApi } from "@/views/API/stats.js";
import * as echarts from "echarts";
// 引入中国地图，世界地图
import "echarts-countries-js/echarts-countries-js/china";
import "echarts-countries-js/echarts-countries-js/world";

import { reactive, computed, onMounted, nextTick } from "vue";
import { CaretTop, CaretBottom } from "@element-plus/icons-vue";
import { delHtmlTag, mapOptions, worldMapOptions, commonOptions, dayViewsOptions } from "@/utils/common.js";
import { userInfoStore } from "@/stores/userInfo";
const state = reactive({
  views: 0,
  pages: 0,
  dayViews: 0,
  dayIp: 0,
  dateRange: [],
  deviceRatioY: [],
  deviceTypeY: [],
  browserTypeY: [],
  options: {
    startVal: 0,
  },
  everyDayViews: [],
  allViewsMom: 0,
  allpagesMom: 0,
  dayViewsMom: 0,
  dayIpMom: 0,
  list: [],
  referrerTableData: [],
  postViewTableData: [],
  totalWordsNum: 0,
  tabPosition: "toDay",
  mapData: [],
  worldMapData: [],
  chartsDomList: [
    { type: "deviceType", name: "设备型号分布" },
    { type: "browserType", name: "浏览器型号分布" },
    { type: "deiveRatio", name: "分辨率分布" },
    { type: "chinaMap", name: "访问地域分布" },
    { type: "worldMap", name: "全球访问地域分布" },
  ],
  momCardList: [
    { name: "总访问量", value: 0, momNum: 0, momName: "今日新增" },
    { name: "浏览量", value: 0, momNum: 0, momName: "同比昨日" },
    { name: "访问IP数(UV)", value: 0, momNum: 0, momName: "同比昨日" },
    { name: "文章总数", value: 0, momNum: 0, momName: "同比昨日" },
    { name: "访问来源", value: 0, momNum: 0, momName: "同比昨日" },
    { name: "访问地址", value: 0, momNum: 0, momName: "同比昨日" },
  ]
});

const us = userInfoStore();

const userInfo = computed(() => {
  const usrinfo = localStorage.getItem("userInfo");
  if (usrinfo) {
    return JSON.parse(usrinfo);
  } else {
    return {
      role: [],
    };
  }
});
const dailySentence = computed(() => {
  const dailySentence = us.userInfo.dailySentence;
  if (dailySentence) {
    return delHtmlTag("每日一句：" + dailySentence);
  }
});
onMounted(() => {
  getWebStatistics(state.tabPosition);
  window.addEventListener("resize", () => {
    initCharts();
  });
});
const initChart = (dom_id: string, data: Array<{ name: string, value: number }>, title: string) => {
  const dom = document.getElementById(dom_id);
  if (!dom) {
    return false;
  }
  dom.removeAttribute("_echarts_instance_");
  const myChart = echarts.init(dom);
  myChart.setOption(commonOptions(title, data));
  myChart.resize();
};

const initDayViews = () => {
  const dom = document.getElementById("dayViews");
  if (!dom) {
    return false;
  }
  dom.removeAttribute("_echarts_instance_");
  const myChart = echarts.init(dom);
  myChart.setOption(dayViewsOptions(state));
  myChart.resize();
};

const initChinaMap = () => {
  const dom = document.getElementById("chinaMap");
  if (!dom) {
    return false;
  }
  dom.removeAttribute("_echarts_instance_");
  const myChart = echarts.init(dom);
  myChart.setOption(mapOptions(state.mapData));
};
const initWorldMap = () => {
  const dom = document.getElementById("worldMap");
  if (!dom) {
    return false;
  }
  dom.removeAttribute("_echarts_instance_");
  const myChart = echarts.init(dom);
  myChart.setOption(worldMapOptions(state.worldMapData));
};
const getWebStatistics = async (type: string) => {
  // 获取网站统计信息
  const res: any = await getWebStatisticsApi({ type: type });
  if (res) {
    let { mapData, worldMapData, allViews, allpages, dayViews, dayIp, allViewsMom, allpagesMom, dayViewsMom, dayIpMom, referrer, viewAddress, totalWordsNum, deviceRatio, deviceType, browserType, everyDayViews, twoDayagoNumDaysAddress, twoDayagoNumDaysReferrer } = res.data;
    // 设置视图数据
    state.momCardList[0].value = allViews;
    // 设置文章数据
    state.momCardList[3].value = allpages;
    // 设置地图数据
    state.mapData = mapData;
    // 设置世界地图数据
    state.worldMapData = worldMapData;
    // 设置日视图数据
    state.momCardList[1].value = dayViews;
    // 设置日IP数据
    state.momCardList[2].value = dayIp;
    // 设置总视图数据
    state.momCardList[0].momNum = parseFloat(allViewsMom);
    // 设置总页面数据
    state.momCardList[3].momNum = parseFloat(allpagesMom);
    // 设置日视图数据
    state.momCardList[1].momNum = parseFloat(dayViewsMom);
    // 设置日IP数据
    state.momCardList[2].momNum = parseFloat(dayIpMom);
    // 设置引用数据
    state.momCardList[4].value = referrer;

    state.momCardList[4].momNum = twoDayagoNumDaysReferrer;
    // 设置发布视图数据
    state.momCardList[5].value = viewAddress;

    state.momCardList[5].momNum = twoDayagoNumDaysAddress;
    // 设置总字数
    state.totalWordsNum = totalWordsNum || 0;
    // 设置设备比例Y
    state.deviceRatioY = deviceRatio.map((item: any) => {
      return { name: item.screen, value: item.num };
    });
    // 设置设备类型Y
    state.deviceTypeY = deviceType.map((item: any) => {
      return { name: item.os, value: item.num };
    });
    // 设置浏览器类型Y
    state.browserTypeY = browserType.map((item: any) => {
      return { name: item.browse, value: item.num };
    });
    // 设置每日视图数据
    state.everyDayViews = everyDayViews;
    // 初始化图表
    initCharts();

  }
};
const initCharts = () => {
  initDayViews();
  initChart("deviceType", state.deviceTypeY, "")
  initChart("browserType", state.browserTypeY, "")
  initChart("deiveRatio", state.deviceRatioY, "")
  initChinaMap();
  initWorldMap();
};
const tabChange = (type: string) => {
  getWebStatistics(type);
};
</script>

<style scoped lang="scss">
.home {
  ::v-deep(.dailySentence) {
    border: 1px dashed #d8d0d0;
    margin-bottom: 20px;
    color: #303133;
    // background-image: linear-gradient(90deg, rgba(103,194,54,0), rgba(103,194,54,0.1));

    .el-alert__title {
      font-size: 16px;
      opacity: 0.8;
    }
  }

  .date-picker-change {
    margin-top: 20px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .card-item {
    .statistic-card-list {
      border: 1px solid #ddd;
      border-radius: 4px;
      // background-image: linear-gradient(90deg, rgba(58,77,233,0), rgba(58,77,233,0.05))
    }

    .el-col {
      text-align: center;
    }


    .type-data {
      padding: 0;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
    }

    .chart-item {
      width: 50%;

      .chart-name {
        font-size: medium;
        // font-weight: bold;
        padding: 10px;
        border-top: 1px solid rgb(228, 231, 237);
        border-left: 1px solid rgb(228, 231, 237);
        border-right: 1px solid rgb(228, 231, 237);
        // background-image: linear-gradient(to top , rgba(58,77,233,0), rgba(58,77,233,0.1))
      }

      &:nth-child(odd) {
        padding-right: 20px;
      }

    }
  }

  .dayViews {
    padding: 20px 0 0 0;

    .chart-name {
      font-size: medium;
      // font-weight: bold;
      padding: 10px;
      border-top: 1px solid rgb(228, 231, 237);
      border-left: 1px solid rgb(228, 231, 237);
      border-right: 1px solid rgb(228, 231, 237);
      // background-image: linear-gradient(90deg, rgb(255 255 255), rgb(209 204 239))
    }
  }


  #deviceType,
  #browserType,
  #deiveRatio,
  #dayViews,
  #chinaMap,
  #worldMap {
    width: 100%;
    height: 320px;
    box-sizing: border-box;
    // border-radius: 4px;
    border: 1px solid rgb(228, 231, 237);
    margin-bottom: 20px;

    // &:hover {
    //   box-shadow: 0 0 1px 1px #ddd;
    //   transition: all 1000ms;
    //   transform: scale(1.005);
    // }
  }

  .statistic-card {
    height: 100%;
    padding: 20px;
    border-radius: 4px;

    .statistic-title {
      display: inline-flex;
      align-items: center;
      font-size: 16px;
    }
  }

  .statistic-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    font-size: 12px;
    margin-top: 12px;
  }

  .statistic-footer .footer-item {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .name {
      color: var(--el-text-color-regular);
    }
  }

  .statistic-footer .footer-item span:last-child {
    display: inline-flex;
    align-items: center;
    margin-left: 4px;
  }

  .green {
    color: var(--el-color-success);
  }

  .red {
    color: var(--el-color-error);
  }
}
</style>
