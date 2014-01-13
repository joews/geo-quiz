GQ.Progress = Backbone.Model.extend({
	defaults: {
		currentQuestion: 1,
		nQuestions: 10,
		score: 0
	},

	increment: function() {
		var n = this.get('currentQuestion') + 1;
		if(n > this.get('nQuestions')) {
			this.trigger('complete');
		} else {
			this.set('currentQuestion', n);
			this.trigger('next');
		}
	},

	record: function(correct) {
		if(correct) { 
			this.set('score', this.get('score') + 1)
		};
		
		this.increment();
	}
});