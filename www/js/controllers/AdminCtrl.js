angular.module('starter.controllers')
.controller('adminCtrl',function($scope,$http,$ionicPopup,$ionicActionSheet,$helpers,$localStorage){
	$helpers.loadingShow();
	$scope.turnoverId = $localStorage.get('turnoverId');
	$scope.selectedTableId = 	$localStorage.get('selectedTableId');
	$scope.checkTurnoverHealth($scope.turnoverId);

	GET.url = baseUrl + 'turnover/totalPrice/' + $scope.turnoverId;
	$http(GET).success(function(data){
		$helpers.loadingHide();
		var totalPrice = 0;
		if (!data.model || data.model.length == 0) {
			//alert("此桌还没有点单。");
			$scope.orders = null;
			$scope.checkStatus = false;
			$scope.created = null;
			$scope.totalPrice = totalPrice;
			return;
		}else{
			 var d = data.model;
			$scope.payment = d;
			$scope.totalPrice = d.total;
			$scope.checkStatus = d.turnover.checkout;
			$scope.created =  d.turnover.created;
		}
	}).error(function(data) {
		alert(data);
	});

	$scope.doRefresh = function(){
		$helpers.loadingShow();
		GET.url = baseUrl + 'turnover/totalPrice/' + $scope.turnoverId;
		$http(GET).success(function(data){
			$helpers.loadingHide();
			var totalPrice = 0;
			if (!data.model || data.model.length == 0) {
				//alert("此桌还没有点单。");
				$scope.orders = null;
				$scope.checkStatus = false;
				$scope.created = null;
				$scope.totalPrice = totalPrice;
				return;
			}else{
				 var d = data.model;
				$scope.payment = d;
				$scope.totalPrice = d.total;
				$scope.checkStatus = d.turnover.checkout;
				$scope.created =  d.turnover.created;
			}
			$scope.$broadcast('scroll.refreshComplete');
		}).error(function(data) {
			alert(data);
		});
	}

	// 清台
	$scope.checkoutActionSheet = function (payment){
		if (payment == 0) {
			var confirmPopup = $ionicPopup.confirm({
				title: '<i class="ion ion-cash"></i> Payer avec cash',
				template: 'Vous êtes sûre ?'
			});
		}else if(payment == 1){
			var confirmPopup = $ionicPopup.confirm({
				title: '<i class="ion ion-card"></i> Payer avec carte',
				template: 'Vous êtes sûre ?'
			});
		}
		confirmPopup.then(function(res) {
			if(res) {
				$helpers.loadingShow();
				POST.url = baseUrl + 'turnover' ;
				POST.data = JSON.stringify({"id":$scope.turnoverId,"checkout":true,"tableId":$scope.selectedTableId,"payment":payment});
				$http(POST).success(function(data){
					window.localStorage.setItem('cartData-'+$scope.selectedTableId, null);
					window.localStorage.setItem('selectedTableId', null);
					window.localStorage.setItem('turnoverId', null);
					$helpers.loadingHide();
					$helpers.checkoutAlertHelper('Payé avec succée');
				})
			} else {

			}
		});
	};

	$scope.printReceiptActionSheet = function(){
		var confirmPopup = $ionicPopup.confirm({
			title: 'Reçu',
			template: 'Imprimer ?'
		});
		confirmPopup.then(function(res) {
			if(res) {
				GET.url = baseUrl + 'printOrders/fr/'+$scope.turnoverId ;
				$http(GET).success(function(data){
					$helpers.loadingHide();
					if(data.model){
						$helpers.alertHelper('Imprimé');
					}else{
						$helpers.alertHelper('Printe Error!');
					}
				})
			} else {

			}
		});
	}
})
.controller('takeawayAdminCtrl',function($scope,$http,$ionicPopup,$ionicActionSheet,$helpers,$localStorage,$ionicModal){
	$helpers.loadingShow();
	$scope.turnoverId = $localStorage.get('turnoverId');
	$scope.selectedTableId = 	$localStorage.get('selectedTableId');
	$scope.takeawayId = $localStorage.get('takeawayId');
	//$scope.checkTurnoverHealth($scope.turnoverId);

	GET.url = baseUrl + 'turnover/totalPrice/' + $scope.turnoverId;
	$http(GET).success(function(data){
		$helpers.loadingHide();
		if (!data.model || data.model.length == 0) {
			//alert("此桌还没有点单。");
			$scope.orders = null;
			$scope.checkStatus = false;
			$scope.created = null;
			$scope.totalPrice = totalPrice;
			return;
		}else{
			 var d = data.model;
			$scope.payment = d;
			$scope.totalPrice = d.total;
			$scope.checkStatus = d.turnover.checkout;
			$scope.created =  d.turnover.created;

		}
	}).error(function(data) {
		alert(data);
	});

if($scope.takeawayId){
	GET.url = baseUrl + 'takeaway/' + $scope.takeawayId;
	$http(GET).success(function(data){
		console.log(data);
		$helpers.loadingHide();
		if (!data.model || data.model.length == 0) {
			//alert("此桌还没有点单。");

		}else{
			takeawayData = data.model;
			$scope.takeawayData = takeawayData;
			$scope.deliveryValue = $scope.takeawayData.delivery;
		}
	}).error(function(data) {
		alert(data);
	});

}


	$scope.doRefresh = function(){
		$helpers.loadingShow();
		GET.url = baseUrl + 'turnover/totalPrice/' + $scope.turnoverId;
		$http(GET).success(function(data){
			$helpers.loadingHide();
			var totalPrice = 0;
			if (!data.model || data.model.length == 0) {
				//alert("此桌还没有点单。");
				$scope.orders = null;
				$scope.checkStatus = false;
				$scope.created = null;
				$scope.totalPrice = totalPrice;
				return;
			}else{
				 var d = data.model;
				$scope.payment = d;
				$scope.totalPrice = d.total;
				$scope.checkStatus = d.turnover.checkout;
				$scope.created =  d.turnover.created;
			}
			$scope.$broadcast('scroll.refreshComplete');
		}).error(function(data) {
			alert(data);
		});
	}

	// 清台
	$scope.checkoutActionSheet = function (payment){
		if (payment == 0) {
			var confirmPopup = $ionicPopup.confirm({
				title: '<i class="ion ion-cash"></i> Payer avec cash',
				template: 'Vous êtes sûre ?'
			});
		}else if(payment == 1){
			var confirmPopup = $ionicPopup.confirm({
				title: '<i class="ion ion-card"></i> Payer avec carte',
				template: 'Vous êtes sûre ?'
			});
		}
		confirmPopup.then(function(res) {
			if(res) {
				$helpers.loadingShow();
				POST.url = baseUrl + 'turnover' ;
				POST.data = JSON.stringify({"id":$scope.turnoverId,"checkout":true,"tableId":$scope.selectedTableId,"payment":payment});
				$http(POST).success(function(data){
					window.localStorage.setItem('cartData-'+$scope.selectedTableId, null);
					window.localStorage.setItem('selectedTableId', null);
					window.localStorage.setItem('turnoverId', null);
					$helpers.loadingHide();
					$helpers.checkoutAlertHelper('Payé avec succée');
				})
			} else {

			}
		});
	};

	$scope.printReceiptActionSheet = function(){
		var confirmPopup = $ionicPopup.confirm({
			title: 'Reçu',
			template: 'Imprimer ?'
		});
		confirmPopup.then(function(res) {
			if(res) {
				$helpers.loadingShow();
				GET.url = baseUrl + 'printOrders/fr/'+$scope.turnoverId ;
				$http(GET).success(function(data){
					$helpers.loadingHide();
					if(data.model){
						$helpers.alertHelper('Imprimé');
					}else{
						$helpers.alertHelper('Printe Error!');
					}

				})
			} else {

			}
		});
	}

	$scope.deleteActionSheet = function(){
		var confirmPopup = $ionicPopup.confirm({
			title : 'Effacer commandes',
			template : 'Vous voulez effacer cette commande ?',
			cancelText: '<i class="ion-close-circled"></i> non',
			okText: '<i class="ion-checkmark-circled"></i> oui',
			okType: 'button-assertive'
		});
		confirmPopup.then(function(res){
				$scope.doDelete($scope.turnoverId);
		});
	}

	$scope.doDelete = function(id){
		DELETE.url = baseUrl + 'turnover/' + id;
		$http(DELETE).success(function(data){
			console.log(data);
			if(!data || !data.model){
				alert('Erreur ');
			}else{
				window.location.href="#app/takeawayList";
			}

		})
	}

	$scope.timePickerObject = {
		inputEpochTime: ((new Date()).getHours() * 60 * 60 + (new Date()).getMinutes() * 60),  //Optional
		step: 1,  //Optional
		format: 24,  //Optional
		titleLabel: "Introduire l'heure",
		todayLabel: 'Today',   //Optional
		setLabel: '<i class="ion ion-checkmark-circled"></i>',  //Optional
		closeLabel: '<i class="ion ion-close-circled"></i>',  //Optional
		setButtonType: 'button-positive',  //Optional
		closeButtonType: 'button-stable',  //Optional
		callback: function (val) {    //Mandatory
			timePickerCallback(val);
		}
	};

	var timePickerCallback = function (val) {
		if (typeof (val) === 'undefined') {
			console.log('Time not selected');
		} else {
			$scope.timePickerObject.inputEpochTime = val;
			var selectedTime = new Date(val * 1000);
			console.log(selectedTime);
			$scope.selectedTime = selectedTime;
			console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), ':', selectedTime.getUTCMinutes(), 'in UTC');

		}
	}
	// Time picker directive end //

	$ionicModal.fromTemplateUrl('templates/modalTpls/takeawayEdit.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
	});


	    $scope.deliveryValueChange = function() {
	      $scope.deliveryValue =  $scope.deliveryValue;

	    };

	    $scope.newTakeawayModal = function(){
	      $scope.date = new Date();
	      $scope.modal.show();
	      $scope.SelectedDate = '';
	      $scope.SelectedTime = '';
	      $scope.user = {name:'',telephone:'',memo:'',deliveryTimestamp:'', address:'',city:'',ring:''};
	    }

	    $scope.closeModal = function(){
	      $scope.modal.hide();
	    }

	$scope.changeTakeawayData = function(){
		$scope.date = new Date();
		$scope.modal.show();
		$scope.SelectedDate = '';
		$scope.SelectedTime = '';
		$scope.user = {name:'',telephone:'',memo:'',deliveryTimestamp:'', address:'',city:'',ring:''};
	}

})
