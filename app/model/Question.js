/* A single question */
var GQ = GQ || {};

//This is a "highlight the area, what is it?" question
//Other types of question will need other Question implementations
GQ.Question = Backbone.Model.extend({

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
    var isCorrect = (givenAnswer === this.get('answer'));
    this.set({
      correct: isCorrect,
      givenAnswer: givenAnswer
    });

    this.trigger('answer', isCorrect);
  },
});