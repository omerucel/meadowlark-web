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
            .when('/account', {
                templateUrl: 'partials/account.html',
                controller: AccountController
            })
            .otherwise({redirectTo: '/'});
    }]);

angular.module('meadowlarkServices', ['ngResource'])
    .factory('UserResource', function($resource, $location){
        return {
            is_authenticated: false,
            data: {
                token: null,
                user: {
                    id: null,
                    email: null,
                    username: null
                }
            },
            login: function(request, successCallback, errorCallback){
                var self = this;

                $resource('/api/v1/access-tokens').save(request, function(response){
                    self.data = response;
                    self.is_authenticated = true;
                    successCallback();
                }, errorCallback);
            },
            logout: function(successCallback, errorCallback){
                $location.path('/login');
                this.is_authenticated = false;

                $resource('/api/v1/access-tokens').remove({
                    access_token: this.data.token
                }, successCallback, errorCallback);
            },
            register: function(request, successCallback, errorCallback){
                var self = this;

                $resource('/api/v1/users').save(request, function(response){
                    self.data = response;
                    self.is_authenticated = true;
                    successCallback();
                }, errorCallback);
            }
        }
        return ;
    });

function MainController($rootScope, $scope, $route, $routeParams, $location, UserResource) {
    $scope.UserResource = UserResource;
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
}

function HomepageController($scope) {
    $scope.$emit('setPageHeader', 'Anasayfa');
    $scope.$emit('setCurrentMenu', 'homepage');
    $scope.$emit('setPageHeaderVisibility', false);
}

function LoginController($scope, $location, UserResource) {
    $scope.$emit('setPageHeader', 'Oturum Aç');
    $scope.$emit('setCurrentMenu', 'login');
    $scope.$emit('setPageHeaderVisibility', true);

    $scope.form_error_visibility = false;
    $scope.form_error = '';

    $scope.send = function(user){
        UserResource.login(user, function(){
            $location.path('/account');
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

function RegisterController($scope, $location, UserResource) {
    $scope.$emit('setPageHeader', 'Kayıt Ol');
    $scope.$emit('setCurrentMenu', 'register');
    $scope.$emit('setPageHeaderVisibility', true);

    $scope.form_error_visibility = false;
    $scope.form_error = '';

    $scope.send = function(user){
        UserResource.register(user, function(){
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

function WelcomeController($scope, UserResource) {
    $scope.$emit('setPageHeader', 'Hoş geldiniz!');
    $scope.$emit('setCurrentMenu', '');
}

function AccountController($scope) {
    $scope.$emit('setPageHeader', 'Hesabım');
    $scope.$emit('setCurrentMenu', 'account');
}