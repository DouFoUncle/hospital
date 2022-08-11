const BASE_URL = 'http://127.0.0.1:8848'
// const BASE_URL = 'https://www.doufouncle.cn:2281'
// const BASE_URL = 'http://192.168.0.105:2281'
let header = {  
	'Content-Type': 'application/x-www-form-urlencoded'  
}
export const myRequest = (options) => { //暴露一个function：myRequest，使用options接收页面传过来的参数
	return new Promise((resolve, reject) => { //异步封装接口，使用Promise处理异步请求
		// 创建对象处理
		let reqParam = {
			// 接收请求的API
			url: BASE_URL + options.url, 
			// 接收请求的方式,如果不传默认为GET
			method: options.method || 'GET',
			// 接收请求的data,不传默认为空
			data: options.data || {}, 
			// 数据获取成功
			success: (res) => {
				if(res.data.code == 401) {
					uni.showToast({
						title: "登录失效，请重新登录",
						icon: 'none'
					})
					return;
				}
				if(res.data.code == 0) {
					uni.showToast({
						title: "后台出现错误：" + res.msg,
						icon: 'none'
					})
					return;
				}
				// if(res.data.code == 2) {
				// 	uni.showToast({
				// 		title: res.msg,
				// 		icon: 'none'
				// 	})
				// 	return;
				// }
				// 成功,将数据返回
				resolve(res.data)
			},
			// 失败操作
			fail: (err) => { 
				uni.showToast({
					title: "请求接口失败！",
					icon: 'error'
				})
				reject(err)
			}
		}
		// 如果POST请求，需要加入自定义的header，否则后端接口会接收不到参数
		if(options.method == "post" || options.method == "POST") {
			reqParam.header = header;
		}
		// 发送请求
		uni.request(reqParam)
	})
}
