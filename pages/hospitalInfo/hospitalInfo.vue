<template>
	<view class="me_max">
		<view class="me_content">
			<u-parse :html="hospitalInfo.hospitalInfo"></u-parse>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				hospitalInfo: {}
			}
		},
		methods: {
			async initSelectData() {
				uni.showLoading({
					title: '加载中'
				})
				let res = await this.$myRequest({
					url: '/apply/hospital/selectHospitalInfo'
				})
				if(res.code == 1) {
					this.hospitalInfo = res.data
				}
				uni.hideLoading()
			}
		},
		onLoad() {
			// 初始化查询医院信息
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
