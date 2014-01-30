GQ = GQ || {};

GQ.MapView = Backbone.View.extend({
  el: $('#map-view'),

  initialize: function() {

    //Initialise map element
    //Should this happen in render?
    this.map = L.map('map');
    this.tileLayer = L.tileLayer('http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png', {
      key: '531b6247b04f4b6eab2e9c49d0332403',
      styleId: 116023 //No place names
    }).addTo(this.map);
    this.map.setView([15, 0], 2);

    this.listenTo(this.model, 'change:lookAt', this._setLookAt.bind(this));
    this.model.listenTo(this.model, 'change:features', this._onFeatureChange.bind(this));
    this.model.listenTo(this.model, 'change:activeFeature', this._setActiveFeature.bind(this));
    this.model.listenTo(this.model, 'clear', this._clear.bind(this));
  },

  _clear: function() {
    this._resetData();
  },

  _onFeatureChange: function(model, features) {
    if(features.length > 0) {
      this._setGeoJsonLayer(features);
    }
  },

  _setLookAt: function(model, lookAt) {
    this.map.setView([lookAt.lat, lookAt.lon], lookAt.alt);
  },

  _setActiveFeature: function(model, activeFeature) {
    this._resetLayers();
    var layer = this._findLayerByFeature(activeFeature);
    this._setActive(layer);
  },

  _resetData: function() {
    if(this.geoJson) {
      this.map.removeLayer(this.geoJson);
    }
  },

  _setGeoJsonLayer: function(features) {
    this.geoJson = L.geoJson(features, { 
      style: this._mapStyle,
      onEachFeature: this._onEachFeature.bind(this),
    }).addTo(this.map);
  },

  _mapStyle: function(feature) {
    return {
      fillColor: '#dddddd',
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    }
  },

  _onEachFeature: function(feature, layer) {
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

  _resetLayers: function() {
    if(this.geoJson) {
      var that = this;
      this.geoJson.eachLayer(function(layer) {
        layer.active = false;
        that.geoJson.resetStyle(layer);
        layer.bringToBack();
      });
    }
  },

  _setActive: function(layer) {
    layer.setStyle({color: 'red'});
    layer.bringToFront();
    layer.active = true;

    var zoom = this.map.getZoom();

    var layerBounds = layer.getBounds(),
        mapBounds = this.map.getBounds(),
        layerWidth = Math.abs(layerBounds.getEast() - layerBounds.getWest()),
        mapWidth = Math.abs(mapBounds.getEast() - mapBounds.getWest()),
        ratio = layerWidth / mapWidth;

    //Only zoom in to this layer if it is smaller than 5%
    // of the map's width or greater than 25% of the map's width
    //TODO: should we consider height as well? the max of the two
    // ratios? mean of the ratios?
    //Parameters may need tuning.
    var needToZoom = (ratio < 0.05 || ratio > 0.25);

    if(needToZoom) {
      var maxZoom = this.model.get('maxZoom'),
          fitZoom = this.map.getBoundsZoom(layer.getBounds()) - 2;

      //Don't zoom in further than this layer will allow
      zoom = _.min([fitZoom, maxZoom]);
    }

    //Center map on the active layer, zooming if required
    this.map.setView(layer.getBounds().getCenter(), zoom);
  },

  _findLayerByFeature: function(feature) {
    var found;

    this.geoJson.eachLayer(function(layer) {
      if(layer.feature == feature) {
        found = layer;
      } 
    });

    return found;
  },

});

