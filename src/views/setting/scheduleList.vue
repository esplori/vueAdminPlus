<template>
  <div class="schedule-list">
    <searchHeader :title="'定时任务'"></searchHeader>
    <el-table :data="state.list">
      <el-table-column label="任务ID" prop="id" width="100px"></el-table-column>
      <el-table-column label="任务名称" >
        <template #default="scope">
          <span v-if="!scope.row.isEdit">{{ scope.row.cron_name }}</span>
          <el-input v-else v-model="scope.row.cron_name"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="定时任务（cron）表达式">
        <template #default="scope">
          <span v-if="!scope.row.isEdit">{{ scope.row.cron_date }}</span>
          <el-input v-else v-model="scope.row.cron_date"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100px">
        <template #default="scope">
          <el-button type="primary" v-if="!scope.row.isEdit" link @click="edit(scope.row)">编辑</el-button>
          <el-button type="primary" v-else link @click="save(scope.row)">保存</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box" style="text-align: center; margin-top: 20px">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="state.params.page" :page-size="state.params.pageSize" :page-sizes="[10, 20, 30, 50]"
        :pager-count="5" layout="total, prev, pager, next" :total="state.total">
      </el-pagination>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getScheduleApi, saveScheduleApi } from "@/views/API/system.js";
import { reactive, onMounted } from "vue";
import searchHeader from "../components/searchHeader.vue";
import { ElMessage } from "element-plus";
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
  const res: any = await getScheduleApi(state.params);
  if (res) {
    state.list = res.data;
    state.total = res.data.length;
  }
};


const edit = (row: {isEdit:Boolean}) => {
  row.isEdit = true
}
const save = async (row: {isEdit:Boolean}) => {
  const res: any = await saveScheduleApi(row);
  if (res) {
    ElMessage.success("保存成功")
    row.isEdit = false
  }
}

const handleSizeChange = (val: any) => {
  state.params.pageSize = val;
  getList();
};

const handleCurrentChange = (val: any) => {
  state.params.page = val;
  getList();
};
</script>
