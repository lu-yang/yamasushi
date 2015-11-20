angular.module('starter.controllers')
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
			categoryRootUrl = data.model.categoryRootUrl;
			$localStorage.set('categoryRootUrl', data.model.categoryRootUrl);
			productRootUrl = data.model.productRootUrl;
			$localStorage.set('productRootUrl', data.model.productRootUrl);
			alert("保存成功");
			$scope.errorData = data;
		}).error(function(data) {
			alert("保存失败");
		});
	};

	$scope.refresh = init;
})
