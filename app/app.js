GQ.AppRouter = Backbone.Router.extend({

	routes: {
		'quiz/:dataset': 'loadQuiz',
		'': 'mainMenu'
	},

	initialize: function() {
		this.activeView = undefined;
		this.mapState = new GQ.MapState();
		this.$activeViewEl = $('#active-view');
		this.datasetList = new GQ.DatasetList(GQ.datasets);

		new GQ.MapView({ model: this.mapState }).render();

	},

	showView: function(view) {
		if(this.activeView) {
			this.activeView.remove();
			delete this.activeView;
		}
		
		this.setSubtitle(view.subtitle);
		this.$activeViewEl.html(view.$el);
		this.activeView = view;
	},

	//TODO: an AppView that controls this logic
	setSubtitle: function(subtitle) {
		$('h1 small').remove();
		if(subtitle) {
			$('h1').append($("<small>").text(subtitle));
		}
	},

	loadQuiz: function(datasetLabel) {

		//Make sure stale event handlers don't hang around
		if(this.quiz) { 
			this.quiz.stopListening();
			this.quiz = null;
		}
		
		var dataset = this.datasetList.findWhere({ label: datasetLabel });
		this.quiz =  new GQ.Quiz({ dataset: dataset, nQuestions: 10 });
		
		var view = new GQ.QuizView({ model: this.quiz, mapState: this.mapState });
		

			//TODO: we need to get this stopListening logic in
			// the right place - restarting now works well, but 
			// quitting does not. Make sure that the current quiz
			// ALWAYS stops listening when we get out of it
			// - probably do it in here, so whatever route
			// we take gets rid of listeners.

			view.on('restart', function() {
				this.loadQuiz(datasetLabel);
			}.bind(this));

			this.showView(view);
	},

	mainMenu: function() {
		var view = new GQ.MenuView({ model: this.datasetList }),
			router = this;

		this.mapState.clear();
		this.mapState.lookAtDefault();
		//TODO: into menu view
		this.datasetList.each(function(dataset) {
			this.listenTo(dataset, 'preview', function() {
				router.mapState.lookAt(dataset.get('lookAt'));
			});
		}, this);

		this.showView(view.render());
	}

});

$(function() {
	new GQ.AppRouter();
	Backbone.history.start();
});