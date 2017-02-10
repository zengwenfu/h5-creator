;
(function() {
    $('.c-each').on('click', function(event) {
        var target = $(event.target || window.event.target);
        if (target.hasClass('delete')) {
            var id = target.attr('data-id');
            if (confirm('该页面的所有元素也会被删除，确定删除吗？')) {
                $.get('delete', {
                    'id': id
                }, function(data) {
                    var obj = JSON.parse(data);
                    if (obj.code != '000000') {
                        alert(obj.msg);
                    } else {
                        location.reload();
                    }
                });
            }
        } else if(target.hasClass('edit')){
            window.location.href = target.data('href');
        }else{
            window.location.href=$(this).data('href');
        }
    })
})();
