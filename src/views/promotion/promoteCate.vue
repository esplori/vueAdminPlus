<template>
  <div class="page-list">
    <searchHeader :title="'分类管理'">
      <el-button type="primary" @click="insertCate">新增分类</el-button>
    </searchHeader>
    <el-table :data="state.list" style="width: 100%">
      <el-table-column label="分类">
        <template #default="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template #default="scope">
          {{ scope.row.createDate }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button @click="edit(scope.row)" type="primary">编辑</el-button>
          <el-button @click="delConfirm(scope.row.id)" type="danger"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="state.title"
      v-model="state.dialogVisible"
      width="30%"
      @close="handleClose"
    >
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
  delCateApi,
  getCateApi,
  updateCateApi,
  insertCateApi,
} from "@/views/API/promotion.js";

import { reactive, onMounted } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import searchHeader from "../components/searchHeader.vue";

const state = reactive({
  list: [],
  dialogVisible: false,
  title: "新增",
  row: {
    id: "",
    name: "",
  },
  params: {
    page: 1,
    pageSize: 20,
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
  const res: any = await getCateApi(state.params);
  if (res) {
    state.list = res.data;
  }
};
const delConfirm = (id: any) => {
  ElMessageBox.confirm("此操作将删除该条数据, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    del(id);
  });
};
const del = async (id: any) => {
  const res = await delCateApi({ id: id });
  if (res) {
    ElMessage.success("删除成功");
    getList();
  }
};
const edit = (row: any) => {
  state.title = "编辑";
  state.dialogVisible = true;
  state.row = row;
};
const submit = async (row: any) => {
  if (!row.name) {
    ElMessage.warning("请输入名称");
    return;
  }
  if (row.id) {
    const res = await updateCateApi(row);
    if (res) {
      getList();
    }
  } else {
    const res = await insertCateApi(row);
    if (res) {
      getList();
    }
  }
  state.dialogVisible = false;
};
const handleClose = () => {
  state.row = {
    id: "",
    name: "",
  };
};
</script>