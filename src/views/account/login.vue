<template>
  <div class="login">
    <!-- 新增粒子背景 -->
    <div class="particles" ref="particles"></div>

    <div class="login-container">
      <div class="toReg">
        <h2>登录</h2>
        <div>没有账号？<a href="/#/reg" class="toRegTxt">去注册</a></div>
      </div>
      <el-form size="default" :model="form" :rules="loginRules" ref="formref" label-position="left">
        <el-form-item label="" prop="username">
          <el-input @focus="shadow" @blur="hideShadow" :prefix-icon="User" v-model="form.username" placeholder="请输入账号"
            class="animated-input">
          </el-input>
          <div class="input-underline" :class="{ active: showShadow }"></div>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input @focus="shadow" @blur="hideShadow" :prefix-icon="Lock" v-model="form.password" type="password"
            placeholder="请输入密码" @keyup.enter="login" class="animated-input"></el-input>
          <div class="input-underline" :class="{ active: showShadow }"></div>
        </el-form-item>
        <el-form-item>
          <el-button @click="login" type="primary" :loading="loading" class="login-btn" ref="loginBtn">
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
        <el-form-item>
          <div class="login-operate">
            <span><a href="/#/resetPwd" class="toRegTxt">已有账号，忘记密码</a></span>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { loginApi } from "@/views/account/api";
import { User, Lock } from "@element-plus/icons-vue";
import { userInfoStore } from "@/stores/userInfo";

const form = reactive({
  username: "",
  password: "",
});

const loading = ref(false);
const showShadow = ref(false);
const formref = ref();
const router = useRouter();
const loginBtn = ref<HTMLElement | null>(null);
const particles = ref<HTMLElement | null>(null);

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









// 清除当前用户的cookie
const us = userInfoStore();
const username = us.userInfo.username;
document.cookie = `${username}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
us.userInfo.username = "";


const login = async function () {
  const valid = await formref.value.validate();
  if (!valid) {
    return;
  }

  loading.value = true;
  try {
    form.username = form.username.toLowerCase();
    const res = await loginApi(form);
    localStorage.setItem("userInfo", JSON.stringify(res.data));
    router.push({ path: "/home" });
  } catch (error) {
    // 错误处理
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.login {
  background: linear-gradient(135deg,
      #f8f9ff 0%, // 柔和的淡蓝白
      #e8f0fe 25%, // 浅天蓝
      #e0e9ff 50%, // 淡蓝
      #d6e4ff 75%, // 浅蓝
      #c9dbff 100% // 淡蓝紫
    );
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
    background:
      radial-gradient(circle at 20% 30%,
        rgba(255, 255, 255, 0.5) 0%,
        transparent 50%),
      radial-gradient(circle at 80% 70%,
        rgba(255, 255, 255, 0.4) 0%,
        transparent 50%);
    animation: float 25s infinite linear alternate;
    z-index: 0;
    opacity: 0.8;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background:
      repeating-linear-gradient(60deg,
        rgba(255, 255, 255, 0.15) 0px,
        rgba(255, 255, 255, 0.15) 1px,
        transparent 1px,
        transparent 8px),
      repeating-linear-gradient(-60deg,
        rgba(255, 255, 255, 0.1) 0px,
        rgba(255, 255, 255, 0.1) 1px,
        transparent 1px,
        transparent 8px);
    pointer-events: none;
    z-index: 0;
  }
}

.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;

  .particle {
    position: absolute;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    pointer-events: none;
    animation: particleMove linear infinite;
    filter: blur(1px);
    will-change: transform, opacity;

    // 添加粒子发光效果
    box-shadow:
      0 0 15px rgba(173, 216, 230, 0.8),
      0 0 30px rgba(173, 216, 230, 0.6),
      0 0 45px rgba(173, 216, 230, 0.4);
  }
}

// 增强版粒子动画
@keyframes particleMove {
  0% {
    transform:
      translateY(0) translateX(0) scale(0.8);
    opacity: 0;
  }

  10% {
    opacity: 0.8;
  }

  50% {
    transform:
      translateY(-40vh) translateX(40px) scale(1.2);
    opacity: 1;
  }

  100% {
    transform:
      translateY(-80vh) translateX(80px) scale(0.5);
    opacity: 0;
  }
}

.login-container {
  width: 580px;
  padding: 50px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.18),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 2;

  &:hover {
    transform: translateY(-5px);
    box-shadow:
      0 12px 40px rgba(0, 0, 0, 0.25),
      0 0 0 1px rgba(255, 255, 255, 0.15) inset;
  }

  .toReg {
    text-align: center;
    margin-bottom: 40px;

    h2 {
      font-size: 1.8rem;
      font-weight: 700;
      color: #3a485a;
      margin-bottom: 12px;
      position: relative;
      display: inline-block;

      &::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 60px;
        height: 3px;
        background: linear-gradient(to right, #667eea, #764ba2);
        border-radius: 3px;
        animation: underlineScale 2s infinite;
      }
    }

    div {
      color: #666;
      font-size: 0.9rem;
    }

    a {
      color: #667eea;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.2s;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 0;
        height: 1px;
        background: #764ba2;
        transition: width 0.3s;
      }

      &:hover {
        color: #764ba2;

        &::after {
          width: 100%;
        }
      }
    }
  }

  .el-form {
    margin-top: 30px;

    .animated-input {
      position: relative;
      margin-bottom: 20px;

      &:deep(.el-input__wrapper) {
        padding: 12px 16px;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 10px;
        box-shadow: none;
        border: 1px solid rgba(0, 0, 0, 0.08);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

        &:hover {
          background: white;
          border-color: rgba(102, 126, 234, 0.3);
        }

        &.is-focus {
          background: white;
          border-color: #667eea;
          box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
          transform: translateY(-1px);
        }
      }

      &:deep(.el-input__prefix) {
        margin-right: 10px;
        color: #667eea;
        transition: all 0.3s;
      }
    }

    .input-underline {
      height: 2px;
      background: linear-gradient(to right, #667eea, #764ba2);
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);

      &.active {
        width: 100%;
      }
    }

    .login-btn {
      border-radius: 12px;
      height: 52px;
      font-size: 1.05rem;
      font-weight: 600;
      letter-spacing: 0.8px;
      background: linear-gradient(135deg,
          #6a8cff 0%, // 明亮的科技蓝
          #4a6cff 100% // 稍深的科技蓝
        );
      border: none;
      color: white;
      transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
      position: relative;
      overflow: hidden;
      z-index: 1;
      will-change: transform, box-shadow;

      // 3D悬浮效果
      box-shadow:
        0 4px 12px rgba(74, 108, 255, 0.25),
        0 2px 4px rgba(74, 108, 255, 0.15),
        inset 0 1px 1px rgba(255, 255, 255, 0.2);

      // 金属质感边框
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.15);
        pointer-events: none;
        z-index: 2;
      }

      // 流光效果
      &::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: linear-gradient(to bottom right,
            rgba(255, 255, 255, 0) 45%,
            rgba(255, 255, 255, 0.15) 50%,
            rgba(255, 255, 255, 0) 55%);
        transform: rotate(30deg);
        animation: shine 3s infinite linear;
        z-index: 1;
      }

      &:hover {
        transform: translateY(-3px) scale(1.02);
        box-shadow:
          0 8px 24px rgba(74, 108, 255, 0.35),
          0 4px 8px rgba(74, 108, 255, 0.2),
          inset 0 1px 1px rgba(255, 255, 255, 0.25);

        // 悬停时暂停流光
        &::before {
          animation-play-state: paused;
        }
      }

      &:active {
        transform: translateY(1px) scale(0.98);
        box-shadow:
          0 2px 6px rgba(74, 108, 255, 0.3),
          inset 0 1px 1px rgba(255, 255, 255, 0.1);
        transition-duration: 0.1s;
      }

      // 加载状态
      &.is-loading {
        background: linear-gradient(135deg,
            rgba(106, 140, 255, 0.8) 0%,
            rgba(74, 108, 255, 0.8) 100%);

        &::before {
          animation: none;
          background: rgba(255, 255, 255, 0.1);
        }
      }

      // 波纹效果
      .ripple {
        position: absolute;
        background: rgba(255, 255, 255, 0.4);
        border-radius: 50%;
        transform: scale(0);
        animation: rippleEffect 0.6s ease-out;
        pointer-events: none;
      }
    }

    @keyframes shine {
      0% {
        transform: rotate(30deg) translateX(-100%);
      }

      100% {
        transform: rotate(30deg) translateX(100%);
      }
    }

    @keyframes rippleEffect {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  }
}

.login-operate {
  text-align: center;
  margin-top: 15px;

  a {
    color: #666;
    font-size: 0.85rem;
    text-decoration: none;
    transition: all 0.2s;

    &:hover {
      color: #667eea;
    }
  }
}

@keyframes gradientBG {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

@keyframes float {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }

  50% {
    transform: translate(50px, 50px) rotate(5deg);
  }

  100% {
    transform: translate(0, 0) rotate(0deg);
  }
}

@keyframes particleMove {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 1;
  }

  100% {
    transform: translateY(-100vh) translateX(100px);
    opacity: 0;
  }
}

@keyframes rippleEffect {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

@keyframes underlineScale {
  0% {
    transform: translateX(-50%) scaleX(1);
  }

  50% {
    transform: translateX(-50%) scaleX(1.2);
  }

  100% {
    transform: translateX(-50%) scaleX(1);
  }
}

@media (max-width: 768px) {
  .login-container {
    width: 88%;
    padding: 40px 30px;
    border-radius: 14px;

    .toReg h2 {
      font-size: 1.6rem;
    }
  }

  .login-btn {
    height: 46px;
  }
}
</style>