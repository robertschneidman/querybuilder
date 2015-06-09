$(document).ready(function () {
	$('#sign-out').show()
	$('input:radio[name=answer]').each(function () { $(this).prop('checked', false); });
	$('#radio_answer_one').prop('checked', true);
	$.ajax({
		type: 'GET',
		url: '/questionsLeft'
	})
	.done(function(data) {
		if (data.questions_left == "true") {
			$('#question').html(data.question)
			$('#answer_one').html('&nbsp;' + data.answer_one)
			$('#answer_two').html('&nbsp;' + data.answer_two)
			$('#answer_three').html('&nbsp;' + data.answer_three)
			$('#answer_four').html('&nbsp;' + data.answer_four)
			$('#survey_div').show()
		}
		else {
			$('#no_questions').show()
		}
	});
	$('#answer_button').click(function() {
		$.ajax({
			type: 'POST',
			url: '/addResponse',
			data: 
				{ 
			      'question': $('#question').html(), 
			  	  'answer': $('input:radio[name=answer]:checked').val() 
				} 
		})
		.done(function() {
			location.reload();
		});
	});
});