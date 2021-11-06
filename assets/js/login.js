$(function() {
    // 点击去注册账号的链接
    $('#link_reg').on('click', function() {
            $('.login-box').hide();
            $('.reg-box').show();
        })
        // 点击登录的绑定事件
    $('#link_login').on('click', function() {
            $('.reg-box').hide();
            $('.login-box').show();
        })
        // 从layui中获取form对象
    var form = layui.form;
    var layer = layui.layer;
    // 通过verify方法进行自定义校验规则
    form.verify({
            // pwd的校验规则
            pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
            // 校验两次密码是否一致
            repwd: function(value) {
                // 通过形参拿到的是确认密码框中的内容，还要拿到密码框的内容，然后进行比较
                // 失败 return一个提示消息
                var pwd = $('.reg-box [name=password]').val();
                // var repwd = $('.reg-box [name=repassword]').val();
                if (pwd !== value) {
                    return '两次密码不一致';
                }
            }
        })
        // 监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
            // 阻止表单的默认提交行为
            e.preventDefault();
            // 发起Ajax请求
            var data = { username: $('#form_reg [name=usersname]').val(), password: $('#form_reg [name=password]').val() }
            $.post('http://api-breakingnews-web.itheima.net/api/reguser', data, function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('注册成功，请登录');
                // 模拟人的点击行为
                $('#link_login').click();
            })
        })
        // 监听登录表单的提交事件
    $('#form_login').submit(function(e) {
        // 阻止表单的默认提交行为
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单中的数据 serialize
            // data: $(this).serialize(),
            data: { username: $('#form_login [name=usersname]').val(), password: $('#form_login [name=password]').val() },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败');
                    // return console.log(res.message);
                }
                layer.msg('登录成功');
                // 将登录成功得到的token字符串，保存到localStorage中
                // console.log(res.token);
                localStorage.setItem('token', res.token);
                // 跳转至后台主页
                location.href = './index.html';
            }
        })
    })
})