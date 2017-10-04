
var RA = RA || {};

(function($) {

    RA.respondToXS = function () {
        $(".layout-indicator").html("XS")
    }

    RA.respondToS = function () {
        $(".layout-indicator").html("S");
    }

    RA.respondToM = function () {
        $(".layout-indicator").html("M");
    }

    RA.respondToL = function () {
        $(".layout-indicator").html("L");
    }

    RA.respondToXL = function () {
        $(".layout-indicator").html("XL");
        $("body").addClass("flyout-is-visible");
    }

    RA.videoPosition = function () {
        var videoWrapper = $(".wrapper-video");
        $(window).scroll(function() {
            if ($(document).scrollTop() > 80) {
                $("body").addClass("fix-video");
                // videoWrapper.animate({height: "200px"});
            } else {
                $("body").removeClass("fix-video");
                // videoWrapper.animate({height: "500px"});
            }
        });
    }

    RA.flyoutToggle = function () {
        var closeButton = $(".icon-close");
        var openButton = $(".icon-open");

        closeButton.hide();

        closeButton.click( function () {
            var flyout = $(".wrapper-flyout");
            flyout.hide();
            openButton.show();
            $(this).hide();
            $("body").addClass("flyout-is-hidden");
            $("body").removeClass("flyout-is-visible");
        });

        openButton.click( function () {
            var flyout = $(".wrapper-flyout");
            flyout.show();
            closeButton.show();
            $(this).hide();
            $("body").addClass("flyout-is-visible");
            $("body").removeClass("flyout-is-hidden");
        });
    }

    // Runs on page load

    $(document).ready( function () {
        //RA.videoPosition();
        RA.flyoutToggle();
    });

})(window.jQuery);
