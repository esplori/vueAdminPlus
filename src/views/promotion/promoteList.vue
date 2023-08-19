<template>
  <div class="page-list">
    <searchHeader :title="'采集列表'"></searchHeader>
    <el-table :data="state.list" style="width: 100%">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column label="商品名称" show-overflow-tooltip>
        <template #default="scope">
          <a :href="scope.row.url">{{ scope.row.title }}</a>
        </template>
      </el-table-column>
      <el-table-column label="图片">
        <template #default="scope">
          <img :src="scope.row.pict_url" alt="" width="80" height="80" />
        </template>
      </el-table-column>
      <el-table-column prop="volume" label="月销量"> </el-table-column>
      <el-table-column prop="cate" label="分类"> </el-table-column>
      <el-table-column prop="reserve_price" label="原价"> </el-table-column>
      <el-table-column prop="zk_final_price" label="折扣价"> </el-table-column>
      <el-table-column prop="createDate" label="更新时间"> </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button link @click="del(scope.row.pid)" type="danger"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box" style="text-align: center; margin-top: 20px">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="state.params.page"
        :page-size="state.params.pageSize"
        layout="total, prev, pager, next"
        :total="state.total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { delTbkApi, getTbkListApi } from "@/views/API/promotion.js";
import { reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import searchHeader from "../components/searchHeader.vue";
const state = reactive({
  list: [],
  params: {
    page: 1,
    pageSize: 20,
  },
  total: 0,
});
onMounted(() => {
  getList();
});
const getList = async () => {
  const res: any = await getTbkListApi(state.params);
  if (res) {
    state.list = res.data.result;
    state.total = res.data.total;
  }
};
const del = async (id: any) => {
  const res = await delTbkApi({ pid: id });
  if (res) {
    ElMessage.success("删除成功");
    getList();
  }
};
const handleSizeChange = async (val: any) => {
  state.params.pageSize = val;
  getList();
};
const handleCurrentChange = async (val: any) => {
  state.params.page = val;
  getList();
};
</script>