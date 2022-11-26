<template>
  <div class="login">
    <div class="show-container" :class="{ shadow: showShadow }">
      <div class="login-container">
        <h2 style="text-align: center; padding-bottom: 0px;border-bottom: 1px solid #ddd;margin-bottom: 25px;">登录</h2>
        <el-form :model="form" label-width="80px" :rules="loginRules" ref="formref" label-position="left">
          <el-form-item label="用户名：" prop="username">
            <el-input @focus="shadow" @blur="hideShadow" :prefix-icon="User" v-model="form.username" placeholder="账号">
            </el-input>
          </el-form-item>
          <el-form-item label="密码：" prop="password">
            <el-input @focus="shadow" @blur="hideShadow" :prefix-icon="Lock" v-model="form.password" type="password"
              placeholder="密码" @keyup.enter="login"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="login" type="primary" style="width: 100%">登录</el-button>
          </el-form-item>
          <el-form-item>
            <div class="login-operate">
              <span><a href="/#/reg" class="toReg">去注册</a></span>
              <span><a href="/#/resetPwd" class="toReg">忘记密码</a></span>
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
import { loginApi } from "@/views/account/api";
import { User, Lock } from "@element-plus/icons-vue";
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
  const res: any = await loginApi(form);
  if (res) {
    localStorage.setItem("userInfo", JSON.stringify(res.data));
    router.push({ path: "/home" });
  }
};
</script>

<style lang="scss" scoped>
.login {
  background: url("../../assets/images/bg.svg") no-repeat;
  // background: url("../../assets/images/bg.jpg") no-repeat;
  background-size: cover;
  min-height: 100vh;

  .show-container {
    width: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;

    .login-container {
      box-sizing: border-box;
      width: 420px;
      margin-top: 0;
      background: rgba(255, 255, 255, 1);
      padding: 40px 60px;
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
      .login-operate{
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
    }
  }

  .shadow {
    background: rgba(0, 0, 0, 0.5);
    transition: all 0.5s;
  }
  .toReg{
    color: #409eff;
  }
}
</style>
