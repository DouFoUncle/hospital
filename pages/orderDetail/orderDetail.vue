<!-- 订单详情页面 -->
<template>
	<view class="me_max">
		<!-- 消息提示框 -->
		<view>
			<u-toast ref="uToast" />
		</view>
		<view class="me_content">
			<view class="me_head">
				<view class="me_icon">
					<u-icon name="checkmark-circle" size="70" color="#2b85e4" v-if="orderInfo.orderStatus =='0'"></u-icon>
					<u-icon name="close-circle" size="70" color="#888" v-if="orderInfo.orderStatus != '0'"></u-icon>
				</view>
				<view class="me_text">
					<view :class="orderInfo.orderStatus == '0' ? 'title' : 'title no_order'">
						{{orderInfo.orderStatus == '0' ? '预约挂号成功' : orderInfo.orderStatus == '1' ? '挂号已取消' : '挂号未支付'}}
					</view>
					<view class="order_date">{{orderInfo.createDate}}</view>
				</view>
			</view>
			<view class="me_date">
				<view class="title">就诊时间</view>
				<view class="info">
					<view>{{orderInfo.visitDate}}</view>
					<view>{{orderInfo.visitStartTime}} ~ {{orderInfo.visitEndTime}}</view>
				</view>
			</view>
			<view class="me_reserve_info">
				<view>
					<view class="title">就诊科室</view>
					<view>{{orderInfo.deptName}}</view>
				</view>
				<view>
					<view class="title">医生姓名</view>
					<view>{{orderInfo.doctorName}}</view>
				</view>
				<view>
					<view class="title">医生职称</view>
					<view>{{orderInfo.doctorPositionName}}</view>
				</view>
			</view>
			<view class="person_info">
				<view>
					<view class="title">就诊人</view>
					<view>{{orderInfo.personName}}</view>
				</view>
				<view>
					<view class="title">身份证号</view>
					<view>{{orderInfo.personIdCardNum}}</view>
				</view>
				<view>
					<view class="title">联系电话</view>
					<view>{{orderInfo.personPhone}}</view>
				</view>
			</view>
			<view class="order_info">
				<view>
					<view class="title">支付单号</view>
					<view>{{orderInfo.orderNum}}</view>
				</view>
				<view>
					<view class="title">支付金额</view>
					<view class="price">
						<u-icon name="rmb" color="#f29100" size="26"></u-icon>&nbsp;
						<view>{{orderInfo.orderPrice}}</view>
					</view>
				</view>
				<view>
					<view class="title">支付状态</view>
					<view>{{orderInfo.orderStatus == '0' ? '已支付' : orderInfo.orderStatus == '1' ? '已取消' : '未支付'}}</view>
				</view>
				<view>
					<view class="title">取消时间</view>
					<view>{{((!orderInfo.cencelDate || orderInfo.cencelDate == 'null') && orderInfo.orderStatus != 1) ? '--' : orderInfo.cancelDate}}</view>
				</view>
			</view>
			<view class="button_group" v-if="orderInfo.orderStatus == '0' && orderInfo.isCancel == 1">
				<u-button type="warning" @click="submitCancelInfo">取消预约</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderId: '',
				orderInfo: '',
			}
		},
		methods: {
			async initSelectData() {
				uni.showLoading({
					title: '加载中'
				})
				// 查询订单信息
				let res = await this.$myRequest({
					url: '/apply/order/getReserveOrderByOrderId',
					data: {
						token: getApp().globalData.globalUserToken,
						orderId: this.orderId,
						orderType: 0
					}
				})
				// 判断是否查询成功，从而赋值查询结果
				if (res.code == 1) {
					this.orderInfo = res.data
				}
				uni.hideLoading();
			},
			async submitCancelInfo() {
				// 调用取消方法
				let res = await this.$myRequest({
					url: '/apply/order/cancelOrderByOrderId?orderType=0',
					method: 'POST',
					data: {
						token: getApp().globalData.globalUserToken,
						orderId: this.orderId
					}
				})
				console.log(res)
				// 判断是否成功，成功刷新本页
				if(res.code == 1) {
					let that = this
					this.$refs.uToast.show({
						title: "操作成功！",
						type: 'primary',
						callback: () => {
							that.orderInfo = res.data
						}
					})
				}
			}
		},
		onLoad(option) {
			// 获取到订单ID
			this.orderId = option.orderId
			// 调用查询方法
			this.initSelectData()
		}
	}
</script>

<style lang="less">
	// 定义字体颜色
	@color: #2b85e4;
	@rmbColor: #f29100;

	uni-page-body {
		height: 100%;
	}

	.me_max {
		padding: 10px;
		min-height: 100vh;
		background-color: #ecf5ff;
		color: #555;
	}

	.me_head {
		background-color: #FFF;
		padding: 10px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		border-radius: 5px;
		margin-bottom: 10px;

		.me_text {
			margin-left: 10px;

			.title {
				color: @color;
				margin-bottom: 5px;
				font-size: 15px;
			}

			.title.no_order {
				color: #555;
				margin-bottom: 5px;
				font-size: 15px;
			}

			.order_date {
				font-size: 12px;
			}
		}
	}

	.me_date {
		background-color: #FFF;
		padding: 10px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		color: #888;
		border-radius: 5px;

		.title {
			color: #333;
		}

		.info {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: flex-end;
		}
	}

	.me_reserve_info,
	.person_info {
		margin-top: 10px;
		background-color: #FFF;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		color: #888;
		border-radius: 5px;

		>view {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			padding: 13px;
			border-bottom: 1px solid #EEE;

			.title {
				color: #333;
			}
		}

		>view:last-of-type {
			border-bottom: none;
		}
	}

	.order_info {
		margin-top: 10px;
		background-color: #FFF;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		color: #888;
		border-radius: 5px;

		>view {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			padding: 13px;
			border-bottom: 1px solid #EEE;

			.title {
				color: #333;
			}
		}

		>view:last-of-type {
			border-bottom: none;
		}

		.price {
			color: @rmbColor;
			display: flex;
			flex-direction: row;
		}
	}

	.button_group {
		margin-top: 15px;
	}
</style>
