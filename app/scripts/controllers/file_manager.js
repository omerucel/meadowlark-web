'use strict';

angular.module('meadowlarkWebApp')
  .controller('FileManagerCtrl', function ($scope, UserResource) {
    if (UserResource.isAuthenticated === false)
    {
      return;
    }

    $scope.$emit('setPageHeader', 'Dosya Yöneticisi', true);
    $scope.$emit('setCurrentMenu', 'file-manager');
  });
