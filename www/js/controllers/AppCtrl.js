angular.module('starter.controllers')
.controller('AppCtrl', function($scope, $ionicModal, $timeout, $localStorage,$http,$turnover,$state,$helpers) {

	baseUrl = $localStorage.get('server_address');
	defaultThumb = $localStorage.get('defaultThumb');
	categoryRootUrl = $localStorage.get('categoryRootUrl');
	productRootUrl = $localStorage.get('productRootUrl');
	$scope.selectedTableId = null;
	$scope.turnoverId = null;
	$scope.selectedTableId = $localStorage.get('selectedTableId');
	$scope.turnoverId = $localStorage.get('turnoverId');
	if($scope.cartData == undefined){
		$scope.cartData = [];
	}else{
		$scope.cartData = $localStorage.get('cartData-'+$scope.selectedTableId);
	}
	$scope.checkTurnoverHealth = function(turnoverId){
		$turnover.getTurnoverById(turnoverId).then(function(data){
			if(!data.model.turnover || data.model.turnover.checkout != false){
				$helpers.redirectAlertHelper('Cette table a été cloturé','/tableList');
			}
			//

		});
	}

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
