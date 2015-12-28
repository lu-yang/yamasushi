angular.module('starter.controllers')
.controller('TakeawayListCtrl',function($scope,$http,$helpers,$ionicActionSheet,$ionicModal,$localStorage,$window,$filter){
  $helpers.loadingShow();

  GET.url = baseUrl + 'takeaways/2015-01-01/2015-12-29';
  $http(GET).success(function(data) {
    console.log(data);
    if (!data.list || data.list.length == 0) {
      $helpers.loadingHide();
      $helpers.alertHelper("non emporter");
      return;
    }
    var list = data.list;
    $scope.takeawayList =  $filter('orderBy')(list,'deliveryTimestamp');

    console.log($scope.takeawayList);
    $helpers.loadingHide();
  }).error(function(data) {
    alert(data);
    $helpers.loadingHide();
  })

  $scope.doRefresh = function(){
    GET.url = baseUrl + 'takeaways/2015-01-01/2015-12-17';
    $http(GET).success(function(data) {
      if (!data.list || data.list.length == 0) {
        $helpers.loadingHide();
        $helpers.alertHelper("non emporter");
        return;
      }
      var list = data.list;
      $scope.takeawayList =  $filter('orderBy')(list,'deliveryTimestamp');
      // Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    }).error(function(data) {
      alert(data);
    });

  }

  // 查看已开桌
  $scope.checkTableActionSheet = function(turnoverId){
    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: '<b> <i class="ion-eye"></i>  Voir les détailles' }
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
          $window.location.href = '#/app/takeaways/orderHistory';
          //	$window.location.reload();
        }
        return true;
      }
    });
  };

  // Time picker directive begin //
  var weekDaysList = ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"];
  var disabledDates = [
      new Date('Wednesday')]; //Works with any valid Date formats like long format

  $scope.datepickerObject = {
    // inputEpochTime: ((new Date()).getHours() * 60 * 60 + (new Date()).getMinutes() * 60),  //Optional
    titleLabel: 'Choisi le jour:',  //Optional
    todayLabel: "Aujourd'hui",  //Optional
    closeLabel: 'X',  //Optional
    setLabel: 'Set',  //Optional
    setButtonType : 'button-assertive',  //Optional
    todayButtonType : 'button-assertive',  //Optional
    closeButtonType : 'button-assertive',  //Optional
    inputDate: new Date(),  //Optional
    mondayFirst: true,  //Optional
    disabledDates: disabledDates,//Optional
    weekDaysList :weekDaysList,
    templateType: 'modal', //Optional
    showTodayButton: 'false', //Optional
    modalHeaderColor: 'bar-clean', //Optional
    modalFooterColor: 'bar-positive', //Optional
    from: new Date(), //Optional
    //to: new Date(2018, 12, 25), //Optional
    callback: function (val) {  //Mandatory
      datePickerCallback(val);
    },
    dateFormat: 'dd-MM-yyyy', //Optional
    closeOnSelect: false, //Optional
  };

  var datePickerCallback = function (val) {
    if (typeof(val) === 'undefined') {
      console.log('No date selected');
    } else {
    $scope.datepickerObject.inputDate = val;
      console.log('Selected date is : ', $filter('date')(val , "yyyy-MM-dd"));
      $scope.SelectedDate = $filter('date')(val , "yyyy-MM-dd");
    }
  };

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
      console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), ':', selectedTime.getUTCMinutes(), 'in UTC');
      $scope.selectedTime =  selectedTime.getUTCHours();
    }
  }
  // Time picker directive end //



  $ionicModal.fromTemplateUrl('templates/modalTpls/takeaway.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.deliveryValue = $localStorage.getObject('deliveryValue');

  $scope.deliveryValueChange = function() {
    $localStorage.setObject("deliveryValue",{checked:$scope.deliveryValue.checked });
    console.log($scope.deliveryValue);
  };

  $scope.newTakeawayModal = function(){
    $scope.date = new Date();
    $scope.modal.show();
    console.log($scope.deliveryValue);
$scope.SelectedDate = '';
$scope.SelectedTime = '';
    $scope.user = {name:'',telephone:'',memo:'',deliveryTimestamp:'', address:'',city:'',ring:''};
  }

  $scope.closeModal = function(){
    $scope.modal.hide();
  }

  $scope.newTakeaway = function(){
      $scope.user.deliveryTimestamp = $scope.SelectedDate + ' ' + $scope.SelectedTime;
      //$helpers.loadingShow();
      POST.url = baseUrl + 'takeaway' ;
      $http(POST).success(function(data){
        console.log(data);
      }).error(function(data) {
        alert(data);
      //  $helpers.loadingHide();
      });

  }




})
.controller('takeawayOrderHistoryCtrl',function($scope,$http,$state,$stateParams,$localStorage,$helpers){
  $scope.turnoverId = $localStorage.get('turnoverId');
  $helpers.loadingShow();
  GET.url = baseUrl + 'extOrders/' + locale + '/' +$scope.turnoverId;
  $http(GET).success(function(data) {
    $helpers.loadingHide();
    if (!data.list || data.list.length == 0) {
      //alert("此桌还没有点单。");
      $scope.orders = null;
      $helpers.loadingHide();
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

  $scope.orderEdit = function(){
    // window.location.href = '#/app/orderHistoryEdit';
    $state.go('app.orderHistoryEdit');
  }

})
.controller('takeawayCategoryCtrl',function($scope,$http,$location,$localStorage,$helpers){
  $scope.turnoverId = $localStorage.get('turnoverId');
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
.controller('takeawayProductListCtrl',function($scope,$http,$stateParams, $ionicModal,$localStorage,$helpers){
  $scope.turnoverId = $localStorage.get('turnoverId');
  $scope.categoryId = $stateParams.categoryId;
  $scope.categoryName = $stateParams.categoryName;

  if($localStorage.get('cartDataT-'+$scope.turnoverId)){
    cartDataT = $localStorage.get('cartDataT-'+$scope.turnoverId);
    $scope.cart = JSON.parse(cartDataT);
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
    $scope.cart = angular.fromJson($localStorage.get('cartDataT-'+$scope.turnoverId));
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

      $localStorage.set('cartDataT-'+$scope.turnoverId,angular.toJson($scope.cart));
      $scope.currentCount = 0;
      $scope.cartData = $localStorage.get('cartDataT-'+$scope.turnoverId);
      $helpers.alertHelper('reussit');
    }
  }
})
.controller('takeawayCartCtrl',function($scope,$http,$ionicPopup,$filter,$localStorage,$helpers,$state){

  $scope.turnoverId = $localStorage.get('turnoverId');


  if($localStorage.get('cartDataT-'+$scope.turnoverId)){
    cartData = angular.fromJson($localStorage.get('cartDataT-'+$scope.turnoverId));
    $scope.cartData = cartData;
  }else{
    $scope.cartData = null;
  }

  $scope.removeItem = function(index) {
    $scope.cartData.splice(index, 1);
    $state.go($state.current, {}, {reload: true});
  };

  $scope.removeAll = function(){
    $helpers.alertBeforeDeleleTakeaway('delete all',$scope.turnoverId);
  }
  $scope.addCount = function(index){

    $scope.cartData[index].count = $scope.cartData[index].count+1;
    $scope.$watch('cartData',
    function(newValue, oldValue) {
      window.localStorage.setItem('cartDataT-'+$scope.turnoverId, angular.toJson(newValue));
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
    $localStorage.set('cartDataT-'+$scope.turnoverId, angular.toJson(newValue));
  });
  console.log($localStorage.get('cartDataT-'+$scope.turnoverId));

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
            window.localStorage.setItem('cartDataT-'+$scope.turnoverId, cartData);
            $helpers.refreshHelper();
            $helpers.redirectAlertHelper('Envoyé succée', '/takeaways/orderHistory');
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


});
