$(document).ready(function () {
    $('.with-scroll').addClass("displayNone");
    $(".whithout-scroll").addClass("displayBlock");
    $(".main-panel.main-box").scroll(function() {
        if ($(this).scrollTop() > 0) {
            $('.whithout-scroll').hide();
            $('.with-scroll').show();
        }
        else {
            $('.whithout-scroll').show();
            $('.with-scroll').hide();
        }
    });
});

$("#toggle").on("click", function () {
    $(".content").toggle();
});
$(".cli-show").on("click", function () {
    $(".content2").toggle();
});
$("#third").on("click", function () {
    $(".content3").toggle();
});
$("#four").on("click", function () {
    $(".content4").toggle();
});
$("#five").on("click", function () {
    $(".content5").toggle();
});
$("#six").on("click", function () {
    $(".content6").toggle();
});
$("#seven").on("click", function () {
    $(".content7").toggle();
});
$("#eight").on("click", function () {
    $(".content8").toggle();
});
$("#eleven").on("click", function () {
    $(".content11").toggle();
});
$("#twl").on("click", function () {
    $(".twl12").toggle();
});