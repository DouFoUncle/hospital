<!-- 新增就诊人页面 -->
<template>
	<view class="me_max">
		<!-- 消息提示框 -->
		<view>
			<u-toast ref="uToast" />
		</view>
		<view class="me_content">
			<view>
				<u-form :model="formData" ref="uForm">
					<u-form-item label="姓名" label-position="top" :label-style="labelStyle" prop="personName" required="true">
						<u-input v-model="formData.personName" placeholder="请输入就诊人姓名"/>
					</u-form-item>
					<u-form-item label="身份证号" label-position="top" :label-style="labelStyle" prop="idCardNum" required="true">
						<u-input v-model="formData.idCardNum" placeholder="请输入就诊人身份证号"/>
					</u-form-item>
					<u-form-item label="手机号码" label-position="top" :label-style="labelStyle" prop="phone" required="true">
						<u-input v-model="formData.phone" placeholder="请输入就诊人手机号码"/>
					</u-form-item>
				</u-form>
			</view>
		</view>
		<view class="button_group">
			<u-button type="success" @click="submitInfo">保存信息</u-button>
			<view style="margin-top: 15px;" v-if="showDelBtn">
				<u-button type="warning" @click="deleteInfo">删除信息</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				labelStyle: {
					fontSize: '12px',
					color: '#333'
				},
				formData: {
					personName: '',
					phone: '',
					idCardNum: '',
					id: ''
				},
				showDelBtn: false,
				// 表单验证规则
				rules: {
					personName: [
						{
							required: true, 
							message: '请输入姓名',
							trigger: ['change','blur']
						}
					],
					phone: [
						{
							required: true, 
							message: '请输入手机号',
							trigger: ['change','blur']
						},
						{
							validator: (rule, value, callback) => {
								return this.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							// 触发器可以同时用blur和change
							trigger: ['change','blur']
						}
					],
					idCardNum: [
						{
							required: true, 
							message: '请输入身份证号',
							trigger: ['change','blur']
						},
						// 正则判断是否符合身份证规则
						{
							pattern: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
							// 正则检验前先将值转为字符串
							transform(value) {
								return String(value);
							},
							trigger: ['change','blur'],
							message: '身份证格式不正确'
						}
					]
				}
			}
		},
		methods: {
			submitInfo() {
				let that = this
				this.$refs.uForm.validate(valid => {
					console.log(valid)
					if (valid) {
						that.insertInfo();
					} else {
						console.log('验证失败');
					}
				});
			},
			async insertInfo() {
				// 像后台发起请求
				let res = await this.$myRequest({
					url: '/apply/person/insertPersonInfo',
					data: {
						personName: this.formData.personName,
						phone: this.formData.phone,
						idCardNum: this.formData.idCardNum,
						token: getApp().globalData.globalUserToken,
						id: this.formData.id
					},
					method: 'POST'
				})
				if(res.code == 1) {
					// 调用提示框
					this.showAlert("操作成功！", 'primary', () => {
						// 跳转到到上一个页面
						uni.navigateBack()
					})
				} else if(res.code == 2) {
					// 调用提示框
					this.showAlert(res.msg)
				}
			},
			showAlert(title, type, callBack) {
				// 弹出提示
				let param = {
					title: !title ? '操作成功！' : title,
					type: !type ? 'warning' : type
				}
				if(callBack) {
					param.callback = callBack
				}
				this.$refs.uToast.show(param)
			},
			async getInitInfo(id) {
				let token = getApp().globalData.globalUserToken
				let res = await this.$myRequest({
					url: `/apply/person/getPersonInfoById?personId=${id}&token=${token}`,
					method: "GET",
					data: null
				})
				// 赋值
				this.formData.personName = res.data.personName
				this.formData.idCardNum = res.data.idCardNum
				this.formData.phone = res.data.phone
				this.formData.id = res.data.id
			},
			async deleteInfo() {
				// 根据ID删除信息
				let res = await this.$myRequest({
					url: `/apply/person/deleteInfo`,
					method: "POST",
					data: {
						id: this.formData.id,
						token: getApp().globalData.globalUserToken
					}
				})
				if(res.code == 1) {
					// 调用提示框
					this.showAlert("操作成功！", 'primary', () => {
						// 跳转到到上一个页面
						uni.navigateBack()
					})
				}
			}
		},
		onLoad(option) {
			if(option.id) {
				this.showDelBtn = true
				// 根据ID查询要修改的信息
				this.getInitInfo(option.id)
			}
		},
		// 必须要在onReady生命周期中将设置好的表单验证规则设置到Form对象中，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.$refs.uForm.setRules(this.rules);
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
		background-color: #FFF;
		padding: 0 15px;
		border-radius: 5px;
	}
	
	.button_group {
		margin-top: 15px;
	}
</style>
