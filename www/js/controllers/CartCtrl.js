angular.module('starter.controllers')
.controller('CategoryCtrl',function($scope,$http,$location,$localStorage){
  $scope.selectedTableId = $localStorage.get('selectedTableId');
  $scope.turnoverId = $localStorage.get('turnoverId');
  $scope.checkTurnoverHealth($scope.turnoverId);
  GET.url = baseUrl + 'categories/' + locale + '/' + 1;

  $http(GET).success(function(data) {
    if (!data.list || data.list.length == 0) {
      alert("没有菜单。");
      $scope.category = null;
      return;
    }
    var list = data.list;
    for (var i = 0; i < list.length; ++i) {
      var thumb = list[i].thumb;
      list[i].thumb = convertCatImageURL(thumb);
    }
    $scope.category = list;
  }).error(function(data) {
    alert(data);
  });

})
.controller('ProductListCtrl',function($scope,$http,$stateParams, $ionicModal,$localStorage,$helpers){
  $scope.selectedTableId = $localStorage.get('selectedTableId');
  $scope.turnoverId = $localStorage.get('turnoverId');
  $scope.checkTurnoverHealth($scope.turnoverId);
  $scope.categoryId = $stateParams.categoryId;
  $scope.categoryName = $stateParams.categoryName;
  if($localStorage.get('cartData-'+$scope.selectedTableId)){
    cartData = $localStorage.get('cartData-'+$scope.selectedTableId);
    $scope.cart = JSON.parse(cartData);
  }else{
    $scope.cart = null;
  }
  GET.url = baseUrl + 'products/' + locale + '/' + 	$scope.categoryId;
  $http(GET).success(function(data) {
    if (!data.list || data.list.length == 0) {
      alert("这个分类没有菜。");
      $scope.productList = null;
      return;
    }
    var list = data.list;
    for (var i = 0; i < list.length; ++i) {
      var thumb = list[i].thumb;
      list[i].thumb = convertImageURL(thumb);
    }

    $scope.productList = list;
  }).error(function(data) {
    alert(data);
  });

  $ionicModal.fromTemplateUrl('templates/productDetails.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });



  $scope.removeItem = function(index) {
    $scope.cart.splice(index, 1);
  };

  $scope.openModal = function(index) {
    $scope.modal.show();
    $scope.product = $scope.productList[index]
    $scope.currentCount= 0;
    if($scope.product.attributions){
      $scope.attrValue = {
        key: 0
      };
    }
  $scope.cart = JSON.parse($localStorage.get('cartData-'+$scope.selectedTableId));

  };
  $scope.closeModal = function() {
    $scope.removeItem(1);
    $scope.modal.hide();
  };

  $scope.addCount = function(){
    $scope.currentCount = $scope.currentCount+1;
  }

  $scope.subtractCount = function(){
    if($scope.currentCount == 0){
      $scope.currentCount = 0;
    }else{
      $scope.currentCount = $scope.currentCount-1;
    }
  }

  $scope.onSubmit = function (){

    if($scope.currentCount <= 0){
      $scope.currentCount = 0;
    }else{
      if($scope.cart ==null){
        $scope.cart = [];
      }

      if($scope.product.attributions){
        $scope.cart.push({
          "count":$scope.currentCount,
          "product":{"id":$scope.product.id,"categoryId":$scope.product.categoryId},
          "orderAttributions":[{"count":$scope.currentCount,"attribution":{"id":$scope.product.attributions[$scope.attrValue.key].id}}],
          "productInfo":{
            "productName":$scope.product.productName,
            "categoryName":$scope.categoryName,
            "productPrice":$scope.product.productPrice,
            "thumb":$scope.product.thumb,
            "attrName":$scope.product.attributions[$scope.attrValue.key].attributionName,
            "attrPrice":$scope.product.attributions[$scope.attrValue.key].attributionPrice
          }
        });
      }else{
        $scope.cart.push({
          "count":$scope.currentCount,
          "product":{"id":$scope.product.id,"categoryId":$scope.product.categoryId},
          "orderAttributions":null,
          "productInfo":{"productName":$scope.product.productName,"categoryName":$scope.categoryName,"productPrice":$scope.product.productPrice,"thumb":$scope.product.thumb}
        });
      }
      console.log($scope.cart);
      $localStorage.set('cartData-'+$scope.selectedTableId,angular.toJson($scope.cart));
       $scope.currentCount = 0;
       $scope.cartData = $localStorage.get('cartData-'+$scope.selectedTableId);
       console.log($scope.cartData);
      // $helpers.alertHelper('reussit');
    }
  }
})


.controller('orderHistoryCtrl',function($scope,$http,$stateParams,$localStorage){
  $scope.turnoverId = $localStorage.get('turnoverId');
  $scope.selectedTableId = 	$localStorage.get('selectedTableId');
  $scope.checkTurnoverHealth($scope.turnoverId);

  GET.url = baseUrl + 'orders/' + locale + '/' +$scope.turnoverId;
  $http(GET).success(function(data) {
    if (!data.list || data.list.length == 0) {
      //alert("此桌还没有点单。");
      $scope.orders = null;
      return;
    }
    var list = data.list;
    for (var i = 0; i < list.length; ++i) {
      var thumb = list[i].product.thumb;

      list[i].product.thumb = convertImageURL(thumb);

    }
    $scope.orders = list;
    console.log($scope.orders);
  }).error(function(data) {
    alert(data);
  });
})

.controller('cartCtrl',function($scope,$http,$ionicPopup,$filter,$localStorage,$helpers){
  $scope.selectedTableId = $localStorage.get('selectedTableId');
  $scope.turnoverId = $localStorage.get('turnoverId');
  $scope.checkTurnoverHealth($scope.turnoverId);

  if($localStorage.get('cartData-'+$scope.selectedTableId)){
    cartData = angular.fromJson($localStorage.get('cartData-'+$scope.selectedTableId));
    $scope.cartData = cartData;
  }else{
    $scope.cartData = null;
  }
  console.log($scope.cartData);
  $scope.removeItem = function(index) {

    $scope.cartData.splice(index, 1);


  };

  $scope.removeAll = function(){
    $helpers.alertBeforeDelele('delete all',$scope.selectedTableId);
  }
  $scope.addCount = function(index){

    $scope.cartData[index].count = $scope.cartData[index].count+1;
    $scope.$watch('cartData',
    function(newValue, oldValue) {
      window.localStorage.setItem('cartData-'+$scope.selectedTableId, angular.toJson(newValue));
    }
  );
}

$scope.subtractCount = function(index){

  if($scope.cartData[index].count == 1 ){
    $scope.removeItem(index);
    // $scope.cartData[index].count = 0
  }else{
    $scope.cartData[index].count = $scope.cartData[index].count-1;
  }
  $scope.$watch('cartData',
  function(newValue, oldValue) {
    $localStorage.set('cartData-'+$scope.selectedTableId, angular.toJson(newValue));
  });
  console.log($localStorage.get('cartData-'+$scope.selectedTableId));

}


$scope.sendOrders = function(){

  if($scope.cartData != null ){
    if( $scope.cartData.length > 0){
      ordersData = [];
      for(i=0;i<$scope.cartData.length;i++){
        d = $scope.cartData[i];
        ordersData[i] = {"count":d.count,"product":d.product,"orderAttributions":d.orderAttributions};
      }
      $scope.ordersData = angular.toJson(ordersData);

      var confirmPopup = $ionicPopup.confirm({
        title : "soumettre",
        template : "Envoyer à la cuisine ?"
      });
      confirmPopup.then(function(res){
        if(res) {
          $helpers.loadingShow();
          POST.url = baseUrl + 'orders/' + $scope.turnoverId + '/true' ;
          POST.data = ordersData;
          $http(POST).success(function(data){
            $helpers.loadingHide();
            cartData = [];
            window.localStorage.setItem('cartData-'+$scope.selectedTableId, cartData);
            $helpers.refreshHelper();
            $helpers.redirectAlertHelper('Envoyé succée', '/tabs/orderHistory');
          })
        }else {

        }
      });

    }else{
      $helpers.alertHelper('non plats choisit...');
    }
  }else{
    $helpers.alertHelper('non plats choisit...');
  }

}


})
