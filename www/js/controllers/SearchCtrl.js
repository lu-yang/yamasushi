angular.module('starter.controllers')
.controller(
	'searchCtrl',
	function($scope, $http, $ionicModal) {

		$scope.pnum = "";
		$scope.orders = [];

		$ionicModal.fromTemplateUrl('templates/done.html', {
			scope : $scope,
			animation : 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal;
		});
		$scope.$on('modal.hidden', function() {
			alert("hidden");
			$scope.pnum = null;
			queryProducts($scope.pnum);
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
			var queryTables = function() {
				GET.url = baseUrl + 'availableTables';
				$http(GET).success(function(data) {
					$scope.rangeTableModel = {
						tables : data.list,
						maxTableNo : data.list.length,
						tableNo : 0
					}
				}).error(function(data) {
					alert(data);
				});
			};

			queryTables();
			$scope.modal.show();
		};

		$scope.changeTableNo = function(tno) {
			var tables = $scope.rangeTableModel.tables;
			for (var i = 0; i < tables.length; i++) {
				if (tables[i].id == tno) {
					if (!tables[i].available) {
						alert("此桌不可用");
					} else if (tables[i].turnover) {
						alert("此桌客人需要加菜");
					}
					break;
				}
			}
		};

		$scope.clickRemove = function(id) {
			var size = $scope.orders.length;
			for (var i = 0; i < size; i++) {
				if ($scope.orders[i].id == id) {
					$scope.orders.splice(i, 1);
					break;
				}
			}
		}

		$scope.clickCount = function($event, id, increment) {
			var isNew = true;
			var size = $scope.orders.length;
			var count = 0;
			for (var i = 0; i < size; i++) {
				if ($scope.orders[i].id == id) {
					count = $scope.orders[i].count;
					count += increment;
					if (count <= 0) {
						count = 0;
						$scope.orders.splice(i, 1);
					} else {
						$scope.orders[i].count = count;
					}
					isNew = false;
					break;
				}
			}
			if (isNew && increment == 1) {
				count = 1;
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
