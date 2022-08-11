<!-- 搜索结果页面 -->
<template>
	<view>
		<view class="me_body">
			<view class="me_head">
				<view class="me_search_body">
					<view>
						<input type="text" value="" placeholder="请输入要搜索的疾病" :focus="isFocus"/>
					</view>
				</view>
			</view>
			<view class="me_content">
				
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isFocus: false
			}
		},
		methods: {
			
		},
		onShow() {
			let that = this
			setTimeout(() => {
					that.isFocus = true;
			}, 1)
		}
	}
</script>

<style>
	uni-page-body {
		height: 100%;
	}

	.me_body {
		height: 100vh;
		font-size: 14px;
		background-color: #ecf5ff;
	}

	.me_head {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 11%;
	}
	
	.me_search_body {
		background-color: #FFF;
	}
	.me_search_body {
		width: 80%;
	}

	.me_search_body>view {
		position: relative;
		top: 0px;
		background-color: #EEE;
		padding: 8px;
		width: 100%;
	}

	.me_search_body input {
		font-size: 12px;
		text-align: center;
		background-color: #FFF;
		border-radius: 4px;
		padding: 4px 3px;
	}

	.me_left_body {
		width: 30%;
	}

	.me_right_body {
		width: 70%;
		min-height: 100%;
		max-height: 100%;
		background-color: #FFF;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.me_content {
		height: 89%;
		display: flex;

	}
</style>
