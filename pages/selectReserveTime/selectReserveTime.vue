<!-- 选择详细的挂号信息页面 -->
<template>
	<view class="me_max">
		<view class="me_head">
			<view class="me_doctor_img">
				<image src="../../static/img/person/default_head.jpeg" v-if="!detailInfo.doctorImg"></image>
				<image :src="detailInfo.doctorImg" v-if="detailInfo.doctorImg"></image>
			</view>
			<view class="me_person_info">
				<text>{{detailInfo.doctorName}}</text>
				<text>{{detailInfo.doctorPositionName}}</text>
			</view>
			<view class="me_tab">
				<u-tabs :list="tabList" :is-scroll="false" :current="current" @change="change" font-size="28"></u-tabs>
			</view>
		</view>
		<view class="me_content">
			<view class="tab_one" v-if="current == 0">
				<view class="title_date">{{findDate}}</view>
				<view v-for="item,index in detailInfo.miniVisitDetailBeans" :key="index">
					<view class="me_rever_detail" v-if="item.isOverTime">
						<view class="me_time">{{item.startTime}}~{{item.endTime}}</view>
						<view class="me_no_num">已过时</view>
					</view>
					<view class="me_rever_detail" v-if="!item.isOverTime && item.surplusNum <= 0">
						<view class="me_time">{{item.startTime}}~{{item.endTime}}</view>
						<view class="me_no_num">已无号</view>
					</view>
					<view class="me_rever_detail" v-if="!item.isOverTime && item.surplusNum > 0" @click="skipYesReserve(item.visitId)">
						<view class="me_time">{{item.startTime}}~{{item.endTime}}</view>
						<view class="me_price">
							<u-icon name="rmb" color="#f29100"></u-icon>
							<text class="me_result_price">{{item.registerPrice}}</text>
							<u-icon name="arrow-right" width="20" color="#999"></u-icon>
						</view>
					</view>
				</view>
			</view>
			<view class="tab_two" v-if="current == 1">
				<view class="me_person_desc">
					<view class="me_title">个人经历</view>
					<text>
						{{detailInfo.personDesc}}
					</text>
				</view>
				<view class="me_word_desc">
					<view class="me_title">工作经历</view>
					<text>
						{{detailInfo.workDesc}}
					</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 查询的医生ID
				doctorId: '',
				// 查询的时间
				findDate: '',
				// 医生信息其中包含挂号信息
				detailInfo: '',
				tabList: [
					{name: '挂号'},
					{name: '介绍'}
				],
				current: 0
			}
		},
		methods: {
			// 查询初始化信息
			async getInitInfo() {
				uni.showLoading({
					title: '加载中'
				})
				// 调用接口查询信息
				let result = await this.$myRequest({
					url: '/apply/visit/getVisitDetailByDateAndDoctorId',
					data: {
						token: getApp().globalData.globalUserToken,
						findDate: this.findDate,
						doctorId: this.doctorId
					}
				})
				console.log(result.data)
				this.detailInfo = result.data
				uni.hideLoading()
			},
			// tab切换事件
			change(index) {
				this.current = index;
			},
			// 跳转到下单挂号页面
			skipYesReserve(visitId) {
				// 跳转到下单挂号页面，传输医生ID和选择的坐诊详情ID
				uni.navigateTo({
					url: `../createReserveOrder/createReserveOrder?visitId=${visitId}`
				})
			}
		},
		// option为object类型，会序列化上个页面传递的参数
		onLoad: function (option) {
			this.doctorId = option.doctorId
			this.findDate = option.findDate
			this.getInitInfo()
		}
	}
</script>

<style>
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
		border-bottom: 1px solid #EEE;
		background-color: #FFF;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding: 8px;
		flex-wrap: wrap;
		border-radius: 5px;
	}
	.me_head .me_doctor_img image {
		width: 55px;
		height: 55px;
	}
	.me_head .me_doctor_img {
		width: 22%;
	}
	.me_head .me_person_info {
		width: 78%;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}
	.me_head .me_person_info text {
		font-size: 12px;
		line-height: 27px;
	}
	.me_head .me_tab {
		width: 100%;
	}
	.me_content .tab_one,.me_content .tab_two {
		margin-top: 10px;
		border-radius: 5px;
		background-color: #FFF;
		padding: 10px;
	}
	.me_content .tab_two .me_person_desc {
		padding-bottom: 10px;
		border-bottom: 1px solid #EEE;
		margin-bottom: 10px;
	}
	.me_title {
		font-size: 14px;
		color: #444;
		margin: 8px 0;
	}
	.me_title:first-of-type {
		margin-top: 0px;
	}
	.me_content .me_two text{
		display: block;
		text-indent: 1.5em;
	}
	.tab_one .me_rever_detail {
		display: flex;
		justify-content: space-between;
		padding: 12px 10px;
		border-bottom: 1px solid #EEE;
	}
	.me_content .tab_one {
		padding: 0;
	}
	.tab_one .title_date {
		border-bottom: 1px solid #EEE;
	}
	.me_content .tab_one .title_date {
		padding: 10px;
	}
	.me_result_price {
		margin-right: 5px;
		color: #f29100;
	}
</style>
