<template>
  <div class="page-list">
    <el-table :data="state.list" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column type="index" label="序号" width="55px"></el-table-column>
      <el-table-column label="标题">
        <template #default="scope">
          <a style="color: #333" :href="'https://www.dsiab.com/post/' + scope.row.id" target="_blank">{{ scope.row.title
          }}</a>
        </template>
      </el-table-column>
      <el-table-column label="分类" width="120px">
        <template #default="scope">
          {{ scope.row.cateName }}
        </template>
      </el-table-column>
      <el-table-column label="作者" width="120px">
        <template #default="scope">
          {{ scope.row.createBy }}
        </template>
      </el-table-column>
      <el-table-column label="阅读" width="120px">
        <template #default="scope">
          {{ scope.row.views }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180px">
        <template #default="scope">
          {{ scope.row.createDate }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" width="180" label="操作">
        <template #default="scope">
          <el-button @click="delConfirm(scope.row.id)" type="text" class="cus-button-danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="delMul">
      <el-button @click="delMul">批量删除</el-button>
    </div>
    <div class="pagination-box" style="text-align: center; margin-top: 20px">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="state.params.page" :page-size="state.params.pageSize" :page-sizes="[10, 20, 30, 50]"
        :pager-count="5" layout="total, sizes, prev, pager, next, jumper" :total="state.total">
      </el-pagination>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  deletePostApi,
  getPostListByCateApi,
  getCateValidApi,
} from "@/views/API/admin.js";
import { reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import { ElMessageBox, ElMessage } from "element-plus";

const route = useRoute();
const state = reactive({
  list: [],
  params: {
    page: 1,
    cate: 0,
    pageSize: 10,
  },
  total: 0,
  cateList: [],
  multipleSelection: [],
});
onMounted(() => {
  // 恢复之前查询的参数
  const { page = 1, cate = 0, pageSize = 10 } = route.query as any;
  state.params.page = parseInt(page);
  state.params.pageSize = parseInt(pageSize);
  state.params.cate = parseInt(cate);
  getList();
});

const getList = () => {
  getListByCate();
};

const getListByCate = async () => {
  const res: any = await getPostListByCateApi(state.params);
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
    delMultiple([id]);
  });
};

const handleSizeChange = (val: any) => {
  state.params.pageSize = val;
  getList();
};

const handleCurrentChange = (val: any) => {
  state.params.page = val;
  getList();
};

const handleSelectionChange = (val: any) => {
  state.multipleSelection = val;
};

const delMul = (val: any) => {
  ElMessageBox.confirm("此操作将删除数据, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    delMultiple(
      state.multipleSelection.map((item: any) => {
        return item.id;
      })
    );
  });
};

const delMultiple = async (ids: any) => {
  const res = await deletePostApi({ ids: ids });
  if (res) {
    ElMessage.success("删除成功");
    getList();
  }
}

</script>

<style scoped lang="scss">
.page-list {
  width: 100%;

  .select-by-cate {
    margin-bottom: 20px;
  }

  .content-item {
    font-size: 18px;
    text-align: left;
    padding: 5px;
  }

  .delMul {
    padding: 10px 0;
  }
}
</style>
