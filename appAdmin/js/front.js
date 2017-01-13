if ($.cookie("theme_csspath")) {
    $('link#theme-stylesheet').attr("href", $.cookie("theme_csspath"));
}

$(function() {
    animations();
    utils();
});


$(window).load(function() {
    $(this).alignElementsSameHeight();
});

$(window).resize(function() {
    setTimeout(function() {
	$(this).alignElementsSameHeight();
    }, 150);
});


function utils() {

    /* click on the box activates the radio */

    $('#checkout').on('click', '.box.shipping-method, .box.payment-method', function(e) {
		var radio = $(this).find(':radio');
		radio.prop('checked', true);
    });
    /* click on the box activates the link in it */

    $('.box.clickable').on('click', function(e) {
		window.location = $(this).find('a').attr('href');
    });
    /* external links in new window*/

    $('.external').on('click', function(e) {
		e.preventDefault();
		window.open($(this).attr("href"));
    });

}

/* animations */
function animations() {
    delayTime = 0;
    $('[data-animate]').css({opacity: '0'});
    $('[data-animate]').waypoint(function(direction) {
	delayTime += 150;
	$(this).delay(delayTime).queue(function(next) {
	    $(this).toggleClass('animated');
	    $(this).toggleClass($(this).data('animate'));
	    delayTime = 0;
	    next();
	    //$(this).removeClass('animated');
	    //$(this).toggleClass($(this).data('animate'));
	});
    },
	    {
		offset: '90%',
		triggerOnce: true
	    });

    $('[data-animate-hover]').hover(function() {
	$(this).css({opacity: 1});
	$(this).addClass('animated');
	$(this).removeClass($(this).data('animate'));
	$(this).addClass($(this).data('animate-hover'));
    }, function() {
	$(this).removeClass('animated');
	$(this).removeClass($(this).data('animate-hover'));
    });

}

$.fn.alignElementsSameHeight = function() {
    $('.same-height-row').each(function() {

	var maxHeight = 0;

	var children = $(this).find('.same-height');

	children.height('auto');

	if ($(document).width() > 768) {
	    children.each(function() {
		if ($(this).innerHeight() > maxHeight) {
		    maxHeight = $(this).innerHeight();
		}
	    });

	    children.innerHeight(maxHeight);
	}

	maxHeight = 0;
	children = $(this).find('.same-height-always');

	children.height('auto');

	children.each(function() {
	    if ($(this).innerHeight() > maxHeight) {
		maxHeight = $(this).innerHeight();
	    }
	});

	children.innerHeight(maxHeight);

    });
}

// $('#search-input').blur(
//     function(){
//     	console.log('blur');
//         $(this).val('hola');
//     });