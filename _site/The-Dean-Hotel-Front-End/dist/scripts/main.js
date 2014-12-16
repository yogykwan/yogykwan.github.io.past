// (function() {
//	'use strict';

	function panelFull() {
		$('.panel.full').height($(window).height());

		if ($(document).width() > 640) {
			$('.panel.full').width($(window).outerWidth() - 320);
		} else {
			$('.panel.full').width($(window).outerWidth() + 15);
		}
	}

	function panelHalf() {
		if ($(document).width() < 992) {
			$('.panel.half').css('min-height', $(window).height() / 3);
		} else {
			$('.panel.half').css('min-height', $(window).height() / 2);
		}
	}
	$(panelFull);
	$(window).resize(panelFull);
	$(panelHalf);
	$(window).resize(panelHalf);
	$('.book-now').click(function() {
		if ($('.booking').hasClass('formed')) {
			$('#bookingform').fadeToggle('fast', function() {
				$('#navigation').fadeToggle('fast');
			});
			$('.booking').toggleClass('formed');
			$('.book-now').html('BOOK NOW');
		} else {
			$('#navigation').fadeToggle('fast', function() {
				$('#bookingform').fadeToggle('fast');
			});
			$('.booking').toggleClass('formed');
			$('.book-now').html('MENU');
		}
	});
	$('.input-daterange').datepicker({
		todayBtn: 'linked',
		autoclose: true,
		todayHighlight: true,
		startDate: "01/12/2014"
	});
	$('select').selectBox();
	$('#pushmedown').click(function() {
		var scrollMe = $('.panel.half').height() + 'px';
		if (scrollMe === null || scrollMe === 'nullpx') {
			scrollMe = $('article.lead').outerHeight() + 'px';
		}
		$('body').animate({
			scrollTop: scrollMe
		}, '500', 'swing');
		console.log(scrollMe);
	});
	$('#mobilemenu').click(function() {
		if ($('.menu').hasClass('menu-open')) {
			$('#mobilemenu').html('MENU');
			$('.menu').slideToggle('slow');
			$('.menu').toggleClass('menu-open');
		} else {
			$('#mobilemenu').html('CLOSE');
			$('.menu').slideToggle('slow');
			$('.menu').toggleClass('menu-open');
		}
	});
	$('.room').click(function() {
		if ($(document).width() < 640) {
			$(this).toggleClass('roomhovermobile');
		} else {
			return;
		}
	});
// })();



$(document).ready(function() {
	$(".fancybox-thumb").fancybox({
		prevEffect	: 'elastic',
		nextEffect	: 'elastic',
		helpers	: {
			title	: {
				type: 'outside'
			},
			thumbs	: {
				width	: 50,
				height	: 50
			}
		}
	});
});