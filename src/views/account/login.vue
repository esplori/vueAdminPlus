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
      // border-radius: 5px;
      width: 420px;
      margin-top: 0;
      background: rgba(255, 255, 255, 1);
      padding: 40px 60px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
      border-radius: 49% 51% 46% 54% / 52% 49% 51% 48%   ;
      box-shadow: inset 10px 20px 30px rgba(0,0,0, 0.2), 
                  10px 10px 20px rgba(0, 0, 0, 0.1), 
                  15px 15px 30px rgba(0, 0, 0, 0.05),
                  inset -10px -10px 15px rgba(255,255,255, 0.8);
      animation: action 3s linear infinite alternate;
      @keyframes action {
        25%{
          border-radius: 43% 57% 40% 60% / 53% 44% 56% 47%     ;
        }
        50%{
          border-radius: 38% 62% 35% 65% / 56% 39% 61% 44%       ;
        }
        75%{
          border-radius: 58% 42% 51% 49% / 35% 57% 43% 65%       ;
        }
        100%{
          border-radius: 64% 36% 59% 41% / 30% 65% 35% 70%      ;
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
}
</style>
