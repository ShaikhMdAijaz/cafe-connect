
        $(".lft-scroll .navs-top .nav-item").click(function () {
            $("body").removeClass("sidebar-icon-only");
            $(".lft-sidebar").removeClass("active");
        });
        $(".toggle-btn").click(function () {
            $(".collapse").removeClass("show");
        });

        $(".toggle-btn").click(function () {
            $(".collapse").removeClass("show");
            $(".sidebar  .nav-link").attr("aria-expanded", "false");
        });

