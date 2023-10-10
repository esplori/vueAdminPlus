<template>
  <div class="home">
    <!-- 每日一句 -->
    <el-alert :title="dailySentence" type="info" class="dailySentence" />
    <div class="card-item">
      <div class="statistic-card-list">
        <el-row>
          <el-col :span="4" v-for="(item, index) in state.momCardList" :key="index">
            <div class="statistic-card">
              <el-statistic :value="item.value">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    {{ item.name }}
                  </div>
                </template>
              </el-statistic>
              <div class="statistic-footer">
                <div class="footer-item">
                  <span>{{ item.momName }}</span>
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
        <div id="dayViews" style="width: 100%; height: 300px"></div>
      </div>
      <div class="date-picker-change">
        <el-radio-group v-model="state.tabPosition" style="margin-bottom: 30px" @change="tabChange">
          <el-radio-button label="toDay">今天</el-radio-button>
          <el-radio-button label="yesterday">最近两天</el-radio-button>
          <el-radio-button label="7day">最近7天</el-radio-button>
          <el-radio-button label="30day">最近30天</el-radio-button>
        </el-radio-group>
      </div>
      <div class="type-data">
        <div class="chart-item" v-for="(item, index)  in state.chartsDomList" :key="index">
          <div :id="item.type"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getWebStatisticsApi } from "@/views/API/stats.js";
import * as echarts from "echarts";
// 单独引入中国地图
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
    { type: "deviceType" },
    { type: "browserType" },
    { type: "deiveRatio" },
    { type: "chinaMap" },
    { type: "worldMap" },
  ],
  momCardList: [
    { name: "总访问量", value: 0, momNum: 0, momName: "今日新增" },
    { name: "今日浏览量", value: 0, momNum: 0, momName: "同比昨日" },
    { name: "今日访问IP数(UV)", value: 0, momNum: 0, momName: "同比昨日" },
    { name: "文章总数", value: 0, momNum: 0, momName: "今日新增" },
    { name: "今日访问来源", value: 0, momNum: 0, momName: "同比昨日" },
    { name: "今日访问地址", value: 0, momNum: 0, momName: "同比昨日" },
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
    let { mapData, worldMapData, allViews, allpages, dayViews, dayIp, allViewsMom, allpagesMom, dayViewsMom, dayIpMom, referrer, postView, totalWordsNum, deviceRatio, deviceType, browserType, everyDayViews } = res.data;
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
    // 设置发布视图数据
    state.momCardList[5].value = postView;
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
  nextTick(() => {
    initDayViews();
    initChart("deviceType", state.deviceTypeY, "设备型号")
    initChart("browserType", state.browserTypeY, "浏览器型号")
    initChart("deiveRatio", state.deviceRatioY, "分辨率型号")
    initChinaMap();
    initWorldMap();
  });
};
const tabChange = (type: string) => {
  getWebStatistics(type);
};
</script>

<style scoped lang="scss">
.home {
  .dailySentence {
    border: 1px dashed #d8d0d0;
    margin-bottom: 20px;
  }

  .date-picker-change {
    text-align: right;
    margin-top: 30px;
  }

  .card-item {
    .statistic-card-list {
      border: 1px solid #ddd;
      border-radius: 4px;
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

      &:nth-child(odd) {
        padding-right: 20px;
      }

    }
  }

  .dayViews {
    padding: 20px 0 0 0;
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
    border-radius: 4px;
    border: 1px solid rgb(228, 231, 237);
    margin-bottom: 20px;

    &:hover {
      box-shadow: 0 0 1px 1px #ddd;
      transition: all 1000ms;
      transform: scale(1.005);
    }
  }

  .statistic-card {
    height: 100%;
    padding: 20px;
    border-radius: 4px;
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
