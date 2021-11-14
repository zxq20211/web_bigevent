$(function() {
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须1~6个字符'
            }
        }
    })
    initUserInfo();
    // 初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败');
                }
                // console.log(res);
                // 调用form.val获取信息
                form.val('formUserIofo', res.data);
            }
        })
    }
    // 重置表单的数据
    $('#btnReset').on('click', function(e) {
            // 阻止表单的默认提交行为
            e.preventDefault();
            initUserInfo();
        })
        // 监听表单的提交事件
    $('.layui-form').on('submit', function(e) {
        // 阻止表单的默认提交行为
        e.preventDefault();
        //  发起Ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('失败');
                }
                layer.msg('成功');
                // console.log(res);
                // 调用父页面的方法
                window.parent.getUserInfo();
            }
        })
    })
})