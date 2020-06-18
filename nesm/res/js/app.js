/*
 * @Description: 路由入口文件
 */
var routes = [

];
// 定义路由组件
var router = new VueRouter({
    routes
});
Vue.prototype.$weui = weui
// Vue.prototype.$vant = vant
window.global_vue = new Vue({
    router,
    data() {
        return {
            tp: 'prod',
            t1: '<van-swipe-cell>\
            <template #left>\
                <van-button square type="primary" text="选择" />\
            </template>\
            <van-cell :border="false" title="单元格" value="内容" />\
            <template #right>\
                <van-button square type="danger" text="删除" />\
                <van-button square type="primary" text="收藏" />\
            </template>\
        </van-swipe-cell>',
            t2: '<van-swipe-cell>\
            <template #left>\
                <van-button square type="primary" text="选择" />\
            </template>\
            <template #right>\
                <van-button square type="danger" text="删除"></van-button>\
                <van-button square type="primary" text="收藏"></van-button>\
            </template>\
            <van-cell :border="false" title="单元格" value="内容" />\
        </van-swipe-cell>',
        }
    },
    mounted() {

    },
    methods: {
        go(path) {
            this.$router.push({
                path: path
            }).catch(data => {})
        },
        back() {
            this.$router.go(-1)
        }
    }
}).$mount('#container')
Vue.use(vant.Lazyload)