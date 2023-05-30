<template>
  <div class="login">
    <div class="show-container" :class="{ shadow: showShadow }">
      <div class="left-pic">
        <div class="login-box">
          <div class="logo"></div>
          <span>技术分享</span>
        </div>
        <div class="slogan">『书写心得，分享感悟』</div>
        <div class="comment">
          <div>昨日之深渊，今日之浅谈。</div>
          <div>路虽远，行则将至。</div>
          <div>事虽难，做则可成。</div>
        </div>
      </div>
      <div class="login-container">
        <div class="toReg">
          <h2>登录</h2>
          <div>没有账号？<a href="/#/reg" class="toRegTxt">去注册</a></div>
        </div>
        <el-form
          size="default"
          :model="form"
          :rules="loginRules"
          ref="formref"
          label-position="left"
        >
          <el-form-item label="" prop="username">
            <el-input
              @focus="shadow"
              @blur="hideShadow"
              :prefix-icon="User"
              v-model="form.username"
              placeholder="请输入账号"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="" prop="password">
            <el-input
              @focus="shadow"
              @blur="hideShadow"
              :prefix-icon="Lock"
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
              @keyup.enter="login"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="login" type="primary" style="width: 100%"
              >登录</el-button
            >
          </el-form-item>
          <el-form-item>
            <div class="login-operate">
              <span
                ><a href="/#/resetPwd" class="toRegTxt"
                  >已有账号，忘记密码</a
                ></span
              >
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
  const res: any = await loginApi(form).then((res: any) => {
    localStorage.setItem("userInfo", JSON.stringify(res.data));
    router.push({ path: "/home" });
  });
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

    .left-pic {
      display: flex;
      justify-content: space-around;
      align-items: flex-start;
      flex-direction: column;
      padding: 20px 30px 80px 30px;
      color: #fff;
      width: 280px;
      height: 334px;
      background: linear-gradient(0deg, #3a485a 0%, #607089 100%);
      // border-radius: 100% 0% 100% 0% / 0% 100% 0% 100%;
      box-shadow: 0 0 2px rgba(255, 255, 255, 0.3);

      .login-box {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        font-size: 1rem;

        .logo {
          font-size: 1rem;
          // border: 1px solid #fff;
          // border-radius: 50%;
          padding: 5px;
          // margin-right: 10px;
          display: inline-block;
          background: url("@/assets/images/logo_white.png") no-repeat;
          width: 80px;
          height: 40px;
          background-size: cover;
        }
      }

      .slogan {
        font-size: 1.2rem;
      }

      .comment {
        font-size: 0.8rem;
      }
    }

    .login-container {
      box-sizing: border-box;
      width: 380px;
      margin-top: 0;
      background: rgba(255, 255, 255, 1);
      padding: 40px 60px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
      border-radius: 100% 0% 100% 0% / 0% 100% 0% 100%;
      box-shadow: inset 1px 1px 1px rgba(0, 0, 0, 0.2),
        10px 10px 20px rgba(0, 0, 0, 0.1), 1px 1px 1px rgba(0, 0, 0, 0.05),
        inset -10px -10px 15px rgba(255, 255, 255, 0.8);
      // animation: action 3s linear infinite alternate;
      // @keyframes action {
      //   50%{
      //     border-radius:  95% 5% 97% 3% / 4% 96% 4% 96%          ;
      //   }
      //   100%{
      //     border-radius:  98% 2% 97% 3% / 2% 96% 4% 98%     ;
      //   }

      // }
      .toReg {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        align-items: center;
      }

      .reg {
        cursor: pointer;
        font-size: 12px;
        text-decoration: underline;
      }

      .login-operate {
        width: 100%;
        display: flex;
        justify-content: center;
      }
    }
  }

  .shadow {
    background: rgba(0, 0, 0, 0.5);
    transition: all 0.8s;
  }

  .toRegTxt {
    color: #005980;
  }
}
</style>
