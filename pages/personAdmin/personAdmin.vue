<!-- 就诊人管理页面 -->
<template>
	<view class="me_max">
		<view class="me_content">
			<view v-if="!personList || personList.length <= 0" class="me_right_empty">
				<u-empty text="暂无信息…" mode="list"></u-empty>
			</view>
			<view class="me_person_list" v-if="personList || personList.length > 0">
				<view class="person_info" v-for="item in personList" :key="item.id" @click="editInfo(item.id)">
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
				personList: ''
			}
		},
		methods: {
			skipAddPerson() {
				uni.navigateTo({
					url: '../addPerson/addPerson'
				})
			},
			editInfo(id) {
				uni.navigateTo({
					url: '../addPerson/addPerson?id=' + id
				})
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
					console.log(res.data)
				}
				uni.hideLoading()
			}
		},
		onShow() {
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
