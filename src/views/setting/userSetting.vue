<template>
  <div class="user-info">
    <el-form :model="state.form" label-width="80px" label-position="left">
      <el-form-item label="昵称:">
        <el-input v-model="state.form.nickname"></el-input>
      </el-form-item>
      <el-form-item label="个性签名:">
        <el-input v-model="state.form.userdesc" type="textarea" :rows="5"></el-input>
      </el-form-item>
      <!-- <el-form-item label="头像:">
        <el-input v-model="state.form.avatar"> </el-input>
      </el-form-item> -->
      <el-form-item label="邮箱:">
        <el-input v-model="state.form.email"> </el-input>
      </el-form-item>
      <el-form-item label="积分:">
        <div>{{state.form.memberPoints || 0}}</div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { updateUserInfoApi, getUserInfoApi } from "@/views/API/admin.js";
import { reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
const state = reactive({
  form: {
    nickname: "",
    userdesc: "",
    avatar: "",
    email: "",
    memberPoints:""
  },
});
onMounted(() => {
  getUserInfo();
});
const submit = async () => {
  const res = await updateUserInfoApi(state.form);
  if (res) {
    ElMessage.success("更新成功");
  }
};

const getUserInfo = async () => {
  const res: any = await getUserInfoApi({});
  if (res) {
    state.form = res.data;
  }
};
</script>

<style scoped lang="scss">
.user-info {
  width: 40%;
  padding: 20px 0;
}
</style>
