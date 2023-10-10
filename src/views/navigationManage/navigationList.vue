<template>
  <div class="page-list">
    <searchHeader :title="'导航管理'">
      <div class="select-by-cate">
        <div class="pdding">
          <span>分类：</span>
          <el-select v-model="state.params.cate" @change="typeChange" clearable>
            <el-option v-for="(item, index) in state.cateList" :key="index" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </div>
        <el-button type="primary" @click="insert">新增导航</el-button>
      </div>

    </searchHeader>
    <el-table :data="state.list" style="width: 100%">
      <!-- <el-table-column type="index" width="55" label="序号"> </el-table-column> -->
      <el-table-column prop="title" label="标题"> </el-table-column>
      <el-table-column prop="content" label="描述" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="url" label="地址" show-overflow-tooltip>
        <template #default="scope">
          <a class="primary-active-color" :href="scope.row.url" target="_blank">{{ scope.row.url }}</a>
        </template>
      </el-table-column>
      <el-table-column prop="cateName" label="分类"> </el-table-column>
      <el-table-column prop="createDate" label="创建日期" show-overflow-tooltip>
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
        :current-page="state.params.page" :page-sizes="[10, 20, 30, 50]" :page-size="state.params.pageSize"
        layout="total, prev, pager, next" :total="state.total">
      </el-pagination>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { delApi, getListApi, getNavCateApi } from "@/views/API/navigation.js";
import { reactive, onMounted } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import searchHeader from "../components/searchHeader.vue";
const router = useRouter();
const state = reactive({
  list: [],
  params: {
    cate: "",
    page: 1,
    pageSize: 10,
  },
  cateList: [{ name: "", id: "" }],
  total: 0,
});
onMounted(() => {
  getList();
  getCateList()
});

const insert = () => {
  router.push({ path: "post" });
};

const getList = async () => {
  const res: any = await getListApi(state.params);
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

const edit = async (row: any) => {
  router.push({ path: "post", query: { id: row.id, name: row.title } });
};

const handleSizeChange = async (val: any) => {
  state.params.pageSize = val;
  getList();
};

const handleCurrentChange = async (val: any) => {
  state.params.page = val;
  getList();
};

const getCateList = async () => {
  const res: any = await getNavCateApi({
    pageNum: 1,
    pageSize: 50
  });
  if (res) {
    state.cateList = res.data.result;
  }
}

const typeChange = async (val: string) => {
  getList()
}
</script>
