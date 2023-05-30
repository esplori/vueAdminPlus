<template>
  <div class="music">
    <searchHeader :title="'音乐列表'">
      <el-button type="primary" @click="insert">新增</el-button>
    </searchHeader>
    <el-table :data="state.list">
      <el-table-column label="歌曲名" prop="name"> </el-table-column>
      <el-table-column label="歌手">
        <template #default="scope">
          {{ scope.row.singerName }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template #default="scope">
          {{ scope.row.createDate }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button link @click="edit(scope.row)">编辑</el-button>
          <el-button link type="danger" @click="delConfirm(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box" style="text-align: center; margin-top: 20px">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="state.params.pageNum"
        :page-size="state.params.pageSize"
        :page-sizes="[10, 20, 30, 50]"
        :pager-count="5"
        layout="total, prev, pager, next"
        :total="state.total"
      >
      </el-pagination>
    </div>
    <el-dialog :title="state.title" v-model="state.dialogVisible" width="40%">
      <div>
        <el-form :model="state.row" label-width="80px">
          <el-form-item label="歌曲名：">
            <el-input
              v-model="state.row.name"
              placeholder="请输入歌曲名"
            ></el-input>
          </el-form-item>
          <el-form-item label="歌手：">
            <el-input
              v-model="state.row.singerName"
              placeholder="请输入歌手"
            ></el-input>
          </el-form-item>
          <el-form-item label="地址：">
            <el-input
              type="textarea"
              :rows="5"
              v-model="state.row.songUrl"
              placeholder="请输入地址"
            ></el-input>
          </el-form-item>
        </el-form>
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
  getMusicListApi,
  insertMusicItemApi,
  updateMusicItemApi,
  delMusicItemApi,
} from "@/views/API/tools.js";
import { reactive, onMounted } from "vue";
import searchHeader from "@/views/components/searchHeader.vue";
import { ElMessage, ElMessageBox } from "element-plus";
const state = reactive({
  dialogVisible: false,
  title: "新增",
  list: [],
  params: {
    pageNum: 1,
    pageSize: 10,
  },
  total: 0,
  row: {
    id: "",
    name: "",
    singerName: "",
    songUrl: "",
  },
});
onMounted(() => {
  getList();
});

const getList = () => {
  getMusicList();
};

const getMusicList = async () => {
  const res: any = await getMusicListApi(state.params);
  if (res) {
    state.list = res.data.result;
    state.total = res.data.total;
  }
};

const handleSizeChange = (val: any) => {
  state.params.pageSize = val;
  getList();
};

const handleCurrentChange = (val: any) => {
  state.params.pageNum = val;
  getList();
};
const insert = () => {
  state.dialogVisible = true;
  state.title = "新增";
};
const submit = async (row: any) => {
  if (row.id) {
    const res = await updateMusicItemApi(row);
    if (res) {
      getList();
    }
  } else {
    const res = await insertMusicItemApi(row);
    if (res) {
      getList();
    }
  }
  state.dialogVisible = false;
};
const edit = (row: any) => {
  state.title = "编辑";
  state.row = row;
  state.dialogVisible = true;
};

const delConfirm = async (id: any) => {
  ElMessageBox.confirm("此操作将删除该条数据, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    delItem(id);
  });
};

const delItem = async (id: any) => {
  const res = await delMusicItemApi({ id: id });
  if (res) {
    ElMessage.success("删除成功");
    getList();
  }
};
</script>

<style scoped lang="scss">
.music {
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
