'use strict';

angular.module('meadowlarkWebApp')
  .controller('RegisterCtrl', function ($scope, $location, DialogBox, UserResource) {
    if (UserResource.isAuthenticated === true)
    {
      return;
    }

    $scope.$emit('setPageHeader', 'Kayıt Ol', true);
    $scope.$emit('setCurrentMenu', 'register');

    $scope.formErrorVisibility = false;
    $scope.formError = '';

    $scope.send = function(user){
      var dialog = new DialogBox($scope);
      dialog.showMessage('İşlem gerçekleştiriliyor... Lütfen bekleyiniz...');

      UserResource.register(user, function(){
        dialog.hide();
        $location.path('/welcome');
      }, function(response){
        dialog.hide();
        $scope.formErrorVisibility = true;
        var responseData = angular.isObject(response.data) ? response.data : {};
        var validationErrors = angular.isObject(responseData.validationErrors) ? responseData.validationErrors : {};

        if (response.status === 400)
        {
          if (angular.isArray(validationErrors.username) && validationErrors.username[0] === 'already-in-use')
          {
            $scope.form.username.$alreadyInUse = true;
          }

          if (angular.isArray(validationErrors.email) && validationErrors.email[0] === 'already-in-use')
          {
            $scope.form.email.$alreadyInUse = true;
          }

          $scope.formError = 'Lütfen formu doğru bir şekilde doldurunuz.';
        }else if(response.status === 401){
          $scope.formError = 'Sistemde girdiğiniz bilgilere bağlı bir hesap bulunamadı.';
        }else{
          $scope.formError = 'Oturum açma işlemi sırasında bir sorun oluştu. Lütfen bir süre sonra tekrar deneyiniz!';
        }
      });
    };
  });