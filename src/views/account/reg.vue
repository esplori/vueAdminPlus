<template>
  <div class="login">
    <div class="show-container" :class="{ shadow: showShadow }">
      <div class="login-container">
        <h2 style="text-align: center; padding-bottom: 0px;border-bottom: 1px solid #ddd;margin-bottom: 25px;">注册</h2>
        <el-form
          :model="regform"
          label-width="80px"
          :rules="rules"
          ref="formref"
          label-position="left"
        >
          <el-form-item label="用户名:" prop="username">
            <el-input
              @focus="shadow"
              @blur="hideShadow"
              v-model="regform.username"
              placeholder="账号"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码:" prop="password">
            <el-input
              @focus="shadow"
              @blur="hideShadow"
              v-model="regform.password"
              type="password"
              placeholder="密码"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱:" prop="email">
            <el-input
              @focus="shadow"
              @blur="hideShadow"
              v-model="regform.email"
              type="text"
              placeholder="请输入正确邮箱,方便找回密码"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button style="width: 100%" @click="valid" type="primary"
              >提交</el-button
            >
          </el-form-item>
          <el-form-item>
            <div>
              已有账号？<span><a href="/#/login" class="toLogin">去登录</a></span>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { registerApi } from "@/views/account/api";
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();

let form = reactive({
  username: "",
  password: "",
});
let showShadow = ref(false);
let regform = reactive({
  username: "",
  password: "",
  email: "",
});
const rules = reactive({
  username: [
    { required: true, message: "请输入用户名", trigger: "change" },
    {
      min: 4,
      max: 20,
      message: "长度在 4 到 20 个字符",
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "change" },
    {
      min: 4,
      max: 20,
      message: "长度在 4 到 20 个字符",
      trigger: "blur",
    },
  ],
  email: [
    { required: true, message: "请输入邮箱", trigger: "change" },
    {
      type: "email",
      message: "请输入正确的邮箱地址",
      trigger: ["blur", "change"],
    },
  ],
});

const shadow = () => {
  showShadow.value = true;
};

const hideShadow = () => {
  showShadow.value = false;
};

const register = async () => {
  if (!regform.username || !regform.password) {
    ElMessage.error("请输入账号和密码");
    return;
  }
  const res = await registerApi(regform);
  if (res) {
    ElMessage.success("注册成功，请登录");
    router.push({ path: "/login" });
  }
};
const formref = ref();
const valid = async () => {
  let boolRes = await formref.value.validate();
  boolRes && register();
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.login {
  // background: url("../../assets/images/bg.jpg") no-repeat;
  background: url("../../assets/images/bg.svg") no-repeat;
  background-size: cover;
  min-height: 100vh;
  .show-container {
    width: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    .login-container {
      border-radius: 3px;
      width: 420px;
      margin-top: 0;
      background: rgba(255, 255, 255, 1);
      padding: 30px 60px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
      border-radius: 100% 0% 100% 0% / 0% 100% 0% 100%   ;
      box-shadow: inset 1px 1px 1px rgba(0,0,0, 0.2), 
                  10px 10px 20px rgba(0, 0, 0, 0.1), 
                  1px 1px 1px rgba(0, 0, 0, 0.05),
                  inset -10px -10px 15px rgba(255,255,255, 0.8);
      animation: action 3s linear infinite alternate;
      @keyframes action {
        50%{
          border-radius:  95% 5% 97% 3% / 4% 96% 4% 96%          ;
        }
        100%{
          border-radius:  98% 2% 97% 3% / 2% 96% 4% 98%     ;
        }
        
      }
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
  .toLogin{
    color: #409eff;
  }
}
</style>
