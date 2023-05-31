<template>
  <div class="home">
    <!-- 每日一句 -->
    <el-alert :title="dailySentence" type="info" class="dailySentence" />
    <div class="card-item">
      <el-row :gutter="10" style="width: 100%">
        <el-col :span="8">
          <el-card shadow="hover">
            <div class="item-title">总访问量</div>
            <div class="item-amount" ref="countupviews" id="countupviews">
              {{ state.views }}
            </div>
            <div class="item-compare">
              <span>今日新增 </span>
              <span class="num"> {{ Math.abs(state.allViewsMom) }} </span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover">
            <div class="item-title">今日浏览量(PV)</div>
            <div class="item-amount" ref="countupdayViews" id="countupdayViews">
              {{ state.dayViews }}
            </div>
            <div class="item-compare">
              <span>较昨日
                <el-icon v-show="state.dayViewsMom > 0" :size="16" color="#F56C6C">
                  <CaretTop></CaretTop>
                </el-icon>
                <el-icon v-show="state.dayViewsMom < 0" :size="16" color="#F56C6C">
                  <CaretBottom></CaretBottom>
                </el-icon>
              </span>
              <span class="num"> {{ Math.abs(state.dayViewsMom) }} </span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover">
            <div class="item-title">今日访问IP数(UV)</div>
            <div class="item-amount" ref="countupdayIp" id="countupdayIp">
              {{ state.dayIp }}
            </div>
            <div class="item-compare">
              <span>较昨日

                <el-icon v-show="state.dayIpMom > 0" :size="16" color="#F56C6C">
                  <CaretTop></CaretTop>
                </el-icon>
                <el-icon v-show="state.dayIpMom < 0" :size="16" color="#F56C6C">
                  <CaretBottom></CaretBottom>
                </el-icon>
              </span>
              <span class="num"> {{ Math.abs(state.dayIpMom) }} </span>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="width: 100%; margin-top: 10px">
        <el-col :span="8">
          <el-card shadow="hover">
            <div class="item-title">文章总数</div>
            <div class="item-amount" ref="countuppages" id="countuppages">
              {{ state.pages }}
            </div>
            <div class="item-compare">
              <span>较昨日

                <el-icon v-show="state.allpagesMom > 0" :size="16" color="#F56C6C">
                  <CaretTop></CaretTop>
                </el-icon>
                <el-icon v-show="state.allpagesMom < 0" :size="16" color="#91cc74">
                  <CaretBottom></CaretBottom>
                </el-icon>
              </span>
              <span class="num"> {{ Math.abs(state.allpagesMom) }} </span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover">
            <div class="item-title">今天访问来源</div>
            <div class="item-amount" ref="countupdayViews" id="countupdayViews">
              {{ state.referrerTableData }}
            </div>
            <div class="item-compare">
              <span>较昨日
                <el-icon v-show="state.dayViewsMom > 0" :size="16" color="#F56C6C">
                  <!-- <CaretTop></CaretTop> -->
                </el-icon>
                <el-icon v-show="state.dayViewsMom < 0" :size="16" color="#F56C6C">
                  <!-- <CaretBottom></CaretBottom> -->
                </el-icon>
              </span>
              <span class="num"> {{ Math.abs(0) }} </span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover">
            <div class="item-title">今天访问地址</div>
            <div class="item-amount" ref="countupdayIp" id="countupdayIp">
              {{ state.postViewTableData }}
            </div>
            <div class="item-compare">
              <span>较昨日

                <el-icon v-show="state.dayIpMom > 0" :size="16" color="#F56C6C">
                  <!-- <CaretTop></CaretTop> -->
                </el-icon>
                <el-icon v-show="state.dayIpMom < 0" :size="16" color="#F56C6C">
                  <!-- <CaretBottom></CaretBottom> -->
                </el-icon>
              </span>
              <span class="num"> {{ Math.abs(0) }} </span>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <div class="dayViews">
        <div id="dayViews" style="width: 100%; height: 300px"></div>
      </div>
      <div class="date-picker-change">
        <h3></h3>
        <div>
          <el-radio-group v-model="state.tabPosition" style="margin-bottom: 30px" @change="tabChange">
            <el-radio-button label="toDay">今天</el-radio-button>
            <el-radio-button label="yesterday">最近两天</el-radio-button>
            <el-radio-button label="7day">最近7天</el-radio-button>
            <el-radio-button label="30day">最近30天</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div class="type-data">
        <el-row>
          <el-col :span="24">
            <div>
              <div id="deviceType" style="max-width: 100%; height: 300px"></div>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <div>
              <div id="browserType" style="max-width: 100%; height: 300px"></div>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <div>
              <div id="deiveRatio" style="max-width: 100%; height: 300px"></div>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div>
              <div id="chindMap" style="max-width: 100%; height: 300px"></div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getWebStatisticsApi } from "@/views/API/stats.js";
import { CountUp } from "countup.js";

// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from "echarts";
import "echarts-countries-js/echarts-countries-js/china";

import { reactive, computed, onMounted, nextTick } from "vue";
import { CaretTop, CaretBottom } from "@element-plus/icons-vue";
import { delHtmlTag } from "@/utils/common.js";
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
const initCountUp = () => {
  const cp = new CountUp("countupviews", state.views, state.options);
  if (!cp.error) {
    cp.start();
  } else {
    console.error(cp.error);
  }
  const cp2 = new CountUp("countuppages", state.pages, state.options);
  if (!cp2.error) {
    cp2.start();
  } else {
    console.error(cp2.error);
  }
  const cp3 = new CountUp("countupdayViews", state.dayViews, state.options);
  if (!cp3.error) {
    cp3.start();
  } else {
    console.error(cp3.error);
  }
  const cp4 = new CountUp("countupdayIp", state.dayIp, state.options);
  if (!cp4.error) {
    cp4.start();
  } else {
    console.error(cp4.error);
  }
};

const initDeviceType = () => {
  const dom = document.getElementById("deviceType");
  if (!dom) {
    return false;
  }
  dom.removeAttribute("_echarts_instance_");
  const myChart = echarts.init(dom);
  myChart.setOption({
    title: {
      text: "设备型号",
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {d}%",
    },
    series: [
      {
        name: "设备型号",
        type: "pie",
        data: state.deviceTypeY,
        radius: ["40%", "60%"],
      },
    ],
  });
  myChart.resize();
};

const initBrowserType = () => {
  const dom = document.getElementById("browserType");
  if (!dom) {
    return false;
  }
  dom.removeAttribute("_echarts_instance_");
  const myChart = echarts.init(dom);
  myChart.setOption({
    title: {
      text: "浏览器型号",
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {d}%",
    },
    series: [
      {
        name: "浏览器型号",
        type: "pie",
        data: state.browserTypeY,
        radius: ["40%", "60%"],
      },
    ],
  });
  myChart.resize();
};
const initDeiveRatio = () => {
  const dom = document.getElementById("deiveRatio");
  if (!dom) {
    return false;
  }
  dom.removeAttribute("_echarts_instance_");
  const myChart = echarts.init(dom);
  myChart.setOption({
    title: {
      text: "设备分辨率",
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {d}%",
    },
    series: [
      {
        name: "设备分辨率",
        type: "pie",
        data: state.deviceRatioY,
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
    },
    tooltip: {
      trigger: "axis",
      // show: true,
      // backgroundColor: "rgba(0,0,0,0.75)",
      // borderColor: "rgba(0,0,0,0.75)",
      // textStyle: {
      //   color: "#ffffff",
      // },
      axisPointer: {
        type: "shadow",
        shadowStyle: {
          color: "rgba(0,0,0,0.08)",
        },
      },
    },
    legend: {},
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
      },
      {
        name: "今日浏览量(PV)",
        type: "line",
        stack: "Total",
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
        nameMap: {
          广东: "广东省",
          北京: "北京",
          台湾: "台湾省",
          陕西: "陕西省",
          浙江: "浙江省",
          湖北: "湖北省",
          香港: "香港",
          福建: "福建省",
          江西: "江西省",
          湖南: "湖南省",
          江苏: "江苏省",
          安徽: "安徽省",
          河南: "河南省",
          四川: "四川省",
          山西: "山西省",
          吉林: "吉林省",
          贵州: "贵州省",
          云南: "云南省",
          海南: "海南省",
          山东: "山东省",
          天津: "天津",
          辽宁: "辽宁省",
          黑龙江: "黑龙江省",
          甘肃: "甘肃省",
        },
      },
    ],
  });
};
const getWebStatistics = async (type: string) => {
  const res: any = await getWebStatisticsApi({ type: type });
  if (res) {
    if (!(userInfo.value.role && userInfo.value.role.includes("ROLE_admin"))) {
      res.data.allViews = 0;
      res.data.allpages = 0;
      res.data.allViewsMom = 0;
    }
    state.views = res.data.allViews;
    state.pages = res.data.allpages;
    state.mapData = res.data.mapData;
    state.dayViews = res.data.dayViews;
    state.dayIp = res.data.dayIp;
    state.allViewsMom = parseFloat(res.data.allViewsMom);
    state.allpagesMom = parseFloat(res.data.allpagesMom);
    state.dayViewsMom = parseFloat(res.data.dayViewsMom);
    state.dayIpMom = parseFloat(res.data.dayIpMom);
    state.deviceRatioY = res.data.deviceRatio.map((item: any) => {
      return { name: item.screen, value: item.num };
    });
    state.deviceTypeY = res.data.deviceType.map((item: any) => {
      return { name: item.os, value: item.num };
    });
    state.browserTypeY = res.data.browserType.map((item: any) => {
      return { name: item.browse, value: item.num };
    });
    state.everyDayViews = res.data.everyDayViews;
    initCharts();
    initCountUp();
    state.referrerTableData = res.data.referrer;
    state.postViewTableData = res.data.postView;
    state.totalWordsNum = res.data.totalWordsNum || 0;
  }
};
const initCharts = () => {
  nextTick(() => {
    initDeviceType();
    initBrowserType();
    initDeiveRatio();
    initDayViews();
    initChindMap();
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
    padding: 20px 0;
    display: flex;
    justify-content: space-between;
  }

  .card-item {
    .item-title {
      text-align: center;
      font-size: 16px;
      padding: 5px;
    }

    .item-amount {
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      padding: 5px;
    }

    .item-compare {
      text-align: center;
      font-size: 14px;

      .num {
        color: #f85149;
      }
    }

    .type-data {
      padding: 20px 0;
    }
  }

  .dayViews {
    padding: 20px;
  }

  .table-title {
    width: 100%;
    border-bottom: 1px solid #f5f5f5;
    padding: 5px 0;
  }
}
</style>
