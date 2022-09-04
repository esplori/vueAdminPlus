<template>
  <div class="admin-header">
    <div class="header-container">
      <div class="left-header">
        <div class="tips">
          <span class="welcomeMsg">每日一句：{{ dailySentence }}</span>
        </div>
      </div>
      <div class="user-info">
        <div class="userInfo">
          <div v-if="userInfo" class="info-flex">
            <el-dropdown @command="handleCommand">
              <div class="el-dropdown-link">
                {{ userInfo.username
                }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="logout">退出</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <span v-else @click="toLogin" class="login-in">登录</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { delHtmlTag } from "@/utils/common.js";
import { logoutApi } from "@/views/account/api.ts";
import { ArrowDown } from "@element-plus/icons-vue";
import { computed, watchEffect, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const dailySentence = computed(() => {
  return (
    userInfo.value.dailySentence && delHtmlTag(userInfo.value.dailySentence)
  );
});

const userInfo = ref({})

const handleCommand = (command: string) => {
  switch (command) {
    case "logout":
      logout();
      break;
  }
};

const toLogin = () => {
  router.push("/login");
};

const logout = async () => {
  const res = await logoutApi({});
  if (res) {
    toLogin();
  }
};

const propsState = defineProps(["userInfoObj"]);

watchEffect(() => {
  userInfo.value = propsState.userInfoObj;
});
</script>

<style scoped lang="scss">
.admin-header {
  width: 100%;
  padding: 20px 0;
  margin: 0 auto 10px;
  background: #fff;
  color: #71777c;
  border-bottom: 1px solid #ddd;
  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .user-info {
      display: flex;
      justify-content: flex-end;
    }
    .left-header {
      display: flex;
      align-items: center;
      width: 100%;
    }
    .tips {
      width: 100%;
      .welcomeMsg {
        // margin-left: 10px;
        font-size: 12px;
      }
    }
    .el-dropdown-link {
      display: flex;
      align-items: center;
    }
  }
}
</style>
