
(function(){

	angular.module('exportatucarroAdmin', ['ngRoute', 'ui.bootstrap','ngSanitize' ,'angular-loading-bar', 'service.module', 'ngFlash', 'smart-table', 'ngFileUpload',
		'exportatucarroAdmin.autos',
		'exportatucarroAdmin.bikes',
		'exportatucarroAdmin.tires',
		'exportatucarroAdmin.users',
		'exportatucarroAdmin.orders'
		])


	// App Routes
	.config(function($routeProvider, $locationProvider) {

		// Use the HTML5 History API
	    // $locationProvider.html5Mode(true);
		$locationProvider.hashPrefix('!');
		
		$routeProvider
			.when('/admin', {
				templateUrl : 'appAdmin/home/home.html',
				controller  : 'MainController',
				controllerAs : 'mainCtrl'
			})

			.otherwise({
		        redirectTo: '/admin'
		    });
	})

	// Run
	.run(['$rootScope','$location', '$routeParams', function($rootScope, $location, $routeParams) {
	    $rootScope.$on('$routeChangeSuccess', function(e, current, pre) {
	    	// console.log('Current route name: ' + $location.path());
	    	$rootScope.location = $location.path();

	    	// Tracking Current Location for Google Analytics 
	    	// ga('send', 'pageview', $location.path());

	    });
	}])


	// Main Controller
	.controller('MainController', ['$http','$location', '$routeParams', '$rootScope', '$scope', 'CurrentData', function($http, $location, $routeParams, $rootScope, $scope, CurrentData, algolia) {
		var mainCtrl = this;
		mainCtrl.logingUp = false;
		mainCtrl.searchResults = [];
		mainCtrl.noSearchResults = true;
		mainCtrl.autosPage = false;
		mainCtrl.dashPage = false;

		// Meta tags
		$rootScope.robot = mMainRobot;
		$rootScope.pageTitle = mMainTitle;
		$rootScope.pageDescription = mMainPageDescription;
		$rootScope.url = $location.absUrl();



		// if (mCurrentUser != null) {

		// 	CurrentData.getCurrentUser().then(function(response){
		// 		mainCtrl.user = response;

		// 	});

		// }else{

		// 	// Show login modal 
  //  			$('#login-modal').modal('show');
		// };



		CurrentData.countUsers().then(function(response){
			mainCtrl.usersCount = response.data.count;
		});

		CurrentData.countOrders().then(function(response){
			mainCtrl.ordersCount = response.data.count;
		});


		this.isUser = function(){
			if (mCurrentUser != null) {
				if (mCurrentUser.get('admin')) {
					return true;

				}else{
					Parse.User.logOut();
					mCurrentUser = Parse.User.current();
					window.location.reload();
				};
				
			}else{

				// Show login modal 
   				$('#login-modal').modal('show');

				return false;
			};
		};


		this.loging = function(){

			mainCtrl.logingUp = true;

			Parse.User.logIn(mainCtrl.loginForm.username.toLowerCase(), mainCtrl.loginForm.pass, {
			  success: function(user) {

			  	mCurrentUser = Parse.User.current();
			  	mainCtrl.logingUp = false;
			  	window.location.reload();
			  	
			  },
			  error: function(user, error) {
				// Hide loading
			  	$scope.$apply(function () {
            		mainCtrl.logingUp = false;
        		});
			  	
			    // The login failed. Check error to see why.
			    if (error.code == 101) {
			    	alert("Email o clave incorrecta, recuerda que la clave es sensible a las mayúsculas y minúsculas!!");
			    }else{
			    	alert("Error: " + error.code + " " + error.message);
			    };
			   
			  }
			});
		};



		this.logOut = function(){

			Parse.User.logOut();
			mCurrentUser = Parse.User.current();
			window.location.reload();

			// if ($location.path() == '/perfil') {

			// 	window.location.replace('http://sohamfit.com');
			// }else{
			// 	window.location.reload();

			// };
		};



		this.refreshUsers = function(){
			CurrentData.countUsers().then(function(response){
				mainCtrl.usersCount = response.data.count;
			});

		};

		this.refresOrders = function(){
			CurrentData.countOrders().then(function(response){
				mainCtrl.ordersCount = response.data.count;
			});
		};




		this.refreshUser = function(){
			CurrentData.getCurrentUser().then(function(response){
	    		mainCtrl.user = response;
	    	});
		};


		this.search = function(){

			$('#search-input-header').blur()	
			// console.log(mainCtrl.searchResults);
			$location.url('/busqueda?search='+mainCtrl.searchWords);

		};



	}])


})();