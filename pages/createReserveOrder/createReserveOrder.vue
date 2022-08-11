<!-- 创建预约订单页面 -->
<template>
	<view class="me_max">
		<!-- 消息提示框 -->
		<view>
			<u-toast ref="uToast" />
		</view>
		<view class="me_content">
			<view class="me_visit_info">
				<view class="me_doctor_name">
					<view class="me_mark">医生姓名</view>
					<view>{{visitInfo.doctorName}}</view>
				</view>
				<view class="me_position_name">
					<view class="me_mark">医生职称</view>
					<view>{{visitInfo.doctorPositionName}}</view>
				</view>
				<view class="me_dept_name">
					<view class="me_mark">就诊科室</view>
					<view>{{visitInfo.deptName}}</view>
				</view>
				<view class="me_visit_date">
					<view class="me_mark">就诊时段</view>
					<view>
						<view>{{visitInfo.visitDate}}</view>
						<view>{{visitInfo.visitStartTime}} ~ {{visitInfo.visitEndTime}}</view>
					</view>
				</view>
			</view>
			<view class="me_visit_price">
				<view class="me_mark">挂号金额</view>
				<view>
					<u-icon name="rmb" color="#f29100"></u-icon>&nbsp;
					<text>{{visitInfo.visitPrice}}</text>
				</view>
			</view>
			<view class="me_person_info">
				<view class="person_title">
					就诊人信息
				</view>
				<view class="person_info" v-if="personInfo && personInfo.personName">
					<view>
						<view class="person_mark">就诊人</view>
						<view>{{personInfo.personName}}</view>
					</view>
					<view>
						<view class="person_mark">手机号</view>
						<view>{{personInfo.phone}}</view>
					</view>
					<view>
						<view class="person_mark">证件号</view>
						<view>{{personInfo.idCardNum}}</view>
					</view>
				</view>
				<view class="person_selected" @click="skipSelectPerson">
					<view class="person_selected_body">
						<view class="person_add_icon">
							<u-icon name="plus-circle" color="#2b85e4" size="34"></u-icon>
						</view>
						<view class="person_selected_text">
							<text>选择就诊人</text>
						</view>
						<view class="person_jiantou_icon">
							<u-icon name="arrow-right" width="20" color="#999"></u-icon>
						</view>
					</view>
				</view>
			</view>
			<view class="me_button_group">
				<view>
					<u-button type="success" @click="submitInfo">确认预约</u-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				visitId: '',
				personId: '',
				visitInfo: '',
				personInfo: ''
			}
		},
		methods: {
			async initInfo() {
				uni.showLoading({
					title: '加载中'
				})
				// 初始化查询预约信息展示
				let res = await this.$myRequest({
					url: '/apply/visit/getCreateVisitInfo',
					method: 'GET',
					data: {
						token: getApp().globalData.globalUserToken,
						visitId: this.visitId
					}
				})
				if(res.code == 1) {
					// 将查询结果保存
					this.visitInfo = res.data
				}
				if(this.personId) {
					// 查询就诊人信息
					this.selectPersonInfo()
				}
				uni.hideLoading()
			},
			async selectPersonInfo() {
				// 查询就诊人信息
				let res = await this.$myRequest({
					url: '/apply/person/getPersonInfoById',
					method: 'GET',
					data: {
						token: getApp().globalData.globalUserToken,
						personId: this.personId
					}
				})
				if(res.code == 1) {
					// 将查询结果保存
					this.personInfo = res.data
				}
			},
			skipSelectPerson() {
				// 跳转到选择就诊人页面
				uni.redirectTo({
					url: `../selectPerson/selectPerson?type=1&visitId=${this.visitId}`
				})
			},
			// 提交信息
			async submitInfo() {
				if(!this.personId) {
					// 没选择就诊人信息
					this.$refs.uToast.show({
						title: '请选择就诊人！',
						type: 'warning'
					})
					return;
				}
				if(!this.visitId) {
					// 没获取到坐诊记录信息
					this.$refs.uToast.show({
						title: '未获取到坐诊信息，请返回重试！',
						type: 'warning'
					})
					return;
				}
				// 创建订单
				let res = await this.$myRequest({
					url: '/apply/reserve/createReserveOrder',
					method: 'POST',
					data: {
						visitId: this.visitId,
						personId: this.personId,
						token: getApp().globalData.globalUserToken
					}
				})
				// 创建订单成功，跳转到订单确认支付页面
				if(res.code == 1) {
					uni.showLoading({
						title: '创建订单中'
					})
					uni.redirectTo({
						url: `../confirmOrder/confirmOrder?orderId=${res.data.orderId}`,
						complete: () => {
							uni.hideLoading()
						}
					})
				}
				if(res.code == 2) {
					// 创建订单失败，给出提示
					this.$refs.uToast.show({
						title: res.msg,
						type: 'warning',
						url: '/pages/dept/dept'
					})
				}
			}
		},
		onLoad(option) {
			// 获取坐诊记录ID
			this.visitId = option.visitId
			// 获取选择的就诊人ID 
			this.personId = option.personId
				console.log(this.personId)
			this.initInfo();
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
		color: #555;
	}
	
	.me_content {
		>view {
			margin: 12px 0;
		}
		>view:nth-of-type(1) {
			margin-top: 0px;
		}
	}
	
	.me_content .me_visit_info {
		width: 100%;
		background-color: #FFF;
		display: flex;
		flex-direction: column;
		border-radius: 5px;
		>view {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 10px;
			border-bottom: 1px solid #EEE;
			color: #888;
			.me_mark {
				color: #333;
				width: 60%;
			}
			>view:nth-of-type(2) {
				width: 40%;
				display: flex;
				flex-direction: column;
				justify-content: flex-end;
				align-items: flex-end;
			}
		}
		.me_visit_date {
			>view:nth-of-type(2) {
				color: #f29100;
			}
		}
	}
	
	.me_content .me_visit_price {
		width: 100%;
		background-color: #FFF;
		display: flex;
		flex-direction: row;
		border-radius: 5px;
		color: #888;
		padding: 10px;
		.me_mark {
			color: #333;
			width: 60%;
		}
		>view:nth-of-type(2) {
			width: 40%;
			display: flex;
			flex-direction: row;
			justify-content: flex-end;
			align-items: center;
			color: #f29100;
		}
	}
	.me_person_info {
		background-color: #FFF;
		display: flex;
		flex-direction: column;
		color: #888;
		width: 100;
		border-radius: 5px;
		>view {
			padding: 10px;
			border-bottom: 1px solid #EEE;
		}
		.person_title {
			color: #333;
		}
		.person_info {
			display: flex;
			flex-direction: column;
			width: 100%;
			>view {
				display: flex;
				justify-content: space-between;
				padding: 8px;
				border-bottom: 1px solid #EEE;
			}
			>view:last-of-type {
				border-bottom: none;
			}
			.person_mark {
				color: #333;
			}
		}
		.person_selected_body {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
		.person_add_icon {
			width: 10%
		}
		.person_selected_text {
			width: 80%;
		}
		.person_jiantou_icon {
			width: 10%;
			text-align: right;
		}
	}
</style>
