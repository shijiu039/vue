<template>
 	<view class="wrapper">
 		<!-- 个人资料 -->
 		<view>
 			<view class="top">
 				<view class="center">
 					<view class="center_top">
 						<view class="center_img" >
 							<!-- 这里放自己的静态头像 -->
 							<!-- <image src="/static/logo.png"></image> -->
							<image class="rank_icon" :src="this.imageUrl" />
 							<!-- <open-data type="userAvatarUrl" class="user_head"></open-data> -->
 						</view>
 						<view class="center_info" >
 							<view class="center_name">
 								<!-- 这里放自己的名称和邮箱 -->
 								<view>{{this.user_name}}</view>
								<view class="vip_text">
									<text>{{this.email}}普通会员</text>
								</view> 							
 								

 							</view>

 						</view>
 					</view>
 				</view>
 			</view>
 		</view>
		<view>
			<tui-divider width="80%" gradual backgroundColor="#00000000">功能列表</tui-divider>
		</view>

		<tui-list-view color="#777">
			<tui-list-cell @click="navigateToUpdateName" arrow>
				修改昵称
			</tui-list-cell>
			<tui-list-cell @click="getImg" arrow>
				修改头像
			</tui-list-cell>
			<tui-list-cell @click="satisfy" arrow>
				意见反馈
			</tui-list-cell>
			<tui-list-cell @click="aboutus" arrow>
				关于我们
			</tui-list-cell>
			<tui-list-cell @click="outlogin" arrow>
				退出登录
			</tui-list-cell>
		</tui-list-view>
		  <tui-modal :show="modal" @click="confirmDelete" @cancel="hideModal" title="提示" content="确定退出吗？"></tui-modal>

<view>
	<tui-tabbar :current="current"  backdropFilter backgroundColor="#f8f8f8" :tabBar="tabBar" color="#777" selectedColor="#AC9157" @click="tabbarSwitch"></tui-tabbar>
	</view>
 	</view>
 </template>
 
 <script>
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app';
 	export default {
		onLoad(options){
			this.user_id = options['user_id'];
			    console.log('接收传值:', this.user_id);
			uni.request({
				url: 'http://127.0.0.1:5000/user/user_info',
					method: 'POST',
					header: {
			  'content-type': 'application/x-www-form-urlencoded'
			 },
					data : {
						'user_id':this.user_id,
					},
					success : (res) => {
						
						this.user_name=res.data.data['user_name']
						this.email=res.data.data['email']
						this.imageUrl=res.data.data['img_path']
					}
			});
		},
 		data() {
 		 	return {
				modal: false,
 		 		current:2,
				user_id:'',
				user_name:'',
				email:'',
				imageUrl:'',
 		 		tabBar: [
 		 			{
 		 				pagePath: '/pages/index/home',
 		 				text: '主页',
 		 				iconPath: '/static/home.png',
 		 				selectedIconPath: '/static/home.png',
 		 				type:2
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
 		 				type:1
 		 			}
 		 		]
 		 	}
 		 },
 		 methods: {
			showModal() {
				this.modal = true;
			},
			//隐藏组件
			hideModal() {
				this.modal = false;
			},
			confirmDelete(e) {
			      // 用户点击确定，发送请求删除对话
				  let index = e.index;
				  if (index === 1){
			      uni.removeStorageSync('user_id')
			      uni.removeStorageSync('lastLoginTime')
			      uni.redirectTo({
			      	url: "/pages/index/index"
			      });	
			        }
			      this.hideModal();
			    },
			outlogin(){
            this.showModal()
			},
			satisfy(){
			uni.navigateTo({
				url: "/pages/index/satisfication?user_id="+this.user_id
			});	
			},
			aboutus(){
				uni.navigateTo({
					url: "/pages/index/about"
				});
			},
			getImg () {
				var that = this
				uni.chooseImage({
					count: 1,           // 最多可以选择的图片张数，默认9
					sizeType: ['original', 'compressed'],              //original 原图，compressed 压缩图，默认二者都有
					sourceType: ['album', 'camera'],             //album 从相册选图，camera 使用相机，默认二者都有。如需直接开相机或直接选相册，请只使用一个选项
					success: function (res) {
						console.log("哈哈哈哈哈哈")
						console.log(JSON.stringify(res.tempFilePaths));
						that.imageUrl = res.tempFilePaths
						console.log(that.user_id)
						uni.uploadFile({
									url: 'http://127.0.0.1:5000/user/update_img', //仅为示例，非真实的接口地址
									filePath: res.tempFilePaths[0],
									name: 'img_path',
									formData: {
										'user_id': that.user_id
									},
									success: (uploadFileRes) => {
										console.log(uploadFileRes.data);
									}
								});

					}
				});
			},
		tabbarSwitch(e) {
					const item = this.tabBar[e.index];
					if (item.type === 2) { // 如果type为1，则跳转
					   if(item.text==='主页'){
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
							}
					});
					  uni.navigateTo({
						url: item.pagePath+'?dialogue_id='+this.dialogue_id+'&type=1'
					  });
					  }
					}
					console.log(this.user_id)
					this.current = e.index;
				  },
			navigateToUpdateName() {
			  // 确保 user_id 和 user_name 已经定义
			  if (this.user_id && this.user_name) {
			    uni.navigateTo({
			      url: '/pages/index/update_name?user_id=' + this.user_id + '&user_name=' + this.user_name
			    });
			  } else {
			    console.error('user_id or user_name is not defined');
			  }
			},
			chooseImage() {
			      uni.chooseImage({
			        count: 1, // 默认9，设置成1表示单选
			        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
			        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
			        success: (res) => {
			          this.tempFilePaths = res.tempFilePaths;
			          this.avatarUrl = res.tempFilePaths[0]; // 预览第一张图片
			          // 调用上传图片的函数
			          this.uploadImage(res.tempFilePaths[0]);
			        }
			    });
			},
			navigateToUpdateImg(){
				
			}
 	}
	}
 </script>
 
 <style scoped lang="scss">
 	Page {
 		font-size: 14px;
 	}
 
 	.top {
 		width: 100%;
 		height: 130px;
 		background: #FAFAD2		;
 		// background: #2979ff;
 		padding-top: 15px;
 		position: relative;
 	}
 
 	.center {
 		width: 95%;
 		height: 100px;
 		background: white;
 		display: flex;
 		flex-direction: column;
 		margin: 0 auto;
 		border-radius: 5px;
 	}
 
 	.center_top {
 		display: flex;
 		flex-direction: row;
 		width: 80%;
 		height: 80px;
 		margin: 0 auto;
 		margin-top: 20rpx;
 		border-bottom: 1px solid #EEEEEE;
 	}
 
 	.center_img {
 		width: 66px;
 		height: 66px;
 		border-radius: 50%;
 		overflow: hidden;
 	}
 
 	.center_img image {
 		width: 100%;
 		height: 100%;
 		border-radius: 50%;
 	}
 
 	.center_img .user_head {
 		width: 100%;
 		height: 100%;
 	}
 
 	.center_info {
 		display: flex;
 		flex-direction: column;
 		margin-top: 35rpx;
 		margin-left: 30px;
 	}
 
 	.center_name {
 		font-size: 18px;
 	}
 
 	.center_phone {
 		color: #BEBEBE;
 	}
 
 
 	.center_rank {
 		width: 50%;
 		height: 35px;
 		display: flex;
 		flex-direction: row;
 	}
 
 	.rank_text {
 		height: 35px;
 		line-height: 35px;
 		margin-left: 10rpx;
 		color: #AAAAAA;
 	}
 
 	.center_vip image {
 		width: 25px;
 		height: 25px;
 		margin-top: 15rpx;
 	}
 
 	.vip_icon {
 		width: 25px;
 		height: 25px;
 		margin-top: -10rpx;
 	}
 
 	.vip_text {
 		// margin-top: -55rpx;
 		// margin-left: 50rpx;
		font-size: 12px;
 		color: #AAAAAA;
 	}
 
 	.center_rank image {
 		width: 35px;
 		height: 35px;
 	}
 
 	.center_score {
 		width: 50%;
 		height: 35px;
 		display: flex;
 		flex-direction: row;
 	}
 
 	.center_score image {
 		width: 35px;
 		height: 35px;
 	}
 
 	.gif-wave {
 		position: absolute;
 		width: 100%;
 		bottom: 0;
 		left: 0;
 		z-index: 99;
 		mix-blend-mode: screen;
 		height: 100rpx;
 	}
 
 	.wrapper {
 		position: absolute;
 		top: 0;
 		bottom: 0;
 		width: 100%;
 		background-color: #F4F4F4;
 	}
 
 	.profile {
 		height: 375rpx;
 		background-color: #ea4451;
 		display: flex;
 		justify-content: center;
 		align-items: center;
 
 		.meta {
 			.avatar {
 				display: block;
 				width: 140rpx;
 				height: 140rpx;
 				border-radius: 50%;
 				border: 2rpx solid #fff;
 				overflow: hidden;
 			}
 
 			.nickname {
 				display: block;
 				text-align: center;
 				margin-top: 20rpx;
 				font-size: 30rpx;
 				color: #fff;
 			}
 		}
 	}
 
 	.count {
 		display: flex;
 		margin: 0 20rpx;
 		height: 120rpx;
 		text-align: center;
 		border-radius: 4rpx;
 		background-color: #fff;
 
 		position: relative;
 		top: 10rpx;
 
 		.cell {
 			margin-top: 10rpx;
 			flex: 1;
 			padding-top: 20rpx;
 			font-size: 27rpx;
 			color: #333;
 		}
 
 		text {
 			display: block;
 			font-size: 24rpx;
 		}
 	}
 
 	.orders {
 		margin: 20rpx 20rpx 0 20rpx;
 		padding: 40rpx 0;
 		background-color: #fff;
 		border-radius: 4rpx;
 
 		.title {
 			padding-left: 20rpx;
 			font-size: 30rpx;
 			color: #333;
 			padding-bottom: 20rpx;
 			border-bottom: 1rpx solid #eee;
 			margin-top: -30rpx;
 		}
 
 		.sorts {
 			padding-top: 30rpx;
 			text-align: center;
 			display: flex;
 		}
 
 		[class*="icon-"] {
 			flex: 1;
 			font-size: 24rpx;
 
 			&::before {
 				display: block;
 				font-size: 48rpx;
 				margin-bottom: 8rpx;
 				color: #ea4451;
 			}
 		}
 	}
 
 	.address {
 		line-height: 1;
 		background-color: #fff;
 		font-size: 30rpx;
 		padding: 25rpx 0 25rpx 20rpx;
 		margin: 10rpx 20rpx;
 		color: #333;
 		border-radius: 4rpx;
 	}
 
 	.extra {
 		margin: 10rpx 20rpx;
 		background-color: #fff;
 		border-radius: 4rpx;
 
 		.item {
 			line-height: 1;
 			padding: 25rpx 0 25rpx 20rpx;
 			border-bottom: 1rpx solid #eee;
 			font-size: 30rpx;
 			color: #333;
 		}
 
 		button {
 			text-align: left;
 			background-color: #fff;
 
 			&::after {
 				border: none;
 				border-radius: 0;
 			}
 		}
 	}
 
 	.icon-arrow {
 		position: relative;
 
 		&::before {
 			position: absolute;
 			top: 50%;
 			right: 20rpx;
 			transform: translateY(-50%);
 		}
 	}
 </style>
 
 


