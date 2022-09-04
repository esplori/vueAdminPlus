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
              {{ views }}
            </div>
            <div class="item-compare">
              <span>今日新增</span>
              <span class="num"> {{ Math.abs(allViewsMom) }} </span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="always">
            <div class="item-title">文章总数</div>
            <div class="item-amount" ref="countuppages">
              {{ pages }}
            </div>
            <div class="item-compare">
              <span
                >较昨日<i
                  class="el-icon-top-right"
                  style="color: red"
                  v-show="allpagesMom > 0"
                ></i
                ><i
                  class="el-icon-bottom-right"
                  style="color: green"
                  v-show="allpagesMom < 0"
                ></i
              ></span>
              <span class="num"> {{ Math.abs(allpagesMom) }} </span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="always">
            <div class="item-title">今日浏览量(PV)</div>
            <div class="item-amount" ref="countupdayViews">
              {{ dayViews }}
            </div>
            <div class="item-compare">
              <span
                >较昨日<i
                  class="el-icon-top-right"
                  style="color: red"
                  v-show="dayViewsMom > 0"
                ></i
                ><i
                  class="el-icon-bottom-right"
                  style="color: green"
                  v-show="dayViewsMom < 0"
                ></i
              ></span>
              <span class="num"> {{ parseFloat(Math.abs(dayViewsMom)) }} </span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="always">
            <div class="item-title">今日访问IP数(UV)</div>
            <div class="item-amount" ref="countupdayIp">
              {{ dayIp }}
            </div>
            <div class="item-compare">
              <span
                >较昨日<i
                  class="el-icon-top-right"
                  style="color: red"
                  v-show="dayIpMom > 0"
                ></i
                ><i
                  class="el-icon-bottom-right"
                  style="color: green"
                  v-show="dayIpMom < 0"
                ></i
              ></span>
              <span class="num"> {{ parseFloat(Math.abs(dayIpMom)) }} </span>
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
      <h2 style="padding: 20px 0">总字数：{{ totalWordsNum }}</h2>
      <div>
        <h2>当天访问来源</h2>
      </div>
      <el-table :data="referrerTableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="50">
        </el-table-column>
        <el-table-column prop="referrer" label="地址"> </el-table-column>
        <el-table-column prop="createDate" label="时间"> </el-table-column>
      </el-table>
      <div class="date-picker-change">
        <h3>当天访问地址</h3>
      </div>
      <el-table :data="postViewTableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="50">
        </el-table-column>
        <el-table-column prop="title" label="标题"> </el-table-column>
        <el-table-column prop="href" label="地址"> </el-table-column>
        <el-table-column prop="createDate" label="时间"> </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts">
import { getWebStatisticsApi } from "@/views/API/stats.js";
import { CountUp } from "countup.js";
import * as echarts from "echarts";
export default {
  data() {
    return {
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
    };
  },
  computed: {
    userInfo() {
      const userinfo = localStorage.getItem("userInfo");
      if (userinfo) {
        return JSON.parse(userinfo);
      } else {
        return false;
      }
    },
  },
  created() {
    this.getWebStatistics();
  },
  mounted() {
    window.addEventListener("resize", () => {
      this.initCharts();
    });
  },
  methods: {
    /**
     * 计数器动效
     */
    initCountUp() {
      const cp = new CountUp(this.$refs.countupviews, this.views, this.options);
      if (!cp.error) {
        cp.start();
      } else {
        console.error(cp.error);
      }

      const cp2 = new CountUp(
        this.$refs.countuppages,
        this.pages,
        this.options
      );
      if (!cp2.error) {
        cp2.start();
      } else {
        console.error(cp2.error);
      }

      const cp3 = new CountUp(
        this.$refs.countupdayViews,
        this.dayViews,
        this.options
      );
      if (!cp3.error) {
        cp3.start();
      } else {
        console.error(cp3.error);
      }

      const cp4 = new CountUp(
        this.$refs.countupdayIp,
        this.dayIp,
        this.options
      );
      if (!cp4.error) {
        cp4.start();
      } else {
        console.error(cp4.error);
      }
    },
    /**
     * 设备类型
     */
    initDeviceType() {
      const _this = this;
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
            data: _this.deviceTypeY,
          },
        ],
      });
      myChart.resize();
    },
    /**
     * 浏览器类型
     */
    initBrowserType() {
      const _this = this;
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
            data: _this.browserTypeY,
          },
        ],
      });
      myChart.resize();
    },
    /**
     * 设备分辨率
     */
    initDeiveRatio() {
      const _this = this;
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
            data: _this.deviceRatioY,
          },
        ],
      });
      myChart.resize();
    },
    /**
     * 最近30天访问量
     */
    initDayViews() {
      const _this = this;
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
          data: _this.everyDayViews.map((item) => {
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
            data: _this.everyDayViews.map((item) => {
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
            data: _this.everyDayViews.map((item) => {
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
    },
    /**
     * 获取统计数据
     */
    async getWebStatistics() {
      const res = await getWebStatisticsApi({});
      if (res) {
        this.views = res.data.allViews;
        this.pages = res.data.allpages;
        this.dayViews = res.data.dayViews;
        this.dayIp = res.data.dayIp;
        this.allViewsMom = parseFloat(res.data.allViewsMom);
        this.allpagesMom = parseFloat(res.data.allpagesMom);
        this.dayViewsMom = parseFloat(res.data.dayViewsMom);
        this.dayIpMom = parseFloat(res.data.dayIpMom);
        this.deviceRatioY = res.data.deviceRatio.map((item) => {
          return { name: item.screen, value: item.num };
        });
        this.deviceTypeY = res.data.deviceType.map((item) => {
          return { name: item.os, value: item.num };
        });
        this.browserTypeY = res.data.browserType.map((item) => {
          return { name: item.browse, value: item.num };
        });
        this.everyDayViews = res.data.everyDayViews;
        this.initCharts();
        this.initCountUp();
        this.referrerTableData = res.data.referrer;
        this.postViewTableData = res.data.postView;
        this.totalWordsNum = res.data.totalWordsNum || 0;
      }
    },
    initCharts() {
      this.$nextTick(() => {
        this.initDeviceType();
        this.initBrowserType();
        this.initDeiveRatio();
        this.initDayViews();
      });
    },
  },
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
