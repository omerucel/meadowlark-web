'use strict';

angular.module('meadowlarkWebApp')
  .factory('UserResource', function($resource, $location, $cookieStore){
    var UserResource = {
      isAuthenticated: false,
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
          self.isAuthenticated = true;
          $cookieStore.put('data', self.data);
          successCallback();
        }, errorCallback);
      },
      logout: function(successCallback, errorCallback){
        $location.path('/login');
        this.isAuthenticated = false;
        $cookieStore.remove('data');

        $resource('/api/v1/access-tokens').remove({
          'access_token': this.data.token
        }, successCallback, errorCallback);
      },
      register: function(request, successCallback, errorCallback){
        var self = this;

        $resource('/api/v1/users').save(request, function(response){
          self.data = response;
          self.isAuthenticated = true;
          successCallback();
        }, errorCallback);
      }
    };

    var data = $cookieStore.get('data');
    if (data !== null)
    {
      UserResource.isAuthenticated = true;
      UserResource.data = data;
    }

    return UserResource;
  });