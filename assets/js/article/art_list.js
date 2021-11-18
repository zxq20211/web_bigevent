$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
            const dt = new Date(date);
            var y = padZero(dt.getFullYear());
            var m = padZero(dt.getMonth() + 1);
            var d = padZero(dt.getDate());
            var hh = padZero(dt.getHours());
            var mm = padZero(dt.getMinutes());
            var ss = padZero(dt.getSeconds());
            return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
        }
        // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }
    // 定义一个查询的参数对象，将来请求数据的时候
    // 需要将请求参数对象提交给服务器
    var q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示多少条数据
        cate_id: '', //文章分类的 Id
        state: '' //文章的状态，可选值有：已发布、草稿
    }
    initTable();
    initCate();
    // 获取文章列表数据
    function initTable() {
        $.ajax({
            mehtod: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('失败');
                    // return console.log(res);
                }

                // 使用模板引擎渲染页面数据
                var htmlStr = template('tpl-table', res);
                // console.log(htmlStr);
                $('tbody').html(htmlStr);
                // 调用分页方法
                renderPage(res.total);
            }
        })
    }
    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            mehtod: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败');
                    // return console.log(res);
                }

                // 使用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res);
                // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr);
                // 通过layui重新渲染表单区域的ui结构
                form.render();
            }
        })
    }
    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function(e) {
            e.preventDefault();
            // 获取表单中获取表单项的值
            var cate_id = $('[name=cate_id]').val();
            var state = $('[name=state]').val();
            // 为查询参数对齐q中对应的属性赋值
            q.cate_id = cate_id;
            q.state = state;
            // 根据最新的筛选条件，重新渲染表格的数据
            initTable();
        })
        // 定义渲染分页的方法
    function renderPage(total) {
        // console.log(total);
        // 调用 laypage.render方法来渲染分页结构
        laypage.render({
            elem: 'pageBox', //分页容器id
            count: total, //总数据条数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //默认显示第几页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页切换时，触发jump回调
            // 1.点击页码时，触发jump  
            // 2.只要调用了;laypage.render()方法，触发jump方法  true
            jump: function(obj, first) {
                // 把最新的页码值，赋值给q这个查询参数对象中
                q.pagenum = obj.curr;
                // 吧最新的条目数，赋值给q这个查询参数对象中
                q.pagesize = obj.limit;
                // 根据最新的q获取对应的数据列表，并渲染表格    
                if (!first) {
                    initTable();
                }

            }
        });
    }
    // 通过代理的形式，为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function() {
            var len = $('.btn-delete').length;
            // console.log(len)
            var id = $(this).attr('data-id');
            // 询问是否删除数据
            layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
                //do something
                $.ajax({
                    mehtod: 'GET',
                    url: '/my/article/delete/' + id,
                    success: function(res) {
                        if (res.status !== 0) {
                            return layer.msg('失败');
                        }
                        layer.msg('删除成功');
                        // 当数据删除完成后，判断当前页中是否还有剩余数据，无则减一
                        if (len === 1) {
                            // 页码值最小为1
                            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                        }
                        initTable();
                    }
                })
                layer.close(index);
            });
        })
        // 通过代理的形式，为编辑按钮绑定点击事件处理函数

    $('tbody').on('click', '.btn-edit', function() {
        // console.log('dd');
        location.href = './art_edit.html';
        initArtInfo();
        var id = $(this).attr('data-id');
        console.log(id);

        function initArtInfo() {
            $.ajax({
                method: 'GET',
                url: '/my/article/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('S');
                    }
                    console.log('ol');
                }
            })
        }
    })

})