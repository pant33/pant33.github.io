/**
 * Created by jf on 2015/9/11.
 * Modified by bear on 2016/9/7.
 */
function fastClick() {
    var supportTouch = function () {
        try {
            document.createEvent("TouchEvent");
            return true;
        } catch (e) {
            return false;
        }
    }();
    var _old$On = $.fn.on;

    $.fn.on = function () {
        if (/click/.test(arguments[0]) && typeof arguments[1] == 'function' && supportTouch) { // 只扩展支持touch的当前元素的click事件
            var touchStartY, callback = arguments[1];
            _old$On.apply(this, ['touchstart', function (e) {
                touchStartY = e.changedTouches[0].clientY;
            }]);
            _old$On.apply(this, ['touchend', function (e) {
                if (Math.abs(e.changedTouches[0].clientY - touchStartY) > 10) return;

                e.preventDefault();
                callback.apply(this, [e]);
            }]);
        } else {
            _old$On.apply(this, arguments);
        }
        return this;
    };
}

function androidInputBugFix() {
    if (/Android/gi.test(navigator.userAgent)) {
        window.addEventListener('resize', function () {
            if (document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA') {
                window.setTimeout(function () {
                    document.activeElement.scrollIntoViewIfNeeded();
                }, 0);
            }
        })
    }
}

function setJSAPI() {
    $.getJSON('/nesm/comm/api.php?act=jssdk&url=' + encodeURIComponent(location.href.split('#')[0]), function (respone) {
        var res = respone.data
        wx.config({
            beta: true,
            debug: false,
            appId: res.appId,
            timestamp: parseInt(res.timestamp),
            nonceStr: res.nonceStr,
            signature: res.signature,
            jsApiList: [
                'closeWindow',
                'scanQRCode',
                'chooseImage',
                'setBounceBackground'
            ]
        });
        wx.ready(function () {
            wx.invoke('setBounceBackground', {
                'backgroundColor': '#ededed',
                'footerBounceColor': '#ededed'
            });
            wx.checkJsApi({
                jsApiList: [
                    'scanQRCode'
                ],
                success: function (res) {
                    support_scan = 1;
                }
            });
        });
    });
}

function setPageManager() {
    var pages = {},
        tpls = $('script[type="text/html"]');

    for (var i = 0, len = tpls.length; i < len; ++i) {
        var tpl = tpls[i],
            name = tpl.id.replace(/tpl_/, '');
        pages[name] = {
            name: name,
            url: '#' + name,
            template: '#' + tpl.id
        };
    }
    pages.home.url = '#';
    for (var page in pages) {
        pageManager.push(pages[page]);
    }
    pageManager
        .setDefault('home')
        .init();
}

function init() {
    fastClick();
    androidInputBugFix();
    setJSAPI()


    /*! 注册 data-id 事件行为 */
    $body.on('click', '[data-id]', function () {
        id = this.getAttribute('data-id');
        if (id)
            global_vue.go(id);
    });

    // /*! 注册 data-scanc 事件行为 */
    // $body.on('click', '[data-scanc-prod]', function () {
    //     scanQRCode(global_vue.getProdInfo)
    // });

    /*! 注册 data-back 事件行为 */
    $body.on('click', '[data-back]', function () {
        global_vue.back()
    });
}
init();