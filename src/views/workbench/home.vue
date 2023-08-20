<template>
  <div class="home">
    <!-- 每日一句 -->
    <el-alert :title="dailySentence" type="info" class="dailySentence" />
    <div class="card-item">
      <div class="statistic-card-list">
        <el-row>
          <el-col :span="4">
            <div class="statistic-card">
              <el-statistic :value="state.views">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    总访问量
                  </div>
                </template>
              </el-statistic>
              <div class="statistic-footer">
                <div class="footer-item">
                  <span>今日新增</span>
                  <span class="red">
                    {{ Math.abs(state.allViewsMom) }}
                    <el-icon>
                      <CaretTop />
                    </el-icon>
                  </span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="statistic-card">
              <el-statistic :value="state.dayViews">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    今日浏览量(PV)
                  </div>
                </template>
              </el-statistic>
              <div class="statistic-footer">
                <div class="footer-item">
                  <span>今日新增</span>
                  <span class="red" v-if="state.dayViewsMom >= 0">
                    {{ Math.abs(state.dayViewsMom) }}
                    <el-icon>
                      <CaretTop />
                    </el-icon>
                  </span>
                  <span class="green" v-else>
                    {{ Math.abs(state.dayViewsMom) }}
                    <el-icon>
                      <CaretBottom />
                    </el-icon>
                  </span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="statistic-card">
              <el-statistic :value="state.dayIp">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    今日访问IP数(UV)
                  </div>
                </template>
              </el-statistic>
              <div class="statistic-footer">
                <div class="footer-item">
                  <span>今日新增</span>
                  <span class="red" v-if="state.dayIpMom >= 0">
                    {{ Math.abs(state.dayIpMom) }}
                    <el-icon>
                      <CaretTop />
                    </el-icon>
                  </span>
                  <span class="green" v-else>
                    {{ Math.abs(state.dayIpMom) }}
                    <el-icon>
                      <CaretBottom />
                    </el-icon>
                  </span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="statistic-card">
              <el-statistic :value="state.pages">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    文章总数
                  </div>
                </template>
              </el-statistic>
              <div class="statistic-footer">
                <div class="footer-item">
                  <span>今日新增</span>
                  <span class="red" v-if="state.allpagesMom >= 0">
                    {{ Math.abs(state.allpagesMom) }}
                    <el-icon>
                      <CaretTop />
                    </el-icon>
                  </span>
                  <span class="green" v-else>
                    {{ Math.abs(state.allpagesMom) }}
                    <el-icon>
                      <CaretBottom />
                    </el-icon>
                  </span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="statistic-card">
              <el-statistic :value="state.referrerTableData">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    今天访问来源
                  </div>
                </template>
              </el-statistic>
              <div class="statistic-footer">
                <div class="footer-item">
                  <span>今日新增</span>
                  <span class="red">
                    {{ Math.abs(0) }}
                    <el-icon>
                      <CaretTop />
                    </el-icon>
                  </span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="statistic-card">
              <el-statistic :value="state.postViewTableData">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    今天访问地址
                  </div>
                </template>
              </el-statistic>
              <div class="statistic-footer">
                <div class="footer-item">
                  <span>今日新增</span>
                  <span class="red">
                    {{ Math.abs(0) }}
                    <el-icon>
                      <CaretTop />
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
        <el-row>
          <el-col :span="24">
            <div>
              <div id="deviceType"></div>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <div>
              <div id="browserType"></div>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <div>
              <div id="deiveRatio"></div>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div>
              <div id="chindMap"></div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getWebStatisticsApi } from "@/views/API/stats.js";
import * as echarts from "echarts";
// 单独引入中国地图
import "echarts-countries-js/echarts-countries-js/china";

import { reactive, computed, onMounted, nextTick } from "vue";
import { CaretTop, CaretBottom } from "@element-plus/icons-vue";
import { delHtmlTag } from "@/utils/common.js";
import { userInfoStore } from "@/stores/userInfo";
import nameMapDict from "../API/nameMapDict.js";
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
const initChart = (dom_id: string, data: Array<{ name: string, value: number }>) => {
  const dom = document.getElementById(dom_id);
  if (!dom) {
    return false;
  }
  dom.removeAttribute("_echarts_instance_");
  const myChart = echarts.init(dom);
  myChart.setOption({
    title: {
      text: "设备型号",
      left: 20,
      top: 10
    },
    tooltip: {
      trigger: "item",
      formatter: " {a} <br/>{b} : {c}({d}%)",
    },
    series: [
      {
        name: "设备型号",
        type: "pie",
        data: data,
        radius: ["40%", "60%"],
      },
    ],
  });
  myChart.resize();
};

const initDayViews = () => {
  const dom = document.getElementById("dayViews");
  if (!dom) {
    return false;
  }
  dom.removeAttribute("_echarts_instance_");
  const myChart = echarts.init(dom);
  myChart.setOption({
    title: {
      text: "最近30天访问量",
      left: 20,
      top: 10
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
        shadowStyle: {
          color: "rgba(0,0,0,0.08)",
        },
      },
    },
    legend: {
      top: 10
    },
    xAxis: {
      data: state.everyDayViews.map((item: any) => {
        return item.createDate;
      }),
      boundaryGap: true,
      axisLabel: {
        interval: 5,
        rotate: 0, // 倾斜度 -90 至 90 默认为0
        margin: 8,
        formatter: function (value: string) {
          const str = value.slice(0, 10).slice(-5);
          return str;
        },
      },
      axisLine: {
        lineStyle: {
          color: "#a0a6a8",
        },
      },
    },
    yAxis: {
      splitNumber: 4,
      splitLine: {
        show: true,
        lineStyle: {
          type: "dashed",
        },
      },
    },
    series: [
      {
        name: "今日访问IP数(UV)",
        type: "line",
        stack: "Total",
        areaStyle: {
          // color: "#f59695"
        },
        emphasis: {
          focus: "series",
        },
        data: state.everyDayViews.map((item: any) => {
          return item.dayIp;
        }),
        smooth: true,
        showSymbol: false
      },
      {
        name: "今日浏览量(PV)",
        type: "line",
        stack: "Total",
        showSymbol: false,
        areaStyle: {
          // color: "#9fd3e8"
        },
        emphasis: {
          focus: "series",
        },
        data: state.everyDayViews.map((item: any) => {
          return item.dayViews;
        }),
        label: {
          show: true,
          position: "top",
        },
        smooth: true,
      },
    ],
  });
  myChart.resize();
};

const initChindMap = () => {
  const dom = document.getElementById("chindMap");
  if (!dom) {
    return false;
  }
  dom.removeAttribute("_echarts_instance_");
  const myChart = echarts.init(dom);
  myChart.setOption({
    colorBy: "series",
    name: "city",
    label: {
      color: "red",
    },
    tooltip: {
      trigger: "item",
      formatter: function (params: any) {
        return `${params.name}: ${params.value || 0}`;
      },
    },
    visualMap: {
      min: 0,
      max: 200,
      text: ["High", "Low"],
      realtime: false,
      calculable: true,
      inRange: {
        color: ["lightskyblue", "yellow", "orangered"],
      },
    },
    series: [
      {
        type: "map",
        map: "china",
        data: state.mapData,
        nameMap: nameMapDict
      },
    ],
  });
};
const getWebStatistics = async (type: string) => {
  // 获取网站统计信息
  const res: any = await getWebStatisticsApi({ type: type });
  if (res) {
    // 设置视图数据
    state.views = res.data.allViews;
    // 设置页面数据
    state.pages = res.data.allpages;
    // 设置地图数据
    state.mapData = res.data.mapData;
    // 设置日视图数据
    state.dayViews = res.data.dayViews;
    // 设置日IP数据
    state.dayIp = res.data.dayIp;
    // 设置总视图数据
    state.allViewsMom = parseFloat(res.data.allViewsMom);
    // 设置总页面数据
    state.allpagesMom = parseFloat(res.data.allpagesMom);
    // 设置日视图数据
    state.dayViewsMom = parseFloat(res.data.dayViewsMom);
    // 设置日IP数据
    state.dayIpMom = parseFloat(res.data.dayIpMom);
    // 设置设备比例Y
    state.deviceRatioY = res.data.deviceRatio.map((item: any) => {
      return { name: item.screen, value: item.num };
    });
    // 设置设备类型Y
    state.deviceTypeY = res.data.deviceType.map((item: any) => {
      return { name: item.os, value: item.num };
    });
    // 设置浏览器类型Y
    state.browserTypeY = res.data.browserType.map((item: any) => {
      return { name: item.browse, value: item.num };
    });
    // 设置每日视图数据
    state.everyDayViews = res.data.everyDayViews;
    // 初始化图表
    initCharts();
    // 设置引用数据
    state.referrerTableData = res.data.referrer;
    // 设置发布视图数据
    state.postViewTableData = res.data.postView;
    // 设置总字数
    state.totalWordsNum = res.data.totalWordsNum || 0;
  }
};
const initCharts = () => {
  nextTick(() => {
    initDayViews();
    initChindMap();
    initChart("deviceType", state.deviceTypeY)
    initChart("browserType", state.browserTypeY)
    initChart("deiveRatio", state.deviceRatioY)
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
    }
  }

  .dayViews {
    padding: 20px 0 0 0;
  }


  #deviceType,
  #browserType,
  #deiveRatio,
  #dayViews,
  #chindMap {
    max-width: 100%;
    height: 320px;
    box-sizing: border-box;
    border-radius: 4px;
    border: 1px solid rgb(228, 231, 237);
    margin-bottom: 20px;
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
