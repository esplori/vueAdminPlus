<template>
  <div class="page-list">
    <searchHeader :title="'推广采集'"></searchHeader>
    <div class="handle">
      <el-form :model="state.params" label-width="80px">
        <el-form-item label="采集页码:">
          <el-input v-model.number="state.params.pageNo"></el-input>
        </el-form-item>
        <el-form-item label="采集条数:">
          <el-input v-model.number="state.params.pageSize"></el-input>
        </el-form-item>
        <el-form-item label="分类:">
          <el-select
            v-model="state.params.cate"
            placeholder="请选择"
            @change="optionChange"
          >
            <el-option
              v-for="(item, index) in state.options"
              :key="index"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList">开始采集</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="state.list" style="width: 100%">
      <el-table-column label="商品名称">
        <template #default="scope">
          <a :href="scope.row.url">{{ scope.row.title }}</a>
        </template>
      </el-table-column>
      <el-table-column label="图片">
        <template #default="scope">
          <img :src="scope.row.pict_url" alt="" width="80" height="80" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { getCateApi, getTbkShopListApi } from "@/views/API/promotion.js";
import { reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import searchHeader from "../components/searchHeader.vue";
const state = reactive({
  list: [],
  params: {
    pageNo: 1,
    pageSize: 20,
    keyWords: "",
    cate: "",
  },
  options: [{ id: "", name: "" }],
});
onMounted(() => {
  getCate();
});
const optionChange = (val: any) => {
  const filterArr = state.options.filter((item: any) => {
    return item.id === val;
  });
  if (filterArr.length) {
    const arr0 = filterArr[0] as any;
    state.params.keyWords = arr0.name;
  }
};
const getCate = async () => {
  const res: any = await getCateApi({});
  if (res) {
    state.options = res.data;
  }
};

const getList = async () => {
  if (!state.params.cate) {
    ElMessage.warning("请选择分类");
    return;
  }
  const res: any = await getTbkShopListApi(state.params);
  if (res) {
    state.list = res.data.result;
  }
};
</script>
