/*
 * Fuente: http://jsfiddle.net/jonataswalker/w5uuxhov/
 *
 *
*/

var mapLat = 19.437;
var mapLng = -99.1670;
var mapDefaultZoom = 10;

var styles = {
    'Icon': [new ol.style.Style({
        image: new ol.style.Icon({
	anchor: [0.5, 0.5],
        anchorXUnits: "fraction",
        anchorYUnits: "fraction",
        src: './logoheaderzorro_40x21px.png', 
        //src: feature.getGeometry('Icon'),
      }),
    })],
    'Point': [new ol.style.Style({
        image: new ol.style.Circle({
            radius: 8,
            fill: new ol.style.Fill({
                //color: [255, 255, 255, 0.3]
                color: 'red', 
            }),
            stroke: new ol.style.Stroke({color: 'pink', width: 2})
        })
    })],
};

var styleFunction = function(feature, resolution) {
  return styles[feature.getGeometry().getType()];
};

var olview = new ol.View({
    center: ol.proj.fromLonLat([mapLng, mapLat]),
    //center: [-99.25, 19.57],
    zoom: mapDefaultZoom,
    minZoom: 2,
    maxZoom: 20
});

var geojson_layer = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'dataz_enero_2109.geojson',
        //url: 'file.geojson',
        format: new ol.format.GeoJSON()
    }),
    style: styleFunction
});

var map = new ol.Map({
    target: document.getElementById('map'),
    view: olview,
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      }), geojson_layer
    ]
});

/**
 * Popup
 **/
var
    container = document.getElementById('popup'),
    content_element = document.getElementById('popup-content'),
    closer = document.getElementById('popup-closer');

closer.onclick = function() {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
};
var overlay = new ol.Overlay({
    element: container,
    autoPan: true,
    offset: [0, -10]
});
map.addOverlay(overlay);

var fullscreen = new ol.control.FullScreen();
map.addControl(fullscreen);

map.on('click', function(evt){
    var feature = map.forEachFeatureAtPixel(evt.pixel,
      function(feature, layer) {
        return feature;
      });
    if (feature) {
        var geometry = feature.getGeometry();
        var coord = geometry.getCoordinates();
        
        var content = '<h3>' + feature.get('Tienda') + '</h3>';
        content += '<p>Trato Amable: ' + feature.get('Trato amable') + '</p>';
        content += '<p>Rapidez: ' + feature.get('Rapidez') + '</p>';
        content += '<p>Atención en cajas: ' + feature.get('Atención en cajas') + '</p>';
        content += '<p>Ofertas y precios: ' + feature.get('Ofertas y precios') + '</p>';
        content += '<p>Surtido y existencias: ' + feature.get('Surtido y existencias') + '</p>';
        content += '<p>Orden y limpieza: ' + feature.get('Orden y Limpieza') + '</p>';
        content += '<p>Seguridad industrial: ' + feature.get('Seguridad Industrial') + '</p>';
        
        content_element.innerHTML = content;
        overlay.setPosition(coord);
        
        console.info(feature.getProperties());
    }
});
map.on('pointermove', function(e) {
    if (e.dragging) return;
       
    var pixel = map.getEventPixel(e.originalEvent);
    var hit = map.hasFeatureAtPixel(pixel);
    
    map.getTarget().style.cursor = hit ? 'pointer' : '';
});

