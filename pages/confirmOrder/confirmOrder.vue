<!-- 确认订单页面 -->
<template>
	<view class="me_max">
		<!-- 消息提示框 -->
		<view>
			<u-toast ref="uToast" />
		</view>
		<view class="me_head">
			<view class="text">
				支付金额(元)
			</view>
			<view class="price">
				<u-icon name="rmb" color="#f29100" size="34"></u-icon>&nbsp;
				<view>{{orderInfo.orderPrice}}</view>
			</view>
		</view>
		<view class="me_content">
			<view class="order_info">
				<view>
					<view class="mark">就诊科室</view>
					<view>{{orderInfo.deptName}}</view>
				</view>
				<view>
					<view class="mark">医生名称</view>
					<view>{{orderInfo.doctorName}}</view>
				</view>
				<view>
					<view class="mark">就诊日期</view>
					<view>{{orderInfo.visitDate}}</view>
				</view>
				<view>
					<view class="mark">就诊时段</view>
					<view>{{orderInfo.visitStartTime}} ~ {{orderInfo.visitEndTime}}</view>
				</view>
				<view>
					<view class="mark">就诊人</view>
					<view>{{orderInfo.personName}}</view>
				</view>
				<view>
					<view class="mark">手机号</view>
					<view>{{orderInfo.personPhone}}</view>
				</view>
				<view>
					<view class="mark">身份证号</view>
					<view>{{orderInfo.personIdCardNum}}</view>
				</view>
			</view>
			<view class="button_group">
				<u-button type="success" @click="submitOrder">立即支付</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderId: '',
				orderInfo: ''
			}
		},
		methods: {
			// 点击立即支付按钮触发的事件
			submitOrder() {
				let that = this
				uni.showLoading({
					title: '正在支付...',
					success: () => {
						setTimeout(async function () {
							// 调用模拟支付接口，修改订单状态
							let res = await that.$myRequest({
								url: '/apply/payOrder/updatePayReserveOrder',
								method: 'POST',
								data: {
									orderId: that.orderId,
									token: getApp().globalData.globalUserToken
								}
							})
							if(res.code == 3) {
								uni.hideLoading();
								// 挂满了
								this.$refs.uToast.show({
									title: res.msg,
									type: 'warning',
									callback: () => {
										url: '../reserveVisit/reserveVisit'
									}
								})
								return;
							}
							if(res.code == 1) {
								uni.hideLoading();
								uni.showToast({
									title: '支付成功',
									success: () => {
										// 跳转到挂号记录页面
										setTimeout(() => {
											uni.reLaunch({
											    url: '../reserveVisit/reserveVisit'
											});
										}, 1500)
									}
								})
							}
							// 弹出支付成功
						}, 1500);
					}
				})
			},
			// 初始化查询数据
			async initSelectData() {
				let res = await this.$myRequest({
					url: '/apply/order/getReserveOrderByOrderId',
					method: 'GET',
					data: {
						token: getApp().globalData.globalUserToken,
						orderId: this.orderId
					}
				})
				if(res.code == 1) {
					this.orderInfo = res.data
				}
			}
		},
		onLoad(option) {
			this.orderId = option.orderId
			// 查询订单信息
			this.initSelectData()
		}
	}
</script>

<style lang="less">
	uni-page-body {
		height: 100%;
	}
	
	.me_max {
		padding: 10px;
		min-height: 100vh;
		background-color: #ecf5ff;
		color: #333;
	}
	
	.me_head {
		background-color: #FFF;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		border-radius: 5px;
		padding: 5px;
		>view {
			padding: 5px;
		}
		.price {
			font-size: 18px;
			color: #f29100;
			display: flex;
			align-items: center;
			
		}
	}
	.me_content {
		.order_info {
			margin: 12px 0;
			background-color: #FFF;
			border-radius: 5px;
			display: flex;
			flex-direction: column;
			width: 100%;
			>view {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 8px;
				color: #888;
				border-bottom: 1px solid #EEE;
				width: 100%;
				padding: 10px;
				.mark {
					color: #333;
				}
			}
		}
	}
</style>
