<template>
  <div class="page-list">
    <el-button type="text" @click="insertCate">新增分类</el-button>
    <el-table :data="list" style="width: 100%">
      <el-table-column type="index" width="55" label="序号"> </el-table-column>
      <el-table-column label="标题">
        <template #default="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button @click="edit(scope.row)" type="text">编辑</el-button>
          <el-button
            @click="delConfirm(scope.row.id)"
            type="text"
            class="cus-button-danger"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="title"
      v-model="dialogVisible"
      width="30%"
      @close="handleClose"
    >
      <div>
        <el-input v-model="row.name" placeholder="请输入名称"></el-input>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit(row)">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {
  delNavCateApi,
  getNavCateApi,
  updateNavCateApi,
  insertNavCateApi,
} from "@/views/API/admin.js";
import { ref, reactive, onMounted } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";

let list = ref([]);
let dialogVisible = ref(false);
let title = ref("新增");
let row = reactive({
  id: "",
  name: "",
});
onMounted(() => {
  getList();
});
const insertCate = () => {
  dialogVisible.value = true;
  title.value = "新增";
};

const getList = async () => {
  const res = await getNavCateApi({});
  if (res) {
    list.value = res.data;
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
  const res = await delNavCateApi({ id: id });
  if (res) {
    ElMessage.success("删除成功");
    getList();
  }
};

const edit = async (rowData: any) => {
  title.value = "编辑";
  dialogVisible.value = true;
  row.id = rowData.id;
  row.name = rowData.name;
};

const submit = async (row: any) => {
  if (!row.name) {
    ElMessage.warning("请输入名称");
    return;
  }
  if (row.id) {
    const res = await updateNavCateApi(row);
    if (res) {
      getList();
    }
  } else {
    const res = await insertNavCateApi(row);
    if (res) {
      getList();
    }
  }
  dialogVisible.value = false;
};

const handleClose = async (row: any) => {
  row = {
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
