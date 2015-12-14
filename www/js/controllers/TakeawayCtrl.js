angular.module('starter.controllers')

.controller('takeawayCtrl',function($scope,$http,$ionicActionSheet,$window,$state,$helpers,$localStorage){
  $helpers.loadingShow();
  GET.url = baseUrl + 'takeaways';
  $http(GET).success(function(data) {
    if (!data.list || data.list.length == 0) {
      $helpers.loadingHide();
      $helpers.alertHelper("non emporter");
      $scope.tableList = null;
      return;
    }
    var list = data.list;
    $scope.takeawayList = list;
    console.log($scope.takeaway);
    $helpers.loadingHide();
    // Stop the ion-refresher from spinning
    $scope.$broadcast('scroll.refreshComplete');
  }).error(function(data) {
    alert(data);
  })

  $scope.doRefresh = function(){
    GET.url = baseUrl + 'takeaways';
    $http(GET).success(function(data) {
      if (!data.list || data.list.length == 0) {
        alert("non emporter");
        $scope.tableList = null;
        return;
      }
      var list = data.list;
      $scope.takeawayList = list;
      // Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    }).error(function(data) {
      alert(data);
    })
  }


});
