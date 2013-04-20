'use strict';

angular.module('meadowlarkWebApp')
	.controller('ProductionFileManagerCtrl', function ($scope, FileManagerService) {
		$scope.FileManager = new FileManagerService($scope, 'production');
	});
