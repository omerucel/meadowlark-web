angular.module('meadowlark', ['ngResource', 'ngCookies'])
    .config(['$routeProvider', function($routeProvider){
        $routeProvider
            .when('/', {
                name: 'homepage',
                templateUrl: 'partials/homepage.html',
                controller: HomepageController
            })
            .when('/welcome', {
                name: 'welcome',
                templateUrl: 'partials/welcome.html',
                controller: WelcomeController
            })
            .when('/login', {
                name: 'login',
                templateUrl: 'partials/login.html',
                controller: LoginController
            })
            .when('/register', {
                name: 'register',
                templateUrl: 'partials/register.html',
                controller: RegisterController
            })
            .when('/account', {
                name: 'account',
                templateUrl: 'partials/account.html',
                controller: AccountController
            })
            .when('/file-manager', {
                name: 'file-manager',
                templateUrl: 'partials/file_manager.html',
                controller: FileManagerController
            })
            .otherwise({redirectTo: '/'});
    }])
    .directive('btnLoading',function () {
        return function (scope, element, attrs) {
            scope.$watch(
                function () {
                    return scope.$eval(attrs.btnLoading);
                },
                function (value) {
                    if(value) {
                        element.addClass("disabled").attr("disabled","disabled");
                        element.data('resetText', element.text());
                        element.text('Lütfen bekleyiniz...');
                    } else {
                        element.text(element.data('resetText'));
                    }
                }
            );
        };
    })
    .run(function($rootScope, $location, UserResource, DialogBox){
        $rootScope.$on('$routeChangeStart', function(event, next, current){
            if (!UserResource.is_authenticated)
            {
                if (next.name == 'account' 
                    || next.name == 'welcome'
                    || next.name == 'file-manager'
                    || next.name == 'history')
                {
                    next.templateUrl = null;
                    next.template = "";
                    DialogBox($rootScope).showMessage('Önce oturum açmanız gerekiyor!', function(){
                        $rootScope.$apply(function(){
                            $location.path('/login');
                        });
                    });
                }
            }else{
                if (next.name == 'login' || next.name == 'register')
                {
                    next.templateUrl = null;
                    next.template = "";
                    $location.path('/account');
                }
            }
        });
    })
    .factory('DialogBox', function($rootScope, $compile){
        return function(scope){
            if (scope == null)
            {
                scope = $rootScope.$new();
            }else{
                scope = scope;
            }

            return {
                modal: null,
                scope: scope,
                showTemplate: function(templateUrl, dialogOptions){
                    var self = this;
                    dialogOptions.content = "";

                    var template = document.createElement('div');
                    template.setAttribute('ng-include', '"' + templateUrl + '"');
                    element = $compile(template)(self.scope);
                    self.modal = picoModal(dialogOptions);
                    self.modal.modalElem.appendChild(element.context);
                },
                showMessage: function(options, closeCallback){
                    this.modal = picoModal(options);
                    if (angular.isFunction(closeCallback))
                        this.modal.onClose(closeCallback);
                },
                hide: function(){
                    if (this.modal != null)
                        this.modal.close();
                }
            };
        };
    })
    .factory('FileManagerService', function($rootScope, $http, $compile, DialogBox){
        return function($scope, repo){
            var Service = {
                configs: {},
                selected_items: {},
                items: [
                    {
                        'id': 1,
                        'name': 'Müzikler',
                        'icon': 'icon-folder-close'
                    },
                    {
                        'id': 2,
                        'name': 'Videolar',
                        'icon': 'icon-folder-close'
                    },
                    {
                        'id': 3,
                        'name': 'Dosya1.mpg',
                        'icon': 'icon-file'
                    }
                ],
                init: function(repoConfigs){
                    angular.extends(this.configs, repoConfigs);
                    return this;
                },
                newFolder: function() {
                    var dialog = DialogBox();
                    dialog.scope.name = '';
                    dialog.scope.hide = function(){
                        dialog.hide();
                    };
                    dialog.scope.send = function(){
                        console.log(dialog.scope.name);
                        dialog.hide();
                    };

                    dialog.showTemplate('partials/dialog_new_folder.html', {
                        closeButton: true,
                        overlayClose: false,
                        width: 500
                    });
                },
                select: function(item) {
                    if (angular.isObject(this.selected_items[item.id]))
                    {
                        delete this.selected_items[item.id];
                    }else{
                        this.selected_items[item.id] = item;
                    }
                },
                inSelected: function(item) {
                    return angular.isObject(this.selected_items[item.id]);
                }
            };

            return Service;
        };
    })
    .factory('UserResource', function($resource, $location, $cookieStore){
        var UserResource = {
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
                    $cookieStore.put('data', self.data);
                    successCallback();
                }, errorCallback);
            },
            logout: function(successCallback, errorCallback){
                $location.path('/login');
                this.is_authenticated = false;
                $cookieStore.remove('data');

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
        };

        data = $cookieStore.get('data');
        if (data != null)
        {
            UserResource.is_authenticated = true;
            UserResource.data = data;
        }

        return UserResource;
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
    $scope.$on('setPageHeader', function(event, page_header, page_header_visibility){
        $scope.page_header = page_header;
        $scope.page_header_visibility = page_header_visibility;
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
    $scope.$emit('setPageHeader', 'Anasayfa', false);
    $scope.$emit('setCurrentMenu', 'homepage');
}

function LoginController($scope, $location, DialogBox, UserResource) {
    if (UserResource.is_authenticated) return;

    $scope.$emit('setPageHeader', 'Oturum Aç', true);
    $scope.$emit('setCurrentMenu', 'login');

    $scope.form_error_visibility = false;
    $scope.form_error = '';

    $scope.send = function(user){
        var dialog = DialogBox($scope);
        dialog.showMessage('İşlem gerçekleştiriliyor... Lütfen bekleyiniz...');

        UserResource.login(user, function(){
            dialog.hide();
            $location.path('/account');
        }, function(response){
            dialog.hide();
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

function RegisterController($scope, $location, DialogBox, UserResource) {
    if (UserResource.is_authenticated) return;

    $scope.$emit('setPageHeader', 'Kayıt Ol', true);
    $scope.$emit('setCurrentMenu', 'register');

    $scope.form_error_visibility = false;
    $scope.form_error = '';

    $scope.send = function(user){
        var dialog = DialogBox($scope);
        dialog.showMessage('İşlem gerçekleştiriliyor... Lütfen bekleyiniz...');

        UserResource.register(user, function(){
            dialog.hide();
            $location.path('/welcome');
        }, function(response){
            dialog.hide();
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
    if (!UserResource.is_authenticated) return;

    $scope.$emit('setPageHeader', 'Hoş geldiniz!', true);
    $scope.$emit('setCurrentMenu', '');
}

function AccountController($scope, UserResource) {
    if (!UserResource.is_authenticated) return;

    $scope.$emit('setPageHeader', 'Hesabım', true);
    $scope.$emit('setCurrentMenu', 'account');
}

function FileManagerController($scope, UserResource) {
    if (!UserResource.is_authenticated) return;

    $scope.$emit('setPageHeader', 'Dosya Yöneticisi', true);
    $scope.$emit('setCurrentMenu', 'file-manager');

    $scope.selected_items = {
        'stage': {},
        'production': {}
    }

    $scope.select = function(repo, item) {
        if (angular.isObject($scope.selected_items[repo][item.id]))
        {
            delete $scope.selected_items[repo][item.id];
        }else{
            $scope.selected_items[repo][item.id] = item;
        }
    };

    $scope.inSelected = function(repo, item) {
        return angular.isObject($scope.selected_items[repo][item.id]);
    };
}

function StageFileManagerController($scope, $rootScope, FileManagerService) {
    $scope.FileManager = FileManagerService($scope, 'stage');
}

function ProductionFileManagerController($scope, $rootScope, FileManagerService) {
    $scope.FileManager = FileManagerService($scope, 'production');
}