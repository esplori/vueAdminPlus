<template>
  <div class="comments-list">
    <searchHeader :title="'评论管理'"></searchHeader>
    <el-table :data="state.list" style="width: 100%">
      <el-table-column label="用户">
        <template #default="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="文章">
        <template #default="scope">
          <a :href="'http://www.dsiab.com/post/' + scope.row.postId" target="_blank">{{ scope.row.postId }}</a>
        </template>
      </el-table-column>
      <el-table-column label="内容" show-overflow-tooltip>
        <template #default="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>
      <el-table-column label="邮箱" show-overflow-tooltip>
        <template #default="scope">
          {{ scope.row.mail }}
        </template>
      </el-table-column>
      <el-table-column label="审核状态" show-overflow-tooltip>
        <template #default="scope">
          {{ scope.row.approved =='Y'?'是':"否" }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template #default="scope">
          {{ scope.row.createDate }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button link @click="delConfirm(scope.row.id)" type="text">删除</el-button>
          <el-button link @click="approveComment(scope.row.id)" type="text">通过</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { getCommentApi, delCommentApi, approveCommentApi } from "@/views/API/admin.js";
import { reactive, onMounted } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import searchHeader from "../components/searchHeader.vue";
const state = reactive({
  list: [],
});
onMounted(() => {
  getList();
});
const getList = async () => {
  const res: any = await getCommentApi({});
  if (res) {
    state.list = res.data;
  }
};
const delConfirm = async (id: any) => {
  ElMessageBox.confirm("此操作将删除该条数据, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    del(id);
  });
};

const del = async (id: any) => {
  const res = await delCommentApi({ id: id });
  if (res) {
    ElMessage.success("删除成功");
    getList();
  }
};
const approveComment = async (id: any) =>{
  const res = await approveCommentApi({ id: id });
  if (res) {
    getList();
  }
}
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
