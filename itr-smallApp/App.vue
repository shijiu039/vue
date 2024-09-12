<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			 this.checkLoginStatus();
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods:{
			checkLoginStatus() {
			      const currentTime = Date.now();
			      const lastLoginTime = uni.getStorageSync('lastLoginTime') || 0;
			      const timeLimit = 24 * 60 * 60 * 1000; // 假设时限是24小时，单位是毫秒
			
			      if (currentTime - lastLoginTime > timeLimit) {
			        // 如果超过时限，跳转到登录页面
			        uni.reLaunch({
			          url: '/pages/index/index'
			        });
			      } else {
			        // 如果没有超过时限，跳转到主页
					const user_id= uni.getStorageSync('user_id')
			        uni.reLaunch({
			          url: '/pages/index/home?user_id='+user_id
			        });
			      }
			    }
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
