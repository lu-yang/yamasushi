angular.module('starter.controllers')

.controller('tableListCtrl',function($scope,$http,$ionicActionSheet,$window,$state,$helpers,$localStorage) {
	$scope.selectedTableId = $localStorage.get('selectedTableId');
	$scope.turnoverId = $localStorage.get('turnoverId');
	$helpers.loadingShow();
	GET.url = baseUrl + 'availableTables';
	$http(GET).success(function(data) {
		if (!data.list || data.list.length == 0) {
			$helpers.alertHelper("没有桌子信息");
			$scope.tableList = null;
			$helpers.loadingHide();
			return;
		}
		var list = data.list;
		// 清除外卖桌号
		list.splice(0,1);
		$scope.tableList = list;
		$helpers.loadingHide();

	}).error(function(data) {
		$helpers.loadingHide();
	})

	$scope.doRefresh = function(){
		GET.url = baseUrl + 'availableTables';
		$http(GET).success(function(data) {
			if (!data.list || data.list.length == 0) {
				alert("没有桌子信息");
				$scope.tableList = null;
				return;
			}
			var list = data.list
			// 清除外卖桌号
			list.splice(0,1);
			$scope.tableList = list;
			// Stop the ion-refresher from spinning
			$scope.$broadcast('scroll.refreshComplete');
		}).error(function(data) {
			alert(data);
		})
	}

	// 开桌Action
	$scope.activeTableActionSheet = function(tableId){
		POST.url = baseUrl + 'openTable';
		POST.data = JSON.stringify({"tableId":tableId, "checkout":0});
		$http(POST).success(function(data){
			$localStorage.set('selectedTableId', data.model.firstTableId);
			$localStorage.set('turnoverId', data.model.id);
			$scope.turnoverId = $localStorage.get('turnoverId');
			$window.location.href = '#/app/tabs/orderHistory';
		})
	};

	// 查看已开桌
	$scope.checkTableActionSheet = function(tableId,turnoverId){
		$scope.checkTurnoverHealth(turnoverId);
		$localStorage.set('turnoverId', turnoverId);
		$localStorage.set('selectedTableId', tableId);
		$window.location.href = '#/app/tabs/orderHistory';
	};

})
