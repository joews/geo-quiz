var GQ = GQ || {}

GQ.MapState = Backbone.Model.extend({ 

	defaultView: { lat: 15, lon: 0, alt: 2 },

	defaults: {
		lookAt: {},
		features: [],
		activeFeature: undefined,
		maxZoom: 8
	},

	initialize: function() {
		this.set('lookAt', this.defaultView);
	},

	lookAt: function(newView) {
		this.set('lookAt', newView);
	},

	lookAtDefault: function() {
		this.set('lookAt', this.defaultView);
	},

	setFeatures: function(featureCollection) {
		this.set('features', featureCollection.features)
	},

	clear: function() {
		this.lookAtDefault();
		this.set('features', []);
		this.trigger('clear');
	},

	setActiveFeature: function(feature) {
		this.set('activeFeature', feature);
	},
});