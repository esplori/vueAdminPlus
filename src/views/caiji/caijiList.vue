<template>
  <div class="page-list">
    <div class="handle">
      <!-- <el-button type="primary" @click="multipleDel">批量删除</el-button> -->
    </div>
    <el-table :data="list" style="width: 100%">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column label="商品名称">
        <template #default="scope">
          <a :href="scope.row.url">{{ scope.row.title }}</a>
        </template>
      </el-table-column>
      <el-table-column label="图片">
        <template #default="scope">
          <img :src="scope.row.pict_url" alt="" width="120px" height="120px" />
        </template>
      </el-table-column>
      <el-table-column prop="volume" label="月销量"> </el-table-column>
      <el-table-column prop="cate" label="分类"> </el-table-column>
      <el-table-column prop="reserve_price" label="原价"> </el-table-column>
      <el-table-column prop="zk_final_price" label="折扣价"> </el-table-column>
      <el-table-column prop="createDate" label="更新时间"> </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="del(scope.row.pid)" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box" style="text-align: center; margin-top: 20px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.page"
        :page-size="params.pageSize"
        layout="total, prev, pager, next"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import { delTbkApi, getTbkListApi } from "@/views/API/tbk.js";

export default {
  data() {
    return {
      list: [],
      params: {
        page: 1,
        pageSize: 20,
      },
      total: 0,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      const res = await getTbkListApi(this.params);
      if (res) {
        this.list = res.data.result;
        this.total = res.data.total;
      }
    },
    async del(id) {
      const res = await delTbkApi({ pid: id });
      if (res) {
        this.$message.success("删除成功");
        this.getList();
      }
    },
    handleSizeChange(val) {
      this.params.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.params.page = val;
      this.getList();
    },
    multipleDel(condition) {},
  },
};
</script>

<style scoped lang="scss">
.page-list {
  width: 100%;
  .content-item {
    font-size: 18px;
    text-align: left;
    padding: 5px;
  }
}
</style>
