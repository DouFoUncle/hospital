<!-- 首页导航的个人中心页面 -->
<template>
	<view class="me_body">
		<!-- 消息提示框 -->
		<view>
			<u-toast ref="uToast" />
		</view>
		<view class="me_head" v-if="!userInfo || !userInfo.name">
			<view class="me_info">
				<view class="me_head_img">
					<image src="../../static/img/person/default_head.jpeg" mode=""></image>
				</view>
				<view class="me_person_info" @click="userLogin">点击登录</view>
			</view>
		</view>
		<view class="me_head" v-if="userInfo && userInfo.name">
			<view class="me_info">
				<view class="me_head_img">
					<image :src="userInfo.headImg" mode=""></image>
				</view>
				<view  class="me_person_info">
					<text>{{userInfo.name}}</text>
				</view>
				<view  class="exit">
					<view @click="outLogin">退出登录</view>
				</view>
			</view>
		</view>
		<view class="me_content">
			<view @click="skipReserveVisit">
				<u-icon name="file-text" color="#5888FF" size="34" class="me_left_icon"></u-icon>
				<text>挂号记录</text>
				<u-icon name="arrow-right" color="#888" size="28" class="me_right_icon"></u-icon>
			</view>
			<view @click="skipTestingVisit">
				<u-icon name="calendar" color="#5888FF" size="34" class="me_left_icon"></u-icon>
				<text>核酸检测记录</text>
				<u-icon name="arrow-right" color="#888" size="28" class="me_right_icon"></u-icon>
			</view>
			<view @click="skipPersonAdminPage">
				<u-icon name="account-fill" color="#5888FF" size="34" class="me_left_icon"></u-icon>
				<text>就诊人管理</text>
				<u-icon name="arrow-right" color="#888" size="28" class="me_right_icon"></u-icon>
			</view>
			<view @click="callPhone">
				<u-icon name="question-circle" color="#5888FF" size="34" class="me_left_icon"></u-icon>
				<text>联系客服</text>
				<u-icon name="arrow-right" color="#888" size="28" class="me_right_icon"></u-icon>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: {}
			};
		},
		methods: {
			outLogin() {
				uni.setStorage({
					key: 'userInfo',
					data: {}
				})
				this.userInfo = {}
				getApp().globalData.globalUserToken = ''
				getApp().globalData.globalUserInfo = {}
			},
			/**
			 * 拨打客服电话
			 */
			async callPhone() {
				// 查询医院电话号码
				let res = await this.$myRequest({
					url: '/apply/hospital/selectHospitalInfo'
				})
				if(res.code == 1) {
					uni.makePhoneCall({
						phoneNumber: res.data.phone
					})
				}
			},
			// 跳转到就诊人管理
			skipPersonAdminPage() {
				if(!getApp().globalData.globalUserToken) {
					this.showLoginAlert();
					return;
				}
				uni.navigateTo({
					url: "../personAdmin/personAdmin"
				})
			},
			// 跳转到核酸检测预约记录
			skipTestingVisit() {
				if(!getApp().globalData.globalUserToken) {
					this.showLoginAlert();
					return;
				}
				uni.navigateTo({
					url: "../tesingVisit/tesingVisit"
				})
			},
			// 跳转到挂号记录
			skipReserveVisit() {
				if(!getApp().globalData.globalUserToken) {
					this.showLoginAlert();
					return;
				}
				uni.navigateTo({
					url: "../reserveVisit/reserveVisit"
				})
			},
			showLoginAlert() {
				// 弹出登录提示
				this.$refs.uToast.show({
					title: '请先登录！',
					type: 'warning'
				})
			},
			userLogin() {
				let that = this
				// 获取用户信息
				uni.getUserProfile({
				  desc: '登录',
				  success: function (infoRes) {
					// 设置用户信息用于发送给后台保存
					that.userInfo.headImg = infoRes.userInfo.avatarUrl
					that.userInfo.name = infoRes.userInfo.nickName
					if(that.userInfo.name) {
						uni.showLoading({
							title: '登录中'
						})
						// 调用登录
						uni.login({
							provider: "weixin",
							success: async (loginRes )=> {
								console.log(loginRes)
								if(loginRes.code) {
									// 获取OpenId
									let reqResult = await that.getOpenId(loginRes.code)
									that.userInfo.openId = reqResult.data.openid
									// 保存用户信息
									if(that.userInfo.openId) {
										let saveResult = await that.saveUserInfo(that.userInfo);
										that.userInfo = saveResult.data
										// 将用户信息缓存到storage中
										uni.setStorage({
											key: "userInfo",
											data: that.userInfo
										})
										getApp().globalData.globalUserToken = that.userInfo.token
										getApp().globalData.userInfo = that.data
										uni.hideLoading()
									}
								}
							}
						})
					}
				  }
				});
			},
			getOpenId(code) {
				return this.$myRequest({
					url: "/apply/wx/login",
					method: "POST",
					data: {
						"code": code
					}
				})
			},
			saveUserInfo(userInfo) {
				return this.$myRequest({
					url: "/apply/wx/insertOrUpdateUserInfo",
					method: "POST",
					data: userInfo
				})
			}
		},
		onLoad() {
			uni.getStorage({
			    key: 'userInfo',
			    success:  res => {
					getApp().globalData.globalUserInfo = res.data
					getApp().globalData.globalUserToken = res.data.token
					this.userInfo = getApp().globalData.globalUserInfo
			    }
			})
		}
	};
</script>

<style>
	.me_info {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding: 15px 0 15px 20px;
		background-color: #FFF;
	}
	.me_info .me_head_img image {
		width: 60px;
		height: 60px;
		border-radius: 50%;
	}
	.me_info .me_person_info {
		font-size: 18px;
		font-weight: 500;
		padding-left: 15px;
		width: 62%;
	}
	.me_info .exit {
		display: flex;
		justify-content: flex-end;
	}
	.me_content {
		background-color: #EEE;
	}
	.me_content>view {
		padding: 15px 0px;
		background-color: #FFF;
		border-bottom: 1px #EEE solid;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.me_content>view .me_left_icon {
		width: 6%;
		margin-left: 15px;
	}
	.me_content>view>text {
		width: 87%;
	}
	.me_content>view .me_right_icon {
		width: 7%;
	}
</style>
