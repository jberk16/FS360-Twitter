var express = require('express');
var ProfileController = require('../controllers/ProfileController');
var router = express.Router();

function createErrorObject(msg){
	var error = {
		confirmation: 'fail',
		message: msg
	}
	return error;
}

function createResultObject(results){
	var result = {
		confirmation: 'success',
		results: results
	}
	return result;
}

router.get('/:resource', function(req, res, next){
	var resource = req.params.resource;

	if (resource == 'logout'){
		req.session.reset();
		res.redirect('/');
	}

	if (resource == 'currentuser'){
		if (!req.session){
			res.send(createErrorObject('User Not Logged In.'));
			return;
		}

		if (req.session.user == null){
			res.send(createErrorObject('User Not Logged In.'));
			return;
		}

		ProfileController.getById(req.session.user, function(err, result){
			if (err){
				res.send(createErrorObject(err));
				return;
			}

			res.send(createResultObject(result));
			return;
		});
		return;
	}
});

router.post('/:resource', function(req, res, next){
	var resource = req.params.resource;

	if (resource == 'login'){
		ProfileController.login(req.body, function(err, result){
			if (err){
				console.log(err)
				res.send(createErrorObject(err));
				return;
			}
			req.session.user = result.id;
			res.send(createResultObject(result));
			return;
		});
		return;
	}

	if (resource == 'register'){
		ProfileController.register(req.body, function(err, profile){
			if (err){
				res.send(createErrorObject(err));
				return;
			}
			req.session.user = profile.id;
			res.send(createResultObject(profile));
			return;
		});
		return;
	}
});

router.put('/:id', function(req, res, next) {
	var id = req.params.id;
	ProfileController.update(id, req.body, function(err, profile) {
		if (err){
			res.send(createErrorObject(err));
			return;
		}
		res.send(createResultObject(profile));
		return;
	});
	return;
});

module.exports = router;