(function (w, d) {
    var observer = new w.FontFaceObserver('Source Sans Pro', {
        weight: 400
    });

    observer.check().then(function () {
        d.documentElement.className += ' fonts-loaded';
    });
}(window, window.document));


$(function() {
    $('.gif-tile img').unveil(100);
});
