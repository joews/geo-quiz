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

    this.mapState = options.mapState;
    this.dataset = this.model.get('dataset');

    this.mapState.set('maxZoom', this.dataset.get('maxZoom'));

    this.subtitle = this.dataset.get('name');

    this.progressView = new GQ.ProgressView({ model: this.model });
    this.questionView = undefined;
    this.completeView = undefined;

    this.listenTo(this.model, 'ready', this._onReady.bind(this));
    this.listenTo(this.model, 'next', this._onNextQuestion.bind(this));
    this.listenTo(this.model, 'complete', this._onComplete.bind(this));

    this.mapState.lookAt(this.dataset.get('lookAt'));

    this.model.load();
  },

  _onReady: function() {
    var features = this.dataset.get('geoJson');
    this.mapState.setFeatures(features);
    this.render();
  },

  //Called when the model has a new question
  _onNextQuestion: function(question) {
    if(this.questionView) this.questionView.remove();
 
    this.questionView = new GQ.QuestionView({ model: question });
    this.renderSubView(this.questionView);
    this.mapState.setActiveFeature(question.get('feature'));
  },

  //Called when the model indicates it is complete
  _onComplete: function() {
    if(this.completeView) this.completeView.remove();
    if(this.questionView) this.questionView.remove();
    this.progressView.remove();

    this.completeView = new GQ.CompleteView({ 
      model: this.model,
      parent: this
    });

    this.$('.quit').hide();
    this.renderSubView(this.completeView.render());
  },

  renderSubView: function(view) {
    this.$subEl.prepend(view.render().el);
  },

  render: function() {
    this.$el.html(this.template());
    this.$subEl = this.$('#content');

    this.progressView.render();
    this.$('#progress').html(this.progressView.$el);

    //Once the view is rendered, the quiz can start
    this.model.start();

    return this;
  }

});