<!-- 核酸检测订单确认页面 -->
<template>
	<view class="me_max">
		<!-- 消息提示框 -->
		<view>
			<u-toast ref="uToast" />
		</view>
		<view class="me_content">
			<view class="me_person_info">
				<view class="title">
					就诊人信息
				</view>
				<view class="content">
					<view>
						<view class="mark">姓名</view>
						<view>{{personInfo.personName}}</view>
					</view>
					<view>
						<view class="mark">身份证号</view>
						<view>{{personInfo.idCardNum}}</view>
					</view>
					<view>
						<view class="mark">联系电话</view>
						<view>{{personInfo.phone}}</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="me_testing_price">
			<view class="title">
				预约信息
			</view>
			<view class="content">
				<view>
					<view>
						<u-form-item label="预约到院日期" label-position="top">
							<u-input v-model="submitParam.getToDate" type="select" @click="dateShow = true" placeholder="请选择预约到院日期" />
						</u-form-item>
						<u-picker mode="time" v-model="dateShow" :params="params" @confirm="dateConfirmCallBack"></u-picker>
					</view>
				</view>
				<view>
					<view>
						<u-form-item label="检测类型" label-position="top">
							<u-input v-model="submitParam.checkType" type="select" @click="checkShow = true" placeholder="请选择检测方式" />
						</u-form-item>
						<u-action-sheet :list="checkTypes" v-model="checkShow" @click="checkActionSheetCallback"></u-action-sheet>
					</view>
				</view>
				<view>
					<view>
						<u-form-item label="预约金额" label-position="top">
							<u-input v-model="checkPriceShow" placeholder="选择检测方式后自动识别" disabled="true" />
						</u-form-item>
					</view>
				</view>
			</view>
		</view>
		
		<view class="button_group">
			<u-button type="success" @click="submitInfo">立即支付</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				checkShow: false,
				checkPriceShow: '',
				checkTypes: [{
					text: '混采 - 10人一组采样',
					showText: '混采',
					value: 1
				}, {
					text: '单采 - 单人采样',
					showText: '单采',
					value: 2
				}],
				params: {
					year: true,
					month: true,
					day: true,
					hour: false,
					minute: false,
					second: false
				},
				dateShow: false,
				// 就诊人信息
				personInfo: '',
				// 最后提交的数据集合
				submitParam: {
					getToDate: '',
					checkType: '',
					checkPrice: '',
					personId: '',
					token: getApp().globalData.globalUserToken,
				},
			}
		},
		methods: {
			// 点击actionSheet回调
			checkActionSheetCallback(index) {
				this.submitParam.checkType = this.checkTypes[index].showText;
				if (this.checkTypes[index].value == 1) {
					this.checkPriceShow = '¥15';
					this.submitParam.checkPrice = '15';
				} else if (this.checkTypes[index].value == 2) {
					this.checkPriceShow = '¥50';
					this.submitParam.checkPrice = '50';
				}
			},
			async selectPersonInfo() {
				// 初始化查询就诊人信息
				let res = await this.$myRequest({
					url: '/apply/person/getPersonInfoById',
					method: "GET",
					data: {
						token: getApp().globalData.globalUserToken,
						personId: this.submitParam.personId
					}
				})
				if(res.code == 1) {
					this.personInfo = res.data
					this.submitParam.personNumber = res.data.personNumber
					this.submitParam.personIdCardNum = res.data.idCardNum
					this.submitParam.personName = res.data.personName
					this.submitParam.personPhone = res.data.phone
				}
			},
			dateConfirmCallBack(e) {
				this.submitParam.getToDate = `${e.year}-${e.month}-${e.day}`
			},
			submitInfo() {
				let that = this
				if(!this.submitParam.checkType || !this.submitParam.checkPrice || !this.submitParam.getToDate) {
					// 弹出登录提示
					this.$refs.uToast.show({
						title: '请认真填写预约信息',
						type: 'warning'
					})
					return;
				}
				uni.showLoading({
					title: '正在支付...',
					success: () => {
						setTimeout(async function () {
							// 调用生成核酸检测预约订单
							let res = await that.$myRequest({
								url: '/apply/testing/createTestingOrder',
								method: 'POST',
								data: that.submitParam,
							})
							if(res.code == 1) {
								uni.hideLoading();
								// 弹出支付成功
								uni.showToast({
									title: '支付成功',
									success: () => {
										// 跳转到挂号记录页面
										setTimeout(() => {
											uni.reLaunch({
												url: '../tesingVisit/tesingVisit'
											})
										}, 1500)
									}
								})
							} else if(res.code == 2) {
								uni.hideLoading();
								// 弹出提示
								that.$refs.uToast.show({
									title: res.msg,
									type: 'warning',
									callback: (()=> {
									})
								})
								return;
							}
						}, 1500);
					}
				})
			}
		},
		onLoad(option) {
			uni.showLoading({
				title: '加载中'
			})
			// 获取本页面接收的peronId参数
			this.submitParam.personId = option.personId
			this.selectPersonInfo()
			let that = this
			// 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
			const eventChannel = this.getOpenerEventChannel();
			eventChannel.on('censusData', function(data) {
				that.submitParam = {...data, ...that.submitParam}
			})
			uni.hideLoading()
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
		font-size: 14px;
	}
	
	.me_content {
		background-color: #FFF;
		padding: 10px;
		display: flex;
		border-radius: 5px;
		flex-direction: column;
	}

	.me_person_info {
		display: flex;
		flex-direction: column;
		.title {
			padding: 0 0 10px;
			margin-bottom: 10px;
			font-size: 16px;
			border-bottom: 1px solid #EEE;
		}
		.content {
			display: flex;
			flex-direction: column;
			>view {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				padding: 7.5px 0;
				view {
					color: #777;
					font-size: 12px;
				}
				.mark {
					color: #333;
				}
			}
			>view:last-of-type {
				padding-bottom: 0px;
			}
			>view:first-of-type {
				padding-top: 0px;
			}
		}
	}
	
	.me_testing_price {
		display: flex;
		flex-direction: column;
		border-radius: 5px;
		background-color: #FFF;
		margin-top: 15px;
		padding: 10px;
		.title {
			padding: 0 0 10px;
			font-size: 16px;
			border-bottom: 1px solid #EEE;
		}
	}
	
	.button_group {
		margin-top: 15px;
	}

</style>
