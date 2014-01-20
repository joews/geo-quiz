$(function() {

	//TODO: router
	var activeView;

	function showView(view) {
		if(activeView) activeView.remove();
		view.render().$el.show();
		activeView = view;
	}

	function startQuiz(dataset, features) {
		console.log("startQuiz");

		var quiz = new GQ.Quiz({ dataset: dataset, nQuestions: 10 }),
			view = new GQ.QuizView({ model: quiz });
		showView(view);
	}

	//TODO: extract MapView to the top level - ALL
	// views always have a map, at all times
	// When we click on a potential dataset, we move the 
	// map to that datasets's mapView.
	var datasetList = new GQ.DatasetList(GQ.datasets);
	datasetList.each(function(dataset) {
		dataset.on('loaded', function(features) {
			console.log("loaded");
			startQuiz(dataset, features);
		});
	}, this);

	showView(new GQ.MenuView({ model: datasetList }));

});