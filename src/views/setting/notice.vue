<template>
  <div class="notice">
    <searchHeader :title="'系统通知'"></searchHeader>
    <el-table :data="state.list">
      <el-table-column label="通知类型" prop="title" width="100px">
      </el-table-column>
      <el-table-column label="通知内容">
        <template #default="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>
      <el-table-column label="通知时间" width="200px">
        <template #default="scope">
          {{ scope.row.createDate }}
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
        :page-sizes="[10, 20, 30, 50]"
        :pager-count="5"
        layout="total, prev, pager, next"
        :total="state.total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getNoticeApi } from "@/views/API/system.js";
import { reactive, onMounted } from "vue";
import searchHeader from "../components/searchHeader.vue";
const state = reactive({
  list: [],
  params: {
    page: 1,
    pageSize: 10,
  },
  total: 0,
  cateList: [],
  multipleSelection: [],
});
onMounted(() => {
  getList();
});

const getList = () => {
  getNotice();
};

const getNotice = async () => {
  const res: any = await getNoticeApi(state.params);
  if (res) {
    state.list = res.data.result;
    state.total = res.data.total;
  }
};

const handleSizeChange = (val: any) => {
  state.params.pageSize = val;
  getList();
};

const handleCurrentChange = (val: any) => {
  state.params.page = val;
  getList();
};
</script>
