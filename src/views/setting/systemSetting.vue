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
      <el-form-item label="sd上传文件实际路径:">
        <el-input v-model="state.form.sdRealUrl"> </el-input>
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
          <el-table-column prop="address" label="操作" width="80px">
            <template #default="scope">
              <el-button link type="danger" @click="delCarouselItem(scope.$index)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="btn-box">
          <el-button type="primary" style="width:100%" @click="addCarouselItem">新增</el-button>
        </div>
      </el-form-item>
      <el-form-item label="首页菜单:" style="width: 100%">

        <el-table :data="state.menuList" style="width: 100%">
          <el-table-column type="index" label="序号" width="55px"></el-table-column>
          <el-table-column label="菜单名称">
            <template #default="scope">
              <el-input v-model="scope.row.menuName"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="url" label="菜单地址">
            <template #default="scope">
              <el-input v-model="scope.row.menuUrl"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="启用" width="80px">
            <template #default="scope">
              <el-switch v-model="scope.row.enabled" active-value="Y" inactive-value="N">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作" width="80px">
            <template #default="scope">
              <el-button link type="danger" @click="delMenuItem(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="btn-box">
          <el-button type="primary" style="width:100%" @click="addMenuItem">新增</el-button>
        </div>
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
    sdRealUrl: ""
  },
  tableData: [{ imgUrl: "", desc: "", url: "" }],
  menuList: [{ menuName: "", menuUrl: "", enabled: "Y" }]
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
      menuList: JSON.stringify(state.menuList)
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
    state.menuList = JSON.parse(res.data.menuList);
  }
};

const addCarouselItem = () => {
  state.tableData.push({ imgUrl: "", desc: "", url: "" });
};

const delCarouselItem = (index: number) => {
  state.tableData.splice(index, 1);
};
const addMenuItem = () => {
  state.menuList.push({ menuName: "", menuUrl: "", enabled: "Y" });
};

const delMenuItem = (index: number) => {
  state.menuList.splice(index, 1);
};
</script>

<style scoped lang="scss">
.systemSetting {
  .setting-form {
    &>div {
      width: 65%;
    }
  }

  .btn-box {
    width: 100%;
    margin: 10px 0;
  }
}
</style>
