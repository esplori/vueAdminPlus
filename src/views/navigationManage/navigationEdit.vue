<template>
  <div class="post">
    <el-form label-width="80px" :model="form">
      <el-form-item label="名称：">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="地址：">
        <el-input v-model="form.url" :rows="10"></el-input>
      </el-form-item>
      <el-form-item label="描述：">
        <el-input type="textarea" v-model="form.content" :rows="5"></el-input>
      </el-form-item>
      <el-form-item label="分类：">
        <el-select v-model="form.cate">
          <el-option
            v-for="(item, index) in cateList"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="submit" type="primary">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts" setup>
import {
  postPageApi,
  editPageApi,
  getDetailApi,
} from "@/views/API/navigation.js";
import { getNavCateApi } from "@/views/API/admin.js";
import { ref, reactive, onMounted, toRef } from "vue";
import { ElMessage } from "element-plus";
import { useRoute, useRouter } from "vue-router";
let route = useRoute();
let router = useRouter();
let form = reactive({
  id: "",
  title: "",
  content: "",
  cate: "",
  url: "",
});
let cateList = ref([]);
onMounted(() => {
  const id = route.query.id;
  if (id) {
    getDetail(id);
  }
  getNavCateList();
});
const getNavCateList = async () => {
  const res = await getNavCateApi({});
  if (res) {
    cateList.value = res.data.map((item: any) => {
      item.id = String(item.id);
      return item;
    });
  }
};

const submit = async () => {
  if (form.id) {
    editPage();
  } else {
    postPage();
  }
};

const editPage = async () => {
  const res = await editPageApi({ ...form });
  if (res) {
    ElMessage.success("修改成功");
    router.push({ path: "/navigationList" });
  }
};

const postPage = async () => {
  const res = await postPageApi({ ...form });
  if (res) {
    ElMessage.success("添加成功");
    router.push({ path: "/navigationList" });
  }
};

const getDetail = async (id: any) => {
  const res = await getDetailApi({ id: id });
  if (res) {
    debugger;
    let { cate, content, id, title, url } = res.data.result;
    form.id = id;
    form.cate = cate;
    form.content = content;
    form.title = title;
    form.url = url;
  }
};
</script>

<style scoped lang="scss">
.post {
  width: 100%;
}
</style>
