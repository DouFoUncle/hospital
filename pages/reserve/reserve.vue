<!-- 选择日期和要挂号的医生页面 -->
<template>
	<view class="me_max">
		<!-- 消息提示框 -->
		<view>
			<u-toast ref="uToast" />
		</view>
		<view class="me_min">
			<view class="me_head">
				<lxCalendar @change="selectDate" @returnInitParam="initDateParam" :yesNumDay="yesNumDay" v-if="hackReset"></lxCalendar>
			</view>
			
			<view class="me_content">
				<view v-if="!doctorInfo || doctorInfo.length < 1" class="me_right_empty">
					<u-empty text="暂无坐诊信息…" mode="list"></u-empty>
				</view>
				<view class="me_doctor_info" v-if="doctorInfo && doctorInfo.length > 0" 
					  v-for="item, index in doctorInfo" :key="index" @click="selectedDoctor(item)">
					<view class="me_doctor_img">
						<image src="../../static/img/person/default_head.jpeg" v-if="!item.doctorImg"></image>
						<image :src="item.doctorImg" v-if="item.doctorImg"></image>
					</view>
					<view class="me_person_info">
						<text>{{item.doctorName}}</text>
						<text>{{item.doctorPositionName}}</text>
					</view>
					<view class="me_doctor_num" v-if="item.surplusNum <= 0">
						<view class="full">满诊</view>
					</view>
					<view class="me_doctor_num" v-if="item.surplusNum > 0">
						<view class="num">有余号</view>
						<view class="price">
							<u-icon name="rmb"></u-icon>
							<text>{{item.registerPrice}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import lxCalendar from '../../components/lx-calendar/lx-calendar.vue'
	export default {
		components:{
			lxCalendar,
		},
		data() {
			return {
				// 传递来的部门ID
				deptId: -1,
				// 可以挂号的日期
				yesNumDay: [],
				// 该日期下的坐诊医生信息
				doctorInfo: [],
				// 选中的日期
				findDate: '',
				hackReset: true
			}
		},
		methods: {
			// 选择日期
            selectDate(e){
				this.findDate = e.fulldate
				// 调用查询医生信息的方法
				this.selectDoctorInfo(e.fulldate)
            },
			initDateParam(e) {
				this.findDate = e.fulldate
			},
			async selectedDoctor(param) {
				// 判断是否还有余号，没余号则不跳转
				if(param.surplusNum <= 0) {
					return;
				}
				// 有余号跳转到选择挂号时间页面
				uni.navigateTo({
					url: `../selectReserveTime/selectReserveTime?findDate=${this.findDate}&doctorId=${param.doctorId}`
				})
			},
			// 查询医生信息
			async selectDoctorInfo(selectDateParam) {
				// 查询默认日期下的医生信息
				let result = await this.$myRequest({
					url: '/apply/visit/getYesVisitInfo',
					data: {
						token: getApp().globalData.globalUserToken,
						deptId: this.deptId,
						findDate: selectDateParam
					}
				})
				if(result.code == 1) {
					this.doctorInfo = result.data
				} else if(result.code == 2) {
					this.doctorInfo = []
					// 弹出提示
					this.$refs.uToast.show({
						title: result.msg,
						type: 'warning',
						callback: (()=> {
						})
					})
					return;
				}
			},
			async initFindYesNum() {
				uni.showLoading({
					title: '加载中'
				})
				// 有部门ID则查询该部门下本日起到本月最后一天的可挂号的对应日期
				let result = await this.$myRequest({
					url: '/apply/visit/getYesVisitDay',
					method: 'GET',
					data: {
						token: getApp().globalData.globalUserToken,
						deptId: this.deptId
					}
				})
				if(result.code == 1) {
					// 赋值要显示的日期
					this.yesNumDay = result.data
					// 重新渲染组件
					let that = this
					this.hackReset = false
					this.$nextTick(() => {
						that.hackReset = true;
					})
				}
				uni.hideLoading()
			}
		},
		onLoad(option) {
			// 取出上个页面传递的部门id参数
			if(option.id) {
				this.deptId = option.id
				this.initFindYesNum()
			}
		},
		onShow() {
			let that = this;
			setTimeout(() => {
				if(!that.deptId || that.deptId == -1) {
					// 没获取到传递的部门ID
					that.$refs.uToast.show({
						title: '未获取到部门ID...',
						type: 'warning',
						callback: (()=> {
							// 返回选择科室页面
							uni.navigateTo({
								url: "../dept/dept"
							})
						})
					})
				}
			}, 10)
		},
		onPullDownRefresh() {
			this.initFindYesNum()
		}
	}
</script>

<style>
	uni-page-body {
		height: 100%;
	}
	.date {
		width: auto !important;
	}
	.me_min {
		border-radius: 6px;
		background-color: #FFF;
		overflow: hidden;
	}
	.me_max {
		padding: 10px;
		height: 100vh;
		background-color: #ecf5ff;
		color: #555;
	}
	.me_head {
		border-bottom: 1px solid #EEE;
		background-color: #FFF;
	}
	.me_doctor_info {
		background-color: #FFF;
		display: flex;
		justify-content: space-between;
		flex-direction: row;
		align-items: center;
		padding: 10px;
		border-bottom: 1px solid #EEE;
	}
	.me_doctor_info .me_doctor_img {
		min-width: 20%;
	}
	.me_doctor_info .me_doctor_img image {
		width: 50px;
		height: 50px;
	}
	.me_doctor_info .me_doctor_num {
		display: flex;
		flex-direction: row;
		align-items: center;
		min-width: 39%;
	}
	.me_doctor_info .me_person_info {
		min-width: 42%;
		display: flex; 
		flex-direction: column;
	}
	.me_doctor_info .me_person_info>text {
		margin: 5px 0px;
	}
	.me_doctor_num>view {
		margin: 0px 4px;
		padding: 2px 6px;
		font-size: 11px;
		border-radius: 4px;
		color: #EEE
	}
	.me_doctor_num .full {
		background-color: #c8c9cc;
	}
	.me_doctor_num .num {
		background-color: #2b85e4;
	}
	.me_doctor_num .price {
		background-color: #f29100;
	}
	.me_right_empty {
		padding: 20px;
	}
</style>