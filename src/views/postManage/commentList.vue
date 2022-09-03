<template>
  <div class="comments-list">
    <el-table :data="list" style="width: 100%">
      <el-table-column label="用户">
        <template #default="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="文章id">
        <template #default="scope">
          <a
            :href="'http://www.dsiab.com/post/' + scope.row.postId"
            target="_blank"
            >{{ scope.row.postId }}</a
          >
        </template>
      </el-table-column>
      <el-table-column label="内容" show-overflow-tooltip>
        <template #default="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template #default="scope">
          {{ scope.row.createDate }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button
            @click="delConfirm(scope.row.id)"
            type="text"
            class="cus-button-danger"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getCommentApi, delCommentApi } from "@/views/API/admin.js";

export default {
  data() {
    return {
      list: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      let res = await getCommentApi();
      if (res) {
        this.list = res.data.result;
      }
    },
    delConfirm(id) {
      this.$confirm("此操作将删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.del(id);
      });
    },
    async del(id) {
      let res = await delCommentApi({ id: id });
      if (res) {
        this.$message.success("删除成功");
        this.getList();
      }
    },
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
