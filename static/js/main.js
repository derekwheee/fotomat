(function (w, d) {
    var observer = new w.FontFaceObserver('Source Sans Pro', {
        weight: 400
    });

    observer.check().then(function () {
        d.documentElement.className += ' fonts-loaded';
    });
}(window, window.document));

function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) {
                func.apply(context, args);
            }
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) {
            func.apply(context, args);
        }
    };
}

$(function() {

    var scrollHandler = debounce(function() {
        $('img').each(function () {
            if (!$.inViewport($(this), 800)) {
                $(this).hide();
            } else {
                $(this).show();
            }
        });
    }, 250);

    $.extend(verge);

    $('.gif-tile img').unveil(100);

    $('img').each(function () {
        if (!$.inViewport($(this))) {
            $(this).hide();
        } else {
            $(this).show();
        }
    });

    $('body').scroll(scrollHandler);
});
