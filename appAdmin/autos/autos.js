'use strict';

angular.module('exportatucarroAdmin.autos', ['ngRoute', 'service.module'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/admin/automoviles', {
    templateUrl: 'appAdmin/autos/autos.html',
    controller: 'AutosCtrl',
    controllerAs : 'autosCtrl'
  })
}])


.controller('AutosCtrl', ['$http', '$rootScope', '$routeParams', '$scope','$location', '$route', 'CurrentData', function($http, $rootScope, $routeParams, $scope, $location, $route, CurrentData) {
	var autosCtrl = this;
	var search, start, number, pagination, sort, make, model, year;

	autosCtrl.editingAuto = false;
	autosCtrl.creatingAuto = false;
	autosCtrl.newAuto = {};
	autosCtrl.countries = mCountries;

	// [{"__type":"Pointer","className":"Images","objectId":"sjHWwK9HUG"},{"__type":"Pointer","className":"Images","objectId":"HxCbgd3jHj"},{"__type":"Pointer","className":"Images","objectId":"ivs4nI4xZb"},{"__type":"Pointer","className":"Images","objectId":"L6eEnwm9eX"}]


	// Meta tags
	$rootScope.robot = mAutosRobot;
	$rootScope.pageTitle = mAutosTitle;
	$rootScope.pageDescription = mAutosPageDescription;
	$rootScope.url = $location.absUrl();


	// On controller loaded
    $scope.$on('$viewContentLoaded', function() {
		
	});

    // On controller destroy
   	$scope.$on("$destroy", function(){


	});

	// Conditions
	autosCtrl.conditions = [
		'new',
		'used'
	];

	// Type
	autosCtrl.types = [
		'coupe',
		'sedan',
		'hatchback'
	];

	// Stock
	autosCtrl.stockOptions = [
		true,
		false
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

	   	CurrentData.getAutos(start, number, sort, make, year, model).then(function(response){
			autosCtrl.autos = response.data.results;
			tableState.pagination.numberOfPages = Math.ceil(response.data.results.count/pagination.number);

		});

	};


	this.openEdit = function(row){

		CurrentData.getAutoDetail(row.objectId).then(function(response){
			autosCtrl.editAuto = response.data;

			// Show edit auto modal
			$('#edit-auto-modal').modal('show');

		});
	};


	this.openAddNew = function(){

		// Show add new auto modal
		$('#add-new-auto-modal').modal('show');

	};



	this.submitNew = function(){

		autosCtrl.newCreatedAuto = {};


		if (!autosCtrl.newAuto.newMainImage) {
			alert('Selecciona una imagen principal');
			return;
		};

		if (!autosCtrl.newAuto.imagesFiles) {
			alert('Selecciona al menos otra imagen descriptiva');
			return;
		};


		autosCtrl.creatingAuto = true;

		autosCtrl.newCreatedAuto.category = 'autos';
		autosCtrl.newCreatedAuto.make = autosCtrl.newAuto.make.toLowerCase();
		autosCtrl.newCreatedAuto.model = autosCtrl.newAuto.model.toLowerCase();
		autosCtrl.newCreatedAuto.modelDetail = autosCtrl.newAuto.modelDetail.toLowerCase();
		autosCtrl.newCreatedAuto.engine = autosCtrl.newAuto.engine.toLowerCase();
		autosCtrl.newCreatedAuto.transmission = autosCtrl.newAuto.transmission.toLowerCase();
		autosCtrl.newCreatedAuto.exteriorColor = autosCtrl.newAuto.exteriorColor.toLowerCase();
		autosCtrl.newCreatedAuto.interiorColor = autosCtrl.newAuto.interiorColor.toLowerCase();
		autosCtrl.newCreatedAuto.type = autosCtrl.newAuto.type;
		autosCtrl.newCreatedAuto.condition = autosCtrl.newAuto.condition;
		autosCtrl.newCreatedAuto.year = autosCtrl.newAuto.year;
		autosCtrl.newCreatedAuto.mileage = autosCtrl.newAuto.mileage;
		autosCtrl.newCreatedAuto.reservationPrice = autosCtrl.newAuto.reservationPrice;
		autosCtrl.newCreatedAuto.features = autosCtrl.newAuto.features;
		autosCtrl.newCreatedAuto.active = autosCtrl.newAuto.active;
		autosCtrl.newCreatedAuto.price = autosCtrl.newAuto.price;
		autosCtrl.newCreatedAuto.countries = autosCtrl.newAuto.countries;
		autosCtrl.newCreatedAuto.inStock = autosCtrl.newAuto.inStock;


    	// Saving main image
    	$http({
    		method : 'POST', 
			headers: mPostImageHeaderJson,
			data: autosCtrl.newAuto.newMainImage,
    		url : apiUrl+'/files/file'

    		}).success(function(data){

				autosCtrl.newCreatedAuto.mainImage = {
					'name': data.name,
				    '__type': 'File',
				    'url': data.url
				};


				// Creating auto
				$http({
		    		method : 'POST', 
					headers: mPostPutHeaderJson,
					data: autosCtrl.newCreatedAuto,
		    		url : apiUrl+'/classes/Autos/'

		    		}).success(function(data){

		    			autosCtrl.newCreatedAuto.objectId = data.objectId;

	    				if (autosCtrl.newAuto.imagesFiles) {
							for (var i = autosCtrl.newAuto.imagesFiles.length - 1; i >= 0; i--) {
								autosCtrl.uploadImage(autosCtrl.newAuto.imagesFiles[i], autosCtrl.newCreatedAuto.objectId);
							};
						};

						// Update autos
						CurrentData.getAutos(start, number, sort, make, year, model).then(function(response){
							autosCtrl.autos = response.data.results;
							autosCtrl.creatingAuto = false;
							$('#add-new-auto-modal').modal('hide');
						});

		    		});
    		});

	};



	this.submitEdit = function(){
		autosCtrl.editedAuto = {};

		autosCtrl.editingAuto = true;


		autosCtrl.editedAuto.make = autosCtrl.editAuto.make.toLowerCase();
		autosCtrl.editedAuto.model = autosCtrl.editAuto.model.toLowerCase();
		autosCtrl.editedAuto.modelDetail = autosCtrl.editAuto.modelDetail.toLowerCase();
		autosCtrl.editedAuto.engine = autosCtrl.editAuto.engine.toLowerCase();
		autosCtrl.editedAuto.transmission = autosCtrl.editAuto.transmission.toLowerCase();
		autosCtrl.editedAuto.type = autosCtrl.editAuto.type.toLowerCase();
		autosCtrl.editedAuto.exteriorColor = autosCtrl.editAuto.exteriorColor.toLowerCase();
		autosCtrl.editedAuto.interiorColor = autosCtrl.editAuto.interiorColor.toLowerCase();
		autosCtrl.editedAuto.features = autosCtrl.editAuto.features;
		autosCtrl.editedAuto.year = autosCtrl.editAuto.year;
		autosCtrl.editedAuto.mileage = autosCtrl.editAuto.mileage;
		autosCtrl.editedAuto.condition = autosCtrl.editAuto.condition;
		autosCtrl.editedAuto.active = autosCtrl.editAuto.active;
		autosCtrl.editedAuto.price = autosCtrl.editAuto.price;
		autosCtrl.editedAuto.countries = autosCtrl.editAuto.countries;
		autosCtrl.editedAuto.inStock = autosCtrl.editAuto.inStock;




		if (autosCtrl.editAuto.imagesRemoved) {
			autosCtrl.editedAuto.images = [];

			for (var i = autosCtrl.editAuto.images.length - 1; i >= 0; i--) {
				autosCtrl.editAuto.images[i]

    			var pointer = {
					__type: "Pointer",
					className: "Images",
					objectId: autosCtrl.editAuto.images[i].objectId
				};

				autosCtrl.editedAuto.images.unshift(pointer);
			};

		};


    	if (autosCtrl.editAuto.newMainImage) {

    		// Saving main image
	    	$http({
	    		method : 'POST', 
				headers: mPostImageHeaderJson,
				data: autosCtrl.editAuto.newMainImage,
	    		url : apiUrl+'/files/file'

	    		}).success(function(data){

	    			autosCtrl.editedAuto.mainImage = {
						'name': data.name,
					    '__type': 'File',
					    'url': data.url
					};

	    			// Updating auto
	    			$http({
			    		method : 'PUT', 
						headers: mPostPutHeaderJson,
						data: autosCtrl.editedAuto,
			    		url : apiUrl+'/classes/Autos/'+autosCtrl.editAuto.objectId

			    		}).success(function(data){

			    			if (autosCtrl.editAuto.imagesFiles) {
								for (var i = autosCtrl.editAuto.imagesFiles.length - 1; i >= 0; i--) {
									autosCtrl.uploadImage(autosCtrl.editAuto.imagesFiles[i], autosCtrl.editAuto.objectId);
								};
							};

							// Update autos
							CurrentData.getAutos(start, number, sort, make, year, model).then(function(response){
								autosCtrl.autos = response.data.results;
								autosCtrl.editingAuto = false;
    							$('#edit-auto-modal').modal('hide');
							});

			    		});

				});

		}else{

		    // Updating auto
			$http({
	    		method : 'PUT', 
				headers: mPostPutHeaderJson,
				data: autosCtrl.editedAuto,
	    		url : apiUrl+'/classes/Autos/'+autosCtrl.editAuto.objectId

	    		}).success(function(data){

	    			if (autosCtrl.editAuto.imagesFiles) {
						for (var i = autosCtrl.editAuto.imagesFiles.length - 1; i >= 0; i--) {
							autosCtrl.uploadImage(autosCtrl.editAuto.imagesFiles[i], autosCtrl.editAuto.objectId);
						};
					};

					// Update autos
					CurrentData.getAutos(start, number, sort, make, year, model).then(function(response){
						autosCtrl.autos = response.data.results;
						autosCtrl.editingAuto = false;
						$('#edit-auto-modal').modal('hide');
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

						// Adding image pointer to auto		
						$http({
				    		method : 'PUT', 
							headers: mPostPutHeaderJson,
							data: addedImage,
				    		url : apiUrl+'/classes/Autos/'+objectId

				    		}).success(function(data){});


		    		});

    		});

	};



	this.deleteImage = function(image){

		autosCtrl.editAuto.images.removeJson('objectId', image.objectId);
		autosCtrl.editAuto.imagesRemoved = true;

	};



	$('#add-new-auto-modal').on('hidden.bs.modal', function () {

		angular.element($('#autos')).scope().autosCtrl.clearNew();
		angular.element($('#autos')).scope().$apply();
	});

	this.clearNew = function(){
		autosCtrl.newAuto = {};
	};

	this.onCountrySelected = function(auto){

		if(!auto.countries) auto.countries = [];

		var countryFee = {}
		countryFee.country = autosCtrl.country;
		countryFee.fee = 0;
		auto.countries.push(countryFee);
		autosCtrl.country = null;

	};

	this.removeCountry = function(auto, country){
		auto.countries.removeJson('country', country);
	}


}]);