var GQ = GQ || {};

GQ.MenuView = Backbone.View.extend({
	id: 'menu-view',
	template: _.template($('#template-menu-view').html()),

	events: {
		'click': 'childClicked',
	},

	childClicked: function(e, f) {
		this.$('li.menu-item > .start-quiz').hide();
		$(e.target).find('.start-quiz').show();
	},

	render: function() {
		this.$el.html(this.template());

		var	$listEl = this.$('.menu-items');

		this.model.each(function(dataset) {
			var childView = new GQ.MenuItemView({ model: dataset });
			$listEl.append(childView.render().$el);
		}, this);

		return this;
	}
});

GQ.MenuItemView = Backbone.View.extend({
	tagName: 'li',
	className: 'menu-item',
	template: _.template($('#template-menu-item').html()),

	events: {
		'click': 'onSelect',
		'click .start-quiz': 'onLoad',
	},

	onSelect: function() {
		this.model.trigger('preview');
	},

	onLoad: function(e) {
		e.stopPropagation();
		$(e.target).button('loading');
		
		this.model.fetchGeoJson();
	},

	render: function() {
		this.$el.html(this.template(this.model.attributes));
		return this;
	}
});