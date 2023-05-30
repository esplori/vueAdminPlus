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
          <h2>注册</h2>
          <div>已有账号？<a href="/#/login" class="toRegTxt">去登录</a></div>
        </div>
        <el-form
          size="default"
          :model="regform"
          :rules="rules"
          ref="formref"
          label-position="left"
        >
          <el-form-item prop="username">
            <el-input
              @focus="shadow"
              @blur="hideShadow"
              v-model="regform.username"
              placeholder="请输入账号"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              @focus="shadow"
              @blur="hideShadow"
              v-model="regform.password"
              type="password"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item prop="email">
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
              >立即注册</el-button
            >
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

const form = reactive({
  username: "",
  password: "",
});
const showShadow = ref(false);
const regform = reactive({
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
    ElMessage.success("注册成功，即将跳转到登录页面");
    setTimeout(() => {
      localStorage.clear();
      router.push({ path: "/login" });
    }, 3000);
  }
};
const formref = ref();
const valid = async () => {
  const boolRes = await formref.value.validate();
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

    .toReg {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      align-items: center;
    }
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
      border-radius: 3px;
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

  .toLogin {
    color: #409eff;
  }

  .toRegTxt {
    color: #005980;
  }
}
</style>
