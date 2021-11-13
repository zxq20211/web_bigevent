// 每次调用get post 的时候会先调用下面这个函数

$.ajaxPrefilter(function(options) {
    // console.log(options.url);
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
    // 统一为有权限的接口，设置headers请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = { Authorization: localStorage.getItem('token') || '' }
    }
    // 全局同意挂载 complete 函数
    // 无论成功还是失败，都会调用complete函数
    options.complete = function(res) {
        // 在complete函数中 responseJSON 拿到服务器响应回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 清空本地存储的token
            localStorage.removeItem('token');
            // 重新跳转至登录页
            location.href = '../Big event/login.html';
        }
    }


})