angular.module('starter.controllers', [ 'ngResource' ])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $localStorage,$http,$tunerover,$state,$helpers) {

	baseUrl = $localStorage.get('server_address');
	defaultThumb = $localStorage.get('defaultThumb');
	categoryRootUrl = $localStorage.get('categoryRootUrl');
	productRootUrl = $localStorage.get('productRootUrl');
	$scope.selectedTableId = null;
	$scope.selectedTableId = window.localStorage.getItem('selectedTableId');
	$scope.turnoverId = window.localStorage.getItem('turnoverId');

	$scope.checkTurnoverHealth = function(turnoverId){
		console.log("turnoverId = "+turnoverId);
		 $tunerover.getTurnoverById(turnoverId).then(function(data){
		//	 $scope.test = data.model.turnover;
			 //console.log($scope.test);
			console.log(data.model.turnover.checkout);
			if(data.model.turnover.checkout != false){
				$helpers.alertHelper('当前桌号已被清台');
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

.controller(
	'searchCtrl',
	function($scope, $http, $ionicModal) {

		$scope.pnum = "";
		$scope.orders = [];

		$ionicModal.fromTemplateUrl('templates/done.html', {
			scope : $scope,
			animation : 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal;
		});
		$scope.$on('modal.hidden', function() {
			alert("hidden");
			$scope.pnum = null;
			queryProducts($scope.pnum);
		});

		$scope.clickKey = function($event, i) {
			if (i == 10) {
				$scope.pnum = $scope.pnum.length == 0 ? '' : $scope.pnum
				.substring(0, $scope.pnum.length - 1);
			} else if (i == 11) {
				$scope.pnum = '';
			} else {
				$scope.pnum += i;
			}
			queryProducts($scope.pnum);
		};

		$scope.clickDone = function() {
			var queryTables = function() {
				GET.url = baseUrl + 'availableTables';
				$http(GET).success(function(data) {
					$scope.rangeTableModel = {
						tables : data.list,
						maxTableNo : data.list.length,
						tableNo : 0
					}
				}).error(function(data) {
					alert(data);
				});
			};

			queryTables();
			$scope.modal.show();
		};

		$scope.changeTableNo = function(tno) {
			var tables = $scope.rangeTableModel.tables;
			for (var i = 0; i < tables.length; i++) {
				if (tables[i].id == tno) {
					if (!tables[i].available) {
						alert("此桌不可用");
					} else if (tables[i].turnover) {
						alert("此桌客人需要加菜");
					}
					break;
				}
			}
		};

		$scope.clickRemove = function(id) {
			var size = $scope.orders.length;
			for (var i = 0; i < size; i++) {
				if ($scope.orders[i].id == id) {
					$scope.orders.splice(i, 1);
					break;
				}
			}
		}

		$scope.clickCount = function($event, id, increment) {
			var isNew = true;
			var size = $scope.orders.length;
			var count = 0;
			for (var i = 0; i < size; i++) {
				if ($scope.orders[i].id == id) {
					count = $scope.orders[i].count;
					count += increment;
					if (count <= 0) {
						count = 0;
						$scope.orders.splice(i, 1);
					} else {
						$scope.orders[i].count = count;
					}
					isNew = false;
					break;
				}
			}
			if (isNew && increment == 1) {
				count = 1;
				$scope.orders[size] = {
					id : id,
					count : count
				}
			}
			document.getElementById('count' + id).innerHTML = "" + count;
		}

		var queryProducts = function(num) {
			// TODO query by product num, controller of server need to add
			if (!num) {
				num = 11;
			}
			GET.url = baseUrl + 'products/' + locale + '/' + num;
			$http(GET).success(function(data) {
				var list = data.list;
				for (var i = 0; i < list.length; ++i) {
					var thumb = list[i].thumb;
					list[i].thumb = convertImageURL(thumb);
				}
				$scope.products = list;

			}).error(function(data) {
				alert(data);
			});
		};

		queryProducts($scope.pnum);
	})

	.controller('OrderListCtrl', function($scope, $http) {

		$scope.orders = null;
		$scope.changeTableNo = function(tno) {
			var tables = $scope.rangeTableModel.tables;
			var turnoverId = null;
			for (var i = 0; i < tables.length; i++) {
				if (tables[i].id == tno) {
					if (tables[i].turnover) {
						turnoverId = tables[i].turnover.id;
					}
					break;
				}
			}
			if (!turnoverId) {
				alert("此桌没有客人");
				$scope.orders = null;
				return;
			}
			GET.url = baseUrl + 'orders/' + locale + '/' + turnoverId;
			$http(GET).success(function(data) {
				if (!data.list || data.list.length == 0) {
					alert("此桌还没有点单。");
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
		};

		var queryTables = function() {
			GET.url = baseUrl + 'availableTables';
			$http(GET).success(function(data) {
				$scope.rangeTableModel = {
					tables : data.list,
					maxTableNo : data.list.length,
					tableNo : 0
				}
			}).error(function(data) {
				alert(data);
			});
		};

		queryTables();
	})

	.controller('CategoryCtrl',function($scope,$http,$location){
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

	.controller('ProductListCtrl',function($scope,$http,$stateParams, $ionicModal){
		$scope.checkTurnoverHealth($scope.turnoverId);
		$scope.categoryId = $stateParams.categoryId;
		$scope.categoryName = $stateParams.categoryName;
		$scope.currentCount = [];
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

		$scope.openModal = function(index) {
			$scope.modal.show();
			$scope.product = $scope.productList[index]
			$scope.currentCount[$scope.product.id] = 0;
			addData = {
				"product_id":"3",
				"list":{
					"product_id":"3",
					"product_name":"Product Name",
					"category_id":"1",
					"category_name":"Category name",
					"count":"1",
					"attribute":{

					}
				}
			}
			// test
		var	cartData ={ "results":[
				{
					"product_id":"1",
					"list":{
						"product_id":"1",
						"product_name":"Product Name",
						"category_id":"1",
						"category_name":"Category name",
						"count":"1",
						"attribute":{
						}
					}
				},
				{
					"product_id":"2",
					"list":{
						"product_id":"2",
						"product_name":"Product Name",
						"category_id":"1",
						"category_name":"Category name",
						"count":"1",
						"attribute":{

						}
					}
				},
				{
					"product_id":"3",
					"list":{
						"product_id":"3",
						"product_name":"Product Name",
						"category_id":"1",
						"category_name":"Category name",
						"count":"1",
						"attribute":{

						}
					}
				}
			]
			};
			$scope.cartData = cartData;

			angular.forEach($scope.cartData,function(value,key){
						value.push(addData);
				});
				console.log($scope.cartData);


		// $scope.cartData.forEach(function (v) {
		//
		// 			//$scope.cartData.push(addData);
		// 	});



			//window.localStorage.setItem('cartData11122',null);
			// window.localStorage.setItem('cartData-'+$scope.selectedTableId,JSON.stringify(cartData));
			// $scope.testData = window.localStorage.getItem('cartData-'+$scope.selectedTableId);
			// console.log(JSON.parse($scope.testData));
			// console.log($scope.selectedTableId);
			// var post = [{
			//   name: 'Thoughts',
			//   text: 'Today was a good day'
			// },{		  name: 'Thoughts2',
			// 		  text: 'Today was a good day2'}];
			//
			// window.localStorage['post'] = JSON.stringify(null);
			//
			// var post = JSON.parse(window.localStorage['post'] || '{}');
			// console.log(post);
			//
		};
		$scope.closeModal = function() {
			$scope.modal.hide();
		};

		$scope.addCount = function(productId){
			$scope.currentCount[productId] = $scope.currentCount[productId]+1;

		}

		$scope.subtractCount = function(productId){
			if($scope.currentCount[productId] == 0){
				$scope.currentCount[productId] = 0;
			}else{
				$scope.currentCount[productId] = $scope.currentCount[productId]-1;
			}
		}
	})

	.controller('tableListCtrl',function($scope,$http,$ionicActionSheet,$window,$state,$helpers) {

		//	$helpers.refreshHelper();

		GET.url = baseUrl + 'availableTables';
		$http(GET).success(function(data) {
			if (!data.list || data.list.length == 0) {
				alert("没有桌子信息");
				$scope.tableList = null;
				return;
			}
			var list = data.list;
			$scope.tableList = list;
			// Stop the ion-refresher from spinning
			$scope.$broadcast('scroll.refreshComplete');
		}).error(function(data) {
			alert(data);
		})

$scope.doRefresh = function(){
	GET.url = baseUrl + 'availableTables';
	$http(GET).success(function(data) {
		if (!data.list || data.list.length == 0) {
			alert("没有桌子信息");
			$scope.tableList = null;
			return;
		}
		var list = data.list;
		$scope.tableList = list;
		// Stop the ion-refresher from spinning
		$scope.$broadcast('scroll.refreshComplete');
	}).error(function(data) {
		alert(data);
	})
}

		// 开桌Action
		$scope.activeTableActionSheet = function(tableId){
			// Show the action sheet
			var hideSheet = $ionicActionSheet.show({
				buttons: [
					{ text: '<b> Activer T-'+tableId+'</b>' }
				],
				//	destructiveText: 'Delete',
				titleText: "Qu'est ce que vous voulez faire ... ?",
				cancelText: 'Annuler',
				cancel: function() {
					return true;
				},
				buttonClicked: function(index) {

					POST.url = baseUrl + 'openTable';
					POST.data = JSON.stringify({"tableId":tableId});
					$http(POST).success(function(data){
						window.localStorage.setItem('selectedTableId', data.model.firstTableId);
						window.localStorage.setItem('turnoverId', data.model.id);
						$window.location.href = '#/app/tabs/orderHistory';
					})

				}
			});

			// // For example's sake, hide the sheet after two seconds
			// $timeout(function() {
			// 	hideSheet();
			// }, 2000);
		};

		// 查看已开桌
		$scope.checkTableActionSheet = function(tableId,turnoverId){
			// Show the action sheet
			var hideSheet = $ionicActionSheet.show({
				buttons: [
					{ text: '<b> <i class="ion-eye"></i>  Voir T-'+tableId+'</b>' }
				],
				//destructiveText: "L'addition",
				titleText: "Qu'est ce que vous voulez faire ... ?",
				cancelText: 'Annuler',
				cancel: function() {
					// add cancel code..
				},
				buttonClicked: function(index) {
					if(index == 0) {
						window.localStorage.setItem('selectedTableId', tableId);
						window.localStorage.setItem('turnoverId', turnoverId);
						$window.location.href = '#/app/tabs/orderHistory';
						//	$window.location.reload();
					}
					return true;
				}
			});

			// 	// For example's sake, hide the sheet after two seconds
			// 	$timeout(function() {
			// 		hideSheet();
			// 	}, 2000);
		};

	})


	.controller('orderHistoryCtrl',function($scope,$http,$stateParams){
		$scope.checkTurnoverHealth($scope.turnoverId);
		$scope.turnoverId = window.localStorage.getItem('turnoverId');
		$scope.selectedTableId = 	window.localStorage.getItem('selectedTableId');

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
		}).error(function(data) {
			alert(data);
		});
	})

	.controller('cartCtrl',function($scope,$http,$ionicPopup,$filter){
			$scope.checkTurnoverHealth($scope.turnoverId);
		//var single_object = null;
		$scope.testData = JSON.parse(window.localStorage.getItem('cartData-'+$scope.selectedTableId));
		 single_object = $filter('filter')($scope.testData.results, {product_id:2})[0];
		console.log($scope.testData);
		console.log(single_object);
	})



	.controller('adminCtrl',function($scope,$http,$ionicPopup,$ionicActionSheet,$helpers){
		$scope.checkTurnoverHealth($scope.turnoverId);
		$scope.turnoverId = window.localStorage.getItem('turnoverId');
		$scope.selectedTableId = 	window.localStorage.getItem('selectedTableId');
		/* get order informations and calculated total price */
		GET.url = baseUrl + 'orders/' + locale + '/' + $scope.turnoverId;
		$http(GET).success(function(data){
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
		}).error(function(data) {
			alert(data);
		});

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
						window.localStorage.setItem('selectedTableId', null);
						window.localStorage.setItem('turnoverId', null);
						$helpers.alertHelper('清台成功');
					})
				} else {

				}
			});


		};

	});
