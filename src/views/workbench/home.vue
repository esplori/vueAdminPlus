<template>
  <div class="home">
    <div class="card-item">
      <div class="date-picker-change">
        <h3>统计数据</h3>
      </div>
      <el-row :gutter="12" style="width: 100%">
        <el-col :span="6">
          <el-card shadow="always">
            <div class="item-title">总访问量</div>
            <div class="item-amount" ref="countupviews">
              {{ state.views }}
            </div>
            <div class="item-compare">
              <span>今日新增</span>
              <span class="num"> {{ Math.abs(state.allViewsMom) }} </span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6" v-if="userInfo.role.includes('ROLE_admin')">
          <el-card shadow="always">
            <div class="item-title">文章总数</div>
            <div class="item-amount" ref="countuppages">
              {{ state.pages }}
            </div>
            <div class="item-compare">
              <span
                >较昨日
                
                <el-icon  v-show="state.allpagesMom > 0" :size="16" color="#F56C6C">
                  <CaretTop ></CaretTop>
                </el-icon>
                <el-icon  v-show="state.allpagesMom < 0" :size="16" color="#91cc74">
                  <CaretBottom ></CaretBottom>
                </el-icon>
                
               </span>
              <span class="num"> {{ Math.abs(state.allpagesMom) }} </span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="always">
            <div class="item-title">今日浏览量(PV)</div>
            <div class="item-amount" ref="countupdayViews">
              {{ state.dayViews }}
            </div>
            <div class="item-compare">
              <span
                >较昨日
                
                  <el-icon  v-show="state.dayViewsMom > 0" :size="16" color="#F56C6C">
                  <CaretTop ></CaretTop>
                </el-icon>
                <el-icon  v-show="state.dayViewsMom < 0" :size="16" color="#F56C6C">
                  <CaretBottom ></CaretBottom>
                </el-icon>
                
                
                </span>
              <span class="num"> {{ parseFloat(Math.abs(state.dayViewsMom)) }} </span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="always">
            <div class="item-title">今日访问IP数(UV)</div>
            <div class="item-amount" ref="countupdayIp">
              {{ state.dayIp }}
            </div>
            <div class="item-compare">
              <span
                >较昨日
                
                <el-icon  v-show="state.dayIpMom > 0" :size="16" color="#F56C6C">
                  <CaretTop ></CaretTop>
                </el-icon>
                <el-icon  v-show="state.dayIpMom < 0" :size="16" color="#F56C6C">
                  <CaretBottom ></CaretBottom>
                </el-icon>
                
                
                </span>
              <span class="num"> {{ parseFloat(Math.abs(state.dayIpMom)) }} </span>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <div class="dayViews">
        <div id="dayViews" style="width: 100%; height: 300px"></div>
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
              <div
                id="browserType"
                style="max-width: 100%; height: 300px"
              ></div>
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
      </div>
    </div>

    <div v-if="userInfo.role.includes('ROLE_admin')">
      <h2 style="padding: 20px 0">总字数：{{ state.totalWordsNum }}</h2>
      <div>
        <h2>当天访问来源</h2>
      </div>
      <el-table :data="state.referrerTableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="50">
        </el-table-column>
        <el-table-column prop="referrer" label="地址"> </el-table-column>
        <el-table-column prop="createDate" label="时间"> </el-table-column>
      </el-table>
      <div class="date-picker-change">
        <h3>当天访问地址</h3>
      </div>
      <el-table :data="state.postViewTableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="50">
        </el-table-column>
        <el-table-column prop="title" label="标题"> </el-table-column>
        <el-table-column prop="href" label="地址"> </el-table-column>
        <el-table-column prop="createDate" label="时间"> </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getWebStatisticsApi } from "@/views/API/stats.js";
import { CountUp } from "countup.js";
import * as echarts from "echarts";
import { reactive, computed, onMounted, ref, nextTick } from "vue";
import { CaretTop,CaretBottom } from "@element-plus/icons-vue";
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
  allViewsMom: "",
  allpagesMom: "",
  dayViewsMom: "",
  dayIpMom: "",
  list: [],
  referrerTableData: [],
  postViewTableData: [],
  totalWordsNum: 0,
});
const userInfo = computed(() => {
  const usrinfo = localStorage.getItem("userInfo");
  if (usrinfo) {
    return JSON.parse(usrinfo);
  } else {
    return false;
  }
});
onMounted(() => {
  getWebStatistics();
  window.addEventListener("resize", () => {
    initCharts();
  });
});
const initCountUp = () => {
  let countupviews = ref();
  const cp = new CountUp(countupviews, state.views, state.options);
  if (!cp.error) {
    cp.start();
  } else {
    console.error(cp.error);
  }
  let countuppages = ref();
  const cp2 = new CountUp(countuppages, state.pages, state.options);
  if (!cp2.error) {
    cp2.start();
  } else {
    console.error(cp2.error);
  }
  let countupdayViews = ref();
  const cp3 = new CountUp(countupdayViews, state.dayViews, state.options);
  if (!cp3.error) {
    cp3.start();
  } else {
    console.error(cp3.error);
  }
  let countupdayIp = ref();
  const cp4 = new CountUp(countupdayIp, state.dayIp, state.options);
  if (!cp4.error) {
    cp4.start();
  } else {
    console.error(cp4.error);
  }
};

const initDeviceType = () => {
  const myChart = echarts.init(document.getElementById("deviceType"));
  myChart.setOption({
    title: {
      text: "设备型号",
    },
    tooltip: {},
    series: [
      {
        name: "设备型号",
        type: "pie",
        data: state.deviceTypeY,
      },
    ],
  });
  myChart.resize();
};

const initBrowserType = () => {
  const myChart = echarts.init(document.getElementById("browserType"));
  myChart.setOption({
    title: {
      text: "浏览器型号",
    },
    tooltip: {},
    series: [
      {
        name: "浏览器型号",
        type: "pie",
        data: state.browserTypeY,
      },
    ],
  });
  myChart.resize();
};
const initDeiveRatio = () => {
  const myChart = echarts.init(document.getElementById("deiveRatio"));
  myChart.setOption({
    title: {
      text: "设备分辨率",
    },
    tooltip: {},
    series: [
      {
        name: "设备分辨率",
        type: "pie",
        data: state.deviceRatioY,
      },
    ],
  });
  myChart.resize();
};
const initDayViews = () => {
  const myChart = echarts.init(document.getElementById("dayViews"));
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
      data: state.everyDayViews.map((item) => {
        return item.createDate;
      }),
      axisLabel: {
        interval: 1,
        rotate: 45, // 倾斜度 -90 至 90 默认为0
        margin: 8,
        formatter: function (value) {
          const str = value.slice(0, 10);
          return str;
        },
      },
    },
    yAxis: {},
    series: [
      {
        name: "今日访问IP数(UV)",
        type: "bar",
        data: state.everyDayViews.map((item) => {
          return item.dayIp;
        }),
        itemStyle: {
          color: "#6496f9",
          normal: {
            label: {
              show: false,
              position: "top",
            },
          },
        },
      },
      {
        name: "今日浏览量(PV)",
        type: "bar",
        data: state.everyDayViews.map((item) => {
          return item.dayViews;
        }),

        itemStyle: {
          color: "#7667f9",
          normal: {
            label: {
              show: false,
              position: "top",
            },
          },
        },
      },
    ],
  });
  myChart.resize();
};
const getWebStatistics = async () => {
  const res = await getWebStatisticsApi({});
  if (res) {
    state.views = res.data.allViews;
    state.pages = res.data.allpages;
    state.dayViews = res.data.dayViews;
    state.dayIp = res.data.dayIp;
    state.allViewsMom = parseFloat(res.data.allViewsMom);
    state.allpagesMom = parseFloat(res.data.allpagesMom);
    state.dayViewsMom = parseFloat(res.data.dayViewsMom);
    state.dayIpMom = parseFloat(res.data.dayIpMom);
    state.deviceRatioY = res.data.deviceRatio.map((item) => {
      return { name: item.screen, value: item.num };
    });
    state.deviceTypeY = res.data.deviceType.map((item) => {
      return { name: item.os, value: item.num };
    });
    state.browserTypeY = res.data.browserType.map((item) => {
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
  });
};
</script>

<style scoped lang="scss">
.home {
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
}
</style>
