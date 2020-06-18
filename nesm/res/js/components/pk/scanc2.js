Vue.component('scanc2', {
    template: '#scanc2-component',
    data() {
        return {
            prodInfo: [],
            true_num: [],
            inpid: ''
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
                needResult: 1,
                scanType: ["qrCode", "barCode"],
                success: function (res) {
                    var result = res.resultStr;
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
                prod: prod,
                tp: 'hj'
            }, function (res) {
                that.prodInfo = res.data
                for (let i in that.prodInfo) {
                    that.true_num[that.prodInfo[i].id] = (parseFloat(that.prodInfo[i].real_qty))
                }
                msgTools.close(_index)
                msgTools.scrollTop()
                if (that.prodInfo.length == 0) {
                    msgTools.toptips('未获取到相应产品信息')
                }
            }, 'json')
        },
        sublist(item) {
            let that = this
            if (that.true_num[item.id] == undefined) {
                msgTools.toptips('请填写实盘数量', '关闭')
                return false;
            }
            if (confirm("确定盘点完成么？")) {
                var _index = msgTools.toastLoading()
                $.post("/nesm/comm/api.php?act=savelog", {
                    pid: item.id,
                    prodno: item.prod_no,
                    o_use_quan: item.o_use_quan,
                    quan: item.quan,
                    dd3: item.dd3,
                    real_qty: that.true_num[item.id]
                }, function (res) {
                    if (res.code == 0) {
                        msgTools.close(_index)
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
            // console.log(reg.test(that.inpid))
            // msgTools.toptips(reg.test(that.inpid))
            // return false;
            if (!reg.test(that.inpid)) {
                that.getProdInfo(that.inpid)
            } else {
                msgTools.toptips('请填写货架编号')
            }
        }
    }
})