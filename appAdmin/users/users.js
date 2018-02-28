'use strict';

angular.module('exportatucarroAdmin.users', ['ngRoute', 'service.module'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/admin/usuarios', {
    templateUrl: 'appAdmin/users/users.html',
    controller: 'UsersCtrl',
    controllerAs : 'usersCtrl'
  })
}])


.controller('UsersCtrl', ['$http', '$rootScope', '$routeParams', '$scope','$location', '$route', 'CurrentData', function($http, $rootScope, $routeParams, $scope, $location, $route, CurrentData) {
	var usersCtrl = this;
	var search, pagination, start, number, sort, firstName, lastName, email, phone, country;


	usersCtrl.editingUser = false;
	usersCtrl.creatingTire = false;
	usersCtrl.newTire = {};


	// Meta tags
	$rootScope.robot = mUsersRobot;
	$rootScope.pageTitle = mUsersTitle;
	$rootScope.pageDescription = mUsersPageDescription;
	$rootScope.url = $location.absUrl();


	// On controller loaded
    $scope.$on('$viewContentLoaded', function() {
		
	});

    // On controller destroy
   	$scope.$on("$destroy", function(){


	});

	// Countries
	usersCtrl.countries = mCountries;


	this.callServer = function(tableState){

		pagination = tableState.pagination;
	    start = pagination.start || 0;  
	    number = pagination.number || 30; 

	    if (tableState.search.predicateObject) {
	    	search = tableState.search.predicateObject;

		    if (search.firstName) {
		    	firstName = search.firstName.toLowerCase();
		    }else{
		    	firstName = null;
		    }
		    if (search.lastName) {
		    	lastName = search.lastName.toLowerCase();
		    }else{
		    	lastName = null;
		    }
		   	if (search.email) {
		    	email = search.email.toLowerCase();
		    }else{
		    	email = null;
		    }
		    if (search.phone) {
		    	phone = search.phone.toLowerCase();
		    }else{
		    	phone = null;
		    }
		   	if (search.country) {
		    	country = search.country.toLowerCase();
		    }else{
		    	country = null;
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

	   	CurrentData.getUsers(start, number, sort, firstName, lastName, email, phone, country).then(function(response){
			usersCtrl.users = response.data.results;
			tableState.pagination.numberOfPages = Math.ceil(response.data.results.count/pagination.number);

		});

	};


	this.openEdit = function(row){

		CurrentData.getUser(row.objectId).then(function(response){
			usersCtrl.editUser = response.data;

			// Show edit user modal
			$('#edit-user-modal').modal('show');

		});
	};


	this.openAddNew = function(){

		// Show add new user modal
		$('#add-new-user-modal').modal('show');

	};



	this.submitNew = function(){

		usersCtrl.newCreatedTire = {};


		usersCtrl.creatingTire = true;

		usersCtrl.newCreatedTire.category = 'tires';

		usersCtrl.newCreatedTire.active = usersCtrl.newTire.active;
		usersCtrl.newCreatedTire.make = usersCtrl.newTire.make.toLowerCase();
		usersCtrl.newCreatedTire.model = usersCtrl.newTire.model.toLowerCase();
		usersCtrl.newCreatedTire.type = usersCtrl.newTire.type.toLowerCase();
		usersCtrl.newCreatedTire.width = usersCtrl.newTire.width;
		usersCtrl.newCreatedTire.height = usersCtrl.newTire.height;
		usersCtrl.newCreatedTire.diameter = usersCtrl.newTire.diameter;
		usersCtrl.newCreatedTire.rin = 'r'+usersCtrl.newTire.diameter;
		usersCtrl.newCreatedTire.dimensions = usersCtrl.newTire.width+'/'+usersCtrl.newTire.height+'R'+usersCtrl.newTire.diameter;
		usersCtrl.newCreatedTire.description = usersCtrl.newTire.description;
		usersCtrl.newCreatedTire.price = usersCtrl.newTire.price;


    	// Saving main image
    	$http({
    		method : 'POST', 
			headers: mPostImageHeaderJson,
			data: usersCtrl.newTire.newMainImage,
    		url : apiUrl+'/files/file'

    		}).success(function(data){

				usersCtrl.newCreatedTire.mainImage = {
					'name': data.name,
				    '__type': 'File',
				    'url': data.url
				};


				// Creating tire
				$http({
		    		method : 'POST', 
					headers: mPostPutHeaderJson,
					data: usersCtrl.newCreatedTire,
		    		url : apiUrl+'/classes/Tires/'

		    		}).success(function(data){

		    			usersCtrl.newCreatedTire.objectId = data.objectId;

	    				if (usersCtrl.newTire.imagesFiles) {
							for (var i = usersCtrl.newTire.imagesFiles.length - 1; i >= 0; i--) {
								usersCtrl.uploadImage(usersCtrl.newTire.imagesFiles[i], usersCtrl.newCreatedTire.objectId);
							};
						};

						// Update users
						CurrentData.getUsers(start, number, sort, firstName, lastName, email, phone, country).then(function(response){
							usersCtrl.users = response.data.results;
							usersCtrl.creatingTire = false;
							$('#add-new-tire-modal').modal('hide');
						});

		    		});
    		});

	};



	this.submitEdit = function(){
		usersCtrl.editedUser = {};

		usersCtrl.editingUser = true;

		usersCtrl.editedUser.firstName = usersCtrl.editUser.firstName.toLowerCase();
		usersCtrl.editedUser.lastName = usersCtrl.editUser.lastName.toLowerCase();
		usersCtrl.editedUser.email = usersCtrl.editUser.email.toLowerCase();
		usersCtrl.editedUser.username = usersCtrl.editUser.email.toLowerCase();
		usersCtrl.editedUser.phone = usersCtrl.editUser.phone.toLowerCase();
		usersCtrl.editedUser.country = usersCtrl.editUser.country.toLowerCase();


	    // Updating user
    	$http({
    		method : 'PUT', 
			headers: mUpdateUserHeaderJson,
			data: usersCtrl.editedUser,
    		url : apiUrl+'/users/'+usersCtrl.editUser.objectId

    		}).success(function(response){

				// Update users
				CurrentData.getUsers(start, number, sort, firstName, lastName, email, phone, country).then(function(response){
					usersCtrl.users = response.data.results;
					usersCtrl.editingUser = false;
					$('#edit-user-modal').modal('hide');
				});

    		});

		
	};



	$('#add-new-user-modal').on('hidden.bs.modal', function () {

		angular.element($('#users')).scope().usersCtrl.clearNew();
		angular.element($('#users')).scope().$apply();
	});

	this.clearNew = function(){
		usersCtrl.newUser = {};
	};


}]);