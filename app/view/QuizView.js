/* The top-level application view for a quiz */
//Future URLs: /quiz/:quiz-name

GQ = GQ || {};
GQ.QuizView = Backbone.View.extend({
  id: 'quiz-view',
  template: _.template($('#template-quiz-view').html()),

  events: {
    'click .quit': 'quit'
  },

  initialize: function(options) {
    this.mapView = options.mapView;

    //It would be better for MapView to have a dedicated model,
    // which controlling views alter to update MapView. The current
    // design could lead to conflicts between controlling views that
    // each believe they "own" the MapView.
    this.mapView.setModel(this.model);

    this.subtitle = this.model.get('dataset').get('name');

    this.progressView = new GQ.ProgressView({ model: this.model });
    this.questionView = undefined;
    this.completeView = undefined;

    this.model.on('next', this.onNextQuestion.bind(this));
    this.model.on('complete', this.onComplete.bind(this));
  },

  quit: function() {
    this.mapView.reset();
    this.trigger('exit');
  },

  //Called when the model has a new question
  onNextQuestion: function(question) {
    if(this.questionView) this.questionView.remove();
 
    this.questionView = new GQ.QuestionView({ model: question });
    this.renderSubView(this.questionView);

    //Maybe MapView should control this, but external control
    // will allow more flexibility with different types of questions
    feature  = question.get('feature'),
    layer = this.mapView.findLayerByFeature(feature);
    this.mapView.resetLayers();    
    this.mapView.setActive(layer);
  },

  //Called when the model indicates it is complete
  onComplete: function() {
    if(this.completeView) this.completeView.remove();
    if(this.questionView) this.questionView.remove();
    this.progressView.remove();

    this.completeView = new GQ.CompleteView({ 
      model: this.model,
      parent: this
    });

    this.renderSubView(this.completeView.render());
  },

  renderSubView: function(view) {
    this.$subEl.prepend(view.render().el);
  },

  render: function() {
    this.$el.html(this.template());
    this.$subEl = this.$('#content');

    this.mapView.render();
    this.progressView.render();

    this.$('#progress').html(this.progressView.$el);

    //Once the view is rendered, the quiz can start
    this.model.start();

    return this;
  }

});