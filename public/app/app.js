var modules = [
	'HomeModule',
];

var app = angular.module('Twitter', modules, function($interpolateProvider){
	$interpolateProvider.startSymbol('<%');
	$interpolateProvider.endSymbol('%>');
});

