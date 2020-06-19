import {hex_sha1} from "./MD5"
import wx from "weixin-js-sdk"
import NativeShare from "nativeshare"
function share(imgSrc,a) {
    var url = window.location.href;
    var title = '女装头条';
    var desc = '为你精选优质热门的服装行业资讯，带你了解服装行业近期最新动态';
    var time = Math.round(new Date().getTime() / 1000);
    var nonceStr = Math.random().toString(36).substr(2);

    var string1 = 'jsapi_ticket=' + a + '&noncestr=' + nonceStr + '&timestamp=' + time + '&url=' + url;
    var signature = hex_sha1(string1);
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: 'wx73498eb68db5c46d', // 必填，公众号的唯一标识
            timestamp: time, // 必填，生成签	名的时间戳
            nonceStr: nonceStr, // 必填，生成签名的随机串
            signature: signature,// 必填，签名，见附录1
            jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        wx.ready(function () {
            //微信朋友圈
            wx.onMenuShareTimeline({
                title: title,
                link: url,
                imgUrl: imgSrc,
                success: function (res) {
                },
                cancel: function (res) {
                }
            });
            //发送给朋友
            wx.onMenuShareAppMessage({
                title: title, // 分享标题
                desc: desc, // 分享描述
                link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: imgSrc, // 分享图标
                type: 'link', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });

            //分享到QQ
            wx.onMenuShareQQ({
                title: title, // 分享标题
                desc: desc, // 分享描述
                link: url, // 分享链接
                imgUrl: imgSrc, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
            //分享到QQ空间
            wx.onMenuShareQZone({
                title: title, // 分享标题
                desc: desc, // 分享描述
                link: url, // 分享链接
                imgUrl: imgSrc, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
        });
    } else {
        var nativeShare = new NativeShare({
            wechatConfig: {
                appId: 'wx73498eb68db5c46d',
                timestamp: time,
                nonceStr: nonceStr,
                signature: signature,
            },
            // 让你修改的分享的文案同步到标签里，比如title文案会同步到<title>标签中
            // 这样可以让一些不支持分享的浏览器也能修改部分文案，默认都不会同步
            syncDescToTag: true,
            syncIconToTag: true,
            syncTitleToTag: true,
        });
        nativeShare.setShareData({
            icon: imgSrc,
            link: url,
            title: title,
            desc: desc,
            from: '@fa-ge',
        });
    }
}
export default share