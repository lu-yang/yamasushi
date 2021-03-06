angular.module('customHelpers',['ngResource' ])
.factory('$helpers',['$ionicPopup','$state','$ionicLoading','$resource',function($ionicPopup,$state,$ionicLoading,$scope){
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
				title: 'Notification:',
				template: $content
			});
		},
		redirectAlertHelper: function($content,$url){
			var alertPopup = $ionicPopup.alert({
				title: 'Notification:',
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
		alertBeforeDeleleTakeaway : function ($content,$turnoverId){
			var confirmPopup = $ionicPopup.confirm({
				title : 'Efface tous',
				template : $content
			});
			confirmPopup.then(function(res){
				if(res) {
					cartData = [];
					window.localStorage.setItem('cartDataT-'+$turnoverId, cartData);
					$state.go($state.current, {}, {reload: true});
				}else {

				}
			});
		},
		alertConfirmModify : function ($content,$scope){
			var confirmPopup = $ionicPopup.confirm({
				title : 'Modifier commandes',
				template : $content,
				cancelText: '<i class="ion-close-circled"></i> non',
				okText: '<i class="ion-checkmark-circled"></i> oui',
				okType: 'button-assertive'
			});
			confirmPopup.then(function(res){

			});
		},
		loadingShow : function (){
			$ionicLoading.show({
				template: '<ion-spinner icon="spiral"></ion-spinner>'
			});
		},
		loadingHide : function (){
			$ionicLoading.hide();
		}
	}

}])

.factory('$orderHelpers',['$ionicPopup','$state','$ionicLoading','$http','$helpers','$resource',function($ionicPopup,$state,$ionicLoading,$scope,$http,$helpers,$resource){
	return {
		updateOrder : function ($scope){

		}
	}
}]);
