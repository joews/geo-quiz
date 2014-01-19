$(function() {
	//Temporary main app logic - start a demo quiz

	var $el = $('#view'),
		activeView;

	function showView(view) {
		if(activeView) activeView.remove();
		$el.append(view.render().$el);
		this.activeView = view;
	}

	//TODO: routing!
	//TODO: A MenuView that allows you to select a dataset,
	// and thu	s create a a quiz
	var dataset = new GQ.Dataset(),
		quiz = new GQ.Quiz({ dataset: dataset, nQuestions: 10 }),
		view = new GQ.QuizView({ model: quiz });

	showView(view);

});