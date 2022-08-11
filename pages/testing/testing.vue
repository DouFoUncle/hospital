<!-- 核酸检测页面 -->
<template>
	<view class="me_max">
		<!-- 消息提示框 -->
		<view>
			<u-toast ref="uToast" />
		</view>
		<view class="me_content">
			<view class="me_top">
				<view class="me_top_text">
					尊敬的患者：根据国家卫生健康委员会、国家中医药管理局颁发的《新型冠状病毒肺炎诊疗方案》的文件，
					依照乙类传染病、甲类传染病管理要求，需要全面统计填报新型冠状病毒感染的肺炎疫情防控信息，
					请您提供真实、准确的流行病学史信息，感谢您的配合。
				</view>
			</view>
			<view class="me_middle">
				<view class="me_middle_problem">
					<view class="problem_title">
						1. 近三天是否发热（体温>37.3℃）
					</view>
					<view class="problem_selected">
						<u-radio-group v-model="censusData.oneProblem" wrap="true">
							<view>
								<u-radio :disabled="false" :label-disabled="false" name="是">是</u-radio>
							</view>
							<view>
								<u-radio :disabled="false" :label-disabled="false" name="否">否</u-radio>
							</view>
						</u-radio-group>
					</view>
				</view>
				<view class="me_middle_problem">
					<view class="problem_title">
						2. 入院前14天内有病例报告社区的旅行史或居住史。或与来自高危地区人员接触。
					</view>
					<view class="problem_selected">
						<u-radio-group v-model="censusData.twoProblem" wrap="true">
							<view>
								<u-radio :disabled="false" :label-disabled="false" name="有">有</u-radio>
							</view>
							<view>
								<u-radio :disabled="false" :label-disabled="false" name="无">无</u-radio>
							</view>
						</u-radio-group>
					</view>
				</view>
				<view class="me_middle_problem">
					<view class="problem_title">
						3. 入院前14天内曾接触过来自有病例报告社区的发热或有呼吸道症状的患者。
					</view>
					<view class="problem_selected">
						<u-radio-group v-model="censusData.threeProblem" wrap="true">
							<view>
								<u-radio :disabled="false" :label-disabled="false" name="有">有</u-radio>
							</view>
							<view>
								<u-radio :disabled="false" :label-disabled="false" name="无">无</u-radio>
							</view>
						</u-radio-group>
					</view>
				</view>
				<view class="me_middle_problem">
					<view class="problem_title">
						4. 入院前14天内与新型冠状病毒感染的患者或无症状感染者有接触史。
					</view>
					<view class="problem_selected">
						<u-radio-group v-model="censusData.fourProblem" wrap="true">
							<view>
								<u-radio :disabled="false" :label-disabled="false" name="有">有</u-radio>
							</view>
							<view>
								<u-radio :disabled="false" :label-disabled="false" name="无">无</u-radio>
							</view>
						</u-radio-group>
					</view>
				</view>
				<view class="me_middle_problem">
					<view class="problem_title">
						5. 聚集性发病：2周内在小范围如家庭、办公室、学校班级等场所，出现 2 例及以上发热和或呼吸道症状的病例。
					</view>
					<view class="problem_selected">
						<u-radio-group v-model="censusData.fiveProblem" wrap="true">
							<view>
								<u-radio :disabled="false" :label-disabled="false" name="有">有</u-radio>
							</view>
							<view>
								<u-radio :disabled="false" :label-disabled="false" name="无">无</u-radio>
							</view>
						</u-radio-group>
					</view>
				</view>
				<view class="me_middle_problem">
					<view class="problem_title">
						6. 入院前14天内乘坐的飞机、动车、火年、地铁等公共交通工具有确诊或疑似病例。
					</view>
					<view class="problem_selected">
						<u-radio-group v-model="censusData.sixProblem" wrap="true">
							<view>
								<u-radio :disabled="false" :label-disabled="false" name="有">有</u-radio>
							</view>
							<view>
								<u-radio :disabled="false" :label-disabled="false" name="无">无</u-radio>
							</view>
						</u-radio-group>
					</view>
				</view>
			</view>
			<view class="me_bottom">
				<view class="me_bottom_text">
					请确保以上信息真实性，若您隐瞒上述情况，将构成危害公共安全罪。
					因提供虚假个人信息和隐瞒病史造成疾病传播等不良后果的，
					您将承担相关<text style="color: red;">法律责任</text>，特此告知。谢谢您予以配合和理解。
				</view>
			</view>
		</view>

		<view class="button_group">
			<u-button type="success" @click="submitInfo">选择就诊人</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				censusData: {
					oneProblem: '',
					twoProblem: '',
					threeProblem: '',
					fourProblem: '',
					fiveProblem: '',
					sixProblem: '',
				},
			}
		},
		methods: {
			// 点击立即支付按钮触发的事件
			submitInfo() {
				let that = this
				if(!this.censusData.oneProblem || !this.censusData.twoProblem ||!this.censusData.threeProblem
				   || !this.censusData.fourProblem ||!this.censusData.fiveProblem || !this.censusData.sixProblem) {
					this.showLoginAlert();
					return;
				}
				uni.navigateTo({
					url: '../selectPerson/selectPerson?type=0',
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						// 将统计到的用户回答的问题结果返回到下个页面
						res.eventChannel.emit('censusData', that.censusData)
					}
				})
			},
			showLoginAlert() {
				// 弹出登录提示
				this.$refs.uToast.show({
					title: '请认真填写完问题！',
					type: 'warning'
				})
			}
		}
	}
</script>

<style lang="less">
	
	// 定义字体颜色
	@color: #2b85e4;
	@rmbColor: #f29100;
	
	uni-page-body {
		height: 100%;
	}
	
	.me_max {
		padding: 10px;
		min-height: 100vh;
		background-color: #ecf5ff;
		color: #555;
		font-size: 14px;
	}
	.me_content {
		background-color: #FFF;
		border-radius: 8px;
		.me_top, .me_bottom {
			padding: 10px;
			text-indent: 2em;
		}
		.me_middle .me_middle_problem {
			padding: 10px;
			.problem_title {
				font-size: 14px;
				margin-bottom: 8px;
			}
		}
	}
	.button_group {
		margin-top: 15px;
	}
</style>