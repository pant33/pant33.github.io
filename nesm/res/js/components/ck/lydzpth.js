Vue.component('lydzpth', {
    template: '#lydzpth-component',
    data() {
        return {
            prodInfo: [],
            local_no: [],
            supp: [],
            batch: [],
            rkop: [],
            dept: [],
            localInfo: [],
            suppInfo: [],
            batchInfo: [],
            rkopInfo: [],
            deptInfo: [],
            cate: 'BLBPV/',
            loading: false,
            did: 54,
            suppshow: [],
            tp: 'prod',
        }
    },
    created() {
        var that = this
    },
    mounted() {
        var that = this
        // that.cate = 'PCF/20/2.62/XF22XX/'
        // that.getProdInfo()
        $.post('/nesm/comm/api.php?act=getDgtype', {}, function (res) {
            if (res.data) {
                for (i in res.data) {
                    that.suppInfo.push(res.data[i])
                }
            }
        }, 'json')
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
                    that.local_no[that.prodInfo[i].id] = (that.prodInfo[i].LOCAL_NO || '')
                    that.batch[that.prodInfo[i].id] = 'GRK-' + that.prodInfo[i].id
                    that.rkop[that.prodInfo[i].id] = (that.prodInfo[i].op || '')
                    that.dept[that.prodInfo[i].id] = 8
                    that.supp[that.prodInfo[i].id] = 16
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

            if (confirm("确定出库么？")) {
                $.post("/nesm/comm/api.php?act=save_ck_ckd", {
                    imp_id: that.did,
                    local_no: that.local_no[item.id],
                    batch_no: that.batch[item.id],
                    ind: that.supp[item.id],
                    dept: that.dept[item.id],
                    rk_ss1: item.id,
                    rk_ss2: item.prod_id,
                }, function (res) {
                    if (res.msg == 'ok') {
                        msgTools.toastSuccess("出库成功")
                        setTimeout(function () {
                            that.getProdInfo()
                        }, 2000)
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
        },
        getSupply(item) {
            let that = this
            weui.picker(that.suppInfo, {
                defaultValue: [16],
                onConfirm: function (result) {
                    that.supp[item.id] = result[0].value
                    $("#supp_input_" + item.id).val(result[0].label)
                },
                title: '出库单据分类'
            });
        },
        getDept(item) {
            let that = this
            $.post('/nesm/comm/api.php?act=getDept', {
                prod: item.prod_id
            }, function (res) {
                if (res.data) {
                    for (i in res.data) {
                        that.rkopInfo.push(res.data[i])
                    }
                }
                weui.picker(that.rkopInfo, {
                    defaultValue: [8],
                    onConfirm: function (result) {
                        that.dept[item.id] = result[0].value
                        $("#dept_input_" + item.id).val(result[0].label)
                    },
                    title: '选择部门'
                });
            }, 'json')
        },
    }
})