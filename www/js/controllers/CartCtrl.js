angular.module('starter.controllers')
.controller('CategoryCtrl',function($scope,$http,$location,$localStorage,$helpers){
  $scope.selectedTableId = $localStorage.get('selectedTableId');
  $scope.turnoverId = $localStorage.get('turnoverId');
  $scope.checkTurnoverHealth($scope.turnoverId);
  $helpers.loadingShow();
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
    $helpers.loadingHide();

  }).error(function(data) {
    alert(data);
  });

  $scope.viewType = $localStorage.getObject('viewType');
  $scope.viewTypeChange = function() {
     $localStorage.setObject("viewType",{checked:$scope.viewType.checked });
  };
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

  $scope.viewType = $localStorage.getObject('viewType');
  $scope.viewTypeChange = function() {
     $localStorage.setObject("viewType",{checked:$scope.viewType.checked });
  };

  $ionicModal.fromTemplateUrl('templates/modalTpls/productDetails.html', {
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
    $scope.cart = angular.fromJson($localStorage.get('cartData-'+$scope.selectedTableId));
  };
  $scope.closeModal = function() {
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

      $localStorage.set('cartData-'+$scope.selectedTableId,angular.toJson($scope.cart));
      $scope.currentCount = 0;
      $scope.cartData = $localStorage.get('cartData-'+$scope.selectedTableId);
      $helpers.alertHelper('reussit');
    }
  }
})


.controller('orderHistoryCtrl',function($scope,$http,$state,$stateParams,$localStorage,$helpers){
  $scope.turnoverId = $localStorage.get('turnoverId');
  $scope.selectedTableId = 	$localStorage.get('selectedTableId');
  $scope.checkTurnoverHealth($scope.turnoverId);
  $helpers.loadingShow();
  GET.url = baseUrl + 'extOrders/' + locale + '/' +$scope.turnoverId;
  $http(GET).success(function(data) {
    $helpers.loadingHide();
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
  }).error(function(data) {
    alert(data);
  });

  $scope.orderEdit = function(){
    // window.location.href = '#/app/orderHistoryEdit';
    $state.go('app.orderHistoryEdit');
  }

})
.controller('orderHistoryEditCtrl',function($scope,$http,$stateParams,$localStorage,$helpers,$ionicModal,$filter,$orderHelpers,$ionicPopup){
  $scope.turnoverId = $localStorage.get('turnoverId');
  $scope.selectedTableId = 	$localStorage.get('selectedTableId');
  $scope.checkTurnoverHealth($scope.turnoverId);
  $helpers.loadingShow();
  GET.url = baseUrl + 'extOrders/' + locale + '/' +$scope.turnoverId;
  $http(GET).success(function(data) {
    $helpers.loadingHide();
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


    $scope.orders = $filter('orderBy')(list,'-id');
    newCount = [];
    for(i=0;i<$scope.orders.length;i++){
      newCount[i] = $scope.orders[i].count;
    }
    $scope.newCount = newCount;

  }).error(function(data) {
    alert(data);
  });

  $scope.addCount = function(i){
    $scope.newCount[i] = +($scope.newCount[i] +1);
  }

  $scope.subtractCount = function(i){
    product = $scope.orders[i];
    currentCount  = product.count;
    if($scope.newCount[i] > 0 ){
      $scope.newCount[i] = $scope.newCount[i] -1;
    }
  }

  $scope.changeOrders = function(){
    data = [];
    dataToPrint = [];
    dataNotToPrint = [];
    for (var i = 0; i < $scope.orders.length; i++) {
      data[i] = {id : $scope.orders[i].id, newCount : $scope.newCount[i]-$scope.orders[i].count}
    }

    a = $filter('filter')($scope.orders,function(d,i){
      if($scope.newCount[i]-$scope.orders[i].count !=0 && $scope.checkboxModel[i] == true){
        return d;
      }
    });

    b = $filter('filter')($scope.orders,function(d,i){
      if($scope.newCount[i]-$scope.orders[i].count !=0 && $scope.checkboxModel[i] == false){
        return d;
      }
    });
    for (var i = 0; i < a.length; i++) {
      newCount = $filter('filter')(data,function(d){
        if( d.id == a[i].id){
          return d;
        }
      });
      dataToPrint[i] = {
        "id":a[i].id,
        "count":newCount[0].newCount,
        "product": {
          "id": a[i].product.id,
          "categoryId": a[i].category.id
        },
        "orderAttributions": a[i].orderAttributions
      } ;
    }

    for (var i = 0; i < b.length; i++) {
      newCount = $filter('filter')(data,function(d){
        if( d.id == b[i].id){
          return d;
        }
      });
      dataNotToPrint[i] = {
        "id":b[i].id,
        "count":newCount[0].newCount,
        "product": {
          "id": b[i].product.id,
          "categoryId": b[i].category.id
        },
        "orderAttributions": b[i].orderAttributions
      } ;
    }

    $scope.dataToPrint = dataToPrint;
    $scope.dataNotToPrint = dataNotToPrint;
    var confirmPopup = $ionicPopup.confirm({
      title : 'Modifier commandes',
      template : 'appliquer les modifications ?',
      cancelText: '<i class="ion-close-circled"></i> non',
      okText: '<i class="ion-checkmark-circled"></i> oui',
      okType: 'button-assertive'
    });
    confirmPopup.then(function(res){
      $helpers.loadingShow();
      if($scope.dataToPrint != false && $scope.dataNotToPrint ==false){
        POST.url = baseUrl + 'orders/' + $scope.turnoverId + '/true' ;
        POST.data = $scope.dataToPrint;
        $http(POST).success(function(data){
          $scope.modal.hide();
          $helpers.loadingHide();
          $helpers.redirectAlertHelper('modification succée', '/tabs/orderHistory');
        })
      }else if($scope.dataNotToPrint !=false && $scope.dataToPrint == false){
        POST.url = baseUrl + 'orders/' + $scope.turnoverId + '/false' ;
        POST.data = $scope.dataNotToPrint;
        $http(POST).success(function(data){
          $scope.modal.hide();
          $helpers.loadingHide();
          $helpers.redirectAlertHelper('modification succée', '/tabs/orderHistory');
        })
      }else if($scope.dataNotToPrint !=false && $scope.dataToPrint != false){
        POST.url = baseUrl + 'orders/' + $scope.turnoverId + '/true' ;
        POST.data = $scope.dataToPrint;
        $http(POST).success(function(data){
          POST.url = baseUrl + 'orders/' + $scope.turnoverId + '/false' ;
          POST.data = $scope.dataNotToPrint;
          $http(POST).success(function(data){
            $scope.modal.hide();
            $helpers.loadingHide();
            $helpers.redirectAlertHelper('modification succée', '/tabs/orderHistory');
          })
        })
      }
    });

  }

  $scope.sendOrders = function(){
  }

  $ionicModal.fromTemplateUrl('templates/modalTpls/orderHistoryEdit.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function() {
    if($scope.getTotal() ==0 ){
      $helpers.alertHelper('rien à changer');
    }else{
      checkboxModel = [];
      for (var i = 0; i < $scope.orders.length; i++) {
        checkboxModel[i] = false;
      }
      $scope.checkboxModel = checkboxModel;
      $scope.modal.show();
    }
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.getTotal = function(){
    var total = 0;
    for(var i = 0; i < $scope.newCount.length; i++){
      if($scope.newCount[i]-$scope.orders[i].count>0){
        total += $scope.newCount[i]-$scope.orders[i].count;
      }else{
        total += (-1)*($scope.newCount[i]-$scope.orders[i].count);
      }
    }
    return total;
  }

})

.controller('cartCtrl',function($scope,$http,$ionicPopup,$filter,$localStorage,$helpers,$state){
  $scope.selectedTableId = $localStorage.get('selectedTableId');
  $scope.turnoverId = $localStorage.get('turnoverId');
  $scope.checkTurnoverHealth($scope.turnoverId);

  if($localStorage.get('cartData-'+$scope.selectedTableId)){
    cartData = angular.fromJson($localStorage.get('cartData-'+$scope.selectedTableId));
    $scope.cartData = cartData;
  }else{
    $scope.cartData = null;
  }

  $scope.removeItem = function(index) {
    $scope.cartData.splice(index, 1);
    $state.go($state.current, {}, {reload: true});
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
