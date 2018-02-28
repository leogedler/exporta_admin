'use strict';

angular.module('service.module', [])


/* Factories */

// Current data factory
.factory("CurrentData", ['$http', '$q', function($http, $q){

	var user = null;
	var fetchingUser = false;
	var defer = $q.defer();

	return {

		clearCurrentUser: function(){
			user = null;
			defer = null;
			defer = $q.defer();
		},

		getCurrentUser: function(){
			if (!fetchingUser) {
				if (user) {
					defer.resolve(user);
				}else{

					fetchingUser = true;
					$http(
	    				{
			    		method : 'GET', 
		    			headers: mGetHeaderJson,
		    			params: {
								'include':'wishes.images,cart'
						},
		    			url : apiUrl+'/users/'+mCurrentUser.id
			    		}).success(function(data){
			    			user = data;
			    			fetchingUser = false;
			    			defer.resolve(data);
			    		});
			 	};	
		 	};

		 	return defer.promise; 	
		},

		getAutos: function(start, number, sort, make, year, model){
			var params = {};
			params.where = {};
			params.include = 'images';
			params.order = sort;
			params.skip = start;
			params.limit = number;
			if(make){
				params.where.make = make
			};
			if(year){
				params.where.year = year
			};
			if(model){
				params.where.model = model
			};

			return $http(
				{
				method: 'GET',
				headers: mGetHeaderJson,
				params: params,
				url: apiUrl+'/classes/Autos'
				});
		},

		getBikes: function(start, number, sort, make, year, model){
			var params = {};
			params.where = {};
			params.include = 'images';
			params.order = sort;
			params.skip = start;
			params.limit = number;
			if(make){
				params.where.make = make
			};
			if(year){
				params.where.year = year
			};
			if(model){
				params.where.model = model
			};

			return $http(
				{
				method: 'GET',
				headers: mGetHeaderJson,
				params: params,
				url: apiUrl+'/classes/Bikes'
				});
		},

		getTires: function(start, number, sort, rin, width, height, make, model){
			var params = {};
			params.where = {};
			params.include = 'images';
			params.order = sort;
			params.skip = start;
			params.limit = number;
			if(make){
				params.where.make = make
			};
			if(rin){
				params.where.rin = rin
			};
			if(width){
				params.where.width = width
			};
			if(height){
				params.where.height = height
			};
			if(model){
				params.where.model = model
			};

			return $http(
				{
				method: 'GET',
				headers: mGetHeaderJson,
				params: params,
				url: apiUrl+'/classes/Tires'
				});
		},

		getUsers: function(start, number, sort, firstName, lastName, email, phone, country){
			var params = {};
			params.where = {};
			params.order = sort;
			params.skip = start;
			params.limit = number;

			if(firstName){
				params.where.firstName = firstName
			};
			if(lastName){
				params.where.lastName = lastName
			};
			if(email){
				params.where.email = email
			};
			if(phone){
				params.where.phone = phone
			};
			if(country){
				params.where.country = country
			};

			return $http(
				{
				method: 'GET',
				headers: mGetHeaderJson,
				params: params,
				url: apiUrl+'/users'
				});
		},

		getAutoDetail: function(ref){
			return $http(
					{
					method: 'GET',
					headers: mGetHeaderJson,
					params: {
						// 'where':{
						// 	'reference': ref
						// },
			         	'include':'images'
					},
					url: apiUrl+'/classes/Autos/'+ref
					});
		},

		getBikeDetail: function(ref){
			return $http(
					{
					method: 'GET',
					headers: mGetHeaderJson,
					params: {
						// 'where':{
						// 	'reference': ref
						// },
			         	'include':'images'
					},
					url: apiUrl+'/classes/Bikes/'+ref
					});
		},

		getTireDetail: function(ref){
			return $http(
					{
					method: 'GET',
					headers: mGetHeaderJson,
					params: {
						// 'where':{
						// 	'reference': ref
						// },
			         	'include':'images'
					},
					url: apiUrl+'/classes/Tires/'+ref
					});
		},

		getUser: function(ref){
			return $http(
					{
					method: 'GET',
					headers: mGetHeaderJson,
					url: apiUrl+'/users/'+ref
					});
		},

		getOrders: function(start, number, sort, objectId, userId, userFirstName, userLastName){
			var params = {};
			params.where = {};
			params.order = sort;
			params.skip = start;
			params.limit = number;
			params.include = 'items,user'

			if(objectId){
				params.where.objectId = objectId
			};
			if(userId){
				params.where.userId = userId
			};
			if(userFirstName){
				params.where.userFirstName = userFirstName
			};
			if(userLastName){
				params.where.userLastName = userLastName
			};

			return $http(
					{
					method: 'GET',
					headers: mGetHeaderJson,
					params: params,
					url: apiUrl+'/classes/Orders/'
					});
		},

		getOrder: function(ref){
			return $http(
					{
					method: 'GET',
					params: {
						'include' : 'items,user'
					},
					headers: mGetHeaderJson,
					url: apiUrl+'/classes/Orders/'+ref
					});
		},


		countUsers: function(){
			return $http(
				{
				method: 'GET',
				headers: mGetHeaderJson,
				params: {
					'count' : 1,
		         	'limit': 0
				},
				url: apiUrl+'/users/'
				});
		},
		countOrders: function(){
			return $http(
				{
				method: 'GET',
				headers: mGetHeaderJson,
				params: {
					'count' : 1,
		         	'limit': 0
				},
				url: apiUrl+'/classes/Orders/'
				});
		}

	};


}])

// Capitalize filter
.filter('capitalize', function() {
    return function(input, all) {
      return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
    }
});

// Capitalize function
function Capitalize(str){
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}


// Remove a elements fron an array
Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

// Remove a json fron an array
Array.prototype.removeJson = function(name, value){
   var array = $.map(this, function(v,i){
      return v[name] === value ? null : v;
   });
   this.length = 0; //clear original array
   this.push.apply(this, array); //push all elements except the one we want to delete
};

