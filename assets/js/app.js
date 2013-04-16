angular.module('meadowlark', [])
    .config(['$routeProvider', function($routeProvider){
        $routeProvider
            .when('/', {
                templateUrl: 'partials/homepage.html',
                controller: HomepageController
            })
            .when('/login', {
                templateUrl: 'partials/login.html',
                controller: LoginController
            })
            .when('/register', {
                templateUrl: 'partials/register.html',
                controller: RegisterController
            })
            .otherwise({redirectTo: '/'});
    }]);

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
        $scope.$emit('changeTitle', page_header);
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

function LoginController($scope) {
    $scope.$emit('setPageHeader', 'Oturum Aç');
    $scope.$emit('setCurrentMenu', 'login');
    $scope.$emit('setPageHeaderVisibility', true);
}

function RegisterController($scope) {
    $scope.$emit('setPageHeader', 'Kayıt Ol');
    $scope.$emit('setCurrentMenu', 'register');
    $scope.$emit('setPageHeaderVisibility', true);
}