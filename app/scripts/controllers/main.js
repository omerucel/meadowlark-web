'use strict';

angular.module('meadowlarkWebApp')
  .controller('MainCtrl', function ($rootScope, $scope, $route, $routeParams, $location, UserResource) {
    $scope.UserResource = UserResource;
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;

    // Sayfa başlığı alanı görünme bilgisini tutar.
    $scope.pageHeaderVisibility = false;

    // Mevcut menü bilgisini tutar.
    $scope.currentMenu = '';

    // Mevcut menü ise active değilse boş değer döndürür.
    $scope.isCurrentMenu = function(check){
      return $scope.currentMenu === check ? 'active' : '';
    };

    // Pencere başlığını değiştirir.
    $scope.$on('setTitle', function(event, title){
      $rootScope.title = title + ' | Meadowlark';
    });

    // Sayfa başlığını değiştirir.
    $scope.$on('setPageHeader', function(event, pageHeader, pageHeaderVisibility){
      $scope.pageHeader = pageHeader;
      $scope.pageHeaderVisibility = pageHeaderVisibility;
      $scope.$emit('setTitle', pageHeader);
    });

    $scope.$on('setPageHeaderVisibility', function(event, status){
      $scope.pageHeaderVisibility = status;
    });

    // İlgili menüyü seçili hale getirir.
    $scope.$on('setCurrentMenu', function(event, menu){
      $scope.currentMenu = menu;
    });
  });