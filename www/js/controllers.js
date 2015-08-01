angular.module('starter.controllers', [ 'ngResource' ])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $localStorage) {

	baseUrl = $localStorage.get('server_address');
	defaultThumb = $localStorage.get('defaultThumb');
	categoryRootUr = $localStorage.get('categoryRootUr');
	productRootUrl = $localStorage.get('productRootUrl');

	// With the new view caching in Ionic, Controllers are only called
	// when they are recreated or on app start, instead of every page change.
	// To listen for when this page is active (for example, to refresh data),
	// listen for the $ionicView.enter event:
	// $scope.$on('$ionicView.enter', function(e) {
	// });

	// Form data for the login modal
	// $scope.loginData = {};
	//
	// // Create the login modal that we will use later
	// $ionicModal.fromTemplateUrl('templates/login.html', {
	// scope : $scope
	// }).then(function(modal) {
	// $scope.modal = modal;
	// });
	//
	// // Triggered in the login modal to close it
	// $scope.closeLogin = function() {
	// $scope.modal.hide();
	// };
	//
	// // Open the login modal
	// $scope.login = function() {
	// $scope.modal.show();
	// };
	//
	// // Perform the login action when the user submits the login form
	// $scope.doLogin = function() {
	// console.log('Doing login', $scope.loginData);
	//
	// // Simulate a login delay. Remove this and replace with your login
	// // code if using a login system
	// $timeout(function() {
	// $scope.closeLogin();
	// }, 1000);
	// };
})

.controller('PlaylistsCtrl', function($scope) {
	$scope.playlists = [ {
		title : 'Reggae',
		id : 1
	}, {
		title : 'Chill',
		id : 2
	}, {
		title : 'Dubstep',
		id : 3
	}, {
		title : 'Indie',
		id : 4
	}, {
		title : 'Rap',
		id : 5
	}, {
		title : 'Cowbell',
		id : 6
	} ];
})

.controller('ConfigCtrl', function($scope, $stateParams, $localStorage, $http) {
	$scope.serverAddress = baseUrl;
	$scope.saveServerAddress = function(servAdd) {
		$localStorage.set('server_address', servAdd);
		baseUrl = servAdd;
		init();
	};

	var init = function() {
		GET.url = baseUrl + 'constant';
		$http(GET).success(function(data) {
			defaultThumb = data.model.defaultThumb;
			$localStorage.set('defaultThumb', data.model.defaultThumb);
			categoryRootUr = data.model.categoryRootUr;
			$localStorage.set('categoryRootUr', data.model.categoryRootUr);
			productRootUrl = data.model.productRootUrl;
			$localStorage.set('productRootUrl', data.model.productRootUrl);
			alert("保存成功");
		}).error(function(data) {
			alert("保存失败");
		});
	};

	$scope.refresh = init;
})

.controller(
		'OrderCtrl',
		function($scope, $http, $ionicModal) {

			$scope.pnum = "";
			$scope.orders = [];

			$ionicModal.fromTemplateUrl('templates/done.html', {
				scope : $scope,
				animation : 'slide-in-up'
			}).then(function(modal) {
				$scope.modal = modal;
			});

			$scope.clickKey = function($event, i) {
				if (i == 10) {
					$scope.pnum = $scope.pnum.length == 0 ? '' : $scope.pnum
							.substring(0, $scope.pnum.length - 1);
				} else if (i == 11) {
					$scope.pnum = '';
				} else {
					$scope.pnum += i;
				}
				queryProducts($scope.pnum);

			};

			$scope.clickDone = function() {
				$scope.modal.show();
			};

			$scope.clickCount = function($event, id, increment) {
				var isNew = true;
				var size = $scope.orders.length;
				var count = 0;
				for (var i = 0; i < size; i++) {
					if ($scope.orders[i].id == id) {
						$scope.orders[i].count += increment;
						count = $scope.orders[i].count;
						isNew = false;
						break;
					}
				}
				if (isNew) {
					count = increment == 1 ? 1 : 0;
					$scope.orders[size] = {
						id : id,
						count : count
					}
				}
				document.getElementById('count' + id).innerHTML = "" + count;

			}

			var queryProducts = function(num) {
				// TODO query by product num, controller of server need to add
				if (!num) {
					num = 11;
				}
				GET.url = baseUrl + 'products/' + locale + '/' + num;
				$http(GET).success(function(data) {
					var list = data.list;
					for (var i = 0; i < list.length; ++i) {
						var thumb = list[i].thumb;
						list[i].thumb = convertImageURL(thumb);
					}
					$scope.products = list;

				}).error(function(data) {
					alert(data);
				});
			};

			queryProducts($scope.pnum);
		})

.controller('OrderListCtrl', function($scope, $http) {

	// $scope.maxTableNo = 0;
	$scope.orders = null;
	$scope.tables = null;

	$scope.changeTableNo = function(tno) {
		var tables = $scope.tables;
		var turnoverId = null;
		for (var i = 0; i < tables.length; i++) {
			if (tables[i].id == tno) {
				if (tables[i].turnover) {
					turnoverId = tables[i].turnover.id;
				}
				break;
			}
		}
		if (!turnoverId) {
			alert("此桌没有客人");
			$scope.orders = null;
			return;
		}
		GET.url = baseUrl + 'orders/' + locale + '/' + turnoverId;
		$http(GET).success(function(data) {
			if (!data.list || data.list.length == 0) {
				alert("此桌还没有点单。");
				$scope.orders = null;
				return;
			}
			var list = data.list;
			for (var i = 0; i < list.length; ++i) {
				var thumb = list[i].product.thumb;
				list[i].product.thumb = convertImageURL(thumb);
			}
			$scope.orders = list;
		}).error(function(data) {
			alert(data);
		});
	};

	var queryTables = function() {
		GET.url = baseUrl + 'availableTables';
		$http(GET).success(function(data) {
			$scope.tables = data.list;
			$scope.maxTableNo = $scope.tables.length;
			$scope.tableNo = 0;
		}).error(function(data) {
			alert(data);
		});
	};

	queryTables();
});
