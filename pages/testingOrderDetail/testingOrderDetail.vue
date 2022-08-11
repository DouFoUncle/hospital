<!-- 核酸检测订单详情页面 -->
<template>
	<view class="me_max">
		<!-- 消息提示框 -->
		<view>
			<u-toast ref="uToast" />
		</view>
		<view class="me_head">
			<view class="me_icon">
				<u-icon name="checkmark-circle" size="70" color="#2b85e4" v-if="orderInfo.orderStatus =='0'"></u-icon>
				<u-icon name="close-circle" size="70" color="#888" v-if="orderInfo.orderStatus != '0'"></u-icon>
			</view>
			<view class="me_text">
				<view :class="orderInfo.orderStatus == '0' ? 'title' : 'title no_order'">
					{{orderInfo.orderStatus == '0' ? '预约成功' : orderInfo.orderStatus == '1' ? '预约已取消' : '预约未支付'}}
				</view>
				<view class="order_date">{{orderInfo.createDate}}</view>
			</view>
		</view>
		<view class="me_order_info">
			<view class="me_order_detail">
				<view class="content">
					<view>
						<view class="mark">订单号</view>
						<view>{{orderInfo.orderNum}}</view>
					</view>
					<view>
						<view class="mark">支付时间</view>
						<view>{{orderInfo.payDate}}</view>
					</view>
					<view>
						<view class="mark">订单状态</view>
						<view>{{orderInfo.orderStatus == '0' ? '已支付' : orderInfo.orderStatus == '1' ? '已取消' : '未支付'}}</view>
					</view>
					<view>
						<view class="mark">取消时间</view>
						<view>--</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="me_person_info">
			<view class="content">
				<view>
					<view class="mark">就诊人姓名</view>
					<view>{{orderInfo.personName}}</view>
				</view>
				<view>
					<view class="mark">身份证号</view>
					<view>{{orderInfo.personIdCardNum}}</view>
				</view>
				<view>
					<view class="mark">联系电话</view>
					<view>{{orderInfo.personPhone}}</view>
				</view>
			</view>
		</view>
		
		<view class="me_testing_price">
			<view class="content">
				<view>
					<view class="mark">预约到院日期</view>
					<view>{{orderInfo.getToDate}}</view>
				</view>
				<view>
					<view class="mark">预约类型</view>
					<view>{{orderInfo.checkType}}</view>
				</view>
				<view>
					<view class="mark">预约金额</view>
					<view class="price">¥{{orderInfo.orderPrice}}</view>
				</view>
			</view>
		</view>
		
		<view class="button_group" v-if="orderInfo.orderStatus == '0' && orderInfo.isCancel == 1">
			<u-button type="warning" @click="submitCancelInfo">取消预约</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderInfo: '',
				orderId: '',
			}
		},
		methods: {
			async initSelectData() {
				// 调用查询方法查询订单详情
				let res = await this.$myRequest({
					url: '/apply/order/getTestingOrderDetail',
					data: {
						token: getApp().globalData.globalUserToken,
						orderId: this.orderId,
						orderType: 1
					}
				})
				// 判断查询结果
				if(res.code == 1) {
					this.orderInfo = res.data
				}
			},
			async submitCancelInfo() {
				// 调用取消方法
				let res = await this.$myRequest({
					url: '/apply/order/cancelOrderByOrderId',
					method: 'POST',
					data: {
						token: getApp().globalData.globalUserToken,
						orderId: this.orderId
					}
				})
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
			this.orderId = option.orderId
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
		color: #333;
		font-size: 12px;
	}
	
	.me_head {
		background-color: #FFF;
		padding: 10px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		border-radius: 5px;
		.me_text {
			margin-left: 10px;
			.title {
				color: @color;
				margin-bottom: 5px;
				font-size: 15px;
			}
			.title.no_order {
				color: #555;
			}
			.order_date {
				font-size: 12px;
			}
		}
	}
	
	.me_person_info, .me_testing_price, .me_order_info {
		background-color: #FFF;
		display: flex;
		flex-direction: column;
		color: #888;
		margin-top: 15px;
		border-radius: 5px;
		.content {
			display: flex;
			flex-direction: column;
			>view {
				border-bottom: 1px solid #EEE;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				padding: 10px;
				.mark {
					color: #333;
				}
				.price {
					color: @rmbColor;
					display: flex;
					flex-direction: row;
				}
			}
		}
	}
	
	.button_group {
		margin-top: 15px;
	}

</style>
