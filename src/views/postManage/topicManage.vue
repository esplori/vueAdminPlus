<template>
  <div class="comments-list">
    <el-button @click="goBack">返回</el-button>
    <el-table :data="state.list" style="width: 100%">
      <el-table-column type="index" label="序号"> </el-table-column>
      <el-table-column label="标题">
        <template #default="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="id">
        <template #default="scope">
          {{ scope.row.postId }}
        </template>
      </el-table-column>
      <el-table-column label="时间">
        <template #default="scope">
          {{ scope.row.createDate }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button
            @click="delConfirm(scope.row.id)"
            type="danger"
            class="cus-button-danger"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import {
  deleteTopicDetailApi,
  getTopicDetailListApi,
} from "@/views/API/admin.js";
import { reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import { ElMessageBox, ElMessage } from "element-plus";

const route = useRoute();
const state = reactive({
  list: [],
});
onMounted(() => {
  getList();
});
const getList = async () => {
  const id = route.query.id  as any;
  const res: any = await getTopicDetailListApi({ topicId: parseInt(id) });
  if (res) {
    state.list = res.data.result;
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
  const res = await deleteTopicDetailApi({ id: id });
  if (res) {
    ElMessage.success("删除成功");
    getList();
  }
};
const goBack = ()=>{
  history.go(-1)
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
