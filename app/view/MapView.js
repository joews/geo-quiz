GQ = GQ || {};

GQ.MapView = Backbone.View.extend({
  tagName: 'div',
  id: 'map',

  initialize: function() {
    var mapView = this.model.get('mapView'),
      lat = mapView.lat,
      lon = mapView.lon,
      alt = mapView.alt;

    this.map = L.map('map').setView([lat, lon], alt);

    this.geoJson = L.geoJson(this.model.get('features'), { 
      style: this.mapStyle,
      onEachFeature: this.onEachFeature.bind(this),
    }).addTo(this.map);
  },

  mapStyle: function(feature) {
    return {
      fillColor: '#dddddd',
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    }
  },

  onEachFeature: function(feature, layer) {
    var that = this;

    function highlightFeature(e) {
      var targetLayer = e.target;

      targetLayer.setStyle({
        weight: 2,
        color: '#666',
        dashArray: '2',
        fillOpacity: 0.7
      });

      //IE and Opera get this wrong
      if (!L.Browser.ie && !L.Browser.opera) {
        targetLayer.bringToFront();
      }
    };

    function resetHighlight(e) {
      var targetLayer = e.target;
      //Prevent this layer obscuring layers we have intentionally
      // sent to the front after mouseout
      //TODO: check this isn't an active layer - could we add a property to the given layer?
      targetLayer.bringToBack();
      that.geoJson.resetStyle(targetLayer);
    };

    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
    });
  },

  //TODO: I think the geoJson should be provided by events
  // from the model
  resetLayers: function() {
    var that = this;
    this.geoJson.eachLayer(function(layer) {
      that.geoJson.resetStyle(layer);
      layer.bringToBack();

      //TODO: prevent active layers from keeping
      // their special mouseout function
    });
  },

  setActive: function(layer) {
    function applyStyle() {
      layer.setStyle({color: 'red'});
      layer.bringToFront();
    }

    applyStyle();
    layer.on('mouseout', function() { applyStyle() });
  },

  findLayerByFeature: function(feature) {
    var found;

    this.geoJson.eachLayer(function(layer) {
      if(layer.feature == feature) {
        found = layer;
      } 
    });

    return found;
  },

  render: function() {



    L.tileLayer('http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png', {
      key: '531b6247b04f4b6eab2e9c49d0332403',
      styleId: 116023 //No place names
    }).addTo(this.map);


    return this;
  }

});

