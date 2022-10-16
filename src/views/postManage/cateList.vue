<template>
  <div class="page-list">
    <el-button type="primary" @click="insertCate">新增分类</el-button>
    <el-table :data="state.list" style="width: 100%">
      <el-table-column type="index" label="序号" width="55px"></el-table-column>
      <el-table-column label="标题">
        <template #default="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createDate"> </el-table-column>
      <el-table-column label="创建人" prop="createdBy"> </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button @click="edit(scope.row)" type="primary">编辑</el-button>
          <el-button v-if="scope.$index !== state.list.length - 1" @click="delConfirm(scope.row.id)" type="danger" class="cus-button-danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="state.title" v-model="state.dialogVisible" width="30%" @close="handleClose">
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
} from "@/views/API/admin.js";
import { reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

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
  const res: any = await getCateApi({});
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
  const res = await delCateApi({ id: id });
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

const submit = async (row: any) => {
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
const handleClose = async () => {
  state.row = {
    id: "",
    name: "",
  };
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
