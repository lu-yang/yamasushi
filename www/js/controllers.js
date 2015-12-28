angular.module('starter.controllers', [ 'ngResource','customFilters','customHelpers','ionic-timepicker','ionic-datepicker'])

	.controller('OrderListCtrl', function($scope, $http) {

		$scope.orders = null;
		$scope.changeTableNo = function(tno) {
			var tables = $scope.rangeTableModel.tables;
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
	})
