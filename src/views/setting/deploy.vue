<template>
  <div class="compressJs">
    <el-table :data="state.tableData" style="width: 100%">
      <el-table-column prop="name" label="部署名称" width="180">
      </el-table-column>
      <el-table-column prop="type" label="部署文件" width="180">
      </el-table-column>
      <el-table-column width="180" label="操作">
        <template #default="scope">
          <el-button :type="scope.row.class" @click="deployAdmin(scope.row)" :loading="scope.row.loading"
            :icon="ArrowRight" circle></el-button>
        </template>
      </el-table-column>
      <el-table-column width="180" label="状态">
        <template #default="scope">
          <el-button v-show="scope.row.success" type="success" :icon="Check" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { deployApi } from "@/views/API/tools.js";
import { reactive } from "vue";
import { ArrowRight, Check } from "@element-plus/icons-vue";

const state = reactive({
  tableData: [
    {
      name: "部署后台管理",
      type: "/build.sh",
      success: false,
      loading: false,
      btnDesc: "el-icon-caret-right",
      class: "primary",
    },
    {
      name: "部署前台应用",
      type: "/build.nuxt.sh",
      success: false,
      loading: false,
      btnDesc: "el-icon-caret-right",
      class: "primary",
    },
  ],
});

const deployAdmin = async (row: any) => {
  row.loading = true;
  row.class = "info";
  const res = await deployApi({ type: row.type || "" });
  if (res) {
    row.success = true;
  }
  row.loading = false;
  row.btnDesc = "el-icon-caret-right";
  row.class = "primary";
};
</script>

<style scoped lang="scss">
.compressJs {
  width: 100%;

  .success {
    color: #67c23a;
  }
}
</style>
