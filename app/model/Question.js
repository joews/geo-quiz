/* A single question */
var GQ = GQ || {};

//This is a "highlight the area, what is it?" question
GQ.question = Backbone.Model.extend({

  //feature, text, options and answer should be provided
  defaults: {
    feature: undefined,
    text: '',
    options: [],
    answer: '',
    givenAnswer: undefined,
    correct: undefined
  },

  answer: function(givenAnswer) {
    var correct = (givenAnswer === this.get('answer'));
    this.set({
      correct: correct,
      givenAnswer: givenAnswer
    });

    this.trigger('answer');
  },
});