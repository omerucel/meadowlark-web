'use strict';

angular.module('meadowlarkWebApp', ['ngResource', 'ngCookies'])
  .config(['$routeProvider', function($routeProvider){
    $routeProvider
      .when('/', {
        name: 'homepage',
        templateUrl: 'views/homepage.html',
        controller: 'HomepageCtrl'
      })
      .when('/welcome', {
        name: 'welcome',
        templateUrl: 'views/welcome.html',
        controller: 'WelcomeCtrl'
      })
      .when('/login', {
        name: 'login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/register', {
        name: 'register',
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl'
      })
      .when('/account', {
        name: 'account',
        templateUrl: 'views/account.html',
        controller: 'AccountCtrl'
      })
      .when('/file-manager', {
        name: 'file-manager',
        templateUrl: 'views/file_manager.html',
        controller: 'FileManagerCtrl'
      })
      .otherwise({redirectTo: '/'});
  }])
  .run(function($rootScope, $location, UserResource, DialogBox){
    $rootScope.$on('$routeChangeStart', function(event, next){
      if (UserResource.isAuthenticated === false)
      {
        if (next.name === 'account' ||
          next.name === 'welcome' ||
          next.name === 'file-manager' ||
          next.name === 'history')
        {
          next.templateUrl = null;
          next.template = '';
          var dialog = new DialogBox($rootScope);
          dialog.showMessage('Önce oturum açmanız gerekiyor!', function(){
            $rootScope.$apply(function(){
              $location.path('/login');
            });
          });
        }
      }else{
        if (next.name === 'login' || next.name === 'register')
        {
          next.templateUrl = null;
          next.template = '';
          $location.path('/account');
        }
      }
    });
  });