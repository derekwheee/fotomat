$(function () {

    var hearted = JSON.parse(localStorage.getItem('hearts')) || [];

    function heartStore (id, action) {

        var hearts = JSON.parse(localStorage.getItem('hearts')) || [],
            addHeart = action === 'heart';

        if (addHeart) {
            hearts.push(id);
        } else {
            hearts.splice(hearts.indexOf(id), 1);
        }

        localStorage.setItem('hearts', JSON.stringify(hearts));

    }

    $('.gif-tile').each(function () {
        if (hearted.indexOf($(this).data('id')) > -1) {
            $(this).find('.gif-like').addClass('hearted');
        }
    });

    $('.icon-heart-outlined').on('click', function () {

        var post,
            $this = $(this),
            $parent = $this.parent(),
            id = $this.closest('.gif-tile').data('id'),
            action = $parent.hasClass('hearted') ? 'unheart' : 'heart';

        $parent.toggleClass('hearted');

        post = $.post('/api/heart/', {
            id: id,
            action: action
        });

        post.done(function (res) {
            if (res.success) {
                $this.siblings('.gif-like-count').text(res.hearts);
                heartStore(id, action);
            } else {
                $parent.toggleClass('hearted');
            }
        });

    });

});
