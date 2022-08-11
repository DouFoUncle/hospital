<!-- 就诊人管理页面 -->
<template>
	<view class="me_max">
		<view class="me_content">
			<view class="me_person_list">
				<view class="person_info" v-for="item in personList" :key="item.id" @click.stop="skipPage(item.id)">
					<view class="me_left">
						<view class="me_top">
							<view class="left_name">
								{{item.personName}}
							</view>
							<view class="right_number">
								{{item.personNumber}}
							</view>
						</view>
						<view class="me_bottom">
							{{item.idCardNum}}
						</view>
					</view>
					<view class="me_right">
						<image src="../../static/img/personAdmin/card.png" mode=""></image>
					</view>
				</view>
			</view>
		</view>
		
		<view class="me_btn_group">
			<view>
				<u-button type="success" @click="skipAddPerson">添加就诊人</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: '',
				visitId: '',
				personList: '',
				problemObj: ''
			}
		},
		methods: {
			skipAddPerson() {
				uni.navigateTo({
					url: '../addPerson/addPerson'
				})
			},
			skipPage(personId) {
				// 0代表是从核酸检测预约页面过来的
				// 1代表使用预约挂号页面过来的
				let that = this
				if(this.type == 0) {
					uni.navigateTo({
						url: `../testingOrder/testingOrder?personId=${personId}`,
						success: function(res) {
							// 通过eventChannel向被打开页面传送数据
							// 将统计到的用户回答的问题结果返回到下个页面
							res.eventChannel.emit('censusData', that.problemObj)
						}
					})
				} else if(this.type == 1) {
					// 跳转到创建预约坐诊页面
					console.log(personId)
					uni.redirectTo({
						url: `../createReserveOrder/createReserveOrder?visitId=${this.visitId}&personId=${personId}`
					})
				}
			},
			// 初始化查询数据
			async initQueryData() {
				uni.showLoading({
					title: '加载中'
				})
				// 调用接口查询就诊人信息
				let res = await this.$myRequest({
					url: '/apply/person/getPersonInfoList',
					data: {
						token: getApp().globalData.globalUserToken
					}
				})
				if(res.code == 1) {
					this.personList = res.data
				}
				uni.hideLoading()
			}
		},
		onLoad(option) {
			// 获取本页面接收的type参数
			// 该参数用于判断本次是哪个操作类型
			// 0代表是从核酸检测预约页面过来的
			// 1代表使用预约挂号页面过来的
			this.type = option.type
			let that = this
			if(option.type == 0) {
				// 是核酸检测页面过来，则再次取出传来的用户回答的问题的结果对象
				// 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
				const eventChannel = this.getOpenerEventChannel();
				eventChannel.on('censusData', function(data) {
					that.problemObj = data
				})
			} else if(option.type == 1) {
				// 是预约挂号页面过来的，取出坐诊记录ID
				this.visitId = option.visitId
			} else {
				uni.navigateBack()
			}
		},
		onShow() {
			console.log(123)
			this.initQueryData();
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
	.me_content {
		display: flex;
		flex-direction: column;
		margin-bottom: 15px;
	}
	.me_person_list .person_info {
		display: flex;
		justify-content: space-between;
		margin-top: 15px;
		background-color: #FFF;
		border-radius: 5px;
		padding: 13px;
		.me_right image {
			width: 40px;
			height: 40px;
		}
		.me_left {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			justify-content: center;
			.me_top {
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				margin-bottom: 8px;
				.right_number {
					padding: 2px;
					background-color: #f29100;
					color: #FFF;
					border-radius: 9px;
					margin-left: 5px;
					font-size: 12px;
					min-width: 85px;
					text-align: center;
				}
				.left_name {
					font-size: 12px;
				}
			}
		}
	}
	.me_person_list .person_info:first-of-type {
		margin-top: 0px;
	}
</style>