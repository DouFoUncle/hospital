<!-- 选择预约的科室页面 -->
<template>
	<view class="me_body">
		<view class="me_content">
			<view class="me_left_body">
				<view class="me_left_menu">
					<view v-for="(item, index) in deptData" :key="item.id"
						:class="currId == item.id ? 'me_left_item me_curr_item':'me_left_item'"
						@click="clickDeptItem(item.id, index)" v-if="deptData && deptData.length > 0">
						<view :class="currId == item.id ? 'me_flag me_curr_flag':'me_flag'"></view>
						<text>
							{{item.deptName}}
						</text>
					</view>
				</view>
			</view>
			<view :class="!currRightItem ? 'me_right_body':'me_right_body me_right_show'">
				<view v-if="!currRightItem || !currRightItem" class="me_right_empty">
					<u-empty text="暂无数据哦…" mode="list"></u-empty>
				</view>
				<view class="me_right_menu">
					<view class="me_right_item" v-for="(item, index) in currRightItem" :key="item.id" 
						  @click="skipReservePage(item.id)" v-if="currRightItem && currRightItem.length > 0">
						<text>{{item.deptName}}</text>
						<view class="me_right_yuan">
							<u-icon name="arrow-right" size="17"></u-icon>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				deptData: [],
				currId: -1,
				currRightItem: [],
				currMenu: {},
			}
		},
		methods: {
			// 点击部门触发的事件
			clickDeptItem(id, index) {
				// 设置当前选中的菜单ID
				this.currId = id
				// 设置当前选中的菜单信息d的子菜单信息
				this.currRightItem = this.deptData[index].deptChildList
			},
			// 跳转到搜索页面
			skipSearchPage() {
				uni.navigateTo({
					url: "../search/search"
				})
			},
			// 跳转到预约页面
			skipReservePage(id) {
				uni.navigateTo({
					url: `../reserve/reserve?id=${id}`
				})
			}
		},
		async onLoad() {
			// 判断是否获取到了部门信息
			uni.showLoading({
				title: '加载中'
			})
			if (this.deptData) {
				// 查询部门信息
				let result = await this.$myRequest({
					url: '/apply/dept/getDeptList',
					method: 'GET',
					data: {
						token: getApp().globalData.globalUserToken
					}
				})
				// 判断是否成功取到数据
				if(result.code == 1) {
					// 赋值查询到的数据
					this.deptData = result.data
					// 赋值初始显示的部门
					this.currId = this.deptData[0].id
					this.currRightItem = this.deptData[0].deptChildList
				}
			}
			uni.hideLoading()
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

	.me_content {
		height: 100%;
		display: flex;
		padding: 10px 0px;
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

	.me_right_body.me_right_show {
		align-items: flex-start;
	}

	.me_right_menu {
		display: flex;
		justify-content: center;
		align-items: flex-start;
		flex-direction: column;
		width: 100%;
	}
	.me_right_menu .me_right_item {
		width: 90%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 10px;
		padding: 10px;
		color: #555;
		border-bottom: 1px solid #EEE;
	}
	.me_right_yuan {
		width: 16px;
		height: 16px;
		background-color: #a0cfff;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #FFF;
		font-size: 12px;
	}

	.me_left_menu {
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		font-size: 14px;
		color: #777;
	}

	.me_left_menu .me_left_item {
		width: 100%;
		padding: 10px 6px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.me_left_menu .me_left_item .me_flag {
		height: 20px;
		background-color: #a0cfff;
		width: 3%;
		visibility: hidden
	}

	.me_left_menu .me_left_item .me_flag.me_curr_flag {
		visibility: visible;
	}

	.me_left_menu .me_left_item text {
		text-align: center;
		width: 97%;
	}

	.me_left_menu .me_curr_item {
		background-color: #FFF;
		color: #555;
	}
</style>
