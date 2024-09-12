<template>
  <div class="fixed-layout">
    <div class="login-container">
      <div class="clear-container">
        <img src="/Logo.png" style="width:25%;height: auto;" alt="Description" />
        <h1>管理员注册</h1>
        
        <div class="input-group">
          <label for="administrator_email">邮箱:</label>
          <el-input v-model="administrator_email" style="width: 340px" id="administrator_email" placeholder="请输入邮箱"></el-input>
        </div>
        <div class="input-group">
          <label for="administrator_name">用户名:</label>
          <el-input v-model="administrator_name" style="width: 340px" id="administrator_name" placeholder="请输入用户名"></el-input>
        </div>
        <div class="input-group">
          <label for="key">管理员令牌:</label>
          <el-input v-model="key" style="width: 340px" id="key" placeholder="请输入令牌"></el-input>
        </div>
        <div class="input-group">
          <label for="password">密码:</label>
          <el-input v-model="password" style="width: 340px" id="password" type="password" placeholder="请输入密码" show-password></el-input>
        </div>
        <div class="input-group">
          <label for="confirmPassword">确认密码:</label>
          <el-input v-model="confirmPassword" style="width: 340px" id="confirmPassword" type="password" placeholder="请输入确认密码" show-password></el-input>
        </div>
        <div class="input-group">
          <label for="v_code">验证码:</label>
          <el-input v-model="v_code" style="width: 235px" id="v_code" type="text" placeholder="请输入验证码" show-password></el-input>
          <a @click.prevent="getVerificationCode" class="get-code-btn">获取验证码</a>
        </div>
        <div class="button_group">
          <el-button type="primary" @click="register" style="width: 15%;">注册</el-button>
          <el-button type="primary" @click="back" style="width: 15%;">返回</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const administrator_email = ref('');
const administrator_name = ref('');
const password = ref('');
const confirmPassword = ref('');
const v_code = ref('');
const key = ref('');
const router = useRouter();

const register = async () => {
  console.log(administrator_email.value);
  console.log(administrator_name.value);
  console.log(password.value);

  if (administrator_email.value === '') {
    alert('请输入邮箱地址');
    return;
  }

  try {
    const body = new URLSearchParams({
      'administrator_email': administrator_email.value,
      'administrator_name': administrator_name.value,
      'v_code': v_code.value,
      'key': key.value,
      'password1': password.value,
      'password2': confirmPassword.value
    }).toString();

    const response = await fetch('http://192.168.188.92:5000/administrator/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    if (data.code === 0) {
      console.log('Register successfully:', data.message);
      alert('注册成功');
      router.push('/ALogin'); // 注册成功后跳转到登录页
    } else {
      console.log('Register failed:', data.message);
      alert(data.message);
    }
  } catch (error) {
    alert('注册失败');
    console.error('Register failed:', error);
  }
};

const getVerificationCode = async () => {
  if (administrator_email.value === '') {
    alert('请输入邮箱地址');
    return;
  }

  try {
    const body = new URLSearchParams({ 'email': administrator_email.value }).toString();

    const response = await fetch('http://192.168.188.92:5000/administrator/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('Verification code sent successfully:', data);
  } catch (error) {
    alert('获取验证码失败');
    console.error('Verification code request failed:', error);
  }
};

const back = async () => {
  router.push('/ALogin');
};
</script>

<style scoped>
.fixed-layout {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* 确保容器至少与视口一样高 */
  background-image: url('/admin_background.jpg'); /* 替换为你的图片URL */
  background-size: cover; /* 使图片覆盖整个容器 */
  background-position: center; /* 图片居中显示 */
  background-repeat: no-repeat; /* 确保图片不会重复 */
}

.login-container {
  position: relative; /* 确保伪元素能够相对于它定位 */
  background-color: rgba(255, 255, 255, 0.2); /* 半透明背景 */
  padding: 10px;
  border-radius: 30px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 800px;
  height: 800px;
  opacity: 0.8; /* 设置透明度 */
}

.clear-container {
  position: relative; /* 确保内部元素相对于它定位 */
  background-color: white; /* 白色背景 */
  padding: 10px;
  border-radius: 30px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  height: 100%;
  z-index: 1; /* 确保在背景之上 */
}

.clear-container img {
  width: 40%; /* 减小 Logo 的大小 */
  height: auto;
  margin-bottom: 20px; /* 增加 Logo 与标题之间的间距 */
}

.clear-container h1 {
  margin-bottom: 20px;
}

.input-group {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px; /* 在元素之间添加一些间距 */
  width: 100%; /* 设置宽度，使文本框能够正确对齐 */
  margin-bottom: 15px;
}

.input-group label {
  flex-shrink: 0; /* 防止标签在缩小窗口时收缩 */
  width: 80px; /* 给标签一个固定宽度，这样它们会保持一致 */
  text-align: right; /* 文本右对齐，以便于阅读 */
}

.el-input {
  width: calc(340px - 100px - 10px); /* 减去标签宽度和左右边距 */
}

.button_group {
  display: flex;
  justify-content: center; /* 调整按钮间距 */
  margin-top: 20px;
  width: 100%;
}

.button_group .el-button {
  width: 15%; /* 减小按钮宽度 */
}

.get-code-btn {
  margin-left: 10px;
  padding: 5px; /* 调整为合适的大小 */
  border: none;
  background-color: transparent;
  cursor: pointer;
  color: #409EFF; /* Element UI 主题色 */
  text-decoration: underline;
}

.get-code-btn:hover {
  color: #66b1ff; /* 鼠标悬停时的颜色 */
}
</style>