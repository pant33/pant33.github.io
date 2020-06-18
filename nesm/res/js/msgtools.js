window.$body = $('body');
var support_scan = 0;
window.msgTools = new function (that) {
    that = this;
    var date = new Date()

    this.close = function (index) {
        $('#' + index).remove()
        return true;
    };

    this.dialog2 = function (msg, btn) {
        var dialog = "",
            _msg = msg || "",
            _btn = btn || "知道了",
            _index = date.getTime()
        dialog += '<div class="js_dialog" id="' + _index + '" style="opacity: 1;">'
        dialog += '<div class="weui-mask"></div>'
        dialog += '<div class="weui-dialog">'
        dialog += '<div class="weui-dialog__bd">' + _msg + '</div>'
        dialog += '<div class="weui-dialog__ft">'
        dialog += '<a href="javascript:;" onclick="msgTools.close(' + _index + ')" class="weui-dialog__btn weui-dialog__btn_primary">' + _btn + '</a>'
        dialog += '</div>'
        dialog += '</div>'
        dialog += '</div>'
        $body.append(dialog)
    }
    this.toptips = function (msg) {
        var _self = this,
            _index = date.getTime(),
            _html = '<div class="weui-toptips weui-toptips_warn" id="' + _index +
            '" style="display: block; opacity: 1;">' + msg +
            '</div>';
        $body.append(_html)
        setTimeout(function () {
            _self.close(_index)
        }, 2000)
    }
    this.confirm = function (msg) {
        var dialog = "",
            _msg = msg || "",
            _index = date.getTime()
        dialog += '<div class="js_dialog" id="' + _index + '" style="opacity: 1;">'
        dialog += '<div class="weui-mask"></div>'
        dialog += '<div class="weui-dialog">'
        dialog += '<div class="weui-dialog__bd">' + _msg + '</div>'
        dialog += '<div class="weui-dialog__ft">'
        dialog += '<a href="javascript:" onclick="msgTools.close(' + _index + ')" class="weui-dialog__btn weui-dialog__btn_default">取消</a>'
        dialog += '<a href="javascript:;" onclick="msgTools.close(' + _index + ')" class="weui-dialog__btn weui-dialog__btn_primary">确定</a>'
        dialog += '</div>'
        dialog += '</div>'
        dialog += '</div>'
        $body.append(dialog)
    }
    this.toastSuccess = function (msg) {
        var _self = this,
            _index = date.getTime(),
            _html = '<div id="' + _index + '" style="opacity: 1;display: block; ">'
        _html += '<div class="weui-mask_transparent"></div>'
        _html += '<div class="weui-toast">'
        _html += '<i class="weui-icon-success-no-circle weui-icon_toast"></i>'
        _html += '<p class="weui-toast__content">' + msg + '</p>'
        _html += '</div>'
        _html += '</div>';
        $body.append(_html)
        setTimeout(function () {
            _self.close(_index)
        }, 2000)

    }
    this.toastLoading = function () {
        var _self = this,
            _index = date.getTime(),
            _html = '\
                <div id="' + _index + '" style="opacity: 1;display: block; ">\
                    <div class="weui-mask_transparent"></div>\
                        <div class="weui-toast">\
                        <i class="weui-loading weui-icon_toast"></i>\
                        <p class="weui-toast__content">数据加载中</p>\
                    </div>\
                </div>';
        $body.append(_html)
        return _index;
    }
    this.pickerDate = function () {
        weui.datePicker({
            start: 1990,
            end: new Date().getFullYear() + 20,
            title: '请选择日期',
            onChange: function (result) {
                console.log(result);
            },
            onConfirm: function (result) {
                console.log(result);
            },
        });
    }
    this.scrollTop = function () {
        $('.page_body').bind('scroll', function () {
            if ($(this).scrollTop() > 300) {
                $('.top').fadeIn('slow');
            } else {
                $('.top').fadeOut('slow');
            }
        });

        $(".top").bind("click", function () {
            $(".page_body").animate({
                "scrollTop": 0
            });
        });
    }
}