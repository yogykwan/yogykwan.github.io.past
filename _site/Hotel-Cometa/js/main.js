/*variable qu eva almacenando la posicion de nuestro slider*/
var pos = 0;
var intv;
var flippedArt;/*contiene el elemnto girado*/
/*extension de cada paquete*/
var opcionesPaquetes = [
	{opciones:[
		{opcion:'Terraza con vistas al mar'}, {opcion:'Minibar'}, {opcion:'Aire acondicionado'}
	],costo: '175$',paquete:'Habitaciones dobles', descripcion:'Espaciosas habitaciones diseñadas con mentalidad vanguardista donde sensibilidad y buen gusto protagonizan su interiorismo, disfrute de unas espectaculares vistas al mar desde su amplio balcón. Mide: 26m2.'},
	{opciones:[
		{opcion:'Zona de estar con sofá-cama'}, {opcion:'Cuarto de baño completo'}, {opcion:'Caja fuerte electrónica'}
	],costo: '300$',paquete:'Suites Junior', descripcion:'Espaciosa Junior Suite de diseño vanguardista donde sensibilidad y buen gusto protagonizan su interiorismo. Dispone de 1 cama de matrimonio (200x200 cm), zona de estar con sofa-cama y cuarto de baño completo con ducha y bañera de diseño muy actual. Disfrute de unas espectaculares vistas al mar desde su terraza.'},
	{opciones:[
		{opcion:'2 terrazas con vistas al mar'}, {opcion:'Salón separado'}, {opcion:'Internet Wi-Fi (gratis)'}
	],costo: '350$',paquete:'Suites presidenciales', descripcion:'Disfrute de su estancia en la moderna y elegante Sénior Suite, con más de 70 m² de habitación y 15 m² de terraza con panorámicas vistas al mar, Dispone de amplio dormitorio matrimonial con cuarto de baño completo en Suite, gran salón de estar y una amplia y soleada terraza. Mide: 76m2.'}
];

$(document).ready(function(){
	init();
});

window.addEventListener("orientationchange", init);

$(window).on("resize", function()
{
	if(window.innerWidth <= 768)
	{
		$("#contacto").prepend($("#google-map"));
		$("#google-map").prepend($("#map-canvas"));
	}else{
		$("#contacto").append($("#google-map"));
		$("#google-map").append($("#map-canvas"));
	}
	clearInterval(intv);
	window.setTimeout(function(){
		var widthParent = $("#contenedor-sliders").width();
		$(".slider").each(function(index, item){
			addBackground(item, widthParent, true);
		});
		pasarSlides();
		clearInterval(intv);
		intv = setInterval(pasarSlides, 7000);
	}, 1500);
});

var init = function()
{
	/*por la cache asigna otraseccion de pagin, cargamos el inicio de la pagin*/
	if(document.location.pathname != "/%23contenedor-sliders/"){
		document.location.href = "/Hotel Cometa/#/";
	}

	/*desabilitar el scroll vertical*/
	document.body.style.overflow = "hidden";

	if(window.innerWidth <= 768){
		$("#navHotel").show();
	}else if(window.innerWidth > 768){
		$("#navHotel").hide();
	}

	/*efecto PARALAX, libreria stelar, configurarar las velocidades a traeves de data()*/
	if(window.innerWidth > 768){
		$.stellar({
			"horizontalScrolling": false,
			"hideDistantElements": false
		});
	}else{
		$("#contacto").prepend($("#google-map"));
		$("#google-map").prepend($("#map-canvas"));
	}

	/*EVENTOS MOUSE*/
	$("#encabezado").hover(handlerIn, handlerOut);
	$("#control-sliders ul li").on("click", pasarSlides);


	/*SELECCIONAR BACKGROUND desktop / movil*/
	var background = [];
	var backgroundFront = [];
	if(window.innerWidth > 768){/*imagenes desktop*/
		background = ["img/DSCF0330.jpg", "img/DSCF0371.jpg", "img/DSCF0311.jpg", "img/DSCF0330.jpg"];
		backgroundFront = "img/DSCF0302.jpg";
	}else{/*imagenes movil*/
		background = ["img/DSCF0330-movil.jpg", "img/DSCF0371-movil.jpg", "img/DSCF0311-movil.jpg", "img/DSCF0330-movil.jpg"];
		backgroundFront = "img/DSCF0302-movil.jpg";
	}

	/*AÑADIR EL SLIDE DE <section id="contenedor-sliders">*/
	var widthParent = $("#contenedor-sliders").width();
	$(".slider").each(function(index, item){
		if(index == 0){
			$(item).data("background", backgroundFront);
		}
		addBackground(item, widthParent, true);
	});

	/*AÑADIR EL SLIDE DE <section id="buffet">*/
	$(".image-food").each(function(index, item){
		$(item).data("background", background[pos++]);
		addBackground(item, false);/*no le asigno width ni height*/
		/*para que NO se vea afectado el .viewpot*/
		if($(item).hasClass('viewport')) return true;/*te lo saltas*/
		$(item).css({
			"top": index*130+"px",
			"right": 20+"px"
		});
	});

	/*CAMBIAR VIEWPORT en <section id="buffet">*/
	$(".image-food").on("click", function(){
		changeViewport($(this));
	});

	/*EFECTO DE FLIP EN CADA ARTICULO*/
	if(window.innerWidth > 768){
		$("#paquetes").on("click", ".oferta a", flipArticulos);
	}else{
		$(".oferta-mas").find("a").remove();
	}
	/*SLIDER ANIMADO POR INTERVALO DE TIEMPO*/
	intv = setInterval(pasarSlides, 7000);

	/*LOCALSCROLL*/
	$("#navHotel").children('ul').localScroll();
};

var changeViewport = function(element)
{
	var background = $(element).css("background-image");
	var viewport = $(".viewport");
	viewport.fadeOut(500, function() {
		viewport.removeClass('viewport');
		viewport.css("background-image", background);
	});
	viewport.fadeIn(10, function() {
		viewport.addClass('viewport');
	});
}

var addBackground = function(element, width, setSize)
{
	if(!width) width = $("#contenedor-sliders").width();
	/*no le asignamos el ancho del contenedor, pero lko controlamos con 'setSize'*/
	if(setSize){
		$(element).css({
			"width": width+"px",
			"height": $("#contenedor-sliders").height()+"px"
		});
	}
	var uri = $(element).data("background");
	$(element).css("background-image", "url('"+uri+"')");
}

var flipArticulos = function(event)
{
	event.preventDefault();
	if(flippedArt != null){/*esta girado*/
		$(flippedArt).revertFlip();
		flippedArt = null;
	}
	$(flippedArt).remove();

	/*TEMPLATES*/
	var padre = $(this).closest(".oferta");
	flippedArt = padre;
	$("#precioTemplate").template("CompiledTemplate");
	$(padre).flip({
		direction: "rl",
		speed: 500,
		content: $("#precioTemplate").tmpl(opcionesPaquetes[$(this).data("number")]).html(),
		color: "#f7f7f7",
		onEnd: function(){
			$("#regresar-ventana").on("click", function(){
				event.preventDefault();
				$(flippedArt).revertFlip();
				flippedArt = null;
			});
		}
	});
}

var pasarSlides = function()
{
	var slideTarget = 0;
	/*¿se paso por un intervalo (TIEMPO) o por un boton (CLICK)?*/
	if($(this).closest("#control-sliders").hasClass("pasar-slide")){
		slideTarget = $(this).index();/*devuelve el indice del array*/
		pos = slideTarget;
		clearInterval(intv);//resetamos el intervalo en el caso de que le demos click a los enlaces
		intv = setInterval(pasarSlides, 7000);
	}else{
		pos++;
		if(pos >= $(".slider").length){
			pos = 0;
		}
		slideTarget = pos;
	}
	/*ANIMACION DE FUNDIDO*/
	$("#img-sliders").fadeOut("slow", function(){
		$(this).animate({
			"margin-left" : -(slideTarget * $(this).parent().width())+"px"
		}, "fast", function(){
			$(this).fadeIn();
		});
	});
}

var handlerIn = function(event)
{
	if(window.innerWidth <= 768){
		return;
	}
	$(this).css({"margin-top" : "-7rem"});
	$("#navHotel").fadeIn();
	$("#eslogan").fadeOut();
}

var handlerOut = function(event)
{
	if(window.innerWidth <= 768){
		return;
	}
	$(this).css({"margin-top" : "-10rem"});
	$("#navHotel").fadeOut();
	$("#eslogan").fadeIn();
}