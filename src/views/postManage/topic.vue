<template>
  <div>
    <searchHeader :title="'专题管理'">
      <el-button type="primary" @click="insertCate">新增专题</el-button>
    </searchHeader>
    <el-table :data="state.list" style="width: 100%">
      <el-table-column label="分类名称">
        <template #default="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template #default="scope">
          {{ scope.row.createDate }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template #default="scope">
          <el-button link @click="edit(scope.row)" type="primary"
            >编辑</el-button
          >
          <el-button link @click="manage(scope.row)" type="primary"
            >管理</el-button
          >
          <el-button
            link
            @click="delConfirm(scope.row.id)"
            type="danger"
            v-if="scope.row.valid === '1'"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="state.title" v-model="state.dialogVisible" width="30%">
      <div>
        <el-input v-model="state.row.name" placeholder="请输入名称"></el-input>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="state.dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit(state.row)">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {
  deleteTopicApi,
  getTopicListApi,
  updateTopicApi,
  insertTopicApi,
} from "@/views/API/admin.js";
import { reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import searchHeader from "../components/searchHeader.vue";
const router = useRouter();
const state = reactive({
  list: [],
  dialogVisible: false,
  title: "新增",
  row: {
    id: "",
    name: "",
  },
});
onMounted(() => {
  getList();
});
const insertCate = () => {
  state.dialogVisible = true;
  state.title = "新增";
};
const getList = async () => {
  const res: any = await getTopicListApi({});
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
  const res = await deleteTopicApi({ id: id });
  if (res) {
    ElMessage.success("删除成功");
    getList();
  }
};

const edit = async (row: any) => {
  state.title = "编辑";
  state.dialogVisible = true;
  state.row = row;
};

const manage = async (row: any) => {
  router.push({
    path: "topicManage",
    query: { id: row.id, topicName: row.name },
  });
};

const submit = async (row: any) => {
  if (row.id) {
    const res = await updateTopicApi(row);
    if (res) {
      getList();
    }
  } else {
    const res = await insertTopicApi(row);
    if (res) {
      getList();
    }
  }
  state.dialogVisible = false;
};
</script>
