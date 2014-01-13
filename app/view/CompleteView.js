var GQ = GQ || {};

GQ.CompleteView = Backbone.View.extend({
	tagName: 'div',
	id: 'complete',
	template: _.template($('#template-complete').html()),

	render: function() {
		this.$el.html(this.template({
			correct: this.model.get('score'),
			total: this.model.get('nQuestions')
		}));

		return this;
	}
});
