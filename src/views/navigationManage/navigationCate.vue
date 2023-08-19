<template>
  <div class="page-list">
    <searchHeader :title="'分类管理'">
      <el-button type="primary" @click="insertCate">新增分类</el-button>
    </searchHeader>
    <el-table :data="list" style="width: 100%">
      <el-table-column label="标题">
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
          <el-button link @click="edit(scope.row)" type="primary">编辑</el-button>
          <el-button link @click="delConfirm(scope.row.id)" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="state.params.pageNum" :page-sizes="[10, 20, 30, 50]" :page-size="state.params.pageSize"
        layout="total, prev, pager, next" :total="state.total">
      </el-pagination>
    </div>
    <el-dialog :title="title" v-model="dialogVisible" width="30%" @close="handleClose">
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
} from "@/views/API/navigation.js";
import { ref, reactive, onMounted } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import searchHeader from "../components/searchHeader.vue";

const list = ref([]);
const dialogVisible = ref(false);
const title = ref("新增");
const row = reactive({
  id: "",
  name: "",
});
let state = reactive({
  params: {
    pageNum: 1,
    pageSize: 10
  },
  total: 0
})
onMounted(() => {
  getList();
});
const insertCate = () => {
  dialogVisible.value = true;
  title.value = "新增";
};

const getList = async () => {
  const res: any = await getNavCateApi({
    pageNum: state.params.pageNum,
    pageSize: state.params.pageSize
  });
  if (res) {
    list.value = res.data.result;
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
const handleCurrentChange = async (val: any) => {
  state.params.pageNum = val;
  getList();
};

const handleSizeChange = async (val: any) => {
  state.params.pageSize = val;
  getList();
};
</script>
