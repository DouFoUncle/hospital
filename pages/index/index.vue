<!-- 首页页面 -->
<template>
	<view class="body">
		<!-- 消息提示框 -->
		<view>
			<u-toast ref="uToast" />
		</view>
		<view class="head">
			<view class="text">
				运城市中心医院
			</view>
		</view>
		<view class="content">
			<view class="content_card" @click="skipHospitalInfo">
				<view>
					医院信息
				</view>
				<view>
					<image src="../../static/img/xinxi.png" class="content_card_img"></image>
				</view>
				<view class="card_foot_text">
					三级甲等，科室齐全
				</view>
			</view>
			<view class="content_card" @click="skipHospitalMap">
				<view>
					来院导航
				</view>
				<view>
					<image src="../../static/img/daohang.png" class="content_card_img"></image>
				</view>
				<view class="card_foot_text">
					轻轻松松，导航到院
				</view>
			</view>
			<view class="content_card" @click="skipDept">
				<view>
					预约挂号
				</view>
				<view>
					<image src="../../static/img/yiyuan.png" class="content_card_img"></image>
				</view>
				<view class="card_foot_text">
					快速预约，精准挂号
				</view>
			</view>
		</view>
		<view class="foot">
			<view>
				<view>更多服务</view>
				<view class="foot_card">
					<view @click="skipNoticePage">
						<view>
							<image src="../../static/img/index/notice.png"></image>
						</view>
						<text>公告信息</text>
					</view>
					<view @click="skipDept">
						<view>
							<image src="../../static/img/index/stethoscope.png"></image>
						</view>
						<text>预约挂号</text>
					</view>
					<view @click="skipReserve">
						<view>
							<image src="../../static/img/index/hospital-.png"></image>
						</view>
						<text>预约记录</text>
					</view>
					<view @click="skipReserveCheck">
						<view>
							<image src="../../static/img/index/lungs.png"></image>
						</view>
						<text>核酸检测</text>
					</view>
					<view @click="callPhone">
						<view>
							<image src="../../static/img/index/doctor.png"></image>
						</view>
						<text>联系客服</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {
			
		},
		methods: {
			/**
			 * 跳转到公告信息页面
			 */
			skipNoticePage() {
				uni.navigateTo({
					url: '../noticeList/noticeList'
				})
			},
			/**
			 * 跳转到医院信息页面
			 */
			skipHospitalInfo() {
				uni.navigateTo({
					url: '../hospitalInfo/hospitalInfo'
				})
			},
			/**
			 * 跳转到医院导航页面
			 */
			skipHospitalMap() {
				uni.navigateTo({
					url: '../hospitalMap/hospitalMap'
				})
			},
			/**
			 * @param {Object} e
			 * 跳转到选择科室页面
			 */
			skipDept: function(e) {
				if(!getApp().globalData.globalUserToken) {
					this.showLoginAlert();
					return;
				}
				uni.navigateTo({
					url: "../dept/dept"
				})
			},
			/**
			 * @param {Object} e
			 * 跳转到预约记录页面
			 */
			skipReserve: function(e) {
				if(!getApp().globalData.globalUserToken) {
					this.showLoginAlert();
					return;
				}
				uni.navigateTo({
					url: "../reserveVisit/reserveVisit"
				})
			},
			/**
			 * @param {Object} e
			 * 跳转到核酸检测预约页面
			 */
			skipReserveCheck: function(e) {
				if(!getApp().globalData.globalUserToken) {
					this.showLoginAlert();
					return;
				}
				uni.navigateTo({
					url: "../testing/testing"
				})
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
			showLoginAlert() {
				// 弹出登录提示
				this.$refs.uToast.show({
					title: '请在个人中心登录！',
					type: 'warning'
				})
			}
		},
		onShow() {
			if(!getApp().globalData.globalUserToken || !getApp().globalData.globalUserInfo) {
				uni.getStorage({
					key: 'userInfo',
					success:  res => {
						getApp().globalData.globalUserInfo = res.data
						getApp().globalData.globalUserToken = res.data.token
					}
				})
			}
		}
	}
</script>

<style>
	.body {
		background-color: #EEE;
	}
	.head {
		height: 280px;
		width: 100%;
		background-color: #007AFF;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.head .text {
		font-size: 20px;
		font-weight: 500;
		color: #EEE;
	}
	.content {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
		width: 100%;
		box-sizing: border-box;
		padding: 10px 0px;
		background-color: #FFF;
	}
	.content_card {
		border-radius: 5px;
		width: 29%;
		height: 120px;
		background-color: #0DC79B;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		color: #EEE;
		box-sizing: border-box;
		font-size: 14px;
	}
	.content_card view {
		margin-top: 5px;
	}
	.content_card:first-child {
		background-color: #4D80FF;
	}
	.content_card:nth-child(2) {
		background-color: #2AC6FB;
	}
	.content_card_img {
		width: 30px;
		height: 30px;
	}
	.card_foot_text {
		font-size: 10px;
	}
	.foot {
		background-color: #FFF;
		margin-top: 10px;
		padding: 5px 10px;
		color: #444;
		font-size: 14px;
	}
	.foot_card {
		margin-top: 10px;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		font-size: 12px;
	}
	.foot_card view {
		margin: 0px 5px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.foot_card view text {
		margin-top: 10px;
	}
	.foot_card view image {
		width: 20px;
		height: 20px;
	}
	.foot_card>view>view{
		width: 45px;
		height: 45px;
		border-radius: 50%;
		background-color: #EBF1FF;
	}
</style>
