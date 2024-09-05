<template>
  <div class="fixed-layout">
    <div class="login-container">
        <img src="/public/Logo.png" alt="Description" style="width: 25%; height: auto;" />
        <h1>登录</h1>
      <div class="input-group">
        <label for="user_email">邮箱:</label>
        <el-input v-model="user_email" style="width: 340px" id="user_email" placeholder="请输入邮箱"></el-input>
      </div>
      <div class="input-group">
        <label for="v-code">验证码:</label>
        <div class="input-with-button">
          <el-input v-model="v_code" style="width: 235px" id="v_code" type="v_code" placeholder="请输入验证码" show-password></el-input>
          <a @click.prevent="getVerificationCode" class="get-code-btn">
            获取验证码</a>
        </div>

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
import { useAuthStore } from '@/stores/auth'; // 引入 Pinia store

const authStore = useAuthStore();

const user_email = ref('1669929153@qq.com');
const v_code = ref('');
const router = useRouter();

const login = async () => {
  // 登录逻辑
  console.log(user_email.value);
  console.log(v_code.value);
//下面的跳转代码开发管理员页面时测试用，全写完之后记得删

  // router.push('/home'); // 登录成功后跳转到主页}

  if (user_email.value === '') { // 确保使用正确的变量
    alert('请输入邮箱地址');
    return;
  }

  try {
    // 构造请求体
    const body = new URLSearchParams({
      'user_email': user_email.value,
      'v_code': v_code.value // 确保使用正确的变量
    }).toString();

    // 发送 POST 请求
    const response = await fetch('http://192.168.188.92:5000/user/login', {
      method: 'POST', // 指定请求方法
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded' // 设置请求头
      },
      body: body // 将表单数据作为请求体
    });

    if (!response.ok) { // 检查HTTP状态码是否为200-299之间的成功状态
      throw new Error('Network response was not ok');
    }

    const data = await response.json(); // 解析返回的JSON数据
    localStorage.setItem('userInfo', JSON.stringify(data));
    
    //下面代码测试用
    const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        data.value = JSON.parse(storedUserInfo);
        data.value.data.user_name=localStorage.setItem('token', JSON.stringify());
      }
      console.log(data.value.data);

//————————————————————————————————————————————————————————————————————————————————————

    if (data.code === 0) {
      console.log('Login successful:', data.message);
      alert(data.message);
      authStore.login(data.user); // 更新登录状态
      router.push('/home'); // 登录成功后跳转到主页
    } else {
      console.log('Login failed:', data.message);
      alert(data.message);
    }
  } catch (error) {
    alert('登录失败，请检查您的凭证');
    console.error('Login failed:', error);
    
    // 下面的跳转代码开发管理员页面时测试用，全写完之后记得删
    // router.push('/home'); // 登录成功后跳转到主页
  }
};
const register = () => 
{
  router.push('/register'); // 注册后跳转到注册页面
};

const admin = () => 
{
  router.push('/ALogin'); // 管理员登录
};
// 获取验证码的逻辑
const getVerificationCode = async () => {
  if (user_email.value === '') {
    alert('请输入邮箱地址');
    return;
  }

  try {
    // 创建URLSearchParams对象来构建请求体

    const body = new URLSearchParams({ 'user_email': user_email.value }).toString();

    const response = await fetch('http://192.168.188.92:5000/user/verify', {
      method: 'POST', // 指定请求方法
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded' // 设置请求头
      },
      
      body:body// 将FormData转换成字符串形式
    });

    if (!response.ok) { // 检查HTTP状态码是否为200-299之间的成功状态
      throw new Error('Network response was not ok');
    }

    const data = await response.json(); // 解析返回的JSON数据
    console.log('Verification code sent successfully:', data);
    // 处理发送验证码成功后的逻辑
  } catch (error) {
    alert('获取验证码失败');
    console.error('Verification code request failed:', error);
  }
};





</script>

<style scoped>
.input-with-button {
  display: flex;
  align-items: center;
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