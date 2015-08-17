// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', [ 'ionic', 'starter.controllers' ]);

app.run(function($ionicPlatform, $localStorage) {
	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory
		// bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleDefault();
		}
	});
});

app.factory('$localStorage', [ '$window', function($window) {
	return {
		set : function(key, value) {
			$window.localStorage[key] = value;
		},
		get : function(key, defaultValue) {
			return $window.localStorage[key] || defaultValue;
		},
		setObject : function(key, value) {
			$window.localStorage[key] = JSON.stringify(value);
		},
		getObject : function(key) {
			return JSON.parse($window.localStorage[key] || '{}');
		}
	}
} ]);

app.config([ '$stateProvider', '$urlRouterProvider',
		function($stateProvider, $urlRouterProvider) {
			$stateProvider.state('app', {
				url : "/app",
				abstract : true,
				templateUrl : "templates/menu.html",
				controller : 'AppCtrl'
			}).state('app.config', {
				url : "/config",
				views : {
					'menuContent' : {
						templateUrl : "templates/config.html",
						controller : 'ConfigCtrl'
					}
				}
			}).state('app.order', {
				url : "/search",
				views : {
					'menuContent' : {
						templateUrl : "templates/order.html",
						controller : 'searchCtrl'
					}
				}
			}).state('app.records', {
				url : "/records",
				views : {
					'menuContent' : {
						templateUrl : "templates/orderList.html",
						controller : 'OrderListCtrl'
					}
				}
			}).state('app.category',{
				url:"/category",
				views : {
					"menuContent":{
						templateUrl :"templates/category.html",
						controller:"CategoryCtrl"
					}
				}
			}).state('app.product',{
				url:"/productList/{categoryId}/{categoryName}",
				views : {
					"menuContent":{
						templateUrl :"templates/productList.html",
						controller:"ProductListCtrl"
					}
				}
			});
			$urlRouterProvider.otherwise('/app/search');

		} ]);
