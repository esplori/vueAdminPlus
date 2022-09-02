<template>
  <div class="home">
    <!-- <div class="card-item">
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
    </div> -->
  </div>
</template>

<script setup lang="ts">
</script>
