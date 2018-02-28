'use strict';

angular.module('exportatucarroAdmin.tires', ['ngRoute', 'service.module'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/admin/cauchos', {
    templateUrl: 'appAdmin/tires/tires.html',
    controller: 'TiresCtrl',
    controllerAs : 'tiresCtrl'
  })
}])


.controller('TiresCtrl', ['$http', '$rootScope', '$routeParams', '$scope','$location', '$route', 'CurrentData', function($http, $rootScope, $routeParams, $scope, $location, $route, CurrentData) {
	var tiresCtrl = this;
	var search, pagination, start, number, sort, rin, width, height, make, model;


	tiresCtrl.editingTire = false;
	tiresCtrl.creatingTire = false;
	tiresCtrl.newTire = {};
	tiresCtrl.countries = mCountries;


	// Meta tags
	$rootScope.robot = mTiresRobot;
	$rootScope.pageTitle = mTiresTitle;
	$rootScope.pageDescription = mTiresPageDescription;
	$rootScope.url = $location.absUrl();


	// On controller loaded
    $scope.$on('$viewContentLoaded', function() {
		
	});

    // On controller destroy
   	$scope.$on("$destroy", function(){


	});

	// Conditions
	tiresCtrl.conditions = [
		'new',
		'used'
	];

	// Type
	tiresCtrl.types = [
		'radial'
	];

	// Stock
	tiresCtrl.stockOptions = [
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
		    if (search.width) {
		    	width = parseInt(search.width);
		    }else{
		    	width = null;
		    }
		   	if (search.height) {
		    	height = parseInt(search.height);
		    }else{
		    	height = null;
		    }
		    if (search.rin) {
		    	rin = search.rin.toLowerCase();
		    }else{
		    	rin = null;
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

	   	CurrentData.getTires(start, number, sort, rin, width, height, make, model).then(function(response){
			tiresCtrl.tires = response.data.results;
			tableState.pagination.numberOfPages = Math.ceil(response.data.results.count/pagination.number);

		});

	};


	this.openEdit = function(row){

		CurrentData.getTireDetail(row.objectId).then(function(response){
			tiresCtrl.editTire = response.data;

			// Show edit tire modal
			$('#edit-tire-modal').modal('show');

		});
	};


	this.openAddNew = function(){

		// Show add new tire modal
		$('#add-new-tire-modal').modal('show');

	};



	this.submitNew = function(){

		tiresCtrl.newCreatedTire = {};


		if (!tiresCtrl.newTire.newMainImage) {
			alert('Selecciona una imagen principal');
			return;
		};

		if (!tiresCtrl.newTire.imagesFiles) {
			alert('Selecciona al menos otra imagen descriptiva');
			return;
		};


		tiresCtrl.creatingTire = true;

		tiresCtrl.newCreatedTire.category = 'tires';

		tiresCtrl.newCreatedTire.active = tiresCtrl.newTire.active;
		tiresCtrl.newCreatedTire.make = tiresCtrl.newTire.make.toLowerCase();
		tiresCtrl.newCreatedTire.model = tiresCtrl.newTire.model.toLowerCase();
		tiresCtrl.newCreatedTire.type = tiresCtrl.newTire.type.toLowerCase();
		tiresCtrl.newCreatedTire.width = tiresCtrl.newTire.width;
		tiresCtrl.newCreatedTire.height = tiresCtrl.newTire.height;
		tiresCtrl.newCreatedTire.diameter = tiresCtrl.newTire.diameter;
		tiresCtrl.newCreatedTire.rin = 'r'+tiresCtrl.newTire.diameter;
		tiresCtrl.newCreatedTire.dimensions = tiresCtrl.newTire.width+'/'+tiresCtrl.newTire.height+'R'+tiresCtrl.newTire.diameter;
		tiresCtrl.newCreatedTire.description = tiresCtrl.newTire.description;
		tiresCtrl.newCreatedTire.price = tiresCtrl.newTire.price;
		tiresCtrl.newCreatedTire.countries = tiresCtrl.newCreatedTire.countries;
		tiresCtrl.newCreatedTire.inStock = tiresCtrl.newCreatedTire.inStock;


    	// Saving main image
    	$http({
    		method : 'POST', 
			headers: mPostImageHeaderJson,
			data: tiresCtrl.newTire.newMainImage,
    		url : apiUrl+'/files/file'

    		}).success(function(data){

				tiresCtrl.newCreatedTire.mainImage = {
					'name': data.name,
				    '__type': 'File',
				    'url': data.url
				};


				// Creating tire
				$http({
		    		method : 'POST', 
					headers: mPostPutHeaderJson,
					data: tiresCtrl.newCreatedTire,
		    		url : apiUrl+'/classes/Tires/'

		    		}).success(function(data){

		    			tiresCtrl.newCreatedTire.objectId = data.objectId;

	    				if (tiresCtrl.newTire.imagesFiles) {
							for (var i = tiresCtrl.newTire.imagesFiles.length - 1; i >= 0; i--) {
								tiresCtrl.uploadImage(tiresCtrl.newTire.imagesFiles[i], tiresCtrl.newCreatedTire.objectId);
							};
						};

						// Update Tires
						CurrentData.getTires(start, number, sort, rin, width, height, make, model).then(function(response){
							tiresCtrl.tires = response.data.results;
							tiresCtrl.creatingTire = false;
							$('#add-new-tire-modal').modal('hide');
						});

		    		});
    		});

	};



	this.submitEdit = function(){
		tiresCtrl.editedTire = {};

		tiresCtrl.editingTire = true;

		tiresCtrl.editedTire.active = tiresCtrl.editTire.active;
		tiresCtrl.editedTire.make = tiresCtrl.editTire.make.toLowerCase();
		tiresCtrl.editedTire.model = tiresCtrl.editTire.model.toLowerCase();
		tiresCtrl.editedTire.type = tiresCtrl.editTire.type.toLowerCase();
		tiresCtrl.editedTire.width = tiresCtrl.editTire.width;
		tiresCtrl.editedTire.height = tiresCtrl.editTire.height;
		tiresCtrl.editedTire.diameter = tiresCtrl.editTire.diameter;
		tiresCtrl.editedTire.rin = 'r'+tiresCtrl.editTire.diameter;
		tiresCtrl.editedTire.dimensions = tiresCtrl.editTire.width+'/'+tiresCtrl.editTire.height+'R'+tiresCtrl.editTire.diameter;
		tiresCtrl.editedTire.description = tiresCtrl.editTire.description;
		tiresCtrl.editedTire.price = tiresCtrl.editTire.price;
		tiresCtrl.editedTire.countries = tiresCtrl.editTire.countries;
		tiresCtrl.editedTire.inStock = tiresCtrl.editTire.inStock;



		if (tiresCtrl.editTire.imagesRemoved) {
			tiresCtrl.editedTire.images = [];

			for (var i = tiresCtrl.editTire.images.length - 1; i >= 0; i--) {
				tiresCtrl.editTire.images[i]

    			var pointer = {
					__type: "Pointer",
					className: "Images",
					objectId: tiresCtrl.editTire.images[i].objectId
				};

				tiresCtrl.editedTire.images.unshift(pointer);
			};

		};


    	if (tiresCtrl.editTire.newMainImage) {

    		// Saving main image
	    	$http({
	    		method : 'POST', 
				headers: mPostImageHeaderJson,
				data: tiresCtrl.editTire.newMainImage,
	    		url : apiUrl+'/files/file'

	    		}).success(function(data){

	    			tiresCtrl.editedTire.mainImage = {
						'name': data.name,
					    '__type': 'File',
					    'url': data.url
					};

	    			// Updating tire
	    			$http({
			    		method : 'PUT', 
						headers: mPostPutHeaderJson,
						data: tiresCtrl.editedTire,
			    		url : apiUrl+'/classes/Tires/'+tiresCtrl.editTire.objectId

			    		}).success(function(data){

			    			if (tiresCtrl.editTire.imagesFiles) {
								for (var i = tiresCtrl.editTire.imagesFiles.length - 1; i >= 0; i--) {
									tiresCtrl.uploadImage(tiresCtrl.editTire.imagesFiles[i], tiresCtrl.editTire.objectId);
								};
							};

							// Update Tires
							CurrentData.getTires(start, number, sort, rin, width, height, make, model).then(function(response){
								tiresCtrl.tires = response.data.results;
								tiresCtrl.editingTire = false;
    							$('#edit-tire-modal').modal('hide');
							});

			    		});

				});

		}else{

		    // Updating tires
			$http({
	    		method : 'PUT', 
				headers: mPostPutHeaderJson,
				data: tiresCtrl.editedTire,
	    		url : apiUrl+'/classes/Tires/'+tiresCtrl.editTire.objectId

	    		}).success(function(data){

	    			if (tiresCtrl.editTire.imagesFiles) {
						for (var i = tiresCtrl.editTire.imagesFiles.length - 1; i >= 0; i--) {
							tiresCtrl.uploadImage(tiresCtrl.editTire.imagesFiles[i], tiresCtrl.editTire.objectId);
						};
					};

					// Update tires
					CurrentData.getTires(start, number, sort, rin, width, height, make, model).then(function(response){
						tiresCtrl.tires = response.data.results;
						tiresCtrl.editingTire = false;
						$('#edit-tire-modal').modal('hide');
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

						// Adding image pointer to tire	
						$http({
				    		method : 'PUT', 
							headers: mPostPutHeaderJson,
							data: addedImage,
				    		url : apiUrl+'/classes/Tires/'+objectId

				    		}).success(function(data){});


		    		});

    		});

	};



	this.deleteImage = function(image){

		tiresCtrl.editTire.images.removeJson('objectId', image.objectId);
		tiresCtrl.editTire.imagesRemoved = true;

	};



	$('#add-new-tire-modal').on('hidden.bs.modal', function () {

		angular.element($('#tires')).scope().tiresCtrl.clearNew();
		angular.element($('#tires')).scope().$apply();
	});

	this.clearNew = function(){
		tiresCtrl.newTire = {};
	};

	this.onCountrySelected = function(tire){

		if(!tire.countries) tire.countries = [];

		var countryFee = {}
		countryFee.country = tiresCtrl.country;
		countryFee.fee = 0;
		tire.countries.push(countryFee);
		tiresCtrl.country = null;

	};

	this.removeCountry = function(tire, country){
		tire.countries.removeJson('country', country);
	}



}]);