<template>
  <div class="app-container">
    <!-- 头部 -->
    <header class="header">
      <div class="header-title">Chat Application</div>
      <el-dropdown>
        <span class="el-dropdown-link">{{ username }}<i class="el-icon-arrow-down el-icon--right"></i></span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item><router-link to="/personal-center" class="dropdown-item">个人主页</router-link></el-dropdown-item>
            <el-dropdown-item @click.prevent="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </header>
    <!-- 导航栏 -->
    <nav class="sidebar">
      <ul>
        <li v-for="session in sessions" :key="session.dialogue_id" class="session-item" @click="selectSession(session)">
          <span>{{ session.title }}</span>
          <button class="delete-button" @click.stop="confirmDeleteSession(session.dialogue_id)">×</button>
        </li>
        <li class="add-session" @click="addNewSession">+ New Session</li>
      </ul>
    </nav>
    <!-- 主要内容区 -->
    <main class="main-container">
      <div class="chat-history" ref="chatHistory">
        <div v-for="message in currentSession.messages" :key="message.id" :class="['message', message.isUser ? 'user-message' : 'bot-message']">
          <img v-if="message.isImage" :src="message.imageUrl" alt="Uploaded Image" />
          <p v-if="message.score">{{ message.score }}</p>
          <span v-else-if="!message.isImage">{{ message.text }}</span>
        </div>
      </div>
      <div class="input-section">
        <textarea v-model="newMessage" placeholder="Type your message here..." @keyup.enter="sendMessage"></textarea>
        <button @click="sendMessage">Send</button>
        <label for="file-input" class="upload-button">Upload Image</label>
        <input type="file" id="file-input" accept="image/*" @change="uploadImage" style="display: none;" />
      </div>
    </main>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import router from '@router';

export default defineComponent({
  setup() {
    // 用户信息
    const userInfo = ref<any>(null);
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      userInfo.value = JSON.parse(storedUserInfo);
    }
    const username = userInfo.value?.data.user_name;

    // 对话列表
    const sessions = ref<any[]>([]);
    const currentSession = ref<any>({});

    // 聊天记录引用
    const chatHistory = ref<HTMLElement | null>(null);

    // 新消息
    const newMessage = ref('');

    // 获取所有对话
    const fetchAllDialogues = async () => {
      try {
        const formData = new FormData();
        formData.append('user_id', userInfo.value?.data.user_id);
        const response = await fetch('http://10.203.183.143:5000/user/dialogue_list', {
          method: 'POST',
          body: formData
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.code === 0) {
          sessions.value = data.data.map(dialogue => ({
            ...dialogue,
            messages: []
          }));
          ?alert('会话列表加载成功');
        } else {
          alert(data.message || '获取会话列表失败');
        }
      } catch (error) {
        console.error('Failed to fetch all dialogues', error);
        alert('获取会话列表时发生错误，请稍后再试');
      }
    };

    // 选择对话
    const selectSession = async (session: any) => {
      currentSession.value = session;
      await getDialogueMessages(session.dialogue_id);
      scrollToBottom();
    };

    // 获取指定对话的所有消息
    const getDialogueMessages = async (dialogueId: string) => {
      try {
        const formData = new FormData();
        formData.append('user_id', userInfo.value?.data.user_id);
        formData.append('dialogue_id', dialogueId);
        const response = await fetch('http://10.203.183.143:5000/user/get_dialogue', {
          method: 'POST',
          body: formData
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.code === 0) {
          currentSession.value.messages = data.data.map(item => ({
            text: item.question,
            isUser: true,
            ...(item.type === 1 ? { imageUrl: item.result_1 } : {}),
            ...(item.type === 0 ? { results: [item.result_1, item.result_2, item.result_3, item.result_4, item.result_5, item.result_6, item.result_7, item.result_8] } : {})
          }));
          alert('会话数据加载成功');
        } else {
          alert(data.message || '获取会话数据失败');
        }
      } catch (error) {
        console.error('Failed to get dialogue messages', error);
        alert('获取会话数据时发生错误，请稍后再试');
      }
    };

    // 删除会话
    const deleteSession = async (dialogueId: string) => {
      try {
        const formData = new FormData();
        formData.append('dialogue_id', dialogueId);
        const response = await fetch(`http://10.203.183.143:5000/user/delete_dialogue`, {
          method: 'POST',
          body: formData
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.code === 0) {
          sessions.value = sessions.value.filter(session => session.dialogue_id !== dialogueId);
          alert('会话已成功删除');
        } else {
          alert(data.message || '删除会话失败');
        }
      } catch (error) {
        console.error('Failed to delete session', error);
        alert('删除会话时发生错误，请稍后再试');
      }
    };

    // 确认删除对话
    const confirmDeleteSession = (dialogueId: string) => {
      if (confirm('确定要删除此会话吗？')) {
        deleteSession(dialogueId);
      }
    };

    // 页面加载完毕时执行的操作
    onMounted(async () => {
      await fetchAllDialogues();
      if (sessions.value.length > 0) {
        await selectSession(sessions.value[0]);
      }
      scrollToBottom();
    });

    // 添加新对话
    const addNewSession = async () => {
      const title = prompt('请输入会话标题：');
      const userId = userInfo.value?.data.user_id;
      try {
        if (title) {
          const formData = new FormData();
          formData.append('user_id', userId);
          formData.append('title', title);
          const response = await fetch('http://10.203.183.143:5000/user/new_dialogue', {
            method: 'POST',
            body: formData
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          if (data.code === 0) {
            sessions.value.push({
              title,
              dialogue_id: data.data.dialogue_id,
              messages: []
            });
            selectSession(sessions.value.find(session => session.dialogue_id === data.data.dialogue_id));
            alert('会话创建成功');
          } else {
            alert(data.message || '创建会话失败');
          }
        }
      } catch (error) {
        console.error('Failed to create new dialogue', error);
        alert('创建会话时发生错误，请稍后再试');
      }
    };

    // 发送消息
    const sendMessage = async () => {
      if (newMessage.value.trim()) {
        currentSession.value.messages.push({ text: newMessage.value, isUser: true });
        const body = {
          text: newMessage.value,
          user_id: userInfo.value?.data.user_id,
          dialogue_id: currentSession.value.dialogue_id
        };
        try {
          const response = await fetch('http://10.203.183.143:5000/user/text_to_image', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(body)
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          if (data.code === 0) {
            data.data.forEach((item: any) => {
              const imageUrl = item[0];
              const score = item[1];
              currentSession.value.messages.push({
                imageUrl,
                text: `相关度分数 ${score.toFixed(4)}`,
                isUser: false
              });
            });
            setTimeout(() => {
              currentSession.value.messages.push({ text: 'I am here to help. What do you need', isUser: false });
            }, 1000);
          } else {
            alert(data.message);
          }
        } catch (error) {
          console.error('Failed to send message', error);
          alert('发送消息失败，请稍后重试');
        }
      }
    };

    // 滚动到底部
    const scrollToBottom = () => {
      if (chatHistory.value) {
        chatHistory.value.scrollTop = chatHistory.value.scrollHeight;
      }
    };

    return {
      username,
      newMessage,
      sessions,
      currentSession,
      confirmDeleteSession,
      addNewSession,
      sendMessage,
      scrollToBottom
    };
  }
});
</script>
<style scoped>
/* 应用程序容器 */
.app-container {
  display: flex;
  height: 100vh;
}

/* 头部 */
.header {
  background-color: #f8f9fa;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 1.2em;
  font-weight: bold;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}

.el-icon-arrow-down {
  font-size: 12px;
}

/* 导航栏 */
.sidebar {
  width: 200px;
  background-color: #e9ecef;
  padding: 20px;
  overflow-y: auto;
}

.session-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #dee2e6;
  cursor: pointer;
}

.delete-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1em;
  color: #dc3545;
}

/* 主要内容区 */
.main-container {
  flex: 1;
  padding: 20px;
  background-color: #ffffff;
  overflow-y: auto;
}

.chat-history {
  height: calc(100% - 100px); /* 调整高度以适应输入区 */
  overflow-y: scroll;
}

.message {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
}

.user-message {
  background-color: #007bff;
  color: #ffffff;
  float: right;
  clear: both;
}

.bot-message {
  background-color: #e9ecef;
  float: left;
  clear: both;
}

.upload-button {
  cursor: pointer;
  color: #007bff;
  text-decoration: underline;
}

/* 新增会话项 */
.add-session {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  border-top: 1px solid #dee2e6;
  cursor: pointer;
}
</style>