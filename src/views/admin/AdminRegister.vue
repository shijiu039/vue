<template>
    <div class="login-container">
      <img src="./Logo.png" alt="Description"></img>
      <h1>管理员注册</h1>
      
      <div class="input-group">
        <label for="usermail">邮箱:</label>
        <el-input v-model="usermail" style="width: 240px" id="usermail" placeholder="Please input"></el-input>
      </div>
      <div class="input-group">
        <label for="username">用户名:</label>
        <el-input v-model="username" style="width: 240px" id="username" placeholder="Please input"></el-input>
      </div>
      <div class="input-group">
        <label for="password">验证码:</label>
        <el-input v-model="password" style="width: 240px" id="password" type="password" placeholder="Please input password" show-password></el-input>
      </div>
      <el-button type="primary" @click="login">注册</el-button>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  const usermail = ref('');
  const username = ref('');
  const password = ref('');
  const router = useRouter();
  
  const login = () => {
    // 登录逻辑
    console.log(usermail.value);
    console.log(username.value);
    console.log(password.value);
    // 假设登录成功
    router.push('/'); // 登录成功后跳转到主页
  };
  </script>
  
  <style>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh; /* 使用视口高度单位 */
  gap: 10px; /* 在元素之间添加一些间距 */
}

.input-group {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px; /* 在元素之间添加一些间距 */
  width: 100%; /* 设置宽度，使文本框能够正确对齐 */
}

/* 对于标签，我们可以增加一点样式使其更加一致 */
.input-group label {
  flex-shrink: 0; /* 防止标签在缩小窗口时收缩 */
  width: 80px; /* 给标签一个固定宽度，这样它们会保持一致 */
  text-align: right; /* 文本右对齐，以便于阅读 */
}

/* 如果需要，可以添加其他样式来进一步美化登录表单 */
</style>


