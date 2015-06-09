$(document).ready(function () {
	$('#login_button').click(function() {
		$.ajax({
			type: 'POST',
			url: '/login',
			data: 
				{ 'username': $('#login_username').val(),
			      'password': $('#login_password').val()
				} 
		})
		.done(function(status) {
			if (status === '200') {
				window.location.href="http://localhost:3000/home?user=" + $('#login_username').val()
			}
			else if (status === '300') {
				location.replace("http://localhost:3000/admin")
			}
			else {
				$('#login_username').val('')
				$('#login_password').val('')
				$('#login_error').show()
			}
		});
	})
	$('#signup_button').click(function() {
		$.ajax({
			type: 'POST',
			url: '/signup',
			data: 
				{ 'username': $('#signup_username').val(),
			      'password': $('#signup_password').val()
				} 
		})
		.done(function(status) {
			if (status === '200') {
				window.location.href="http://localhost:3000/home?user=" + $('#signup_username').val()
			}
			else {
				$('#signup_username').val('')
				$('#signup_password').val('')
				$('#signup_error').show()
			}
		});
	})
});