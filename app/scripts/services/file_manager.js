'use strict';

angular.module('meadowlarkWebApp')
  .factory('FileManagerService', function($rootScope, $http, $compile, DialogBox){
    return function($scope, repo){
      var Service = {
        repo: repo,
        configs: {},
        selectedItems: {},
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
          var dialog = new DialogBox();
          dialog.scope.name = '';
          dialog.scope.hide = function(){
            dialog.hide();
          };
          dialog.scope.send = function(){
            console.log(dialog.scope.name);
            dialog.hide();
          };

          dialog.showTemplate('views/dialog_new_folder.html', {
            closeButton: true,
            overlayClose: false,
            width: 500
          });
        },
        select: function(item) {
          if (angular.isObject(this.selectedItems[item.id]))
          {
            delete this.selectedItems[item.id];
          }else{
            this.selectedItems[item.id] = item;
          }
        },
        inSelected: function(item) {
          return angular.isObject(this.selectedItems[item.id]);
        }
      };

      return Service;
    };
  });