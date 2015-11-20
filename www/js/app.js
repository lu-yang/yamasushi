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
		var isWebView = ionic.Platform.isWebView();
		var currentPlatform = ionic.Platform.platform();
		var deviceInformation = ionic.Platform.device();
		var isIOS = ionic.Platform.isIOS();
		var isAndroid = ionic.Platform.isAndroid();

		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		// if (window.StatusBar) {
		// 	// org.apache.cordova.statusbar required
		// 		// full screen
		// 	// StatusBar.hide();
		// 	// ionic.Platform.fullScreen();
		// }

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

app.factory('$helpers',['$ionicPopup','$state','$ionicLoading',function($ionicPopup,$state,$ionicLoading,$scope){
	return {
		checkoutAlertHelper: function($content){
			var alertPopup = $ionicPopup.alert({
				title: 'Check-Out',
				template: $content
			});
			alertPopup.then(function(res) {
				window.location.href = '#/app/tableList';

			});
		},
		alertHelper: function($content){
			var alertPopup = $ionicPopup.alert({
				title: '提示',
				template: $content
			});
		},
		redirectAlertHelper: function($content,$url){
			var alertPopup = $ionicPopup.alert({
				title: '提示',
				template: $content
			});
			alertPopup.then(function(res) {
				window.location.href = '#/app' + $url;
			});
		},
		refreshHelper : function (){
			$state.go($state.current, {}, {reload: true});
		},
		alertBeforeDelele : function ($content,$selectedTableId){
			var confirmPopup = $ionicPopup.confirm({
				title : 'Efface tous',
				template : $content
			});
			confirmPopup.then(function(res){
				if(res) {
					cartData = [];
					window.localStorage.setItem('cartData-'+$selectedTableId, cartData);
					$state.go($state.current, {}, {reload: true});
				}else {

				}
			});
		},
		loadingShow : function (){
			$ionicLoading.show({
				template: 'Loading...'
			});
		},
		loadingHide : function (){
			$ionicLoading.hide();
		}
	}

}]);

app.factory('$turnover',['$http',function($http,$q){
	var tunerover = [];
	return {
		getTurnoverById : function(turnoverId){
			if(tunerover.length > 0){
				var deferred = $q.defer();
				deferred.resolve(tunerover);
				return deferred.promise;
			}
			GET.url = baseUrl + 'turnover/totalPrice/' + turnoverId;
			return $http(GET).then(function(result){
				//modify collection of transactions...
				turnover = result.data;
				return turnover // this is data ^^ in the controller
			});
		}
	}

}]);

app.config([ '$stateProvider', '$urlRouterProvider','$ionicConfigProvider',
function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
	$ionicConfigProvider.tabs.position('bottom');
	$stateProvider.state('app', {
		cache:false,
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
	}).state('app.tableList',{
		cache: false,
		url:"/tableList",
		views : {
			"menuContent":{
				templateUrl : "templates/tableList.html",
				controller : "tableListCtrl"
			}
		}
	}
).state('app.table',{
	url:"/table/{tableId}",
	views : {
		"menuContent":{
			templateUrl : "templates/table.html",
			controller : "tableCtrl"
		}
	}

}).state('app.tabs',{
	url:"/tabs",
	views : {
		"menuContent":{
			templateUrl :"templates/tabs.html"
		}
	}
}).state('app.tabs.category',{
	url:"/category",
	views : {
		"tab-category":{
			templateUrl :"templates/category.html",
			controller:"CategoryCtrl"
		}
	}
}).state('app.tabs.productList',{
	url:"/product/:categoryId/:categoryName",
	views : {
		"tab-category":{
			templateUrl :"templates/productList.html",
			controller:"ProductListCtrl"
		}
	}
}).state('app.tabs.orderHistory',{
	cache:false,
	url:"/orderHistory",
	views : {
		"tab-history":{
			templateUrl :"templates/orderHistory.html",
			controller:"orderHistoryCtrl"
		}
	}
}).state('app.tabs.cart',{
	cache:false,
	url:"/cart",
	views : {
		"tab-cart":{
			templateUrl :"templates/cart.html",
			controller:"cartCtrl"
		}
	}
}).state('app.tabs.admin',{
	cache:false,
	url:"/admin/:turnoverId",
	views : {
		"tab-admin":{
			templateUrl :"templates/admin.html",
			controller:"adminCtrl"
		}
	}
});
$urlRouterProvider.otherwise('/app/search');

} ]);
