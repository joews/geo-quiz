/* The view for the progress through the current quiz */
var GQ = GQ || {};

GQ.ProgressView = Backbone.View.extend({
	tagName: 'div',
	id: 'progress',
	template: _.template($('#template-progress').html()),

	initialize: function() {
		this.listenTo(this.model, 'change', this.render);
		this.render();
	},

	render: function() {
		this.$el.html(this.template({
			currentQuestion: this.model.get('currentQuestion'),
			nQuestions: this.model.get('nQuestions')
		}));

		return this;
	}
});
