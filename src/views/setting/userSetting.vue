<template>
  <div class="user-info">
    <el-form :model="form" label-width="80px" label-position="left">
      <el-form-item label="昵称:">
        <el-input v-model="form.nickname" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="个性签名:">
        <el-input v-model="form.userdesc" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="头像:">
        <el-input v-model="form.avatar"> </el-input>
      </el-form-item>
       <el-form-item label="邮箱:">
        <el-input v-model="form.email"> </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">更新</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { updateUserInfoApi, getUserInfoApi } from "@/views/API/admin.js";

export default {
  data() {
    return {
      form: {
        nickname: "",
        userdesc: "",
        avatar: "",
        email: ''
      },
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    async submit() {
      const res = await updateUserInfoApi(this.form);
      if (res) {
        this.$message.success("更新成功");
      }
    },
    async getUserInfo() {
      const res = await getUserInfoApi({});
      if (res) {
        this.form = res.data;
      }
    },
  },
};
</script>

<style scoped lang="less">
.user-info {
  padding: 20px 0;
}
</style>
