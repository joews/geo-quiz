/** Constructor function for a dataset comprising a map and a set of possible questions **/
var GQ = GQ || {}

//Currently hard-coded to EN counties
GQ.dataset = function() {

  //Init logic
  //TMP! global
  var topoJson = gqData.uk_counties,
      geoJson = topojson.feature(topoJson, topoJson.objects['uk-counties'] );

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  var nFeatures = geoJson.features.length;
  function randomFeature() {
    var index = randomInt(0, nFeatures - 1);
    return geoJson.features[index];
  }

  function _nextQuestion() {
    var answerFeature = randomFeature(),
        optionFeatures = [answerFeature],
        randomOptionFeature;

    //TODO: n options
    _.times(3, function() {
      //Make sure we don't re-select the answer feature
      randomOptionFeature = answerFeature;
      while(randomOptionFeature == answerFeature) {
        randomOptionFeature = randomFeature();
      }

      optionFeatures.push(randomOptionFeature);
    });

    var answer = answerFeature.properties.NAME,
        options = _.chain(optionFeatures)
                    .map(function(feature) {
                      return feature.properties.NAME;
                    })
                    .shuffle()
                    .value();

    return new GQ.question({ feature: answerFeature, 
                              text: "Which county is this?", 
                              options: options, 
                              answer: answer});
  }

  function _getMapView() {
    return { lat: 53, lon: -2, alt: 6 }
  }

  //Get geojson featuures
  function _getFeatures() {
    return geoJson;
  }

  return {
    nextQuestion: _nextQuestion,
    getMapView: _getMapView,
    getFeatures: _getFeatures,
  }

};