$(function() {

	//TODO: router
	var activeView,
		mapView = new GQ.MapView().render(),
		$activeViewEl = $('#active-view');

	function showView(view) {
		if(activeView) activeView.remove();

		mapView.reset();

		//TMP! should use events
		if(view.setMapView) {
			mapView.setModel(view.model);
			view.setMapView(mapView);
		}

		setSubtitle(view.subtitle);

		$activeViewEl.html(view.render().$el);
		activeView = view;
	}

	function setSubtitle(subtitle) {
		$('h1 small').remove();
		if(subtitle) {
			$('h1').append($("<small>").text(subtitle));
		}
	}

	function startQuiz(dataset) {
		var features = dataset.get('features'),
			quiz = new GQ.Quiz({ dataset: dataset, nQuestions: 10 }),
			view = new GQ.QuizView({ model: quiz });

		view.on('restart', function() {
			startQuiz(dataset);
		});

		view.on('exit', function() {
			startMenu();
		});

		showView(view);
		view.start();
	}

	function startMenu() {
		var datasetList = new GQ.DatasetList(GQ.datasets),
			view = new GQ.MenuView({ model: datasetList });

		datasetList.each(function(dataset) {
			dataset.on('loaded', function() {
				startQuiz(dataset);
			})
			.on('preview', function() {
				mapView.setMapView(this.get('mapView'));
			});
		}, this);

		showView(view);
	}

	startMenu()

});