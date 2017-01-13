'use strict';

angular.module('exportatucarroAdmin.bikes', ['ngRoute', 'service.module'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/admin/motos', {
    templateUrl: 'appAdmin/bikes/bikes.html',
    controller: 'BikesCtrl',
    controllerAs : 'bikesCtrl'
  })
}])


.controller('BikesCtrl', ['$http', '$rootScope', '$routeParams', '$scope','$location', '$route', 'CurrentData', function($http, $rootScope, $routeParams, $scope, $location, $route, CurrentData) {
	var bikesCtrl = this;
	var search, start, number, pagination, sort, make, model, year;

	bikesCtrl.editingBike = false;
	bikesCtrl.creatingBike = false;
	bikesCtrl.newBike = {};
	bikesCtrl.countries = mCountries;


	// Meta tags
	$rootScope.robot = mBikesRobot;
	$rootScope.pageTitle = mBikesTitle;
	$rootScope.pageDescription = mBikesPageDescription;
	$rootScope.url = $location.absUrl();


	// On controller loaded
    $scope.$on('$viewContentLoaded', function() {
		
	});

    // On controller destroy
   	$scope.$on("$destroy", function(){


	});

	// Conditions
	bikesCtrl.conditions = [
		'new',
		'used'
	];

	// Type
	bikesCtrl.types = [
		'racing',
		'choper',
		'rally'
	];


	this.callServer = function(tableState){

		pagination = tableState.pagination;
	    start = pagination.start || 0;  
	    number = pagination.number || 30; 

	    if (tableState.search.predicateObject) {
	    	search = tableState.search.predicateObject;

		    if (search.make) {
		    	make = search.make.toLowerCase();
		    }else{
		    	make = null;
		    }
		    if (search.year) {
		    	year = parseInt(search.year);
		    }else{
		    	year = null;
		    }
		    if (search.model) {
		    	model = search.model.toLowerCase();
		    }else{
		    	model = null;
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

	   	CurrentData.getBikes(start, number, sort, make, year, model).then(function(response){
			bikesCtrl.bikes = response.data.results;
			tableState.pagination.numberOfPages = Math.ceil(response.data.results.count/pagination.number);

		});

	};


	this.openEdit = function(row){

		CurrentData.getBikeDetail(row.objectId).then(function(response){
			bikesCtrl.editBike = response.data;

			// Show edit bike modal
			$('#edit-bike-modal').modal('show');

		});
	};


	this.openAddNew = function(){

		// Show add new bike modal
		$('#add-new-bike-modal').modal('show');

	};



	this.submitNew = function(){

		bikesCtrl.newCreatedBike = {};


		if (!bikesCtrl.newBike.newMainImage) {
			alert('Selecciona una imagen principal');
			return;
		};

		if (!bikesCtrl.newBike.imagesFiles) {
			alert('Selecciona al menos otra imagen descriptiva');
			return;
		};


		bikesCtrl.creatingBike = true;

		bikesCtrl.newCreatedBike.category = 'bikes';
		bikesCtrl.newCreatedBike.make = bikesCtrl.newBike.make.toLowerCase();
		bikesCtrl.newCreatedBike.model = bikesCtrl.newBike.model.toLowerCase();
		bikesCtrl.newCreatedBike.modelDetail = bikesCtrl.newBike.modelDetail.toLowerCase();
		bikesCtrl.newCreatedBike.engine = bikesCtrl.newBike.engine.toLowerCase();
		bikesCtrl.newCreatedBike.transmission = bikesCtrl.newBike.transmission.toLowerCase();
		bikesCtrl.newCreatedBike.color = bikesCtrl.newBike.color.toLowerCase();
		bikesCtrl.newCreatedBike.type = bikesCtrl.newBike.type;
		bikesCtrl.newCreatedBike.condition = bikesCtrl.newBike.condition;
		bikesCtrl.newCreatedBike.year = bikesCtrl.newBike.year;
		bikesCtrl.newCreatedBike.mileage = bikesCtrl.newBike.mileage;
		bikesCtrl.newCreatedBike.reservationPrice = bikesCtrl.newBike.reservationPrice;
		bikesCtrl.newCreatedBike.features = bikesCtrl.newBike.features;
		bikesCtrl.newCreatedBike.active = bikesCtrl.newBike.active;
		bikesCtrl.newCreatedBike.price = bikesCtrl.newBike.price;
		bikesCtrl.newCreatedBike.countries = bikesCtrl.newBike.countries;


    	// Saving main image
    	$http({
    		method : 'POST', 
			headers: mPostImageHeaderJson,
			data: bikesCtrl.newBike.newMainImage,
    		url : apiUrl+'/files/file'

    		}).success(function(data){

				bikesCtrl.newCreatedBike.mainImage = {
					'name': data.name,
				    '__type': 'File',
				    'url': data.url
				};


				// Creating bike
				$http({
		    		method : 'POST', 
					headers: mPostPutHeaderJson,
					data: bikesCtrl.newCreatedBike,
		    		url : apiUrl+'/classes/Bikes/'

		    		}).success(function(data){

		    			bikesCtrl.newCreatedBike.objectId = data.objectId;

	    				if (bikesCtrl.newBike.imagesFiles) {
							for (var i = bikesCtrl.newBike.imagesFiles.length - 1; i >= 0; i--) {
								bikesCtrl.uploadImage(bikesCtrl.newBike.imagesFiles[i], bikesCtrl.newCreatedBike.objectId);
							};
						};

						// Update Bikes
						CurrentData.getBikes(start, number, sort, make, year, model).then(function(response){
							bikesCtrl.bikes = response.data.results;
							bikesCtrl.creatingBike = false;
							$('#add-new-bike-modal').modal('hide');
						});

		    		});
    		});

	};



	this.submitEdit = function(){
		bikesCtrl.editedBike = {};

		bikesCtrl.editingBike = true;


		bikesCtrl.editedBike.make = bikesCtrl.editBike.make.toLowerCase();
		bikesCtrl.editedBike.model = bikesCtrl.editBike.model.toLowerCase();
		bikesCtrl.editedBike.modelDetail = bikesCtrl.editBike.modelDetail.toLowerCase();
		bikesCtrl.editedBike.engine = bikesCtrl.editBike.engine.toLowerCase();
		bikesCtrl.editedBike.transmission = bikesCtrl.editBike.transmission.toLowerCase();
		bikesCtrl.editedBike.type = bikesCtrl.editBike.type.toLowerCase();
		bikesCtrl.editedBike.color = bikesCtrl.editBike.color.toLowerCase();
		bikesCtrl.editedBike.features = bikesCtrl.editBike.features;
		bikesCtrl.editedBike.year = bikesCtrl.editBike.year;
		bikesCtrl.editedBike.mileage = bikesCtrl.editBike.mileage;
		bikesCtrl.editedBike.condition = bikesCtrl.editBike.condition;
		bikesCtrl.editedBike.active = bikesCtrl.editBike.active;
		bikesCtrl.editedBike.reservationPrice = bikesCtrl.editBike.reservationPrice;
		bikesCtrl.editedBike.price = bikesCtrl.editBike.price;
		bikesCtrl.editedBike.countries = bikesCtrl.editBike.countries;



		if (bikesCtrl.editBike.imagesRemoved) {
			bikesCtrl.editedBike.images = [];

			for (var i = bikesCtrl.editBike.images.length - 1; i >= 0; i--) {
				bikesCtrl.editBike.images[i]

    			var pointer = {
					__type: "Pointer",
					className: "Images",
					objectId: bikesCtrl.editBike.images[i].objectId
				};

				bikesCtrl.editedBike.images.unshift(pointer);
			};

		};


    	if (bikesCtrl.editBike.newMainImage) {

    		// Saving main image
	    	$http({
	    		method : 'POST', 
				headers: mPostImageHeaderJson,
				data: bikesCtrl.editBike.newMainImage,
	    		url : apiUrl+'/files/file'

	    		}).success(function(data){

	    			bikesCtrl.editedBike.mainImage = {
						'name': data.name,
					    '__type': 'File',
					    'url': data.url
					};

	    			// Updating bike
	    			$http({
			    		method : 'PUT', 
						headers: mPostPutHeaderJson,
						data: bikesCtrl.editedBike,
			    		url : apiUrl+'/classes/Bikes/'+bikesCtrl.editBike.objectId

			    		}).success(function(data){

			    			if (bikesCtrl.editBike.imagesFiles) {
								for (var i = bikesCtrl.editBike.imagesFiles.length - 1; i >= 0; i--) {
									bikesCtrl.uploadImage(bikesCtrl.editBike.imagesFiles[i], bikesCtrl.editBike.objectId);
								};
							};

							// Update Bikes
							CurrentData.getBikes(start, number, sort, make, year, model).then(function(response){
								bikesCtrl.bikes = response.data.results;
								bikesCtrl.editingBike = false;
    							$('#edit-bike-modal').modal('hide');
							});

			    		});

				});

		}else{

		    // Updating bike
			$http({
	    		method : 'PUT', 
				headers: mPostPutHeaderJson,
				data: bikesCtrl.editedBike,
	    		url : apiUrl+'/classes/Bikes/'+bikesCtrl.editBike.objectId

	    		}).success(function(data){

	    			if (bikesCtrl.editBike.imagesFiles) {
						for (var i = bikesCtrl.editBike.imagesFiles.length - 1; i >= 0; i--) {
							bikesCtrl.uploadImage(bikesCtrl.editBike.imagesFiles[i], bikesCtrl.editBike.objectId);
						};
					};

					// Update Bikes
					CurrentData.getBikes(start, number, sort, make, year, model).then(function(response){
						bikesCtrl.bikes = response.data.results;
						bikesCtrl.editingBike = false;
						$('#edit-bike-modal').modal('hide');
					});

	    		});

		};
	};



	this.uploadImage = function(imagen, objectId){

	   	// Uploadin image
    	$http({
    		method : 'POST', 
			headers: mPostImageHeaderJson,
			data: imagen,
    		url : apiUrl+'/files/file'

    		}).success(function(data){

				// Creating images object
				$http({
		    		method : 'POST', 
					headers: mPostPutHeaderJson,
					data: { 'image': {
								'name': data.name,
							    '__type': 'File',
							    'url': data.url
							}
					},
		    		url : apiUrl+'/classes/Images/'

		    		}).success(function(data){

	    				// Adding pointer
						var addedImage = {
							images: {
								__op:"Add",
								objects:[
					    			{
									__type: "Pointer",
									className: "Images",
									objectId: data.objectId
									}
								]	
							}
						};

						// Adding image pointer to bike	
						$http({
				    		method : 'PUT', 
							headers: mPostPutHeaderJson,
							data: addedImage,
				    		url : apiUrl+'/classes/Bikes/'+objectId

				    		}).success(function(data){});


		    		});

    		});

	};



	this.deleteImage = function(image){

		bikesCtrl.editBike.images.removeJson('objectId', image.objectId);
		bikesCtrl.editBike.imagesRemoved = true;

	};



	$('#add-new-bike-modal').on('hidden.bs.modal', function () {

		angular.element($('#bikes')).scope().bikesCtrl.clearNew();
		angular.element($('#bikes')).scope().$apply();
	});

	this.clearNew = function(){
		bikesCtrl.newBike = {};
	};


	this.onCountrySelected = function(bike){

		if(!bike.countries) bike.countries = [];

		var countryFee = {}
		countryFee.country = bikesCtrl.country;
		countryFee.fee = 0;
		bike.countries.push(countryFee);
		bikesCtrl.country = null;


	};

	this.removeCountry = function(bike, country){
		bike.countries.removeJson('country', country);
	}


}]);