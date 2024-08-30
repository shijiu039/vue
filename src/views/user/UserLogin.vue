<template>
  <div class="fixed-layout">
    <div class="login-container">
      <img src="./public/Logo.png" alt="Description"></img>
        <h1>登录</h1>
        <div class="input-group">
        <label for="usermail">邮箱:</label>
        <el-input v-model="usermail" style="width: 240px" id="usermail" placeholder="Please input"></el-input>
      </div>
      <div class="input-group">
          <label for="password">密码:</label>
          <el-input v-model="password" style="width: 240px" id="password" type="password" placeholder="Please input password" show-password></el-input>
      </div>
      <div class="button_group">
        <el-button type="primary" @click="login">登录</el-button>
        <el-button type="primary" @click="register">注册</el-button>
        <el-button type="primary" @click="admin">我是管理员</el-button>
      </div>
    </div>
  </div>
</template>
  
<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  const usermail = ref('');
  const password = ref('');
  const router = useRouter();
  
  const login = () => {
    // 登录逻辑
    console.log(usermail.value);
    console.log(password.value);
    // 假设登录成功
    router.push('/home'); // 登录成功后跳转到主页
  }; 
  const register = () => {
    router.push('/register'); // 登录成功后跳转到主页
  };
  const admin = () => {
    router.push('/ALogin'); // 登录成功后跳转到主页
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
    align-items: center;
    gap: 10px; /* 在元素之间添加一些间距 */
  }
  .button-group {
    display: flex;
    align-items: center;
    gap: 10px; /* 在元素之间添加一些间距 */
  }
  /* 如果需要，可以添加其他样式来进一步美化登录表单 */
</style>