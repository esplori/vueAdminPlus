<template>
  <div class="chatbox">
    <div class="chat-header">
      <h1>AI 聊天助手</h1>
      <div class="header-subtitle">随时为您解答问题</div>
    </div>
    <div class="model-list">
      <span>模型选择：</span>
      <el-select v-model="type" @change="modelChange">
        <el-option v-for="(item, index) in modelList" :key="index" :label="item.modelName" :value="item.modelCode"></el-option>
      </el-select>
    </div>
    <el-scrollbar height="85vh">
      <div ref="messages" class="messages">
        <div v-for="(msg, index) in messages" :key="index"
          :class="{ 'user-message': msg.user === 'user', 'bot-message': msg.user === 'bot' }">
          <div class="loading-text" v-if="msg.user == 'bot' && isNotLoading">思考中...</div>
          <div v-html="md.render(msg.content)"></div>
          <!-- <v-md-preview
            :text="msg.content"></v-md-preview> -->
        </div>
      </div>
      <div class="input-box">
        <el-row>
          <el-col :span="22">
            <el-input v-model="input" type="textarea" :rows="5" @keyup.enter="sendMessage"
              placeholder="Type a message..." />
          </el-col>
          <el-col :span="2">
            <div class="send-btn" @click="sendMessage">发送</div>
          </el-col>
        </el-row>

      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import { fetchEventSource } from '@microsoft/fetch-event-source'
import MarkdownIt from 'markdown-it'
import { userInfoStore } from "@/stores/userInfo";
import { getListApi } from "./API";
export default {
  components: {
    // MarkdownRenderer
  },
  data() {
    return {
      input: '',
      messages: [],
      content: '',
      isNotLoading: true,
      type: "qwen-plus",
      modelList: [],
      md:null,
      curretnModel:{}
    };
  },
  created() {
    this.getModelList()
  },
  mounted() {
    // 创建 markdown-it 实例
    this.md = new MarkdownIt()
  },
  methods: {
    modelChange(val){
      this.curretnModel = this.modelList.find(item => item.modelCode == this.type)
      console.log(this.curretnModel);
      
    },
    async getModelList(){
      const res = await getListApi();
      let listString = res.data
      this.modelList = JSON.parse(listString)
      if (this.modelList.length) {
        this.curretnModel = this.modelList[0]
        console.log(this.modelList[0]);
        
      }
    },
    sendMessage() {
      if (this.input.trim()) {
        this.messages.push({ user: 'user', content: this.input });
        this.$nextTick(() => {
          this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight;
        });
        if (this.type == 'dify') {
          this.fetchDataDify();
        } else if (this.type == 'qwen-plus') {
          this.fetchDataQwen()
        }

        this.input = '';
      }
    },
    async fetchDataQwen() {

      this.messages.push({ user: 'bot', content: '' });
      
      const headers = {
        'Authorization': this.curretnModel.token, // 替换为你自己的 API Key
        'Content-Type': 'application/json'
      };
      const requestBody = JSON.stringify({
        stream: true,
        model: this.curretnModel.modelCode,
        "messages": [
          {
            "role": "system",
            "content": "You are a helpful assistant."
          },
          {
            "role": "user",
            "content": this.input
          }
        ],
      });


      let _this = this

      await fetchEventSource(this.curretnModel.url, {
        method: 'POST',
        headers: headers,
        body: requestBody,
        async onmessage(ev) {
          _this.isNotLoading = false;
          try {
            let jsonObj = JSON.parse(ev.data);
            let content = jsonObj.choices[0].delta.content
            console.log(jsonObj.answer); // 输出解析后的对象
            _this.messages[_this.messages.length - 1].content += content || ''
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
    },
    async fetchDataDify() {

      this.messages.push({ user: 'bot', content: '' });
      const url = 'http://localhost/v1/chat-messages'; // 替换为你的 API 地址
      const headers = {
        'Authorization': 'Bearer app-tEZfc1byRys1dMjUhshnWfSl', // 替换为你自己的 API Key
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
          _this.isNotLoading = false;
          try {
            let jsonObj = JSON.parse(ev.data);
            console.log(jsonObj.answer); // 输出解析后的对象
            let content = jsonObj.answer || ''
            _this.messages[_this.messages.length - 1].content += content || ''
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
/* 新增的头部样式 */
.chat-header {
  text-align: center;
  padding: 20px 0;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  color: white;
  border-radius: 0 0 20px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.chat-header h1 {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 8px;
}

.header-subtitle {
  font-size: 14px;
  opacity: 0.8;
}

/* 优化现有样式 */
.chatbox {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
}

.messages {
  flex: 1;
  overflow-y: auto;
  background-color: white;
  margin: 0 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.user-message {
  text-align: right;
  margin-bottom: 16px;
  border-top: 1px dashed #b1b2b5;
  border-bottom: 1px dashed #b1b2b5;
  margin-top: 20px;
  margin: 10px;
  position: relative;
}

.bot-message {
  text-align: left;
  margin-bottom: 16px;
  position: relative;
}

.input-box {
  position: sticky;
  bottom: 0;
  width: calc(100% - 40px);
  margin: 0 20px 20px;
  box-sizing: border-box;
  padding: 16px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #e9ecef;
  margin-top: 20px;
}

.loading-text {
  padding-left: 40px;
  opacity: 0.8;
}

.model-list {
  padding: 20px;
}

.send-btn {
  width: 100%;
  height: 114px;
  line-height: 114px;
  background-color: #6e8efb;
  text-align: center;
  margin-left: 10px;
  border-radius: 5px;
  vertical-align: middle;
  cursor: pointer;
  color: #f8f9fa;
}

.model-name {
  position: absolute;
  top: 33px;
  width: 40px;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 50%;
  background-color: #ddd;
  color: #fff;
}

.user-name {
  display: inline-block;
  width: 40px;
  height: 40px;
  line-height: 40px;
  position: absolute;
  top: 33px;
  font-size: 16px;
  border-radius: 50%;
  background-color: #ddd;
  color: #fff;
}

.user-message, .bot-message {
  padding: 16px 20px;
  margin: 12px 20px;
  border-radius: 12px;
  max-width: 80%;
}

.user-message {
  background: #e3f2fd;
  margin-left: auto;
  border-top-right-radius: 4px;
}

.bot-message {
  background: #f1f1f1;
  margin-right: auto;
  border-top-left-radius: 4px;
}
.user-message::after {
  content: '';
  position: absolute;
  right: -8px;
  top: 16px;
  border-width: 8px 0 8px 8px;
  border-style: solid;
  border-color: transparent #e3f2fd;
}

.bot-message::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 16px;
  border-width: 8px 8px 8px 0;
  border-style: solid;
  border-color: transparent #f1f1f1;
}
.model-name, .user-name {
  width: 36px;
  height: 36px;
  line-height: 36px;
  text-align: center;
  font-size: 14px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  color: white;
  position: absolute;
  top: 10px;
}

.model-name {
  left: -45px;
}

.user-name {
  right: -45px;
}
.input-box {
  background: white;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.send-btn {
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  transition: all 0.3s;
}

.send-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(110, 142, 251, 0.3);
}
.loading-text {
  position: relative;
  padding-left: 24px;
  color: #888;
}

.loading-text::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  border: 2px solid #ddd;
  border-top-color: #6e8efb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: translateY(-50%) rotate(360deg); }
}
</style>