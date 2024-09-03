<template>
    <div class="fixed-layout">
      <div class="login-container">
        <img src="./public/latest.png" alt="Image"></img>
          <h1>管理员登录</h1>
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
          <el-button type="primary" @click="user">我不是管理员，返回</el-button>
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
    
    const login = async () => {
  // 验证用户输入的电子邮件地址和密码是否非空
  if (!usermail.value || !password.value) {
    this.$message({
      type: 'error',
      message: '请填写电子邮件地址和密码'
    });
    return;
  }

  // 发送POST请求到登录接口
  try {
    const response = await this.$http.post(`/administrator/login/${usermail.value}`, {
      password: password.value
    });
    // 处理响应
    if (response.status === 200) {
      // 登录成功
      this.$message({
        type: 'success',
        message: '登录成功!'
      });
      // 可以根据需要进行其他操作，例如跳转到主页
      router.push('/UserM'); // 登录成功后跳转到管理员主页
    } else {
      // 登录失败
      this.$message({
        type: 'error',
        message: '登录失败!'
      });
    }
  } catch (error) {
    // 处理错误
    console.error('登录失败:', error);
    this.$message({
      type: 'error',
      message: '登录失败!'
    });
  }}
  const register = async () =>{
    router.push('ARegister')
  }
  const user = async () =>{
    router.push('/')
  }
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