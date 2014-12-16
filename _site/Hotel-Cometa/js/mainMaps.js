var map, marker, geolocalizacion;
var mapaExt, geoExtCasa, geoExtHotel;
var coords = {lat: "", long: ""};

// este callback se llama desde la peticon al al api de google maps
var initMap = function(){
  var element = document.getElementById('map-canvas');
  coords = {lat: 39.541000, long: 2.593500};
  geoEspecifico(element, coords);

  /*mostrar mi casa*/
  $("#miDireccion").on("click", function(){
      mapaExt.setCenter(geoExtCasa);
      $(this).fadeOut();
      $("#mostrarRuta").fadeIn();
  });

  /*marcar la ruta*/
  $("#mostrarRuta").on("click", function(){
    mapaExt.setMapTypeId(google.maps.MapTypeId.ROADMAP);
    var directionsService = new google.maps.DirectionsService();
    var directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(mapaExt);

    var request = {
      origin : geoExtCasa,
      destination: geoExtHotel,
      travelMode: google.maps.DirectionsTravelMode.DRIVING/*definir el modo en el que el usuario va a viajar en la ruta*/
    };

    directionsService.route(request, function(response, status){
      if(status == google.maps.DirectionsStatus.OK){/*comprobar la peticion devuelta correctamente*/
        directionsRenderer.setDirections(response);
      }
    });

    $(this).val("centrar mapa");
  });
};

/*valores iniciales del mapa*/
/*ROADMAP, SATELLITE, HYBRID, TERRAIN*/
var initialize = function(coords, element)
{
  var mapOptions = {
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.SATELLITE
  };

  /*creamos el mapa*/
  map = new google.maps.Map(element, mapOptions);
  geolocalizacion = new google.maps.LatLng(coords.lat, coords.long),

  /*centrar el mapa y titulo de puntero*/
  marker = new google.maps.Marker({
    map: map,
    draggable: false,/*mover el marcador*/
    position: geolocalizacion,
    visible: true,
    title: "ZOOM"
  });
  map.setCenter(geolocalizacion);

  /*variables globales, sacar las variables fuera*/
  geoExtHotel = geolocalizacion;

  /*controlar evento de mapa desplazado, 60 seg y centrarlo*/
  google.maps.event.addListener(map, 'center_changed', function() {
      window.setTimeout(function() {
      map.panTo(marker.getPosition());
    }, 60000);
  });

  /*evento de click, aumentar zoom*/
  google.maps.event.addListener(marker, 'click', function() {
    map.setZoom(18);
    map.setCenter(marker.getPosition());
    marker.setTitle("Hotel Bonanza Palya");
  });

  /*ruta desde el hotel a mi posicion*/
  calcularRuta(geolocalizacion, map);
};

var calcularRuta = function(inicioRuta, mapa){
  /*mi posicion en google maps*/
  navigator.geolocation.getCurrentPosition(function(geo){
    coords.lat = geo.coords.latitude;
    coords.long = geo.coords.longitude;
    var miPosicion = new google.maps.LatLng(coords.lat, coords.long);
    /*el mapa es el mismo, ya NO lo creamos, solo los marcadores*/
    var marker = new google.maps.Marker({
      map: mapa,
      draggable: true,/*no mover el marcador*/
      position: miPosicion,
      visible: true,
      title: "mi casa"
    });

    /*variables globales, sacar las variables fuera*/
    mapaExt = mapa;
    geoExtCasa = miPosicion;

  }, errorLocalizar);
}

/*coordenadas locales*/
var geoLocal = function()
{
  navigator.geolocation.getCurrentPosition(mostrar, errorLocalizar);
};

/*coordenadas especificas*/
var geoEspecifico = function(element, coords){
  google.maps.event.addDomListener(window, 'load', initialize(coords, element));
}

/*metodo que se invoca cuando no funciona la localizacion*/
var errorLocalizar = function(error)
{
  alert("Tarde o temprano te encontrare ¬_¬");
  console.log(error);
};