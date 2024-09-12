<template>
<view class="page">

		<view class="list-item" v-for="(item, index) in dialogueRecords"
        :key="index" @click="connect(item)">
			<view class="avatar">
				<!-- <text class="round" v-if="item.read"></text> -->
				<image src="/static/emo.png" mode="widthFix"></image>
			</view>
			<view class="content">
				<view class="title">
					<text class="name">{{ item.title }}</text>
					<text class="time">{{ item.dialogue_time }}</text>
				</view>
				<view class="txt">图文检索的历史记录~</view>
			</view>
			<view class="delete-icon-wrapper">
			<image src="/static/delete.png" class="delete-icon" @click.stop="deleteDialogue(item)"></image>
		</view>
    </view>
	</view>
	<view>
	<tui-tabbar :current="current"  backdropFilter backgroundColor="#f8f8f8" :tabBar="tabBar" color="#777" selectedColor="#AC9157" @click="tabbarSwitch"></tui-tabbar>
	</view>
  <tui-tips backgroundColor="#71C671" ref="toast"></tui-tips>
  <tui-modal :show="modal" @click="confirmDelete" @cancel="hideModal" title="提示" content="确定删除该对话吗？"></tui-modal>
</template>



<script>

import { ref, onMounted } from 'vue'  
import { onLoad } from '@dcloudio/uni-app';

export default { 
	onLoad(options){
	this.user_id = options['user_id'];
	console.log('接收传值:', this.user_id);
	this.loadData(); // 初始加载数据
  },
  data() {
   	return {
		modal: false,
		currentDialogId:'',
   		current:0,
		user_id:'',
		dialogueRecords:[],
		type:'',
		dialogue_id:'',
			tabBar: [
				{
					pagePath: '/pages/index/home',
					text: '主页',
					iconPath: '/static/home.png',
					selectedIconPath: '/static/home.png',
					type:1
				},
				{
					pagePath: '/pages/index/dialogue',
					text: '新建对话',
					iconPath: '/static/add.png',
					hump: true,
					selectedIconPath: '/static/add.png',
					type:2
				},
				{
					pagePath: '/pages/index/PersonalPage',
					text: '我的',
					iconPath: '/static/my.png',
					selectedIconPath: '/static/my.png',
					// num: 2,
					// isDot: true,
					// verify: true,
					type:2
				}
			]
   	}
   },
    onShow() {
       this.loadData(); // 页面显示时重新获取数据
    },
   methods: {
	loadData(){
		uni.request({
			url: 'http://127.0.0.1:5000/user/dialoguelist',
				method: 'POST',
				header: {
		  'content-type': 'application/x-www-form-urlencoded'
		 },
				data : {
					'user_id':this.user_id,
				},
				success : (res) => {
					this.dialogueRecords=res.data.data
				}
		});
	},
	showModal() {
		this.modal = true;
	},
	//隐藏组件
	hideModal() {
		this.modal = false;
	},
	deleteDialogue(item){
		this.currentDialogId = item.dialogue_id; // 保存当前要删除的对话ID
		this.showModal()
		
	},
	confirmDelete(e) {
	      // 用户点击确定，发送请求删除对话
		  let index = e.index;
		  if (index === 1){
	      uni.request({
	        url: 'http://127.0.0.1:5000/user/deletedialogue',
	        method: 'POST',
	        header: {
	          'content-type': 'application/x-www-form-urlencoded'
	        },
	        data: {
	          'dialogue_id': this.currentDialogId
	        },
	        success: (res) => {
	          let options = {
	            msg: res.data.message,
	            duration: 2000
	          };
	          // 显示提示信息
	          this.$refs.toast && this.$refs.toast.showTips(options);
	          this.loadData(); // 重新加载数据
	        },
	        fail: () => {
	          // 请求失败的处理
	          uni.showToast({
	            title: '请求失败，请重试',
	            icon: 'none'
	          });
	        }
	      });
		  }
	      this.hideModal();
	    },
	 tabbarSwitch(e) {
		   	this.current = e.index;
            const item = this.tabBar[e.index];
   		    if (item.type === 2) { // 如果type为1，则跳转
			   if(item.text==='我的'){
				   uni.redirectTo({url:item.pagePath+'?user_id='+this.user_id});
			   }else{
			uni.request({
				url: 'http://127.0.0.1:5000/user/new_dialogue',
					method: 'POST',
					header: {
			  'content-type': 'application/x-www-form-urlencoded'
			 },
					data : {
						'user_id':this.user_id,
						'title':"未命名对话"
					},
					success : (res) => {
						this.dialogue_id = res.data.data['dialogue_id']
						uni.navigateTo({
   		        url: item.pagePath+'?dialogue_id='+this.dialogue_id+'&type=1'
   		      });
					}
			});

			  }
   		    }

   		  },
		connect(item) {
						uni.navigateTo({
							url: '/pages/index/dialogue?dialogue_id='+item.dialogue_id+'&type=0'
						})
					}
   	}
		}

</script>

<style lang="scss" scoped>
	.delete-icon-wrapper {
	  display: flex;
	  align-items: center; /* 垂直居中删除图标 */
	}
	.delete-icon {
	  width: 19px; /* 根据需要调整大小 */
	  height: 19px; /* 根据需要调整大小 */
	  margin-left: 10px;
	  cursor: pointer; /* 显示为指针形状，提示可点击 */
	}
.page {
		padding: 0 32rpx;
		padding-bottom: 100rpx;
		color: #333;
	}
 
	.list-item {
		display: flex;
		padding: 30rpx 0;
		border-bottom: 1px solid #ccced3;
 
		.avatar {
			width: 90rpx;
			height: 90rpx;
			border-radius: 10rpx;
			margin-right: 20rpx;
			position: relative;
 
			.round {
				position: absolute;
				width: 14rpx;
				height: 14rpx;
				border-radius: 50%;
				background: #ef5656;
				top: -4rpx;
				right: -4rpx;
				z-index: 1;
			}
 
			image {
				width: 100%;
				height: 100%;
				border-radius: 10rpx;
			}
		}
		
		
 
		.content {
			flex: 1;
 
			.title {
				display: flex;
				justify-content: space-between;
 
				.name {
					font-weight: bold;
				}
 
				.time {
					color: #999;
					font-size: 24rpx;
				}
			}
 
			.txt {
				margin-top: 10rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				-webkit-box-orient: vertical;
				text-align: left;
				color: #999;
				font-size: 26rpx;
			}
		}
	}


/* .time {
  font-size: 10px; 
  color: #888; 
  margin-left: auto; 
}
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
}


.floating-button {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #42b983;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chat-list {
  flex-grow: 1;
  padding: 10px;
}

.tab-bar {
  display: flex;
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #fff;
  border-top: 1px solid #ccc;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 10px;
} */
</style>