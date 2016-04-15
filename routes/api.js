var express = require('express');
var ProfileController = require('../controllers/ProfileController');
var PostController = require('../controllers/PostController');
var router = express.Router();
var controllers = {
	profile: ProfileController,
	post: PostController
}

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
	var controller = controllers[resource];

	if (controller == null){
		res.send(createErrorObject('Invalid resource'));
		return;
	}
	controller.get(req.query, function(err, results){
		if (err){
			res.send(createErrorObject(err));
			return;
		}
		res.send(createResultObject(results));
		return;
	});
	return;
});

router.get('/:resource/:id', function(req, res, next){
	var resource = req.params.resource;
	var id = req.params.id;
	var controller = controllers[resource];

	if (controller == null){
		res.send(createErrorObject('Invalid resource'));
		return;
	}

	controller.getById(id, function(err, results){
		if (err){
			res.send(createErrorObject(err));
			return;
		}
		res.send(createResultObject(results));
		return;
	});
	return;
});



router.post('/:resource', function(req, res, next){
	var resource = req.params.resource;
	var controller = controllers[resource];
	if (controller==null){
		res.send(createErrorObject('Invalid resource'));
		return;
	}

	controller.post(req.body, function(err, results){
		if (err){
			res.send(createErrorObject(err));
			return;
		}
		res.send(createResultObject(results));
		return;
	})
	return;
});



module.exports = router;