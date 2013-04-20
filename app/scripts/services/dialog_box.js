'use strict';

angular.module('meadowlarkWebApp')
  .factory('DialogBox', function($rootScope, $compile){
    return function(scope){
      var self = this;

      if (angular.isUndefined(scope))
      {
        self.scope = $rootScope.$new();
      }else{
        self.scope = scope;
      }

      self.modal = null;

      self.showTemplate = function(templateUrl, dialogOptions){
        dialogOptions.content = '';

        var template = document.createElement('div');
        template.setAttribute('ng-include', '"' + templateUrl + '"');
        var element = $compile(template)(self.scope);
        self.modal = picoModal(dialogOptions);
        self.modal.modalElem.appendChild(element[0]);
      };

      self.showMessage = function(options, closeCallback){
        self.modal = picoModal(options);
        if (angular.isFunction(closeCallback))
        {
          self.modal.onClose(closeCallback);
        }
      };

      self.hide = function(){
        if (self.modal !== null)
        {
          self.modal.close();
        }
      };

      return self;
    };
  });