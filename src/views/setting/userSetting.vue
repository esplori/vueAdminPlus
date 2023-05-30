<template>
  <div class="user-setting">
    <searchHeader :title="'个人资料'"></searchHeader>
    <el-form
      :model="state.form"
      label-width="120px"
      label-position="left"
      style="width: 50%"
    >
      <el-form-item label="昵称:">
        <el-input v-model="state.form.nickname"></el-input>
      </el-form-item>
      <el-form-item label="个性签名:">
        <el-input
          v-model="state.form.userdesc"
          type="textarea"
          :rows="5"
        ></el-input>
      </el-form-item>
      <el-form-item label="邮箱:">
        <el-input v-model="state.form.email"> </el-input>
      </el-form-item>
      <el-form-item label="密码:">
        <span class="editPwd"
          ><span>已设置</span
          ><span class="update-pwd" @click="updatePwd">修改密码</span></span
        >
      </el-form-item>
      <el-form-item label="开启音乐:">
        <el-radio-group v-model="state.form.musicPlayerSwitch" class="ml-4">
          <el-radio label="1">开启</el-radio>
          <el-radio label="0">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="积分:">
        <div>{{ state.form.memberPoints || 0 }}</div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">保存</el-button>
      </el-form-item>
    </el-form>

    <el-dialog v-model="state.updatePwdDialog" title="修改密码" width="30%">
      <div>
        <el-form :model="state.pwdForm" label-width="100px">
          <el-form-item label="旧密码：">
            <el-input v-model="state.pwdForm.oldPwd"></el-input>
          </el-form-item>
          <el-form-item label="新密码：">
            <el-input v-model="state.pwdForm.newPwd"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码：">
            <el-input v-model="state.pwdForm.confirmPwd"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="state.updatePwdDialog = false">取消</el-button>
          <el-button type="primary" @click="submitPwd"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {
  updateUserInfoApi,
  getUserInfoApi,
  updatePwdApi,
} from "@/views/API/admin.js";
import { reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import searchHeader from "../components/searchHeader.vue";

const router = useRouter();
const state = reactive({
  form: {
    nickname: "",
    userdesc: "",
    avatar: "",
    email: "",
    memberPoints: "",
    musicPlayerSwitch: "1",
  },
  pwdForm: {
    oldPwd: "",
    newPwd: "",
    confirmPwd: "",
  },
  updatePwdDialog: false,
});
onMounted(() => {
  getUserInfo();
});
const submit = async () => {
  const res = await updateUserInfoApi(state.form);
  if (res) {
    ElMessage.success("更新成功");
  }
};

const getUserInfo = async () => {
  const res: any = await getUserInfoApi({});
  if (res) {
    state.form = Object.assign(state.form, res.data);
  }
};

const updatePwd = () => {
  state.updatePwdDialog = true;
};
const submitPwd = async () => {
  const res: any = await updatePwdApi(state.pwdForm);
  if (res) {
    ElMessage.success("修改成功，请重新登录");
    setTimeout(() => {
      localStorage.clear();
      router.push("/login");
    });
  }
};
</script>

<style scoped lang="scss">
.user-setting {
  width: 100%;

  .editPwd {
    width: 100%;
    display: flex;
    justify-content: space-between;

    .update-pwd {
      color: #409eff;
      cursor: pointer;
    }
  }
}
</style>
