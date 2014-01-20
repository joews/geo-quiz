var GQ = GQ || {};

GQ.MenuView = Backbone.View.extend({
	el: $('#menu-view'),

	render: function() {
		var	$listEl = $('#menu-items');

		this.model.each(function(dataset) {
			var childView = new GQ.MenuItemView({ model: dataset });
			$listEl.append(childView.render().$el);
		});

		return this;
	}
});

GQ.MenuItemView = Backbone.View.extend({
	tagName: 'li',
	template: _.template($('#template-menu-item').html()),

	//TODO: we could do some kind of preview before
	// going straight to the quiz
	events: {
		'click': 'onSelect'
	},

	onSelect: function(e) {
		this.model.fetchGeoJson();
	},

	render: function() {
		this.$el.html(this.template(this.model.attributes));
		return this;
	}
});