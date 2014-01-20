var GQ = GQ || {}

GQ.Dataset = Backbone.Model.extend({

  defaults: {
    name: '',
    description: '',
    url: '',
    objectSet: '',
    nameAttribute: 'NAME',
    featureType: '',
    mapView: { lat: 90, lon: 0, alt: 8 }
  },

  //Lazy load map data
  fetchGeoJson: function() {
    if(this.get('geoJson')) {
      this.trigger('loaded', this.get('geoJson'));
    } else {
      $.getJSON(this.get('url'), function(topoJson) {
        var geoJson = topojson.feature(topoJson, 
                topoJson.objects[this.get('objectSet')] );

        this.set('geoJson', geoJson)
        this.trigger('loaded', geoJson);
      }.bind(this));
    }
  },

  //Remaining methods should not be called 
  // until the data is loaded 

  //TODO: move to a utility object
  randomInt: function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },

  randomFeature: function() {
    var geoJson = this.get('geoJson'),
        nFeatures = geoJson.features.length,
        index = this.randomInt(0, nFeatures - 1);
    return geoJson.features[index];
  },

  randomQuestion: function() {
    var answerFeature = this.randomFeature(),
        optionFeatures = [answerFeature],
        randomOptionFeature,
        nameAttr = this.get('nameAttribute'),
        featureType = this.get('featureType');

    //TODO: n options
    _.times(3, function() {
      //Make sure we don't re-select the answer feature
      //TODO: avoid re-selecting the same answer feature within a quiz
      randomOptionFeature = answerFeature;
      while(randomOptionFeature == answerFeature) {
        randomOptionFeature = this.randomFeature();
      }

      optionFeatures.push(randomOptionFeature);
    }, this);

    var answer = answerFeature.properties[nameAttr],
        options = _.chain(optionFeatures)
                    .map(function(feature) {
                      return feature.properties[nameAttr];
                    })
                    .shuffle()
                    .value();

    return new GQ.Question({ feature: answerFeature, 
                              text: "Which " + featureType + " is this?", 
                              options: options, 
                              answer: answer});
  },

  getMapView: function() {
    return this.get('mapView');
  },

  getFeatures: function() {
    return this.get('geoJson');
  }

});

GQ.DatasetList = Backbone.Collection.extend({
  model: GQ.Dataset
});