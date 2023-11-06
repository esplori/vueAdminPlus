<template>
  <div class="comments-list">
    <searchHeader :title="'评论管理'">
      <el-button type="danger" @click="delConfirm(state.multipleSelection)">批量删除</el-button>
    </searchHeader>
    <el-table :data="state.list" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column label="用户">
        <template #default="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="文章">
        <template #default="scope">
          <a :href="'http://www.dsiab.com/post/' + scope.row.postId" target="_blank">{{ scope.row.postId }}</a>
        </template>
      </el-table-column>
      <el-table-column label="内容" show-overflow-tooltip>
        <template #default="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>
      <el-table-column label="邮箱" show-overflow-tooltip>
        <template #default="scope">
          {{ scope.row.mail }}
        </template>
      </el-table-column>
      <el-table-column label="审核状态" show-overflow-tooltip>
        <template #default="scope">
          {{ scope.row.approved == "Y" ? "是" : "否" }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template #default="scope">
          {{ scope.row.createDate }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button link @click="delConfirm([scope.row.id])" type="text">删除</el-button>
          <el-button link @click="approveComment(scope.row.id)" type="primary">{{scope.row.approved == "Y" ?'拒绝':"通过"}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="state.params.pageNum" :page-size="state.params.pageSize" :page-sizes="[10, 20, 30, 50]"
        :pager-count="5" layout="total, prev, pager, next" :total="state.total">
      </el-pagination>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  getCommentApi,
  delCommentApi,
  approveCommentApi,
} from "@/views/API/admin.js";
import { reactive, onMounted } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import searchHeader from "../components/searchHeader.vue";
const state = reactive({
  list: [],
  total: 0,
  params: {
    pageNum: 1,
    pageSize: 10,
  },
  multipleSelection: [],
});
onMounted(() => {
  getList();
});
const getList = async () => {
  const res: any = await getCommentApi(state.params);
  if (res) {
    state.list = res.data.result;
    state.total = res.data.total;
  }
};
const delConfirm = async (ids: any) => {
  if (!ids.length) {
    ElMessage.warning("请至少勾选一条数据")
    return false
  }
  ElMessageBox.confirm("此操作将删除该条数据, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    del(ids);
  });
};

const del = async (ids: any) => {
  const res = await delCommentApi({ ids: ids });
  if (res) {
    
    getList();
  }
};
const approveComment = async (id: any) => {
  const res = await approveCommentApi({ id: id });
  if (res) {
    ElMessage.success("操作成功");
    getList();
  }
};

const handleSelectionChange = (val: any) => {
  state.multipleSelection = val.map((item: any) => {
    return item.id;
  });
};

const handleSizeChange = (val: any) => {
  state.params.pageSize = val;
  getList();
};
const handleCurrentChange = (val: any) => {
  state.params.pageNum = val;
  getList();
};
</script>
