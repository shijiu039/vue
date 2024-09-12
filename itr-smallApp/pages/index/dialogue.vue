<template>
	<view class="chat">
    <!-- 顶部标题 -->
    <view class="topTabbar">
      <!-- 返回图标 -->
      <u-icon class="icon" name="arrow-left" size="20px" color="#000" @click="goback()"></u-icon>
      <!-- 标题 -->
      <view class="text">{{this.title}}</view>
    </view>
		<scroll-view  :style="{height: `${windowHeight-inputHeight - 180}rpx`}"
		id="scrollview"
		scroll-y="true" 
		:scroll-top="scrollTop"
		class="scroll-view"
		>
			<!-- 聊天主体 -->
			<view id="msglistview" class="chat-body">
				<!-- 聊天记录 -->
				<view v-for="(item,index) in msgList" :key="index">
					<!-- 自己发的消息 -->
					<view class="item self" v-if="item.userContent != ''" >
						<!-- 文字内容 -->
						<view class="content right">
						{{item.userContent}}
						</view>
						<!-- 头像 -->
						<image class="avatar" :src="this.img">
						</image>
					</view>
					
					<!-- 自己发的图片 -->
					<view class="item self" v-if="item.userImage != ''" >
						<!-- 文字内容 -->
						<view class="content right">
						<image :src="item.userImage" class="user_image"></image>
						</view>
						<!-- 头像 -->
						<image class="avatar" :src="this.img">
						</image>
					</view>
					<!-- 机器人发的消息 -->
					<view class="item Ai" v-if="item.botContent.length != 0">
						<!-- 头像 -->     
						<image class="avatar" src="/static/robot2.png">
						</image>
						<!-- 文字内容 -->
					<view class="content left">
					<view  v-for="(content, subIndex) in item.botContent" :key="subIndex">
							  {{ content }}
					</view>
					</view>
					</view>
					<view class="item Ai" v-if="item.botImage.length != 0">
						<!-- 头像 -->     
						<image class="avatar" src="/static/robot2.png">
						</image>
						<!-- 文字内容 -->
						<view class="content left">
						<image v-for="(imgSrc, imgIndex) in item.botImage" :key="imgIndex" :src="imgSrc" class="bot-image">
						</image>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<!-- 底部消息发送栏 -->
		<!-- 用来占位，防止聊天消息被发送框遮挡 -->
		<view class="chat-bottom" :style="{height: `${inputHeight}rpx`}">
			<view class="send-msg" :style="{bottom:`${keyboardHeight - 60}rpx`}">
        <view class="uni-textarea">
          <textarea v-model="chatMsg"
            maxlength="300"
            confirm-type="send"
            @confirm="handleSend"
            placeholder="快来聊天吧~"
            :show-confirm-bar="false"
            :adjust-position="false"
            @linechange="sendHeight"
            @focus="focus" @blur="blur"
           auto-height></textarea>
        </view>
				<button @click="handleSend" class="send-btn">发送</button>
			    <!-- 点击图片实现上传功能 -->
			    <image 
			      src="/static/photo-plus.png" 
			      mode="aspectFit" 
			      @click="uploadImage" 
			      class="upload-image"
			    />
			</view>
		</view>
	</view>
</template>
<script>
	import { ref, onMounted } from 'vue'
	import { onLoad } from '@dcloudio/uni-app';
	export default{
		data() {
			return {
				//键盘高度
				keyboardHeight:0,
				//底部消息发送高度
				bottomHeight: 0,
				//滚动距离
				scrollTop: 0,
				user_id:'',
				dialogue_id:'',
				img:'',
				imageUrl:'',
				type:'',
				title:'',
				//发送的消息
				chatMsg:"",
				msgList:[
					{
					    botContent: ["你好啊，很高兴你可以关注我，请问我有什么可以帮助你的吗？"],
					    userContent: "",
                        userImage:"",
						botImage:[],
					},
					{
					    botContent: [],
					    userContent: "你好呀，非常高兴认识你",
                        userImage:"",
						botImage:[],
					},
				]	
			}
		},
		updated(){
			//页面更新时调用聊天消息定位到最底部
			this.scrollToBottom();
		},
		computed: {
			windowHeight() {
			    return this.rpxTopx(uni.getSystemInfoSync().windowHeight)
			},
			// 键盘弹起来的高度+发送框高度
			inputHeight(){
				return this.bottomHeight+this.keyboardHeight
			}
		},
		onLoad(options){
			this.dialogue_id=options['dialogue_id']
			this.type=options['type']
			console.log('1111', this.dialogue_id);
			uni.request({
				url: 'http://127.0.0.1:5000/user/dialogue_info',
					method: 'POST',
					header: {
			  'content-type': 'application/x-www-form-urlencoded'
			 },
					data : {
						'dialogue_id':this.dialogue_id
					},
					success : (res) => {
						// uni.showModal({
						//   title: '提示',
						//   content: res.data.message
						// });
						this.user_id=res.data.data['user_id']
						this.title=res.data.data['title']
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
									// uni.showModal({
									//   title: '提示',
									//   content: res.data.message
									// });
									this.img=res.data.data['img_path']
									if(this.type==0){
										uni.request({
											url: 'http://127.0.0.1:5000/user/get_dialogue',
												method: 'POST',
												header: {
										  'content-type': 'application/x-www-form-urlencoded'
										 },
												data : {
													'user_id':this.user_id,
													'dialogue_id':this.dialogue_id
												},
												success : (res) => {
													// uni.showModal({
													//   title: '提示',
													//   content: res.data.data
													// });
													for(let i=0;i<res.data.data.length;i++){
													console.log(res.data.data)
													if(res.data.data[i]['type']==0){
														this.imageUrl = res.data.data[i]['question']
														let obj = {
															botContent:[],
															userContent: "",
															userImage:this.imageUrl,
															botImage:[]
														}
														this.imageUrl=''
														this.msgList.push(obj);
														this.scrollToBottom();
														let obj1 = {
															botContent:[],
															userContent: "",
															userImage:"",
															botImage:[]
														}							
														obj1.botContent.push(res.data.data[i]['result_1'])
														obj1.botContent.push(res.data.data[i]['result_2'])
														obj1.botContent.push(res.data.data[i]['result_3'])
														obj1.botContent.push(res.data.data[i]['result_4'])
														obj1.botContent.push(res.data.data[i]['result_5'])
														obj1.botContent.push(res.data.data[i]['result_6'])
														obj1.botContent.push(res.data.data[i]['result_7'])
														obj1.botContent.push(res.data.data[i]['result_8'])
														
														this.msgList.push(obj1);
														this.scrollToBottom()
													}
													else{
														this.chatMsg=res.data.data[i]['question']
														console.log("hhhhhhh:  "+res.data.data[i]['question'])
														let obj = {
															botContent:[],
															userContent: this.chatMsg,
															userImage:"",
															botImage:[]
														}
														this.msgList.push(obj);
														this.chatMsg=''
														this.scrollToBottom()
														let obj1 = {
															botContent:[],
															userContent: "",
															userImage:"",
															botImage:[]
														}
														obj1.botImage.push(res.data.data[i]['result_1'])
														obj1.botImage.push(res.data.data[i]['result_2'])
														obj1.botImage.push(res.data.data[i]['result_3'])
														obj1.botImage.push(res.data.data[i]['result_4'])
														obj1.botImage.push(res.data.data[i]['result_5'])
														obj1.botImage.push(res.data.data[i]['result_6'])
														obj1.botImage.push(res.data.data[i]['result_7'])
														obj1.botImage.push(res.data.data[i]['result_8'])
															
														this.msgList.push(obj1);	
														this.scrollToBottom()
													}
												}}
										});
									}
								}
						});
					}
			});
			
			
			
        uni.onKeyboardHeightChange(res => {
				//这里正常来讲代码直接写
				//this.keyboardHeight=this.rpxTopx(res.height)就行了
				//但是之前界面ui设计聊天框的高度有点高,为了不让键盘和聊天输入框之间距离差太大所以我改动了一下。
				this.keyboardHeight = this.rpxTopx(res.height)
				if(this.keyboardHeight<0)this.keyboardHeight = 0;
			})
		},
		onUnload(){
			// uni.offKeyboardHeightChange()
		},
		methods: {
      goback() {
        uni.switchTab({
          url: "/pages/tutorship/tutorship"
        })
      },
			focus(){
				this.scrollToBottom()
			},
			blur(){
				this.scrollToBottom()
			},
			// px转换成rpx
			rpxTopx(px){
				let deviceWidth = uni.getSystemInfoSync().windowWidth
				let rpx = ( 750 / deviceWidth ) * Number(px)
				return Math.floor(rpx)
			},
			// 监视聊天发送栏高度
			sendHeight(){
				setTimeout(()=>{
					let query = uni.createSelectorQuery();
					query.select('.send-msg').boundingClientRect()
					query.exec(res =>{
						this.bottomHeight = this.rpxTopx(res[0].height)
					})
				},10)
			},
			// 滚动至聊天底部
			scrollToBottom(e){
				setTimeout(()=>{
					let query = uni.createSelectorQuery().in(this);
					query.select('#scrollview').boundingClientRect();
					query.select('#msglistview').boundingClientRect();
					query.exec((res) =>{
						if(res[1].height > res[0].height){
							this.scrollTop = this.rpxTopx(res[1].height - res[0].height)
						}
					})
				},15)
			},
			//发送图片
			uploadImage () {
				var that = this
				uni.chooseImage({
					count: 1,           // 最多可以选择的图片张数，默认1
					sizeType: ['original', 'compressed'],              //original 原图，compressed 压缩图，默认二者都有
					sourceType: ['album', 'camera'],             //album 从相册选图，camera 使用相机，默认二者都有。如需直接开相机或直接选相册，请只使用一个选项
					success: function (res) {
						that.imageUrl = res.tempFilePaths
						let obj = {
							botContent:[],
							userContent: "",
							userImage:that.imageUrl,
							botImage:[]
						}
						that.msgList.push(obj);
						that.scrollToBottom();
						uni.uploadFile({
									url: 'http://127.0.0.1:5000/user/imagetotext', //图文转化接口
									filePath: res.tempFilePaths[0],
									name: 'image',
									formData: {
										'user_id': that.user_id,
										'dialogue_id':that.dialogue_id
									},
									success: (uploadFileRes) => {
										var reinfo=JSON.parse(uploadFileRes.data);
										
										let obj1 = {
											botContent:[],
											userContent: "",
											userImage:"",
											botImage:[]
										}
										for (let i = 0; i < reinfo.data.length; i++)
										{
											obj1.botContent.push(reinfo.data[i][0])
										}
										that.msgList.push(obj1);
										if(that.title=='未命名对话'){
										uni.request({
											// url: 'http://192.168.188.92:5000/user/verify',
												url: 'http://127.0.0.1:5000/user/update_title',
												method: 'POST',
												header: {
										  'content-type': 'application/x-www-form-urlencoded'
										 },
												data : {
													'dialogue_id':that.dialogue_id,
													'new_title':that.msgList[3].botContent[0].slice(0,10)
												},
												success : (res) => {
										
												}
										});
										that.title=that.msgList[3].botContent[0].slice(0,10);
										}
									}
								});
								that.imageUrl=''
								that.scrollToBottom()
			
					}
				});
			},
			// 发送消息
			handleSend() {
				//如果消息不为空
				if(!this.chatMsg||!/^\s+$/.test(this.chatMsg)){
					let obj = {
						botContent:[],
						userContent: this.chatMsg,
						userImage:"",
						botImage:[]
					}
					this.msgList.push(obj);
					this.scrollToBottom();
					uni.request({
						url: 'http://127.0.0.1:5000/user/texttoimage',
							method: 'POST',
							header: {
					  'content-type': 'application/x-www-form-urlencoded'
					 },
							data : {
								'user_id':this.user_id,
								'text':this.chatMsg,
								'dialogue_id':this.dialogue_id
							},
							success : (res) => {
								// uni.showModal({
								//   title: '提示',
								//   content: res.data.message
								// });
								console.log(res.data)
								let obj1 = {
									botContent:[],
									userContent: "",
									userImage:"",
									botImage:[]
								}
									for (let i = 0; i < res.data.data.length; i++)
									{
										obj1.botImage.push(res.data.data[i][0])
									}
								this.msgList.push(obj1);
							}
					});
					if(this.title=='未命名对话'){
					uni.request({
						// url: 'http://192.168.188.92:5000/user/verify',
							url: 'http://127.0.0.1:5000/user/update_title',
							method: 'POST',
							header: {
					  'content-type': 'application/x-www-form-urlencoded'
					 },
							data : {
								'dialogue_id':this.dialogue_id,
								'new_title':this.msgList[2].userContent.slice(0,10)
							},
							success : (res) => {
					
							}
					});
					this.title=this.msgList[2].userContent.slice(0,10);
					}
					this.chatMsg = '';
					this.scrollToBottom()
				}else {
					this.$modal.showToast('不能发送空白消息')
				}
			},
		}
	}
</script>
<style lang="scss" scoped>
	
	$chatContentbgc: #C2DCFF;
	$sendBtnbgc: #4F7DF5;
	
	view,button,text,input,textarea {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}
 
	/* 聊天消息 */
	.chat {

     .topTabbar {
          width: 100%;
          height: 90rpx;
          line-height: 90rpx;
          display: flex;
          // margin-top: 10rpx;
          justify-content: space-between;
      
          .icon {
            margin-left: 20rpx;
          }
      
          .text {
            margin: auto;
            font-size: 16px;
            font-weight: 700;
          }
      
          .button {
            width: 10%;
            margin: auto 20rpx auto 0rpx;
          }
        }
		.scroll-view {
			::-webkit-scrollbar {
					    display: none;
					    width: 0 !important;
					    height: 0 !important;
					    -webkit-appearance: none;
					    background: transparent;
					    color: transparent;
					  }
			
			// background-color: orange;
			background-color: #F6F6F6;
			
			.chat-body {
				display: flex;
				flex-direction: column;
				padding-top: 23rpx;
				// background-color:skyblue;
				
				.self {
					justify-content: flex-end;
				}
				.item {
					display: flex;
					padding: 23rpx 30rpx;
					// background-color: greenyellow;
 
					.right {
						background-color: $chatContentbgc;
					}
					.left {
						background-color: #FFFFFF;
					}
                    // 聊天消息的三角形
					.right::after {
						position: absolute;
						display: inline-block;
						content: '';
						width: 0;
						height: 0;
						left: 100%;
						top: 10px;
						border: 12rpx solid transparent;
						border-left: 12rpx solid $chatContentbgc;
					}
 
					.left::after {
						position: absolute;
						display: inline-block;
						content: '';
						width: 0;
						height: 0;
						top: 10px;
						right: 100%;
						border: 12rpx solid transparent;
						border-right: 12rpx solid #FFFFFF;
						
					}
					
					.user_image {
					    width: 210px; /* 设置固定的宽度 */
					    height: 150px; /* 设置固定的高度 */
					    object-fit: cover; /* 裁剪图片以填充容器 */
					}
					.bot-image {
					    width: 210px; /* 设置固定的宽度 */
					    height: 150px; /* 设置固定的高度 */
					    object-fit: cover; /* 裁剪图片以填充容器 */
					}
 
					.content {
						position: relative;
						max-width: 486rpx;
						border-radius: 8rpx;
						word-wrap: break-word;
						padding: 24rpx 24rpx;
						margin: 0 24rpx;
						border-radius: 5px;
						font-size: 32rpx;
						font-family: PingFang SC;
						font-weight: 500;
						color: #333333;
						line-height: 42rpx;
					}
 
					.avatar {
						display: flex;
						justify-content: center;
						width: 78rpx;
						height: 78rpx;
						background: $sendBtnbgc;
						border-radius: 50rpx;
						overflow: hidden;
						
						image {
							align-self: center;
						}
 
					}
				}
			}
		}
 
		/* 底部聊天发送栏 */
		.chat-bottom {
			width: 100%;
			height: 100rpx;
			background: #F4F5F7;
			transition: all 0.1s ease;
			
			.send-msg {
				display: flex;
				align-items: flex-end;
				padding: 16rpx 30rpx;
				width: 100%;
				min-height: 177rpx;
				position: fixed;
				bottom: 0;
				background: #fff;
				transition: all 0.1s ease;
			}
 
			.uni-textarea {
				padding-bottom: 70rpx;  
				textarea {
					width:475rpx;
					min-height: 75rpx;
					max-height: 500rpx;
					background: #f1f1f1;
					border-radius: 40rpx;
					font-size: 32rpx;
					font-family: PingFang SC;
					color: #333333;
					line-height: 74rpx;
					padding: 5rpx 8rpx;
          text-indent: 30rpx;
				}
			}
			
			
			.upload-image {
			    width: 30px; /* 图片宽度 */
			    height: 75rpx; /* 图片高度 */
				margin-left: 10px; /* 图片与按钮之间的间距 */
				margin-bottom: 76rpx;
			  }
            
			.send-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				margin-bottom: 76rpx;
				margin-left: 25rpx;
				width: 120rpx;
				height: 75rpx;
				background: #ed5a65;
				border-radius: 50rpx;
				font-size: 28rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #FFFFFF;
				line-height: 28rpx;
			}
		}
	}
</style>
