/* The view for a single question */
//TODO: customise this per question type?
// in that case, should this also include the map?
var GQ = GQ || {};

GQ.QuestionView = Backbone.View.extend({

	tagName: 'div',
	id: 'questions',

	template: _.template($('#template-question').html()),

	events: {
		'click #options > li': 'answer'
	},

	answer: function(e) {
		var option = $(e.target).attr('data-option');
		this.model.answer(option); 

		return this;
	},

	render: function() {
		this.$el.html(this.template({
			text: this.model.get('text'),
			options: this.model.get('options')
		}));

		return this;
	}
});
