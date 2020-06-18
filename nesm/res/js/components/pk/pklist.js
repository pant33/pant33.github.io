Vue.component('pklist', {
    template: '#pklist-component',
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
        let that = this,
            date = new Date()
        that.inpid = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
    },
    methods: {
        getProdInfo(prod) {
            let that = this
            var _index = msgTools.toastLoading()
            $.post('/nesm/comm/api.php?act=getPkList', {
                date: prod,
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
            let that = this,
                date = new Date(),
                now = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
            if (that.true_num[item.id] == undefined) {
                msgTools.toptips('请填写实盘数量')
                return false;
            }

            if (confirm("确定盘点完成么？")) {
                if (now != that.inpid) {
                    msgTools.toptips('只能修改当天的盘点记录')
                    return false;
                }

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
                msgTools.toptips('请填写盘点日期')
            }
        },
        datePicker() {
            let that = this,
                date = new Date()
            that.$weui.datePicker({
                start: date.getFullYear() - 30,
                end: date.getFullYear() + 1,
                defaultValue: [date.getFullYear(), date.getMonth() + 1, date.getDate()],
                onConfirm: function (result) {
                    that.inpid = result[0].value + '-' + (result[1].value) + '-' + result[2].value
                    that.search()
                }
            });
        }
    }
})