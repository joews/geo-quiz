GQ.Quiz = Backbone.Model.extend({
	defaults: {
		currentQuestionNumber: -1, //so we need to call next to start the quiz
		questions: [],
		score: 0
	},

	//This model should always be instantiated 
	// with dataset and nQuestions parameters:
	initialize: function() {
		var n = this.get('nQuestions'),
			dataset = this.get('dataset'),
			questions = [];

		_.times(n, function() {
			//TODO: request specific types, or a distribution
			// of specific types of question?
			var question = dataset.randomQuestion();
			question.on('answer', this.onAnswer.bind(this));
			questions.push(question);
		}, this);

		this.set({ questions: questions });

		this.set('mapView', dataset.getMapView());
		this.set('features', dataset.getFeatures());
		this.set('maxZoom', dataset.get('maxZoom'));
	},

	onAnswer: function(isCorrect) {
		this._record(isCorrect);
		this._next();
	},

	start: function() {
		this._next();
	},

	_next: function() {
		var n = this.get('currentQuestionNumber') + 1;
		if(n >= this.get('questions').length) {
			this.trigger('complete');
		} else {
			this.set('currentQuestionNumber', n);
			this.trigger('next', this._nextQuestion());
		}
	},

	numberOfQuestions: function() {
		return this.get('questions').length
	},

	currentQuestionNumber: function() {
		return this.get('currentQuestionNumber');
	},

	_nextQuestion: function() {
		var questions = this.get('questions'),
			n = this.currentQuestionNumber();
		return questions[n];
	},

	_record: function(correct) {
		if(correct) { 
			this.set('score', this.get('score') + 1)
		};
	}
});