<template>
  <div class="page-list">
    <div class="handle">
      <!-- <el-button type="primary" @click="multipleDel">批量删除</el-button> -->
    </div>
    <el-table :data="state.list" style="width: 100%">
      <el-table-column type="index" width="55" label="序号"> </el-table-column>
      <el-table-column prop="title" label="标题"> </el-table-column>
      <el-table-column prop="content" label="描述"> </el-table-column>
      <el-table-column prop="url" label="地址"> </el-table-column>
      <el-table-column prop="createDate" label="创建日期"> </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button @click="edit(scope.row.id)" type="text">编辑</el-button>
          <el-button
            @click="delConfirm(scope.row.id)"
            type="text"
            class="cus-button-danger"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box" style="text-align: center; margin-top: 20px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="state.params.page"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="state.params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="state.total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { delApi, getListApi } from "@/views/API/navigation.js";
import { reactive, onMounted } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { useRouter } from "vue-router";
const router = useRouter();
const state = reactive({
  list: [],
  params: {
    page: 1,
    pageSize: 10,
  },
  total: 0,
});
onMounted(() => {
  getList();
});

const getList = async () => {
  const res = await getListApi(state.params);
  if (res) {
    state.list = res.data.result;
    state.total = res.data.total;
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
  const res = await delApi({ id: id });
  if (res) {
    ElMessage.success("删除成功");
    getList();
  }
};

const edit = async (id: any) => {
  router.push({ path: "navigationEdit", query: { id: id } });
};

const handleSizeChange = async (val: any) => {
  state.params.pageSize = val;
  getList();
};

const handleCurrentChange = async (val: any) => {
  state.params.page = val;
  getList();
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
