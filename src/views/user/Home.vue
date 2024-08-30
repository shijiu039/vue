<template>
  <div class="app-container">
    <header class="header">
      Chat Application
    </header>
    <nav class="sidebar">
      <ul>
        <li v-for="(session, index) in sessions" :key="index" @click="selectSession(index)">
          {{ session.title }}
        </li>
        <li class="add-session" @click="addNewSession">+ New Session</li>
      </ul>
    </nav>
    <main class="main-container">
      <div class="chat-history" ref="chatHistory">
        <div v-for="(message, index) in currentSession.messages" :key="index" :class="['message', message.isUser ? 'user-message' : 'bot-message']">
          <img v-if="message.isImage" :src="message.text" alt="Uploaded Image" />
          <span v-else>{{ message.text }}</span>
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
import { defineComponent, ref, onMounted, nextTick, watchEffect } from 'vue';

export default defineComponent({
  setup() {
    const newMessage = ref('');
    const sessions = ref([
      {
        title: 'Welcome Session',
        messages: [
          { text: 'Hello! How can I assist you today?', isUser: false }
        ]
      }
    ]);
    const currentSessionIndex = ref(0);
    const currentSession = ref(sessions.value[currentSessionIndex.value]);
    const chatHistory = ref(null);

    const selectSession = (index: number) => {
      currentSessionIndex.value = index;
      currentSession.value = sessions.value[index];
      scrollToBottom();
    };

    const addNewSession = () => {
      const newSessionTitle = `Session ${sessions.value.length + 1}`;
      sessions.value.push({
        title: newSessionTitle,
        messages: []
      });
      selectSession(sessions.value.length - 1);
    };

    const sendMessage = () => {
      if (newMessage.value.trim()) {
        currentSession.value.messages.push({ text: newMessage.value, isUser: true });
        newMessage.value = ''; // Clear the input field
        setTimeout(() => {
          // Simulate a bot response after a delay
          currentSession.value.messages.push({ text: 'I am here to help. What do you need?', isUser: false });
        }, 1000);
      }
    };

    const uploadImage = (event: Event) => {
      const fileInput = event.target as HTMLInputElement;
      if (fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          currentSession.value.messages.push({ text: imageUrl, isImage: true, isUser: true });
          setTimeout(() => {
            // Simulate a system response after uploading an image
            currentSession.value.messages.push({ text: 'Thanks for the image. Let me take a look...', isUser: false });
          }, 1000);
          scrollToBottom();
        };
        reader.readAsDataURL(file);
      }
    };

    const scrollToBottom = () => {
      if (chatHistory.value) {
        chatHistory.value.scrollTop = chatHistory.value.scrollHeight;
      }
    };

    onMounted(() => {
      scrollToBottom();
    });

    watchEffect(() => {
      scrollToBottom();
    });

    return {
      newMessage,
      sessions,
      currentSession,
      sendMessage,
      selectSession,
      addNewSession,
      chatHistory,
      uploadImage
    };
  }
});
</script>

<style scoped>
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
  background-color: #333;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.sidebar {
  position: fixed;
  top: 60px; /* Below the header */
  left: 0;
  bottom: 0;
  width: 200px;
  background-color: #f0f0f0;
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

.upload-button {
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  background-color: #0084ff;
  color: white;
  cursor: pointer;
  margin-left: 10px;
}
</style>