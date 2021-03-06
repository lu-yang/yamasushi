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
		if(!$localStorage.getObject('viewType')){
			$localStorage.setObject('viewType',{checked : false});
		}
		if(!$localStorage.getObject('deliveryValue')){
			$localStorage.setObject('deliveryValue',{checked : false});
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
app.directive('standardTimeMeridian', function () {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                etime: '=etime'
            },
            template: "<strong>{{stime}}</strong>",
            link: function (scope, elem, attrs) {

                scope.stime = epochParser(scope.etime, 'time');

                function prependZero(param) {
                    if (String(param).length < 2) {
                        return "0" + String(param);
                    }
                    return param;
                }

                function epochParser(val, opType) {
                    if (val === null) {
                        return "00:00";
                    } else {
                        var meridian = ['AM', 'PM'];

                        if (opType === 'time') {
                            var hours = parseInt(val / 3600);
                            var minutes = (val / 60) % 60;
                            var hoursRes = hours > 12 ? (hours - 12) : hours;

                            var currentMeridian = meridian[parseInt(hours / 12)];

                            return (prependZero(hoursRes) + ":" + prependZero(minutes) + " " + currentMeridian);
                        }
                    }
                }

                scope.$watch('etime', function (newValue, oldValue) {
                    scope.stime = epochParser(scope.etime, 'time');
                });

            }
        };
    })


		    app.directive('standardTimeNoMeridian', function () {
		        return {
		            restrict: 'AE',
		            replace: true,
		            scope: {
		                etime: '=etime'
		            },
		            template: "<strong>{{stime}}</strong>",
		            link: function (scope, elem, attrs) {

		                scope.stime = epochParser(scope.etime, 'time');

		                function prependZero(param) {
		                    if (String(param).length < 2) {
		                        return "0" + String(param);
		                    }
		                    return param;
		                }

		                function epochParser(val, opType) {
		                    if (val === null) {
		                        return "00:00";
		                    } else {
		                        if (opType === 'time') {
		                            var hours = parseInt(val / 3600);
		                            var minutes = (val / 60) % 60;

		                            return (prependZero(hours) + ":" + prependZero(minutes));
		                        }
		                    }
		                }

		                scope.$watch('etime', function (newValue, oldValue) {
		                    scope.stime = epochParser(scope.etime, 'time');
		                });

		            }
		        };
		    });
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

}).state('app.takeawayList',{
	cache:false,
	url:"/takeawayList",
	views : {
		"menuContent":{
			templateUrl :"templates/takeaway/takeawayList.html",
			controller:"TakeawayListCtrl"
		}
	}
}).state('app.takeaways',{
	cache:false,
	url:"/takeaways",
	views : {
		"menuContent":{
			templateUrl :"templates/takeaway/tabs.html"
		}
	}
}).state('app.takeaways.orderHistory',{
	cache:false,
	url:"/orderHistory",
	views : {
		"takeaway-orderHistory":{
			templateUrl :"templates/takeaway/orderHistory.html",
			controller:"takeawayOrderHistoryCtrl"
		}
	}
}).state('app.takeawayOrderHistoryEdit',{
	cache:false,
	url:"/takeawayOrderHistoryEdit",
	views : {
		"menuContent":{
			templateUrl :"templates/takeaway/orderHistoryEdit.html",
			controller:"orderHistoryEditCtrl"
		}
	}
}).state('app.takeaways.category',{
	cache:false,
	url:"/category",
	views : {
		"takeaway-category":{
			templateUrl :"templates/takeaway/category.html",
			controller:"takeawayCategoryCtrl"
		}
	}
}).state('app.takeaways.productList',{
	cache:false,
	url:"/product/:categoryId/:categoryName",
	views : {
		"takeaway-category":{
			templateUrl :"templates/takeaway/productList.html",
			controller:"takeawayProductListCtrl"
		}
	}
}).state('app.takeaways.cart',{
	cache:false,
	url:"/cart",
	views : {
		"takeaway-cart":{
			templateUrl :"templates/takeaway/cart.html",
			controller:"takeawayCartCtrl"
		}
	}
}).state('app.takeaways.admin',{
	cache:false,
	url:"/admin",
	views : {
		"takeaway-admin":{
			templateUrl :"templates/takeaway/admin.html",
			controller:"takeawayAdminCtrl"
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
}).state('app.orderHistoryEdit',{
	cache:false,
	url:"/orderHistoryEdit",
	views : {
		"menuContent":{
			templateUrl :"templates/orderHistoryEdit.html",
			controller:"orderHistoryEditCtrl"
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
$urlRouterProvider.otherwise('/app/tableList');

} ]);
