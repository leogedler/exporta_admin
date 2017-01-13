'use strict';

angular.module('exportatucarroAdmin.orders', ['ngRoute', 'service.module'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/admin/ordenes', {
    templateUrl: 'appAdmin/orders/orders.html',
    controller: 'OrdersCtrl',
    controllerAs : 'ordersCtrl'
  })
}])



.controller('OrdersCtrl', ['$http', '$rootScope', '$routeParams', '$scope','$location', '$route', 'CurrentData', function($http, $rootScope, $routeParams, $scope, $location, $route, CurrentData) {
	var ordersCtrl = this;
	var search, pagination, start, number, sort, objectId, userId, userFirstName, userLastName;


	ordersCtrl.editingOrder = false;
	ordersCtrl.creatingTire = false;
	ordersCtrl.newTire = {};


	// Meta tags
	$rootScope.robot = mOrdersRobot;
	$rootScope.pageTitle = mOrdersTitle;
	$rootScope.pageDescription = mOrdersPageDescription;
	$rootScope.url = $location.absUrl();


	// On controller loaded
    $scope.$on('$viewContentLoaded', function() {
		
	});

    // On controller destroy
   	$scope.$on("$destroy", function(){


	});

	// Statuses
	ordersCtrl.statuses = [
		'procesandose',
		'procesada',
		'entregada'
	];


	// Countries
	ordersCtrl.countries = mCountries;


	this.callServer = function(tableState){

		pagination = tableState.pagination;
	    start = pagination.start || 0;  
	    number = pagination.number || 30; 

	    if (tableState.search.predicateObject) {
	    	search = tableState.search.predicateObject;

	    	if (search.objectId) {
		    	objectId = search.objectId;
		    }else{
		    	objectId = null;
		    }
		    if (search.userId) {
		    	userId = search.userId;
		    }else{
		    	userId = null;
		    }
		    if (search.userFirstName) {
		    	userFirstName = search.userFirstName.toLowerCase();
		    }else{
		    	userFirstName = null;
		    }
		    if (search.userLastName) {
		    	userLastName = search.userLastName.toLowerCase();
		    }else{
		    	userLastName = null;
		    }
	    };

	    if (tableState.sort.predicate) {
	    	if (tableState.sort.reverse) {
	    		sort = tableState.sort.predicate;
	    	}else{
	    		sort = "-"+tableState.sort.predicate;
	    	};
	    }else{
	    	sort= "-createdAt";
	    };

	   	CurrentData.getOrders(start, number, sort, objectId, userId, userFirstName, userLastName).then(function(response){
			ordersCtrl.orders = response.data.results;
			tableState.pagination.numberOfPages = Math.ceil(response.data.results.count/pagination.number);

		});

	};


	this.openEdit = function(id){

		CurrentData.getOrder(id).then(function(response){
			ordersCtrl.editOrder = response.data;

			if (ordersCtrl.editOrder.items[0].category == 'tires'){
				ordersCtrl.tireItem = true;
				ordersCtrl.vehicleItem = false;
			}else{
				ordersCtrl.vehicleItem = true;
				ordersCtrl.tireItem = false;
			}	


			for (var i = ordersCtrl.editOrder.items.length - 1; i >= 0; i--) {

				ordersCtrl.editOrder.items[i].price = ordersCtrl.editOrder.orderData[i].price;
				ordersCtrl.editOrder.items[i].destFee = ordersCtrl.editOrder.orderData[i].destFee;
				ordersCtrl.editOrder.items[i].reservationPrice = ordersCtrl.editOrder.orderData[i].reservationPrice;
				ordersCtrl.editOrder.items[i].remainingToPay = ordersCtrl.editOrder.orderData[i].remainingToPay;
				ordersCtrl.editOrder.items[i].quantity = ordersCtrl.editOrder.orderData[i].quantity;
				ordersCtrl.editOrder.items[i].discount = ordersCtrl.editOrder.orderData[i].discount;
				ordersCtrl.editOrder.items[i].wishColor = ordersCtrl.editOrder.orderData[i].wishColor;

			};

			ordersCtrl.getTotal(ordersCtrl.editOrder.items);

			// Show edit user modal
			$('#edit-order-modal').modal('show');

		});
	};

	// Check for Order Id
	if ($routeParams.id) {
		ordersCtrl.openEdit($routeParams.id);
	};

	this.editProduct = function(product){

		product.remainingToPay = (product.price * product.quantity) - product.paid;
		ordersCtrl.getTotal(ordersCtrl.editOrder.items);
	};

	this.getTotal = function(items){

		// ordersCtrl.editOrder.totalPaid = 0;
		// ordersCtrl.editOrder.remainingToPay = 0;

		// for (var i = items.length - 1; i >= 0; i--) {
		// 	var product = items[i]

		// 	ordersCtrl.editOrder.totalPaid += product.paid;
		// 	ordersCtrl.editOrder.remainingToPay += product.remainingToPay;
		// };
	}


	this.openAddNew = function(){
		// Show add new user modal
		$('#add-new-order-modal').modal('show');

	};



	this.submitNew = function(){

	};



	this.submitEdit = function(){
		ordersCtrl.editedOrder = {};
		ordersCtrl.editingOrder = true;

		// User data
		ordersCtrl.editedOrder.userFirstName = ordersCtrl.editOrder.userFirstName.toLowerCase();
		ordersCtrl.editedOrder.userLastName = ordersCtrl.editOrder.userLastName.toLowerCase();
		ordersCtrl.editedOrder.userEmail = ordersCtrl.editOrder.userEmail.toLowerCase();
		ordersCtrl.editedOrder.userPhone = ordersCtrl.editOrder.userPhone.toLowerCase();
		ordersCtrl.editedOrder.userCountry = ordersCtrl.editOrder.userCountry.toLowerCase();

		// Order data
		ordersCtrl.editedOrder.status = ordersCtrl.editOrder.status;
		ordersCtrl.editedOrder.totalOrder = ordersCtrl.editOrder.totalOrder;
		ordersCtrl.editedOrder.totalPaid = ordersCtrl.editOrder.totalPaid;
		ordersCtrl.editedOrder.remainingToPay = ordersCtrl.editOrder.totalOrder - ordersCtrl.editOrder.totalPaid;
		if (ordersCtrl.editedOrder.remainingToPay == 0) {
			ordersCtrl.editedOrder.paid = true;
		}else{
			ordersCtrl.editedOrder.paid = false;
		};

		ordersCtrl.editedOrder.items = [];
		ordersCtrl.editedOrder.orderData = [];


		for (var i = ordersCtrl.editOrder.items.length - 1; i >= 0; i--) {
			var item = ordersCtrl.editOrder.items[i];
			var pointer = {
				__type: "Pointer",
				className: Capitalize(item.category),
				objectId: item.objectId
			};

			var orderData = {
				objectId: item.objectId,
				className: Capitalize(item.category),
				quantity: item.quantity,
				price : item.price,
				reservationPrice: item.reservationPrice,
				paid: item.paid,
				remainingToPay: item.remainingToPay,
				discount : item.discount
			};

			ordersCtrl.editedOrder.items.unshift(pointer);	
			ordersCtrl.editedOrder.orderData.unshift(orderData);
		};


	    // Updating order
    	$http({
    		method : 'PUT', 
			headers: mPostPutHeaderJson,
			data: ordersCtrl.editedOrder,
    		url : apiUrl+'/classes/Orders/'+ordersCtrl.editOrder.objectId

    		}).success(function(response){

				// Update orders
				CurrentData.getOrders(start, number, sort, objectId, userId, userFirstName, userLastName).then(function(response){
					ordersCtrl.orders = response.data.results;
					ordersCtrl.editingOrder = false;
					$('#edit-order-modal').modal('hide');
				});

    		});

		
	};



	$('#add-new-user-modal').on('hidden.bs.modal', function () {
		angular.element($('#orders')).scope().ordersCtrl.clearNew();
		angular.element($('#orders')).scope().$apply();
	});

	$('#edit-order-modal').on('hidden.bs.modal', function () {
		angular.element($('#orders')).scope().ordersCtrl.clearUrl();
		angular.element($('#orders')).scope().$apply();
	});



	this.clearNew = function(){
		ordersCtrl.newUser = {};
	};

	this.clearUrl = function(){
		$location.url($location.path());
	};


}]);