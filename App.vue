<script>
	export default {
		globalData: {
			globalUserInfo: {},
			globalUserToken: '',
			baseUrl: "http://192.168.37.24:2281/",
		},
		onLaunch: function(options) {
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-ui/index.scss";
</style>
