angular.module('starter.controllers')
	.controller('adminCtrl',function($scope,$http,$ionicPopup,$ionicActionSheet,$helpers,$localStorage){
		$helpers.loadingShow();
		$scope.turnoverId = $localStorage.get('turnoverId');
		$scope.selectedTableId = 	$localStorage.get('selectedTableId');
		$scope.checkTurnoverHealth($scope.turnoverId);

		/* get order informations and calculated total price */
		GET.url = baseUrl + 'orders/' + locale + '/' + $scope.turnoverId;
		$http(GET).success(function(data){
			  $helpers.loadingHide();
			var totalPrice = 0;
			if (!data.list || data.list.length == 0) {
				//alert("此桌还没有点单。");
				$scope.orders = null;
				$scope.totalPrice = Number(0).toFixed(2);
				$scope.checkStatus = false;
				$scope.lastActivity = null;
				return;
			}else{
				var list = data.list;
				for (var i = 0; i < list.length; ++i) {
					totalPrice +=  Number(list[i].product.productPrice * list[i].count/100);
				}
				$scope.totalPrice = totalPrice.toFixed(2);
				$scope.checkStatus = list[0].turnover.checkout;
				$scope.lastActivity = list[list.length-1].created;
			}
		}).error(function(data) {
			alert(data);
		});

		$scope.doRefresh = function(){
			$helpers.loadingShow();
			GET.url = baseUrl + 'orders/' + locale + '/' + $scope.turnoverId;
			$http(GET).success(function(data){
				$helpers.loadingHide();
				var totalPrice = 0;
				if (!data.list || data.list.length == 0) {
					//alert("此桌还没有点单。");
					$scope.orders = null;
					$scope.totalPrice = Number(0).toFixed(2);
					$scope.checkStatus = false;
					return;
				}else{
					var list = data.list;
					for (var i = 0; i < list.length; ++i) {
						totalPrice +=  Number(list[i].product.productPrice * list[i].count/100);
					}
					$scope.totalPrice = totalPrice.toFixed(2);
					$scope.checkStatus = list[0].turnover.checkout;
				}
					$scope.$broadcast('scroll.refreshComplete');
			}).error(function(data) {
				alert(data);
			});
		}

		// 清台
		$scope.checkoutActionSheet = function (){

			var confirmPopup = $ionicPopup.confirm({
				title: 'Check-Out / 结账',
				template: 'Vous êtes sûre ?'
			});
			confirmPopup.then(function(res) {
				if(res) {
					POST.url = baseUrl + 'turnover' ;
					POST.data = JSON.stringify({"id":$scope.turnoverId,"checkout":true,"tableId":$scope.selectedTableId});
					$http(POST).success(function(data){
						window.localStorage.setItem('cartData-'+$scope.selectedTableId, null);
						window.localStorage.setItem('selectedTableId', null);
						window.localStorage.setItem('turnoverId', null);
						$helpers.checkoutAlertHelper('清台成功');
					})
				} else {

				}
			});
		};

		$scope.printReceiptActionSheet = function(){
			var confirmPopup = $ionicPopup.confirm({
				title: 'Receipt / 结账单',
				template: 'Imprimer ?'
			});
			confirmPopup.then(function(res) {
				if(res) {
					GET.url = baseUrl + 'printOrders/fr/'+$scope.turnoverId ;
					$http(GET).success(function(data){
						$helpers.alertHelper('打印成功');
					})
				} else {

				}
			});
		}


	});
