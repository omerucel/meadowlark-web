'use strict';

angular.module('meadowlarkWebApp')
  .controller('HomepageCtrl', function ($scope) {
    $scope.$emit('setPageHeader', 'Anasayfa', false);
    $scope.$emit('setCurrentMenu', 'homepage');
  });