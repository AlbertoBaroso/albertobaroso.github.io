$(function () {

    const moreLangs = document.getElementById('more-langs');
    const languageSelector = document.getElementById('lang-selection');
    const navbarToggle = document.getElementById('navbar-toggle');
    const mainNav = document.getElementById('main-nav');

    /*/
     *      Utility
    /*/

    /*/ Open/Close Navigation Bar /*/
    navbarToggle.addEventListener('click',
        () => mainNav.classList.toggle("show")
    );

    /*/ Open/Close Navigation Bar /*/
    languageSelector.addEventListener('click',
        () => moreLangs.classList.toggle('active')
    );

    /*/ Check if page is already scrolled on load /*/
    checkScroll();

    /*/ onScroll: fix the navbar + section animations /*/
    $window.on("scroll resize", checkScroll);

    /*/
     *      Animations
    /*/

    /*/ Link Animations + Page scrolling /*/
    $(".nav-link").on("click", function () {

        /*/ Set clicked link as the only active link /*/
        $(".nav-link").removeClass("active");
        $(this).addClass("active");

        /*/ Close the link menu if it was open /*/
        setTimeout(function () {
            $("#main-nav.show").removeClass("show");
        }, 250);

        /*/ Stop animations on links /*/
        animateLinks = false;
        $(this).stop(true);

        /*/ Scroll animation to target /*/
        $("html, body").animate({
            scrollTop: $(`#${$(this).data("target")}-section`).offset().top
        }, 1200);

        /*/ Re-Enable animations on links /*/
        setTimeout(function () {
            animateLinks = true;
        }, 1200);

        return false;
    });

    /*/ Scroll animation to target /*/
    $(".footer-link").on("click", function () {

        $("html, body").animate({
            scrollTop: $(`#${$(this).data("target")}-section`).offset().top
        }, 1200);

        return false;

    });

    moreLangs.addEventListener('click', async (e) => {
        if (e.target && e.target.classList.contains('country-flag')) {
            const locale = e.target.dataset["lang"];
            await setLocale(locale);
            moreLangs.classList.remove('active');
            window.localStorage.setItem('lang', locale)
        }
    });

});

/*/ AnimateLinks: true -> Links can be animated because user is scrolling       /*/
/*/ AnimateLinks: false -> Links can't be animated because user clicked a link  /*/
let animateLinks = true;

/*/ Cache reference /*/
let $toAnimate = $('.animate');
let $window = $(window);

function checkAnimations(windowTop) {

    let windowHeight = $window.height();

    /*/ Check for every ".animate" element if it is in viewport /*/
    $.each($toAnimate, function () {

        let $element = $(this);
        let elementTop = $element.offset().top;
        let elementHeight = $element.outerHeight();
        let elementBottom = (elementTop + elementHeight);

        if ((elementBottom >= windowTop) && (elementTop <= windowTop + windowHeight)) {
            if ($element.attr("id") === "header-text" && $("#header-text").hasClass("animate")) {

                /*/ Custom titles animation /*/
                setTimeout(writeTitle, 1500);

            } else if ($element.hasClass("languages-container") && $element.hasClass("animate")) {

                /*/ Custom languages animation /*/
                setTimeout(function () {
                    knowledgeAnimation($element);
                }, 1000);

            }

            /*/ Standard fade-in animation /*/
            $element.removeClass('animate').addClass("show");

        }

    });

}

function checkScroll() {

    let scrollTop = $window.scrollTop();

    /*/ Change Nav Bar Style /*/
    if (scrollTop > $("#main-nav").height()) {
        $("#main-nav").addClass("nav-shadow");
    } else {
        $("#main-nav").removeClass("nav-shadow");
    }

    /*/ Link Animations /*/
    if (animateLinks) {
        checkSection(scrollTop);
    }

    /*/ Section Animations  /*/
    checkAnimations(scrollTop);

}

function checkSection(scrollTop) {

    let topbarHeight = 67;

    $("header, section").each(function () {

        let offset = $(this).offset().top;
        let height = $(this).height();
        let id = $(this).attr("id");

        if (scrollTop >= (offset - topbarHeight) && scrollTop < (offset + height)) {

            /*/ Change Active Link /*/
            $(".nav-link").removeClass("active");
            $(".nav-link").each(function () {
                if ($(this).data("target") === id.replace("-section", '')) {
                    $(this).addClass("active");
                }
            });

        }

    });

}

function writeTitle() {

    const title = "Software Engineer";
    const profession = $("#profession");

    for (let i = 1; i <= title.length; i++)
        setTimeout(() => profession.text(title.slice(0, i + 1)), 95 * i);

}

function knowledgeAnimation(self) {

    $(".languages-category, .knowledge-legend").animate({
        opacity: 1
    });

    self.find(".language").each(function (j) {

        $(this).delay(50 + j * 80).animate({
            opacity: 1
        }, 400);

    });

}


/*/ Show/Hide Skill Descriptions /*/
$(".skill-container").on("click", function () {

    let skill = $(this).data("skill");
    let hidden = true;

    $(".skill-description").each(function () {
        if ($(this).data("skill") == skill && $(this).is(":visible")) {
            hidden = false;
        }
    });

    $(".skill-description").slideUp();

    if (hidden) {
        $(".skill-description").each(function () {
            if ($(this).data("skill") == skill) {
                $(this).slideDown();
            }
        });
    }

});

/*/ Back to Top Link Animation /*/
$("#top-button").on("click", function () {

    $("html, body").animate({
        scrollTop: 0
    }, 1000);

    return false;

});
