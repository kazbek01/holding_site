$(document).ready(function () {
    $('.call-menu').click(function () {
        $('.nav-box').addClass('showed');
        $('.wrapper').addClass('scaled');
        $('body').addClass('scroll-fixed');
    });
    $('.close-menu').click(function () {
        $('.nav-box').removeClass('showed');
        $('.wrapper').removeClass('scaled');
        $('body').removeClass('scroll-fixed');
    });


    $('.close-modal').click(function () {
        $('.modal-plain').removeClass('modal-show');
        $('.overlay').removeClass('overlay-showed');
        $('body').removeClass('scroll-locked');
    });

    // Variables
    const $cursor = $('.cursor');

// Functions
    const onMouseMove = (e) => {
        const x = e.pageX;
        const y = e.pageY;

        TweenMax.to($cursor, 0.5, {
            x: x,
            y: y,
            ease: Cubic.easeOut,
            force3D: true,
        }, 0.2)
    };
//Events

    document.addEventListener('mousemove', onMouseMove);


    $(".hoverable").hover(function () {
        $('.cursor').toggleClass('cursor-leave');
    });

});







