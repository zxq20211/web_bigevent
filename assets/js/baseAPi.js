// 每次调用get post 的时候会先调用下面这个函数

$.ajaxPrefilter(function(options) {
    // console.log(options.url);
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
})