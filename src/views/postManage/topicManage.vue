<template>
  <div class="comments-list">
    <div class="handler">
      <el-button @click="goBack">返回</el-button>
    </div>
    <el-table :data="state.list" style="width: 100%">
      <!-- <el-table-column type="index" label="序号" width="60px"> </el-table-column> -->
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
          <el-button @click="edit(scope.row.postId)" type="primary">编辑</el-button>
          <el-button @click="delConfirm(scope.row.id)" type="danger" class="cus-button-danger">删除</el-button>
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
import { useRoute,useRouter } from "vue-router";
import { ElMessageBox, ElMessage } from "element-plus";

const route = useRoute();
const router = useRouter();
const state = reactive({
  list: [],
});
onMounted(() => {
  getList();
});
const getList = async () => {
  const id = route.query.id as any;
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
const goBack = () => {
  history.go(-1)
}
const edit = (id: any)=> {
  router.push({path: "/article/post",query:{id: id}})
}
</script>

<style scoped lang="scss">
.comments-list {
  .handler {
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }
}
</style>
