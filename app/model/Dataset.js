var GQ = GQ || {}

//Currently hard-coded to EN counties
GQ.Dataset = Backbone.Model.extend({

  //TMP!
  defaults: {
    topoJson: gqData.uk_counties,
    objectSet: 'uk-counties'
  },



  initialize: function() {
    var topoJson = this.get('topoJson'),
        geoJson = topojson.feature(topoJson, 
            topoJson.objects[this.get('objectSet')] );

    this.set('geoJson', geoJson)
  },

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
        randomOptionFeature;

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

    var answer = answerFeature.properties.NAME,
        options = _.chain(optionFeatures)
                    .map(function(feature) {
                      return feature.properties.NAME;
                    })
                    .shuffle()
                    .value();

    return new GQ.Question({ feature: answerFeature, 
                              text: "Which county is this?", 
                              options: options, 
                              answer: answer});
  },

  //TODO: params!
  getMapView: function() {
    return { lat: 53, lon: -2, alt: 6 }
  },

  getFeatures: function() {
    return this.get('geoJson');
  }

});