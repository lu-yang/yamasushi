angular.module('customHelpers',[])
.factory('$helpers',['$ionicPopup','$state','$ionicLoading',function($ionicPopup,$state,$ionicLoading,$scope){
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
				template: '<ion-spinner icon="spiral"></ion-spinner>'
			});
		},
		loadingHide : function (){
			$ionicLoading.hide();
		}
	}

}]);
