/*
 * @Description: 路由入口文件
 */
var routes = [
    //盘库
    {
        name: 'inventory',
        path: "/inventory",
        component: {
            template: "#inventory"
        },
    }, {
        name: "scanc",
        path: "/scanc",
        component: {
            template: "#scanc"
        }
    }, {
        name: "scanc2",
        path: "/scanc2",
        component: {
            template: "#scanc2"
        }
    }, {
        name: "pklist",
        path: "/pklist",
        component: {
            template: "#pklist"
        }
    },
    //入库
    {
        name: "ruku",
        path: "/ruku",
        component: {
            template: "#ruku"
        }
    }, {
        name: "cgd",
        path: "/cgd",
        component: {
            template: "#cgd"
        }
    }, {
        name: "rkd",
        path: "/rkd",
        component: {
            template: "#rkd"
        }
    },
    //出库
    {
        name: "chuku",
        path: "/chuku",
        component: {
            template: "#chuku"
        }
    }, {
        name: "lyd",
        path: "/lyd",
        component: {
            template: "#lyd"
        }
    }, {
        name: "lydzpth",
        path: "/lydzpth",
        component: {
            template: "#lydzpth"
        }
    }, {
        name: "lydmp",
        path: "/lydmp",
        component: {
            template: "#lydmp"
        }
    }, {
        name: "lydzp",
        path: "/lydzp",
        component: {
            template: "#lydzp"
        }
    }, {
        name: "lydylly",
        path: "/lydylly",
        component: {
            template: "#lydylly"
        }
    }, {
        name: "lydylth",
        path: "/lydylth",
        component: {
            template: "#lydylth"
        }
    }, {
        name: "lydwh",
        path: "/lydwh",
        component: {
            template: "#lydwh"
        }
    }, {
        name: "lydwhth",
        path: "/lydwhth",
        component: {
            template: "#lydwhth"
        }
    },
    //领用单
    {
        name: "liny",
        path: "/liny",
        component: {
            template: "#liny"
        }
    }
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