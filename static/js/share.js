$(function () {

    $('.gif-share').on('click', function () {

        var $this = $(this),
            $dest = $this.siblings('.gif-share-dest'),
            destActive = $dest.hasClass('is-active');

        $this.blur();
        $('.gif-share-dest').removeClass('is-active');

        if (!destActive) {
            $dest.addClass('is-active');
        }

    });

    $('.gif-share-facebook').on('click', function () {

        var id = $(this).closest('.gif-tile').data('id');

        FB.ui({
            method: 'share',
            href: location.href + id
        }, function(){});

        return false;

    });

});
