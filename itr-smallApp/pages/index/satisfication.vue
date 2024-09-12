<template>
	  <view class="container">
	<view class="title">
	  <text>意见反馈</text>
	</view>
	<view class="content">
		<view class="section team-intro">
       <view class="section-title">
			<image src="../../static/logo.png"></image>
          <text>满意度</text>
        </view>
		</view>
	</view>  
	<tui-rate :size="30" :current="current" @change="change"></tui-rate>
	</view>
	<div class="button-group">
			  
	  <button @click="update" class="login-button">提交</button>
	<tui-tips backgroundColor="#71C671" ref="toast"></tui-tips>
	</div>

</template>

<script>
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app';
export default {
onLoad(options){
	this.user_id = options['user_id'];
	},
 data() {
   	return {
   		current:0,
		user_id:''
   	}
   },
   methods: {
   	change: function(e) {
   		this.current = e.index
   	},
	update(){
		uni.request({
		    	url : 'http://127.0.0.1:5000/user/satisfaction',
		    	method : 'POST',
		    	header: {
		      'content-type': 'application/x-www-form-urlencoded'
		      },
		    	data : {
					'user_id':this.user_id,
					'satisfaction':this.current
				},
		    	success : (res) => {
		    		let options = {
		    		 			msg: res.data.message,
		    		 			duration: 2000
		    		 		};
		    		 		//需等组件初始化完成，确认已获取到组件实例
		    		 		this.$refs.toast && this.$refs.toast.showTips(options);
		    		}
		});
	}
   }
};
</script>

<style>
.container {
  padding: 20px;
  display: flex;
  flex-direction: column;
}
.title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}
.section {
  margin-bottom: 30px;
}
.section-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

.section-content {
  font-size: 16px;
  line-height: 1.5;
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
		margin-top: 40px; /* 增加上边距 */
	}

	.button-group button:hover {
		background-color: #607B8B;
	}

</style>

