<template>
  <div class="login-container">
  <view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">{{title}}</text>
		</view>
	</view>
    <div class="login-form">
      <div class="input-group">
        <label for="email">邮箱</label>
        <input type="email" id="email" v-model="email" placeholder="请输入邮箱">
      </div>
      <div class="input-group">
        <label for="verificationCode">验证码</label>
        <div class="verification-code">
          <input type="text" id="verificationCode" v-model="verificationCode" placeholder="请输入验证码">
          <button @click="getVerificationCode" :disabled="isGettingCode">{{ getCodeText }}</button>
        </div>
      </div>
      <div class="button-group">
		  
        <button @click="login" class="login-button">登录</button>
      </div>
    </div>
    <div class="register-link">
      <div @click="regi">注册</div>
    </div>
  </div>
  <tui-tips backgroundColor="#71C671" ref="toast"></tui-tips>
</template>

<script>
import { ref } from 'vue'  
export default {
  data() {
    return {
      email: '',
      verificationCode: '',
      isGettingCode: false,
      getCodeText: '获取验证码',
	  title: "欢迎！",
	  text:'',
	  image_stream:'',
	  user_id:''
    }
  },
  methods: {
    getVerificationCode() {
      // 这里调用后端接口获取验证码
      this.isGettingCode = true;
	  uni.request({
	  	// url: 'http://192.168.188.92:5000/user/verify',
		url: 'http://127.0.0.1:5000/user/verify',
		method: 'POST',
		header: {
        'content-type': 'application/x-www-form-urlencoded'
       },
		data : {
			'user_email':this.email,
		},
		success : (res) => {
			// uni.showModal({
			//   title: '提示',
			//   content: res.data.message
			// });
			let options = {
			 			msg: res.data.message,
			 			duration: 2000
			 		};
			 		//需等组件初始化完成，确认已获取到组件实例
			 		this.$refs.toast && this.$refs.toast.showTips(options);

		}
	  });
      let seconds = 60;
      this.getCodeText = `${seconds}秒后重试`;
      const timer = setInterval(() => {
        seconds--;
        this.getCodeText = `${seconds}秒后重试`;
        if (seconds === 0) {
          clearInterval(timer);
          this.getCodeText = '获取验证码';
          this.isGettingCode = false;
        }
      }, 1000);
    },
	regi(){
		uni.navigateTo({
			url:'/pages/index/register'
		});
	},
    login() {
      uni.request({
      	url : 'http://127.0.0.1:5000/user/login',
      	method : 'POST',
      	header: {
        'content-type': 'application/x-www-form-urlencoded'
        },
      	data : {
			'user_email':this.email,
			'v_code':this.verificationCode
		},
      	success : (res) => {
      			let options = {
      			 			msg: res.data.message,
      			 			duration: 2000
      			 		};
      			 		//需等组件初始化完成，确认已获取到组件实例
      			 		this.$refs.toast && this.$refs.toast.showTips(options);
				if (res.data.code === 0) { 	
					this.user_id=res.data.data['user_id']
					console.log("1111111111111111")
					console.log(this.user_id)
					const loginTime = Date.now(); // 获取当前时间戳
					uni.setStorageSync('lastLoginTime', loginTime);
					uni.setStorageSync('user_id', this.user_id);
					uni.redirectTo({
				url:'/pages/index/home?user_id='+ this.user_id
			    });
      		}
      }
  });
}

}
}
</script>

<style scoped>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	
	.logo {
		height: 400rpx;
		width: 400rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}
	
	.text-area {
		display: flex;
		justify-content: center;
	}
	
	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
	
	.login-container {
		width: 85%;
		max-width: 400px;
		margin:0px 10px 0px 10px;
		background-color: #fff;
		padding: 20px;
		box-shadow: 0 0 1 rgba(0, 0, 0, 0.1);
		border-radius: 8px;
	}

	.login-form {
		display: flex;
		flex-direction: column;
	}

	.input-group {
		margin-bottom: 20px;
	}

	.input-group label {
		margin-bottom: 10px;
		font-size: 16px;
	}

	.input-group input {
		padding: 10px;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 16px;
	}

	.button-group {
		display: flex;
		justify-content: space-between6
	}

	.button-group button {
		padding: 6px 25px;
		border: none;
		border-radius: 4px;
		background-color: #4A708B;
		color: #fff;
		cursor: pointer;
		font-size: 16px;
		width: 80%;
		max-width: 300px;
	}

	.button-group button:hover {
		background-color: #607B8B;
	}

	.register-link {
		text-align: center;
		margin-top: 20px;
	}

	.register-link a {
		color: #007bff;
		text-decoration: none;
	}

	.register-link a:hover {
		text-decoration: underline;
	}

	.verification-code {
	  display: flex;
	  justify-content: space-between;
	}

	.verification-code input {
	  flex: 1;
	  margin-right: 10px;
	}

	.verification-code button {
	  background-color: #C1C1C1;
	}

	.verification-code button:hover {
	  background-color: #ABABAB;
	}
</style>



