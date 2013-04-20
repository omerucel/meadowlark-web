'use strict';

angular.module('meadowlarkWebApp')
  .controller('LoginCtrl', function ($scope, $location, DialogBox, UserResource) {
    if (UserResource.isAuthenticated === true)
    {
      return;
    }

    $scope.$emit('setPageHeader', 'Oturum Aç', true);
    $scope.$emit('setCurrentMenu', 'login');

    $scope.formErrorVisibility = false;
    $scope.formError = '';

    $scope.send = function(user){
      var dialog = new DialogBox($scope);
      dialog.showMessage('İşlem gerçekleştiriliyor... Lütfen bekleyiniz...');

      UserResource.login(user, function(){
        dialog.hide();
        $location.path('/account');
      }, function(response){
        dialog.hide();
        $scope.formErrorVisibility = true;

        if (response.status === 400)
        {
          $scope.formError = 'Lütfen formu doğru bir şekilde doldurunuz.';
        }else if(response.status === 401){
          $scope.formError = 'Sistemde girdiğiniz bilgilere bağlı bir hesap bulunamadı.';
        }else{
          $scope.formError = 'Oturum açma işlemi sırasında bir sorun oluştu. Lütfen bir süre sonra tekrar deneyiniz!';
        }
      });
    };
  });
