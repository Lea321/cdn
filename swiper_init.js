var swiper = new Swiper('.blog-slider', {
    passiveListeners: true,
    spaceBetween: 50,
    effect: 'fade',
    loop: true,
    // autoplay: false,
    autoplay: {
        disableOnInteraction: true,
        delay: 5000
    },
    mousewheel: true,
    // autoHeight: true,
    pagination: {
        el: '.blog-slider__pagination',
        clickable: true,
    }
});

var comtainer = document.getElementById('swiper_container');
if (comtainer !== null) {
    comtainer.onmouseenter = function() {
        swiper.autoplay.stop();
    };
    comtainer.onmouseleave = function() {
        swiper.autoplay.start();
    }
} else {}