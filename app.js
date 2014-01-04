$(function() { 

  //TMP: read uk counties data from a global var
  //TODO: a way of packaging questions and their datasets for ajax requests
  var countiesDataTopo = gqData.uk;
  console.log(countiesDataTopo);

  //TODO: load map view area from question set

  var map = L.map('map').setView([53, 0], 6 );

  function style(feature) {
    return {
      fillColor: '#eeeeee',
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
    geoJson.resetStyle(e.target);
  }

  //Add listeners to each individual layer-feature:
  function onEachFeature(feature, layer) {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
    });

    //Specifying an offset stops the popover interrupting the layer's mouseover effect.
    //For some reason offset [0,0] isn't the same as no offset!
    var popup = L.popup({offset: [0,0]}).setContent(feature.properties.NAME_2);
    popup.on({ mouseover: function() { console.log("ds") } } );
    layer.bindPopup(popup);
  }

  L.tileLayer('http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png', {
    key: '531b6247b04f4b6eab2e9c49d0332403',
    styleId: 22677
  }).addTo(map);

  //Convert UK counties topojson back to geojson
  //TODO: generalise
  var countiesData = topojson.feature(countiesDataTopo, countiesDataTopo.objects['uk'] );
  console.log(countiesData);

  //TODO: get this with d3.json or a generic AJAX request
  // (but this lets me develop from the file system)
  var geoJson = L.geoJson(countiesData, { 
    style: style ,
    onEachFeature: onEachFeature,
  }).addTo(map);
});