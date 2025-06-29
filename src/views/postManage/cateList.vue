<template>
  <div class="page-list">
    <searchHeader :title="'分类管理'">
      <el-button type="primary" @click="insertCate">新增分类</el-button>
    </searchHeader>
    <el-table :data="state.list" style="width: 100%">
      <el-table-column label="序号" type="index" width="80px"> </el-table-column>
      <el-table-column label="标题">
        <template #default="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createDate"> </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button link @click="edit(scope.row)" type="primary">编辑</el-button>
          <el-button link @click="delConfirm(scope.row.id)" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="state.pageNum" :page-size="state.pageSize" :page-sizes="[10, 20, 30, 50]"
        layout="total, prev, pager, next" :total="state.total">
      </el-pagination>
    </div>

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
  getAdminCateValidApi,
  updateCateApi,
  insertCateApi,
} from "@/views/API/admin.js";
import { reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import searchHeader from "../components/searchHeader.vue";

const state = reactive({
  list: [],
  dialogVisible: false,
  title: "新增",
  row: {
    id: "",
    name: null,
  },
  pageNum: 1,
  pageSize: 10,
  total: 0
});
onMounted(() => {
  getList();
});
const insertCate = () => {
  state.dialogVisible = true;
  state.title = "新增";
};
const getList = async () => {
  const res: any = await getAdminCateValidApi({
    pageNum: state.pageNum,
    pageSize: state.pageSize
  });
  if (res) {
    state.list = res.data.result;
    state.total = res.data.total
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
    if (!row.name) {
      ElMessage.error("请输入名称");
      return
    }
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

const handleSizeChange = (val: any) => {
  state.pageSize = val;
  getList();
};
const handleCurrentChange = (val: any) => {
  state.pageNum = val;
  getList();
};
</script>
