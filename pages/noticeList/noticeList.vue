<template>
	<view class="me_max">
		<view class="me_content">
			<view v-if="!noticeList || noticeList.length <= 0" class="me_right_empty">
				<u-empty text="暂无信息…" mode="list"></u-empty>
			</view>
			<view class="me_notice_list">
				<view class="me_notice_item" v-for="item in noticeList" :key="item.id" @click="skipNoticeDetailPage(item.id)">
					<view class="title">{{item.title}}</view>
					<view class="date">{{item.createDate}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				noticeList: []
			}
		},
		methods: {
			// 查询公告列表
			async initSelectData() {
				uni.showLoading({
					title: '加载中'
				})
				let res = await this.$myRequest({
					url: '/apply/notice/selectNoticeList'
				})
				if(res.code == 1) {
					this.noticeList = res.data
				}
				uni.hideLoading()
			},
			// 跳转公告详情页面
			skipNoticeDetailPage(id) {
				uni.navigateTo({
					url: `../noticeDetail/noticeDetail?id=${id}`
				})
			}
		},
		onLoad() {
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
		color: #555;
	}
	
	.me_content .me_right_empty {
		background-color: #FFF;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 15px;
		border-radius: 5px;
	}
	
	.me_content .me_notice_list {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		.me_notice_item {
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: flex-end;
			width: 100%;
			padding: 10px;
			background-color: #fff;
			margin: 5px 0;
			border-radius: 5px;
			.title {
				width: 70%;
			}
			.date {
				text-align: right;
				width: 30%;
			}
		}
	}
</style>
