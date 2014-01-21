var GQ = GQ || {};

GQ.CompleteView = Backbone.View.extend({
	tagName: 'div',
	id: 'complete',
	template: _.template($('#template-complete').html()),

	initialize: function(options) {
		this.parent = options.parent;
	},

	events: {
		'click .restart': 'restart',
		'click .exit': 'exit'
	},

	restart: function() {
		this.parent.trigger('restart', this.model);
	},

	exit: function() {
		this.parent.trigger('exit');
	},

	render: function() {
		this.$el.html(this.template({
			correct: this.model.get('score'),
			total: this.model.get('nQuestions')
		}));

		return this;
	}
});
