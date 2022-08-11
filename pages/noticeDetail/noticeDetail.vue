<template>
	<view class="me_max">
		<view class="me_content">
			<u-parse :html="noticeInfo.content"></u-parse>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: '',
				noticeInfo: {}
			}
		},
		methods: {
			async initSelectData() {
				// 根据ID查询公告
				uni.showLoading({
					title: '加载中'
				})
				let res = await this.$myRequest({
					url: `/apply/notice/selectNoticeById`,
					data: {
						noticeId: this.id
					}
				})
				if(res.code == 1) {
					this.noticeInfo = res.data
				}
				uni.hideLoading()
			}
		},
		onLoad(option) {
			this.id = option.id
			this.initSelectData()
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
	}
</style>
