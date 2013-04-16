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

function MainController($scope, $route, $routeParams, $location) {
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
}

function HomepageController($scope) {
}

function LoginController($scope) {
}

function RegisterController($scope) {
}