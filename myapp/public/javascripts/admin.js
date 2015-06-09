function addQuestion() {
	$.ajax({
		type: 'POST',
		url: '/addQuestion',
		data: 
			{ 'question': $('#question').val(), 
			  'answer1': $('#answer1').val(), 
			  'answer2' : $('#answer2').val(), 
			  'answer3': $('#answer3').val(), 
			  'answer4' : $('#answer4').val()
			} 
	})
	.done(function(status) {
		if (status == '200') {
			$('#modal-title').html('Add Another Question')
			$('.answer').val('');
		}
		else {
			$('#modal-title').html('Questions Already Exists! Try Again.')
			$('.answer').val('');
		}
	});
}

$(document).ready(function () {
	$('#sign-out').show()
	getUserData();
	getActivityData();
	enableSubmitButton();
});

function enableSubmitButton() {
	$('.answer').keyup(function() {
		if ($('#question').val() != '' && $('#answer1').val() != '' && $('#answer2').val() != '' && $('#answer3').val() != '' && $('#answer4').val() != '') {
			$('#new_question_button').removeAttr('disabled')
		}
		else {
			$('#new_question_button').attr('disabled', 'disabled')
		}
	});
}

function getUserData() {
	$.ajax({
	type: 'GET',
	url: '/user_data'
	})
	.done(function(data) {
		$('#totalUsers').html('Total Users: ' + data.totalUsers)
		$('#num_users_last_day').html(data.numUsersInLastDay)
		$('#num_users_last_hour').html(data.numUsersInLastHour)
		$('#num_users_last_minute').html(data.numUsersInLastMinute)
		var users_last_minute = data.numUsersInLastMinute
		var users_last_hour = data.numUsersInLastHour - users_last_minute
		var users_last_day = data.numUsersInLastDay - users_last_hour - users_last_minute
		var users_before_last_day = data.totalUsers - users_last_day - users_last_hour - users_last_minute
		var dataSet = [
			{label: "Joined Before a Day Ago", data: users_before_last_day, color: "#DE000F"},
    		{label: "Joined in Last Day Excluding Last Hour", data: users_last_day, color: "#005CDE" },
    		{ label: "Joined in Last Hour Excluding Last Minute", data: users_last_hour, color: "#00A36A" },
    		{ label: "Joined in Last Minute", data: users_last_minute, color: "#7D0096" }
        ];
		$.plot('#userPieChart', dataSet, {
		    series: {
		        pie: {
		            show: true
		        }
		    },
		    legend: {
		        show: true
		    }
		});
	});
}

function getActivityData() {
	$.ajax({
	type: 'GET',
	url: '/activity_data'
	})
	.done(function(data) {
		$('#totalResponses').html('Total Questions Answered: ' + data.totalResponses)
		$('#num_responses_last_day').html(data.numResponsesInLastDay)
		$('#num_responses_last_hour').html(data.numResponsesInLastHour)
		$('#num_responses_last_minute').html(data.numResponsesInLastMinute)
		var responses_last_minute = data.numResponsesInLastMinute
		var responses_last_hour = data.numResponsesInLastHour - responses_last_minute
		var responses_last_day = data.numResponsesInLastDay - responses_last_hour - responses_last_minute
		var responses_before_last_day = data.totalResponses - responses_last_day - responses_last_hour - responses_last_minute
		var dataSet = [
			{label: "Responses Before a Day Ago", data: responses_before_last_day, color: "#DE000F" },
    		{label: "Responses in Last Day Excluding Last Hour", data: responses_last_day, color: "#005CDE" },
    		{ label: "Responses in Last Hour Excluding Last Minute", data: responses_last_hour, color: "#00A36A" },
    		{ label: "Responses in Last Minute", data: responses_last_minute, color: "#7D0096" }
        ];
		$.plot('#responsePieChart', dataSet, {
		    series: {
		        pie: {
		            show: true
		        }
		    },
		    legend: {
		        show: true
		    }
		});
	});
}