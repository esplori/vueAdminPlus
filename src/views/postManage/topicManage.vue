<template>
  <div>
    <searchHeader :title="state.topicName">
      <el-button type="primary" @click="goBack">返回</el-button>
    </searchHeader>
    <el-table :data="state.list" style="width: 100%">
      <el-table-column label="标题" show-overflow-tooltip>
        <template #default="scope">
          <span class="topic-item" @click="goToPage(scope.row.postId)">{{
            scope.row.name
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template #default="scope">
          {{ scope.row.createDate }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button @click="edit(scope.row.postId)" type="primary"
            >编辑</el-button
          >
          <el-button @click="delConfirm(scope.row.id)" type="danger"
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
import { useRoute, useRouter } from "vue-router";
import { ElMessageBox, ElMessage } from "element-plus";
import searchHeader from "../components/searchHeader.vue";

const route = useRoute();
const router = useRouter();
const state = reactive({
  list: [],
  topicName: "",
});

state.topicName = route.query.topicName as any;

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
  history.go(-1);
};
const edit = (id: any) => {
  const rt = router.resolve({ path: "/post", query: { id: id } });
  window.open(rt.href, "_blank");
};

const goToPage = (postId: string) => {
  window.open("http://www.dsiab.com/post/" + postId);
};
</script>
<style scoped lang="scss">
.topic-item{
  cursor: pointer;
  &:hover{
    text-decoration:underline;
  }
}
</style>
