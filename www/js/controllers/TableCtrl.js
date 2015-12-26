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
				var list = data.list;
				$scope.tableList = list;
				// Stop the ion-refresher from spinning
				$scope.$broadcast('scroll.refreshComplete');
			}).error(function(data) {
				alert(data);
			})
		}

		// 开桌Action
		$scope.activeTableActionSheet = function(tableId){
			// Show the action sheet
			var hideSheet = $ionicActionSheet.show({
				buttons: [
					{ text: '<b> Activer T-'+tableId+'</b>' }
				],
				//	destructiveText: 'Delete',
				titleText: "Qu'est ce que vous voulez faire ... ?",
				cancelText: 'Annuler',
				cancel: function() {
					return true;
				},
				buttonClicked: function(index) {

					POST.url = baseUrl + 'openTable';
					POST.data = JSON.stringify({"tableId":tableId, "checkout":0});
					$http(POST).success(function(data){
					$localStorage.set('selectedTableId', data.model.firstTableId);
					$localStorage.set('turnoverId', data.model.id);
						$scope.turnoverId = $localStorage.get('turnoverId');
						$window.location.href = '#/app/tabs/orderHistory';
					})

				}
			});

			// // For example's sake, hide the sheet after two seconds
			// $timeout(function() {
			// 	hideSheet();
			// }, 2000);
		};

		// 查看已开桌
		$scope.checkTableActionSheet = function(tableId,turnoverId){
			// Show the action sheet
			var hideSheet = $ionicActionSheet.show({
				buttons: [
					{ text: '<b> <i class="ion-eye"></i>  Voir T-'+tableId+'</b>' }
				],
				//destructiveText: "L'addition",
				titleText: "Qu'est ce que vous voulez faire ... ?",
				cancelText: 'Annuler',
				cancel: function() {
					// add cancel code..
				},
				buttonClicked: function(index) {
					if(index == 0) {
						$localStorage.set('turnoverId', turnoverId);
						$localStorage.set('selectedTableId', tableId);
						$window.location.href = '#/app/tabs/orderHistory';
						//	$window.location.reload();
					}
					return true;
				}
			});

			// 	// For example's sake, hide the sheet after two seconds
			// 	$timeout(function() {
			// 		hideSheet();
			// 	}, 2000);
		};

	})
