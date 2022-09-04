<template>
  <div class="jsonviewer">
    <div class="json-input">
      <el-input type="textarea" :rows="25" v-model="originJsonData"></el-input>
    </div>
    <json-viewer
      class="json-output"
      :value="jsonData"
      copyable
      boxed
      sort
      :expand-depth="5"
      :expanded="true"
      :preview-mode="false"
    ></json-viewer>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      originJsonData:
        '{"code":0,"msg":"查询成功","data":{"username":"test","password":"","role":"ROLE_author","nickname":"i am a test user","userdesc":"developer","avatar":"icom","token":null}}',
      jsonData: {},
    };
  },
  mounted() {
    this.handler();
  },
  methods: {
    handler() {
      this.jsonData = JSON.parse(this.originJsonData);
    },
  },
  watch: {
    originJsonData(newVal, oldVal) {
      this.handler();
    },
  },
};
</script>

<style scoped lang="scss">
.jsonviewer {
  width: 100%;
  display: flex;
  .json-input {
    flex: 1;
    margin-right: 10px;
  }
  .json-output {
    flex: 2;
    min-height: 537px;
  }
}
</style>
