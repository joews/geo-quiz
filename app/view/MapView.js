GQ = GQ || {};

GQ.MapView = Backbone.View.extend({
  el: $('#map-view'),
  defaultView: { lat: 15, lon: 0, alt: 2 },

  initialize: function() {

    this.map = L.map('map').setView(
          [this.defaultView.lat, this.defaultView.lon], 
          this.defaultView.alt);

    this.tileLayer = L.tileLayer('http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png', {
      key: '531b6247b04f4b6eab2e9c49d0332403',
      styleId: 116023 //No place names
    }).addTo(this.map);

  },

  reset: function() {
    if(this.geoJson) {
      this.map.removeLayer(this.geoJson);
    }
  },

  setModel: function(model) {
    this.model = model;

    this.geoJson = L.geoJson(this.model.get('features'), { 
      style: this.mapStyle,
      onEachFeature: this.onEachFeature.bind(this),
    }).addTo(this.map);

    this.resetLayers();

    var mapView = this.model.get('mapView'),
      lat = mapView.lat,
      lon = mapView.lon,
      alt = mapView.alt;

    this.map.setView([lat, lon], alt);
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

      //Don't change the style of currently active (highlighted) areas
      if(!targetLayer.active) {
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
      }
    };

    function resetHighlight(e) {
      var targetLayer = e.target;

      if(!targetLayer.active) {
        //Prevent this layer obscuring layers we have intentionally
        // sent to the front after mouseout
        targetLayer.bringToBack();
        that.geoJson.resetStyle(targetLayer);
      }
    };

    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
    });
  },

  resetLayers: function() {
    var that = this;
    this.geoJson.eachLayer(function(layer) {
      layer.active = false;
      that.geoJson.resetStyle(layer);
      layer.bringToBack();
    });
  },

  setActive: function(layer) {
    layer.setStyle({color: 'red'});
    layer.bringToFront();
    layer.active = true;
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

  setMapView: function(mapView) {
    this.map.setView([mapView.lat, mapView.lon], mapView.alt);
  },

  render: function() {
    return this;
  }

});

