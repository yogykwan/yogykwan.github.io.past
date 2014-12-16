
var homeHero = function(){
	var homeClasses = ['heading', 'heading2', 'heading3', 'heading4'];
	counter = 0;
	setInterval(function(){
		$('.headInitial').removeClass('heading heading2 heading3 heading4').fadeIn(4000).addClass(homeClasses[counter]).show().css({'transition': '4s'}).delay(9000);
		if(counter === homeClasses.length - 1){
			counter = 0;
		}else{
			counter++;
		};
	}, 7000);
	console.log(counter);
};	

// var homeHero = function(){
// 	var homeClasses = ['heading', 'heading2', 'heading3', 'heading4'];
// 	var i;
	
// 		var className = function(){$.each(homeClasses, function(i){
// 			var currentName = $(this).fadeIn(1000).delay(5000).fadeOut(1000);	
// 			if (i === 0){
// 				currentName = ($(this).get().join(""));
// 			}else if (i === 1){
// 				currentName = ($(this).get().join(""));
// 			}else if (i === 2){
// 				currentName = ($(this).get().join(""));
// 			}else {
// 				currentName = ($(this).get().join(""));
// 			};
// 			console.log(currentName);
// 			$('.headInitial').removeClass(currentName);
// 			$('.headInitial').addClass(currentName).animate({'opacity': 1}).delay(5000).stop();
// 				console.log(currentName)	
// 				});
				
// 		};
// 		className();
// 	setInterval(function(){className}, 1000);
// };	


var logoChange = function(){
	$(window).scroll(function(){
		if ($(this).scrollTop() > 500) {
			$('.logo').hide();
			$('.miniLogo').show();
			// $('.imgLogo').css({'top':'15px', 'left':'0px'});
			$('.intro').animate({'opacity':1}, 1200);	
		} else {
			$('.logo').show();
			$('.miniLogo').hide();
		}; 
	});
};

var homeSlide = function(){
	$('a[href=#topNav]').on('click', function(e){
		e.preventDefault();
		$('html,body').animate({
			scrollTop:$(this.hash).offset().top
		}, 800);
		console.log('success scroll')
	});
};

// Slidedown effect for homepage images on homepage
var homeHover = function(){
	$('.homeImg').each(function(){
		$(this).on('mouseleave', function(){
			$(this).find('p').slideUp(1200);
		})
	})
	$('.homeImg').each(function(){
		$(this).on('mouseenter', function(){
			$(this).find('p').slideDown(1200)
		});
	});
};

// Accordion effect for Room types
var roomSlide = function(){
	$('.rooms').each(function(){
		$(this).on('click', '.plus', function(){
			$(this).parent().parent().parent().addClass('ImgSection').next().slideDown(1500);
			$(this).hide().next().show().on('click', function(){
				$(this).parent().parent().parent().next().slideUp(1500).previous().removeClass('ImgSection');
			})
		});
		$(this).on('click', '.minus', function(){
			$('.minus').hide();
			$('.plus').show();
		});
	});
};

// Date picker on Rooms page sidebar
var pickDate = function(){
    $("#datepicker").datepicker();
    $("#datepicker2").datepicker();
};


// Navigation hamburger bar
var hamburgerNav = function(){
	$('nav .fa').on('click', function(){
		$('nav ul').slideToggle('slow', function(){
			$('nav ul li ul').show();	
		});
	});
};


$(document).ready(function(){
	$('.overlay').fadeIn(2100);
	logoChange();
	homeHover();
	roomSlide();
	pickDate();	
	homeSlide();
	homeHero();
	hamburgerNav();
});
	
