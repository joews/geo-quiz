/* The top-level application view for a quiz */
//Future URLs: /quiz/:quiz-name

GQ = GQ || {};
GQ.QuizView = Backbone.View.extend({
  el: $('#quiz-view'),
  $subEl: $('#content'),

  initialize: function() {
    this.progressView = new GQ.ProgressView({ model: this.model });
    this.mapView = new GQ.MapView({ model: this.model });
    this.questionView = undefined;
    this.completeView = undefined;

    this.model.on('next', this.onNextQuestion.bind(this));
    this.model.on('complete', this.onComplete.bind(this));

    //Tell the model we're ready to start!
    this.model.start();
  },

  //Called when the model has a new question
  onNextQuestion: function(question) {
    if(this.questionView) this.questionView.remove();

    this.questionView = new GQ.QuestionView({ model: question });
    this.renderSubView(this.questionView);

    //Maybe MapView should control this, but this will allow
    // use more flexibility with different types of questions
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

    this.completeView = new GQ.CompleteView({ model: this.model });
    this.renderSubView(this.completeView.render());
  },

  renderSubView: function(view) {
    

    this.$subEl.prepend(view.render().el);
  },

  render: function() {
    this.mapView.render();
    this.progressView.render();

    this.$('#progress').html(this.progressView.$el);
    return this;
  }

});