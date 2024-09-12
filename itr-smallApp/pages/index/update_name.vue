<template>
	<view class="container">
	  	<form @submit="formSubmit" @reset="formReset">
	  		<tui-list-cell :hover="false">
	  			<view class="tui-line-cell">
	  				<view class="tui-title">更改名字：</view>
	  				<input placeholder-class="tui-phcolor" class="tui-input" name="mobile" placeholder='this.new_name' v-model="new_name"
	  					maxlength="50" type="text" />
	  			</view>				
			</tui-list-cell>
			<tui-footer copyright="好名字可以让别人更好的记住你"></tui-footer>
		</form>
	</view>
<!-- 	<view class="tui-btn-box">
	  			<tui-button class="tui-button-primary" @click="update_name" hover-class="tui-button-hover" formType="submit"
	  				type="green">Submit</tui-button>
	  		</view> -->
		<div class="button-group">
				  
		  <button @click="update_name" class="login-button">提交</button>
		   <tui-tips backgroundColor="#71C671" ref="toast"></tui-tips>
		</div>
</template>

<script>
	export default {
		onLoad(options){
		this.user_id = options['user_id'];
		this.new_name = options['user_name'];
		console.log('接收传值:', this.user_id,this.new_name);
		},
		data() {
			return {
				user_id:'',
				old_name:'',
				new_name:''
			}
		},
		methods: {
			update_name(){
				uni.request({
				    	url : 'http://127.0.0.1:5000/user/update_name',
				    	method : 'POST',
				    	header: {
				      'content-type': 'application/x-www-form-urlencoded'
				      },
				    	data : {
							'user_id':this.user_id,
							'new_username':this.new_name,
						},
				    	success : (res) => {
				    			let options = {
				    			 			msg: res.data.message,
				    			 			duration: 2000
				    			 		};
				    			 		//需等组件初始化完成，确认已获取到组件实例
				    			 		this.$refs.toast && this.$refs.toast.showTips(options);
								if (res.data.code === 0) { 
									uni.redirectTo({
										url:'/pages/index/PersonalPage?user_id=' + this.user_id
									});
				    		}
				    }
				});
			}
		}
	}
</script>

<style>
.container {
	padding: 20rpx 0 50rpx 0;
}
.tui-line-cell {
	width: 100%;
	box-sizing: border-box;
	display: flex;
	align-items: center;
}

.tui-title {
	line-height: 32rpx;
	min-width: 120rpx;
	flex-shrink: 0;
}

.tui-input {
	font-size: 32rpx;
	color: #333;
	padding-left: 20rpx;
	flex: 1;
	overflow: visible;
}

.tui-btn-box {
	padding: 0rpx 100rpx;
	box-sizing: border-box;
}

.tui-button-gray {
	margin-top: 30rpx;
}

.button-group button {
		padding: 6px 10px;
		border: none;
		border-radius: 4px;
		background-color: #4A708B;
		color: #fff;
		cursor: pointer;
		font-size: 16px;
		width: 80%;
		max-width: 250px;
	}

	.button-group button:hover {
		background-color: #607B8B;
	}
</style>
