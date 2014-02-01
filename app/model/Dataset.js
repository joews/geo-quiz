var GQ = GQ || {}

GQ.Dataset = Backbone.Model.extend({

  defaults: {
    name: '',
    description: '',
    url: '',
    objectSet: '',
    nameAttribute: 'NAME',
    featureType: '',
    selectedAnswers: [], //Keep a cache of the answers we have used
                         // so far in this quiz to avoid repeats
    lookAt: { lat: 90, lon: 0, alt: 8 }
  },

  

  //Lazy load map data
  fetchGeoJson: function() {
    this._reset();
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

  //This would be better encapsulated as getNQuestions(n), so we don't have to
  // retain state across quizzes
  randomQuestion: function() {
    //Pick an answer. If we have previously used the 
    // random answer in this quiz, pick another one.
    var selectedAnswers = this.get('selectedAnswers'),
        answerFeature = this._randomFeature();

    while(_.include(selectedAnswers, answerFeature)) {
      answerFeature = this._randomFeature();
    }

    selectedAnswers.push(answerFeature);
    this.set('selectedAnswers', selectedAnswers);

    //Pick a number of options
    var optionFeatures = [answerFeature],
      randomOptionFeature,
      nameAttr = this.get('nameAttribute'),
      featureType = this.get('featureType');

    //TODO: n options
    _.times(3, function() {

      //Don't re-select the answer or an option that we have previously used
      randomOptionFeature = this._randomFeature();
      while(_.include(optionFeatures, randomOptionFeature)) {
        randomOptionFeature = this._randomFeature();
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

  getFeatures: function() {
    return this.get('geoJson');
  },

  _randomInt: function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },

  _randomFeature: function() {
    var geoJson = this.get('geoJson'),
        nFeatures = geoJson.features.length,
        index = this._randomInt(0, nFeatures - 1);
    return geoJson.features[index];
  },

  //Prepare for a new quiz - clean the list of previously-selected
  // answers
  _reset: function() {
    this.set('selectedAnswers', []);
  },

});

GQ.DatasetList = Backbone.Collection.extend({
  model: GQ.Dataset
});