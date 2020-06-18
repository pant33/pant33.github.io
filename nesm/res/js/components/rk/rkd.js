Vue.component('rkd', {
    template: '#rkd-component',
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
            cate: '',
            loading: false,
            did: 67,
            suppshow: [],
            tp: 'prod'
        }
    },
    created() {
        var that = this
    },
    mounted() {
        var that = this
        // that.cate = 'PCF/20/2.62/XF22XX/'
        that.getProdInfo()
        $.post('/nesm/comm/api.php?act=getSupply', {}, function (res) {
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
                    that.supp[that.prodInfo[i].id] = (that.prodInfo[i].suppid || '')
                    that.suppshow[that.prodInfo[i].id] = false
                    that.batch[that.prodInfo[i].id] = ''
                    that.rkop[that.prodInfo[i].id] = (that.prodInfo[i].op || '')
                    that.dept[that.prodInfo[i].id] = (that.prodInfo[i].dept_1 || '')
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
            if (reg.test(that.batch[item.id])) {
                msgTools.toptips('请选择批次号')
                return false;
            }

            if (confirm("确定完成入库么？")) {
                $.post("/nesm/comm/api.php?act=save_rk_cgd", {
                    imp_id: that.did,
                    local_no: that.local_no[item.id],
                    batch_no: that.batch[item.id],
                    supp: that.supp[item.id],
                    dept: that.dept[item.id],
                    rk_ss1: item.id,
                    rk_ss2: item.prod_id,
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
        },
        getLocalNo(item) {
            let that = this
            $.post('/nesm/comm/api.php?act=getLocalNo', {
                prod: item.prod_id
            }, function (res) {
                that.localInfo = [{
                    label: '0',
                    value: '0'
                }]
                if (res.data) {
                    for (i in res.data) {
                        that.localInfo.push(res.data[i])
                    }
                }
                weui.picker(that.localInfo, {
                    className: 'custom-classname',
                    container: 'body',
                    defaultValue: [item.LOCAL_NO],
                    onConfirm: function (result) {
                        that.local_no[item.id] = result[0].value
                        $("#local_input_" + item.id).val(result[0].value)
                    },
                    title: '选择料位号'
                });
            }, 'json')
        },
        getSupply(item) {
            let that = this
            if (that.suppshow[item.id] == false) {
                msgTools.toptips('当前批次不允许修改供应商')
                return false;
            }
            weui.picker(that.suppInfo, {
                className: 'custom-classname',
                container: 'body',
                defaultValue: [item.suppid],
                onConfirm: function (result) {
                    that.supp[item.id] = result[0].value
                    $("#supp_input_" + item.id).val(result[0].label)
                },
                title: '选择供应商'
            });
        },
        getBatchNo(item) {
            let that = this
            $.post('/nesm/comm/api.php?act=getBatchNo', {
                prod: item.prod_id
            }, function (res) {
                that.batchInfo = []
                if (res.data) {
                    for (i in res.data) {
                        that.batchInfo.push(res.data[i])
                    }
                }
                weui.picker(that.batchInfo, {
                    className: 'custom-classname',
                    container: 'body',
                    defaultValue: [],
                    onConfirm: function (result) {
                        if (result[0].cid == null) {
                            that.suppshow[item.id] = true
                        }
                        that.batch[item.id] = result[0].value
                        $("#batch_input_" + item.id).val(result[0].label)
                    },
                    title: '选择批次号'
                });
            }, 'json')
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
                    className: 'custom-classname',
                    container: 'body',
                    defaultValue: [item.dept_1],
                    onConfirm: function (result) {
                        that.dept[item.id] = result[0].value
                        $("#dept_input_" + item.id).val(result[0].label)
                    },
                    title: '选择入库部门'
                });
            }, 'json')
        },
    }
})