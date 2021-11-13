$(function() {
        // 调用获取用户信息函数
        getUserInfo();
        var layer = layui.layer;

        $('#btnLogin').on('click', function() {
            layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
                // 清空本地存储的token
                localStorage.removeItem('token');
                // 重新跳转至登录页
                location.href = '../Big event/login.html';
                // 关闭comfirm询问框
                layer.close(index);
            });
        })

    })
    // 获取用户信息的函数
function getUserInfo() {
    $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            // 请求头配置对象
            // headers: {
            //     Authorization: localStorage.getItem('token') || ''
            // },
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取信息失败');
                }
                // 调用renderAvater渲染用户头像
                renderAvater(res.data);
            },

        })
        // 渲染头像函数
    function renderAvater(user) {
        // 获取用户名称
        var name = user.nickname || user.username;
        // 设置欢迎文本
        $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
        // 用户头像
        if (user.user_pic !== null) {
            $('.layui-nav-img').attr('src', user.user_pic).show();
            $('.text-avater').hide();
        } else {
            $('.layui-nav-img').hide();
            var first = name[0].toUpperCase();
            $('.text-avater').html(first).show();
        }
    }

    // 退出功能

}