$(function () {

    /*/
     *      Utility
    /*/

    /*/ Open/Close Navigation Bar /*/
    $("#navbar-toggle").on("click", function () {
        $("#main-nav").toggleClass("show");
    });

    /*/ Open/Close Navigation Bar /*/
    $("#active-lang").on("click", function () {
        $("#more-langs").toggleClass("active");
    });

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
                setTimeout(writeTitles, 1500);

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

function writeTitles() {

    let lang = $("html").attr("lang");
    let profession = $("#profession");
    let index = 0;
    let count = 0;
    let titles;

    if (lang === "it") {
        titles = ["Sviluppatore Front End", "Programmatore Software", "Sviluppatore Back End"];
    } else {
        titles = ["Front End Developer", "Software Programmer", "Back End Developer"];
    }

    function deleteWord() {

        let size = profession.text();

        setTimeout(function () {

            profession.text(profession.text().slice(0, profession.text().length - 1));

            if (profession.text() === "") {
                setTimeout(function () {
                    count = 0;
                    setTimeout(writeWord, 600);
                }, size * 50);
            } else {
                deleteWord();
            }

        }, 45);

    }

    function writeWord() {

        profession.text(profession.text() + titles[index][count++]);

        if (count == titles[index].length) {
            index = (index + 1) % titles.length;
            setTimeout(deleteWord, 1200);
        } else {
            setTimeout(writeWord, 95);
        }

    }

    profession.text("");
    writeWord();

};

function knowledgeAnimation(self) {

    $(".languages-category, .knowledge-legend").animate({
        opacity: 1
    });

    self.find(".language").each(function (j) {

        $(this).delay(150 + j * 100).animate({
            opacity: 1
        }, 500);

        //     let experienceText = $(this).find(".experience-text");
        //     let experience = $(this).find(".experience");
        //     let languageName = $(this).find(".language-name");
        //     let languageLevel = $(this).find(".language-level");
        //     let start = experience.data("start");
        //     let years;
        //
        //     if (start === undefined) {
        //         years = experience.data("years");
        //     } else {
        //         let today = new Date();
        //         years = today.getFullYear() - start;
        //     }
        //
        //
        //
        //     $(languageName).delay(100 + j * 100).animate({
        //         opacity: 1
        //     }, 500);
        //
        //     $(languageLevel).find(".diamond").delay(100 + j * 100).animate({
        //         opacity: 1
        //     }, 500);
        //
        //     for (let i = 0; i < 7; i++) {
        //
        //         let diamond = $(`<span class="diamond"></span>`);
        //         languageLevel.append(diamond);
        //
        //         $(diamond).delay(400 + j * 100).animate({
        //             opacity: 1
        //         }, 300);
        //
        //         if (i < years) {
        //             $(diamond).delay(j * 100 + (i + j * 7) * 75).animate({
        //                 backgroundColor: "#0254d2"
        //             }, 300);
        //         }
        //
        //     }
        //
        //     if (years > 7) {
        //         years = "7+";
        //     }
        //
        //     experience.html(years);
        //     $(experienceText).delay(1200 + j * 100 + (j + 1) * 7 * 75).animate({
        //         opacity: 1
        //     }, 400);

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
