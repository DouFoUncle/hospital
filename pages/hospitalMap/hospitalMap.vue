<!-- 导航到院页面 -->
<template>
	<view class="me_max">
		<view class="me_content">
			<view class="me_map">
				<map :latitude="hospitalInfo.latitude" :longitude="hospitalInfo.longitude" :markers="markers"
					style="width: 100%; height: 100%;"></map>
			</view>
			<view class="me_bottom">
				<view class="text">
					<view class="title">{{hospitalInfo.hospitalName}}</view>
					<view>{{hospitalInfo.address}}</view>
				</view>
				<view @click="viewMapLocation">
					<image src="../../static/img/hospitalMap/navigate.png"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				markers: [],
				// 医院信息
				hospitalInfo: {}
			}
		},
		methods: {
			// 这里传入的三个参数分别是  要去的  经度 纬度 以及 地址信息
			viewMapLocation() {
				let that = this
				uni.openLocation({
					// 传入你要去的纬度
					latitude: Number(that.hospitalInfo.latitude),
					// 传入你要去的经度
					longitude: Number(that.hospitalInfo.longitude),
					// 缩放大小
					scale: 18,
					success: function() {
						console.log('success');
					}
				});
			},
			async initSelectData() {
				uni.showLoading({
					title: '加载中'
				})
				let res = await this.$myRequest({
					url: '/apply/hospital/selectHospitalInfo'
				})
				if(res.code == 1) {
					let mark = {
						id: 1,
						longitude: res.data.longitude,
						latitude: res.data.latitude
					}
					this.markers.push(mark)
					console.log(res.data)
					this.hospitalInfo = res.data
				}
				uni.hideLoading()
			}
		},
		onLoad() {
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
		height: 100vh;
		color: #555;
	}

	.me_content {
		height: 100%;

		.me_map {
			height: 90%;
		}

		.me_bottom {
			height: 10%;
			width: 100%;
			background-color: #FFF;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			padding: 15px;
			align-items: center;
			.text {
				display: flex;
				flex-direction: column;
				font-size: 12px;

				.title {
					font-size: 14px;
					margin-bottom: 4px;
					color: #333;
				}
			}
			image {
				width: 35px;
				height: 35px;
			}
		}
	}
</style>
