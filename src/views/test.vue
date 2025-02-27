<template>
  <div class="chatbox">

    <!-- <div v-html="content"></div> -->
    <el-scrollbar height="85vh">
      <div ref="messages" class="messages">
        <div v-for="(msg, index) in messages" :key="index"
          :class="{ 'user-message': msg.user === 'user', 'bot-message': msg.user === 'bot' }">
          <!-- <div v-html="msg.content"></div> -->
          <v-md-preview :text="msg.content"></v-md-preview>
        </div>
      </div>
      <div class="input-box">
        <el-input v-model="input" type="textarea" :rows="5" @keyup.enter="sendMessage"
          placeholder="Type a message..." />
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import { fetchEventSource } from '@microsoft/fetch-event-source'
export default {
  components: {
    // MarkdownRenderer
  },
  data() {
    return {
      input: '',
      messages: [],
      content: ''
    };
  },
  created() {
  },
  methods: {
    sendMessage() {
      if (this.input.trim()) {
        this.messages.push({ user: 'user', content: this.input });
        this.$nextTick(() => {
          this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight;
        });
        this.fetchData();
        this.input = '';
      }
    },
    async fetchData() {

      this.messages.push({ user: 'bot', content: '思考中...' });
      const url = 'http://localhost/v1/chat-messages'; // 替换为你的 API 地址
      const headers = {
        'Authorization': 'Bearer app-nuwNuup5OjPsWG8SfZO6ZHk8', // 替换为你自己的 API Key
        'Content-Type': 'application/json'
      };
      const requestBody = JSON.stringify({
        inputs: {},
        query: this.input,
        response_mode: "streaming",
        conversation_id: "", // 可选，根据需要填写
        user: "abc-123"     // 根据 API 文档填写
      });


      let _this = this
      await fetchEventSource(url, {
        method: 'POST',
        headers: headers,
        body: requestBody,
        async onmessage(ev) {
          // const chunk = decoder.decode(ev.data, { stream: false });
          try {
            let jsonObj = JSON.parse(ev.data);
            console.log(jsonObj.answer); // 输出解析后的对象
            _this.messages[_this.messages.length - 1].content += jsonObj.answer || ''
          } catch (e) {
            console.log("err", e);
          }

        },
        onclose(params) {
          console.log("close", params);
        },
        onerror(err) {
          console.log("err", err);
        }
      })
    }
  }
};
</script>

<style scoped>
/* 输入框固定在最下面 */
.input-box {
  position: absolute;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  background-color: #f5f5f5;
  border-top: 1px solid #ccc;
}

.chatbox {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.messages {
  flex: 1;
  padding: 5px;
  overflow-y: auto;
}

.user-message {
  text-align: right;
  color: blue;
}

.bot-message {
  text-align: left;
  color: green;
}
</style>