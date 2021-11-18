$(function() {
    var layer = layui.layer;
    var form = layui.form;
    //定义 获取可选的文章分类方法
    initCate();
    // 初始化富文本编辑器
    initEditor()

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('失败');
                }
                // 调用木模板引擎
                // console.log(res);
                var htmlStr = template('tpl-cate', res);
                // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr);
                // 一定要调用form.reader 方法
                form.render();
            }
        })
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
        // 为选择封面的按钮绑定点击事件的处理函数

    $('#btnChooseImage').on('click', function() {
            $('#coverfile').click();
        })
        // 监听coverfile的change事件，获取用户选择的文件列表
    $('#coverfile').on('change', function(e) {
            // 获取文件的列表数据
            var files = e.target.files;
            if (files.length === 0) {
                // 判断用户是否选择文件
                return layer.msg('请选择照片');
            }
            // 根据文件创建对应的文件地地址
            var newImgURL = URL.createObjectURL(files[0]);
            // 为裁剪区域重写设置图片
            $image
                .cropper('destroy') // 销毁旧的裁剪区域
                .attr('src', newImgURL) // 重新设置图片路径
                .cropper(options) // 重新初始化裁剪区域


        })
        // 定义文章的发布状态
    var art_state = '已发布';
    // 为存为草稿按钮，绑定点击事件处理函数
    $('#btnSave2').on('click', function(e) {
            // e.preventDefalut();
            art_state = '草稿';
        })
        // 为表单绑定提交事件
    $('#form-pub').on('submit', function(e) {
            e.preventDefault();
            // 基于form表单，快速创建一个formData对象
            var fd = new FormData($(this)[0]);
            fd.append('state', art_state);
            // 将封面裁剪过后的图片，输出为一个文件对象
            $image
                .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                    width: 400,
                    height: 280
                })
                .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                    // 得到文件对象后，进行后续的操作
                    // 文件对象存储到fd中
                    fd.append('cover_img', blob);
                    // 发起Ajax的请求
                    publishArticle(fd);
                })
        })
        // 定义一个发表文章的Ajax请求
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 如果提交饿是formData格式的数据，必须添加以下两个配置项 
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('失败');
                }
                layer.msg('发布文章成功');
                location.href = './art_list.html';
            }
        })
    }

})