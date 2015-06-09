var models = require('../models');
var express = require('express');
var router = express.Router();
var sequelize = models.sequelize;
/* GET home page. */
router.get('/', function(req, res) {
  req.session.user = null;
  res.render('index', { title: 'Express' });
});

router.get('/home', function(req, res) {
	if(req.session.user !== req.query.user || req.session.user === undefined) {
		res.redirect('/');
	} 
	else {
		res.render('home');
	}
});

router.get('/questionsLeft', function(req, res) {
	sequelize.query("SELECT questions.id FROM questions WHERE questions.id NOT IN (SELECT responses.questionId FROM responses join users on users.id = responses.userId WHERE users.username = '" + req.session.user + "')")
	.then(function(questions) {
		if(questions[0].length != 0) {
			var index = Math.floor(Math.random() * questions[0].length);
			models.Question	
  				.findOne({
  					where: {
  						id: questions[0][index].id
  					}
  				})
  				.then(function(question) {
  					res.send( 
  						{ 
  							questions_left: 'true',
  				      		user: req.query.user,
  				      		question: question.question, 
  				      		answer_one:  question.answer_one, 
  				      		answer_two:  question.answer_two, 
  				      		answer_three:  question.answer_three,
  				  	  		answer_four:  question.answer_four
  					});
				});
		}
		else {
			res.send( 
				{
					questions_left: 'false'
				}
			);
		}
	});
});


router.get('/admin', function(req, res) {
	if(req.session.user !== 'admin') {
		res.redirect('/');
	} 
	res.render('admin');
});

router.get('/user_data', function (req, res) {
	var date = new Date();
	var lastDay = date - 1000 * 60 * 60 * 24;
	lastDay = new Date(lastDay).toISOString().
  		replace(/T/, ' ').  
  		replace(/\..+/, ''); 
	var lastHour = date - 1000 * 60 * 60;
	lastHour = new Date(lastHour).toISOString().
  		replace(/T/, ' ').  
  		replace(/\..+/, ''); 
	var lastMinute = date - 1000 * 60;
	lastMinute = new Date(lastMinute).toISOString().
  		replace(/T/, ' ').  
  		replace(/\..+/, ''); 
	sequelize.query("SELECT count(*) FROM users")
	.then(function(totalUsers) {
		sequelize.query("SELECT count(*) FROM users WHERE users.createdAt > '" + lastDay + "'")
		.then(function(numUsersInLastDay) {
			sequelize.query("SELECT count(*) FROM users WHERE users.createdAt > '" + lastHour + "'")
			.then(function(numUsersInLastHour) {
				sequelize.query("SELECT count(*) FROM users WHERE users.createdAt > '" + lastMinute + "'")
				.then(function(numUsersInLastMinute) {
					res.status(200).send(
			      		{ 
			      		  totalUsers: totalUsers[0][0]['count(*)'],	
			      		  numUsersInLastDay: numUsersInLastDay[0][0]['count(*)'],
			      		  numUsersInLastHour: numUsersInLastHour[0][0]['count(*)'], 
			      		  numUsersInLastMinute: numUsersInLastMinute[0][0]['count(*)']
						}
					);
				});
			});
		});
	});
});

router.get('/activity_data', function(req, res) {
	var date = new Date();
	var lastDay = date - 1000 * 60 * 60 * 24;
	lastDay = new Date(lastDay).toISOString().
  		replace(/T/, ' ').  
  		replace(/\..+/, ''); 
	var lastHour = date - 1000 * 60 * 60;
	lastHour = new Date(lastHour).toISOString().
  		replace(/T/, ' ').  
  		replace(/\..+/, ''); 
	var lastMinute = date - 1000 * 60;
	lastMinute = new Date(lastMinute).toISOString().
  		replace(/T/, ' ').  
  		replace(/\..+/, ''); 
  	sequelize.query("SELECT count(*) FROM responses")
	.then(function(totalResponses) {
		sequelize.query("SELECT count(*) FROM responses WHERE responses.createdAt > '" + lastDay + "'")
		.then(function(numResponsesInLastDay) {
			sequelize.query("SELECT count(*) FROM responses WHERE responses.createdAt > '" + lastHour + "'")
			.then(function(numResponsesInLastHour) {
				sequelize.query("SELECT count(*) FROM responses WHERE responses.createdAt > '" + lastMinute + "'")
				.then(function(numResponsesInLastMinute) {
					res.status(200).send(
			      		{ 
					      totalResponses: totalResponses[0][0]['count(*)'],	
			      		  numResponsesInLastDay: numResponsesInLastDay[0][0]['count(*)'],
			      		  numResponsesInLastHour: numResponsesInLastHour[0][0]['count(*)'], 
			      		  numResponsesInLastMinute: numResponsesInLastMinute[0][0]['count(*)']
						}
					);
				});
			});
		});
	});
});

router.post('/login', function(req, res) {
  	if (req.body.username == 'admin' && req.body.password == 'admin') {
  		req.session.user = 'admin';
  		res.send('300');
  	}
  	else {
     	models.User	
  			.findOne({
  				where: {
  					username: req.body.username, 
  					password: req.body.password}
  			})
  			.then(function(data) {
  				if (data == null) {
  					res.send('400')
  				}
  				else {
  					req.session.user = req.body.username
  					res.send('200')
  				}
  			});
	}
});

router.post('/signup', function(req, res) {
	models.User
  		.create({username: req.body.username, password: req.body.password})
  		.then(function(data) {
				req.session.user = req.body.username
				res.send('200')
		}).catch(function() {
			res.send('400')
		});
});

router.post('/addQuestion', function(req, res) {
	models.Question
  		.create({question: req.body.question, answer_one: req.body.answer1, answer_two: req.body.answer2, answer_three: req.body.answer3, answer_four: req.body.answer4})
		.then(function() {
			res.send('200');
		}).catch(function(err) {
			res.send('400');
		});
});

router.post('/addResponse', function(req, res) {
	models.User
		.findOne({
			where: { 
				username: req.session.user
			}
		})
		.then(function(user) {
			models.Question
				.findOne({
				where: { 
					question: req.body.question
					}
				})
				.then(function(question) {
					models.Response
  						.create({userId: user.id, questionId: question.id, answer: req.body.answer});
  					res.send('200')
				})
		}).catch(function(err) {
			res.send('400')
		});
});

module.exports = router;
