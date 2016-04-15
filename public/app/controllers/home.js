var homeCtr = angular.module('HomeModule', []);
homeCtr.controller('HomeController', ['$scope', '$http', function($scope, $http){

	$scope.profile = {firstName:'', lastName: '', email:'', password:''};
	$scope.returningUser = null;
	$scope.currentUser = null;
	$scope.following = [];
	$scope.users = null;
	$scope.newPost = {};
	$scope.postFeed = [];

	$scope.init = function(){
		console.log('Home Controller INIT');
		//Get the current user
		getCurrentUser();
	}

	$scope.submitPost = function(){
		$scope.newPost.posterId = $scope.currentUser.id;
		$scope.newPost.posterFirstName = $scope.currentUser.firstName;
		$scope.newPost.posterLastName = $scope.currentUser.lastName;
		$http({
			method: 'POST',
			url: 'api/post',
			data: $scope.newPost
		}).then(function success(response){
			alert('Submitted Post!');
			$scope.newPost = {};
			console.log(JSON.stringify(response.data));
		}, function error(response){
			console.log(JSON.stringify(response.data));
		});
	}

	$scope.logout = function(){
		$http({
			method:'GET',
			url: '/account/logout',
			data: $scope.profile
		}).then(function success(response){
			$scope.currentUser = null;
			$scope.users = null;
			$scope.following = [];
			$scope.postFeed = [];
			$scope.newPost = {};
		}, function error(response){
			console.log(JSON.stringify(response.data));
		});
	}

	$scope.register = function(){
		$http({
			method:'POST',
			url: '/account/register',
			data: $scope.profile
		}).then(function success(response){
			console.log(JSON.stringify(response.data));
			$scope.currentUser = response.data.results;
			getUsers();
		}, function error(response){
			console.log(JSON.stringify(response.data));
		});
	}

	$scope.login = function(){
		$http({
			method: 'POST',
			url: '/account/login',
			data: $scope.returningUser
		}).then(function success(response){
			console.log(JSON.stringify(response.data));
			$scope.currentUser = response.data.results;
		}, function error(response){
			console.log(JSON.stringify(response.data));
		});
	}

	$scope.update = function(){
		console.log(JSON.stringify($scope.currentUser));
		$http({
			method: 'PUT',
			url: '/account/'+ $scope.currentUser.id,
			data: $scope.currentUser
		}).then(function success(response){
			console.log(JSON.stringify(response.data));
		}, function error(response){
			console.log(JSON.stringify(response.data));
		});
	}

	$scope.follow = function(userId){
		$scope.currentUser.following.push(userId);
		$scope.update();
		var index = 0;
		for (var i=0; i<$scope.users.length; i++){
			if ($scope.users[i].id == userId){
				index = i;
				break;
			}
		}
		$scope.following.push($scope.users[index]);
		$scope.users.splice(index, 1);
		getPosts(userId);
	}

	$scope.unfollow = function(user){
		$scope.users.push(user);
		$scope.following.splice($scope.following.indexOf(user),1);
		$scope.currentUser.following.splice($scope.currentUser.following.indexOf(user.id),1);
		$scope.update();
	}


	getCurrentUser = function(){
		$http({
			method:'GET',
			url: '/account/currentuser' //fetches current user
		}).then(function success(response){
			//If there's no current user, stop here
			console.log(JSON.stringify(response.data));
			if (response.data.confirmation != 'success') {
				return;
			}
			//Assign the current user
			$scope.currentUser = response.data.results;
			//Get the list of users
			getUsers();
		}, function error(response){
			console.log(JSON.stringify(response.data));
		});
	}

	getUsers = function(){
		$http({
				method: 'GET',
				url: '/api/profile' //get all profiles 
			}).then(function success(response){
				//Assign the list of users
				$scope.users = response.data.results; 
				//Get the index of the current user in the users array
				var index = -1;
				for (var i=0; i<$scope.users.length; i++) { //manually looping through and cross-checking ids
					if ($scope.users[i].id == $scope.currentUser.id){
						index = i;
						break;
					}
				}
				//Splice the current user out
				$scope.users.splice(index,1);
				//Loop through the currrent user's following array
				getFollowers();
			}, function error(response){
				console.log(JSON.stringify(response.data));
			});
	}

	getFollowers = function(){
		for (var i=0; i<$scope.currentUser.following.length; i++){
			//get each follower
			getFollower($scope.currentUser.following[i]);
		}
		getPostFeed();
	}

	getFollower = function(userId){
		$http({
			method: 'GET',
			url: '/api/profile/'+userId //getById
		}).then(function success(response){
			//Push the follower's profile into following
			$scope.following.push(response.data.results);
			//Find their index in the user's array
			var index = -1;
			for (var i=0; i<$scope.users.length; i++){
				if($scope.users[i].id == response.data.results.id) {
					index = i;
					break;
				}
			}
			//Splice them out of the users array
			$scope.users.splice(index, 1);
		}, function error(response){
			console.log(JSON.stringify(response.data));
		});
	}

	getPostFeed = function(){
		for (var i=0; i<$scope.currentUser.following.length; i++){
			//get posts from each user you're following
			getPosts($scope.currentUser.following[i]);
		}
	}

	getPosts = function(userId){
		$http({
			method:'GET',
			url: '/api/post?posterId='+userId //gets all posts from the selected user id (query filter)
		}).then(function success(response){
			for (var i=0; i<response.data.results.length; i++) { //loops through array of posts, pushes them all to $scope.postFeed
				$scope.postFeed.push(response.data.results[i]);
			}
		}, function error(response){
			console.log(JSON.stringify(response.data));
		});
	}
	
}]);