//This will become QuizView
$(function() { 

  //This will be provided by the caller
  var dataset = GQ.dataset();

  var view = dataset.getMapView();
  var map = L.map('map').setView([view.lat, view.lon], view.alt);

  function style(feature) {
    return {
      fillColor: '#dddddd',
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  }

  //Area layer mouse over
  function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
      weight: 2,
      color: '#666',
      dashArray: '2',
      fillOpacity: 0.7
    });

    //IE and Opera get this wrong
    if (!L.Browser.ie && !L.Browser.opera) {
      layer.bringToFront();
    }
  }

  //Area layer mouse out
  function resetHighlight(e) {
    //Prevent this layer obscuring layers we have intentionally
    // sent to the front after mouseout
    //TODO: check this isn't an active layer - could we add a property to the given layer?
    e.target.bringToBack();

    geoJson.resetStyle(e.target);
  }

  //Add listeners to each individual layer-feature:
  function onEachFeature(feature, layer) {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
    });
  }

  L.tileLayer('http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png', {
    key: '531b6247b04f4b6eab2e9c49d0332403',
    styleId: 116023 //No place names
  }).addTo(map);

  var countiesData = dataset.getFeatures();
  var geoJson = L.geoJson(countiesData, { 
    style: style ,
    onEachFeature: onEachFeature,
  }).addTo(map);

  var currentView;

  function nextQuestion() {
    var question = dataset.nextQuestion(),
        feature  = question.get('feature'),
        layer = findLayerByFeature(feature);

    question.on('change:correct', function(model, correct) {
      progress.record(correct);
    });

    //TODO: check what kind of question this is. If it provides a feature, highlight
    // it. If not, do something else.
    resetLayers();    
    setActive(layer);

    if(currentView) { 
      currentView.remove();
    }

    currentView = new GQ.QuestionView({ model: question }).render();
    $('#content').prepend(currentView.el);
  }

  var completeView;
  function completeQuiz() {
    if(completeView) {
      completeView.remove();
    }

    completeView = new GQ.CompleteView({ model: progress }).render();
    $('#content').html(completeView.el);
  }

  //TODO: all of this belongs in a  "new quiz" init method

  //Set up child views
  var progress = new GQ.Progress({ nQuestions: 10 })
        .on('complete', completeQuiz)
        .on('next', nextQuestion);

  var progressView = new GQ.ProgressView({ model: progress }).render();
  $('#content').append(progressView.el);
        

  //Get the first question!
  nextQuestion();
  

  function resetLayers() {
    geoJson.eachLayer(function(layer) {
      geoJson.resetStyle(layer);
      layer.bringToBack();
    });
  }

  function setActive(layer) {
    function applyStyle() {
      layer.setStyle({color: 'red'});
      layer.bringToFront();
    }

    applyStyle();

    layer.on('click', function() { console.log("YES") });
    layer.on('mouseout', function() { applyStyle() });
  }

  function findLayerByFeature(feature) {
    var found;
    geoJson.eachLayer(function(layer) {
      if(layer.feature == feature) {
        found = layer;
      } 
    });

    return found;
  }
});