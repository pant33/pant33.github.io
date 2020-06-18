Vue.component('scanc', {
    template: '#scanc-component',
    data() {
        return {
            prodInfo: [],
            true_num: [],
            inpid: '',
            loading: false
        }
    },
    created() {

    },
    mounted() {

    },
    methods: {
        scanQRCode() {
            var that = this
            wx.scanQRCode({
                needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                scanType: ["qrCode", "barCode"],
                success: function (res) {
                    var res = (res.resultStr).split(','),
                        result = '';
                    if (res[0] == "SGDRK")
                        result = res[res.length - 2]
                    else
                        result = res[res.length - 1]
                    that.getProdInfo(result)
                },
                error: function (res) {
                    if (res.errMsg.indexOf('function_not_exist') > 0) {
                        alert('版本过低请升级')
                    }
                }
            });
        },
        getProdInfo(prod) {
            let that = this
            var _index = msgTools.toastLoading()
            $.post('/nesm/comm/api.php?act=getProdInfo', {
                prod: parseInt(prod),
                tp: 'cp'
            }, function (res) {
                that.prodInfo = res.data
                for (let i in that.prodInfo) {
                    that.true_num[that.prodInfo[i].id] = (parseFloat(that.prodInfo[i].real_qty))
                }
                msgTools.scrollTop()
                msgTools.close(_index)
                if (that.prodInfo.length == 0) {
                    msgTools.toptips('未获取到相应产品信息')
                }
            }, 'json')
        },
        sublist(item) {
            let that = this
            if (that.true_num[item.id] == undefined) {
                msgTools.toptips('请填写实盘数量')
                return false;
            }

            if (confirm("确定盘点完成么？")) {
                $.post("/nesm/comm/api.php?act=savelog", {
                    pid: item.id,
                    prodno: item.prod_no,
                    o_use_quan: item.o_use_quan,
                    quan: item.quan,
                    dd3: item.dd3,
                    real_qty: that.true_num[item.id]
                }, function (res) {
                    if (res.code == 0) {
                        msgTools.toastSuccess("盘点成功")
                    } else {
                        msgTools.toptips(res.msg)
                    }
                }, 'json')
            }
        },
        search() {
            let that = this,
                reg = /^\s*$/g

            if (!reg.test(that.inpid)) {
                that.getProdInfo(that.inpid)
            } else {
                msgTools.toptips('请填写零件ID')
            }
        }
    }
})