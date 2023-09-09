<template>
  <div class="getRegionFromIp">
    <searchHeader :title="'ip归属地查询'"></searchHeader>
    <el-form :model="state.form" label-width="140px" style="width: 50%">
      <el-form-item label="您当前ip及归属地：">
        {{ state.form.localIp }}({{ state.form.localIpRegion }})
      </el-form-item>
      <el-form-item label="ip地址：">
        <el-input v-model="state.form.ip"></el-input>
      </el-form-item>
      <el-form-item label="ip归属地：">
        {{ state.form.inputIp }}
      </el-form-item>
    </el-form>
    <div style="text-align: center; padding: 20px">
      <el-button type="primary" @click="getRegionFromIp">查询</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getRegionFromIpApi } from "../../API/tools";
import { reactive, onMounted } from "vue";
import searchHeader from "../../components/searchHeader.vue";

const state = reactive({
  form: {
    inputIp: "",
    localIp: "",
    ip: "",
    localIpRegion: "",
  },
});

const getRegionFromIp = async () => {
  const res: any = await getRegionFromIpApi({ ip: state.form.ip });
  if (res) {
    const { inputIp, localIp, localIpRegion } = res.data;
    state.form.inputIp = inputIp;
    state.form.localIp = localIp;
    state.form.localIpRegion = localIpRegion;
  }
};
onMounted(() => {
  getRegionFromIp();
});
</script>
