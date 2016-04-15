var Profile = require('../models/Profile');

module.exports = {

	get: function(params, completion){
		Profile.find(params, function(err, profiles){
			if (err){
				completion(err, null);
				return;
			}

			var list = [];
			for (var i=0; i<profiles.length;i++){
				list.push(profiles[i].summary());
			}

			completion(null, list);
			return;
		});
		return;
	},

	register: function(params, completion){
		Profile.create(params, function(err, profile){
			if (err){
				completion(err, null);
				return;
			}
			var sendgrid= require('sendgrid')(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);
			sendgrid.send({
				to: profile.email,
				from: 'jberk16@gmail.com',
				fromname: 'CleverAndWitty App',
				subject: 'Welcome!',
				text: 'This is an app I made :)'
			}, function(err,json){
				if (err) {
					completion(err,null);
					return;
				}
				completion(null, profile.summary());
				return;
			});
			return;
		});
		return;
	},

	login: function(params, completion){
		Profile.findOne({email: params.email}, function(err, profile){
			if (err){
				completion(err.message, null);
				return;
			}

			if (profile == null){
				completion('Profile with specified email not found', null);
				return;
			}

			if (profile.password != params.password){
				completion('Invalid password', null);
				return;
			}
			completion(null, profile.summary());
			return;
		});
		return;
	},

	getById: function(params, completion){
		Profile.findById(params, function(err, profile){
			if (err){
				completion(err.message, null);
				return;
			}

			if (profile==null){
				completion('Weird MongoDB error srry my bad', null);
				return;
			}

			completion(null, profile.summary());
			return;
		});
		return;
	},

	update: function(id, params, completion){
		Profile.findByIdAndUpdate(id, params, {new: true}, function(err, profile){
			if (err){
				completion(err.message, null);
				return;
			}

			completion(null, profile.summary());
		});
		return;
	}


}