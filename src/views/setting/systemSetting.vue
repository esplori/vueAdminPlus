<template>
  <div class="systemSetting">
    <searchHeader :title="'站点设置'"></searchHeader>
    <el-form :model="state.form" label-width="150px" label-position="left" class="setting-form">
      <el-form-item label="站点名称:">
        <el-input v-model="state.form.siteName"></el-input>
      </el-form-item>
      <el-form-item label="站点描述:">
        <el-input v-model="state.form.siteDesc" type="textarea" :rows="5"></el-input>
      </el-form-item>
      <el-form-item label="站点地址:">
        <el-input v-model="state.form.siteUrl"> </el-input>
      </el-form-item>
      <el-form-item label="文件引用路径:">
        <el-input v-model="state.form.sourceUrl"> </el-input>
      </el-form-item>
      <el-form-item label="文件上传实际路径:">
        <el-input v-model="state.form.sourceRealUrl"> </el-input>
      </el-form-item>
      <el-form-item label="文件备份实际路径:">
        <el-input v-model="state.form.bakRealUrl"> </el-input>
      </el-form-item>
      <el-form-item label="book实际路径:">
        <el-input v-model="state.form.bookUrl"> </el-input>
      </el-form-item>
      <el-form-item label="备案号:">
        <el-input v-model="state.form.beianNo" type="textarea" :rows="5">
        </el-input>
      </el-form-item>
      <el-form-item label="站长邮箱:">
        <el-input v-model="state.form.siteEmail"> </el-input>
      </el-form-item>
      <el-form-item label="清空redis缓存:">
        <el-button type="danger" @click="clearCache">清空</el-button>
      </el-form-item>
      <el-form-item label="启用轮播:" style="width: 100%">
        <el-switch v-model="state.form.carouselEnable" active-value="Y" inactive-value="N">
        </el-switch>
        <el-table :data="state.tableData" style="width: 100%">
          <el-table-column type="index" label="序号" width="55px"></el-table-column>
          <el-table-column label="轮播图片地址" width="180">
            <template #default="scope">
              <el-input v-model="scope.row.imgUrl"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="轮播描述" width="180">
            <template #default="scope">
              <el-input v-model="scope.row.desc"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="跳转链接">
            <template #default="scope">
              <el-input v-model="scope.row.url"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作">
            <template #default="scope">
              <el-button link type="primary" @click="add">新增</el-button>
              <el-button link type="danger" @click="del(scope.$index)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import {
  updateSiteInfoApi,
  getSiteInfoApi,
  clearCacheApi,
} from "@/views/API/admin.js";
import { reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import searchHeader from "../components/searchHeader.vue";
const state = reactive({
  form: {
    siteName: "",
    siteDesc: "",
    siteUrl: "",
    sourceUrl: "",
    sourceRealUrl: "",
    beianNo: "",
    bakRealUrl: "",
    siteEmail: "",
    carouselEnable: "N",
    bookUrl: "",
  },
  tableData: [{ imgUrl: "", desc: "", url: "" }],
});
onMounted(() => {
  getSiteInfo();
});
const clearCache = async () => {
  const res = await clearCacheApi({});
  if (res) {
    ElMessage.success("清空成功");
  }
};

const submit = async () => {
  const res = await updateSiteInfoApi(
    Object.assign({}, state.form, {
      carouselUrl: JSON.stringify(state.tableData),
    })
  );

  if (res) {
    ElMessage.success("更新成功");
  }
};

const getSiteInfo = async () => {
  const res: any = await getSiteInfoApi({});
  if (res) {
    state.form = res.data;
    state.tableData = JSON.parse(res.data.carouselUrl);
  }
};

const add = () => {
  state.tableData.push({ imgUrl: "", desc: "", url: "" });
};

const del = (index: number) => {
  state.tableData.splice(index, 1);
};
</script>

<style scoped lang="scss">
.systemSetting {
  .setting-form {
    &>div {
      width: 65%;
    }
  }
}
</style>
