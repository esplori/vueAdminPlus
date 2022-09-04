<template>
  <div class="login">
    <div class="show-container" :class="{ shadow: showShadow }">
      <div class="login-container">
        <h2 style="text-align: center; padding-bottom: 20px">登录</h2>
        <el-form
          :model="form"
          label-width="80px"
          :rules="loginRules"
          ref="formref"
          label-position="left"
        >
          <el-form-item label="用户名：" prop="username">
            <el-input
              @focus="shadow"
              @blur="hideShadow"
              prefix-icon="el-icon-user"
              v-model="form.username"
              placeholder="账号"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码：" prop="password">
            <el-input
              @focus="shadow"
              @blur="hideShadow"
              prefix-icon="el-icon-view"
              v-model="form.password"
              type="password"
              placeholder="密码"
              @keyup.enter="login"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="login" type="primary" style="width: 100%"
              >登录</el-button
            >
          </el-form-item>
          <el-form-item>
            <div>
              还没有账号？<span><a href="/#/reg">去注册</a></span>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { loginApi } from "./api.ts";
const form = reactive({
  username: "",
  password: "",
});
const showShadow = ref(false);
const shadow = () => {
  showShadow.value = true;
};
const hideShadow = () => {
  showShadow.value = false;
};
const loginRules = reactive({
  username: [{ required: true, message: "请输入用户名", trigger: "change" }],
  password: [{ required: true, message: "请输入密码", trigger: "change" }],
});
const router = useRouter();

// 获取refs
const formref = ref();
const login = async function () {
  const valid = await formref.value.validate();
  if (!valid) {
    return;
  }
  const res = await loginApi(form);
  if (res) {
    localStorage.setItem("userInfo", JSON.stringify(res.data));
    router.push({ path: "/home" });
  }
};
</script>

<style lang="scss" scoped>
.login {
  // background: url("../../assets/images/bg.jpg") no-repeat;
  background-size: cover;

  .show-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .login-container {
      border-radius: 3px;
      width: 400px;
      margin-top: 15vh;
      background: rgba(255, 255, 255, 1);
      padding: 40px 60px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      .reg {
        cursor: pointer;
        font-size: 12px;
        text-decoration: underline;
      }
    }
  }
  .shadow {
    background: rgba(0, 0, 0, 0.6);
    transition: all 0.5s;
  }
}
</style>
