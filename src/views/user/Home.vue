<template>
  <div class="app-container">
    <header class="header">
      <div class="header-title">
        Chat Application
      </div>
      <div class="header-user">
        <el-dropdown>
          <span class="el-dropdown-link">
            {{ username }}
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <router-link to="/personal-center" class="dropdown-item" exact>个人主页</router-link>
              </el-dropdown-item>
              <el-dropdown-item>
                <a href="#" class="dropdown-item" @click.prevent="logout">退出登录</a>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>
    <nav class="sidebar">
      <ul>
        <li v-for="(session, index) in sessions" :key="index" class="session-item" @click="selectSession(index)">
          <span>{{ session.title }}</span>
          <button class="delete-button" @click.stop="confirmDeleteSession(index)">×</button>
        </li>
        <li class="add-session" @click="addNewSession">+ New Session</li>
      </ul>
    </nav>
    <main class="main-container">
      <div class="chat-history" ref="chatHistory">
        <div
          v-for="(message, index) in currentSession.messages"
          :key="index"
          :class="['message', message.isUser ? 'user-message' : 'bot-message']"
        >
          <!-- 展示图片 -->
          <img v-if="message.imageUrl" :src="message.imageUrl" alt="Uploaded Image" />

          <!-- 展示文字信息 -->
          <p v-if="message.score">{{ message.score }}</p>
          <span v-else-if="message.text">{{ message.text }}</span>
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
import router from '@/router';
import { defineComponent, ref, onMounted, nextTick, watchEffect } from 'vue';

export default defineComponent({
  setup() {
    const userInfo = ref<any>(null);
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      userInfo.value = JSON.parse(storedUserInfo);
    }
    const username = userInfo.value.data.user_name; // Replace with actual username logic
    const newMessage = ref('');
    const sessions = ref([
      {
        title: 'Welcome Session',
        dialogue_id: '', // 临时值，将在 fetchAllDialogues 中替换
        messages: [
          { text: 'Hello! How can I assist you today?', isUser: false }
        ]
      }
    ]);
    const currentSessionIndex = ref(0);
    const currentSession = ref(sessions.value[currentSessionIndex.value]);
    const chatHistory = ref(null);

    const confirmDeleteSession = (index: number) => {
      if (confirm('确定要删除此会话吗？')) {
        deleteSession(index);
      }
    };

    const deleteSession = async (index: number) => {
      const dialogueId = sessions.value[index].dialogue_id;

      try {
        const formData = new FormData();
        formData.append('dialogue_id', dialogueId);

        const response = await fetch(`http://10.203.183.143:5000/user/deletedialogue`, {
          method: 'POST',
          body: formData // 使用FormData对象作为请求体
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        if (data.code === 0) {
          // 成功删除后从前端状态中移除会话
          sessions.value.splice(index, 1);
          alert('会话已成功删除');
        } else {
          alert(data.message || '删除会话失败');
        }
      } catch (error) {
        console.error('Failed to delete session:', error);
        alert('删除会话时发生错误，请稍后再试');
      }
    };

    const selectSession = (index: number) => {
      currentSessionIndex.value = index;
      currentSession.value = sessions.value[index];
      getDialogueMessages(sessions.value[index].dialogue_id);
      console.log(sessions.value[index].dialogue_id);
      scrollToBottom();
    };

    const fetchAllDialogues = async () => {
      const userId = userInfo.value.data.user_id;

      try {
        const formData = new FormData();
        formData.append('user_id', userId);

        const response = await fetch('http://10.203.183.143:5000/user/dialoguelist', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        if (data.code === 0) {
          const dialogues = data.data.map(dialogue => ({
            title: dialogue.title,
            dialogue_id: dialogue.dialogue_id,
            messages: []
          }));

          sessions.value = dialogues;
          alert('会话列表加载成功');
        } else {
          alert(data.message || '获取会话列表失败');
        }
      } catch (error) {
        console.error('Failed to fetch all dialogues:', error);
        alert('获取会话列表时发生错误，请稍后再试');
      }
    };

    const getDialogueMessages = async (dialogueId: string) => {
  const userId = userInfo.value.data.user_id;

  try {
    const formData = new FormData();
    formData.append('user_id', userId);
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
      const messagesData = data.data;
      const updatedMessages = messagesData.flatMap(item => {
        const results = [];

        // 处理不同类型的消息
        if (item.type === 1) {
          // 图片回复
          results.push({ text: item.question, isUser: true });

          for (let i = 1; i <= 8; i++) {
            const resultKey = `result_${i}`;
            if (item[resultKey]) {
              results.push({
                text: item[resultKey],
                isUser: false,
                imageUrl: item[resultKey].includes('.jpg') ? item[resultKey] : undefined
              });
            }
          }
        } else if (item.type === 0) {
          // 文本回复
          results.push({ text: item.question, isUser: true });

          for (let i = 1; i <= 8; i++) {
            const resultKey = `result_${i}`;
            if (item[resultKey]) {
              results.push({
                text: item[resultKey],
                isUser: false
              });
            }
          }
        } else {
          // 其他类型可能需要特殊处理
          return [];
        }

        return results;
      });

      // 更新当前会话的消息
      currentSession.value.messages = updatedMessages;
      // 可选：显示成功提示
      // alert('会话数据加载成功');
    } else {
      // 显示错误信息
      alert(data.message || '获取会话数据失败');
    }
  } catch (error) {
    // 记录错误并显示提示
    console.error('Failed to get dialogue messages:', error);
    alert('获取会话数据时发生错误，请稍后再试');
  }
};

    const loadInitialData = async () => {
      if (currentSessionIndex.value >= 0 && currentSessionIndex.value < sessions.value.length) {
        await getDialogueMessages(sessions.value[currentSessionIndex.value].dialogue_id);
      }
    };

    onMounted(async () => {
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        userInfo.value = JSON.parse(storedUserInfo);
      }
      await fetchAllDialogues();
      await loadInitialData();
      scrollToBottom();
    });
    
const addNewSession = async () => {
    const title = prompt('请输入会话标题：');
    const userId = userInfo.value.data.user_id;
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
        const newSessionTitle = title;
        sessions.value.push({
        title: newSessionTitle,
        messages: []
      });
      selectSession(sessions.value.length - 1);
      alert('会话创建成功');
      getDialogueMessages(data.data.dialogue_id);
      } else {
      alert(data.message || '创建会话失败');
      }
    }
      } catch (error) {
        console.error('Failed to create new dialogue:', error);
        alert('创建会话时发生错误，请稍后再试');
      }
    };

const sendMessage = async () => {
  if (newMessage.value.trim()) {
    currentSession.value.messages.push({ text: newMessage.value, isUser: true });

    // 构造请求体
    const body = {
      'text': newMessage.value,
      'user_id': userInfo.value.data.user_id,
      'dialogue_id': currentSessionIndex.value.toString() 
    };

    try {
      console.log(body);
      // 发送 POST 请求
      const response = await fetch('http://10.203.183.143:5000/user/texttoimage', {
        method: 'POST', // 指定请求方法
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded' // 设置请求头
        },
        body: body.toString() // 将表单数据作为请求体
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json(); // 解析返回的JSON数据
      console.log('Message sent successfully:', data);

      // 如果需要根据后端响应做进一步处理
      if (data.code === 0) {
        // 确保 data.data 是一个数组
        if (Array.isArray(data.data)) {
          data.data.forEach((item: any[]) => {
            const imageUrl = item[0].toString();
            const score = item[1];
            const messageItem = {
              imageUrl: imageUrl,
              text: `相关度分数: ${score.toFixed(4)}`, // 显示相关度分数
              isUser: false
            };
            currentSession.value.messages.push(messageItem);
          });
        }

        // 模拟机器人响应
        setTimeout(() => {
          currentSession.value.messages.push({ text: 'I am here to help. What do you need?', isUser: false });
        }, 1000);
      } else {
        console.log('Response error:', data.message);
        alert(data.message);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('发送消息失败，请稍后重试');
    }

    newMessage.value = ''; // 清空输入字段
  }
};

const uploadImage = async (event: Event) => {
  const fileInput = event.target as HTMLInputElement;
  if (fileInput.files && fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      currentSession.value.messages.push({ text: imageUrl, isImage: true, isUser: true });
      currentSession.value.messages.push({ text: 'Thanks for the image. Let me take a look...', isUser: false });
      scrollToBottom();
    };

    const formData = new FormData();
    formData.append('image', file); // 将文件添加到 FormData 对象中
    formData.append('user_id', userInfo.value.data.user_id); // 添加 user_id
    formData.append('dialogue_id', currentSessionIndex.value.toString()); // 添加 dialogue_id

    try {
      const response = await fetch('http://10.203.183.143:5000/user/imagetotext', {
        method: 'POST',
        body: formData // 直接使用 FormData 对象作为请求体
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json(); // 解析返回的JSON数据
      console.log('Image upload successfully:', data);

      if (data.code === 0) {
        // 确保 data.data 是一个数组
        if (Array.isArray(data.data)) {
          data.data.forEach((item: any[]) => {
            const textinfo = item[0].toString();
            const score = item[1];
            const messageItem = {
              text: `${textinfo} 相关度分数:${score.toFixed(4)}`,
              isUser: false
            };
            currentSession.value.messages.push(messageItem);
          });
        }
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('上传图片时发生错误，请稍后再试');
    }

    reader.readAsDataURL(file);
  }
};

const scrollToBottom = () => {
      if (chatHistory.value) {
        chatHistory.value.scrollTop = chatHistory.value.scrollHeight;
      }
    };
const logout = () => {
      // 清除用户的认证状态或其他相关数据
      localStorage.removeItem('token'); // 示例：删除本地存储的 token
      // 跳转到登录页面
      router.push('/');
    };
watchEffect(() => {
      scrollToBottom();
    });

return {
      username,
      newMessage,
      sessions,
      currentSession,
      sendMessage,
      selectSession,
      addNewSession,
      chatHistory,
      uploadImage,
      logout,
      confirmDeleteSession,
      deleteSession,
    };
  }
});
</script>

<style scoped>
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background-color: #1f1e33;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1000;
}
.vfor{
  flex-direction: column;
}
.header-title {
  padding-left: 20px;
  
}

.header-user {
  padding-right: 20px;
  
}

.user-link {
  color: rgb(255, 255, 255);
  text-decoration: none;
  cursor: pointer;
}

.sidebar {
  position: fixed;
  top: 60px; /* Below the header */
  left: 0;
  bottom: 0;
  width: 200px;
  background-color: hsla(194, 100%, 93%, 0.765);
  overflow-y: auto;
  z-index: 999;
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
}

.sidebar li {
  padding: 10px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
}

.sidebar li:hover {
  background-color: #ddd;
}

.add-session {
  background-color: #0084ff;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

.main-container {
  margin-left: 200px; /* To match the sidebar width */
  padding-top: 60px; /* To match the header height */
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px); /* Adjust for header height */
}

.chat-history {
  flex-grow: 1;
  overflow-y: auto;
  padding: 10px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
}

.message {
  margin-bottom: 10px;
  padding: 5px 10px;
  border-radius: 5px;
}

.user-message {
  align-self: flex-end;
  background-color: #0084ff;
  color: white;
}

.bot-message {
  align-self: flex-start;
  background-color: #e0e0e0;
}

.input-section {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: #fff;
  border-top: 1px solid #ccc;
}

textarea {
  flex-grow: 1;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  background-color: #0084ff;
  color: white;
  cursor: pointer;
}
.el-dropdown-link{
  color: rgb(255, 255, 255);
  text-decoration: none;
  cursor: pointer;
  size:150px;
}
.upload-button {
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  background-color: #0084ff;
  color: white;
  cursor: pointer;
  margin-left: 10px;
}
.session-item {
    display: flex; /* 使用Flexbox布局 */
    align-items: center; /* 垂直居中 */
    justify-content: space-between; /* 内容两端对齐 */
    padding: 10px;
    border-bottom: 1px solid #ccc;
    cursor: pointer;
  }

  .delete-button {
    background: transparent; /* 透明背景 */
    border: none; /* 无边框 */
    color: rgb(107, 82, 82); /* 文字颜色 */
    font-size: 2.4rem; /* 字体大小 */
    cursor: pointer; /* 鼠标指针 */
    padding: 0; /* 移除默认padding */
  }

  .delete-button:hover {
    color: darkred; /* 鼠标悬停时的颜色 */
  }

  .session-item span {
    flex-grow: 1; /* 允许文本扩展以占据剩余空间 */
    white-space: nowrap; /* 不换行 */
    overflow: hidden; /* 隐藏超出的部分 */
    text-overflow: ellipsis; /* 显示省略号 */
  }
</style>
