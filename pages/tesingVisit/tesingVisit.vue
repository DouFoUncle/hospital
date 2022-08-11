<!-- 核酸检测预约记录 -->
<template>
	<view class="me_max">
		<view class="me_content">
			<view v-if="!orderList || orderList.length <= 0" class="me_right_empty">
				<u-empty text="暂无信息…" mode="list"></u-empty>
			</view>
			<view @click="skipTestingOrderDetail(item.orderId)" v-for="item in orderList" :key="item.orderId">
				<view class="me_content_icon">
					<u-icon name="checkmark-circle" size="55" color="#2b85e4" v-if="item.orderStatus == 0"></u-icon>
					<u-icon name="close-circle" size="55" color="#888" v-if="item.orderStatus != 0"></u-icon>
				</view>
				<view :class="item.orderStatus == 0 ? 'me_content_info' : 'me_content_info no_pay_order'">
					<view class="title">{{item.orderStatus == 0 ? '预约成功':item.orderStatus == 1 ? '预约已取消' : '预约未支付'}}</view>
					<view class="person_name">{{item.personName}} | {{item.checkType}}</view>
				</view>
				<view :class="item.orderStatus == 0 ? 'me_content_date' : 'me_content_date no_pay_order'">
					<view class="title">到院日期</view>
					<view class="order_date">{{item.getToDate}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderList: ''
			}
		},
		methods: {
			skipTestingOrderDetail(orderId) {
				uni.navigateTo({
					url: `../testingOrderDetail/testingOrderDetail?orderId=${orderId}`
				})
			},
			async initSelectData() {
				uni.showLoading({
					title: '加载中'
				})
				// 查询信息
				let res = await this.$myRequest({
					url: '/apply/order/getTestingOrderList',
					data: {
						token: getApp().globalData.globalUserToken
					}
				})
				// 判断是否查询成功
				if(res.code == 1) {
					this.orderList = res.data
				}
				uni.hideLoading()
			}
		},
		onShow() {
			// 调用初始查询数据方法
			this.initSelectData()
		},
		onPullDownRefresh() {
			// 下拉刷新
			this.initSelectData()
		}
	}
</script>

<style lang="less">
	
	// 定义字体颜色
	@color: #2b85e4;
	
	uni-page-body {
		height: 100%;
	}
	
	.me_max {
		padding: 10px;
		min-height: 100vh;
		background-color: #ecf5ff;
		color: #555;
	}
	.me_content {
		background-color: #FFF;
		border-radius: 5px;
		color: #888;
		padding: 0 10px;
		>view {
			border-bottom: 1px solid #EEE;
			padding: 10px 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			flex-direction: row;
		}
		.me_right_empty {
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
	.me_content_icon {
		width: 12%;
	}
	.me_content_info {
		width: 53%;
		>view {
			padding: 2px;
		}
		.title {
			color: @color;
		}
		.person_name, .dept_info {
			font-size: 12px;
		}
	}
	.me_content_date {
		width: 35%;
		display: flex;
		justify-content: space-between;
		flex-direction: column;
		align-items: flex-end;
		>view {
			padding: 2px;
		}
		.title {
			color: @color;
		}
		.order_date, .order_time {
			font-size: 12px;
			color: #333;
		}
	}
	.me_content_info.no_pay_order, .me_content_date.no_pay_order {
		.title, .order_date {
			color: #888;
		}
	}
</style>

