$(document).ready(function() {
	
	loadPage('homeLink', 'home.html');
	$('#aboutLink').click(function(event) {
		event.preventDefault();
		loadPage('aboutLink', 'about.html');
	});

	$('#menuLink').click(function(event) {
		event.preventDefault();
		loadPage('menuLink', 'menu.html');
	});

	$('#contactLink').click(function(event) {
		event.preventDefault();
		loadPage('contactLink', 'contact.html');
	});
	
	$('#homeLink').click(function(event) {
		event.preventDefault();
		loadPage('homeLink', 'home.html');
	});

	function loadPage(link, page) {
		$('#mainContent').load(page, function(data, textStatus, jqXHR) {
		       var reponse = jQuery(jqXHR.responseText);
		       var reponseScript = reponse.filter("script");
		       jQuery.each(reponseScript, function(idx, val) { eval(val.text); } );
		   });
		$('.menuLink').css('color', '');
		$('#' + link).css('color', 'white');
	}
})
