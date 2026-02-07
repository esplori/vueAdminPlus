<template>
  <div class="login">
    <div class="particles"></div>
    <div class="login-container">
      <div class="toReg">
        <h2>注册</h2>
        <div>已有账号？<a href="/#/login" class="toRegTxt">去登录</a></div>
      </div>
      <el-form size="default" :model="regform" :rules="rules" ref="formref" label-position="left">
        <el-form-item prop="username" class="animated-input">
          <el-input @focus="shadow" @blur="hideShadow" v-model="regform.username" placeholder="请输入账号"
            class="animated-input"></el-input>
          <div class="input-underline" :class="{ active: showShadow }"></div>
        </el-form-item>
        <el-form-item prop="password" class="animated-input">
          <el-input @focus="shadow" @blur="hideShadow" v-model="regform.password" type="password" placeholder="请输入密码"
            class="animated-input"></el-input>
          <div class="input-underline" :class="{ active: showShadow }"></div>
        </el-form-item>
        <el-form-item prop="email" class="animated-input">
          <el-input @focus="shadow" @blur="hideShadow" v-model="regform.email" type="text" placeholder="请输入正确邮箱"
            class="animated-input"></el-input>
          <div class="input-underline" :class="{ active: showShadow }"></div>
        </el-form-item>
        <el-form-item>
          <el-button class="login-btn" data-umami-event="register button" @click="valid" type="primary">立即注册</el-button>
        </el-form-item>
      </el-form>
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
  // 用户名默认转为小写
  regform.username = regform.username.toLowerCase()
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
  background: linear-gradient(135deg, #f8f9ff 0%, #e8f0fe 25%, #e0e9ff 50%, #d6e4ff 75%, #c9dbff 100%);
  background-size: 300% 300%;
  animation: gradientBG 18s ease infinite;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.5) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.4) 0%, transparent 50%);
    animation: float 25s infinite linear alternate;
    z-index: 0;
  }
}

.login-container {
  width: 480px;
  padding: 40px 50px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  z-index: 2;

  .toReg {
    text-align: center;
    margin-bottom: 30px;

    h2 {
      font-size: 1.8rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 8px;
    }

    div {
      color: #64748b;
      font-size: 0.9rem;
    }

    a {
      color: #4f46e5;
      font-weight: 600;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.animated-input {
  position: relative;
  margin-bottom: 24px;

  &:deep(.el-input__wrapper) {
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 12px;
    box-shadow: none;
    border: 1px solid rgba(0, 0, 0, 0.08);
    transition: all 0.3s;

    &.is-focus {
      border-color: #4f46e5;
      box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
    }
  }
}

.input-underline {
  height: 2px;
  background: linear-gradient(to right, #4f46e5, #818cf8);
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  transition: width 0.4s;
  &.active {
    width: 100%;
  }
}

.login-btn {
  width: 100%;
  height: 52px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(79, 70, 229, 0.3);
  }
}

@keyframes gradientBG {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes float {
  0% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(30px, 30px) rotate(3deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}
</style>
