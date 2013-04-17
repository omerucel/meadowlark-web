var app = angular.module('meadowlark', ['ngResource', 'meadowlarkServices'])
    .config(['$routeProvider', function($routeProvider){
        $routeProvider
            .when('/', {
                templateUrl: 'partials/homepage.html',
                controller: HomepageController
            })
            .when('/welcome', {
                templateUrl: 'partials/welcome.html',
                controller: WelcomeController
            })
            .when('/login', {
                templateUrl: 'partials/login.html',
                controller: LoginController
            })
            .when('/register', {
                templateUrl: 'partials/register.html',
                controller: RegisterController
            })
            .when('/logout', {
                templateUrl: 'partials/logout.html',
                controller: LogoutController
            })
            .otherwise({redirectTo: '/'});
    }]);

angular.module('meadowlarkServices', ['ngResource'])
    .factory('AccessTokens', function($resource){
        return $resource('/api/v1/access-tokens');
    })
    .factory('Users', function($resource){
        return $resource('/api/v1/users');
    });

function MainController($rootScope, $scope, $route, $routeParams, $location) {
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;

    // Sayfa başlığı alanı görünme bilgisini tutar.
    $scope.page_header_visibility = false;

    // Mevcut menü bilgisini tutar.
    $scope.current_menu = '';

    // Mevcut menü ise active değilse boş değer döndürür.
    $scope.isCurrentMenu = function(check){
        return $scope.current_menu == check ? 'active' : '';
    };

    // Pencere başlığını değiştirir.
    $scope.$on('setTitle', function(event, title){
        $rootScope.title = title + ' | Meadowlark';
    });

    // Sayfa başlığını değiştirir.
    $scope.$on('setPageHeader', function(event, page_header){
        $scope.page_header = page_header;
        $scope.$emit('setTitle', page_header);
    });

    $scope.$on('setPageHeaderVisibility', function(event, status){
        $scope.page_header_visibility = status;
    });

    // İlgili menüyü seçili hale getirir.
    $scope.$on('setCurrentMenu', function(event, menu){
        $scope.current_menu = menu;
    });

    $scope.$on('setCurrentUser', function(event, user){
        $scope.current_user = user;
        $scope.is_authenticated = user != null;
    });
}

function HomepageController($scope) {
    $scope.$emit('setPageHeader', 'Anasayfa');
    $scope.$emit('setCurrentMenu', 'homepage');
    $scope.$emit('setPageHeaderVisibility', false);
}

function LoginController($scope, $location, AccessTokens) {
    $scope.$emit('setPageHeader', 'Oturum Aç');
    $scope.$emit('setCurrentMenu', 'login');
    $scope.$emit('setPageHeaderVisibility', true);

    $scope.form_error_visibility = false;
    $scope.form_error = '';

    $scope.send = function(user){
        AccessTokens.save(user, function(response){
            $scope.$emit('setCurrentUser', response);
            $location.path('/');
        }, function(response){
            $scope.form_error_visibility = true;

            if (response.status == 400)
            {
                $scope.form_error = 'Lütfen formu doğru bir şekilde doldurunuz.';
            }else if(response.status == 401){
                $scope.form_error = 'Sistemde girdiğiniz bilgilere bağlı bir hesap bulunamadı.';
            }else{
                $scope.form_error = 'Oturum açma işlemi sırasında bir sorun oluştu. Lütfen bir süre sonra tekrar deneyiniz!';
            }
        });
    };
}

function RegisterController($scope, $location, Users) {
    $scope.$emit('setPageHeader', 'Kayıt Ol');
    $scope.$emit('setCurrentMenu', 'register');
    $scope.$emit('setPageHeaderVisibility', true);

    $scope.form_error_visibility = false;
    $scope.form_error = '';

    $scope.send = function(user){
        Users.save(user, function(response){
            $scope.$emit('setCurrentUser', response);
            $location.path('/welcome');
        }, function(response){
            $scope.form_error_visibility = true;
            var response_data = angular.isObject(response.data) ? response.data : {};
            var validation_errors = angular.isObject(response_data.validation_errors) ? response_data.validation_errors : {};

            if (response.status == 400)
            {
                if (angular.isArray(validation_errors.username) && validation_errors.username[0] == 'already-in-use')
                    $scope.form.username.$alreadyInUse = true;
                if (angular.isArray(validation_errors.email) && validation_errors.email[0] == 'already-in-use')
                    $scope.form.email.$alreadyInUse = true;

                $scope.form_error = 'Lütfen formu doğru bir şekilde doldurunuz.';
            }else if(response.status == 401){
                $scope.form_error = 'Sistemde girdiğiniz bilgilere bağlı bir hesap bulunamadı.';
            }else{
                $scope.form_error = 'Oturum açma işlemi sırasında bir sorun oluştu. Lütfen bir süre sonra tekrar deneyiniz!';
            }
        });
    };
}

function LogoutController($scope, $location) {
    $scope.$emit('setPageHeader', 'Oturumunuz Kapandı');
    $scope.$emit('setCurrentUser', null);
    $location.path('/login');
}

function WelcomeController($scope) {
    $scope.$emit('setPageHeader', 'Hoş geldiniz!');
    $scope.$emit('setCurrentMenu', '');
}