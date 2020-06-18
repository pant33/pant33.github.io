Vue.component('cgd', {
    template: '#cgd-component',
    data() {
        return {
            prodInfo: [],
            local_no: [],
            cate: '',
            loading: false,
            did: 59,
            tp: 'prod',
        }
    },
    created() {
        var that = this
    },
    mounted() {
        var that = this
        that.getProdInfo()
    },
    methods: {
        scanQRCode(item) {
            var that = this
            wx.scanQRCode({
                needResult: 1,
                scanType: ["qrCode", "barCode"],
                success: function (res) {
                    var res = (res.resultStr).split(',')
                    var result = res[res.length - 1]
                    // result = '7-011G'
                    that.local_no[item.ID] = result
                    $('#js_input_' + item.ID).val(result)
                },
                error: function (res) {
                    if (res.errMsg.indexOf('function_not_exist') > 0) {
                        alert('版本过低请升级')
                    }
                }
            });
        },
        getProdInfo() {
            let that = this
            var _index = msgTools.toastLoading()
            $.post('/nesm/comm/api.php?act=get_rk_lists', {
                did: that.did,
                cate: that.cate,
                tp: that.tp
            }, function (res) {
                that.prodInfo = res.data
                for (let i in that.prodInfo) {
                    that.local_no[that.prodInfo[i].ID] = ''
                }
                msgTools.scrollTop()
                msgTools.close(_index)
                if (that.prodInfo.length == 0) {
                    msgTools.toptips('未获取到记录')
                }
            }, 'json')
        },
        sublist(item) {
            let that = this,
                reg = /^\s*$/g
            if (reg.test(that.local_no[item.ID])) {
                msgTools.toptips('请输入料位号')
                return false;
            }

            if (confirm("确定完成入库么？")) {
                $.post("/nesm/comm/api.php?act=save_rk_cgd", {
                    imp_id: that.did,
                    local_no: that.local_no[item.ID],
                    rk_ss1: item.ID,
                    rk_ss2: item.SNO,
                    rk_ss3: item.SN,
                }, function (res) {
                    if (res.code == 0) {
                        msgTools.toastSuccess("入库成功")
                        that.getProdInfo()
                    } else {
                        msgTools.toptips(res.msg)
                    }
                }, 'json')
            }
        },
        search(tp) {
            let that = this,
                reg = /^\s*$/g
            if (reg.test(that.cate)) {
                msgTools.toptips('请输入产品名称')
                return false;
            }
            that.tp = tp
            that.getProdInfo()
        }
    }
})