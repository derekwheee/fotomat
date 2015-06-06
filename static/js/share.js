$(function () {

    $('body').on('click', function () {

        $('.gif-share-dest.is-active').removeClass('is-active');

    });

    $('.gif-share').on('click', function (e) {

        var $this = $(this),
            $dest = $this.siblings('.gif-share-dest'),
            destActive = $dest.hasClass('is-active');

        $this.blur();
        $('.gif-share-dest').removeClass('is-active');

        if (!destActive) {
            $dest.addClass('is-active');
        }

        e.stopPropagation();

    });

    $('.gif-share-facebook').on('click', function (e) {

        var id = $(this).closest('.gif-tile').data('id');

        FB.ui({
            method: 'share',
            href: location.host + '/' + id
        }, function(){});

        e.preventDefault();

    });

});
