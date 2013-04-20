'use strict';

angular.module('meadowlarkWebApp')
  .controller('AccountCtrl', function ($scope, UserResource) {
    if (UserResource.isAuthenticated === false)
    {
      return;
    }

    $scope.$emit('setPageHeader', 'Hesabım', true);
    $scope.$emit('setCurrentMenu', 'account');
  });
