GQ.Quiz = Backbone.Model.extend({
	defaults: {
		currentQuestionNumber: -1,
		questions: [],
		score: 0
	},

	//This model should always be instantiated 
	// with dataset and nQuestions parameters:
	initialize: function(options) {
		var dataset = this.get('dataset');
		this.listenTo(dataset, 'loaded', this._onDatasetLoaded.bind(this));
	},

	//Load the geographical data necessary for this quiz
	load: function() {
		this.get('dataset').fetchGeoJson();
	},

	//Start this quiz by loading the first question
	start: function() {
		this._next();
	},
	
	numberOfQuestions: function() {
		return this.get('questions').length
	},

	currentQuestionNumber: function() {
		return this.get('currentQuestionNumber');
	},

	_onDatasetLoaded: function() {
		var questions = [],
			n = this.get('nQuestions'),
			dataset = this.get('dataset');

		_.times(n, function() {
			//TODO: request specific types, or a distribution
			// of specific types of question?
			var question = dataset.randomQuestion();
			this.listenTo(question, 'answer', this._onAnswer.bind(this));
			questions.push(question);
		}, this);

		this.set({ questions: questions });

		this.set('features', dataset.getFeatures());
		this.set('maxZoom', dataset.get('maxZoom'));

		this.trigger('ready');
	},

	_onAnswer: function(isCorrect) {
		this._record(isCorrect);
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